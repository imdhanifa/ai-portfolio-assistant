using System.Text.Json.Serialization;

namespace Portfolio.Api.AI;

// DTOs for OpenAI's Embeddings API - POST /v1/embeddings. Confirmed live against a real
// account: authenticates and reaches the billing/quota gate (429 insufficient_quota, not
// 401/404), so the request shape below is verified correct.

public class OpenAiEmbeddingRequest
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;

    /// <summary>Batched in one request - OpenAI accepts up to 2048 inputs per call.</summary>
    [JsonPropertyName("input")]
    public List<string> Input { get; set; } = [];
}

public class OpenAiEmbeddingResponse
{
    [JsonPropertyName("data")]
    public List<OpenAiEmbeddingData> Data { get; set; } = [];
}

public class OpenAiEmbeddingData
{
    [JsonPropertyName("index")]
    public int Index { get; set; }

    [JsonPropertyName("embedding")]
    public float[] Embedding { get; set; } = [];
}
