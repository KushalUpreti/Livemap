import mapboxgl from "mapbox-gl";
import { useRef, useEffect, useState } from "react";
import hdi from "./utils/stats/hdi.json";
import covid from "./utils/stats/covid.json";
import literacy from "./utils/stats/literacy.json";
import "../styles/Population.css";
import { traverseObject } from "./utils/utilityFunctions";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaWN5aG90c2hvdG8iLCJhIjoiY2tmeHQwc3E5MjRxajJxbzhmbDN1bjJ5aiJ9.mNKmhIjRyKxFkJYrm4dMqg";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(12);
  const [lat, setLat] = useState(50);
  const [zoom, setZoom] = useState(1.6);

  const dataSources = {
    hdi: {
      data: hdi,
      property: "hdi",
      path: "hdi",
      size: 0.1,
    },
    literacy: {
      data: literacy,
      property: "literacy",
      path: "literacy",
      size: 0.1,
    },
    covid19: {
      data: covid,
      property: "cases",
      path: "cases",
      size: 3000000,
    },
  };

  const [statsData, setStatsData] = useState("hdi");
  const [layers, setLayers] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) {
      return;
    }
    updateStats();
  }, [statsData]);

  useEffect(() => {
    if (map.current) return;
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
        promoteId: "iso_3166_1_alpha_3",
      });

      map.current.addLayer(
        {
          id: "countries-join",
          type: "fill",
          source: "countries",
          "source-layer": "country_boundaries",
          paint: {},
        },
        "admin-1-boundary-bg"
      );

      map.current.addLayer(
        {
          id: "countries-highlighted",
          type: "fill",
          source: "countries",
          "source-layer": "country_boundaries",
          paint: {
            "fill-outline-color": "#484896",
            "fill-color": "#6e599f",
            "fill-opacity": 0.75,
          },
          filter: ["in", "iso_3166_1_alpha_3", ""],
        },
        "admin-1-boundary-bg"
      );

      updateStats();
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

  // function generateMatchExpression(property, layers, colors) {
  //   const matchExpression = ["interpolate", ["linear"], ["zoom"]];
  //   layers.forEach((item, index) => {
  //     const array = item.split("-");
  //     matchExpression.push(+array[1], colors[index]);
  //   });

  //   return matchExpression;
  // }

  function createColorRange(obj, size, path) {
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

  function updateStats() {
    const { data, size, path, property } = dataSources[statsData];
    const { layers, colors } = createColorRange(data, size, path);
    setLayers(layers);
    setColors(colors);
    const expression = generateMatchExpression(data, property, layers, colors);
    map.current.setPaintProperty("countries-join", "fill-color", expression);
    // data.forEach((item) => {
    //   map.current.setFeatureState(
    //     { source: "countries", id: item.code, sourceLayer: "countries" },
    //     { [property]: item[property] }
    //   );
    // });
  }

  function setStatistics(key) {
    setStatsData(key);
  }

  function mouseEnterHandler(item) {
    const array = item.split("-");
    const property = dataSources[statsData].property;
    const selectedFeatures = map.current.queryRenderedFeatures({
      layers: ["countries-join"],
    });
    const filtered = selectedFeatures.filter((item) => {
      const exists = dataSources[statsData].data.find((data) => {
        return data.code === item.properties.iso_3166_1_alpha_3;
      });
      return (
        exists && exists[property] >= +array[0] && exists[property] <= +array[1]
      );
    });
    const countryNames = filtered.map(
      (item) => item.properties.iso_3166_1_alpha_3
    );
    map.current.setFilter("countries-highlighted", [
      "in",
      "iso_3166_1_alpha_3",
      ...countryNames,
    ]);
  }

  function mouseExitHandler() {
    map.current.setFilter("countries-highlighted", [
      "in",
      "iso_3166_1_alpha_3",
      "",
    ]);
  }

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      {Object.keys(dataSources).map((item) => {
        return (
          <button
            key={item}
            style={{ backgroundColor: item === statsData ? "grey" : "white" }}
            onClick={() => {
              setStatistics(item);
            }}
          >
            {item}
          </button>
        );
      })}

      <div className="map-overlay" id="legend">
        {layers.map((item, index) => {
          const array = item.split("-");
          return (
            <div
              key={item}
              className="legend-row"
              onMouseEnter={() => {
                mouseEnterHandler(item);
              }}
              onMouseLeave={mouseExitHandler}
            >
              <span
                className="legend-key"
                style={{ backgroundColor: colors[index] }}
              />
              <span>{`${array[0]} - ${array[1]}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
