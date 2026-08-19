using Portfolio.Api.Models;

namespace Portfolio.Api.RAG;

/// <summary>
/// TODO (Phase 3 - RAG): thin wrapper around the Qdrant client for the "portfolio_resume"
/// collection — create collection, upsert embedded chunks, run similarity search. Left
/// unimplemented during scaffolding; requires QDRANT_URL and a running Qdrant instance.
/// </summary>
public class VectorStore(ILogger<VectorStore> logger)
{
    public const string CollectionName = "portfolio_resume";

    public Task EnsureCollectionAsync(int vectorSize, CancellationToken cancellationToken = default)
    {
        logger.LogWarning("VectorStore.EnsureCollectionAsync is not implemented yet (Phase 3).");
        throw new NotImplementedException("Qdrant collection setup will be implemented in Phase 3 (RAG).");
    }

    public Task UpsertAsync(IEnumerable<(float[] Vector, string Text, ChunkMetadata Metadata)> chunks, CancellationToken cancellationToken = default)
    {
        logger.LogWarning("VectorStore.UpsertAsync is not implemented yet (Phase 3).");
        throw new NotImplementedException("Qdrant upsert will be implemented in Phase 3 (RAG).");
    }

    public Task<IReadOnlyList<RetrievedChunk>> SearchAsync(float[] queryVector, int topK, CancellationToken cancellationToken = default)
    {
        logger.LogWarning("VectorStore.SearchAsync is not implemented yet (Phase 3).");
        return Task.FromResult<IReadOnlyList<RetrievedChunk>>([]);
    }
}
