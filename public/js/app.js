// RouteWISELY driver map, minimal starter (see PRD for full features)
// Version 4.75

const RW4 = window.RW4;
let map, dotLayer, routePoints = [];
let currentRoute = RW4.ROUTES.find(r => r.id === RW4.DEFAULT_ROUTE_ID);

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 1800);
}

// Programmatic load of Google Maps JS API
function loadGoogleMaps(apiKey, mapId) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve(window.google.maps);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=geometry`;
    script.async = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Route picker UI
function populateRoutePicker() {
  const sel = document.getElementById('route-picker');
  RW4.ROUTES.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.name;
    sel.appendChild(opt);
  });
  sel.value = currentRoute.id;
  sel.onchange = () => {
    currentRoute = RW4.ROUTES.find(r => r.id === sel.value);
    loadRoute(currentRoute);
  };
}

// GeoJSON loader
async function fetchRoutePoints(route) {
  const res = await fetch(route.url);
  if (!res.ok) throw new Error("GeoJSON fetch failed");
  const gj = await res.json();
  // Only FeatureCollection<Point> supported in this starter
  if (!gj.features || gj.features.length === 0) throw new Error("No features in GeoJSON");
  return gj.features.map(f => ({
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    visited: false
  }));
}

// Canvas OverlayView for dots
class DotLayer extends google.maps.OverlayView {
  constructor(getPoints) {
    super();
    this.getPoints = getPoints;
    this.c = document.createElement('canvas');
    this.ctx = this.c.getContext('2d');
  }
  onAdd() { this.getPanes().overlayLayer.appendChild(this.c); }
  onRemove() { this.c.remove(); }
  draw() {
    const dpr = window.devicePixelRatio || 1;
    const mapDiv = this.getMap().getDiv();
    const cwCss = mapDiv.clientWidth, chCss = mapDiv.clientHeight;
    const cw = Math.ceil(cwCss * dpr), ch = Math.ceil(chCss * dpr);
    if (this.c.width !== cw || this.c.height !== ch) {
      this.c.width = cw; this.c.height = ch;
      this.c.style.width = cwCss + 'px';
      this.c.style.height = chCss + 'px';
    }
    const proj = this.getProjection();
    const b = this.getMap().getBounds(); if (!b || !proj) return;
    const swPx = proj.fromLatLngToDivPixel(b.getSouthWest());
    const nePx = proj.fromLatLngToDivPixel(b.getNorthEast());
    const originX = swPx.x, originY = nePx.y;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.clearRect(0, 0, cwCss, chCss);

    for (const p of this.getPoints()) {
      const llPx = proj.fromLatLngToDivPixel(new google.maps.LatLng(p.lat, p.lng));
      const x = llPx.x - originX, y = llPx.y - originY;
      if (x < -6 || y < -6 || x > cwCss + 6 || y > chCss + 6) continue;
      this.ctx.beginPath();
      this.ctx.fillStyle = p.visited ? "#2ecc40" : "#ff4136";
      this.ctx.arc(x, y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}

async function loadRoute(route) {
  showToast("Loading route...");
  try {
    routePoints = await fetchRoutePoints(route);
    showToast(`Loaded ${routePoints.length} points`);
    if (dotLayer) dotLayer.setMap(null);
    dotLayer = new DotLayer(() => routePoints);
    dotLayer.setMap(map);
    map.setCenter(route.center);
    map.setZoom(route.zoom);
    updateCounter();
  } catch (e) {
    showToast("Failed to load route data");
    routePoints = [];
    if (dotLayer) dotLayer.setMap(null);
  }
}

function updateCounter() {
  const driven = routePoints.filter(p => p.visited).length;
  document.getElementById('counter').textContent =
    `Driven: ${driven} / ${routePoints.length}`;
}

// Basic "Start" and "Following" logic
let following = false;
document.getElementById('start-btn').onclick = () => {
  if (!navigator.geolocation) return showToast("Geolocation not supported");
  showToast("Following enabled");
  following = true;
  document.getElementById('following-btn').textContent = "Following: ON";
  navigator.geolocation.watchPosition(handlePosition, err => showToast("Location denied"), {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 6000
  });
};

document.getElementById('following-btn').onclick = () => {
  following = !following;
  document.getElementById('following-btn').textContent = "Following: " + (following ? "ON" : "OFF");
};

function handlePosition(pos) {
  const { latitude, longitude } = pos.coords;
  if (following) {
    map.setCenter({ lat: latitude, lng: longitude });
    // TODO: set map heading/tilt per PRD (requires Maps v3.50+ and MapId)
  }
  // TODO: dot flip logic: if within VISIT_RADIUS_M, set visited = true
  updateCounter();
}

(async () => {
  populateRoutePicker();
  const API_KEY = "__API_KEY__"; // replaced at build by GitHub Actions
  await loadGoogleMaps(API_KEY, RW4.MAP_ID);
  map = new google.maps.Map(document.getElementById('map'), {
    center: currentRoute.center,
    zoom: currentRoute.zoom,
    mapId: RW4.MAP_ID || undefined,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });
  loadRoute(currentRoute);
})();