# Diyagram

A Diwali wish you send as a link: light three diyas to receive blessings from Ganesha, Saraswati and Lakshmi, then read the sender's message. Anyone can make their own card for free; a "Support the maker" box takes optional UPI thank-yous.

## Files
- `index.html` is the whole page (no build step). Videos and pendant stills sit next to it. When a video changes, give the new file a new name so phones don't keep the old one.
- Support the maker: optional UPI payment straight to `UPI_ID` (set near the top of the script in `index.html`), with ₹3 / ₹11 / ₹21 / other amounts, any-app, GPay / PhonePe / Paytm buttons, a QR code and the UPI ID to copy.
- `api/` holds two small Vercel functions for card links:
  - `sign` signs a card link
  - `check` tells the page whether a card link is genuine (edited links show the default card)
  - `config` says whether signing is on

- `qrcode.js` is qrcode-generator 2.0.4 (MIT, Kazuhiko Arase), used for the UPI QR code.

## Settings
In Vercel → Project → Settings → Environment Variables:

| Name | Value |
|---|---|
| `CARD_SECRET` | any long random string; set once and never change it, or old card links stop showing their message |

Redeploy after changing these (Deployments → ⋯ → Redeploy).

Card links look like `?to=Priya&from=Rahul&msg=...&s=...`; `s` is the server's signature.
