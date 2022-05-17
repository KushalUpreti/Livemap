import mapboxgl from "mapbox-gl";
import { useRef, useEffect, useState } from "react";
import countries from "./utils/countries.json";
import { traverseObject } from "./utils/utilityFunctions";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaWN5aG90c2hvdG8iLCJhIjoiY2tmeHQwc3E5MjRxajJxbzhmbDN1bjJ5aiJ9.mNKmhIjRyKxFkJYrm4dMqg";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(75.2);
  const [lat, setLat] = useState(36.9);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      countries.features.forEach((element) => {
        plotPolygon(map.current, element);
      });
    });
  }, []);

  function plotPolygon(map, item) {
    const country = traverseObject("properties.ADMIN", item);
    console.log(country);
    map.addSource(country, {
      type: "geojson",
      data: item,
    });
    addLayers(map, country);
  }

  function addLayers(map, source) {
    map.addLayer({
      id: source,
      type: "fill",
      source,
      layout: {},
      paint: {
        "fill-color": "#0080ff", // blue color fill
        "fill-opacity": 0.5,
      },
    });
    // Add a black outline around the polygon.
    map.addLayer({
      id: source + "_",
      type: "line",
      source,
      layout: {},
      paint: {
        "line-color": "#000",
        "line-width": 3,
      },
    });
  }

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
