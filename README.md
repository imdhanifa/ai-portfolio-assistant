# AI-Powered Portfolio Assistant

A personal portfolio built with Next.js and .NET 10, with a floating AI assistant powered by
Grok (xAI). The assistant uses Retrieval-Augmented Generation (RAG) over a resume PDF and
Model Context Protocol (MCP) tools over structured JSON data to answer questions about
skills, experience and projects.

## Status

This repo is currently **scaffolded** (Phase 1/2/4 of the plan below) — the portfolio UI,
the .NET API shell, MCP tools (reading JSON), the real Grok API call, and Docker/Compose
setup all work end-to-end. RAG (Qdrant ingestion + search) is still stubbed with clear
`NotImplementedException`s / TODO comments. `POST /api/chat` calls Grok for real and falls
back to a placeholder answer (built from whatever MCP tool data matches the question) if the
Grok call fails for any reason — no API key configured, no account credits, network error,
etc. — so the endpoint and UI stay testable no matter what state the Grok account is in.

**Grok is wired up but the xAI account has no credits yet** (confirmed via repeated live API
calls — auth succeeds, `403 permission-denied` with "doesn't have any credits or licenses
yet"). Add credits at the URL in that error / on [console.x.ai](https://console.x.ai), and
answers will start coming from Grok immediately — no code changes needed.
`GrokClient` calls xAI's **Responses API** (`POST /v1/responses`, an `input` array rather than
the older `messages` chat/completions shape), model `grok-4.6` — both confirmed against a
real xAI-documented example, reaching the endpoint (403 billing-gate, not 404/format-rejected).
The success-response parsing in `GrokClient.ExtractOutputText` is written defensively against
the documented convention but hasn't been exercised against a real 200 yet — worth a quick
sanity check the first time credits land.

Real content is in (`data/profile.json`, `skills.json`, `projects.json`, `experience.json`,
`data/resume.pdf`) — see [data/README.md](data/README.md) for two details worth double
checking against the source resume. Rate limiting is also in place (10 req/min on
`POST /api/chat`, 100 req/min globally — see `RateLimiting` in
[appsettings.json](backend/Portfolio.Api/appsettings.json)), and `docker compose up --build`
has been run and verified end-to-end (all three containers healthy, portfolio pages
rendering real data server-side).

## Project layout

```text
frontend/portfolio-web/   Next.js portfolio site + AI chat UI
backend/Portfolio.Api/    ASP.NET Core (.NET 10) API — AI orchestration, RAG, MCP
data/                     profile.json, skills.json, projects.json, experience.json, resume.pdf
docker-compose.yml        portfolio-web + portfolio-api + qdrant
```

See the full architecture and phased plan in the original project spec (shared in this
repo's history / chat).

## Running locally (without Docker)

**Backend** (http://localhost:5290):

```bash
cd backend/Portfolio.Api
dotnet run
```

**Frontend** (http://localhost:3000):

```bash
cd frontend/portfolio-web
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5290
npm install
npm run dev
```

Open http://localhost:3000 — the floating 🤖 button and `/chat` page both talk to the API.

## Running with Docker Compose

```bash
cp .env.example .env   # fill in XAI_API_KEY once Phase 4 lands
docker compose up --build
```

This starts `portfolio-web` (3000), `portfolio-api` (8080) and `qdrant` (6333), with
`./data` mounted read-only into the API container.

## Configuration

| Variable              | Where                 | Purpose                                  |
| ---------------------- | --------------------- | ----------------------------------------- |
| `XAI_API_KEY`           | backend                | Grok (xAI) API key — never expose to the frontend |
| `QDRANT_URL`            | backend                | Qdrant endpoint (defaults to `http://localhost:6333` / `http://qdrant:6333` in Compose) |
| `NEXT_PUBLIC_API_URL`   | frontend, build-time   | Base URL the **browser** uses to call the API |
| `API_INTERNAL_URL`      | frontend, runtime      | Base URL **Server Components** use to call the API — must be the Docker-internal address (`http://portfolio-api:8080` in Compose), since `localhost` inside the web container doesn't reach the API container |

## API docs & testing

- **Postman collection**: [postman/Portfolio-Api.postman_collection.json](postman/Portfolio-Api.postman_collection.json) — health, all four `GET /api/*` endpoints, and a few `POST /api/chat` examples (including a 400-validation case). Import it, set the `baseUrl` variable (`http://localhost:5290` for `dotnet run`, `http://localhost:8080` for Compose), and go. Verified with `newman run` against the live containers — all 9 requests pass.
- **Interactive OpenAPI docs (Scalar)**: run the API in `Development` and open `{{baseUrl}}/scalar/v1` (backed by the raw spec at `/openapi/v1.json`). Not exposed in Production.

## Next steps (Phases 3, 5-9)

1. **RAG** — implement `ResumeLoader` (PDF text extraction), wire `EmbeddingService` to a
   real embeddings endpoint, implement `VectorStore` against Qdrant, fill in `RagService`.
   `data/resume.pdf` is in place (see its caveat in [data/README.md](data/README.md)).
2. ~~**Grok** — implement `GrokClient.CompleteAsync`.~~ Done — calls
   `POST /v1/chat/completions`; blocked only on the xAI account having credits (see Status).
3. **MCP protocol** — expose `PortfolioMcpServer`'s tools over an actual MCP transport
   (currently called in-process only).
4. **Orchestration** — replace the keyword heuristic in `ChatService.SelectRelevantTools`
   with real LLM-driven tool selection.
5. **Production hardening** — ~~rate limiting~~ (done), structured logging, CORS locked to
   the real domain, resume ingestion CLI/endpoint.
6. **Deploy** — push to GitHub, connect to Coolify on the Hostinger VPS, set env vars,
   point `api.yourdomain.com` / `yourdomain.com` at the containers.
