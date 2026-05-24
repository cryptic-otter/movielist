# Architecture

## Overview

Reel is a zero-build static web app backed by a thin serverless API and a managed Postgres database. There is no client framework and no bundler — `index.html` ships as-is.

## Components

```
┌─────────────────┐     fetch JSON      ┌──────────────────────┐    supabase-js   ┌──────────────┐
│   Browser       │  ───────────────►   │  Vercel Serverless   │  ─────────────►  │  Supabase    │
│  index.html     │                     │  Functions (/api)    │                  │  PostgreSQL  │
│  (HTML/CSS/JS)  │  ◄───────────────   │  Node.js runtime     │  ◄─────────────  │  entries     │
└─────────────────┘     JSON response   └──────────────────────┘    rows / error  └──────────────┘
```

### 1. Frontend (`index.html`)
- One file: markup, CSS (in `<style>`), and JS (in `<script>`).
- Renders a list/card view and a stats view; toggled client-side with no reload.
- Talks **only** to the `/api` routes via `fetch`. It never holds Supabase credentials.
- UI state (selected sort + filter) is persisted in `localStorage`. All entry data lives in Supabase.

### 2. API layer (`/api`)
- Vercel Node.js serverless functions.
- `api/_supabase.js` — creates a single Supabase client from `SUPABASE_URL` / `SUPABASE_ANON_KEY`, plus JSON-response, body-parsing, and field-sanitizing helpers.
- `api/entries.js` — `GET` (list all, newest first) and `POST` (create).
- `api/entries/[id].js` — `PUT` (update) and `DELETE` (by id).
- All endpoints validate input, return consistent `{ entries | entry | error }` JSON, and set appropriate HTTP status codes (400 validation, 404 not found, 405 method not allowed, 500 server/config).

### 3. Database (Supabase / PostgreSQL)
- Single `entries` table (see `DATA_MODEL.md`).
- RLS enabled; one policy grants the anon role full access (single-user app, no auth).

## Data Flow

1. On page load, the browser calls `GET /api/entries`. The function queries Supabase and returns all rows.
2. The frontend renders cards and computes stats entirely client-side from that one fetch.
3. Create / edit / delete actions call the corresponding API route, which writes to Supabase and returns the affected row. The frontend updates its in-memory `entries` array and re-renders — no full reload, no refetch.

## Hosting & Deploy

- **Host:** Vercel (static `index.html` + serverless `/api`).
- **Auto-deploy:** OFF. Deploys are manual via `npx vercel deploy [--prod] --yes`.
- **Secrets:** `SUPABASE_URL` and `SUPABASE_ANON_KEY` are stored as Vercel environment variables, injected into the serverless runtime at request time.

## Dependencies

- `@supabase/supabase-js` (server side only, in the API functions).
- No frontend dependencies — no CDN scripts required for core functionality.

## Design Decisions

- **API layer instead of direct client→Supabase:** keeps the data-access surface in one place and lets us add validation/server logic without exposing query logic to the browser. Matches the requirement for a "thin Node.js API layer."
- **Single fetch + client-side filter/sort/stats:** the dataset is small (personal use), so loading everything once and computing views in the browser is simpler and faster than round-tripping per filter.
- **localStorage only for UI state:** sort and filter selections persist locally; nothing authoritative is stored client-side.
