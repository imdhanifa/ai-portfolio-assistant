namespace Portfolio.Api.AI;

/// <summary>
/// TODO (Phase 3 - RAG): call an embeddings endpoint (e.g. xAI/Grok embeddings, or another
/// embedding provider) to turn text into vectors. Left unimplemented during scaffolding.
/// </summary>
public class EmbeddingService(IHttpClientFactory httpClientFactory, ILogger<EmbeddingService> logger) : IEmbeddingService
{
    public Task<float[]> EmbedAsync(string text, CancellationToken cancellationToken = default)
    {
        logger.LogWarning("EmbeddingService.EmbedAsync is not implemented yet (Phase 3).");
        throw new NotImplementedException("Embedding generation will be implemented in Phase 3 (RAG).");
    }

    public Task<IReadOnlyList<float[]>> EmbedBatchAsync(IEnumerable<string> texts, CancellationToken cancellationToken = default)
    {
        logger.LogWarning("EmbeddingService.EmbedBatchAsync is not implemented yet (Phase 3).");
        throw new NotImplementedException("Embedding generation will be implemented in Phase 3 (RAG).");
    }
}
