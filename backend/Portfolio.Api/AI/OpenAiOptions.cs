namespace Portfolio.Api.AI;

/// <summary>
/// Configuration for OpenAI's Chat Completions API, used as a fallback provider when Grok
/// fails (no credits, outage, etc.) - see IChatService/ChatService. Bound from the "OpenAi"
/// section of appsettings.json / OPENAI_API_KEY.
/// </summary>
public class OpenAiOptions
{
    public const string SectionName = "OpenAi";

    /// <summary>Set via the OPENAI_API_KEY environment variable — never commit this.</summary>
    public string ApiKey { get; set; } = string.Empty;

    public string BaseUrl { get; set; } = "https://api.openai.com/v1";

    /// <summary>Confirmed live against a real account: authenticates and reaches the
    /// billing/quota gate (rejected there for lack of credits, not a bad model id).</summary>
    public string Model { get; set; } = "gpt-4o-mini";
}
