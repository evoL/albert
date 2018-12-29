import { AbstractVariable, Expression } from "cassowary";
import { variable } from "./helpers";

export default class Point {
  constructor(x, y) {
    this.x_ = x instanceof AbstractVariable ? x : variable("point.x", x);
    this.y_ = y instanceof AbstractVariable ? y : variable("point.y", y);

    this.x = new Expression(this.x_);
    this.y = new Expression(this.y_);
  }

  static fromPair([x, y]) {
    return new Point(x, y);
  }

  clone() {
    return new Point(this.x_.value, this.y_.value);
  }

  toString() {
    return `${this.x_.value},${this.y_.value}`;
  }
}
