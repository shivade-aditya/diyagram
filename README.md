# Diyagram

A Diwali wish you send as a link: light three diyas to receive blessings from Ganesha, Saraswati and Lakshmi, then read the sender's message. Makers pay once (₹3, by UPI) to make their own cards.

## Files
- `index.html` is the whole page (no build step). Videos and pendant stills sit next to it. When a video changes, give the new file a new name so phones don't keep the old one.
- Payment: makers pay a one-time price by UPI straight to `UPI_ID` (set near the top of the script in `index.html`), using any UPI app or the Google Pay / PhonePe / Paytm buttons. They get their link as soon as they come back to the page.
- `api/` holds two small Vercel functions for card links:
  - `sign` signs a card link
  - `check` tells the page whether a card link is genuine (edited links show the default card)
  - `config` returns the price and whether signing is on

## Settings
In Vercel → Project → Settings → Environment Variables:

| Name | Value |
|---|---|
| `CARD_SECRET` | any long random string; set once and never change it, or old card links stop showing their message |
| `CARD_PRICE_INR` | optional, defaults to `3` |

Redeploy after changing these (Deployments → ⋯ → Redeploy).

Card links look like `?to=Priya&from=Rahul&msg=...&s=...`; `s` is the server's signature.
