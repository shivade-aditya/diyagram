// POST /api/order — creates a Razorpay order for the one-time card price.
const crypto = require('crypto');
const { RAZORPAY, KEY_ID, PRICE, readBody, send, razorpayAuth } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  if (!RAZORPAY) return send(res, 503, { error: 'Payments are not set up yet' });
  const body = await readBody(req);
  const maker = String(body.from || '').trim().slice(0, 30);
  try {
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: razorpayAuth(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: PRICE * 100, currency: 'INR',
        receipt: 'dg_' + Date.now().toString(36) + crypto.randomBytes(3).toString('hex'),
        notes: { product: 'Diyagram card unlock', maker }
      })
    });
    const j = await r.json();
    if (!r.ok || !j.id) return send(res, 502, { error: (j.error && j.error.description) || 'Could not create order' });
    send(res, 200, { orderId: j.id, amount: j.amount, currency: j.currency, keyId: KEY_ID });
  } catch (e) {
    send(res, 502, { error: 'Could not reach Razorpay' });
  }
};
