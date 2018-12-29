import { Expression } from "cassowary";
import {
  appendTo,
  insertAfter,
  insertAt,
  insertBefore,
  omit,
  prependTo,
  setAttribute
} from "./utils";
import { variable } from "./helpers";

export default class Element {
  constructor(tag, attributes = {}) {
    this.tag_ = tag;
    this.attributes_ = omit(attributes, ["x", "y", "width", "height"]);
    this.children_ = [];

    this.x = variable("x", attributes.x);
    this.y = variable("y", attributes.y);
    this.width = variable("width", attributes.width);
    this.height = variable("height", attributes.height);

    this.leftEdge = new Expression(this.x);
    this.topEdge = new Expression(this.y);
    this.rightEdge = this.leftEdge.plus(this.width);
    this.bottomEdge = this.topEdge.plus(this.height);
    this.centerX = this.leftEdge.plus(new Expression(this.width).divide(2));
    this.centerY = this.topEdge.plus(new Expression(this.height).divide(2));

    // TODO: add more
  }
  append(...children) {
    appendTo(this.children_, children);
    return this;
  }
  prepend(...children) {
    prependTo(this.children_, children);
    return this;
  }
  insertAt(index, ...children) {
    insertAt(this.children_, index, children);
    return this;
  }
  insertBefore(child, ...children) {
    insertBefore(this.children_, child, children);
    return this;
  }
  insertAfter(child, ...children) {
    insertAfter(this.children_, child, children);
    return this;
  }
  render() {
    const el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      this.tag_
    );
    for (const [name, value] of Object.entries(this.attributes_)) {
      setAttribute(el, name, value);
    }
    for (const child of this.children_) {
      el.appendChild(child.render());
    }

    el.setAttributeNS(null, "x", this.x.value);
    el.setAttributeNS(null, "y", this.y.value);
    el.setAttributeNS(null, "width", this.width.value);
    el.setAttributeNS(null, "height", this.height.value);

    return el;
  }
}
