# עִבְרִית — Real Hebrew

Learn to speak and read Hebrew with vocabulary, grammar drills, and practice games.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages** → Source: **Deploy from branch**
3. Branch: `main` (or `master`) → `/ (root)` → Save
4. Your app will be at `https://<username>.github.io/<repo>/`

## Install on Your Phone

1. Open the app in Safari (iOS) or Chrome (Android).
2. **iOS:** Tap Share → Add to Home Screen
3. **Android/Chrome:** Tap the menu → "Install app" or "Add to Home Screen"
4. The install banner may appear automatically after a few visits.

## Icon Setup (Optional)

For the install banner to show icons, generate PNGs:

1. Open `make-icons.html` in your browser.
2. Click to download `icon-192.png` and `icon-512.png`.
3. Place them in the repo root next to `hebrew-v8.2.html`.
4. Commit and push.

The app works without PNGs (uses SVG); PNGs improve install UX on some devices.

## Local Development

Serve over HTTP (required for service worker):

```bash
# Python
python -m http.server 8080
# Open http://localhost:8080/hebrew-v8.2.html

# Node (npx)
npx serve .
```

Do not open `file://` directly — the service worker and some features won't work.
