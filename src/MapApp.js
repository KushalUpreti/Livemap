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

  const markersRef = useRef([]);

  useEffect(() => {
    if (!map.current) {
      return;
    }
    map.current.setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on("load", () => {
      map.current.addSource("country", {
        type: "geojson",
        data: countries,
      });
      addLayers(map.current, "country");
    });

    map.current.on("click", (e) => {
      const el = document.createElement("div");
      el.style.width = `48px`;
      el.style.height = `48px`;
      el.style.backgroundSize = "100%";
      el.style.borderRadius = "50%";
      el.style.backgroundImage = `url(http://placekitten.com/g/48/48)`;
      new mapboxgl.Marker(el).setLngLat(e.lngLat).addTo(map.current);
      markersRef.current.push({ lngLat: e.lngLat, type: "icon" });
    });
  }, []);

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
      <button
        onClick={() => {
          setZoom((prev) => prev + 1);
        }}
        style={{ padding: "2px 14px" }}
      >
        +
      </button>
      <button
        onClick={() => {
          if (zoom === 0) {
            return;
          }
          setZoom((prev) => prev - 1);
        }}
        style={{ padding: "2px 14px" }}
      >
        -
      </button>
    </div>
  );
}
