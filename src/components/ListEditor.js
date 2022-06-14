import { useState, useEffect } from "react";
import "../styles/AdminApp.css";
import { v4 as uuidv4 } from "uuid";

export default function ListEditor({
  data,
  objectSchema,
  listPropSchema,
  setObjects,
  title,
}) {
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    if (data.length === 0) {
      setSelectedObject(null);
    }
  }, [data]);

  function createObject() {
    const id = uuidv4();
    const newCountry = { ...objectSchema(), id };
    setObjects((prev) => {
      const array = [...prev];
      array.push(newCountry);
      return array;
    });
  }

  function switchObjects(item) {
    setSelectedObject(item);
  }

  function save(updatedObj) {
    setObjects((prev) => {
      let array = [...prev];
      let index = array.findIndex((item) => item.id === updatedObj.id);
      array[index] = updatedObj;
      return array;
    });
  }

  return (
    <>
      <div className="object-list">
        <ItemList
          data={data}
          switchFunction={switchObjects}
          selectedVar={selectedObject && selectedObject.id}
          title={title}
        />
      </div>

      <div>
        <div className="create">
          <button onClick={createObject}>Create Object</button>
        </div>

        {selectedObject && (
          <ObjectEditor
            data={selectedObject}
            listPropSchema={listPropSchema}
            save={save}
          />
        )}
      </div>
    </>
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

function ObjectEditor({ data, listPropSchema, save }) {
  const [tempObject, setTempObject] = useState(data);

  useEffect(() => {
    init();
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
              if (key === "id") {
                return;
              }
              if (Array.isArray(tempObject[key])) {
                return (
                  <ListEditor
                    data={tempObject[key]}
                    title={key}
                    key={key}
                    listPropSchema={{}}
                    objectSchema={listPropSchema[key]}
                    setObjects={(callback) => {
                      updateValue(key, callback(tempObject[key]));
                    }}
                  />
                );
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
              delete tempObject[""];
              save(tempObject);
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
