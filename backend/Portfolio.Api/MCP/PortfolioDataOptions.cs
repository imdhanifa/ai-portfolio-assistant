namespace Portfolio.Api.MCP;

/// <summary>
/// Configuration for where the structured portfolio JSON files (and resume.pdf) live on disk.
/// Bound from the "PortfolioData" section of appsettings.json.
/// </summary>
public class PortfolioDataOptions
{
    public const string SectionName = "PortfolioData";

    /// <summary>Directory containing profile.json, skills.json, projects.json, experience.json, resume.pdf.</summary>
    public string DataDirectory { get; set; } = "../../data";
}
