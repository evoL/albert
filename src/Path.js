import { isPointLike, omit, setAttribute } from "./utils";
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
    const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
    for (const [name, value] of Object.entries(this.attributes_)) {
      setAttribute(el, name, value);
    }

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
