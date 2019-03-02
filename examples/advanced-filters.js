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
const rootEl = document.getElementById("svg");

const svg = new albert.Svg(rootEl);
const fontFamily = "monospace";

const dropShadow = new albert.Filter({ id: "dropshadow", height: "150%" });
dropShadow
  .addGaussianBlur(2, { in: "SourceAlpha", result: "BLUR" })
  .addColorMatrix(
    "matrix",
    `1 0 0 0 0
     0 1 0 0 0
     0 0 1 0 0
     0 0 0 0.3 0`,
    {
      in: "BLUR",
      result: "SHADOW"
    }
  )
  .addOffset(0, 2, { in: "SHADOW", result: "DROPSHADOW" })
  .addMergeNode({ in: "DROPSHADOW" })
  .addMergeNode({ in: "SourceGraphic" });
svg.addDefs(dropShadow);

const simpleText = new albert.Text(
  "The quick brown fox jumps over the lazy dog",
  {
    "font-family": fontFamily,
    "font-weight": "bold",
    fill: "yellow",
    stroke: "black",
    "stroke-width": 5,
    "stroke-linejoin": "round",
    "paint-order": "stroke",
    filter: "url(#dropshadow)"
  }
);
svg.append(simpleText);

// Import helpers to the local scope for less typing
const { align } = albert;

svg.constrain(
  align(simpleText.leftEdge, svg.leftEdge, 20),
  align(simpleText.centerY, svg.centerY),
  align(simpleText.rightEdge, svg.rightEdge, -20)
);

svg.render();
