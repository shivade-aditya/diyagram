# Diyagram

A Diwali wish you send as a link: light three diyas to receive blessings from Ganesha, Saraswati and Lakshmi, then read the sender's message.

- `index.html` is the whole site (no build step).
- Videos and pendant stills sit next to it. When a video changes, give the new file a new name so phones don't keep the old one.
- Card links carry the card in the address: `?to=Priya&from=Rahul&msg=...`
- `CARD_PRICE` and `UPI_ID` are set near the top of the script in `index.html`.

Deploy: import this repo on Vercel with the "Other" preset; every push to `main` goes live.
