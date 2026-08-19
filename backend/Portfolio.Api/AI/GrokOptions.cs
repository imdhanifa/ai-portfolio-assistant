namespace Portfolio.Api.AI;

/// <summary>Configuration for the xAI Grok API. Bound from the "Grok" section of appsettings.json / env vars.</summary>
public class GrokOptions
{
    public const string SectionName = "Grok";

    /// <summary>Set via the XAI_API_KEY environment variable — never commit this.</summary>
    public string ApiKey { get; set; } = string.Empty;

    public string BaseUrl { get; set; } = "https://api.x.ai/v1";

    /// <summary>
    /// TODO: confirm against GET https://api.x.ai/v1/models (requires an account with
    /// credits) or https://docs.x.ai/docs/models, then override via appsettings/env if
    /// this default is stale. "grok-beta" is retired; "grok-4-fast" is this scaffold's
    /// best-effort guess as of 2026-08 and has NOT been verified against a live account.
    /// </summary>
    public string Model { get; set; } = "grok-4-fast";
}
