using Microsoft.Extensions.Options;

namespace Portfolio.Api.AI;

/// <summary>
/// TODO (Phase 4 - Grok): call the xAI chat completions endpoint (OpenAI-compatible
/// /v1/chat/completions) with the system + user prompt and return the model's answer.
/// Left unimplemented during scaffolding; requires XAI_API_KEY.
/// </summary>
public class GrokClient(IHttpClientFactory httpClientFactory, IOptions<GrokOptions> options, ILogger<GrokClient> logger) : IGrokClient
{
    public Task<string> CompleteAsync(string systemPrompt, string userPrompt, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(options.Value.ApiKey))
        {
            logger.LogWarning("XAI_API_KEY is not configured; GrokClient cannot call the Grok API yet (Phase 4).");
        }

        throw new NotImplementedException("Grok API integration will be implemented in Phase 4.");
    }
}
