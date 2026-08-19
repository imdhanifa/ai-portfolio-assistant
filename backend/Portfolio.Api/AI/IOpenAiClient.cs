namespace Portfolio.Api.AI;

/// <summary>
/// Fallback LLM client used when Grok fails. Same contract as IGrokClient so ChatService
/// can try one, then the other, with identical calling code.
/// </summary>
public interface IOpenAiClient
{
    Task<string> CompleteAsync(string systemPrompt, string userPrompt, CancellationToken cancellationToken = default);
}
