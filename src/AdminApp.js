import { useRef, useState } from "react";
import "./styles/AdminApp.css";

export default function App() {
  const [objects, setObjects] = useState({});
  const [selectedObject, setSelectedObject] = useState("");
  const [createText, setCreateText] = useState("");

  function createObject(e) {
    e.preventDefault();
    if (!createText.trim()) {
      return;
    }
    setObjects((prev) => {
      let object = { ...prev };
      object[createText] = { [""]: "" };
      return object;
    });
    setSelectedObject(createText);
    setCreateText("");
  }

  function updateKey(key, updatedKey) {
    setObjects((prev) => {
      let objects = { ...prev };
      const value = objects[selectedObject][key];
      delete objects[selectedObject][key];
      objects[selectedObject][updatedKey] = value;
      return objects;
    });
  }

  function updateValue(key, updatedValue) {
    setObjects((prev) => {
      let objects = { ...prev };
      objects[selectedObject][key] = updatedValue;
      return objects;
    });
  }

  function addProperty() {
    setObjects((prev) => {
      let objects = { ...prev };
      if (objects[selectedObject][""]) {
        return objects;
      }
      objects[selectedObject][""] = "";
      return objects;
    });
  }

  return (
    <main className="main">
      <div className="object-list">
        <h3>Countries</h3>
        <div>
          {Object.keys(objects).map((item) => {
            return (
              <div
                className="object-list__item"
                onClick={() => {
                  setSelectedObject(item);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>

      <div className="edit">
        <div className="edit__create">
          <h3>Create new country object</h3>
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
              {Object.keys(objects[selectedObject]).map((key) => {
                return (
                  <PropertyForm
                    key={key}
                    keyText={key}
                    valueText={objects[selectedObject][key]}
                    updateKey={updateKey}
                    updateValue={updateValue}
                  />
                );
              })}

              <button className="save" onClick={addProperty}>
                Add Property
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function PropertyForm({ keyText, valueText, updateKey, updateValue }) {
  const [keyState, setKeyState] = useState(keyText);
  const [valueState, setvalueState] = useState(valueText);

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
