namespace Portfolio.Api.MCP;

/// <summary>
/// Configuration for where the structured portfolio JSON files live on disk. Bound from
/// the "PortfolioData" section of appsettings.json.
/// </summary>
public class PortfolioDataOptions
{
    public const string SectionName = "PortfolioData";

    /// <summary>
    /// Directory containing profile.json, skills.json, projects.json, experience.json,
    /// education.json. Lives inside the project itself (backend/Portfolio.Api/Data),
    /// relative to the app's working directory - both `dotnet run` and the published app
    /// running in Docker (WORKDIR /app) execute from this project's own root. Case matters
    /// here even though it looks harmless locally: Windows dev is case-insensitive, but the
    /// Docker image runs on Linux, which is case-sensitive - this must exactly match the
    /// real folder's case (currently "Data"), not just look right on a Windows machine.
    /// </summary>
    public string DataDirectory { get; set; } = "Data";
}
