using Portfolio.Api.MCP;
using Portfolio.Api.Models;

namespace Portfolio.Api.AI;

/// <summary>
/// Chat orchestrator. Wires RAG + MCP + prompt building + Grok together per the "AI
/// Decision Flow" (spec section 16). RAG and Grok are still stubs (Phases 3 and 4), so
/// this currently falls back to a placeholder answer built from whatever MCP tool data
/// it can gather, rather than failing outright — keeps POST /api/chat testable end-to-end
/// during scaffolding.
/// </summary>
public class ChatService(
    IRagService ragService,
    PortfolioMcpServer mcpServer,
    IPromptService promptService,
    IGrokClient grokClient,
    ILogger<ChatService> logger) : IChatService
{
    public async Task<ChatResponse> AskAsync(ChatRequest request, CancellationToken cancellationToken = default)
    {
        var sources = new List<string>();

        var ragContext = await ragService.SearchAsync(request.Message, cancellationToken: cancellationToken);
        if (ragContext.Count > 0)
        {
            sources.Add("resume.pdf");
        }

        // TODO (Phase 6): replace this keyword heuristic with proper LLM-driven tool
        // selection (Grok function calling) as described in the AI Decision Flow.
        var mcpResults = new Dictionary<string, string>();
        foreach (var tool in SelectRelevantTools(request.Message))
        {
            var result = await mcpServer.CallToolAsync(tool.Name, cancellationToken);
            if (result is not null)
            {
                mcpResults[tool.Name] = result;
                sources.Add($"{tool.Name}.json");
            }
        }

        var systemPrompt = promptService.BuildSystemPrompt();
        var userPrompt = promptService.BuildUserPrompt(request.Message, ragContext, mcpResults);

        try
        {
            var answer = await grokClient.CompleteAsync(systemPrompt, userPrompt, cancellationToken);
            return new ChatResponse { Answer = answer, Sources = sources };
        }
        catch (NotImplementedException)
        {
            logger.LogInformation("Grok is not wired up yet; returning a placeholder chat response.");
            return BuildPlaceholderResponse(mcpResults, sources);
        }
    }

    private IEnumerable<MCP.Tools.IPortfolioTool> SelectRelevantTools(string message)
    {
        var lower = message.ToLowerInvariant();
        var tools = mcpServer.Tools;

        if (lower.Contains("project")) yield return tools.First(t => t.Name == "get_projects");
        if (lower.Contains("skill") || lower.Contains("technolog")) yield return tools.First(t => t.Name == "get_skills");
        if (lower.Contains("experience") || lower.Contains("work")) yield return tools.First(t => t.Name == "get_experience");
        if (lower.Contains("who are you") || lower.Contains("about") || lower.Contains("profile")) yield return tools.First(t => t.Name == "get_profile");
    }

    private static ChatResponse BuildPlaceholderResponse(Dictionary<string, string> mcpResults, List<string> sources)
    {
        var answer = mcpResults.Count > 0
            ? $"(Placeholder — Grok integration lands in Phase 4.) Found structured data from: {string.Join(", ", mcpResults.Keys)}."
            : "(Placeholder — Grok integration lands in Phase 4, RAG in Phase 3.) No matching structured data or resume context found yet.";

        return new ChatResponse { Answer = answer, Sources = sources };
    }
}
