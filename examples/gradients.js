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

  const linear = new albert.LinearGradient({ id: "linear" });
  linear.addStop("5%", "green").addStop("95%", "gold");
  svg.addDefs(linear);

  const fire = new albert.RadialGradient({
    id: "fire",
    spreadMethod: "reflect",
    cx: "50%",
    cy: "50%",
    r: "50%",
    fx: "25%",
    fy: "75%",
    fr: "10%"
  });
  fire
    .addStop("0%", "white")
    .addStop("10%", "yellow")
    .addStop("95%", "red");
  svg.addDefs(fire);

  const rect = new albert.Rect({ fill: "url(#linear)" });
  const circle = new albert.Circle({ fill: "url(#fire)" });
  svg.append(rect, circle);

  const { align, eq, geq } = albert;

  svg.constrain(
    align(rect.leftEdge, svg.leftEdge, 20),
    align(rect.topEdge, svg.topEdge, 20),
    align(rect.bottomEdge, svg.bottomEdge, -20),

    align(circle.rightEdge, svg.rightEdge, -20),
    align(circle.topEdge, svg.topEdge, 20),
    align(circle.bottomEdge, svg.bottomEdge, -20),

    eq(rect.width, rect.height),
    geq(circle.leftEdge.minus(rect.rightEdge), 20)
  );

  svg.render();
})();
