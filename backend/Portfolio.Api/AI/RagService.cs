using Portfolio.Api.Models;

namespace Portfolio.Api.AI;

/// <summary>
/// TODO (Phase 3 - RAG): query Qdrant's "portfolio_resume" collection using the embedded
/// question and return the top-K matching chunks. Left unimplemented during scaffolding.
/// </summary>
public class RagService(IEmbeddingService embeddingService, ILogger<RagService> logger) : IRagService
{
    public Task<IReadOnlyList<RetrievedChunk>> SearchAsync(string question, int topK = 5, CancellationToken cancellationToken = default)
    {
        logger.LogWarning("RagService.SearchAsync is not implemented yet (Phase 3).");
        return Task.FromResult<IReadOnlyList<RetrievedChunk>>([]);
    }
}
