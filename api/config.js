// GET /api/config — whether card links are signed and whether short links are on.
const { CARD_SECRET, STORE, send } = require('./_lib');
module.exports = (req, res) => send(res, 200, { signing: CARD_SECRET !== '', shortLinks: STORE });
