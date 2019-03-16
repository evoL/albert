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
  const { between, eq, point } = albert;

  const PERCENTAGE = 0.1;
  const ITERATIONS = 60;
  const PATH_ATTRIBUTES = {
    fill: "#263238",
    "fill-opacity": 0.1,
    stroke: "#fff",
    "stroke-opacity": 0.12
  };

  // Let's define a rectangle from the SVG's dimensions.
  // We're going to update the rectangle every iteration of the loop.
  let currentRect = [
    point(svg.x, svg.y),
    point(svg.width, svg.y),
    point(svg.width, svg.height),
    point(svg.x, svg.height)
  ];

  const group = new albert.Group();
  for (let i = 0; i < ITERATIONS; i++) {
    const path = new albert.Path(PATH_ATTRIBUTES);
    group.append(path);

    // Define a new rectangle by taking the current one and picking points on
    // its edges. The position of those points is determined by PERCENTAGE.
    // E.g. PERCENTAGE = .5 would pick a point in the center of the edge.
    const newRect = [point(), point(), point(), point()];
    const c0 = between(currentRect[0], currentRect[1], PERCENTAGE);
    const c1 = between(currentRect[1], currentRect[2], PERCENTAGE);
    const c2 = between(currentRect[2], currentRect[3], PERCENTAGE);
    const c3 = between(currentRect[3], currentRect[0], PERCENTAGE);

    path
      .moveTo(newRect[0])
      .lineTo(newRect[1])
      .lineTo(newRect[2])
      .lineTo(newRect[3])
      .closePath();

    svg.constrain(
      eq(newRect[0], c0),
      eq(newRect[1], c1),
      eq(newRect[2], c2),
      eq(newRect[3], c3)
    );

    currentRect = newRect;
  }
  svg.append(group);

  svg.render();
})();
