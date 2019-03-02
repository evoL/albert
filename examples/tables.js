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
const svg = new albert.Svg(document.getElementById("svg"));

const { align, expression, eq, fill, fix } = albert;

// Prepare the data
const data = [
  ["Company", "Contact", "Country"],
  ["Alfreds Futterkiste", "Maria Anders", "Germany"],
  ["Centro comercial Moctezuma", "Francisco Chang", "Mexico"],
  ["Ernst Handel", "Roland Mendel", "Austria"],
  ["Island Trading", "Helen Bennett", "UK"],
  ["Laughing Bacchus Winecellars", "Yoshi Tannamuri", "Canada"]
];

// Let's set horizontal spacing to 10% of the width.
const hSpacing = expression(svg.width).times(0.1);

// Create the table
const table = new albert.TextTable({ "font-family": "sans-serif" });
table.addRows(...data);

// Set the spacing
table.setSpacing({ x: hSpacing, y: 10 });

// Make the first row bold and align the text to center
table
  .getRow(0)
  .setAttributes({ "font-weight": "bold" })
  .alignTo("center", "baseline");

svg.append(table);

// Add table constraints and position the table in the SVG
svg.constrain(
  table.constraints(),
  align(table.leftEdge, svg.leftEdge, hSpacing),
  align(svg.rightEdge, table.rightEdge, hSpacing),
  align(table.centerY, svg.centerY)
);

// Highlight the second column with a yellow rectangle
const rect = new albert.Rect({ fill: "yellow" });
svg.insertBefore(table, rect);
svg.constrain(fill(rect, table.getColumn(1), 10));

svg.render();
