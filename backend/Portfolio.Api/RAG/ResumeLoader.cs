using System.Text;
using System.Text.RegularExpressions;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;

namespace Portfolio.Api.RAG;

/// <summary>
/// Loads data/resume.pdf and extracts its text via PdfPig (NuGet package id "PdfPig" -
/// note this despite the library's own namespace being UglyToad.PdfPig; a squatted package
/// literally named "UglyToad.PdfPig" also exists on NuGet with fake ownership metadata and
/// no real description - do not install that one).
/// </summary>
public partial class ResumeLoader(ILogger<ResumeLoader> logger)
{
    public Task<string> ExtractTextAsync(string pdfPath, CancellationToken cancellationToken = default)
    {
        if (!File.Exists(pdfPath))
        {
            logger.LogWarning("Resume PDF not found at {PdfPath}", pdfPath);
            throw new FileNotFoundException("Resume PDF not found.", pdfPath);
        }

        // PdfPig's API is synchronous; run it on a background thread so callers can still
        // await this without blocking.
        return Task.Run(
            () =>
            {
                using var document = PdfDocument.Open(pdfPath);
                var sb = new StringBuilder();

                foreach (var page in document.GetPages())
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    // ContentOrderTextExtractor (not page.Text) - PdfPig's own docs warn
                    // page.Text preserves raw internal content order, which is rarely the
                    // actual reading order.
                    sb.AppendLine(ContentOrderTextExtractor.GetText(page));
                }

                return Normalize(sb.ToString());
            },
            cancellationToken);
    }

    /// <summary>Collapses runs of whitespace and blank lines left over from PDF extraction.</summary>
    private static string Normalize(string text)
    {
        var collapsedSpaces = MultipleSpacesRegex().Replace(text, " ");
        var collapsedBlankLines = ThreeOrMoreNewlinesRegex().Replace(collapsedSpaces, "\n\n");
        return collapsedBlankLines.Trim();
    }

    [GeneratedRegex(@"[ \t]+")]
    private static partial Regex MultipleSpacesRegex();

    [GeneratedRegex(@"\n{3,}")]
    private static partial Regex ThreeOrMoreNewlinesRegex();
}
