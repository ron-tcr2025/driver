# RouteWISELY Driver Map

RouteWISELY Driver Map is a driver-first Google Maps web application for field navigation. It's a static HTML/CSS/JavaScript application designed to be deployed on GitHub Pages with no build dependencies.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Set up the development environment:
  ```bash
  # Create proper directory structure (takes <1 second)
  mkdir -p public/js public/css
  
  # Copy files to expected locations (takes <1 second)  
  cp app.js public/js/
  cp style.css public/css/
  cp config.template.js public/config.js
  ```

- Run the application locally:
  ```bash
  # Start local development server (takes <1 second to start)
  cd public && python3 -m http.server 8000
  ```
  
- Access the application:
  - Open http://localhost:8000 in browser
  - LIMITATION: Google Maps will not load without a valid API key in config.js
  - UI elements (route picker, buttons) will appear but map area will be empty
  - Console will show "ReferenceError: google is not defined" - this is expected without API key

## Build Process

- **NO traditional build process required** - this is a static web application
- **NO package.json or Node.js dependencies** - uses only vanilla HTML/CSS/JavaScript
- Setup time: **Less than 1 second** for all file operations
- Server startup: **Less than 1 second**

## Deployment Process

The application is deployed via GitHub Actions (mentioned in README but workflow doesn't exist yet):
- GitHub Actions should process `config.template.js` → `config.js` 
- Replaces `__API_KEY__` with `GOOGLE_MAPS_API_KEY` secret
- Replaces `__MAP_ID__` with `GOOGLE_MAP_ID` secret (optional)
- Deploys to GitHub Pages

## Validation

- Always run basic server test after changes:
  ```bash
  cd public && python3 -m http.server 8000 &
  curl -I http://localhost:8000/
  curl -I http://localhost:8000/js/app.js
  curl -I http://localhost:8000/css/style.css
  curl -I http://localhost:8000/config.js
  pkill -f "python3 -m http.server"
  ```

- **Manual validation scenarios** (requires valid Google Maps API key):
  1. Load the application and verify route dropdown populates with "Grafton, MA" and "Avon, MA"
  2. Click "Start" button and verify geolocation prompt appears
  3. Toggle "Following: OFF/ON" button and verify state changes
  4. Select different routes and verify map recenters
  5. Verify map loads GeoJSON data from Google Cloud Storage URLs

## Project Structure

```
/
├─ public/                    # Main application directory
│  ├─ index.html             # Main HTML file
│  ├─ config.js              # Generated config (from template)
│  ├─ css/style.css          # Styles
│  └─ js/app.js              # Main application JavaScript
├─ config.template.js        # Config template (placeholders for GitHub Actions)
├─ app.js                    # Source JavaScript (copy to public/js/)
├─ style.css                 # Source CSS (copy to public/css/)
├─ index.html                # Root HTML (same as public/index.html)
└─ README.md                 # Project documentation
```

## Key Files and Locations

- **Main application**: `public/index.html` - Entry point with Google Maps integration
- **JavaScript logic**: `public/js/app.js` - Google Maps API, route handling, geolocation
- **Configuration**: `public/config.js` - API keys, route definitions, app settings
- **Styling**: `public/css/style.css` - Dark theme optimized for mobile drivers

## Common Tasks

### Repo root contents
```
DriverMap.js
DriverMaps.js
README.md
app.js
config.js
config.template.js
index.html
map-config.js
public/
style.css
```

### Configuration format
The `config.js` contains:
```javascript
window.RW4 = {
  MAP_ID: "a271e349a0eac829ce3ed843",
  ROUTES: [
    { id: "grafton", name: "Grafton, MA",
      url: "https://storage.googleapis.com/routewisely_geojson/grafton_ma.geojson",
      center: { lat: 42.207, lng: -71.685 }, zoom: 13 },
    { id: "avon", name: "Avon, MA", 
      url: "https://storage.googleapis.com/routewisely_geojson/avon_ma.geojson",
      center: { lat: 42.129, lng: -71.036 }, zoom: 14 }
  ],
  DEFAULT_ROUTE_ID: "grafton",
  VISIT_RADIUS_M: 25,
  PRESTART_REVEAL_M: 2500
};
```

### Known Issues and Workarounds

- **Google Maps API timing**: The app references `google.maps.OverlayView` at module load time, causing errors if API isn't loaded. This is a known limitation.
- **File structure**: Files exist in both root and public/ directories. Always work in public/ for testing.
- **API key required**: Application cannot be fully tested without valid Google Maps API key.

## Development Tips

- Always test changes with the local Python server
- The application is mobile-first and optimized for field drivers
- GeoJSON routes are loaded from Google Cloud Storage (public URLs)
- Use browser developer tools to monitor network requests for GeoJSON loading
- Check browser console for Google Maps API loading issues