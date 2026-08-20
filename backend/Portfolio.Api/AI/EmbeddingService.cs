using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.Options;

namespace Portfolio.Api.AI;

/// <summary>
/// Generates embeddings via OpenAI's Embeddings API (POST /v1/embeddings). Grok/xAI answers
/// chat, but has no embedding-capable model on this account (checked live: GET
/// https://api.x.ai/v1/models lists none, though POST /v1/embeddings itself does exist as a
/// route) - so RAG embeddings go through OpenAI regardless of which provider answers a given
/// chat request.
/// </summary>
public class EmbeddingService(IHttpClientFactory httpClientFactory, IOptions<OpenAiOptions> options, ILogger<EmbeddingService> logger) : IEmbeddingService
{
    // OpenAI allows up to 2048 inputs per request; batching in smaller chunks means even a
    // very large resume (many chunks) never risks that ceiling in a single call.
    private const int MaxBatchSize = 100;

    public async Task<float[]> EmbedAsync(string text, CancellationToken cancellationToken = default)
    {
        var results = await EmbedBatchAsync([text], cancellationToken);
        return results[0];
    }

    public async Task<IReadOnlyList<float[]>> EmbedBatchAsync(IEnumerable<string> texts, CancellationToken cancellationToken = default)
    {
        var config = options.Value;
        if (string.IsNullOrWhiteSpace(config.ApiKey))
        {
            throw new OpenAiApiException("OPENAI_API_KEY is not configured.");
        }

        var textList = texts as IReadOnlyList<string> ?? texts.ToList();
        if (textList.Count == 0)
        {
            return [];
        }

        var client = httpClientFactory.CreateClient();
        client.BaseAddress = new Uri(config.BaseUrl.TrimEnd('/') + "/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", config.ApiKey);

        var results = new float[textList.Count][];

        for (var offset = 0; offset < textList.Count; offset += MaxBatchSize)
        {
            var batch = textList.Skip(offset).Take(MaxBatchSize).ToList();
            var request = new OpenAiEmbeddingRequest { Model = config.EmbeddingModel, Input = batch };

            HttpResponseMessage response;
            try
            {
                response = await client.PostAsJsonAsync("embeddings", request, cancellationToken);
            }
            catch (HttpRequestException ex)
            {
                logger.LogError(ex, "Failed to reach the OpenAI embeddings API.");
                throw new OpenAiApiException("Failed to reach the OpenAI embeddings API.", ex);
            }

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(cancellationToken);
                logger.LogError("OpenAI embeddings API returned {StatusCode}: {Body}", response.StatusCode, body);
                throw new OpenAiApiException($"OpenAI embeddings API returned {(int)response.StatusCode} {response.StatusCode}.");
            }

            var payload = await response.Content.ReadFromJsonAsync<OpenAiEmbeddingResponse>(cancellationToken: cancellationToken);
            if (payload is null || payload.Data.Count != batch.Count)
            {
                throw new OpenAiApiException("OpenAI embeddings API returned an unexpected number of results.");
            }

            foreach (var item in payload.Data)
            {
                results[offset + item.Index] = item.Embedding;
            }
        }

        return results!;
    }
}
