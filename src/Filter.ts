import { createElement, omit } from './utils';
import Attributes from './Attributes';


interface IFilterNode {
  tag: string;
  attributes: Attributes;
  children: any[];
}

function createFilterNode(tag, attributes = {}, children = []): IFilterNode {
  return { tag, attributes, children };
}

function renderFilterNode({ tag, attributes, children }) {
  const node = createElement(tag, attributes);
  for (const child of children) {
    node.append(child);
  }
  return node;
}

export default class Filter {
  private attributes_: Attributes
  private filters_: IFilterNode[];
  private mergeNodes_: any[]; // REVIEW

  constructor(attributes: Attributes = {}) {
    this.attributes_ = attributes;
    this.filters_ = [];
    this.mergeNodes_ = [];
  }

  addGaussianBlur(stdDeviation: any, attributes: Attributes = {}) {
    const allAttributes = {stdDeviation, ...attributes};
    this.filters_.push(createFilterNode("feGaussianBlur", allAttributes));
    return this;
  }

  addOffset(x: SVGAnimatedNumber, y: SVGAnimatedNumber, attributes: Attributes = {}) {
    const allAttributes = {dx: x, dy: y, ...attributes};
    this.filters_.push(createFilterNode("feOffset", allAttributes));
    return this;
  }

  addFlood(color: string, opacityOrAttributes: number | Attributes = {}, attributes: Attributes = {}) {
    const floodAttributes = { "flood-color": color };
    if (typeof opacityOrAttributes === "number") {
      floodAttributes["flood-opacity"] = opacityOrAttributes;
    } else {
      attributes = opacityOrAttributes;
    }
    const allAttributes = {...floodAttributes, ...attributes};
    this.filters_.push(createFilterNode("feFlood", allAttributes));
    return this;
  }

  addComposite(in1: SVGAnimatedString, in2: SVGAnimatedString, attributes: Attributes = {}) { // REVIEW
    const allAttributes = {in: in1, in2, ...attributes};
    this.filters_.push(createFilterNode("feComposite", allAttributes));
    return this;
  }

  addColorMatrix(type: SVGAnimatedEnumeration, valueOrAttributes: string | number | Attributes = {}, attributes: Attributes = {}) {
    const colorMatrixAttributes: { type: SVGAnimatedEnumeration, [key: string]: any } = { type };
    if (["string", "number"].includes(typeof valueOrAttributes)) {
      colorMatrixAttributes.values = valueOrAttributes;
    } else {
      attributes = valueOrAttributes as Attributes;
    }
    const allAttributes = {...colorMatrixAttributes, ...attributes};
    this.filters_.push(createFilterNode("feColorMatrix", allAttributes));
    return this;
  }

  addComponentTransfer(attributes: Attributes = {}) {
    const children = [];
    const KEYS = ["r", "g", "b", "a"];
    for (const key of KEYS) {
      if (!attributes[key]) continue;
      const tag = `feFunc${key.toUpperCase}`;
      children.push(createElement(tag, attributes[key]));
    }

    this.filters_.push(createFilterNode("feComponentTransfer", omit(attributes, KEYS), children));
    return this;
  }

  addMergeNode(attributes: Attributes = {}) {
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