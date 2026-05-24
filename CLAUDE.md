# CLAUDE.md — movielist (Reel)

Project guidance for AI agents working in this repo. Read this before making changes.

## What this is

A personal movie & TV tracker. Zero-build static frontend + thin serverless API + Supabase Postgres, hosted on Vercel. Single-user, no auth.

## Stack & conventions

- **Frontend:** one file, `index.html` — HTML, CSS (in `<style>`), and JS (in `<script>`) together. No framework, no build step, no bundler. Keep it that way.
- **API:** Vercel Node.js serverless functions in `/api`. CommonJS (`require` / `module.exports`).
  - `api/_supabase.js` — shared client + helpers (`getSupabase`, `sendJson`, `parseBody`, `sanitizeEntry`). Reuse these; don't re-instantiate the client per route.
  - `api/entries.js` — GET list, POST create.
  - `api/entries/[id].js` — PUT update, DELETE.
- **DB:** Supabase. Single `entries` table. See `docs/DATA_MODEL.md`.
- **State split:** entry data lives in Supabase only. `localStorage` holds UI prefs only (`reel.sort`, `reel.filter`).
- The browser talks only to `/api`, never to Supabase directly. Credentials stay server-side.

## Supabase

- Project name: `movielist` — ref/id `ltwzvdqturckhqrgiyvh`, org `wrsesodksiglwxqghanr` (cryptic-otter apps), region `us-east-1`.
- URL: `https://ltwzvdqturckhqrgiyvh.supabase.co`
- Auth model: RLS enabled, one policy granting `anon` full access (single-user app).
- Apply schema changes via Supabase migrations and update `docs/DATA_MODEL.md` in the same change.

## Environment variables (Vercel)

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Deployment

- Host: Vercel. **Auto-deploy from GitHub is OFF** — deploy manually.
- Preview: `npx vercel deploy --yes`
- Production: `npx vercel deploy --prod --yes`
- GitHub repo: `cryptic-otter/movielist` (public).

## Documentation sync rules

When you change the app, update docs in the **same commit**:

- New/changed feature, usage, or setup → `README.md`
- New data flow, dependency, hosting/component change → `docs/ARCHITECTURE.md`
- New table/column/index/RLS change or new `localStorage` key → `docs/DATA_MODEL.md`
- Stack, schema, or deployment detail described here changed → this file

## Jira

- Project key `SCRUM` (board "movieproject") at https://nickcunningham096.atlassian.net
- Work tickets for the initial build: SCRUM-9 through SCRUM-21.
