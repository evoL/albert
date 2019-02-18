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

import { createElement, omit } from "./utils";

function createFilterNode(tag, attributes = {}, children = []) {
  return { tag, attributes, children };
}

function renderFilterNode({ tag, attributes, children }) {
  const node = createElement(tag, attributes);
  for (const child of children) {
    node.appendChild(child);
  }
  return node;
}

export default class Filter {
  constructor(attributes = {}) {
    this.attributes_ = attributes;
    this.filters_ = [];
    this.mergeNodes_ = [];
  }

  addGaussianBlur(stdDeviation, attributes = {}) {
    const allAttributes = Object.assign({ stdDeviation }, attributes);
    this.filters_.push(createFilterNode("feGaussianBlur", allAttributes));
    return this;
  }

  addOffset(x, y, attributes = {}) {
    const allAttributes = Object.assign({ dx: x, dy: y }, attributes);
    this.filters_.push(createFilterNode("feOffset", allAttributes));
    return this;
  }

  addFlood(color, opacityOrAttributes = {}, attributes = {}) {
    const floodAttributes = { "flood-color": color };
    if (typeof opacityOrAttributes === "number") {
      floodAttributes["flood-opacity"] = opacityOrAttributes;
    } else {
      attributes = opacityOrAttributes;
    }
    const allAttributes = Object.assign(floodAttributes, attributes);
    this.filters_.push(createFilterNode("feFlood", allAttributes));
    return this;
  }

  addComposite(in1, in2, attributes = {}) {
    const allAttributes = Object.assign({ in: in1, in2 }, attributes);
    this.filters_.push(createFilterNode("feComposite", allAttributes));
    return this;
  }

  addColorMatrix(type, valuesOrAttributes = {}, attributes = {}) {
    const colorMatrixAttributes = { type };
    if (["string", "number"].includes(typeof valuesOrAttributes)) {
      colorMatrixAttributes.values = valuesOrAttributes;
    } else {
      attributes = valuesOrAttributes;
    }
    const allAttributes = Object.assign(colorMatrixAttributes, attributes);
    this.filters_.push(createFilterNode("feColorMatrix", allAttributes));
    return this;
  }

  addComponentTransfer(attributes = {}) {
    const children = [];
    const KEYS = ["r", "g", "b", "a"];
    for (const key of KEYS) {
      if (!attributes[key]) {
        continue;
      }
      const tag = `feFunc${key.toUpperCase()}`;
      children.push(createElement(tag, attributes[key]));
    }

    this.filters_.push(
      createFilterNode("feComponentTransfer", omit(attributes, KEYS), children)
    );
    return this;
  }

  addMergeNode(attributes = {}) {
    this.mergeNodes_.push(createFilterNode("feMergeNode", attributes));
    return this;
  }

  render() {
    const root = createElement("filter", this.attributes_);
    for (const filter of this.filters_) {
      root.appendChild(renderFilterNode(filter));
    }
    if (this.mergeNodes_.length) {
      const merge = createElement("feMerge");
      for (const mergeNode of this.mergeNodes_) {
        merge.appendChild(renderFilterNode(mergeNode));
      }
      root.appendChild(merge);
    }
    return root;
  }
}
