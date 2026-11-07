// Shared helpers for the Diyagram card-link functions (files starting with "_" are not deployed as endpoints).
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   CARD_SECRET     any long random string used to sign card links. Set it once and never change it,
//                   or links people already shared stop showing their message.
//   KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)
//                   added automatically when an Upstash Redis store is connected in Vercel → Storage.
//                   With them, cards are saved and shared as short links: /c/k7Qp2xA
const crypto = require('crypto');

const CARD_SECRET = process.env.CARD_SECRET || '';

const hmac = (key, text) => crypto.createHmac('sha256', key).update(text).digest('base64url');
function safeEqual(a, b) {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}
// Must match how the page trims the fields (to 30, from 30, msg 200).
const canon = (to, from, msg) => [to, from, msg].map((v, i) => String(v || '').trim().slice(0, i < 2 ? 30 : 200)).join('\n');
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

// ---- Short links: cards saved in Redis under a random 7-character code
const R_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '');
const R_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const STORE = Boolean(R_URL && R_TOKEN);
async function redis(cmd) {
  const r = await fetch(R_URL, { method: 'POST', headers: { Authorization: `Bearer ${R_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error || `redis ${r.status}`);
  return j.result;
}
const ALPHA = '23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';   // no 0/O, 1/l/I
const newId = () => Array.from(crypto.randomBytes(7), b => ALPHA[b % ALPHA.length]).join('');
const ID_RE = /^[2-9a-zA-Z]{7}$/;
const cleanCard = b => ({ to: String(b.to || '').trim().slice(0, 30), from: String(b.from || '').trim().slice(0, 30), msg: String(b.msg || '').trim().slice(0, 200) });

module.exports = { CARD_SECRET, safeEqual, cardSig, readBody, send, STORE, redis, newId, ID_RE, cleanCard };
