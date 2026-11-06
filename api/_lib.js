// Shared helpers for the Diyagram card-link functions (files starting with "_" are not deployed as endpoints).
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   CARD_SECRET     any long random string used to sign card links. Set it once and never change it,
//                   or links people already shared stop showing their message.
//   CARD_PRICE_INR  optional: one-time price in rupees shown on the page (default 3)
const crypto = require('crypto');

const PRICE = Math.max(1, parseInt(process.env.CARD_PRICE_INR || '3', 10) || 3);
const CARD_SECRET = process.env.CARD_SECRET || '';

const hmac = (key, text) => crypto.createHmac('sha256', key).update(text).digest('base64url');
function safeEqual(a, b) {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}
// Must match how the page trims the fields (to 30, from 30, msg 150).
const canon = (to, from, msg) => [to, from, msg].map((v, i) => String(v || '').trim().slice(0, i < 2 ? 30 : 150)).join('\n');
const cardSig = (to, from, msg) => hmac(CARD_SECRET, 'card1:' + canon(to, from, msg)).slice(0, 22);

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

module.exports = { PRICE, CARD_SECRET, safeEqual, cardSig, readBody, send };
