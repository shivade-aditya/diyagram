// GET /api/config — whether card links are being signed.
const { CARD_SECRET, send } = require('./_lib');
module.exports = (req, res) => send(res, 200, { signing: CARD_SECRET !== '' });
