import { useEffect, useRef, useState } from "react";

export default function useFilter(data, initialSchema) {
  const filterSchema = useRef(initialSchema);
  const [filteredData, setFilteredData] = useState(data);

  function updateSchema(formData) {
    for (const key in formData) {
      const element = formData[key];
      if (!element) {
        return;
      }
      let string = key.substring(key.indexOf("(") + 1, key.lastIndexOf(")"));
      if (string) {
        const subKey = key.split(" ")[0];
        filterSchema.current[subKey][string] = +element;
      } else {
        filterSchema.current[key].value = element;
      }
    }
  }

  function initiateFilter(formData) {
    updateSchema(formData);
    const resultData = filterDataFunction(data, filterSchema.current);
    setFilteredData(resultData);
  }

  function filterDataFunction(data, query) {
    const filteredDataArray = data.filter((item) => {
      for (let key in query) {
        const object = query[key];
        switch (object.filterType) {
          case "text":
            let text = item.properties[key];
            if (!text[object.searchType](object.value)) {
              return false;
            }
            break;

          case "boolean":
            let geoType = item.geometry.type;
            const booleanResult = object.value
              ? geoType === key
              : geoType !== key;
            if (!booleanResult) {
              return false;
            }
            break;

          case "minmax":
            if (object["min"] !== null) {
              if (item.properties[key] < object["min"]) {
                return false;
              }
            }
            if (object["max"] !== null) {
              if (item.properties[key] > object["max"]) {
                return false;
              }
            }
            break;

          default:
            break;
        }
      }
      return true;
    });
    return filteredDataArray;
  }
  return { filteredData, initiateFilter };
}
