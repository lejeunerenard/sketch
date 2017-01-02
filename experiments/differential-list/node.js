import assign from 'object-assign'
import { vec2 } from 'gl-matrix'

let force = vec2.create()
let scrap = vec2.create()
let count = 0

export default class Node {
  constructor (position) {
    let nodes = []
    let mass = 1000
    let velocity = vec2.create()
    let radius = 2

    let spawnRate = 0.5 * (Math.random() * 2 * 1000 + 1000)
    let food = 0
    let id = count
    count++

    assign(this, {
      id,
      nodes,
      food,
      spawnRate,
      mass,
      velocity,
      position,
      radius
    })
  }

  get x () {
    return this.position[0]
  }

  get y () {
    return this.position[1]
  }

  connect (other) {
    if (!(other instanceof Node)) {
      throw new Error('You must connect to a Node')
    }

    if (this.nodes.indexOf(other) !== -1) {
      return
    }

    this.nodes.push(other)
    other.connect(this)
  }

  disconnect (other) {
    let index = this.nodes.indexOf(other)
    if (index === -1) {
      throw new Error('Attempted to disconnect non-connected Node')
    }

    this.nodes.splice(index, 1)
  }

  spawn (app) {
    let { position } = this

    this.food = 0

    let otherIndex = Math.floor(Math.random() * this.nodes.length)
    let other = this.nodes[otherIndex]

    this.disconnect(other)
    other.disconnect(this)

    // TODO refactor out componentwise
    let displacement = vec2.subtract(scrap, other.position, position)

    let halfway = vec2.scaleAndAdd(scrap, position, displacement, .5)

    let newBorn = new Node(vec2.clone(halfway))
    newBorn.connect(this)
    newBorn.connect(other)

    app.nodes.push(newBorn)
  }

  update (dt, app) {
    let { position, nodes, radius, velocity, spawnRate } = this
    const dtMS = dt / 1000

    // Food / Spawn
    this.food++
    if (this.food > spawnRate) {
      this.spawn(app)
    }

    // Motion
    vec2.set(force, 0, 0)

    // All others
    let displacement = scrap
    let norm = vec2.create()
    const searchWidth = 25
    const pushK = 90000
    const pullK = 9

    let others = app.searchQt(
      this.x - searchWidth,
      this.y - searchWidth,
      this.x + searchWidth,
      this.y + searchWidth)

    others.filter((other) => other !== this).forEach((subNode) => {
      vec2.subtract(displacement, position, subNode.position)
      vec2.normalize(norm, displacement)

      let mag = pushK * Math.max(radius / vec2.squaredLength(displacement), 0)
      // force += displacement * mag
      vec2.scaleAndAdd(force, force, norm, mag)
    })

    nodes.forEach((node) => {
      vec2.subtract(displacement, position, node.position)
      vec2.normalize(norm, displacement)

      let mag = -pullK * vec2.squaredLength(displacement)
      // force += displacement * mag
      vec2.scaleAndAdd(force, force, norm, mag)
    })

    // Hinge
    let connect1 = vec2.subtract(vec2.create(), this.nodes[0].position, position)
    let connect2 = vec2.subtract(vec2.create(), this.nodes[1].position, position)
    let angle = Math.abs(
      Math.acos(
        vec2.dot(connect1, connect2) /
        (vec2.length(connect1) * vec2.length(connect2))
      ))

    let delta = vec2.scale(scrap,
      vec2.subtract(scrap, this.nodes[1].position, this.nodes[0].position),
      0.5)

    const idealAngle = 3 * Math.PI / 4
    let correctionAmount = 10 * Math.abs(idealAngle - angle) / idealAngle
    vec2.subtract(delta, delta, position)
    let hingeForce = vec2.normalize(delta, delta)

    // force += hingeForce * correctionAmount
    vec2.scaleAndAdd(force, force, hingeForce, correctionAmount)

    // Centering
    vec2.scaleAndAdd(velocity, velocity, position, -0.0001)

    // Acceleration
    vec2.scaleAndAdd(velocity, velocity, force, dtMS / this.mass)

    // Dampinging
    vec2.scale(velocity, velocity, 0.99)

    vec2.scaleAndAdd(position, position, velocity, dtMS)
  }

  render (ctx) {
    let { radius } = this
    ctx.beginPath()
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = '#000'
    ctx.fill()

    // Links
    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i]

      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(node.x, node.y)
      ctx.closePath()
      ctx.stroke()
    }
  }
}
