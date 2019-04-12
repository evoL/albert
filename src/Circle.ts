import Renderable from './Renderable';
import Attributes from './Attributes';
import { omit, createElement } from './utils';
import { Variable, Expression } from 'cassowary-ts';
import { variable, expression } from './helpers';


export default class Circle implements Renderable {
  private attributes_: Attributes;

  public cx: Variable;
  public cy: Variable;
  public r: Variable;

  public centerX: Expression;
  public centerY: Expression;
  public leftEdge: Expression;
  public rightEdge: Expression;
  public topEdge: Expression;
  public bottomEdge: Expression;
  public x: Expression;
  public y: Expression;
  public width: Expression;
  public height: Expression;

  constructor(attributes: Attributes = {}) {
    this.attributes_ = omit(attributes, ["cx", "cy", "r"]);

    const idPrefix = attributes.id ? attributes.id + ":" : "";

    this.cx = variable(idPrefix + "circle.cx", attributes.cx as number);
    this.cy = variable(idPrefix + "circle.cy", attributes.cy as number);
    this.r = variable(idPrefix + "circle.r", attributes.r as number);

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

    el.setAttributeNS(null, "cx", `${this.cx.value}`);
    el.setAttributeNS(null, "cy", `${this.cy.value}`);
    el.setAttributeNS(null, "r", `${this.r.value}`);

    return el;
  }
}