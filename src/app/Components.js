import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import data from "../utils/select-data.json";

export default function App() {
  const [countries, setCountries] = useState(() => {
    return mapData(data);
  });
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  function mapData(data) {
    return data.map((item) => {
      return {
        ...item,
        label: item.name,
        value: item.name,
      };
    });
  }

  function selectedValue(newValue, key, setData, setSelected) {
    setSelected(newValue);
    if (!key) {
      return;
    }
    const data = newValue[key];
    const mappedData = mapData(data);
    setData(mappedData);
  }

  return (
    <>
      <label>Country</label>
      <Select
        options={countries}
        onChange={(newValue) => {
          selectedValue(newValue, "states", setProvinces, setSelectedCountry);
        }}
      />

      <label>States</label>
      <Select
        options={provinces}
        onChange={(newValue) => {
          selectedValue(newValue, "cities", setCities, setSelectedProvince);
        }}
      />

      <label>City</label>
      <Select
        options={cities}
        onChange={(newValue) => {
          selectedValue(newValue, "", null, setSelectedCity);
        }}
      />
    </>
  );
}

function CascadeSelect({ title, data, onChangeHandler, parent }) {
  return (
    <>
      <label>{title}</label>
      <Select options={data} onChange={onChangeHandler} />
    </>
  );
}
