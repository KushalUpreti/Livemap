import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import data from "../utils/select-data.json";
import { capitalize } from "../utils/utilityFunctions";

export default function App() {
  const schema = ["countries", "states", "cities"];

  const [countries, setCountries] = useState(() => {
    return mapData(data);
  });
  const [selectedCountries, setSelectedCountries] = useState(null);

  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState(null);

  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState(null);

  function mapData(data) {
    return data.map((item) => {
      return {
        ...item,
        label: item.name,
        value: item.name,
      };
    });
  }

  function onSelection(newValue, key) {
    const index = schema.findIndex((item) => item === key);
    const current = schema[index];
    const next = schema[index + 1];
    eval(`setSelected${capitalize(current)}`)(newValue);
    if (!next) {
      return;
    }
    updateNext(next, newValue);
    resetSelect(index);
  }

  function updateNext(next, newValue) {
    const data = newValue[next];
    const mappedData = mapData(data);
    eval(`set${capitalize(next)}`)(mappedData);
    eval(`setSelected${capitalize(next)}`)(null);
  }

  function resetSelect(index) {
    for (let i = index + 2; i < schema.length; i++) {
      const element = schema[i];
      eval(`set${capitalize(element)}`)([]);
      eval(`setSelected${capitalize(element)}`)(null);
    }
  }

  return (
    <>
      <label>Country</label>
      <Select
        options={countries}
        value={selectedCountries ? selectedCountries : countries[0]}
        onChange={(newValue) => {
          onSelection(newValue, "countries");
        }}
      />

      <label>States</label>
      <Select
        options={states}
        value={
          selectedStates ? selectedStates : states.length > 0 ? states[0] : null
        }
        onChange={(newValue) => {
          onSelection(newValue, "states");
        }}
      />

      <label>City</label>
      <Select
        options={cities}
        value={
          selectedCities ? selectedCities : cities.length > 0 ? cities[0] : null
        }
        onChange={(newValue) => {
          onSelection(newValue, "cities");
        }}
      />
    </>
  );
}
