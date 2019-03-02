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

  // Create some text
  const textAttributes = { "font-size": 16 };
  const text1 = new albert.Text("hello", textAttributes);
  const text2 = new albert.Text("lol", textAttributes);
  const text3 = new albert.Text("long text is long", textAttributes);

  const group = new albert.Group([text1, text2, text3]);
  svg.append(group);

  const { align, point } = albert;

  // Make a simple right-aligned layout for the texts
  svg.constrain(
    group
      .fixAll(text => text.fontSize) // Keep font size fixed
      .eqAll(text => text.rightEdge) // Align right edges
      .spaceVertically(10) // Put one line after another with 10px distance
      .constraints(),
    // Place the group's top left corner at (20,20)
    align(group.topEdge, svg.topEdge, 20),
    align(group.leftEdge, svg.leftEdge, 20)
  );

  // Create a frame for the texts
  const frame = new albert.Path({
    "stroke-width": 3,
    fill: "none",
    stroke: "#000"
  });
  svg.insertBefore(group, frame);

  // We're going to need 8 points for our frame: 2 for each text line
  // + 2 for enclosure.
  function createPointArray(count) {
    const array = [];
    for (let i = 0; i < count; i++) {
      array.push(point());
    }
    return array;
  }
  const POINT_COUNT = 8;
  const PADDING = 5;
  const framePoints = createPointArray(POINT_COUNT);

  // Let's position the points:
  svg.constrain(
    // First line
    align(
      framePoints[0],
      { x: text1.leftEdge, y: text1.topEdge },
      { x: -PADDING, y: -PADDING }
    ),
    align(
      framePoints[1],
      { x: text1.leftEdge, y: text1.bottomEdge },
      { x: -PADDING, y: PADDING }
    ),
    // Second line
    align(
      framePoints[2],
      { x: text2.leftEdge, y: text2.topEdge },
      { x: -PADDING, y: -PADDING }
    ),
    align(
      framePoints[3],
      { x: text2.leftEdge, y: text2.bottomEdge },
      { x: -PADDING, y: PADDING }
    ),
    // Third line
    align(
      framePoints[4],
      { x: text3.leftEdge, y: text3.topEdge },
      { x: -PADDING, y: -PADDING }
    ),
    align(
      framePoints[5],
      { x: text3.leftEdge, y: text3.bottomEdge },
      { x: -PADDING, y: PADDING }
    ),
    // Enclosure
    align(
      framePoints[6],
      { x: text3.rightEdge, y: text3.bottomEdge },
      { x: PADDING, y: PADDING }
    ),
    align(
      framePoints[7],
      { x: text1.rightEdge, y: text1.topEdge },
      { x: PADDING, y: -PADDING }
    )
  );

  // …and draw the path:
  frame.moveTo(framePoints[0]);
  for (let i = 1; i < POINT_COUNT; i++) {
    frame.lineTo(framePoints[i]);
  }
  frame.closePath();

  svg.render();
})();
