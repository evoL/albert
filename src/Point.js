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

import { AbstractVariable, Expression } from "cassowary-ts";
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
