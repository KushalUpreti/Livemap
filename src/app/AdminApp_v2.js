import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "../styles/AdminApp.css";

export default function App() {
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);

  function createObject() {
    const countryId = uuidv4();

    const newCountry = {
      id: countryId,
      name: "N/A",
      cities: [],
      population: 0,
      language: "N/A",
    };
    setObjects((prev) => {
      const object = [...prev];
      object.push(newCountry);
      return object;
    });
    setSelectedObject(newCountry);
  }

  function saveCountry(updatedObj) {
    delete updatedObj[""];
    setObjects((prev) => {
      let array = [...prev];
      let index = array.findIndex((item) => item.id === updatedObj.id);
      array[index] = updatedObj;
      return array;
    });
  }

  function switchCountries(item) {
    setSelectedObject(item);
  }

  return (
    <main className="main">
      <div className="object-list">
        <ItemList
          data={objects}
          switchFunction={switchCountries}
          selectedVar={selectedObject && selectedObject.id}
          title="Country"
        />
      </div>

      <div>
        <div className="create">
          <button onClick={createObject}>Create Object</button>
        </div>

        {selectedObject && (
          <ObjectEditor
            data={selectedObject}
            saveObject={saveCountry}
            render={(data, saveFunction) => {
              return (
                <ObjectEditor
                  data={data}
                  saveObject={saveFunction}
                  render={null}
                />
              );
            }}
          />
        )}
      </div>
    </main>
  );
}

function ItemList({ data, switchFunction, selectedVar, title }) {
  return (
    <div className="object-list">
      <h3>{title}</h3>
      <div>
        {data.map((item) => {
          return (
            <div
              key={item.id}
              className="object-list__item"
              style={{
                backgroundColor:
                  selectedVar === item.id ? "rgb(206, 206, 206" : "white",
              }}
              onClick={() => {
                switchFunction(item);
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

function ObjectEditor({ data, saveObject, render }) {
  const [tempObject, setTempObject] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    setTempObject(data);
    setSelectedCity(null);
  }, [data]);

  function init() {
    setTempObject(data);
  }

  function createCity() {
    const cityId = uuidv4();
    const newCity = {
      id: cityId,
      name: "N/A",
      population: 0,
      language: "N/A",
    };
    setTempObject((prev) => {
      const obj = { ...prev };
      const find = obj.cities.find((item) => item.id === cityId);
      if (!find) {
        obj.cities.push(newCity);
      }
      return obj;
    });
    setSelectedCity(newCity);
  }

  function saveCity(updatedCity) {
    delete updatedCity[""];
    setTempObject((prev) => {
      let obj = { ...prev };
      const cities = obj.cities;
      let cityIndex = cities.findIndex((item) => item.id === updatedCity.id);
      cities[cityIndex] = updatedCity;
      return obj;
    });
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

  function switchCities(item) {
    setSelectedCity(item);
  }

  return (
    <div className="edit">
      <div>
        <h3>{tempObject ? tempObject.name : "Loading.."}</h3>
        <p>Add or edit properties</p>
        <div>
          {tempObject &&
            Object.keys(tempObject).map((key) => {
              if (key === "cities" || key === "id") {
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

          {render && (
            <>
              <div className="create">
                <button
                  onClick={() => {
                    createCity(data.id);
                  }}
                >
                  Create City
                </button>
              </div>

              {tempObject && (
                <ItemList
                  data={tempObject.cities}
                  switchFunction={switchCities}
                  selectedVar={selectedCity ? selectedCity.id : null}
                  title="Cities"
                />
              )}
              {selectedCity && render(selectedCity, saveCity)}
            </>
          )}

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
          <button className="action-button cancel" onClick={init}>
            Cancel
          </button>
        </div>
      </div>
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
