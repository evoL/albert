import { Expression, Variable } from "cassowary-ts";
import { createElement, omit } from "./utils";
import { variable } from "./helpers";
import Attributes from './Attributes';
import Renderable from './Renderable';

export default class Line implements Renderable {
  private attributes_: Attributes;

  public x1: Variable;
  public y1: Variable;
  public x2: Variable;
  public y2: Variable;

  public centerX: Expression;
  public centerY: Expression;

  constructor(attributes: Attributes = {}) {
    this.attributes_ = omit(attributes, ["x1", "y1", "x2", "y2"]);

    const idPrefix = attributes.id ? attributes.id + ":" : "";
    this.x1 = variable(idPrefix + "line.x1", attributes.x1 as number);
    this.y1 = variable(idPrefix + "line.y1", attributes.y1 as number);
    this.x2 = variable(idPrefix + "line.x2", attributes.x2 as number);
    this.y2 = variable(idPrefix + "line.y2", attributes.y2 as number);

    this.centerX = new Expression(this.x1).plus(this.x2).divide(2);
    this.centerY = new Expression(this.y1).plus(this.y2).divide(2);
  }

  render() {
    const el = createElement("line", this.attributes_);

    el.setAttributeNS(null, "x1", `${this.x1.value}`);
    el.setAttributeNS(null, "y1", `${this.y1.value}`);
    el.setAttributeNS(null, "x2", `${this.x2.value}`);
    el.setAttributeNS(null, "y2", `${this.y2.value}`);

    return el;
  }
}