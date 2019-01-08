import {
  Equation,
  Expression,
  GEQ,
  LEQ,
  Strength,
  Inequality
} from "cassowary";
import {
  alignAll,
  distribute,
  eqAll,
  geqAll,
  fixAll,
  forEach,
  leqAll,
  spaceHorizontally,
  spaceVertically,
  variable
} from "./helpers";
import {
  appendTo,
  createElement,
  insertAfter,
  insertAt,
  insertBefore,
  prependTo
} from "./utils";

export default class Group {
  constructor(childrenOrAttributes = {}, attributes = {}) {
    if (Array.isArray(childrenOrAttributes)) {
      this.children_ = childrenOrAttributes;
      this.attributes_ = attributes;
    } else {
      this.children_ = [];
      this.attributes_ = childrenOrAttributes;
    }
    this.constraints_ = [];

    const idPrefix = attributes.id ? attributes.id + ":" : "";
    this.leftEdge = variable(idPrefix + "group.leftEdge", 0);
    this.topEdge = variable(idPrefix + "group.topEdge", 0);
    this.rightEdge = variable(idPrefix + "group.rightEdge", 0);
    this.bottomEdge = variable(idPrefix + "group.bottomEdge", 0);

    this.x = new Expression(this.leftEdge);
    this.y = new Expression(this.topEdge);
    this.width = new Expression(this.rightEdge).minus(this.leftEdge);
    this.height = new Expression(this.bottomEdge).minus(this.topEdge);
    this.centerX = new Expression(this.leftEdge).plus(this.rightEdge).divide(2);
    this.centerY = new Expression(this.topEdge).plus(this.bottomEdge).divide(2);

    this.topMostChild_ = null;
    this.bottomMostChild_ = null;
    this.leftMostChild_ = null;
    this.rightMostChild_ = null;
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
    const el = createElement("g", this.attributes_);
    for (const child of this.children_) {
      el.appendChild(child.render());
    }

    // For debugging
    el.setAttributeNS(null, "data-top-edge", this.topEdge.value);
    el.setAttributeNS(null, "data-right-edge", this.rightEdge.value);
    el.setAttributeNS(null, "data-bottom-edge", this.bottomEdge.value);
    el.setAttributeNS(null, "data-left-edge", this.leftEdge.value);

    return el;
  }

  constraints() {
    const result = this.constraints_.slice();

    if (this.topMostChild_) {
      result.push(
        new Equation(
          this.topEdge,
          this.topMostChild_.topEdge,
          Strength.medium,
          1
        )
      );
    }
    if (this.bottomMostChild_) {
      result.push(
        new Equation(
          this.bottomEdge,
          this.bottomMostChild_.bottomEdge,
          Strength.medium,
          1
        )
      );
    }
    if (this.leftMostChild_) {
      result.push(
        new Equation(
          this.leftEdge,
          this.leftMostChild_.leftEdge,
          Strength.medium,
          1
        )
      );
    }
    if (this.rightMostChild_) {
      result.push(
        new Equation(
          this.rightEdge,
          this.rightMostChild_.rightEdge,
          Strength.medium,
          1
        )
      );
    }

    for (const child of this.children_) {
      if (child !== this.topMostChild_) {
        result.push(
          new Inequality(this.topEdge, LEQ, child.topEdge, Strength.weak, 1)
        );
      }
      if (child !== this.bottomMostChild_) {
        result.push(
          new Inequality(
            this.bottomEdge,
            GEQ,
            child.bottomEdge,
            Strength.weak,
            1
          )
        );
      }
      if (child !== this.leftMostChild_) {
        result.push(
          new Inequality(this.leftEdge, LEQ, child.leftEdge, Strength.weak, 1)
        );
      }
      if (child !== this.rightMostChild_) {
        result.push(
          new Inequality(this.rightEdge, GEQ, child.rightEdge, Strength.weak, 1)
        );
      }
    }
    return result;
  }

  forEach(constraint) {
    appendTo(this.constraints_, forEach(this.children_, constraint));
    return this;
  }

  fixAll(getter) {
    appendTo(this.constraints_, fixAll(this.children_, getter));
    return this;
  }

  alignAll(getter, distance = undefined) {
    appendTo(this.constraints_, alignAll(this.children_, getter, distance));
    return this;
  }

  eqAll(getter) {
    appendTo(this.constraints_, eqAll(this.children_, getter));
    return this;
  }

  geqAll(getter) {
    appendTo(this.constraints_, geqAll(this.children_, getter));
    return this;
  }

  leqAll(getter) {
    appendTo(this.constraints_, leqAll(this.children_, getter));
    return this;
  }

  distribute(getter) {
    appendTo(this.constraints_, distribute(this.children_, getter));
    return this;
  }

  spaceHorizontally(distance = 0) {
    this.leftMostChild_ = this.children_[0];
    this.rightMostChild_ = this.children_[this.children_.length - 1];

    appendTo(this.constraints_, spaceHorizontally(this.children_, distance));
    return this;
  }

  spaceVertically(distance = 0) {
    this.topMostChild_ = this.children_[0];
    this.bottomMostChild_ = this.children_[this.children_.length - 1];

    appendTo(this.constraints_, spaceVertically(this.children_, distance));
    return this;
  }
}
