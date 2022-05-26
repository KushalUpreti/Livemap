import mapboxgl from "mapbox-gl";
import { useRef, useEffect, useState } from "react";
import hdi from "./utils/stats/hdi.json";
import covid from "./utils/stats/covid.json";
import literacy from "./utils/stats/literacy.json";
import "./styles/Population.css";
import { traverseObject } from "./utils/utilityFunctions";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaWN5aG90c2hvdG8iLCJhIjoiY2tmeHQwc3E5MjRxajJxbzhmbDN1bjJ5aiJ9.mNKmhIjRyKxFkJYrm4dMqg";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(12);
  const [lat, setLat] = useState(50);
  const [zoom, setZoom] = useState(1.6);

  const [statsData, setStatsData] = useState({
    data: hdi,
    property: "hdi",
    path: "hdi",
    size: 0.1,
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

    map.current.on("load", () => {
      map.current.addSource("countries", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });
      const { layers, colors } = createLayers(
        statsData.data,
        statsData.size,
        statsData.path
      );

      const matchExpression = generateMatchExpression(
        statsData.data,
        statsData.property,
        layers,
        colors
      );

      map.current.addLayer(
        {
          id: "countries-join",
          type: "fill",
          source: "countries",
          "source-layer": "country_boundaries",
          paint: {
            "fill-color": matchExpression,
          },
        },
        "admin-1-boundary-bg"
      );
      addLegend(layers, colors);
    });
  }, []);

  function generateMatchExpression(data, property, layers, colors) {
    const matchExpression = ["match", ["get", "iso_3166_1_alpha_3"]];

    for (const row of data) {
      const value = row[property];
      for (let i = 0; i < layers.length; i++) {
        const element = layers[i];
        const array = element.split("-");
        if (value >= +array[0] && value <= +array[1]) {
          matchExpression.push(row["code"], colors[i]);
          break;
        }
      }
    }

    matchExpression.push("rgba(0, 0, 0, 0)");
    return matchExpression;
  }

  function createLayers(obj, size, path) {
    const layers = [];
    const colors = [];
    const max = Math.max(...obj.map((e) => traverseObject(path, e)));
    let prev = 0;
    for (let index = size; index <= max + size; index += size) {
      layers.push(`${prev}-${index.toFixed(2)}`);
      const color = `rgb(0, ${Math.min(
        Math.floor((index / max) * 255),
        255
      )}, 0)`;
      colors.unshift(color);
      prev = index.toFixed(2);
    }
    return { layers, colors };
  }

  function addLegend(layers, colors) {
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
      "countries-join",
      "fill-color",
      generateMatchExpression(
        statsData.data,
        statsData.property,
        layers,
        colors
      )
    );

    addLegend(layers, colors);
  }

  function setStatistics(data, property, path, size) {
    setStatsData({
      data,
      property,
      path,
      size,
    });
  }

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <button
        onClick={() => {
          setStatistics(hdi, "hdi", "hdi", 0.1);
        }}
        style={{
          backgroundColor: statsData.property === "hdi" ? "grey" : "white",
        }}
      >
        HDI
      </button>
      <button
        onClick={() => {
          setStatistics(literacy, "literacy", "literacy", 0.1);
        }}
        style={{
          backgroundColor: statsData.property === "literacy" ? "grey" : "white",
        }}
      >
        Literacy
      </button>
      <button
        onClick={() => {
          setStatistics(covid, "cases", "cases", 3000000);
        }}
        style={{
          backgroundColor: statsData.property === "cases" ? "grey" : "white",
        }}
      >
        COVID-19
      </button>
      <div className="map-overlay" id="legend"></div>
    </div>
  );
}
