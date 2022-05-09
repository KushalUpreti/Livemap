import { useEffect, useState } from "react";

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
        console.log(valueOfA > valueOfB);
        return valueOfA > valueOfB ? 1 : -1;
      }
    });
    return dataCopy;
  }

  function traverseObject(path, object) {
    let current = object;
    const pathArray = path.split(".");
    pathArray.forEach((key) => {
      current = current[key];
    });
    return current;
  }

  return { sortedData, sort };
}
