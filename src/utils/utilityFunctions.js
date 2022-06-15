export function traverseObject(path, object) {
  let current = object;
  const pathArray = path.split(".");
  pathArray.forEach((key) => {
    current = current[key];
  });
  return current;
}

export function getObject(path, object) {
  let current = object;
  const pathArray = path.split(".");
  pathArray.pop();
  pathArray.forEach((key) => {
    current = current[key];
  });
  return current;
}

export function groupBy(key, arr) {
  return arr.reduce((prev, curr) => {
    const value = traverseObject(key, curr);
    if (value in prev) {
      return { ...prev, [value]: prev[value].concat(curr) };
    }
    return { ...prev, [value]: [curr] };
  }, {});
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
