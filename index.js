const rootEl = document.getElementById("svg");
rootEl.innerHTML = ""; // clear the SVG to make hot reload work better

const svg = new Svg(rootEl);
const fontFamily = "monospace";

const simpleText = new SvgText("The quick brown fox jumps over the lazy dog", {
  "font-family": fontFamily
});
svg.append(simpleText);

svg.constrain(
  align(simpleText.leftEdge, svg.leftEdge, 20),
  align(simpleText.bottomEdge, svg.centerY, -10),
  align(simpleText.rightEdge, svg.rightEdge, -20)
);

const formattedText = new SvgFormattedText(
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
