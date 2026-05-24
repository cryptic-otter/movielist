// Shared Supabase client + helpers for the serverless API layer.
// Reads credentials from Vercel environment variables (never hardcoded).
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let client = null;

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.'
    );
  }
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}

// Send a JSON response with the given status code.
function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(body));
}

// Parse a JSON request body (Vercel usually does this, but be defensive
// for raw string bodies too).
function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }
  return req.body;
}

// Whitelist + coerce incoming entry fields to match the table schema.
function sanitizeEntry(input) {
  const out = {};
  if (input.title !== undefined) out.title = String(input.title).trim();
  if (input.year !== undefined)
    out.year = input.year === null || input.year === '' ? null : parseInt(input.year, 10);
  if (input.genre !== undefined)
    out.genre = input.genre === null || input.genre === '' ? null : String(input.genre).trim();
  if (input.type !== undefined)
    out.type = input.type === '' ? null : input.type;
  if (input.status !== undefined)
    out.status = input.status === '' ? null : input.status;
  if (input.watch_date !== undefined)
    out.watch_date = input.watch_date === '' ? null : input.watch_date;
  if (input.rating !== undefined)
    out.rating =
      input.rating === null || input.rating === '' ? null : parseInt(input.rating, 10);
  if (input.notes !== undefined)
    out.notes = input.notes === '' ? null : String(input.notes);
  return out;
}

module.exports = { getSupabase, sendJson, parseBody, sanitizeEntry };
