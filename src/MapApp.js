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
      const name = String(e.lngLat.lat) + e.lngLat.lng;
      let coords = [e.lngLat.lng, e.lngLat.lat];
      map.current.loadImage(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Filled-circle-violet.svg/1024px-Filled-circle-violet.svg.png",
        (error, image) => {
          if (error) throw error;
          addIcon(map.current, coords, image, name);
        }
      );
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

  function addIcon(map, lngLat, image, name) {
    map.addImage(name, image);

    map.addSource(name, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: lngLat,
            },
          },
        ],
      },
    });

    map.addLayer({
      id: name,
      type: "symbol",
      source: name, // reference the data source
      layout: {
        "icon-image": name, // reference the image
        "icon-size": 0.025,
      },
    });
  }

  function zoomIn() {
    let zoomLevel = zoom + 1;
    setZoom(zoomLevel);
    map.current.setZoom(zoomLevel);
  }

  function zoomOut() {
    if (zoom === 0) {
      return;
    }
    let zoomLevel = zoom - 1;
    setZoom(zoomLevel);
    map.current.setZoom(zoomLevel);
  }

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <button onClick={zoomIn} style={{ padding: "2px 14px" }}>
        +
      </button>
      <button onClick={zoomOut} style={{ padding: "2px 14px" }}>
        -
      </button>
    </div>
  );
}
