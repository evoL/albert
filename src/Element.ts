import BasicElement from './BasicElement';
import Attributes from './Attributes';
import { omit } from './utils';
import { variable } from './helpers';
import { Expression, Variable } from 'cassowary-ts'

export default class Element extends BasicElement {
  public x: Variable;
  public y: Variable;
  public width: Variable;
  public height: Variable;

  public leftEdge: Expression;
  public topEdge: Expression;
  public rightEdge: Expression;
  public bottomEdge: Expression;
  public centerX: Expression;
  public centerY: Expression;

  constructor(tag, attributes: Attributes = {}) {
    super(tag, omit(attributes, ["x", "y", "width", "height"]));

    const idPrefix = attributes.id ? attributes.id + ":" : "";

    this.x = variable(idPrefix + "x", attributes.x as number);
    this.y = variable(idPrefix + "y", attributes.y as number);
    this.width = variable(idPrefix + "width", attributes.width as number);
    this.height = variable(idPrefix + "height", attributes.height as number);

    this.leftEdge = new Expression(this.x);
    this.topEdge = new Expression(this.y);
    this.rightEdge = this.leftEdge.plus(this.width);
    this.bottomEdge = this.topEdge.plus(this.height);
    this.centerX = this.leftEdge.plus(new Expression(this.width).divide(2));
    this.centerY = this.topEdge.plus(new Expression(this.height).divide(2));
  }

  render() {
    const el = super.render();

    el.setAttributeNS(null, "x", `${this.x.value}`);
    el.setAttributeNS(null, "y", `${this.y.value}`);
    el.setAttributeNS(null, "width", `${this.width.value}`);
    el.setAttributeNS(null, "height", `${this.height.value}`);

    return el;
  }
}