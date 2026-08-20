using Microsoft.Extensions.Options;
using Portfolio.Api.MCP;
using Portfolio.Api.Models;
using Portfolio.Api.RAG;

namespace Portfolio.Api.AI;

/// <summary>
/// Retrieves relevant resume chunks from Qdrant for a given user question. Lazily ingests
/// the resume (chunk -> embed -> upsert) on first use if the "portfolio_resume" collection
/// doesn't exist yet or is empty, then embeds the question and queries Qdrant for the
/// closest chunks.
/// </summary>
public class RagService(
    IEmbeddingService embeddingService,
    VectorStore vectorStore,
    ResumeLoader resumeLoader,
    DocumentChunker chunker,
    IOptions<PortfolioDataOptions> dataOptions,
    ILogger<RagService> logger) : IRagService
{
    private readonly SemaphoreSlim _ingestLock = new(1, 1);
    private bool _ingested;

    public async Task<IReadOnlyList<RetrievedChunk>> SearchAsync(string question, int topK = 5, CancellationToken cancellationToken = default)
    {
        try
        {
            await EnsureIngestedAsync(cancellationToken);

            var queryVector = await embeddingService.EmbedAsync(question, cancellationToken);
            return await vectorStore.SearchAsync(queryVector, topK, cancellationToken);
        }
        catch (Exception ex)
        {
            // RAG is one input among several (see ChatService) - never let it take the whole
            // chat request down. Log and return nothing; MCP/placeholder fallback still applies.
            logger.LogWarning(ex, "RAG search failed; continuing without resume context.");
            return [];
        }
    }

    private async Task EnsureIngestedAsync(CancellationToken cancellationToken)
    {
        if (_ingested)
        {
            return;
        }

        await _ingestLock.WaitAsync(cancellationToken);
        try
        {
            if (_ingested)
            {
                return;
            }

            var existingCount = await vectorStore.GetPointCountAsync(cancellationToken);
            if (existingCount is > 0)
            {
                _ingested = true;
                return;
            }

            await IngestResumeAsync(cancellationToken);
            _ingested = true;
        }
        finally
        {
            _ingestLock.Release();
        }
    }

    private async Task IngestResumeAsync(CancellationToken cancellationToken)
    {
        var resumePath = Path.Combine(dataOptions.Value.DataDirectory, "resume.pdf");
        logger.LogInformation("Ingesting resume from {ResumePath} into Qdrant.", resumePath);

        var text = await resumeLoader.ExtractTextAsync(resumePath, cancellationToken);
        var chunks = chunker.Chunk(text);

        if (chunks.Count == 0)
        {
            logger.LogWarning("Resume produced no chunks; nothing to ingest.");
            return;
        }

        var vectors = await embeddingService.EmbedBatchAsync(chunks.Select(c => c.Text), cancellationToken);

        // Vector size comes from whatever the embedding provider actually returns, rather
        // than a hardcoded guess (e.g. text-embedding-3-small's documented 1536) - avoids any
        // risk of that guess drifting from reality and Qdrant rejecting the upsert outright.
        var vectorSize = vectors[0].Length;
        await vectorStore.EnsureCollectionAsync(vectorSize, cancellationToken);

        var points = chunks
            .Zip(vectors, (chunk, vector) => (
                Vector: vector,
                Text: chunk.Text,
                Metadata: new ChunkMetadata { Source = "resume.pdf", ChunkIndex = chunk.ChunkIndex }))
            .ToList();

        await vectorStore.UpsertAsync(points, cancellationToken);
        logger.LogInformation("Ingested {ChunkCount} resume chunks ({VectorSize}-dim) into Qdrant.", chunks.Count, vectorSize);
    }
}
