import { useEffect, useState } from "react";
import "./styles/AdminApp.css";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [selectedObject, setSelectedObject] = useState("");
  const [createText, setCreateText] = useState("");
  const [cityText, setCityText] = useState("");
  const [cities, setCities] = useState([]);

  function createObject(e) {
    e.preventDefault();
    if (!createText.trim()) {
      return;
    }
    setCountries((prev) => {
      const object = [...prev];
      const newCountry = { name: createText, [""]: "", cities: [] };
      object.push(newCountry);
      return object;
    });
    setSelectedObject(createText);
    setCreateText("");
  }

  function saveObject(updatedObj) {
    delete updatedObj[""];
    setCountries((prev) => {
      let array = [...prev];
      let index = array.findIndex((item) => item.name === updatedObj.name);
      array[index] = updatedObj;
      return array;
    });
  }

  function switchCountries(item) {
    setSelectedObject(item);
    const country = countries.find((obj) => obj.name === item);
    setCities(country.cities);
  }

  return (
    <main className="main">
      <div className="object-list">
        <div>
          <h3>Countries</h3>
          <div>
            {countries.map((item) => {
              return (
                <div
                  key={item.name}
                  className="object-list__item"
                  onClick={() => {
                    switchCountries(item.name);
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3>Cities</h3>
          <div>
            {cities.map((item) => {
              return <div className="object-list__item">{item}</div>;
            })}
          </div>
        </div>
      </div>

      <ObjectEditor
        createObject={createObject}
        createText={createText}
        data={countries}
        selectedObject={selectedObject}
        setCreateText={setCreateText}
        saveObject={saveObject}
        title="Create new country"
      />

      {/* <ObjectEditor
        createObject={createObject}
        createText={cityText}
        data={countries}
        selectedObject={selectedObject}
        setCreateText={setCityText}
        saveObject={saveObject}
        title="Create new city"
      /> */}
    </main>
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
  }, [selectedObject]);

  function cancel() {
    setTempObject(data[selectedObject]);
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
