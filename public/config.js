window.RW4 = {
  MAP_ID: "__MAP_ID__",
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