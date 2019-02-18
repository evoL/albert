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

import {
  appendTo,
  createElement,
  insertAfter,
  insertAt,
  insertBefore,
  prependTo
} from "./utils";

export default class BasicElement {
  constructor(tag, attributes = {}) {
    this.tag_ = tag;
    this.attributes_ = attributes;
    this.children_ = [];
  }

  append(...children) {
    appendTo(this.children_, children);
    return this;
  }
  prepend(...children) {
    prependTo(this.children_, children);
    return this;
  }
  insertAt(index, ...children) {
    insertAt(this.children_, index, children);
    return this;
  }
  insertBefore(child, ...children) {
    insertBefore(this.children_, child, children);
    return this;
  }
  insertAfter(child, ...children) {
    insertAfter(this.children_, child, children);
    return this;
  }

  render() {
    const el = createElement(this.tag_, this.attributes_);
    for (const child of this.children_) {
      el.appendChild(child.render());
    }
    return el;
  }
}
