// POST /api/verify — checks Razorpay's payment signature and returns an unlock token.
// Signature = HMAC-SHA256(order_id + "|" + payment_id, key_secret), hex (Razorpay standard checkout).
const crypto = require('crypto');
const { RAZORPAY, KEY_SECRET, safeEqual, makeToken, readBody, send } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  if (!RAZORPAY) return send(res, 503, { error: 'Payments are not set up yet' });
  const b = await readBody(req);
  const orderId = String(b.razorpay_order_id || ''), paymentId = String(b.razorpay_payment_id || ''), sig = String(b.razorpay_signature || '');
  if (!orderId || !paymentId || !sig) return send(res, 400, { error: 'Missing payment details' });
  const expected = crypto.createHmac('sha256', KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  if (!safeEqual(expected, sig)) return send(res, 400, { error: 'Payment could not be verified' });
  send(res, 200, { token: makeToken(paymentId) });
};
