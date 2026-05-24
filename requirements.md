# Movie List — Requirements

## Overview
A personal movie and TV show tracker for keeping a full history of everything watched and a wishlist of things to watch next. Built as a clean, nice-looking web app with vanilla HTML/CSS/JS, Supabase for storage, and deployed on Vercel. Designed for solo use — no accounts, no sharing.

## Users
Single user (personal use). No authentication required unless Supabase row-level access needs to be locked down.

## Core Features

- **Add entries** — manually enter title, year, genre, type (movie or TV show), watch status, watch date, personal rating (1–10), and optional notes
- **Watch status tracking** — three states: Watched, Want to Watch, Currently Watching
- **Browse list** — scrollable, visually appealing list of all entries grouped or filtered by status
- **Sort options** — sort by date added, watch date, rating, release year, or alphabetically by title
- **Stats & insights** — total watched count, favorite genres (by frequency), average rating, movies vs. shows breakdown, watches per month/year
- **Edit & delete entries** — update any field or remove an entry from the list

## Data Model (Draft)

**Entry**
- `id` — UUID, primary key
- `title` — text, required
- `year` — integer (release year)
- `genre` — text (e.g. "Drama", "Sci-Fi") — single genre or comma-separated
- `type` — enum: `movie` | `tv_show`
- `status` — enum: `watched` | `want_to_watch` | `currently_watching`
- `watch_date` — date (nullable — only set when status is `watched`)
- `rating` — integer 1–10 (nullable)
- `notes` — text (nullable)
- `created_at` — timestamp

## User Flows

**1. Add a new entry**
1. Click "Add" button
2. Fill in title, year, genre, type, and status
3. If status is "Watched", optionally set watch date and rating
4. Optionally add notes
5. Submit — entry appears in the list immediately

**2. Browse and filter the list**
1. Open the app — default view shows all entries
2. Use status tabs (All / Watched / Want to Watch / Currently Watching) to filter
3. Use sort dropdown to reorder (date added, rating, year, title)
4. Click any entry to view or edit its details

**3. View stats**
1. Navigate to the Stats view
2. See total watched count, genre breakdown, average rating, movie vs. show split
3. See a monthly/yearly watch count chart or summary

## UI & UX Requirements

- **Device**: Responsive — works well on both phone and desktop
- **Polish**: Nice-looking — good typography, clean card layout, enjoyable to open daily
- **No framework**: Vanilla HTML/CSS/JS only — no React, Vue, or similar
- **Fast interactions**: Inline editing preferred over full-page reloads where possible
- **Color/style**: Up to implementation — suggest a dark or neutral theme fitting a media app

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Vanilla HTML + CSS + JavaScript | No framework overhead; direct control over markup and style |
| API | Node.js Vercel Serverless Functions | Thin API layer for Supabase operations; runs on Vercel natively |
| Database | Supabase (PostgreSQL) | Managed Postgres with a simple REST/JS SDK; free tier covers personal use |
| Hosting | Vercel | Zero-config deployment; works naturally with serverless functions |

## Out of Scope (v1)

- User authentication / multi-user support
- Auto-fill from TMDB, IMDB, or any external API
- Social features (sharing lists, following others)
- Mobile app (native iOS/Android)
- Import from Letterboxd, IMDB, or other services
- Episode-level tracking for TV shows
- Recommendations engine

## Open Questions

- Should genre be a free-text field or a fixed dropdown list? (Fixed list is more consistent for stats; free text is faster to enter)
- Should ratings be 1–5 stars (simpler UX) or 1–10 (more granular)? Defaulting to 1–10 but easy to change.
- Is Supabase anon key access acceptable (no login), or should entries be protected behind a Supabase auth user?
