namespace Portfolio.Api.MCP;

/// <summary>
/// Configuration for where the structured portfolio JSON files (and resume.pdf) live on disk.
/// Bound from the "PortfolioData" section of appsettings.json.
/// </summary>
public class PortfolioDataOptions
{
    public const string SectionName = "PortfolioData";

    /// <summary>
    /// Directory containing profile.json, skills.json, projects.json, experience.json,
    /// resume.pdf. Lives inside the project itself (backend/Portfolio.Api/data), relative
    /// to the app's working directory - both `dotnet run` and the published app running in
    /// Docker (WORKDIR /app) execute from this project's own root.
    /// </summary>
    public string DataDirectory { get; set; } = "data";
}
