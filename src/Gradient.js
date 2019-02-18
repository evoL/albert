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

import { createElement } from "./utils";

function createStop(offset, color, opacity = undefined) {
  return { offset, color, opacity };
}

export default class Gradient {
  constructor(tag, attributes = {}) {
    this.tag_ = tag;
    this.attributes_ = attributes;
    this.stops_ = [];
  }

  addStop(offset, color, opacity = undefined) {
    this.stops_.push(createStop(offset, color, opacity));
    return this;
  }

  render() {
    const gradient = createElement(this.tag_, this.attributes_);
    for (const { offset, color, opacity } of this.stops_) {
      const attributes = Object.assign(
        { offset, "stop-color": color },
        opacity && { "stop-opacity": opacity }
      );
      gradient.appendChild(createElement("stop", attributes));
    }
    return gradient;
  }
}
