# Pulse Music - Landing Page

A complete, production-quality responsive landing website for "PULSE MUSIC", a modern Android music streaming application.

## Features
- HTML5, CSS3, Vanilla JavaScript
- Fully Responsive (Mobile, Tablet, Desktop)
- Hi-Fi / Analog Audio Aesthetic
- No frameworks used (No React, Tailwind, Bootstrap)
- Lightweight & Fast
- **Dynamic Download Tracker**: Automatically fetches the latest APK and exact download count using the GitHub Releases API.
- **Live Developer Fetching**: Pulls live developer profile data directly from GitHub.

## Structure
```
pulse-landing/
│
├── index.html        # Main HTML file
├── css/
│   └── style.css     # CSS styles
├── js/
│   └── main.js       # Vanilla JS for interactions
├── assets/           # Directory for assets (SVGs, Images)
└── README.md
```

## How to Test
Simply open `index.html` in your web browser. Or, run a local development server:
```bash
cd pulse-landing
npx serve .
# or
python3 -m http.server
```

## Configuration
Update the download and GitHub links in `js/main.js`:
```javascript
const CONFIG = {
  DOWNLOAD_URL: "https://your-download-link.com",
  GITHUB_URL: "https://github.com/your-repo"
};
```
