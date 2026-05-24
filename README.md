# Reel — Movie &amp; TV Tracker

A personal movie and TV show tracker. Keep a full history of everything you've watched, a wishlist of what's next, and see insights about your viewing habits. Built as a zero-build static app with a thin serverless API.

## Features

- **Add entries** — title, release year, genre, type (movie / TV show), watch status, watch date, rating (1–10), and notes
- **Watch status** — three states: Watched, Want to Watch, Currently Watching (color-coded on each card)
- **Browse** — responsive card grid that works on phone and desktop, with an empty state when there's nothing yet
- **Filter** — status tabs (All / Watched / Want to Watch / Currently Watching) with live counts
- **Sort** — by date added, watch date, rating, release year, or title (A–Z); persists across filter changes
- **Edit & delete** — update any field via the modal, or delete with a confirmation prompt
- **Stats** — total watched, average rating, movie vs. TV split, top genres, and watch counts per year and per month

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Vanilla HTML + CSS + JavaScript (single `index.html`, no framework, no build step) |
| API | Node.js Vercel Serverless Functions (`/api`) |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |

The browser never talks to Supabase directly — all reads/writes go through the `/api` serverless functions, which hold the Supabase credentials as environment variables.

## Project Structure

```
movielist/
├── index.html          # Entire UI: markup, styles, and app logic
├── api/
│   ├── _supabase.js    # Shared Supabase client + request helpers
│   ├── entries.js      # GET (list) + POST (create)
│   └── entries/
│       └── [id].js     # PUT (update) + DELETE (remove) by id
├── package.json        # @supabase/supabase-js dependency
├── vercel.json         # Routing for the dynamic [id] function
└── docs/               # Architecture & data-model documentation
```

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/entries` | List all entries (newest first) |
| POST | `/api/entries` | Create an entry (`title` + `status` required) |
| PUT | `/api/entries/:id` | Update an entry |
| DELETE | `/api/entries/:id` | Delete an entry |

All responses are JSON. Errors return `{ "error": "..." }` with an appropriate HTTP status.

## Environment Variables

Set these in Vercel (Project Settings → Environment Variables):

| Name | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon / publishable key |

## Local Development

```bash
npm install
npx vercel dev      # serves index.html + /api with env vars pulled from the linked project
```

## Deployment

Vercel is **not** connected to GitHub auto-deploy — deploy manually:

```bash
npx vercel deploy --yes              # preview
npx vercel deploy --prod --yes       # production
```

## Notes

This is a single-user personal app — there is no authentication. The Supabase `entries` table has RLS enabled with a policy allowing the anon key full access. Do not store sensitive data.
