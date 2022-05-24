import mapboxgl from "mapbox-gl";
import { useRef, useEffect, useState } from "react";
import countries from "./utils/nep.json";
import population from "./utils/population.json";
import literacy from "./utils/literacy.json";
import "./styles/Population.css";
import { traverseObject } from "./utils/utilityFunctions";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaWN5aG90c2hvdG8iLCJhIjoiY2tmeHQwc3E5MjRxajJxbzhmbDN1bjJ5aiJ9.mNKmhIjRyKxFkJYrm4dMqg";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(84.2);
  const [lat, setLat] = useState(28.1);
  const [zoom, setZoom] = useState(5.5);

  const [statsData, setStatsData] = useState({
    data: population,
    property: "population",
    path: "population",
    size: 1000000,
  });

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) {
      return;
    }
    updateStats();
  }, [statsData]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: zoom,
    });

    const { layers, colors } = createLayers(
      statsData.data,
      statsData.size,
      statsData.path
    );

    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on("load", () => {
      map.current.addSource("stats", {
        type: "geojson",
        data: countries,
      });

      // Add a black outline around the polygon.
      map.current.addLayer({
        id: "country_",
        type: "line",
        source: "stats",
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 2,
        },
      });

      map.current.addLayer({
        id: "state-fills",
        type: "fill",
        source: "stats",
        layout: {},
        paint: {
          "fill-color": generatePopulationExpression(
            layers,
            colors,
            statsData.property
          ),
        },
      });

      addLegend(layers, colors);
    });
  }, []);

  function createLayers(obj, size, path) {
    console.log(path);
    const layers = [];
    const colors = [];
    const max = Math.max(...obj.map((e) => traverseObject(path, e)));
    let prev = 0;
    for (let index = size; index <= max + size; index += size) {
      layers.push(`${prev}-${index}`);
      colors.unshift(`rgb(112,${Math.floor((index / max) * 255)},20)`);
      prev = index;
    }
    return { layers, colors };
  }

  function generatePopulationExpression(range, colors, property) {
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
          [">", ["feature-state", property], +currentRange[0]],
          ["<", ["feature-state", property], +currentRange[1]],
        ],
        true,
      ];
      expression.push(curr);
      expression.push(colors[i]);
    }
    expression.push(colors[colors.length - 1]);
    return expression;
  }

  function addLegend(layers, colors) {
    statsData.data.forEach((item) => {
      map.current.setFeatureState(
        { source: "stats", id: +item.ADM1_EN },
        { [statsData.property]: traverseObject(statsData.path, item) }
      );
    });

    const legend = document.getElementById("legend");
    legend.innerHTML = "";

    layers.forEach((layer, i) => {
      const color = colors[i];
      const item = document.createElement("div");
      const key = document.createElement("span");
      key.className = "legend-key";
      key.style.backgroundColor = color;

      const value = document.createElement("span");
      const array = layer.split("-");
      value.innerHTML = `${array[0]} - ${array[1]}`;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    });
  }

  function updateStats() {
    const { layers, colors } = createLayers(
      statsData.data,
      statsData.size,
      statsData.path
    );

    map.current.setPaintProperty(
      "state-fills",
      "fill-color",
      generatePopulationExpression(layers, colors, statsData.property)
    );

    addLegend(layers, colors);
  }

  function setPopulationStats() {
    setStatsData({
      data: population,
      property: "population",
      path: "population",
      size: 1000000,
    });
  }

  function setLiteracyStats() {
    setStatsData({
      data: literacy,
      property: "literacy",
      path: "literacy",
      size: 10,
    });
  }

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <button onClick={setPopulationStats}>Population</button>
      <button onClick={setLiteracyStats}>Literacy</button>
      <div className="map-overlay" id="legend"></div>
    </div>
  );
}
