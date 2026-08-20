using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.Options;
using Portfolio.Api.Models;

namespace Portfolio.Api.RAG;

/// <summary>
/// Thin REST wrapper around Qdrant for the "portfolio_resume" collection. Every endpoint
/// shape here (create collection, upsert, query) was verified live against a running
/// Qdrant instance before being implemented.
/// </summary>
public class VectorStore(IHttpClientFactory httpClientFactory, IOptions<QdrantOptions> options, ILogger<VectorStore> logger)
{
    public const string CollectionName = "portfolio_resume";

    private HttpClient CreateClient()
    {
        var client = httpClientFactory.CreateClient();
        client.BaseAddress = new Uri(options.Value.Url.TrimEnd('/') + "/");
        return client;
    }

    /// <summary>Returns the current point count if the collection exists, or null if it doesn't yet.</summary>
    public async Task<int?> GetPointCountAsync(CancellationToken cancellationToken = default)
    {
        var client = CreateClient();

        HttpResponseMessage response;
        try
        {
            response = await client.GetAsync($"collections/{CollectionName}", cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Failed to reach Qdrant.");
            throw new VectorStoreException("Failed to reach Qdrant.", ex);
        }

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new VectorStoreException($"Qdrant returned {(int)response.StatusCode} checking collection info: {body}");
        }

        var payload = await response.Content.ReadFromJsonAsync<QdrantCollectionInfoResponse>(cancellationToken: cancellationToken);
        return payload?.Result?.PointsCount ?? 0;
    }

    public async Task EnsureCollectionAsync(int vectorSize, CancellationToken cancellationToken = default)
    {
        var client = CreateClient();
        var request = new QdrantCreateCollectionRequest { Vectors = new QdrantVectorParams { Size = vectorSize, Distance = "Cosine" } };

        HttpResponseMessage response;
        try
        {
            response = await client.PutAsJsonAsync($"collections/{CollectionName}", request, cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Failed to reach Qdrant.");
            throw new VectorStoreException("Failed to reach Qdrant.", ex);
        }

        // 409 = collection already exists, which is fine - this call is idempotent.
        if (response.StatusCode == HttpStatusCode.Conflict)
        {
            return;
        }

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new VectorStoreException($"Failed to create Qdrant collection: {(int)response.StatusCode} {body}");
        }
    }

    public async Task UpsertAsync(IReadOnlyList<(float[] Vector, string Text, ChunkMetadata Metadata)> chunks, CancellationToken cancellationToken = default)
    {
        if (chunks.Count == 0)
        {
            return;
        }

        var client = CreateClient();
        var request = new QdrantUpsertRequest
        {
            // Sequential integer ids from the chunk index: re-ingesting the same resume
            // overwrites the same points rather than accumulating duplicates.
            Points = chunks.Select((c, i) => new QdrantPoint
            {
                Id = i,
                Vector = c.Vector,
                Payload = new QdrantPayload
                {
                    Text = c.Text,
                    Source = c.Metadata.Source,
                    Section = c.Metadata.Section,
                    ChunkIndex = c.Metadata.ChunkIndex,
                },
            }).ToList(),
        };

        HttpResponseMessage response;
        try
        {
            response = await client.PutAsJsonAsync($"collections/{CollectionName}/points", request, cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Failed to reach Qdrant.");
            throw new VectorStoreException("Failed to reach Qdrant.", ex);
        }

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new VectorStoreException($"Failed to upsert points into Qdrant: {(int)response.StatusCode} {body}");
        }
    }

    public async Task<IReadOnlyList<RetrievedChunk>> SearchAsync(float[] queryVector, int topK, CancellationToken cancellationToken = default)
    {
        var client = CreateClient();
        var request = new QdrantQueryRequest { Query = queryVector, Limit = topK, WithPayload = true };

        HttpResponseMessage response;
        try
        {
            response = await client.PostAsJsonAsync($"collections/{CollectionName}/points/query", request, cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Failed to reach Qdrant.");
            throw new VectorStoreException("Failed to reach Qdrant.", ex);
        }

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new VectorStoreException($"Qdrant query failed: {(int)response.StatusCode} {body}");
        }

        var payload = await response.Content.ReadFromJsonAsync<QdrantQueryResponse>(cancellationToken: cancellationToken);
        var points = payload?.Result?.Points ?? [];

        return points
            .Where(p => p.Payload is not null)
            .Select(p => new RetrievedChunk
            {
                Text = p.Payload!.Text,
                Source = p.Payload.Source,
                Section = p.Payload.Section,
                ChunkIndex = p.Payload.ChunkIndex,
                Score = p.Score,
            })
            .ToList();
    }
}
