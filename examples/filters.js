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
(function() {
  const rootEl = document.getElementById("svg");

  const svg = new albert.Svg(rootEl);

  const filter = new albert.Filter({
    id: "dropshadow",
    width: 130,
    height: 130,
    x: -15,
    y: -15
  });
  filter
    .addGaussianBlur(5, { in: "SourceAlpha" })
    .addOffset(2, 2)
    .addMergeNode()
    .addMergeNode({ in: "SourceGraphic" });
  svg.addDefs(filter);

  const rect = new albert.Rect({
    x: 20,
    y: 20,
    width: 100,
    height: 100,
    fill: "#00f",
    filter: "url(#dropshadow)"
  });
  svg.append(rect);

  svg.render();
})();
