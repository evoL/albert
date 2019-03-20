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

import Attributes from "./Attributes";
import Nestable from "./Nestable";
import Renderable from "./Renderable";
import { createElement } from "./utils";

/**
 * Renderable that represents a generic SVG element. Does not include constraint
 * support.
 *
 * Example:
 *
 *   const mask = new BasicElement("mask", { id: "someMask" });
 */
export default class BasicElement extends Nestable implements Renderable {
  private tag_: string;
  private attributes_: Attributes;

  constructor(tag: string, attributes: Attributes = {}) {
    super();
    this.tag_ = tag;
    this.attributes_ = attributes;
  }

  render() {
    const el = createElement(this.tag_, this.attributes_);
    for (const child of this.children_) {
      el.appendChild(child.render());
    }
    return el;
  }
}
