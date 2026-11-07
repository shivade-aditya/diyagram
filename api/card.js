// GET /c/<code> (rewritten to /api/card?id=<code>) — the page with the saved card built in,
// and a WhatsApp/Open Graph preview that names the sender and receiver.
const fs = require('fs'), path = require('path');
const { send, STORE, redis, ID_RE } = require('./_lib');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let PAGE = null;
async function page(req) {
  if (PAGE) return PAGE;
  try { PAGE = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8'); return PAGE; } catch (e) {}
  const proto = req.headers['x-forwarded-proto'] || 'https';
  PAGE = await (await fetch(`${proto}://${req.headers.host}/index.html`)).text(); return PAGE;
}
module.exports = async (req, res) => {
  const q = req.query || Object.fromEntries(new URL(req.url, 'http://x').searchParams);
  const id = String(q.id || ''), home = () => { res.statusCode = 302; res.setHeader('Location', '/'); res.end(); };
  if (!ID_RE.test(id) || !STORE) return home();
  let card = null;
  try { const raw = await redis(['GET', 'card:' + id]); card = raw ? JSON.parse(raw) : null; } catch (e) { return send(res, 503, { error: 'Try again in a moment' }); }
  if (!card) return home();
  const to = card.to, from = card.from || 'Someone';
  const title = to ? `${to}, you've received a Diyagram from ${from} 🪔` : `${from} sent you a Diyagram 🪔`;
  const url = `https://${req.headers.host}/c/${id}`;
  let html = await page(req);
  html = html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(to ? `Happy Diwali, ${to}` : 'Happy Diwali')} · Diyagram</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${esc(url)}$2`)
    .replace('<body>', `<body>\n<script>window.__CARD=${JSON.stringify({ to: card.to, from: card.from, msg: card.msg }).replace(/</g, '\\u003c')};</script>`);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400');
  res.end(html);
};
