// GET /api/check?to=&from=&msg=&s= — is this card link genuine? Without a signing secret, every link is accepted.
const { CARD_SECRET, cardSig, safeEqual, send } = require('./_lib');
module.exports = (req, res) => {
  const q = req.query || Object.fromEntries(new URL(req.url, 'http://x').searchParams);
  if (!CARD_SECRET) return send(res, 200, { ok: true });
  send(res, 200, { ok: safeEqual(cardSig(q.to, q.from, q.msg), String(q.s || '')) });
};
