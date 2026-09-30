# Drawing Portfolio

A static drawing portfolio with no build step. It is hosted on Cloudflare Pages.

## Add your drawings

1. Copy your scans or photos into `images/`. Use JPG or WebP, about 2000px on the long edge.
2. Open `drawings.js` and add one line per drawing:
   ```js
   { src: "images/harbor.jpg", title: "Harbor", year: 2026, medium: "Ink on paper", series: "Places" },
   ```
3. Delete the `images/sample-*.svg` placeholders and their entries.
4. Change `artist`, `tagline`, `about`, and `email` at the top of `drawings.js`.

To preview, open `index.html` in a browser.

## Deploy to Cloudflare Pages

### Option A: connect GitHub (recommended, redeploys on every push)

1. Push this repo to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select this repository and use these settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
4. Click **Save and Deploy**. The site goes live at `https://<project>.pages.dev`.
5. Optional: add your own domain under **Custom domains**.

### Option B: upload directly with Wrangler

```sh
npx wrangler pages deploy . --project-name=portfolio
```
