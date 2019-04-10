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
//                 Dominick Reba <https://github.com/dar2355>


declare module "cassowary-ts" {
  // c
  export const GEQ = 1;
  export const LEQ = 2;
  export enum Equalities {
      GEQ = 1,
      LEQ = 2
  }
  export const plus: (e1: number | Variable, e2: number | Variable) => Expression | undefined;
  export const minus: (e1: number | Variable, e2: number | Variable) => Expression | undefined;
  export const times: (e1: number | Variable, e2: number | Variable) => Expression;
  export const divide: (e1: number | Variable, e2: number | Variable) => Expression;
  export const approx: (a: string | number, b: string | number) => boolean;
  export const _inc: () => number;

  // Constraint
  export class AbstractConstraint {
      hashCode: number;
      strength: Strength;
      weight: number;
      isEdit: boolean;
      isInequality: boolean;
      isStay: boolean;
      expression?: Expression;
      constructor(strength?: Strength, weight?: number);
      readonly required: boolean;
      toString(): string;
  }
  export class EditConstraint extends AbstractConstraint {
      variable: Variable;
      isEdit: boolean;
      constructor(cv: Variable, strength: Strength, weight?: number);
      toString(): string;
  }
  export class StayConstraint extends AbstractConstraint {
      variable: Variable;
      isStay: boolean;
      constructor(cv: Variable, strength: Strength, weight: number);
      toString(): string;
  }
  export class Constraint extends AbstractConstraint {
      constructor(cle: Expression, strength?: Strength, weight?: number);
  }
  export class Inequality extends Constraint {
      constructor(a1: Expression | AbstractVariable | number, a2: Equalities | Strength, a3: Expression | AbstractVariable | number, a4?: Strength, a5?: number);
      toString(): string;
  }
  export class Equation extends Constraint {
      constructor(a1: any, a2: any, a3: any, a4: any);
      toString(): string;
  }

  // Edit Info
  export class Editinfo {
    constraint: Constraint;
    editPlus: SlackVariable;
    editMinus: SlackVariable;
    prevEditConstant: number;
    index: number;
    constructor(cn: Constraint, eplus: SlackVariable, eminus: SlackVariable, prevEditConstant: number, i: number);
    toString(): string;
  }

  // Error
  export class Error {
      private _name;
      private _description;
      constructor(name?: string, message?: string);
      description: string;
      readonly message: string;
      toString(): string;
  }
  export const ConstraintNotFound: Error;
  export const InternalError: Error;
  export const NonExpression: Error;
  export const NotEnoughStays: Error;
  export const RequiredFailure: Error;
  export const TooDifficult: Error;

  // Expression
  export class Expression {
      constant: number;
      terms: HashTable;
      externalVariables: HashSet;
      solver?: SimplexSolver;
      static empty(solver?: any): Expression;
      static fromConstant(cons: any, solver?: any): Expression;
      static fromValue(v: any, solver?: any): Expression;
      static fromVariable(v: any, solver?: any): Expression;
      constructor(cvar?: AbstractVariable | number, value?: number, constant?: number);
      initializeFromHash(constant: number, terms: HashTable): this;
      multiplyMe(x: number): this;
      clone(): Expression;
      times(x: any): Expression;
      divide(x: any): Expression;
      plus(expr: Expression | Variable): Expression | undefined;
      minus(expr: Expression | Variable): Expression | undefined;
      addExpression(expr: Expression | AbstractVariable, n?: number, subject?: AbstractVariable, solver?: Tableau): this;
      addVariable(v: AbstractVariable, cd?: number, subject?: any, solver?: Tableau): this;
      setVariable(v: AbstractVariable, c?: number): this;
      anyPivotableVariable(): any;
      substituteOut(outvar: AbstractVariable, expr: Expression, subject: AbstractVariable, solver: Tableau): void;
      changeSubject(old_subject: AbstractVariable, new_subject: AbstractVariable): void;
      newSubject(subject: AbstractVariable): number;
      coefficientFor(clv: AbstractVariable): any;
      toString(): string;
      equals(other: any): boolean;
      Plus(e1: Expression, e2: Expression): Expression | undefined;
      Minus(e1: Expression, e2: Expression): Expression | undefined;
      Times(e1: Expression, e2: Expression): Expression | undefined;
      Divide(e1: Expression, e2: Expression): Expression | undefined;
      readonly isConstant: boolean;
      private _updateIfExternal;
  }

  export class HashSet {
      private _t;
      private _store;
      size: number;
      constructor();
      add(item: any): void;
      values(): any[];
      has(item: any): boolean;
      delete(item: any): null | undefined;
      clear(): void;
      each(func: any, scope?: any): void;
      escapingEach(func: any, scope?: any): void;
      toString(): string;
      toJSON(): {
          _t: string;
          data: any[];
      };
      fromJSON(o: any): HashSet;
  }

  export default class HashTable {
      private _store;
      private _keyStrMap;
      private _deleted;
      size: number;
      constructor();
      set(key: any, value: any): void;
      get(key: any): any;
      clear(): void;
      private _compact;
      private _compactThreshold;
      private _perhapsCompact;
      delete(key: any): void;
      each(callback: any, scope?: any): void;
      escapingEach(callback: any, scope?: any): any;
      clone(): HashTable;
      equals(other: any): boolean;
      toString(): string;
      toJSON(): {
          _t: string;
      };
      fromJSON(): HashTable;
  }

  export class Point {
      _x: Variable;
      _y: Variable;
      constructor(x: Variable | number, y: Variable | number, suffix?: string);
      x: number | Variable;
      y: number | Variable;
      toString(): string;
  }

  export class SimplexSolver extends Tableau {
      private _stayMinusErrorVars;
      private _stayPlusErrorVars;
      private _errorVars;
      private _markerVars;
      private _objective;
      private _editVarMap;
      private _editVarList;
      private _slackCounter;
      private _artificialCounter;
      private _dummyCounter;
      private _needsSolving;
      private _optimizeCount;
      private _editVariableStack;
      private _callbacks;
      autoSolve: boolean;
      constructor();
      addLowerBound(v: AbstractVariable, lower: number): this;
      addUpperBound(v: AbstractVariable, upper: number): this;
      addBounds(v: AbstractVariable, lower: number, upper: number): this;
      add(...args: Constraint[]): this;
      addEditVar(v: Variable, strength?: Strength, weight?: number): this;
      addEditConstraint(cn: any): this;
      addConstraint(cn: any): this;
      addConstraintNoException(cn: Constraint): boolean;
      beginEdit(): this;
      endEdit(): this;
      removeAllEditVars(): this;
      removeEditVarsTo(n: number): this;
      addPointStays(...points: Array<{
          x: any;
          y: any;
          [key: string]: any;
      }>): this;
      addStay(v: Variable, strength?: Strength, weight?: number): this;
      removeConstraint(cn: Constraint): this;
      reset(): void;
      resolveArray(newEditConstants: any): void;
      resolvePair(x: number, y: number): void;
      resolve(): void;
      suggestValue(v: Variable, x: number): SimplexSolver;
      solve(): SimplexSolver;
      setEditedValue(v: Variable, n: number): SimplexSolver;
      addVar(v: Variable): SimplexSolver;
      getInternalInfo(): string;
      getDebugInfo(): string;
      toString(): string;
      getConstraintMap(): HashTable;
      addWithArtificialVariable(expr: Expression): void;
      tryAddingDirectly(expr: Expression): boolean;
      chooseSubject(expr: Expression): any;
      deltaEditConstant(delta: number, plusErrorVar: AbstractVariable, minusErrorVar: AbstractVariable): void;
      dualOptimize(): void;
      newExpression(cn: Constraint, eplus_eminus: any[], prevEConstant: any): Expression;
      optimize(zVar: ObjectiveVariable): void;
      pivot(entryVar: AbstractVariable, exitVar: AbstractVariable): void;
      onSolved(): void;
      insertErrorVar(cn: Constraint, aVar: AbstractVariable): void;
      private _resetStayConstants;
      private _setExternalVariables;
      private _informCallbacks;
      private _addCallback;
  }

  export class Strength {
      static required: Strength;
      static strong: Strength;
      static medium: Strength;
      static weak: Strength;
      name: string;
      symbolicWeight: SymbolicWeight;
      constructor(name: string, symbolicWeight: SymbolicWeight | any, w2?: any, w3?: any);
      readonly required: boolean;
      toString(): string;
  }

  export class SymbolicWeight {
      private _t;
      value: number;
      constructor(...args: any[]);
      toJSON(): {
          _t: string;
          value: number;
      };
  }

  export class Tableau {
      _externalRows: HashSet;
      _externalParametricVars: HashSet;
      infeasibleRows: HashSet;
      columns: HashTable;
      rows: HashTable;
      constructor();
      noteRemovedVariable(v: AbstractVariable, subject: AbstractVariable): void;
      noteAddedVariable(v: AbstractVariable, subject: AbstractVariable): void;
      getInternalInfo(): string;
      toString(): string;
      insertColVar(param_var: AbstractVariable, rowvar: AbstractVariable): void;
      addRow(aVar: AbstractVariable, expr: Expression): void;
      removeColumn(aVar: AbstractVariable): void;
      removeRow(aVar: AbstractVariable): Expression;
      substituteOut(oldVar: AbstractVariable, expr: Expression): void;
      columnsHasKey(subject: AbstractVariable): boolean;
  }

  export type varArgs = {
      name?: string;
      value?: number;
      prefix?: string;
  };
  export class AbstractVariable {
      private _prefix;
      isDummy: boolean;
      isExternal: boolean;
      isPivotable: boolean;
      isRestricted: boolean;
      hashCode: number;
      name: string;
      value: number | string;
      constructor(args?: varArgs, varNamePrefix?: string);
      valueOf(): string | number;
      toJSON(): {
          _t: string;
          name: string;
          value: string | number;
          _prefix: any;
      };
      fromJSON(input: any, Ctor: any): void;
      toString(): string;
  }
  export class Variable extends AbstractVariable {
      private _t;
      isExternal: boolean;
      constructor(args?: varArgs);
  }
  export class DummyVariable extends AbstractVariable {
      private _t;
      isDummy: boolean;
      isRestricted: boolean;
      value: string;
      constructor(args?: varArgs);
  }
  export class ObjectiveVariable extends AbstractVariable {
      private _t;
      value: string;
      constructor(args?: varArgs);
  }
  export class SlackVariable extends AbstractVariable {
      private _t;
      isPivotable: boolean;
      isRestricted: boolean;
      value: string;
      constructor(args?: varArgs);
  }


}
// declare module "cassowary" {
//   export class SymbolicWeight {
//     value: number;
//   }

//   export class Strength {
//     name: string;
//     symbolicWeight: SymbolicWeight;
//     readonly required: boolean;
//     toString(): string;

//     static required: Strength;
//     static strong: Strength;
//     static medium: Strength;
//     static weak: Strength;
//   }

//   export class AbstractVariable {
//     isDummy: boolean;
//     isExternal: boolean;
//     isPivotable: boolean;
//     isRestricted: boolean;
//     hashCode: number;
//     name: string;
//     value: number;
//     _prefix: string;

//     valueOf(): number;
//     toJSON(): {};
//     toString(): string;
//   }

//   export class Variable extends AbstractVariable {}

//   export class Expression {
//     constructor(cvar: AbstractVariable, value?: number, constant?: number);

//     constant: number;
//     terms: any;
//     externalVariables: any;
//     solver: any | undefined;

//     plus(expr: Expression | Variable): Expression;
//     minus(expr: Expression | Variable): Expression;
//     divide(x: number | Expression): Expression;
//   }

//   export class AbstractConstraint {
//     hashCode: number;
//     strength: Strength;
//     weight: number;

//     isEdit: boolean;
//     isInequality: boolean;
//     isStay: boolean;

//     readonly required: boolean;
//     toString(): string;
//   }

//   export class Constraint extends AbstractConstraint {
//     expression: Expression;
//   }

//   export class SimplexSolver {
//     addStay(v: Variable, strength?: Strength, weight?: number): SimplexSolver;
//     addConstraint(constraint: Constraint): SimplexSolver;
//   }
// }
