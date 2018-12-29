export function identity(x) {
  return x;
}

export function castArray(thing) {
  return Array.isArray(thing) ? thing : [thing];
}

export function omit(object, keys) {
  const obj = Object.assign({}, object);
  for (const key in keys) {
    delete obj[key];
  }
  return obj;
}

export function last(array) {
  return array[array.length - 1];
}

export function minBy(array, getter = identity) {
  if (!array.length) {
    return;
  }
  let min = array[0];
  for (let i = 1; i < array.length; i++) {
    if (getter(array[i]) < getter(min)) {
      min = array[i];
    }
  }
  return min;
}

export function maxBy(array, getter = identity) {
  if (!array.length) {
    return;
  }
  let max = array[0];
  for (let i = 1; i < array.length; i++) {
    if (getter(array[i]) > getter(max)) {
      max = array[i];
    }
  }
  return max;
}

let counter = 0;
export function uniqueId(name = "lol") {
  return `${name}${counter++}`;
}

export function appendTo(destination, source) {
  for (const x of source) {
    destination.push(x);
  }
}

export function prependTo(destination, source) {
  for (const x of source) {
    destination.unshift(x);
  }
}

export function insertAt(destination, index, source) {
  destination.splice(index, 0, ...source);
}

export function insertBefore(destination, element, source) {
  const index = destination.indexOf(element);
  if (index < 0) {
    throw new Error("Element is not present in the destination array");
  }

  insertAt(destination, index, source);
}

export function insertAfter(destination, element, source) {
  const index = destination.indexOf(element);
  if (index < 0) {
    throw new Error("Element is not present in the destination array");
  }

  insertAt(destination, index + 1, source);
}

const NAMESPACES = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
export function setAttribute(el, name, value) {
  const splitName = name.split(":");
  if (splitName.length > 1) {
    const namespace = NAMESPACES[splitName[0]];
    if (!namespace) {
      throw new Error("No namespace defined for prefix: " + splitName[0]);
    }
    return el.setAttributeNS(namespace, splitName[1], value);
  }

  return el.setAttributeNS(null, name, value);
}

export function withTemporarySvg(el, callback) {
  const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  tempSvg.appendChild(el);
  document.body.appendChild(tempSvg);

  callback(el);

  document.body.removeChild(tempSvg);
  tempSvg.removeChild(el);
}

export function isPointLike(p) {
  return p.x && p.y;
}

export function arePointLike(...array) {
  return array.map(isPointLike).every(p => p);
}
