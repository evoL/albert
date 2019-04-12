import { SVGAElementAttributes } from 'svg';
// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/** Returns the argument unchanged. */
export function identity<T>(x: T): T {
  return x;
}

/**
 * If the parameter is an array, returns the parameter. Otherwise, wraps the
 * parameter in an array.
 */
export function castArray<T>(thing: T | Array<T>): Array<T> {
  return Array.isArray(thing) ? thing : [thing];
}

/** Returns a shallow copy of the object with the passed in keys removed. */
export function omit<T>(
  object: { [key: string]: T },
  keys: Array<keyof object | string>
): { [key: string]: T } {
  const obj = Object.assign({}, object);
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
}

/** Returns the last element of the array. */
export function last<T>(array: Array<T>): T {
  return array[array.length - 1];
}

/** Finds the last element matching the predicate. */
export function findLast<T>(
  array: Array<T>,
  predicate: (item: T) => boolean
): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
}

/** Returns the minimum element of the array as determined by the getter. */
export function minBy<T>(
  array: Array<T>,
  getter: (item: T) => {} = identity
): T | undefined {
  if (!array.length) {
    return undefined;
  }
  let min = array[0];
  for (let i = 1; i < array.length; i++) {
    if (getter(array[i]) < getter(min)) {
      min = array[i];
    }
  }
  return min;
}

/** Returns the maximum element of the array as determined by the getter. */
export function maxBy<T>(
  array: Array<T>,
  getter: (item: T) => {} = identity
): T | undefined {
  if (!array.length) {
    return undefined;
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
/**
 * Generates a unique ID.
 *
 * Accepts an optional name, which will be used as part of the ID.
 */
export function uniqueId(name: string = "unnamed"): string {
  return `${name}#${counter++}`;
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
  svg: "http://www.w3.org/2000/svg",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};

export function createElement(tag, attributes = {}) {
  const element = document.createElementNS(NAMESPACES.svg, tag);
  for (const [name, value] of Object.entries(attributes)) {
    setAttribute(element, name, value);
  }
  return element;
}

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
  const tempSvg = createElement("svg");
  tempSvg.appendChild(el);
  document.body.appendChild(tempSvg);

  callback(el);

  document.body.removeChild(tempSvg);
  tempSvg.removeChild(el);
}

export function isPointLike(p) {
  return p && p.x !== undefined && p.y !== undefined;
}

export function arePointLike(...array) {
  return array.map(isPointLike).every(p => p);
}