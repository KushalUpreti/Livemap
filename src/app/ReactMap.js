import { useRef, useEffect, useState, useCallback } from "react";
import hdi from "../utils/stats/hdi.json";
import covid from "../utils/stats/covid.json";
import literacy from "../utils/stats/literacy.json";
import Map, { Source, Layer } from "react-map-gl";
import { traverseObject } from "../utils/utilityFunctions";
import "../styles/Population.css";

export default function ReactMap() {
  const [viewState, setViewState] = useState({
    longitude: 12,
    latitude: 50,
    zoom: 1.5,
  });

  const [statsData, setStatsData] = useState("hdi");
  const [layers, setLayers] = useState([]);
  const [colors, setColors] = useState([]);

  const map = useRef(null);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) {
      return;
    }
    boundaryLayer = { ...boundaryLayer };
  }, [statsData]);

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

  const source = {
    id: "countries",
    type: "vector",
    url: "mapbox://mapbox.country-boundaries-v1",
  };

  const boundaryLayer = {
    id: "countries-join",
    type: "fill",
    source: "countries",
    "source-layer": "country_boundaries",
    paint: {
      "fill-color": updatedExpression(),
    },
    beforeId: "admin-1-boundary-bg",
  };

  const highlightLayer = {
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
    beforeId: "admin-1-boundary-bg",
  };

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

  function updatedExpression() {
    const { data, size, path, property } = dataSources[statsData];
    const { layers, colors } = createColorRange(data, size, path);
    const expression = generateMatchExpression(data, property, layers, colors);
    return expression;
  }

  function setStatistics(key) {
    setStatsData(key);
  }

  return (
    <>
      <Map
        {...viewState}
        ref={map}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken="pk.eyJ1IjoiaWN5aG90c2hvdG8iLCJhIjoiY2tmeHQwc3E5MjRxajJxbzhmbDN1bjJ5aiJ9.mNKmhIjRyKxFkJYrm4dMqg"
        style={{ width: 1300, height: 400 }}
        mapStyle="mapbox://styles/mapbox/light-v10"
      >
        <Source {...source}>
          <Layer {...boundaryLayer} />
        </Source>
      </Map>

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
              //   onMouseEnter={() => {
              //     mouseEnterHandler(item);
              //   }}
              //   onMouseLeave={mouseExitHandler}
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
    </>
  );
}
