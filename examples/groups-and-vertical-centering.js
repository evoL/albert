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

  // Import helpers to the local scope for less typing.
  const { align, eq, geq } = albert;

  // Let's make a title, author and URL.
  const title = new albert.Text("Albert positions SVGs", {
    "font-family": "monospace"
  });
  const author = new albert.Text("Rafał Hirsz", {
    "font-family": "sans-serif",
    "font-weight": "bold"
  });
  const url = new albert.Text("https://hirsz.co", {
    "font-family": "sans-serif",
    fill: "#99c"
  });

  // Let's also put the author and URL into a group to position them together.
  const group = new albert.Group([author, url]);

  svg.append(title, group);

  // OK, let's start laying out things.
  // First, I want that:
  // 1. the URL is below the author
  // 2. the author is the same width as the URL
  // 3. the font sizes of the author and URL are at least 12px
  // 4. the group is positioned 20px from the top right corner
  svg.constrain(
    group
      .spaceVertically() // 1.
      .eqAll(child => child.width) // 2.
      .forEach(child => geq(child.fontSize, 12)) // 3.
      .constraints(),
    align(group.rightEdge, svg.rightEdge, -20), // 4a.
    align(group.topEdge, svg.topEdge, 20) // 4b.
  );

  // Let's take care of the title now.
  // I want that:
  // 1. it's 20px from the top left corner
  // 2. it's 20px from the group
  // 3. it's centered vertically with the group
  svg.constrain(
    align(title.leftEdge, svg.leftEdge, 20), // 1a.
    align(title.topEdge, svg.topEdge, 20), // 1b.
    align(title.rightEdge, group.leftEdge, -20), // 2.
    eq(title.centerY, group.centerY) // 3.
  );

  svg.render();
})();
