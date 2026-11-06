// POST /api/sign — signs a card link so it can't be edited afterwards.
const { CARD_SECRET, cardSig, readBody, send } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const b = await readBody(req);
  if (!CARD_SECRET) return send(res, 200, { s: null });
  send(res, 200, { s: cardSig(b.to, b.from, b.msg) });
};
