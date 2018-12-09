import { omit, setAttribute } from "./utils";
import { point } from "./helpers";

function op(name, point = undefined) {
  return { name, point };
}

export default class Path {
  constructor(attributes = {}) {
    this.attributes_ = omit(attributes, ["d"]);
    this.operations_ = [];
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
