# RouteWISELY Driver Map

A driver-first Google Maps app for field navigation — fast, mobile-friendly, and easy to deploy on GitHub Pages.

## Quick Start

1. **Fork/clone this repo.**
2. **Add your [Google Maps API key](https://console.cloud.google.com/apis/credentials)** as `GOOGLE_MAPS_API_KEY` in GitHub → Settings → Secrets and variables → Actions.
3. *(Optional)* Add a custom vector map ID as `GOOGLE_MAP_ID`.
4. **Push to `main`**. GitHub Actions will generate `public/config.js` and deploy to Pages.
5. **Open your published site** at `https://<user>.github.io/<repo>/`.

## Project Structure

```
/
├─ public/
│  ├─ index.html
│  ├─ config.template.js
│  ├─ config.js      # generated at build, never committed
│  ├─ css/style.css
│  └─ js/app.js
├─ .github/workflows/pages.yml
└─ README.md
```

## Product Requirements

*Full PRD below (see source).*

- Google Maps JS API, vector basemap
- Public GeoJSON from GCS (Avon & Grafton routes)
- Canvas overlay dots (red → green)
- Mobile “heading up”, driver-centered
- No secrets committed; deploy with GitHub Actions
- CSP compliant for GitHub Pages

---