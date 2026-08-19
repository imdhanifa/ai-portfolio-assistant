namespace Portfolio.Api.RAG;

public record TextChunk(string Text, int ChunkIndex);

/// <summary>
/// Splits extracted resume text into overlapping word-based chunks suitable for embedding.
/// Pure text-processing utility — no external calls, so it's implemented now rather than
/// left as a Phase 3 TODO.
/// </summary>
public class DocumentChunker
{
    /// <param name="chunkSizeWords">Target chunk size, in words.</param>
    /// <param name="overlapWords">Words of overlap between consecutive chunks, to avoid cutting context at boundaries.</param>
    public List<TextChunk> Chunk(string text, int chunkSizeWords = 200, int overlapWords = 40)
    {
        ArgumentOutOfRangeException.ThrowIfLessThanOrEqual(overlapWords, -1);
        ArgumentOutOfRangeException.ThrowIfGreaterThanOrEqual(overlapWords, chunkSizeWords);

        var words = text.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries);
        if (words.Length == 0)
        {
            return [];
        }

        var chunks = new List<TextChunk>();
        var step = chunkSizeWords - overlapWords;
        var index = 0;

        for (var start = 0; start < words.Length; start += step)
        {
            var length = Math.Min(chunkSizeWords, words.Length - start);
            var chunkText = string.Join(' ', words.Skip(start).Take(length));
            chunks.Add(new TextChunk(chunkText, index++));

            if (start + length >= words.Length)
            {
                break;
            }
        }

        return chunks;
    }
}
