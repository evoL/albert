import {
  Expression,
  Variable,
  AbstractVariable,
  Constraint,
  Strength,
  Equation,
  LEQ,
  Inequality,
  GEQ,
  StayConstraint
} from "cassowary-ts";
import { uniqueId, castArray, arePointLike, identity, isPointLike } from './utils';
import Point from "./Point";
import Element from "./Element";

export function expression(something: any) {
  return something instanceof Expression ? something : new Expression(something);
}

export function variable(name: string, value: number = undefined) {
  return new Variable({ name: uniqueId(name), value });
}

type varOrNum = AbstractVariable | number;

export function point(
  p: Point | [varOrNum, varOrNum] | varOrNum = undefined,
  y: varOrNum = undefined
) {
  if (p instanceof Point) return p;
  if (Array.isArray(p)) return Point.fromPair(p);
  if (
    (typeof p === "number" || p instanceof AbstractVariable) &&
    y !== undefined
  ) {
    return new Point(p, y);
  }

  return new Point(0, 0);
}

export function between(a: Element, b: Element, percentage: number) {
  const ax = expression(a.x);
  const ay = expression(a.y);
  const bx = expression(b.x);
  const by = expression(b.y);

  return {
    x: ax.plus(bx.minus(ax).times(percentage)),
    y: ay.plus(by.minus(ay).times(percentage))
  }
}

export function center(a: Element, b: Element) {
  const ax = expression(a.x);
  const ay = expression(a.y);

  return {
    x: ax.plus(b.x).divide(2),
    y: ay.plus(b.y).divide(2)
  }
}

function makeDistanceGetter(distance: number | (() => any) | Expression | AbstractVariable, method = ""): (...args: any[]) => any {
  if (
    typeof distance === "number" ||
    distance instanceof AbstractVariable ||
    distance instanceof Expression
  ) {
    return () => distance;
  } else if (typeof distance === "function") {
    return distance;
  } else {
    const prefix = method.length ? `${method}: ` : "";
    throw new Error(
      prefix + "distance must be a number, function, variable, or expression"
    );
  }
}

export function negative(something: number | AbstractVariable | Expression) {
  if (typeof something === "number") {
    return -something;
  } else if (something instanceof AbstractVariable) {
    return new Expression(something).times(-1);
  } else if (something instanceof Expression) {
    return something.times(-1);
  } else {
    throw new Error("Cannot take negative value of " + something);
  }
}

// REVIEW may not be an actual constraint class
export function forEach(array: any[], constraint: Constraint | any) {
  return array.reduce(
    (result, item, index, arr) =>
      result.concat(castArray(constraint(item, index, arr))),
    []
  )
}

export function eq(a: any, b: any) {
  if (arePointLike(a, b)) {
    return [eq(a.x, b.x), eq(a.y, b.y)]
  }
  return new Equation(a, b, Strength.weak, 1);
}

export function eqAll(array: any[], getter: Function) {
  const constraints = [];
  for (let i = 1; i < array.length; i++) {
    constraints.push(eq(getter(array[i - 1]), getter(array[i])));
  }
  return constraints;
}

export function leq(
  a: number | Expression | AbstractVariable,
  b: number | Expression | AbstractVariable
) {
  return new Inequality(a, LEQ, b, Strength.weak, 1);
}

export function leqAll(array: any[], getter: Function) {
  const constraints = [];
  for (let i = 1; i < array.length; i++) {
    constraints.push(leq(getter(array[i - 1]), getter(array[i])));
  }
  return constraints;
}

export function geq(
  a: number | Expression | AbstractVariable,
  b: number | Expression | AbstractVariable
) {
  return new Inequality(a, GEQ, b, Strength.weak, 1);
}

// REVIEW possibly redundant...?
export function geqAll(array: any[], getter: Function) {
  const constraints = [];
  for (let i = 1; i < array.length; i++) {
    constraints.push(leq(getter(array[i - 1]), getter(array[i])));
  }
  return constraints;
}

export function makeStay(variable: any) {
  return new StayConstraint(variable, Strength.weak, 1);
}

export function fix(...vars: any[]) {
  return vars.reduce(
    (constraints, variable) =>
      constraints.concat(
        variable instanceof Point
          ? [makeStay(variable.x_), makeStay(variable.y_)]
          : [makeStay(variable)]
      ),
    []
  );
}

export function fixAll(array: any[], getter = identity) {
  return fix(...array.map(getter));
}

export function align(a: any, b: any, distance = 0, strength = Strength.weak) {
  if (arePointLike(a, b)) {
    const distanceObj = isPointLike(distance)
        // because typescript is silly sometimes
      ? distance as unknown as { x: number; y: number; }
      : { x: distance, y: distance };
    return [
      align(a.x, b.x, distanceObj.x, strength),
      align(a.y, b.y, distanceObj.y, strength)
    ];
  }

  const aExpression = expression(a);

  const leftSide = aExpression.minus(b);
  return new Equation(leftSide, distance, strength);
}

export function fill(
  a: any,
  b: any,
  offsetXOrBoth = 0,
  offsetY = undefined,
  strength = Strength.weak
) {
  if (offsetY === undefined) {
    offsetY = offsetXOrBoth;
  }

  return [
    align(a.topEdge, b.topEdge, -offsetY, strength),
    align(a.rightEdge, b.rightEdge, offsetXOrBoth, strength),
    align(a.bottomEdge, b.bottomEdge, offsetY, strength),
    align(a.leftEdge, b.leftEdge, -offsetXOrBoth, strength)
  ];
}

export function alignAll(array: any[], getter: (...args: any[]) => any, distance = 0) {
  const constraints = [];
  const distanceGetter: Function = makeDistanceGetter(distance, "alignAll");

  for (let i = 1; i < array.length; i++) {
    constraints.push(
      align(
        getter(array[i - 1]),
        getter(array[i]),
        distanceGetter(array[i - 1])
      )
    );
  }
  return constraints;
}

export function distribute(array: any[], getter: (...args: any[]) => any ) {
  const constraints = [];
  const attributes = array.map(getter);

  for (let i = 2; i < attributes.length; i++) {
    const a = attributes[i - 2];
    const b = attributes[i - 1];
    const c = attributes[i];

    const bExpression = expression(b);
    const cExpression = expression(c);

    const leftSide = bExpression.minus(a);
    const rightSide = cExpression.minus(b);

    constraints.push(new Equation(leftSide, rightSide));
  }
  return constraints;
}

export function spaceHorizontally(array, distance = 0) {
  const constraints = [];
  const distanceGetter = makeDistanceGetter(distance);
  for (let i = 1; i < array.length; i++) {
    constraints.push(
      align(
        array[i - 1].rightEdge,
        array[i].leftEdge,
        negative(distanceGetter(array[i - 1])) as number // REVIEW might not always be the case?
      )
    );
  }
  return constraints;
}

export function spaceVertically(array, distance = 0) {
  const constraints = [];
  const distanceGetter = makeDistanceGetter(distance);
  for (let i = 1; i < array.length; i++) {
    constraints.push(
      align(
        array[i - 1].bottomEdge,
        array[i].topEdge,
        negative(distanceGetter(array[i - 1])) as number // REVIEW see above
      )
    );
  }
  return constraints;
}