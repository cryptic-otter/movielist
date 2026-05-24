// Collection endpoint: GET (list all) and POST (create).
const { getSupabase, sendJson, parseBody, sanitizeEntry } = require('./_supabase');

module.exports = async function handler(req, res) {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (e) {
    return sendJson(res, 500, { error: e.message });
  }

  // GET /api/entries -> list all entries (newest first by default).
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return sendJson(res, 500, { error: error.message });
    return sendJson(res, 200, { entries: data });
  }

  // POST /api/entries -> create a new entry.
  if (req.method === 'POST') {
    const body = parseBody(req);
    const entry = sanitizeEntry(body);

    if (!entry.title) {
      return sendJson(res, 400, { error: 'Title is required.' });
    }
    if (!entry.status) {
      return sendJson(res, 400, { error: 'Status is required.' });
    }

    const { data, error } = await supabase
      .from('entries')
      .insert(entry)
      .select()
      .single();
    if (error) return sendJson(res, 400, { error: error.message });
    return sendJson(res, 201, { entry: data });
  }

  res.setHeader('Allow', 'GET, POST');
  return sendJson(res, 405, { error: 'Method not allowed.' });
};
