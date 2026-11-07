// POST /api/sign — makes the share link for a card.
// With storage connected: saves the card and returns a short link (/c/<code>).
// Always: returns a signature for the long form (?to=&from=&msg=&s=) as a fallback.
const { CARD_SECRET, cardSig, readBody, send, STORE, redis, newId, cleanCard } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const card = cleanCard(await readBody(req));
  const out = { s: CARD_SECRET ? cardSig(card.to, card.from, card.msg) : null, url: null };
  if (STORE) {
    for (let i = 0; i < 3 && !out.url; i++) {
      const id = newId();
      try { if (await redis(['SET', 'card:' + id, JSON.stringify({ ...card, t: Date.now() }), 'NX']) === 'OK') out.url = '/c/' + id; } catch (e) { break; }
    }
  }
  send(res, 200, out);
};
