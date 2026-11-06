// GET /api/config — tells the page which payment mode is on and the price.
const { RAZORPAY, KEY_ID, PRICE, CARD_SECRET, send } = require('./_lib');
module.exports = (req, res) => send(res, 200, { pay: RAZORPAY ? 'razorpay' : 'upi', price: PRICE, keyId: RAZORPAY ? KEY_ID : null, signing: CARD_SECRET !== '' });
