const rootEl = document.getElementById("svg");
rootEl.innerHTML = ""; // clear the SVG to make hot reload work better

const svg = new Svg(rootEl);
const fontFamily = 'monospace';

const simpleText = new SvgText("Red Green Blue", { "font-family": fontFamily });
svg.append(simpleText);

svg.constrain(
  align(simpleText.leftEdge, svg.leftEdge, 20),
  align(simpleText.bottomEdge, svg.centerY, -10),
  align(simpleText.rightEdge, svg.rightEdge, -20)
);

const formattedText = new SvgFormattedText({
  "font-family": fontFamily
});
svg.append(formattedText);

formattedText
  .add("Red ", { fill: "red" })
  .add("Green ", { fill: "green" })
  .add("Blue", { fill: "blue" });

svg.constrain(
  align(formattedText.leftEdge, svg.leftEdge, 20),
  align(formattedText.topEdge, svg.centerY, -10),
  align(formattedText.rightEdge, svg.rightEdge, -20),

  formattedText.eqAll(x => x.fontSize).constraints()
);

svg.render();
