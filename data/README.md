# Portfolio Data

This directory holds the structured content the API and MCP tools serve, and the resume the RAG pipeline indexes.

- `profile.json`, `skills.json`, `projects.json`, `experience.json` — filled in from Mohamed Hanifa's resume. Read directly by the MCP tools (`Portfolio.Api/MCP/Tools/`) and the `GET /api/profile|skills|projects|experience` endpoints.
- `resume.pdf` — **not the original file bytes.** The assistant only receives extracted text/images for PDFs pasted into chat, not the underlying file, so this is a clean re-rendering (via headless Chrome) of that same text, reordered where the original's text-extraction order was scrambled (bullets appeared before their company headers — corrected using the cross-references in the Projects section). All content is real and unaltered; only the layout/PDF bytes differ from the original file. **Replace this with the actual resume.pdf** (e.g. drag it into this folder) whenever convenient — RAG ingestion in Phase 3 just needs a real, text-extractable PDF here, so either works.

Two data points worth double-checking against the source:

- Synergein Technology LLC is listed as **Oct 2025 – Sep 2026** — an end date in the future relative to today. Kept as printed rather than assumed to mean "Present".
- No LinkedIn URL was on the resume, so `profile.json`'s `linkedin` field is left empty.
