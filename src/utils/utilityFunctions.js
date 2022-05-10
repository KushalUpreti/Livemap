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
