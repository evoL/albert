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
import Renderable from "./Renderable";
import {
  appendTo,
  insertAfter,
  insertAt,
  insertBefore,
  prependTo
} from "./utils";

export default class Nestable {
  protected children_: Array<Renderable>;

  constructor() {
    this.children_ = [];
  }

  /** Appends Albert renderables. */
  append(...children: Array<Renderable>): this {
    appendTo(this.children_, children);
    return this;
  }

  /** Prepends Albert renderables. */
  prepend(...children: Array<Renderable>): this {
    prependTo(this.children_, children);
    return this;
  }

  /** Inserts Albert renderables at a specific index. */
  insertAt(index: number, ...children: Array<Renderable>): this {
    insertAt(this.children_, index, children);
    return this;
  }

  /** Inserts Albert renderables before the passed in child. */
  insertBefore(child: Renderable, ...children: Array<Renderable>): this {
    insertBefore(this.children_, child, children);
    return this;
  }

  /** Inserts Albert renderables after the passed in child. */
  insertAfter(child: Renderable, ...children: Array<Renderable>): this {
    insertAfter(this.children_, child, children);
    return this;
  }
}
