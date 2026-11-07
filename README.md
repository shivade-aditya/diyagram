# Diyagram

A Diwali wish you send as a link: light three diyas to receive blessings from Ganesha, Saraswati and Lakshmi, then read the sender's message. Anyone can make their own card for free and send it on WhatsApp.

## Files
- `index.html` is the whole page (no build step). Videos and pendant stills sit next to it. When a video changes, give the new file a new name so phones don't keep the old one.
- `api/` holds three small Vercel functions for card links:
  - `sign` signs a card link
  - `check` tells the page whether a card link is genuine (edited links show the default card)
  - `config` says whether signing is on

## Install as an app
`manifest.webmanifest`, the icons and `sw.js` make the site installable: Chrome on Android offers
"Install app" (or the page's "Add Diyagram to your home screen" button), and on iPhone it's
Share → Add to Home Screen. It then opens full-screen with its own icon. `sw.js` keeps a copy of
the page and pictures so it reopens fast and works offline; videos and `/api` are left to the browser.
When changing `sw.js`, bump `CACHE` so phones drop the old copy.

## Settings
In Vercel → Project → Settings → Environment Variables:

| Name | Value |
|---|---|
| `CARD_SECRET` | any long random string; set once and never change it, or old card links stop showing their message |

Redeploy after changing these (Deployments → ⋯ → Redeploy).

Card links look like `?to=Priya&from=Rahul&msg=...&s=...`; `s` is the server's signature.
