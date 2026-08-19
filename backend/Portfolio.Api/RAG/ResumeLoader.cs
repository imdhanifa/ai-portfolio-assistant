namespace Portfolio.Api.RAG;

/// <summary>
/// TODO (Phase 3 - RAG): load data/resume.pdf and extract raw text (e.g. via PdfPig or
/// iText7) plus light normalization (whitespace cleanup, de-hyphenation). Left
/// unimplemented during scaffolding — no resume.pdf exists yet.
/// </summary>
public class ResumeLoader(ILogger<ResumeLoader> logger)
{
    public Task<string> ExtractTextAsync(string pdfPath, CancellationToken cancellationToken = default)
    {
        logger.LogWarning("ResumeLoader.ExtractTextAsync is not implemented yet (Phase 3).");
        throw new NotImplementedException("PDF text extraction will be implemented in Phase 3 (RAG).");
    }
}
