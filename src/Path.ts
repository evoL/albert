import { createElement, omit } from './utils';
import Attributes from './Attributes';
import { point } from './helpers';

function op(name: string, point = undefined) {
  return { name, point }
}

export default class Path {
  private attributes_: Attributes;
  private operations_: any[];

  constructor(attributes: Attributes = {}) {
    this.attributes_ = omit(attributes, ["d"]);
    this.operations_ = [];
  }

  clone() {
    const deepCopy = new Path(this.attributes_);
    const pointMap = new Map();

    deepCopy.operations_ = this.operations_.map(({name, point}) => {
      if (point) {
        if (!pointMap.has(point)) {
          pointMap.set(point, point.clone());
        }
        return op(name, pointMap.get(point));
      } else {
        return op(name);
      }
    })
    return deepCopy;
  }

  setAttributes(attributes) {
    this.attributes_ = { ...this.attributes_, ...attributes };
    return this;
  }

  moveTo(xOrPoint: any, y = undefined) {
    const p = point(xOrPoint, y);
    this.operations_.push(op("M", p));
    return this;
  }

  lineTo(xOrPoint: any, y = undefined) {
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

  private computeDescription_() {
    return this.operations_
      .map(({ name, point }) => {
        return `${name}${point || ""}`;
      })
      .join("");
  }
}