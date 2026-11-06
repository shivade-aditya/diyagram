// GET /api/config — the one-time price and whether card links are being signed.
const { PRICE, CARD_SECRET, send } = require('./_lib');
module.exports = (req, res) => send(res, 200, { pay: 'upi', price: PRICE, signing: CARD_SECRET !== '' });
