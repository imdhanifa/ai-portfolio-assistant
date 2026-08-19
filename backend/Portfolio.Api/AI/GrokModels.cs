using System.Text.Json.Serialization;

namespace Portfolio.Api.AI;

// DTOs for xAI's OpenAI-compatible /v1/chat/completions endpoint.
// https://docs.x.ai/docs/api-reference

public class GrokChatMessage
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

public class GrokChatRequest
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;

    [JsonPropertyName("messages")]
    public List<GrokChatMessage> Messages { get; set; } = [];

    [JsonPropertyName("temperature")]
    public double Temperature { get; set; } = 0.3;
}

public class GrokChatResponse
{
    [JsonPropertyName("choices")]
    public List<GrokChatChoice> Choices { get; set; } = [];
}

public class GrokChatChoice
{
    [JsonPropertyName("message")]
    public GrokChatMessage Message { get; set; } = new();
}

/// <summary>Thrown when the Grok API call fails (auth, quota, network, unexpected response shape).</summary>
public class GrokApiException(string message, Exception? inner = null) : Exception(message, inner);
