const geojsonLinks = [
  "https://storage.googleapis.com/your-bucket-name/driver1.geojson",
  "https://storage.googleapis.com/your-bucket-name/driver2.geojson"
];

// Example: Fetch and display a map for each link
geojsonLinks.forEach(link => {
  fetch(link)
    .then(res => res.json())
    .then(data => {
      // Use your mapping library (like Leaflet or Mapbox) to display the data
      console.log("Loaded GeoJSON data:", data);
    });
});