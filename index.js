const {Equation, Expression, GEQ, Inequality, LEQ, SimplexSolver, StayConstraint, Strength, Variable} = c

const rootEl = document.getElementById('svg')
rootEl.innerHTML = '' // clear the SVG to make hot reload work better

const svg = new Svg(rootEl)

const rect = new SvgElement('rect', {height: 5, fill: 'blue'})
svg.append(rect)

const column = new SvgElement('rect', {stroke: '#ccc', fill: 'none'})
svg.append(column)

const text = new SvgText('Welcome', {
  'font-size': 40, 'font-family': 'Roboto Mono', 'font-weight': 'bold'})
svg.append(text)

function makeCell(text) {
  return new SvgText(text, {'font-family': 'fantasy', 'font-size': 14})
}

const c1 = new SvgGroup(['one long long', 'two long', 'three'].map(makeCell))
const c2 = new SvgGroup(['longcat is long', 'five', 'six'].map(makeCell))
const c3 = new SvgGroup(['seven', 'eight more', 'over nine thousand'].map(makeCell))
const group = new SvgGroup([c1, c2, c3])
svg.append(group)

const r1 = new SvgElement('rect', {width: 200, height: 30, fill: 'red'})
const r2 = new SvgElement('rect', {width: 300, height: 30, fill: 'lime'})
const r3 = new SvgElement('rect', {width: 200, height: 30, fill: 'blue'})
const rectGroup = new SvgGroup([r1, r2, r3])
svg.append(rectGroup)

svg.constrain(
  fix(text.fontSize, rect.height),

  align(text.topEdge, svg.topEdge, 20),
  align(text.leftEdge, svg.leftEdge, 20),

  align(rect.topEdge, text.baseline, 5),
  align(rect.leftEdge, text.leftEdge),
  align(rect.rightEdge, text.rightEdge),

  align(group.topEdge, rect.bottomEdge, 30),
  align(group.leftEdge, text.leftEdge, 10),
  fill(column, group, 10),
  c1.fixAll((t) => t.fontSize)
    .alignAll((t) => t.leftEdge)
    .spaceVertically(10)
    .constraints(),
  c2.fixAll((t) => t.fontSize)
    .alignAll((t) => t.centerX)
    .spaceVertically(10)
    .constraints(),
  c3.fixAll((t) => t.fontSize)
    .alignAll((t) => t.rightEdge)
    .spaceVertically(10)
    .constraints(),
  group.alignAll((g) => g.topEdge)
    .spaceHorizontally(20)
    .constraints(),

  // TODO: make this automatic for tables
  align(group.topEdge, c1.topEdge),
  align(group.bottomEdge, c1.bottomEdge),

  align(r1.topEdge, column.bottomEdge, 20),
  align(r1.leftEdge, column.leftEdge),
  align(r3.bottomEdge, svg.bottomEdge, -20),
  align(r3.rightEdge, column.rightEdge),

  rectGroup
    .fixAll((r) => r.width)
    .fixAll((r) => r.height)
    .distribute((r) => r.centerX)
    .distribute((r) => r.centerY)
    .constraints(),
)

svg.render()
