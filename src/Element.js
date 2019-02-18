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

import BasicElement from "./BasicElement";
import { Expression } from "cassowary";
import { omit } from "./utils";
import { variable } from "./helpers";

export default class Element extends BasicElement {
  constructor(tag, attributes = {}) {
    super(tag, omit(attributes, ["x", "y", "width", "height"]));

    const idPrefix = attributes.id ? attributes.id + ":" : "";

    this.x = variable(idPrefix + "x", attributes.x);
    this.y = variable(idPrefix + "y", attributes.y);
    this.width = variable(idPrefix + "width", attributes.width);
    this.height = variable(idPrefix + "height", attributes.height);

    this.leftEdge = new Expression(this.x);
    this.topEdge = new Expression(this.y);
    this.rightEdge = this.leftEdge.plus(this.width);
    this.bottomEdge = this.topEdge.plus(this.height);
    this.centerX = this.leftEdge.plus(new Expression(this.width).divide(2));
    this.centerY = this.topEdge.plus(new Expression(this.height).divide(2));

    // TODO: add more
  }
  render() {
    const el = super.render();

    el.setAttributeNS(null, "x", this.x.value);
    el.setAttributeNS(null, "y", this.y.value);
    el.setAttributeNS(null, "width", this.width.value);
    el.setAttributeNS(null, "height", this.height.value);

    return el;
  }
}
