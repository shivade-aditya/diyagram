// Shared helpers for the Diyagram payment functions (files starting with "_" are not deployed as endpoints).
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RAZORPAY_KEY_ID      rzp_test_... or rzp_live_...
//   RAZORPAY_KEY_SECRET  the matching secret (never put it in the page or the repo)
//   CARD_SECRET          optional: any long random string used to sign card links.
//                        Set it once and keep it, so links stay valid when you switch test → live keys.
//   CARD_PRICE_INR       optional: price in rupees (default 3)
const crypto = require('crypto');

const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY = Boolean(KEY_ID && KEY_SECRET);
const PRICE = Math.max(1, parseInt(process.env.CARD_PRICE_INR || '3', 10) || 3);
const CARD_SECRET = process.env.CARD_SECRET ||
  (KEY_SECRET ? crypto.createHmac('sha256', KEY_SECRET).update('diyagram-card-v1').digest('hex') : '');

const hmac = (key, text) => crypto.createHmac('sha256', key).update(text).digest('base64url');
function safeEqual(a, b) {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}
// Must match how the page trims the fields (to 30, from 30, msg 150).
const canon = (to, from, msg) => [to, from, msg].map((v, i) => String(v || '').trim().slice(0, i < 2 ? 30 : 150)).join('\n');
const cardSig = (to, from, msg) => hmac(CARD_SECRET, 'card1:' + canon(to, from, msg)).slice(0, 22);
const makeToken = paymentId => `${paymentId}.${hmac(CARD_SECRET, 'unlock1:' + paymentId).slice(0, 32)}`;
function tokenOk(token) {
  const t = String(token || ''), i = t.lastIndexOf('.');
  return CARD_SECRET !== '' && i > 0 && safeEqual(makeToken(t.slice(0, i)), t);
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  const chunks = []; for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch (e) { return {}; }
}
function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}
const razorpayAuth = () => 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

module.exports = { KEY_ID, KEY_SECRET, RAZORPAY, PRICE, CARD_SECRET, hmac, safeEqual, cardSig, makeToken, tokenOk, readBody, send, razorpayAuth };
