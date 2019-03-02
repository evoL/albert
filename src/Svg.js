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
  constructor(elementOrOptions = null, options = {}) {
    if (elementOrOptions instanceof Element) {
      this.el_ = elementOrOptions;
      this.options_ = options;
    } else {
      this.el_ = createElement("svg");
      this.options_ = elementOrOptions;
    }

    this.options_ = Object.assign({ allowResize: false }, this.options_);

    this.solver_ = new SimplexSolver();
    this.constraints_ = [];
    this.children_ = [];
    this.defs_ = [];

    const viewBox = this.el_.viewBox.baseVal;
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
    if (!this.options_.allowResize) {
      this.solver_.addStay(this.width, Strength.required);
      this.solver_.addStay(this.height, Strength.required);
    }
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
      castArray(constraint).forEach(c => {
        this.constraints_.push(c);
        this.solver_.addConstraint(c);
      });
    }
    return this;
  }
  render() {
    if (this.defs_.length) {
      this.renderDefs_();
    }
    if (this.options_.allowResize) {
      this.el_.setAttributeNS(
        null,
        "viewBox",
        [this.x.value, this.y.value, this.width.value, this.height.value].join(
          " "
        )
      );
    }
    for (const child of this.children_) {
      this.el_.appendChild(child.render());
    }
    return this;
  }
  getConstraints() {
    return this.constraints_;
  }
  getConstraintDescriptions() {
    return this.constraints_.map(constraint => constraint.toString());
  }
  getElement() {
    return this.el_;
  }
  renderDefs_() {
    const defs = createElement("defs");
    for (const def of this.defs_) {
      defs.appendChild(def.render());
    }
    this.el_.appendChild(defs);
  }
}
