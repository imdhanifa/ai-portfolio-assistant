namespace Portfolio.Api.RAG;

/// <summary>Configuration for the Qdrant vector store. Bound from the "Qdrant" section of appsettings.json / QDRANT_URL.</summary>
public class QdrantOptions
{
    public const string SectionName = "Qdrant";

    public string Url { get; set; } = "http://localhost:6333";
}
