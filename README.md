# AI-Powered Portfolio Assistant

[![CI/CD](https://github.com/imdhanifa/ai-portfolio-assistant/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/imdhanifa/ai-portfolio-assistant/actions/workflows/ci-cd.yml)

A personal portfolio built with Next.js and .NET 10, with a floating AI assistant powered by
Grok (xAI) — the project's only LLM provider. The assistant uses Model Context Protocol
(MCP) tools over structured JSON data to answer questions about skills, experience and
projects.

## Status

**Grok chat is live and confirmed working end-to-end** — the xAI account now has credits.
`ChatController` → `ChatService` → `GrokClient` → xAI's Responses API (`POST /v1/responses`,
model `grok-4.6`) returns real `200`s, and `GrokClient.ExtractOutputText`'s response parsing
(previously written defensively against the documented convention but never exercised
against a real success response) is now confirmed correct against actual output. Example
verified live: asking about projects and skills returns an accurate, well-formatted answer
correctly grounded in the real MCP data (`get_projects`/`get_skills`/`get_profile`), no
hallucination.

**This project is Grok-only by design** — no OpenAI or other LLM provider is wired in, and
RAG (resume PDF retrieval via embeddings + Qdrant) isn't used, since xAI has no
embedding-capable model on this account (checked live: `GET https://api.x.ai/v1/models`
lists only chat/image/video models) and bringing in a second provider just for embeddings
was a deliberate no. The assistant answers purely from MCP tool data (profile/skills/
projects/experience). See the security note in Next Steps below for a squatted NuGet
package discovered and avoided while RAG was briefly explored — worth keeping in mind if
PDF parsing is ever revisited.

Real content is in (`backend/Portfolio.Api/Data/profile.json`, `skills.json`,
`projects.json`, `experience.json`, `education.json`) — see
[backend/Portfolio.Api/Data/README.md](backend/Portfolio.Api/Data/README.md) for two
details worth double checking against the source resume. Rate limiting is also in place
(10 req/min on `POST /api/chat`, 100 req/min globally — see `RateLimiting` in
[appsettings.json](backend/Portfolio.Api/appsettings.json)), and `docker compose up --build`
has been run and verified end-to-end (both containers healthy, portfolio pages rendering
real data server-side).

**The resume PDF is generated on demand, not a static file.** `GET /api/resume/pdf`
([`ResumeController`](backend/Portfolio.Api/Controllers/ResumeController.cs)) builds an
ATS-friendly PDF (single column, real selectable text, standard section headings, plain
bullet lists — no images, tables, or multi-column layout that could scramble how an
Applicant Tracking System reads it) straight from the same JSON files everything else
reads, via [QuestPDF](https://www.questpdf.com) (free Community license — this project
qualifies as an individual, non-commercial use). Verified both locally and **inside the
actual Linux Docker container** (the real risk with SkiaSharp-based PDF libraries: a bare
`aspnet:10.0` image has no fonts installed) — rendered identically correctly in both, no
font warnings in the container logs, so no extra `fontconfig`/font packages needed in the
Dockerfile. The frontend's "Download Resume" button links straight to this endpoint
(`lib/api.js` → `getResumePdfUrl()`); there's no `resume.pdf` file anywhere in the repo
anymore.

## Project layout

```text
frontend/portfolio-web/          Next.js portfolio site + AI chat UI
backend/Portfolio.Api/           ASP.NET Core (.NET 10) API — Grok orchestration, MCP
backend/Portfolio.Api/Data/      profile.json, skills.json, projects.json, experience.json, education.json
docker-compose.yml               portfolio-web + portfolio-api
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

This starts `portfolio-web` (3000) and `portfolio-api` (8080), with
`./backend/Portfolio.Api/Data` mounted read-only into the API container.

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
| `XAI_API_KEY`           | backend                | Grok (xAI) API key — the project's only LLM provider, never expose to the frontend |
| `NEXT_PUBLIC_API_URL`   | frontend, build-time   | Base URL the **browser** uses to call the API |
| `API_INTERNAL_URL`      | frontend, runtime      | Base URL **Server Components** use to call the API — must be the Docker-internal address (`http://portfolio-api:8080` in Compose), since `localhost` inside the web container doesn't reach the API container |

## API docs & testing

- **Postman collection**: [postman/Portfolio-Api.postman_collection.json](postman/Portfolio-Api.postman_collection.json) — health, all five `GET /api/*` MCP-backed endpoints, the resume PDF endpoint, and a few `POST /api/chat` examples (including a 400-validation case). Import it, set the `baseUrl` variable (`http://localhost:5290` for `dotnet run`, `http://localhost:8080` for Compose), and go. Verified with `newman run` against the live containers — all 11 requests pass.
- **Interactive OpenAPI docs (Scalar)**: run the API in `Development` and open `{{baseUrl}}/scalar/v1` (backed by the raw spec at `/openapi/v1.json`). Not exposed in Production.

## CI/CD

[`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) runs on every push/PR to `main`:

1. **backend** — `dotnet build` (Release).
2. **frontend** — `eslint` + `next build`.
3. **docker-build** — builds both Dockerfiles (build-only, no push), catching Dockerfile
   issues plain builds wouldn't.
4. **e2e-smoke** — the real test: `docker compose up --build` with no API key configured
   (exercising the same Grok → placeholder fallback chain described above),
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

1. ~~**RAG**~~ Not pursued — this project is Grok-only, and xAI has no embeddings API on
   this account, so there's no in-house way to generate embeddings without a second LLM
   provider (a deliberate exclusion). `ResumeLoader`, `VectorStore` (raw REST against
   Qdrant) and `RagService` were fully implemented and verified live at one point, then
   removed along with Qdrant and OpenAI to keep the stack Grok-only. One thing worth
   keeping from that work: while adding PDF parsing, `dotnet add package UglyToad.PdfPig`
   (guessed from the project's GitHub org name) resolved to a **squatted lookalike NuGet
   package** — owner `grinay` (not the real maintainers), a literal placeholder
   `"Package Description"`, a version tagged `-custom-5`. The real package id is simply
   `PdfPig` (owners `BobLd`/`EliotJones`, real description, 29M downloads) — it still
   exposes the `UglyToad.PdfPig` *namespace*, which is exactly what made the squatted
   *package id* so plausible. Worth remembering if PDF parsing is ever revisited, on this
   project or any other .NET one. PDF *generation* (a different problem) was in fact
   revisited — see item 3 below — and the package-ownership check was applied again there
   before installing anything.
2. ~~**Grok** — implement `GrokClient.CompleteAsync`.~~ Done and **confirmed live** — see
   Status. This project is Grok-only by design: no other LLM provider is wired in.
   `ChatService` tries Grok, then falls straight to the placeholder if it fails.
3. ~~**Resume PDF**~~ Done — `GET /api/resume/pdf` generates an ATS-friendly PDF on demand
   via [QuestPDF](https://www.questpdf.com) (verified `owners: [MarcinZiabek, QuestPDF]`,
   `verified: true` on NuGet before installing; free Community license). Added
   `education.json` + `EducationTool`/`GET /api/education` alongside it, since the original
   resume had an education section this project's data files didn't yet cover.
4. **MCP protocol** — expose `PortfolioMcpServer`'s tools over an actual MCP transport
   (currently called in-process only).
5. **Orchestration** — replace the keyword heuristic in `ChatService.SelectRelevantTools`
   with real LLM-driven tool selection.
6. **Production hardening** — ~~rate limiting~~ (done), structured logging, CORS locked to
   the real domain.
7. **Deploy** — push to GitHub, connect to Coolify on the Hostinger VPS, set env vars,
   point `api.yourdomain.com` / `yourdomain.com` at the containers.
