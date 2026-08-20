# Portfolio Data

This directory holds the structured content the API and MCP tools serve, plus the resume PDF the site offers for download.

- `profile.json`, `skills.json`, `projects.json`, `experience.json` — filled in from Mohamed Hanifa's resume. Read directly by the MCP tools (`Portfolio.Api/MCP/Tools/`) and the `GET /api/profile|skills|projects|experience` endpoints — this is what the AI assistant's answers are actually grounded in (the project is Grok-only, no RAG/embeddings pipeline).
- `resume.pdf` — **not the original file bytes.** The assistant only receives extracted text/images for PDFs pasted into chat, not the underlying file, so this is a clean re-rendering (via headless Chrome) of that same text, reordered where the original's text-extraction order was scrambled (bullets appeared before their company headers — corrected using the cross-references in the Projects section). All content is real and unaltered; only the layout/PDF bytes differ from the original file. Only used as a downloadable file on the Resume page — replace with the actual resume.pdf whenever convenient.

Two data points worth double-checking against the source:

- Synergein Technology LLC is listed as **Oct 2025 – Sep 2026** — an end date in the future relative to today. Kept as printed rather than assumed to mean "Present".
- No LinkedIn URL was on the resume, so `profile.json`'s `linkedin` field is left empty.
