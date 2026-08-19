namespace Portfolio.Api.AI;

/// <summary>
/// Generates vector embeddings for text, used both when ingesting the resume
/// into Qdrant and when embedding an incoming user question for similarity search.
/// </summary>
public interface IEmbeddingService
{
    /// <summary>Generate an embedding vector for a single piece of text.</summary>
    Task<float[]> EmbedAsync(string text, CancellationToken cancellationToken = default);

    /// <summary>Generate embedding vectors for a batch of texts (e.g. document chunks).</summary>
    Task<IReadOnlyList<float[]>> EmbedBatchAsync(IEnumerable<string> texts, CancellationToken cancellationToken = default);
}
