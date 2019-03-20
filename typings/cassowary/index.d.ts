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

// Type definitions for cassowary.js 0.0.2
// Project: albert
// Definitions by: Rafał Hirsz <https://hirsz.co>

declare module "cassowary" {
  export class SymbolicWeight {
    value: number;
  }

  export class Strength {
    name: string;
    symbolicWeight: SymbolicWeight;
    readonly required: boolean;
    toString(): string;

    static required: Strength;
    static strong: Strength;
    static medium: Strength;
    static weak: Strength;
  }

  export class AbstractVariable {
    isDummy: boolean;
    isExternal: boolean;
    isPivotable: boolean;
    isRestricted: boolean;
    hashCode: number;
    name: string;
    value: number;
    _prefix: string;

    valueOf(): number;
    toJSON(): {};
    toString(): string;
  }

  export class Variable extends AbstractVariable {}

  export class Expression {
    constructor(cvar: AbstractVariable, value?: number, constant?: number);

    constant: number;
    terms: any;
    externalVariables: any;
    solver: any | undefined;

    plus(expr: Expression | Variable): Expression;
    minus(expr: Expression | Variable): Expression;
    divide(x: number | Expression): Expression;
  }

  export class AbstractConstraint {
    hashCode: number;
    strength: Strength;
    weight: number;

    isEdit: boolean;
    isInequality: boolean;
    isStay: boolean;

    readonly required: boolean;
    toString(): string;
  }

  export class Constraint extends AbstractConstraint {
    expression: Expression;
  }

  export class SimplexSolver {
    addStay(v: Variable, strength?: Strength, weight?: number): SimplexSolver;
    addConstraint(constraint: Constraint): SimplexSolver;
  }
}
