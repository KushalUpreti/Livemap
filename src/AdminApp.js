import { useEffect, useState } from "react";
import "./styles/AdminApp.css";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [createText, setCreateText] = useState("");
  const [cityText, setCityText] = useState("");
  const [cities, setCities] = useState([]);

  function createObject(e) {
    const countryName = createText;
    e.preventDefault();
    if (!createText.trim()) {
      return;
    }
    setCountries((prev) => {
      const object = [...prev];
      const newCountry = { name: countryName, [""]: "", cities: [] };
      object.push(newCountry);
      return object;
    });
    setCreateText("");
    setSelectedCountry(countryName);
    updateCitiesList(countryName, true);
    setSelectedCity("");
  }

  function createCity(e) {
    e.preventDefault();
    if (!cityText.trim()) {
      return;
    }
    setCountries((prev) => {
      const object = [...prev];
      const index = object.findIndex((item) => item.name === selectedCountry);
      const city = { name: cityText, [""]: "" };
      object[index].cities.push(city);
      return object;
    });
    setSelectedCity(cityText);
    setCityText("");
    updateCitiesList(selectedCountry);
  }

  function saveCountry(updatedObj) {
    delete updatedObj[""];
    setCountries((prev) => {
      let array = [...prev];
      let index = array.findIndex((item) => item.name === updatedObj.name);
      array[index] = updatedObj;
      return array;
    });
  }

  function saveCity(updatedCity) {
    delete updatedCity[""];
    setCountries((prev) => {
      let array = [...prev];
      let countryIndex = array.findIndex(
        (item) => item.name === selectedCountry
      );
      const cities = array[countryIndex].cities;
      let cityIndex = cities.findIndex(
        (item) => item.name === updatedCity.name
      );
      cities[cityIndex] = updatedCity;
      return array;
    });
  }

  function switchCountries(item) {
    setSelectedCountry(item);
    setSelectedCity("");
    updateCitiesList(item);
  }

  function updateCitiesList(item, newCountry = false) {
    if (newCountry) {
      setCities([]);
      return;
    }
    const country = countries.find((obj) => obj.name === item);
    setCities(country.cities);
  }

  function switchCities(item) {
    setSelectedCity(item);
  }

  return (
    <main className="main">
      <div className="object-list">
        <ItemList
          data={countries}
          switchFunction={switchCountries}
          selectedVar={selectedCountry}
          title="Countries"
        />
        {countries.length > 0 && (
          <ItemList
            data={cities}
            switchFunction={switchCities}
            selectedVar={selectedCity}
            title="Cities"
          />
        )}
      </div>

      <ObjectEditor
        createObject={createObject}
        createText={createText}
        data={countries}
        selectedObject={selectedCountry}
        setCreateText={setCreateText}
        saveObject={saveCountry}
        title="Create new country"
      />

      {selectedCountry && (
        <ObjectEditor
          createObject={createCity}
          createText={cityText}
          data={cities}
          selectedObject={selectedCity}
          setCreateText={setCityText}
          saveObject={saveCity}
          title={`Create new city for ${selectedCountry}`}
        />
      )}
    </main>
  );
}

function ItemList({ data, switchFunction, selectedVar, title }) {
  return (
    <div>
      <h3>{title}</h3>
      <div>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="object-list__item"
              style={{
                backgroundColor:
                  selectedVar === item.name ? "rgb(206, 206, 206" : "white",
              }}
              onClick={() => {
                switchFunction(item.name);
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ObjectEditor({
  createObject,
  createText,
  selectedObject,
  data,
  saveObject,
  title,
  setCreateText,
}) {
  const [tempObject, setTempObject] = useState(null);

  useEffect(() => {
    if (!selectedObject) {
      return;
    }
    let currentObject = data.filter((item) => item.name === selectedObject);
    setTempObject(currentObject[0]);
  }, [selectedObject, data]);

  function cancel() {
    let currentObject = data.filter((item) => item.name === selectedObject);
    setTempObject(currentObject[0]);
  }

  function addProperty() {
    setTempObject((prev) => {
      let data = { ...prev };
      if (data[""]) {
        return data;
      }
      data[""] = "";
      return data;
    });
  }

  function updateKey(key, updatedKey) {
    setTempObject((prev) => {
      const obj = { ...prev };
      const value = obj[key];
      delete obj[key];
      obj[updatedKey] = value;
      return obj;
    });
  }

  function updateValue(key, updatedValue) {
    setTempObject((prev) => {
      const obj = { ...prev };
      obj[key] = updatedValue;
      return obj;
    });
  }

  return (
    <div className="edit">
      <div className="edit__create">
        <h3>{title}</h3>
        <form onSubmit={createObject}>
          <input
            type="text"
            value={createText}
            onChange={(e) => {
              setCreateText(e.target.value);
            }}
          />
          <input type="submit" value="Create" />
        </form>
      </div>

      {selectedObject && (
        <div>
          <h3>{selectedObject}</h3>
          <p>Add or edit properties</p>
          <div>
            {tempObject &&
              Object.keys(tempObject).map((key) => {
                if (key === "cities") {
                  return;
                }
                return (
                  <PropertyForm
                    key={key}
                    keyText={key}
                    valueText={tempObject[key]}
                    updateKey={updateKey}
                    updateValue={updateValue}
                  />
                );
              })}

            <button className="action-button" onClick={addProperty}>
              Add Property
            </button>

            <button
              className="action-button save"
              onClick={() => {
                saveObject(tempObject);
              }}
            >
              Save
            </button>
            <button className="action-button cancel" onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PropertyForm({ keyText, valueText, updateKey, updateValue }) {
  const [keyState, setKeyState] = useState(keyText);
  const [valueState, setvalueState] = useState(valueText);

  useEffect(() => {
    setKeyState(keyText);
    setvalueState(valueText);
  }, [keyText, valueText]);

  return (
    <form className="property">
      <label htmlFor="">Key: </label>
      <input
        type="text"
        value={keyState}
        onChange={(e) => {
          setKeyState(e.target.value);
        }}
        onBlur={() => {
          updateKey(keyText, keyState);
        }}
      />
      <label htmlFor="">Value: </label>
      <input
        type="text"
        value={valueState}
        onChange={(e) => {
          setvalueState(e.target.value);
        }}
        onBlur={() => {
          updateValue(keyText, valueState);
        }}
      />
    </form>
  );
}
