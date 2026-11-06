# Diyagram

A Diwali wish you send as a link: light three diyas to receive blessings from Ganesha, Saraswati and Lakshmi, then read the sender's message. Makers pay once (₹3) to make their own cards.

## Files
- `index.html` is the whole page (no build step). Videos and pendant stills sit next to it. When a video changes, give the new file a new name so phones don't keep the old one.
- `api/` holds the Vercel functions for payments and card links:
  - `config` tells the page which payment mode is on and the price
  - `order` creates a Razorpay order
  - `verify` checks Razorpay's payment signature and returns an unlock token
  - `sign` signs a card link for a paid maker
  - `check` tells the page whether a card link is genuine (edited links show the default card)

## Turning on Razorpay
In Vercel → Project → Settings → Environment Variables, add:

| Name | Value |
|---|---|
| `RAZORPAY_KEY_ID` | `rzp_test_...` first, `rzp_live_...` once your account is activated |
| `RAZORPAY_KEY_SECRET` | the matching key secret |
| `CARD_SECRET` | any long random string; set once and never change it, or old card links stop showing their message |
| `CARD_PRICE_INR` | optional, defaults to `3` |

Then redeploy (Deployments → ⋯ → Redeploy). In the Razorpay dashboard, make sure payments are captured automatically.

Without Razorpay keys the page falls back to a direct UPI payment to `UPI_ID` with an "I've paid" button.

Card links look like `?to=Priya&from=Rahul&msg=...&s=...`; `s` is the server's signature.
