# Pulse Music — Landing Website

Static marketing site for **Pulse Music**, an open-source Android music player with multi-source streaming, offline playback, and Pulse JAM synchronized listening rooms.

- **Canonical host:** https://pulseapp-music.vercel.app
- **Mirror:** GitHub Pages (`chriz-3656.github.io/pulse-landing`) — canonical tags and the sitemap always point to the Vercel host.
- **Tracking app version:** v2.7.1

## Stack

HTML5, CSS3, and vanilla JavaScript. There is no build step and no framework. The only runtime dependencies are Google Fonts, the GitHub REST API, GitHub's star/fork button script, and `marked.js` on the changelog page.

## Site structure

Canonical pages live in trailing-slash directories:

```
/                       index.html
/about/                 about/index.html
/changelog/             changelog/index.html
/privacy/               privacy/index.html
/terms/                 terms/index.html
/404.html               custom not-found page (noindex)
```

The root files `about.html`, `changelog.html`, `privacy.html`, and `terms.html` are intentionally minimal redirect stubs. They carry `noindex`, a canonical link to the clean URL, and a meta-refresh/JS redirect for static hosts that cannot apply server redirects. Do not add content to them.

All internal links use clean URLs and page-relative paths, so the same files work both at the Vercel domain root and under the GitHub Pages `/pulse-landing/` subpath. `404.html` keeps root-absolute links because Vercel serves it at arbitrary paths, and includes a small rewrite for the GitHub Pages mirror.

## Redirects and clean URLs

- `vercel.json`: `cleanUrls` + `trailingSlash`, plus permanent redirects from `/index.html` and the four legacy `.html` paths.
- `_redirects` (Netlify-compatible hosts): 301 redirects for the same paths.
- `robots.txt` points to the Vercel sitemap, and `sitemap.xml` lists only canonical trailing-slash URLs with `lastmod` dates.

## Local preview

```bash
cd pulse-landing
python3 -m http.server 8000
# http://localhost:8000/
```

The redirect and clean-URL rules are host-level features, so a plain static server will show `/about/index.html` rather than redirecting `/about.html`. Use `vercel dev` or Netlify's redirect emulation if you need to test those rules locally.

## Deployment

1. Deploy this directory as the project root on Vercel (framework preset: Other, no build command).
2. Keep `cleanUrls` and `trailingSlash` enabled.
3. For the GitHub Pages mirror, publish the same files and leave the canonical/OG tags pointed at the Vercel host.
4. Before release, confirm the latest GitHub release/APK through the site's dynamic links or the repository's Releases page.

## JavaScript behavior

- Fetches the latest release and developer profile from the public GitHub API.
- Caches those responses in `localStorage` for 10 minutes to stay within the unauthenticated rate limit (60 requests/hour/IP). No token is used or exposed.
- Falls back to static links and text if the API is unavailable.
- Stores the selected colorway in `localStorage` (`pulse_deck_theme`).

## Privacy

The privacy policy (`/privacy/`) documents local library storage, third-party streaming requests, Firebase Realtime Database/Auth for Pulse JAM rooms, GitHub update/download requests, remote configuration, and the website's use of Google Fonts/GitHub APIs/localStorage.

## License

- **This website:** GNU General Public License v3.0 — see [`LICENSE`](LICENSE) in the repository. The site serves the same text as [`LICENSE.txt`](LICENSE.txt) and links to that file directly, because Vercel's `trailingSlash` setting makes extensionless `/LICENSE` unreliable. `vercel.json` also redirects `/LICENSE` and `/LICENSE/` to `/LICENSE.txt`.
- **Pulse Music Android app:** GNU General Public License v3.0, matching the app repository: https://github.com/chriz-3656/Pulse-Music

The app and website are unofficial clients and are not affiliated with YouTube, Google, JioSaavn, SoundCloud, or Firebase.
