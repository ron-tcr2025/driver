import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useEffect, useState } from 'react';

function DriverMap({ geojsonUrl }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(geojsonUrl)
      .then(res => res.json())
      .then(setData);
  }, [geojsonUrl]);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{height: "400px", width: "100%"}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data && <GeoJSON data={data} />}
    </MapContainer>
  );
}

export default DriverMap;