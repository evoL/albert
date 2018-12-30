import { createElement } from "./utils";

function createFilterNode(tag, attributes = {}) {
  return { tag, attributes };
}

function renderFilterNode({ tag, attributes }) {
  return createElement(tag, attributes);
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
