using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Portfolio.Api;
using Portfolio.Api.AI;
using Portfolio.Api.MCP;
using Portfolio.Api.MCP.Tools;
using Portfolio.Api.RAG;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration ---------------------------------------------------------
// Map the spec's plain env var names (section 20) onto the nested config keys the
// options classes bind to, so `XAI_API_KEY` / `QDRANT_URL` work as documented instead
// of requiring ASP.NET Core's double-underscore convention (Grok__ApiKey).
var xaiApiKey = Environment.GetEnvironmentVariable("XAI_API_KEY");
if (!string.IsNullOrEmpty(xaiApiKey))
{
    builder.Configuration["Grok:ApiKey"] = xaiApiKey;
}

var qdrantUrl = Environment.GetEnvironmentVariable("QDRANT_URL");
if (!string.IsNullOrEmpty(qdrantUrl))
{
    builder.Configuration["Qdrant:Url"] = qdrantUrl;
}

builder.Services.Configure<GrokOptions>(builder.Configuration.GetSection(GrokOptions.SectionName));
builder.Services.Configure<QdrantOptions>(builder.Configuration.GetSection(QdrantOptions.SectionName));
builder.Services.Configure<PortfolioDataOptions>(builder.Configuration.GetSection(PortfolioDataOptions.SectionName));

var rateLimiting = new RateLimitingOptions();
builder.Configuration.GetSection(RateLimitingOptions.SectionName).Bind(rateLimiting);

const string FrontendCorsPolicy = "FrontendCorsPolicy";
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

// --- Services ----------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHttpClient();
builder.Services.AddHealthChecks();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(
            new { error = "Too many requests. Please slow down and try again shortly." },
            cancellationToken);
    };

    // Applied to POST /api/chat - the endpoint that triggers a billed Grok API call.
    options.AddPolicy("chat", httpContext => RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: ClientIp(httpContext),
        factory: _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = rateLimiting.Chat.PermitLimit,
            Window = TimeSpan.FromSeconds(rateLimiting.Chat.WindowSeconds),
            QueueLimit = 0,
        }));

    // Applied globally as a looser fallback for every other endpoint.
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ClientIp(httpContext),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = rateLimiting.Global.PermitLimit,
                Window = TimeSpan.FromSeconds(rateLimiting.Global.WindowSeconds),
                QueueLimit = 0,
            }));
});

static string ClientIp(HttpContext httpContext) =>
    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        }
        else
        {
            // No origins configured (e.g. local dev without appsettings override) — allow
            // localhost Next.js dev server only. Configure Cors:AllowedOrigins in production.
            policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
        }
    });
});

// AI services
builder.Services.AddSingleton<IEmbeddingService, EmbeddingService>();
builder.Services.AddSingleton<IRagService, RagService>();
builder.Services.AddSingleton<IPromptService, PromptService>();
builder.Services.AddSingleton<IGrokClient, GrokClient>();
builder.Services.AddScoped<IChatService, ChatService>();

// RAG pipeline building blocks
builder.Services.AddSingleton<ResumeLoader>();
builder.Services.AddSingleton<DocumentChunker>();
builder.Services.AddSingleton<VectorStore>();

// MCP tools + server
builder.Services.AddSingleton<IPortfolioTool, ProfileTool>();
builder.Services.AddSingleton<IPortfolioTool, SkillsTool>();
builder.Services.AddSingleton<IPortfolioTool, ProjectsTool>();
builder.Services.AddSingleton<IPortfolioTool, ExperienceTool>();
builder.Services.AddSingleton<PortfolioMcpServer>();

var app = builder.Build();

// --- Pipeline ------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors(FrontendCorsPolicy);
app.UseRateLimiter();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
