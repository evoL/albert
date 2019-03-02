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
  const fontFamily = "monospace";

  const simpleText = new albert.Text(
    "The quick brown fox jumps over the lazy dog",
    {
      "font-family": fontFamily
    }
  );
  svg.append(simpleText);

  // Import helpers to the local scope for less typing
  const { align } = albert;

  svg.constrain(
    align(simpleText.leftEdge, svg.leftEdge, 20),
    align(simpleText.bottomEdge, svg.centerY, -10),
    align(simpleText.rightEdge, svg.rightEdge, -20)
  );

  const formattedText = new albert.FormattedText(
    "The quick brown fox jumps over the lazy dog",
    {
      "font-family": fontFamily,
      fill: "gray"
    }
  );
  svg.append(formattedText);

  formattedText
    .formatRegexp("brown", { fill: "lightbrown" })
    .formatRegexp(/[aeiou]+/g, { fill: "blue" });

  svg.constrain(
    align(formattedText.leftEdge, svg.leftEdge, 20),
    align(formattedText.topEdge, svg.centerY, -10),
    align(formattedText.rightEdge, svg.rightEdge, -20),

    formattedText.constraints()
  );

  svg.render();
})();
