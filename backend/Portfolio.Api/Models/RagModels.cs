namespace Portfolio.Api.Models;

/// <summary>
/// A single chunk of source text retrieved from the vector store, with its similarity score.
/// </summary>
public class RetrievedChunk
{
    public string Text { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string? Section { get; set; }
    public int ChunkIndex { get; set; }
    public float Score { get; set; }
}

/// <summary>
/// Metadata stored alongside each embedded chunk in Qdrant.
/// </summary>
public class ChunkMetadata
{
    public string Source { get; set; } = "resume.pdf";
    public string? Section { get; set; }
    public int ChunkIndex { get; set; }
}
