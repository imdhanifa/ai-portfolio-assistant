# AI-Powered Portfolio Assistant

A personal portfolio built with Next.js and .NET 10, with a floating AI assistant powered by
Grok (xAI). The assistant uses Retrieval-Augmented Generation (RAG) over a resume PDF and
Model Context Protocol (MCP) tools over structured JSON data to answer questions about
skills, experience and projects.

## Status

This repo is currently **scaffolded** (Phase 1/2 of the plan below) — the portfolio UI, the
.NET API shell, MCP tools (reading JSON) and Docker/Compose setup all work end-to-end. RAG
(Qdrant ingestion + search) and the actual Grok API call are stubbed with clear
`NotImplementedException`s / TODO comments and come next. Until then, `POST /api/chat` still
responds — it returns a placeholder answer built from whatever MCP tool data matches the
question, so the endpoint and UI are testable before Grok is wired up.

Real content (`data/profile.json`, `skills.json`, `projects.json`, `experience.json`,
`data/resume.pdf`) is still placeholder — see [data/README.md](data/README.md).

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

| Variable            | Where              | Purpose                                  |
| -------------------- | ------------------ | ----------------------------------------- |
| `XAI_API_KEY`         | backend             | Grok (xAI) API key — never expose to the frontend |
| `QDRANT_URL`          | backend             | Qdrant endpoint (defaults to `http://localhost:6333` / `http://qdrant:6333` in Compose) |
| `NEXT_PUBLIC_API_URL` | frontend, build-time | Base URL the browser uses to call the API |

## Next steps (Phases 3-9)

1. **RAG** — implement `ResumeLoader` (PDF text extraction), wire `EmbeddingService` to a
   real embeddings endpoint, implement `VectorStore` against Qdrant, fill in `RagService`.
2. **Grok** — implement `GrokClient.CompleteAsync` against `POST /v1/chat/completions`.
3. **MCP protocol** — expose `PortfolioMcpServer`'s tools over an actual MCP transport
   (currently called in-process only).
4. **Orchestration** — replace the keyword heuristic in `ChatService.SelectRelevantTools`
   with real LLM-driven tool selection.
5. **Production hardening** — rate limiting, structured logging, CORS locked to the real
   domain, resume ingestion CLI/endpoint.
6. **Deploy** — push to GitHub, connect to Coolify on the Hostinger VPS, set env vars,
   point `api.yourdomain.com` / `yourdomain.com` at the containers.
