import { Variable, AbstractVariable, Expression } from 'cassowary-ts';
import { variable } from './helpers';


export default class Point {
  // REVIEW public because used in helpers.ts
  public x_: Variable;
  public y_: Variable;

  public x: Expression;
  public y: Expression;

  static fromPair([x, y]) {
    return new Point(x, y);
  }

  constructor(x: number | AbstractVariable, y: number | AbstractVariable) {
    this.x_ = x instanceof AbstractVariable ? x as Variable : variable("point.x", x);
    this.y_ = y instanceof AbstractVariable ? y as Variable : variable("point.y", y);

    this.x = new Expression(this.x_);
    this.y = new Expression(this.y_);
  }

  clone() {
    return new Point(this.x_.value as number, this.y_.value as number);
  }

  toString() {
    return `${this.x_.value},${this.y_.value}`;
  }

}