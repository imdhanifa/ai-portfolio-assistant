# Portfolio Data

This directory holds the structured content the API and MCP tools serve, and the resume the RAG pipeline indexes.

- `profile.json`, `skills.json`, `projects.json`, `experience.json` — replace the `TODO:` placeholder values with your real content. These are read directly by the MCP tools (`Portfolio.Api/MCP/Tools/`) and the `GET /api/profile|skills|projects|experience` endpoints.
- `resume.pdf` — **not created yet.** Drop your real resume PDF here once you have it; Phase 3 (RAG ingestion) will extract, chunk, embed and index its text into Qdrant.
