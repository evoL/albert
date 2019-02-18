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

import { createElement, isPointLike, omit } from "./utils";
import { point } from "./helpers";

function op(name, point = undefined) {
  return { name, point };
}

export default class Path {
  constructor(attributes = {}) {
    this.attributes_ = omit(attributes, ["d"]);
    this.operations_ = [];
  }

  clone() {
    const deepCopy = new Path(this.attributes_);
    const pointMap = new Map();

    deepCopy.operations_ = this.operations_.map(({ name, point }) => {
      if (point) {
        if (!pointMap.has(point)) {
          pointMap.set(point, point.clone());
        }
        return op(name, pointMap.get(point));
      } else {
        return op(name);
      }
    });
    return deepCopy;
  }

  setAttributes(attributes) {
    Object.assign(this.attributes_, omit(attributes, ["d"]));
    return this;
  }

  moveTo(xOrPoint, y = undefined) {
    const p = point(xOrPoint, y);
    this.operations_.push(op("M", p));
    return this;
  }

  lineTo(xOrPoint, y = undefined) {
    const p = point(xOrPoint, y);
    this.operations_.push(op("L", p));
    return this;
  }

  closePath() {
    this.operations_.push(op("Z"));
    return this;
  }

  points() {
    const result = new Set(this.operations_.map(o => o.point));
    result.delete(undefined);
    return Array.from(result);
  }

  render() {
    const el = createElement("path", this.attributes_);

    el.setAttributeNS(null, "d", this.computeDescription_());

    return el;
  }

  computeDescription_() {
    return this.operations_
      .map(({ name, point }) => {
        return `${name}${point || ""}`;
      })
      .join("");
  }
}
