// Beta waitlist for The Carousel Maker: stores one row per e-mail in Supabase.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in Vercel.');
    return res.status(500).json({ error: 'Server Configuration Error' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const email = String(body.email || '').trim().toLowerCase();
  const handle = String(body.handle || '').trim().replace(/^@+/, '').slice(0, 80);
  const volume = String(body.volume || '').trim().slice(0, 40);
  // Honeypot: real people never fill this hidden field.
  if (body.website) return res.status(200).json({ ok: true });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }

  const insert = await fetch(`${supabaseUrl}/rest/v1/carousel_beta_signups`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      email,
      handle: handle || null,
      weekly_volume: volume || null,
      source: 'site'
    })
  });

  // 409 = already on the list, which is fine from the visitor's point of view.
  if (insert.ok || insert.status === 409) {
    return res.status(200).json({ ok: true });
  }
  console.error('Supabase insert failed', insert.status, await insert.text());
  return res.status(500).json({ error: 'Não foi possível salvar agora' });
}
