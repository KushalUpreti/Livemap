import mapboxgl from "mapbox-gl";
import { useRef, useEffect, useState } from "react";
import countries from "./utils/countries.json";
import markers from "./utils/marker.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaWN5aG90c2hvdG8iLCJhIjoiY2tmeHQwc3E5MjRxajJxbzhmbDN1bjJ5aiJ9.mNKmhIjRyKxFkJYrm4dMqg";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markerData, setMarkerData] = useState(markers);
  const [lng, setLng] = useState(75.2);
  const [lat, setLat] = useState(26.9);
  const [zoom, setZoom] = useState(3);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    if (!map.current) {
      return;
    }
    map.current.setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) {
      return;
    }
    map.current.getSource("points").setData(markerData.data);
  }, [markerData]);

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

      map.current.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          map.current.addImage("custom-marker", image);
          map.current.addSource("points", markerData);
          map.current.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );
    });

    map.current.on("click", (e) => {
      setMarkerData((prev) => {
        let obj = { ...prev };
        obj.data.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          },
          properties: {
            title: "Marker",
          },
        });
        return obj;
      });
    });

    map.current.on("click", "points", (e) => {
      setSelectedMarker({ lng: e.lngLat.lng, lat: e.lngLat.lat, type: e.type });
    });
  }, []);

  function hideAllMarkers() {
    map.current.setLayoutProperty("points", "visibility", "none");
  }

  function showAllMarkers() {
    map.current.setLayoutProperty("points", "visibility", "visible");
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
          setZoom((prev) => Math.max(prev - 1, 0));
        }}
        style={{ padding: "2px 14px" }}
      >
        -
      </button>

      <button onClick={hideAllMarkers} style={{ padding: "2px 14px" }}>
        Hide all markers
      </button>
      <button onClick={showAllMarkers} style={{ padding: "2px 14px" }}>
        Show all markers
      </button>
      {selectedMarker && (
        <div>
          <p>Lng: {selectedMarker.lng}</p>
          <p>Lat: {selectedMarker.lat}</p>
          <p>Event: {selectedMarker.type}</p>
        </div>
      )}
    </div>
  );
}
