using Portfolio.Api.Models;

namespace Portfolio.Api.AI;

/// <summary>
/// Retrieves relevant resume chunks from Qdrant for a given user question.
/// </summary>
public interface IRagService
{
    /// <summary>
    /// Embed the question and run a similarity search against the resume collection,
    /// returning the top matching chunks.
    /// </summary>
    Task<IReadOnlyList<RetrievedChunk>> SearchAsync(string question, int topK = 5, CancellationToken cancellationToken = default);
}
