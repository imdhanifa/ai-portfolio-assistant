using System.Text.Json.Serialization;

namespace Portfolio.Api.RAG;

// DTOs for Qdrant's REST API. Every shape here was verified live against a running Qdrant
// 1.19 instance before being written (PUT .../collections/{name}, PUT .../points, POST
// .../points/query - the current query endpoint; Qdrant deprecated the older
// .../points/search in favor of this one, an easy thing to get wrong from memory).

public class QdrantCreateCollectionRequest
{
    [JsonPropertyName("vectors")]
    public QdrantVectorParams Vectors { get; set; } = new();
}

public class QdrantVectorParams
{
    [JsonPropertyName("size")]
    public int Size { get; set; }

    [JsonPropertyName("distance")]
    public string Distance { get; set; } = "Cosine";
}

public class QdrantCollectionInfoResponse
{
    [JsonPropertyName("result")]
    public QdrantCollectionInfoResult? Result { get; set; }
}

public class QdrantCollectionInfoResult
{
    [JsonPropertyName("points_count")]
    public int PointsCount { get; set; }
}

public class QdrantUpsertRequest
{
    [JsonPropertyName("points")]
    public List<QdrantPoint> Points { get; set; } = [];
}

public class QdrantPoint
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("vector")]
    public float[] Vector { get; set; } = [];

    [JsonPropertyName("payload")]
    public QdrantPayload Payload { get; set; } = new();
}

/// <summary>Our own payload shape stored on each point - not part of Qdrant's API surface.</summary>
public class QdrantPayload
{
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;

    [JsonPropertyName("source")]
    public string Source { get; set; } = string.Empty;

    [JsonPropertyName("section")]
    public string? Section { get; set; }

    [JsonPropertyName("chunkIndex")]
    public int ChunkIndex { get; set; }
}

public class QdrantQueryRequest
{
    [JsonPropertyName("query")]
    public float[] Query { get; set; } = [];

    [JsonPropertyName("limit")]
    public int Limit { get; set; }

    [JsonPropertyName("with_payload")]
    public bool WithPayload { get; set; } = true;
}

public class QdrantQueryResponse
{
    [JsonPropertyName("result")]
    public QdrantQueryResult? Result { get; set; }
}

public class QdrantQueryResult
{
    [JsonPropertyName("points")]
    public List<QdrantScoredPoint> Points { get; set; } = [];
}

public class QdrantScoredPoint
{
    [JsonPropertyName("score")]
    public float Score { get; set; }

    [JsonPropertyName("payload")]
    public QdrantPayload? Payload { get; set; }
}

/// <summary>Thrown when a Qdrant REST call fails (unreachable, non-2xx, unexpected shape).</summary>
public class VectorStoreException(string message, Exception? inner = null) : Exception(message, inner);
