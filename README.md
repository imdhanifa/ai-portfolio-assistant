# Portfolio (Next.js)

A Next.js 16 (App Router, TypeScript, Tailwind CSS v4) rebuild of the portfolio site, with a light/dark theme
toggle and content fetched dynamically from **Portfolio.Api** (described by `v1.json`).

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit NEXT_PUBLIC_API_URL if needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connecting to Portfolio.Api

Set `NEXT_PUBLIC_API_URL` in `.env.local` to the API's base URL — it defaults to
`https://localhost:7103`, matching the `servers` entry in `v1.json`. The home page
(`src/app/page.tsx`) calls these endpoints on every request:

| Endpoint            | Used for                        |
| -------------------- | -------------------------------- |
| `GET /api/profile`   | Hero section, footer contact info |
| `GET /api/skills`    | "Core Expertise" cards, grouped by each skill's `category` |
| `GET /api/projects`  | "Featured Projects" grid |
| `GET /api/experience`| Work experience timeline |
| `GET /api/education` | Education timeline |
| `GET /api/resume/pdf`| "Download Resume" link |
| `POST /api/Chat`     | Floating chat widget (bottom-right) |

If a request fails (API not running, network error, non-2xx response) the affected section falls
back to local placeholder content in [`src/lib/fallback-data.ts`](src/lib/fallback-data.ts) instead
of breaking the page — useful for working on the UI without the backend running.

> **Dev-cert note:** `https://localhost:7103` typically uses ASP.NET Core's self-signed dev
> certificate. Node's `fetch` will reject it unless you trust that cert locally (`dotnet dev-certs
> https --trust`) or point `NEXT_PUBLIC_API_URL` at an HTTP/trusted origin instead.

### Data shapes

`v1.json` only documents `200 OK` for the profile/skills/projects/experience/education endpoints
(no response schema), so [`src/types/api.ts`](src/types/api.ts) defines the shape this frontend
expects. Every field it renders is optional, so the UI degrades gracefully as the real API's
response shape evolves — update the types there to match once the backend's schemas are finalized.

## Theme

Light/dark mode is handled by [`next-themes`](https://github.com/pacocoursey/next-themes)
(`src/components/theme-provider.tsx`), toggled from the header (`src/components/theme-toggle.tsx`).
It defaults to dark and respects the visitor's OS preference. Tailwind v4's `dark:` variant is
re-pointed at the `.dark` class in `src/app/globals.css` (`@custom-variant dark`) so the toggle
works independent of `prefers-color-scheme`.

## Project structure

```
src/
  app/            # Route (page, layout, global styles)
  components/     # Header, Hero, Skills/Projects/Experience sections, Footer, ChatWidget, theme
  lib/            # api.ts (server-side fetchers), chat-client.ts (client fetch for /api/Chat)
  types/          # TypeScript types for the API's request/response shapes
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint
