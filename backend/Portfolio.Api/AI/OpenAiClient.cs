using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.Options;

namespace Portfolio.Api.AI;

/// <summary>
/// Calls OpenAI's Chat Completions API (POST /v1/chat/completions) as a fallback when Grok
/// is unavailable - see ChatService.
/// </summary>
public class OpenAiClient(IHttpClientFactory httpClientFactory, IOptions<OpenAiOptions> options, ILogger<OpenAiClient> logger) : IOpenAiClient
{
    public async Task<string> CompleteAsync(string systemPrompt, string userPrompt, CancellationToken cancellationToken = default)
    {
        var config = options.Value;

        if (string.IsNullOrWhiteSpace(config.ApiKey))
        {
            throw new OpenAiApiException("OPENAI_API_KEY is not configured.");
        }

        var client = httpClientFactory.CreateClient();
        client.BaseAddress = new Uri(config.BaseUrl.TrimEnd('/') + "/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", config.ApiKey);

        var request = new OpenAiChatRequest
        {
            Model = config.Model,
            Messages =
            [
                new OpenAiChatMessage { Role = "system", Content = systemPrompt },
                new OpenAiChatMessage { Role = "user", Content = userPrompt },
            ],
        };

        HttpResponseMessage response;
        try
        {
            response = await client.PostAsJsonAsync("chat/completions", request, cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Failed to reach the OpenAI API.");
            throw new OpenAiApiException("Failed to reach the OpenAI API.", ex);
        }

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogError("OpenAI API returned {StatusCode}: {Body}", response.StatusCode, body);
            throw new OpenAiApiException($"OpenAI API returned {(int)response.StatusCode} {response.StatusCode}.");
        }

        var payload = await response.Content.ReadFromJsonAsync<OpenAiChatResponse>(cancellationToken: cancellationToken);
        var answer = payload?.Choices.FirstOrDefault()?.Message.Content;

        if (string.IsNullOrWhiteSpace(answer))
        {
            throw new OpenAiApiException("OpenAI API returned an empty response.");
        }

        return answer;
    }
}
