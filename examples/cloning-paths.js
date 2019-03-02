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
  const { align, fixAll, forEach, point } = albert;

  // Let's make a star!
  const star = new albert.Path({
    stroke: "#00f",
    "stroke-width": 5,
    fill: "none"
  });

  const points = [];
  const NUM_POINTS = 5;
  for (let i = 0; i < NUM_POINTS; i++) {
    const angle = (i * 2 * Math.PI) / NUM_POINTS;
    const x = Math.sin(angle);
    const y = -Math.cos(angle);
    points[i] = point(x * 100 + 120, y * 100 + 120);
  }

  star.moveTo(points[0]);
  for (let i = 0; i < NUM_POINTS; i++) {
    star.lineTo(points[((i + 1) * 2) % NUM_POINTS]);
  }
  star.closePath();

  svg.append(star);

  // Let's make the points of the star static.
  svg.constrain(fixAll(points));

  // Time to add a shadow!
  const shadow = star.clone().setAttributes({ stroke: "rgba(0,0,0,0.3)" });
  svg.insertBefore(star, shadow);

  // Because the star is fixed, we can just offset the shadow using align().
  svg.constrain(
    forEach(shadow.points(), (p, i) =>
      align(p, points[(i * 2) % NUM_POINTS], { x: 5, y: 5 })
    )
  );

  svg.render();
})();
