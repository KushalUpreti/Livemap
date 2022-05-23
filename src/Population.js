import mapboxgl from "mapbox-gl";
import { useRef, useEffect, useState } from "react";
import countries from "./utils/nep.json";
import population from "./utils/population.json";
import "./styles/Population.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaWN5aG90c2hvdG8iLCJhIjoiY2tmeHQwc3E5MjRxajJxbzhmbDN1bjJ5aiJ9.mNKmhIjRyKxFkJYrm4dMqg";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(84.2);
  const [lat, setLat] = useState(28.1);
  const [zoom, setZoom] = useState(5.5);

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

      // Add a black outline around the polygon.
      map.current.addLayer({
        id: "country_",
        type: "line",
        source: "country",
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 2,
        },
      });

      map.current.addLayer({
        id: "state-fills",
        type: "fill",
        source: "country",
        layout: {},
        paint: {
          "fill-color": [
            "case",
            [
              "boolean",
              [
                "all",
                [">", ["feature-state", "population"], 0],
                ["<", ["feature-state", "population"], 100000],
              ],
              true,
            ],
            "#FFEDA0",
            [
              "boolean",
              [
                "all",
                [">", ["feature-state", "population"], 100000],
                ["<", ["feature-state", "population"], 2000000],
              ],
              true,
            ],
            "#FED976",
            [
              "boolean",
              [
                "all",
                [">", ["feature-state", "population"], 200000],
                ["<", ["feature-state", "population"], 3000000],
              ],
              true,
            ],
            "#FEB24C",
            [
              "boolean",
              [
                "all",
                [">", ["feature-state", "population"], 300000],
                ["<", ["feature-state", "population"], 4000000],
              ],
              true,
            ],
            "#FD8D3C",
            [
              "boolean",
              [
                "all",
                [">", ["feature-state", "population"], 400000],
                ["<", ["feature-state", "population"], 5000000],
              ],
              true,
            ],
            "#E31A1C",
            [
              "boolean",
              [
                "all",
                [">", ["feature-state", "population"], 500000],
                ["<", ["feature-state", "population"], 6000000],
              ],
              true,
            ],
            "#BD0026",
            "#800026",
          ],
          // "fill-opacity": 0.9,
        },
      });

      population.forEach((item) => {
        console.log(item.population < 3500000);
        map.current.setFeatureState(
          { source: "country", id: +item.ADM1_EN },
          { population: item.population }
        );
      });

      const layers = [
        "0-100000",
        "100000-200000",
        "200000-300000",
        "300000-400000",
        "400000-500000",
        "500000-600000",
        "600000-700000",
        "700000+",
      ];
      const colors = [
        "#FFEDA0",
        "#FED976",
        "#FEB24C",
        "#FD8D3C",
        "#FC4E2A",
        "#E31A1C",
        "#BD0026",
        "#800026",
      ];

      // create legend
      const legend = document.getElementById("legend");

      layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement("div");
        const key = document.createElement("span");
        key.className = "legend-key";
        key.style.backgroundColor = color;

        const value = document.createElement("span");
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
      });
    });
  }, []);
  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <div class="map-overlay" id="legend"></div>
    </div>
  );
}
