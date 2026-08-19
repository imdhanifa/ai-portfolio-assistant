namespace Portfolio.Api.AI;

/// <summary>Configuration for the xAI Grok API. Bound from the "Grok" section of appsettings.json / env vars.</summary>
public class GrokOptions
{
    public const string SectionName = "Grok";

    /// <summary>Set via the XAI_API_KEY environment variable — never commit this.</summary>
    public string ApiKey { get; set; } = string.Empty;

    public string BaseUrl { get; set; } = "https://api.x.ai/v1";

    /// <summary>TODO: set to the current xAI model id (check https://docs.x.ai for the latest name).</summary>
    public string Model { get; set; } = "grok-beta";
}
