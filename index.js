const {Equation, Expression, GEQ, Inequality, LEQ, SimplexSolver, StayConstraint, Strength, Variable} = c

const rootEl = document.getElementById('svg')
rootEl.innerHTML = '' // clear the SVG to make hot reload work better

const svg = new Svg(rootEl)

let rect = [
  point(svg.leftEdge, svg.topEdge),
  point(svg.rightEdge, svg.topEdge),
  point(svg.rightEdge, svg.bottomEdge),
  point(svg.leftEdge, svg.bottomEdge)]
const percentage = 0.1

for (let i = 0; i < 40; i++) {
  const path = new SvgPath({stroke: 'rgba(255, 255, 255, 0.16)', fill: 'rgba(0,0,0,0.08)'})
  svg.append(path)

  const newRect = [point(), point(), point(), point()]
  const c0 = between(rect[0], rect[1], percentage)
  const c1 = between(rect[1], rect[2], percentage)
  const c2 = between(rect[2], rect[3], percentage)
  const c3 = between(rect[3], rect[0], percentage)

  path.moveTo(newRect[0]).lineTo(newRect[1]).lineTo(newRect[2]).lineTo(newRect[3]).closePath()

  svg.constrain(
    eq(newRect[0], c0),
    eq(newRect[1], c1),
    eq(newRect[2], c2),
    eq(newRect[3], c3)
  )

  rect = newRect
}

svg.render()
