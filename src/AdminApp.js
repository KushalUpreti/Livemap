import { useEffect, useRef, useState } from "react";
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

  function saveObject(updatedObj) {
    setObjects((prev) => {
      let obj = { ...prev };
      obj[selectedObject] = updatedObj;
      return obj;
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

      <ObjectEditor
        createObject={createObject}
        createText={createText}
        objects={objects}
        selectedObject={selectedObject}
        setCreateText={setCreateText}
        saveObject={saveObject}
      />
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

function ObjectEditor({
  createObject,
  createText,
  selectedObject,
  objects,
  saveObject,
  setCreateText,
}) {
  const [tempObject, setTempObject] = useState(objects[selectedObject]);

  function cancel() {
    setTempObject(objects[selectedObject]);
  }

  function addProperty() {
    setTempObject((prev) => {
      let objects = { ...prev };
      if (objects[""]) {
        return objects;
      }
      objects[""] = "";
      return objects;
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

  useEffect(() => {
    if (!selectedObject) {
      return;
    }
    setTempObject(objects[selectedObject]);
  }, [selectedObject]);

  return (
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
            {tempObject &&
              Object.keys(tempObject).map((key) => {
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
