import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "../styles/AdminApp.css";

export default function App() {
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);

  function createObject(e, countryName) {
    const countryId = uuidv4();
    e.preventDefault();
    if (!countryName.trim()) {
      return;
    }
    const newCountry = {
      id: countryId,
      name: countryName,
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
          title="objects"
        />
      </div>

      <div>
        <CountryCreator createObject={createObject} />

        {selectedObject && (
          <ObjectEditor data={selectedObject} saveObject={saveCountry} />
        )}
      </div>
    </main>
  );
}

function ItemList({ data, switchFunction, selectedVar, title }) {
  return (
    <div>
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

function CountryCreator({ createObject }) {
  const [createCountryText, setCreateCountryText] = useState("");

  return (
    <div className="edit__create">
      <h3>Create new country</h3>
      <form
        onSubmit={(e) => {
          createObject(e, createCountryText);
          setCreateCountryText("");
        }}
      >
        <input
          type="text"
          value={createCountryText}
          onChange={(e) => {
            setCreateCountryText(e.target.value);
          }}
        />
        <input type="submit" value="Create" />
      </form>
    </div>
  );
}

function ObjectEditor({ data, saveObject }) {
  const [tempObject, setTempObject] = useState(data);

  useEffect(() => {
    setTempObject(data);
  }, [data]);

  function init() {
    setTempObject(data);
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
