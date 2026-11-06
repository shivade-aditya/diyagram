// POST /api/sign — signs a card link. With Razorpay on, only for makers holding a paid unlock token.
const { RAZORPAY, CARD_SECRET, cardSig, tokenOk, readBody, send } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const b = await readBody(req);
  if (RAZORPAY && !tokenOk(b.token)) return send(res, 402, { error: 'Payment required' });
  if (!CARD_SECRET) return send(res, 200, { s: null });
  send(res, 200, { s: cardSig(b.to, b.from, b.msg) });
};
