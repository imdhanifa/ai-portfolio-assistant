using System.Text.Json.Serialization;

namespace Portfolio.Api.AI;

// DTOs for OpenAI's Chat Completions API - POST /v1/chat/completions.
// Confirmed live against a real account: a request in this shape authenticates and is
// billing-gated (429 insufficient_quota for an account with no credits), not
// 401/format-rejected.

public class OpenAiChatMessage
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

public class OpenAiChatRequest
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;

    [JsonPropertyName("messages")]
    public List<OpenAiChatMessage> Messages { get; set; } = [];

    [JsonPropertyName("temperature")]
    public double Temperature { get; set; } = 0.3;
}

public class OpenAiChatResponse
{
    [JsonPropertyName("choices")]
    public List<OpenAiChatChoice> Choices { get; set; } = [];
}

public class OpenAiChatChoice
{
    [JsonPropertyName("message")]
    public OpenAiChatMessage Message { get; set; } = new();
}

/// <summary>Thrown when the OpenAI API call fails (auth, quota, network, unexpected response shape).</summary>
public class OpenAiApiException(string message, Exception? inner = null) : Exception(message, inner);
