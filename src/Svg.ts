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

import EdgeConstrainable from "./EdgeConstrainable";
import Renderable from "./Renderable";
import {
  Constraint,
  Expression,
  SimplexSolver,
  Strength,
  Variable
} from "cassowary";
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

export interface SvgOptions {
  /**
   * If true, allows Albert to resize the SVG viewBox based of the specified
   * constraints. Default: false;
   */
  allowResize: boolean;
}

/**
 * Represents the root <svg> element and provides the contraint solving
 * facilities.
 *
 * Both parameters are optional. If no DOM element is specified, it will be
 * generated for you.
 *
 * Example usage:
 *
 *   const svg = new Svg(document.queryElement('svg'));
 *   svg.append(someAlbertRenderable);
 *   svg.constrain(yourConstraint);
 *   svg.render();
 *
 * Usage with a generated SVG element:
 *
 *   const svg = new Svg();
 *   const svgEl = svg.getElement();
 *   document.body.appendChild(svgEl);  // or whatever you want
 *
 * Passing options:
 *
 *   const svg = new Svg({ allowResize: true });
 */
export default class Svg implements EdgeConstrainable {
  private el_: SVGSVGElement;
  private options_: SvgOptions;
  private solver_: SimplexSolver;
  private constraints_: Array<Constraint>;
  private children_: Array<Renderable>;
  private defs_: Array<Renderable>;

  x: Variable;
  y: Variable;
  width: Variable;
  height: Variable;
  leftEdge: Expression;
  rightEdge: Expression;
  topEdge: Expression;
  bottomEdge: Expression;
  centerX: Expression;
  centerY: Expression;

  constructor(
    elementOrOptions: SVGSVGElement | Partial<SvgOptions> | null = null,
    options: Partial<SvgOptions> = {}
  ) {
    const { realEl, realOptions } = ((): {
      realEl: SVGSVGElement;
      realOptions: Partial<SvgOptions>;
    } =>
      elementOrOptions instanceof Element
        ? {
            realEl: elementOrOptions,
            realOptions
          }
        : {
            realEl: createElement("svg") as SVGSVGElement,
            realOptions: elementOrOptions
          })();

    this.el_ = realEl;
    this.options_ = Object.assign({ allowResize: false }, options);
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

  /** Appends Albert renderables. */
  append(...children: Array<Renderable>): Svg {
    appendTo(this.children_, children);
    return this;
  }

  /** Prepends Albert renderables. */
  prepend(...children: Array<Renderable>): Svg {
    prependTo(this.children_, children);
    return this;
  }

  /** Inserts Albert renderables at a specific index. */
  insertAt(index: number, ...children: Array<Renderable>): Svg {
    insertAt(this.children_, index, children);
    return this;
  }

  /** Inserts Albert renderables before the passed in child. */
  insertBefore(child: Renderable, ...children: Array<Renderable>): Svg {
    insertBefore(this.children_, child, children);
    return this;
  }

  /** Inserts Albert renderables after the passed in child. */
  insertAfter(child: Renderable, ...children: Array<Renderable>): Svg {
    insertAfter(this.children_, child, children);
    return this;
  }

  /** Adds renderables to the <defs> section of the SVG. */
  addDefs(...defs: Array<Renderable>): Svg {
    appendTo(this.defs_, defs);
    return this;
  }

  /** Applies constraints to the SVG. */
  constrain(...constraints: Array<Constraint | Array<Constraint>>): Svg {
    for (const constraint of constraints) {
      castArray(constraint).forEach(c => {
        this.constraints_.push(c);
        this.solver_.addConstraint(c);
      });
    }
    return this;
  }

  /**
   * Renders the contents of the SVG to the DOM.
   *
   * If the `allowResize` option is true, this adjusts the `viewBox` to the
   * calculated size.
   */
  render(): Svg {
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

  /** Returns all constraints set on this SVG. */
  getConstraints(): ReadonlyArray<Constraint> {
    return this.constraints_;
  }

  /** Returns generated descriptions for all constraints. */
  getConstraintDescriptions(): ReadonlyArray<string> {
    return this.constraints_.map(constraint => constraint.toString());
  }

  /** Returns the SVG DOM element. */
  getElement(): SVGSVGElement {
    return this.el_;
  }

  /** Renders the <defs> section of the SVG. */
  renderDefs_(): void {
    const defs = createElement("defs");
    for (const def of this.defs_) {
      defs.appendChild(def.render());
    }
    this.el_.appendChild(defs);
  }
}
