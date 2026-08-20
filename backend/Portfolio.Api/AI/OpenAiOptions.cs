namespace Portfolio.Api.AI;

/// <summary>
/// Configuration for OpenAI's API - used both as the fallback chat provider when Grok fails
/// (see ChatService) and as the embeddings provider for RAG (see EmbeddingService). Bound
/// from the "OpenAi" section of appsettings.json / OPENAI_API_KEY.
/// </summary>
public class OpenAiOptions
{
    public const string SectionName = "OpenAi";

    /// <summary>Set via the OPENAI_API_KEY environment variable — never commit this.</summary>
    public string ApiKey { get; set; } = string.Empty;

    public string BaseUrl { get; set; } = "https://api.openai.com/v1";

    /// <summary>Chat model. Confirmed live against a real account: authenticates and reaches
    /// the billing/quota gate (rejected there for lack of credits, not a bad model id).</summary>
    public string Model { get; set; } = "gpt-4o-mini";

    /// <summary>Embeddings model, used by EmbeddingService. Confirmed live the same way as
    /// Model above (POST /v1/embeddings authenticates, 429 insufficient_quota not 401/404).
    /// xAI's own /v1/embeddings route exists but GET /v1/models lists no embedding-capable
    /// model for this account, so embeddings go through OpenAI regardless of which provider
    /// answers chat.</summary>
    public string EmbeddingModel { get; set; } = "text-embedding-3-small";
}
