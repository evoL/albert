import Nestable from './Nestable';
import Attributes from './Attributes';
import { Constraint, Variable, Expression, LEQ, GEQ, Inequality, Strength, Equation } from 'cassowary-ts';
import Element from './Element';
import { variable, forEach, fixAll, eqAll, alignAll, leqAll, distribute, spaceHorizontally, spaceVertically, geqAll } from './helpers';
import { createElement, appendTo } from './utils';
import Renderable from './Renderable';


export default class Group extends Nestable implements Renderable {

  private attributes_: Attributes;
  private constraints_: Constraint[];

  private topMostChild_: Element;
  private bottomMostChild_: Element;
  private leftMostChild_: Element;
  private rightMostChild_: Element;

  public leftEdge: Variable;
  public topEdge: Variable;
  public rightEdge: Variable;
  public bottomEdge: Variable;

  public x: Expression;
  public y: Expression;
  public width: Expression;
  public height: Expression;
  public centerX: Expression;
  public centerY: Expression;

  constructor(childrenOrAttributes: any = {}, attributes: Attributes = {}) {
    super();

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

  render() {
    const el = createElement("g", this.attributes_);
    for (const child of this.children_) {
      el.appendChild(child.render());
    }

    // debugging
    el.setAttributeNS(null, "data-top-edge", this.topEdge.value as string);
    el.setAttributeNS(null, "data-right-edge", this.rightEdge.value as string);
    el.setAttributeNS(null, "data-bottom-edge", this.bottomEdge.value as string);
    el.setAttributeNS(null, "data-left-edge", this.leftEdge.value as string);

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

    // REVIEW - property <x> does not exist on type "Renderable"
    for (const child of this.children_ as Element[]) {
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

  forEach(constraint: Constraint) {
    appendTo(this.constraints_, forEach(this.children_, constraint));
    return this;
  }

  fixAll(getter: () => any) {
    appendTo(this.constraints_, fixAll(this.children_, getter));
    return this;
  }

  alignAll(getter: () => any, distance: number = undefined) {
    appendTo(this.constraints_, alignAll(this.children_, getter, distance));
  }

  eqAll(getter: () => any) {
    appendTo(this.constraints_, eqAll(this.children_, getter));
    return this;
  }

  geqAll(getter: () => any) {
    appendTo(this.constraints_, geqAll(this.children_, getter));
    return this;
  }

  leqAll(getter: () => any) {
    appendTo(this.constraints_, leqAll(this.children_, getter));
    return this;
  }

  distribute(getter: () => any) {
    appendTo(this.constraints_, distribute(this.children_, getter));
    return this;
  }

  // REVIEW not sure what you'd like to do here
  spaceHorizontally(distance = 0) {
    this.leftMostChild_ = this.children_[0] as Element;
    this.rightMostChild_ = this.children_[this.children_.length - 1] as Element;

    appendTo(this.constraints_, spaceHorizontally(this.children_, distance));
    return this;
  }

  // REVIEW or here... maybe casting to Element with "as Element" ...?
  spaceVertically(distance = 0) {
    this.topMostChild_ = this.children_[0] as Element;
    this.bottomMostChild_ = this.children_[this.children_.length - 1] as Element;

    appendTo(this.constraints_, spaceVertically(this.children_, distance));
    return this;
  }
}