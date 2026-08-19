using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.Options;

namespace Portfolio.Api.AI;

/// <summary>
/// Calls the xAI Grok chat completions endpoint (OpenAI-compatible /v1/chat/completions).
/// </summary>
public class GrokClient(IHttpClientFactory httpClientFactory, IOptions<GrokOptions> options, ILogger<GrokClient> logger) : IGrokClient
{
    public async Task<string> CompleteAsync(string systemPrompt, string userPrompt, CancellationToken cancellationToken = default)
    {
        var config = options.Value;

        if (string.IsNullOrWhiteSpace(config.ApiKey))
        {
            throw new GrokApiException("XAI_API_KEY is not configured.");
        }

        var client = httpClientFactory.CreateClient();
        client.BaseAddress = new Uri(config.BaseUrl.TrimEnd('/') + "/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", config.ApiKey);

        var request = new GrokChatRequest
        {
            Model = config.Model,
            Messages =
            [
                new GrokChatMessage { Role = "system", Content = systemPrompt },
                new GrokChatMessage { Role = "user", Content = userPrompt },
            ],
        };

        HttpResponseMessage response;
        try
        {
            response = await client.PostAsJsonAsync("chat/completions", request, cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Failed to reach the Grok API.");
            throw new GrokApiException("Failed to reach the Grok API.", ex);
        }

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogError("Grok API returned {StatusCode}: {Body}", response.StatusCode, body);
            throw new GrokApiException($"Grok API returned {(int)response.StatusCode} {response.StatusCode}.");
        }

        var payload = await response.Content.ReadFromJsonAsync<GrokChatResponse>(cancellationToken: cancellationToken);
        var answer = payload?.Choices.FirstOrDefault()?.Message.Content;

        if (string.IsNullOrWhiteSpace(answer))
        {
            throw new GrokApiException("Grok API returned an empty response.");
        }

        return answer;
    }
}
