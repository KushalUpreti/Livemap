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
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: zoom,
    });

    const layers = [
      "0-1000000",
      "1000000-2000000",
      "2000000-3000000",
      "3000000-4000000",
      "4000000-5000000",
      "5000000-6000000",
      "6000000-7000000",
      "7000000+",
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
          "fill-color": generatePopulationExpression(layers, colors),
        },
      });

      population.forEach((item) => {
        map.current.setFeatureState(
          { source: "country", id: +item.ADM1_EN },
          { population: item.population }
        );
      });

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

  function generatePopulationExpression(range, colors) {
    if (range.length !== colors.length) {
      return [];
    }
    let expression = ["case"];
    for (let i = 0; i < range.length - 1; i++) {
      const currentRange = range[i].split("-");
      let curr = [
        "boolean",
        [
          "all",
          [">", ["feature-state", "population"], +currentRange[0]],
          ["<", ["feature-state", "population"], +currentRange[1]],
        ],
        true,
      ];
      expression.push(curr);
      expression.push(colors[i]);
    }
    expression.push(colors[colors.length - 1]);
    return expression;
  }

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <div class="map-overlay" id="legend"></div>
    </div>
  );
}
