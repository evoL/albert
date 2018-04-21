(function(exports, {
  AbstractVariable, Equation, Expression, GEQ, Inequality, LEQ, StayConstraint,
  SimplexSolver, Strength, Variable}) {

function castArray (thing) {
  return Array.isArray(thing) ? thing : [thing]
}

function omit (object, keys) {
  const obj = Object.assign({}, object)
  for (const key in keys) {
    delete obj[key]
  }
  return obj
}

let counter = 0
function uniqueId(name = 'lol') {
  return `${name}${counter++}`;
}

function makeVariable (name, value = undefined) {
  return new Variable({name: uniqueId(name), value})
}

function appendTo (destination, source) {
  for (const x of source) {
    destination.push(x)
  }
}

const NAMESPACES = {
  'xlink': 'http://www.w3.org/1999/xlink',
  'xml': 'http://www.w3.org/XML/1998/namespace'
}
function setAttribute (el, name, value) {
  const splitName = name.split(':')
  if (splitName.length > 1) {
    const namespace = NAMESPACES[splitName[0]]
    if (!namespace) {
      throw new Error('No namespace defined for prefix: ' + splitName[0])
    }
    return el.setAttributeNS(namespace, splitName[1], value)
  }

  return el.setAttributeNS(null, name, value)
}

class Svg {
  constructor (element) {
    this.el_ = element
    this.solver_ = new SimplexSolver()
    this.children_ = []

    const viewBox = element.viewBox.baseVal
    this.leftEdge = makeVariable('leftEdge', viewBox.x)
    this.topEdge = makeVariable('topEdge', viewBox.y)
    this.rightEdge = makeVariable('rightEdge', viewBox.x + viewBox.width)
    this.bottomEdge = makeVariable('bottomEdge', viewBox.y + viewBox.height)
    this.centerX = new Expression(-viewBox.width / 2).plus(this.rightEdge)
    this.centerY = new Expression(-viewBox.height / 2).plus(this.bottomEdge)

    this.solver_.addStay(this.leftEdge, Strength.required)
    this.solver_.addStay(this.topEdge, Strength.required)
    this.solver_.addStay(this.rightEdge, Strength.required)
    this.solver_.addStay(this.bottomEdge, Strength.required)
  }
  append (...children) {
    appendTo(this.children_, children)
    return this
  }
  constrain (...constraints) {
    for (const constraint of constraints) {
      castArray(constraint).forEach((c) => this.solver_.addConstraint(c))
    }
    return this
  }
  render () {
    for (const child of this.children_) {
      this.el_.appendChild(child.render())
    }
    return this
  }
}

class SvgElement {
  constructor (tag, attributes = {}) {
    this.tag_ = tag
    this.attributes_ = omit(attributes, ['x', 'y', 'width', 'height'])
    this.children_ = []

    this.x = makeVariable('x', attributes.x)
    this.y = makeVariable('y', attributes.y)
    this.width = makeVariable('width', attributes.width)
    this.height = makeVariable('height', attributes.height)

    this.leftEdge = new Expression(this.x)
    this.topEdge = new Expression(this.y)
    this.rightEdge = this.leftEdge.plus(this.width)
    this.bottomEdge = this.topEdge.plus(this.height)
    this.centerX = this.leftEdge.plus(new Expression(this.width).divide(2))
    this.centerY = this.topEdge.plus(new Expression(this.height).divide(2))

    // TODO: add more
  }
  append (...children) {
    appendTo(this.children_, children)
    return this
  }
  render () {
    const el = document.createElementNS('http://www.w3.org/2000/svg', this.tag_)
    for (const [name, value] of Object.entries(this.attributes_)) {
      setAttribute(el, name, value)
    }
    for (const child of this.children_) {
      el.appendChild(child.render())
    }

    el.setAttributeNS(null, 'x', this.x.value)
    el.setAttributeNS(null, 'y', this.y.value)
    el.setAttributeNS(null, 'width', this.width.value)
    el.setAttributeNS(null, 'height', this.height.value)

    return el
  }
}

class SvgRect extends SvgElement {
  constructor(attributes = {}) {
    super('rect', attributes)
  }
}

class SvgImage extends SvgElement {
  constructor(href, attributes = {}) {
    super('image', Object.assign({'xlink:href': href}, attributes))
  }
}

class SvgText {
  constructor (text, attributes = {}) {
    this.text_ = text
    this.attributes_ = omit(attributes, ['x', 'y', 'fontSize'])

    this.x = makeVariable('x', attributes.x)
    this.y = makeVariable('y', attributes.y)
    this.fontSize = makeVariable('fontSize', attributes['font-size'] || 16)

    this.width = null
    this.height = null
    this.leftEdge = null
    this.topEdge = null
    this.rightEdge = null
    this.bottomEdge = null
    this.centerX = null
    this.centerY = null
    this.baseline = new Expression(this.y)

    this.adjustDimensions_()
  }

  setText (text) {
    this.text_ = text
    this.adjustDimensions_()
  }

  lineHeight (multiplier = 1) {
    return new Expression(this.fontSize).times(multiplier)
  }

  render () {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    for (const [name, value] of Object.entries(this.attributes_)) {
      setAttribute(el, name, value)
    }
    el.appendChild(document.createTextNode(this.text_))

    el.setAttributeNS(null, 'x', this.x.value)
    el.setAttributeNS(null, 'y', this.y.value)
    el.setAttributeNS(null, 'font-size', this.fontSize.value)

    return el
  }

  withTemporarySvg_(callback) {
    let el = this.render()
    const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    tempSvg.appendChild(el)
    document.body.appendChild(tempSvg)

    callback.call(this, el)

    document.body.removeChild(tempSvg)
    tempSvg.removeChild(el)
    el = null
  }

  adjustDimensions_() {
    this.withTemporarySvg_((text) => {
      const bbox = text.getBBox()

      const widthRatio = bbox.width / this.fontSize.value
      const heightRatio = bbox.height / this.fontSize.value
      const leftEdgeRatio = (this.x.value - bbox.x) / this.fontSize.value
      const topEdgeRatio = (this.y.value - bbox.y) / this.fontSize.value

      this.width = new Expression(this.fontSize).times(
          new Expression(widthRatio))
      this.height = new Expression(this.fontSize).times(
          new Expression(heightRatio))
      this.leftEdge = new Expression(this.x).minus(
          new Expression(this.fontSize).times(new Expression(leftEdgeRatio)))
      this.topEdge = new Expression(this.y).minus(
          new Expression(this.fontSize).times(new Expression(topEdgeRatio)))
      this.rightEdge = this.leftEdge.plus(this.width)
      this.bottomEdge = this.topEdge.plus(this.height)
      this.centerX = this.leftEdge.plus(this.width.divide(2))
      this.centerY = this.topEdge.plus(this.height.divide(2))
    })
  }
}

class SvgGroup {
  constructor(children = [], attributes = {}) {
    this.children_ = children
    this.attributes_ = attributes
    this.constraints_ = []

    this.x = makeVariable('x', 0)
    this.y = makeVariable('y', 0)
    this.width = makeVariable('width', 0)
    this.height = makeVariable('height', 0)

    this.leftEdge = new Expression(this.x)
    this.topEdge = new Expression(this.y)
    this.rightEdge = this.leftEdge.plus(this.width)
    this.bottomEdge = this.topEdge.plus(this.height)
    this.centerX = this.leftEdge.plus(new Expression(this.width).divide(2))
    this.centerY = this.topEdge.plus(new Expression(this.height).divide(2))

    this.topMostChild_ = null
    this.bottomMostChild_ = null
    this.leftMostChild_ = null
    this.rightMostChild_ = null
  }

  append (...children) {
    appendTo(this.children_, children)
    return this
  }

  render () {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    for (const [name, value] of Object.entries(this.attributes_)) {
      setAttribute(el, name, value)
    }
    for (const child of this.children_) {
      el.appendChild(child.render())
    }

    return el
  }

  constraints () {
    const result = this.constraints_.slice()

    if (this.topMostChild_) {
      result.push(new Equation(this.topEdge, this.topMostChild_.topEdge, Strength.medium, 1));
    }
    if (this.bottomMostChild_) {
      result.push(new Equation(this.bottomEdge, this.bottomMostChild_.bottomEdge, Strength.medium, 1));
    }
    if (this.leftMostChild_) {
      result.push(new Equation(this.leftEdge, this.leftMostChild_.leftEdge, Strength.medium, 1));
    }
    if (this.rightMostChild_) {
      result.push(new Equation(this.rightEdge, this.rightMostChild_.rightEdge, Strength.medium, 1));
    }

    for (const child of this.children_) {
      if (child !== this.topMostChild_) {
        result.push(new Inequality(this.topEdge, LEQ, child.topEdge, Strength.weak, 1));
      }
      if (child !== this.bottomMostChild_) {
        result.push(new Inequality(this.bottomEdge, GEQ, child.bottomEdge, Strength.weak, 1));
      }
      if (child !== this.leftMostChild_) {
        result.push(new Inequality(this.leftEdge, LEQ, child.leftEdge, Strength.weak, 1));
      }
      if (child !== this.rightMostChild_) {
        result.push(new Inequality(this.rightEdge, GEQ, child.rightEdge, Strength.weak, 1));
      }
    }
    return result
  }

  fixAll (getter) {
    appendTo(this.constraints_, fixAll(this.children_, getter))
    return this
  }

  alignAll (getter) {
    appendTo(this.constraints_, alignAll(this.children_, getter))
    return this
  }

  eqAll (getter) {
    appendTo(this.constraints_, eqAll(this.children_, getter))
    return this
  }

  geqAll (getter) {
    appendTo(this.constraints_, geqAll(this.children_, getter))
    return this
  }

  leqAll (getter) {
    appendTo(this.constraints_, leqAll(this.children_, getter))
    return this
  }

  distribute (getter) {
    appendTo(this.constraints_, distribute(this.children_, getter))
    return this
  }

  spaceHorizontally (distance = 0) {
    this.leftMostChild_ = this.children_[0]
    this.rightMostChild_ = this.children_[this.children_.length-1]

    appendTo(this.constraints_, spaceHorizontally(this.children_, distance))
    return this
  }

  spaceVertically (distance = 0) {
    this.topMostChild_ = this.children_[0]
    this.bottomMostChild_ = this.children_[this.children_.length-1]

    appendTo(this.constraints_, spaceVertically(this.children_, distance))
    return this
  }
}

class SvgLine {
  constructor (attributes = {}) {
    this.attributes_ = omit(attributes, ['x1', 'y1', 'x2', 'y2'])

    this.x1 = makeVariable('x1', attributes.x1)
    this.y1 = makeVariable('y1', attributes.y1)
    this.x2 = makeVariable('x2', attributes.x2)
    this.y2 = makeVariable('y2', attributes.y2)

    this.centerX = new Expression(this.x1).plus(this.x2).divide(2)
    this.centerY = new Expression(this.y1).plus(this.y2).divide(2)
  }

  render () {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    for (const [name, value] of Object.entries(this.attributes_)) {
      setAttribute(el, name, value)
    }

    el.setAttributeNS(null, 'x1', this.x1.value)
    el.setAttributeNS(null, 'y1', this.y1.value)
    el.setAttributeNS(null, 'x2', this.x2.value)
    el.setAttributeNS(null, 'y2', this.y2.value)

    return el
  }
}

function makeDistanceGetter (distance, method = '') {
  if (typeof distance === 'number'
      || distance instanceof AbstractVariable || distance instanceof Expression) {
    return () => distance
  } else if (typeof distance === 'function') {
    return distance
  } else {
    const prefix = method.length ? `${method}: ` : ''
    throw new Error(
        prefix + 'distance must be a number, function, variable or expression')
  }
}

function negative (something) {
  if (typeof something === 'number') {
    return -something
  } else if (something instanceof AbstractVariable) {
    return new Expression(something).times(-1)
  } else if (something instanceof Expression) {
    return something.times(-1)
  } else {
    throw new Error('Cannot take negative value of ' + something)
  }
}

function eq (a, b) {
  return new Equation(a, b, Strength.weak, 1)
}

function eqAll (array, getter) {
  const constraints = []
  for (let i = 1; i < array.length; i++) {
    constraints.push(eq(getter(array[i-1]), getter(array[i])))
  }
  return constraints
}

function leq (a, b) {
  return new Inequality(a, LEQ, b, Strength.weak, 1)
}

function leqAll (array, getter) {
  const constraints = []
  for (let i = 1; i < array.length; i++) {
    constraints.push(leq(getter(array[i-1]), getter(array[i])))
  }
  return constraints
}

function geq (a, b) {
  return new Inequality(a, GEQ, b, Strength.weak, 1)
}

function geqAll (array, getter) {
  const constraints = []
  for (let i = 1; i < array.length; i++) {
    constraints.push(geq(getter(array[i-1]), getter(array[i])))
  }
  return constraints
}

function fix (...vars) {
  return vars.map((v) => new StayConstraint(v, Strength.weak, 1))
}

function fixAll(array, getter) {
  return fix(...array.map(getter))
}

function align (a, b, distance = 0, strength = Strength.weak) {
  const aExpression = (a instanceof Expression) ? a : new Expression(a)

  // a - distance = b => a - b = distance
  const leftSide = aExpression.minus(b)
  return new Equation(leftSide, distance, strength)
}

function fill (a, b, offsetXOrBoth = 0, offsetY = undefined, strength = Strength.weak) {
  if (offsetY === undefined) {
    offsetY = offsetXOrBoth
  }

  return [
    align(a.topEdge, b.topEdge, -offsetY, strength),
    align(a.rightEdge, b.rightEdge, offsetXOrBoth, strength),
    align(a.bottomEdge, b.bottomEdge, offsetY, strength),
    align(a.leftEdge, b.leftEdge, -offsetXOrBoth, strength),
  ]
}

function alignAll(array, getter, distance = 0) {
  const constraints = []
  const distanceGetter = makeDistanceGetter(distance, 'alignAll')

  for (let i = 1; i < array.length; i++) {
    constraints.push(align(getter(array[i-1]), getter(array[i]), distanceGetter(array[i-1])))
  }
  return constraints
}

function distribute(array, getter) {
  const constraints = []
  const attributes = array.map(getter)

  for (let i = 2; i < attributes.length; i++) {
    const a = attributes[i-2]
    const b = attributes[i-1]
    const c = attributes[i]

    const bExpression = (b instanceof Expression) ? b : new Expression(b)
    const cExpression = (c instanceof Expression) ? c : new Expression(c)

    const leftSide = bExpression.minus(a)
    const rightSide = cExpression.minus(b)

    constraints.push(new Equation(leftSide, rightSide))
  }
  return constraints
}

function spaceHorizontally(array, distance = 0) {
  const constraints = []
  const distanceGetter = makeDistanceGetter(distance)
  for (let i = 1; i < array.length; i++) {
    constraints.push(
      align(
        array[i-1].rightEdge,
        array[i].leftEdge,
        negative(distanceGetter(array[i-1]))))
  }
  return constraints
}

function spaceVertically(array, distance = 0) {
  const constraints = []
  const distanceGetter = makeDistanceGetter(distance)
  for (let i = 1; i < array.length; i++) {
    constraints.push(
      align(
        array[i-1].bottomEdge,
        array[i].topEdge,
        negative(distanceGetter(array[i-1]))))
  }
  return constraints
}

exports.Svg = Svg
exports.SvgElement = SvgElement
exports.SvgText = SvgText
exports.SvgGroup = SvgGroup
exports.SvgRect = SvgRect
exports.SvgImage = SvgImage
exports.SvgLine = SvgLine
exports.align = align
exports.alignAll = alignAll
exports.distribute = distribute
exports.eq = eq
exports.eqAll = eqAll
exports.fill = fill
exports.fix = fix
exports.fixAll = fixAll
exports.geq = geq
exports.geqAll = geqAll
exports.leq = leq
exports.leqAll = leqAll
exports.negative = negative
exports.spaceHorizontally = spaceHorizontally
exports.spaceVertically = spaceVertically

})(window, c)
