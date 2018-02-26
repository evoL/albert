import {Equation, Expression, SimplexSolver, StayConstraint, Strength, Variable} from 'cassowary'
import {castArray, omit, uniqueId} from 'lodash-es'

function makeVariable (name, value = undefined) {
  return new Variable({name: uniqueId(name), value})
}

class Svg {
  constructor (element) {
    this.el_ = element
    this.solver_ = new SimplexSolver()
    this.children_ = []
  }
  append (...children) {
    for (let child of children) {
      this.children_.push(child)
    }
    return this
  }
  constrain (...constraints) {
    for (let constraint of constraints) {
      castArray(constraint).forEach((c) => this.solver_.addConstraint(c))
    }
    return this
  }
  render () {
    for (let child of this.children_) {
      this.el_.appendChild(child.render())
    }
    return this
  }
}

class SvgElement {
  constructor (tag, attributes = {}) {
    this.tag_ = tag
    this.attributes_ = omit(attributes, ['x', 'y'])
    this.children_ = []

    this.x = makeVariable('x', attributes.x)
    this.y = makeVariable('y', attributes.y)
    // TODO: add more
  }
  append (...children) {
    for (let child of children) {
      this.children_.push(child)
    }
    return this
  }
  setText (text) {
    this.children_ = [document.createTextNode(text)]
    return this
  }
  render () {
    const el = document.createElementNS('http://www.w3.org/2000/svg', this.tag_)
    for (let [name, value] of Object.entries(this.attributes_)) {
      el.setAttributeNS(null, name, value)
    }
    for (let child of this.children_) {
      // this.children_ contains either text nodes or SvgElements
      el.appendChild((child.nodeType === 3) ? child : child.render())
    }

    el.setAttributeNS(null, 'x', this.x.value)
    el.setAttributeNS(null, 'y', this.y.value)

    return el
  }
}

function fix (...vars) {
  return vars.map((v) => new StayConstraint(v, Strength.required, 1))
}

function align (a, b, distance = 0) {
  // a + distance = b => a - b = -distance
  const leftSide = new Expression(a).minus(b)
  return new Equation(leftSide, -distance)
}

const rootEl = document.getElementById('svg')
rootEl.innerHTML = '' // clear the SVG to make hot reload work better

const svg = new Svg(rootEl)

const rect = new SvgElement('rect', {x: 100, y: 100, width: 100, height: 100, fill: 'red'})
svg.append(rect)

const text = new SvgElement('text')
text.setText('text')
svg.append(text)

svg.constrain(
  fix(rect.x, rect.y),
  align(text.x, rect.x),
  align(text.y, rect.y, 10)
)

svg.render()
