// Item endpoint: PUT (update) and DELETE (remove) a single entry by id.
const { getSupabase, sendJson, parseBody, sanitizeEntry } = require('../_supabase');

module.exports = async function handler(req, res) {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (e) {
    return sendJson(res, 500, { error: e.message });
  }

  const { id } = req.query;
  if (!id) {
    return sendJson(res, 400, { error: 'Entry id is required.' });
  }

  // PUT /api/entries/:id -> update an existing entry.
  if (req.method === 'PUT') {
    const body = parseBody(req);
    const updates = sanitizeEntry(body);

    if ('title' in updates && !updates.title) {
      return sendJson(res, 400, { error: 'Title cannot be empty.' });
    }
    if (Object.keys(updates).length === 0) {
      return sendJson(res, 400, { error: 'No fields to update.' });
    }

    const { data, error } = await supabase
      .from('entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) return sendJson(res, 400, { error: error.message });
    if (!data) return sendJson(res, 404, { error: 'Entry not found.' });
    return sendJson(res, 200, { entry: data });
  }

  // DELETE /api/entries/:id -> delete an entry.
  if (req.method === 'DELETE') {
    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) return sendJson(res, 400, { error: error.message });
    return sendJson(res, 200, { success: true });
  }

  res.setHeader('Allow', 'PUT, DELETE');
  return sendJson(res, 405, { error: 'Method not allowed.' });
};
