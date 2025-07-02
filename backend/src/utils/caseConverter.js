function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function keysToCamel(o) {
  if (Array.isArray(o)) {
    return o.map(v => keysToCamel(v));
  } else if (o !== null && typeof o === 'object') {
    return Object.entries(o).reduce((acc, [key, value]) => {
      acc[toCamelCase(key)] = keysToCamel(value);
      return acc;
    }, {});
  }
  return o;
}

