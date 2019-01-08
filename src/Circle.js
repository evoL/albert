import { createElement, omit } from "./utils";
import { expression, variable } from "./helpers";

export default class Circle {
  constructor(attributes = {}) {
    this.attributes_ = omit(attributes, ["cx", "cy", "r"]);

    const idPrefix = attributes.id ? attributes.id + ":" : "";

    this.cx = variable(idPrefix + "circle.cx", attributes.cx);
    this.cy = variable(idPrefix + "circle.cy", attributes.cy);
    this.r = variable(idPrefix + "circle.r", attributes.r);

    this.centerX = expression(this.cx);
    this.centerY = expression(this.cy);
    this.leftEdge = this.centerX.minus(this.r);
    this.rightEdge = this.centerX.plus(this.r);
    this.topEdge = this.centerY.minus(this.r);
    this.bottomEdge = this.centerY.plus(this.r);
    this.x = this.leftEdge;
    this.y = this.topEdge;
    this.width = expression(this.r).times(2);
    this.height = this.width;
  }

  render() {
    const el = createElement("circle", this.attributes_);

    el.setAttributeNS(null, "cx", this.cx.value);
    el.setAttributeNS(null, "cy", this.cy.value);
    el.setAttributeNS(null, "r", this.r.value);

    return el;
  }
}
