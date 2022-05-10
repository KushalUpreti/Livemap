import { useEffect, useState } from "react";
import { traverseObject } from "../utils/utilityFunctions";

export default function useSorting(data, schema) {
  const [sortedData, setSortedData] = useState(() => {
    return sortFunction(data);
  });

  useEffect(() => {
    sort();
  }, [data]);

  function sort() {
    const dataSorted = sortFunction();
    setSortedData(dataSorted);
  }

  function sortFunction() {
    let dataCopy = [...data];

    dataCopy.sort((a, b) => {
      let valueOfA = traverseObject(schema.field, a);
      let valueOfB = traverseObject(schema.field, b);

      if (typeof valueOfA === "number") {
        return schema.direction === "asc"
          ? valueOfA - valueOfB
          : valueOfB - valueOfA;
      }
      if (typeof valueOfA === "string") {
        if (schema.direction === "desc") {
          return valueOfA < valueOfB ? 1 : -1;
        }
        return valueOfA > valueOfB ? 1 : -1;
      }
    });
    return dataCopy;
  }

  return { sortedData, sort };
}
