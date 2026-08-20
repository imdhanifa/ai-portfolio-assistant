# AI-Powered Portfolio Assistant

[![CI/CD](https://github.com/imdhanifa/ai-portfolio-assistant/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/imdhanifa/ai-portfolio-assistant/actions/workflows/ci-cd.yml)

A personal portfolio built with Next.js and .NET 10, with a floating AI assistant powered by
Grok (xAI). The assistant uses Retrieval-Augmented Generation (RAG) over a resume PDF and
Model Context Protocol (MCP) tools over structured JSON data to answer questions about
skills, experience and projects.

## Status

**Grok chat is live and confirmed working end-to-end** — the xAI account now has credits.
`ChatController` → `ChatService` → `GrokClient` → xAI's Responses API (`POST /v1/responses`,
model `grok-4.6`) returns real `200`s, and `GrokClient.ExtractOutputText`'s response parsing
(previously written defensively against the documented convention but never exercised
against a real success response) is now confirmed correct against actual output. Example
verified live: asking about projects and skills returns an accurate, well-formatted answer
correctly grounded in the real MCP data (`get_projects`/`get_skills`/`get_profile`), no
hallucination.

**RAG is implemented** (`ResumeLoader` via PdfPig, `VectorStore` against Qdrant's REST API,
`RagService` orchestrating lazy ingestion + query) but not yet answering questions, because
embeddings go through OpenAI (xAI has no embedding-capable model on this account - checked
live) and **the OpenAI account has no usable credits**: the key is valid and the request
format is confirmed correct (`429 insufficient_quota`, not 401/404 - auth and shape both
correct, purely a billing gate), covering both its role as the embeddings provider and as
the chat fallback if Grok ever fails again. `RagService.SearchAsync` catches this and
returns no resume context rather than failing the whole chat request, so `POST /api/chat`
keeps working end-to-end either way. Add credits at
[platform.openai.com/account/billing](https://platform.openai.com/account/billing) and RAG
starts answering immediately, no code changes needed — first real embedding response is
worth a quick sanity check (see the RAG item in Next Steps below for why).

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

`docker-compose.yml` itself publishes **no host ports** — it's what Coolify (or anything
else running `docker compose -f docker-compose.yml up`) deploys as-is, and hard-binding a
fixed host port on a shared VPS is both unnecessary (Coolify's own proxy routes by domain
straight into the Docker network) and prone to conflicts with whatever else is already using
that port on the box. `docker-compose.override.yml` adds the `3000`/`8080`/`6333` port
publishing back for local dev only — plain `docker compose up` (no `-f` flag, which is what
every command in this README uses) auto-merges it in, while an explicit `-f docker-compose.yml`
invocation (what Coolify uses) does not. If you deploy this elsewhere without Coolify's
domain-based proxying, you'll need to either add ports back to `docker-compose.yml` or
configure your platform's equivalent of domain → internal-port routing.

## Configuration

| Variable              | Where                 | Purpose                                  |
| ---------------------- | --------------------- | ----------------------------------------- |
| `XAI_API_KEY`           | backend                | Grok (xAI) API key, primary LLM — never expose to the frontend |
| `OPENAI_API_KEY`        | backend                | OpenAI API key, fallback LLM used automatically if Grok fails — never expose to the frontend |
| `QDRANT_URL`            | backend                | Qdrant endpoint (defaults to `http://localhost:6333` / `http://qdrant:6333` in Compose) |
| `NEXT_PUBLIC_API_URL`   | frontend, build-time   | Base URL the **browser** uses to call the API |
| `API_INTERNAL_URL`      | frontend, runtime      | Base URL **Server Components** use to call the API — must be the Docker-internal address (`http://portfolio-api:8080` in Compose), since `localhost` inside the web container doesn't reach the API container |

## API docs & testing

- **Postman collection**: [postman/Portfolio-Api.postman_collection.json](postman/Portfolio-Api.postman_collection.json) — health, all four `GET /api/*` endpoints, and a few `POST /api/chat` examples (including a 400-validation case). Import it, set the `baseUrl` variable (`http://localhost:5290` for `dotnet run`, `http://localhost:8080` for Compose), and go. Verified with `newman run` against the live containers — all 9 requests pass.
- **Interactive OpenAPI docs (Scalar)**: run the API in `Development` and open `{{baseUrl}}/scalar/v1` (backed by the raw spec at `/openapi/v1.json`). Not exposed in Production.

## CI/CD

[`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) runs on every push/PR to `main`:

1. **backend** — `dotnet build` (Release).
2. **frontend** — `eslint` + `next build`.
3. **docker-build** — builds both Dockerfiles (build-only, no push), catching Dockerfile
   issues plain builds wouldn't.
4. **e2e-smoke** — the real test: `docker compose up --build` with no API keys configured
   (exercising the same Grok → OpenAI → placeholder fallback chain described above),
   waits for both services to be healthy, runs the full [Postman collection](postman/Portfolio-Api.postman_collection.json)
   via `newman`, and checks the homepage actually server-rendered real profile data (the
   exact class of bug caught manually earlier — see the "Fix portfolio-web unable to reach
   portfolio-api in Docker" commit).
5. **deploy** — only on a push to `main`, only after every job above passes. Triggers a
   Coolify deploy webhook if `COOLIFY_WEBHOOK_URL` (+ optional `COOLIFY_API_TOKEN`) is set
   as a repo secret; otherwise it logs why it skipped and exits cleanly rather than failing.

**Two ways to wire up actual deployment** (pick one):

- **Simplest — Coolify's native GitHub integration**: connect this repo directly in
  Coolify's dashboard. Coolify then polls/webhooks on push and redeploys on its own,
  matching the spec's `Git Push → GitHub → Coolify → Docker Build → Deployment` flow — no
  GitHub secret needed, but it redeploys on every push regardless of whether checks passed.
- **Gated — the `deploy` job above**: add `COOLIFY_WEBHOOK_URL` (from the app's Settings →
  Webhooks in Coolify) as a GitHub Actions secret (Settings → Secrets and variables →
  Actions). Deploys only fire after CI/build/smoke-test all pass.

## Next steps (Phases 3, 5-9)

1. ~~**RAG**~~ Done, pending OpenAI credits (see Status):
   - `EmbeddingService` — OpenAI's `POST /v1/embeddings` (`text-embedding-3-small`, batched
     up to 100 inputs/request). Live-verified request shape (`429 insufficient_quota`, not
     401/404).
   - `ResumeLoader` — PDF text extraction via [PdfPig](https://github.com/UglyToad/PdfPig)
     (`ContentOrderTextExtractor`, not the raw `page.Text` PdfPig's own docs warn against).
     **NuGet package id is `PdfPig`, not `UglyToad.PdfPig`** — the latter is a squatted
     lookalike package (owner `grinay`, not the real maintainers; placeholder
     `"Package Description"`; a suspicious `-custom-5` version) that showed up first when
     guessing the id from the GitHub org name. Caught by checking NuGet ownership metadata
     before installing anything — worth remembering if this ever needs reinstalling.
   - `VectorStore` — raw REST calls to Qdrant (no client SDK dependency, matching the
     GrokClient/OpenAiClient pattern already in this codebase). Every endpoint shape
     (`PUT /collections/{name}`, `PUT .../points`, `POST .../points/query` — Qdrant
     deprecated the older `.../points/search` in favor of this) was verified live against a
     running Qdrant instance before being implemented, not assumed from memory.
   - `RagService` — lazily ingests the resume (chunk → embed → upsert) on first search if
     the `portfolio_resume` collection is empty, guarded by a semaphore so concurrent
     requests don't double-ingest; embeds the question and queries Qdrant otherwise. Vector
     dimension for the Qdrant collection comes from the actual first embedding response
     rather than a hardcoded guess. Wrapped in try/catch so a RAG failure (no OpenAI
     credits, Qdrant down, etc.) never fails the whole chat request — same graceful-fallback
     principle as the rest of `ChatService`.
2. ~~**Grok** — implement `GrokClient.CompleteAsync`.~~ Done and **confirmed live** — see
   Status. An OpenAI fallback (`OpenAiClient`) is also wired in for if Grok ever fails again
   — `ChatService` tries Grok, then OpenAI, then the placeholder.
3. **MCP protocol** — expose `PortfolioMcpServer`'s tools over an actual MCP transport
   (currently called in-process only).
4. **Orchestration** — replace the keyword heuristic in `ChatService.SelectRelevantTools`
   with real LLM-driven tool selection.
5. **Production hardening** — ~~rate limiting~~ (done), structured logging, CORS locked to
   the real domain, resume ingestion CLI/endpoint.
6. **Deploy** — push to GitHub, connect to Coolify on the Hostinger VPS, set env vars,
   point `api.yourdomain.com` / `yourdomain.com` at the containers.
