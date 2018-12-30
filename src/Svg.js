import { Expression, SimplexSolver, Strength } from "cassowary";
import {
  appendTo,
  castArray,
  createElement,
  insertAfter,
  insertAt,
  insertBefore,
  prependTo
} from "./utils";
import { variable } from "./helpers";

export default class Svg {
  constructor(element) {
    this.el_ = element;
    this.solver_ = new SimplexSolver();
    this.children_ = [];
    this.defs_ = [];

    const viewBox = element.viewBox.baseVal;
    this.x = variable("x", viewBox.x);
    this.y = variable("y", viewBox.y);
    this.width = variable("width", viewBox.width);
    this.height = variable("height", viewBox.height);

    this.leftEdge = new Expression(this.x);
    this.topEdge = new Expression(this.y);
    this.rightEdge = this.leftEdge.plus(this.width);
    this.bottomEdge = this.topEdge.plus(this.height);
    this.centerX = this.leftEdge.plus(this.rightEdge).divide(2);
    this.centerY = this.topEdge.plus(this.bottomEdge).divide(2);

    this.solver_.addStay(this.x, Strength.required);
    this.solver_.addStay(this.y, Strength.required);
    this.solver_.addStay(this.width, Strength.required);
    this.solver_.addStay(this.height, Strength.required);
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
  addDefs(...defs) {
    appendTo(this.defs_, defs);
    return this;
  }
  constrain(...constraints) {
    for (const constraint of constraints) {
      castArray(constraint).forEach(c => this.solver_.addConstraint(c));
    }
    return this;
  }
  render() {
    if (this.defs_.length) {
      this.renderDefs_();
    }

    for (const child of this.children_) {
      this.el_.appendChild(child.render());
    }
    return this;
  }
  renderDefs_() {
    const defs = createElement("defs");
    for (const def of this.defs_) {
      defs.appendChild(def.render());
    }
    this.el_.appendChild(defs);
  }
}
