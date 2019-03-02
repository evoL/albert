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

  // Notice the allowResize option.
  const svg = new albert.Svg(rootEl, { allowResize: true });

  // Let's build a tic-tac-toe board using static dimensions because why not.
  const DIVIDER_WIDTH = 2;
  const STROKE_WIDTH = 5;
  const FIGURE_SIZE = 40;
  const BOARD_PADDING = 10;
  const FIELD_PADDING = 10;
  const FIELD_SIZE = FIELD_PADDING * 2 + FIGURE_SIZE;
  const BOARD = (_ => ["X", "X", "X", "O", "O", _, "X", _, "O"])();

  const { align, expression, eq, fix, forEach } = albert;

  // A helper function to generate an X
  function drawX() {
    const lines = [new albert.Line(), new albert.Line()];
    const group = new albert.Group(lines, {
      stroke: "#e53935",
      "stroke-width": STROKE_WIDTH
    });

    svg.constrain(
      // Arrange the points in a cross
      eq(lines[0].x1, lines[1].x1),
      eq(lines[0].x2, lines[1].x2),
      eq(lines[0].y1, lines[1].y2),
      eq(lines[0].y2, lines[1].y1),

      // Define the size
      align(lines[0].x2, lines[0].x1, FIGURE_SIZE),
      align(lines[0].y2, lines[0].y1, FIGURE_SIZE)
    );

    // Return something else than the group, so we can constrain easily
    const leftEdge = expression(lines[0].x1);
    const topEdge = expression(lines[0].y1);
    const rightEdge = expression(lines[0].x2);
    const bottomEdge = expression(lines[0].y2);
    return {
      leftEdge,
      topEdge,
      rightEdge,
      bottomEdge,
      centerX: leftEdge.plus(rightEdge).divide(2),
      centerY: topEdge.plus(bottomEdge).divide(2),

      render() {
        return group.render();
      }
    };
  }

  // A helper function to generate an O
  function drawO() {
    const circle = new albert.Circle({
      stroke: "#ffb300",
      fill: "none",
      "stroke-width": STROKE_WIDTH,
      r: FIGURE_SIZE / 2
    });

    svg.constrain(fix(circle.r));

    return circle;
  }

  // Render the dividers
  const makeDivider = () =>
    new albert.Line({ stroke: "#263238", "stroke-width": DIVIDER_WIDTH });
  const dividerX1 = makeDivider();
  const dividerX2 = makeDivider();
  const dividerY1 = makeDivider();
  const dividerY2 = makeDivider();

  svg.append(dividerX1, dividerX2, dividerY1, dividerY2);

  svg.constrain(
    // Set obvious equalities for the lines so that we can care only about one
    // of the coordinates.
    eq(dividerX1.y1, dividerX1.y2),
    eq(dividerX2.y1, dividerX2.y2),
    eq(dividerY1.x1, dividerY1.x2),
    eq(dividerY2.x1, dividerY2.x2),
    eq(dividerX1.x1, dividerX2.x1),
    eq(dividerX1.x2, dividerX2.x2),
    eq(dividerY1.y1, dividerY2.y1),
    eq(dividerY1.y2, dividerY2.y2),

    // Set the width of horizontal dividers
    align(dividerX1.x1, svg.leftEdge, BOARD_PADDING),
    align(svg.rightEdge, dividerX1.x2, BOARD_PADDING),

    // Set the height of vertical dividers
    align(dividerY1.y1, svg.topEdge, BOARD_PADDING),
    align(svg.bottomEdge, dividerY1.y2, BOARD_PADDING),

    // Align the dividers to edges
    align(dividerX1.y1, svg.topEdge, BOARD_PADDING + FIELD_SIZE),
    align(svg.bottomEdge, dividerX2.y1, BOARD_PADDING + FIELD_SIZE),
    align(dividerY1.x1, svg.leftEdge, BOARD_PADDING + FIELD_SIZE),
    align(svg.rightEdge, dividerY2.x1, BOARD_PADDING + FIELD_SIZE),

    // Align the dividers to each other
    align(dividerX2.y1, dividerX1.y1, FIELD_SIZE),
    align(dividerY2.x1, dividerY1.x1, FIELD_SIZE)
  );

  // Let's render and lay out the board
  const board = BOARD.map(field => {
    switch (field) {
      case "X":
        return drawX();
      case "O":
        return drawO();
      default:
        return undefined;
    }
  });

  function getFieldOffset(index) {
    return BOARD_PADDING + FIELD_SIZE * (index + 0.5);
  }

  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const figure = board[y * 3 + x];
      if (!figure) {
        continue;
      }

      svg.append(figure);
      svg.constrain(
        eq(figure.centerX, getFieldOffset(x)),
        eq(figure.centerY, getFieldOffset(y))
      );
    }
  }

  svg.render();
})();
