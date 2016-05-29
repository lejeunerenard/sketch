import assign from 'object-assign'
import Vec2 from 'vec2'

export default class Node {
  constructor (position) {
    let nodes = []
    let mass = 1000
    let velocity = new Vec2(0, 0)
    let radius = 2

    let spawnRate = Math.random() * 2 * 1000 + 1000
    let food = 0

    assign(this, {
      nodes,
      food,
      spawnRate,
      mass,
      velocity,
      position,
      radius
    })
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
    let displacement = new Vec2(other.position.x, other.position.y)
      .subtract(position)

    let halfway = displacement.clone().divide(2).add(position)

    let newBorn = new Node(halfway)
    newBorn.connect(this)
    newBorn.connect(other)

    app.nodes.push(newBorn)
  }

  update (dt, app) {
    let { position, nodes, radius, mass, velocity, spawnRate } = this

    // Food / Spawn
    this.food++
    if (this.food > spawnRate) {
      this.spawn(app)
    }

    // Motion
    let force = new Vec2(0, 0)

    nodes.forEach((node) => {
      // TODO refactor out componentwise
      let displacement = position.clone().subtract(node.position.x, node.position.y)

      let pushK = 90
      let push = displacement.clone()
        .normalize()
        .multiply(pushK * Math.max(radius * 10 - displacement.length(), 0))
      force.add(push)

      let pullK = 9
      let pull = displacement.clone()
        .normalize()
        .multiply(-pullK * displacement.length())
      force.add(pull)
    })

    // Hinge
    let connect1 = this.nodes[0].position.clone().subtract(position)
    let connect2 = this.nodes[1].position.clone().subtract(position)
    let angle = Math.abs(connect1.angleTo(connect2))
    let delta = this.nodes[1].position.clone().subtract(this.nodes[0].position).divide(2)
    const idealAngle = 3 * Math.PI / 4
    let correctionAmount = 10 * Math.abs(idealAngle - angle) / idealAngle
    let hingeForce = delta.subtract(position).normalize().multiply(correctionAmount)
    force.add(hingeForce)
    // console.log('angle', angle)

    // Centering
    // velocity.add(position.clone().multiply(-0.001))
    // Acceleration
    velocity.add(force.divide(mass).multiply(dt / 1000))

    // Dampinging
    velocity.multiply(0.99)

    position.add(velocity.clone().multiply(dt / 1000))

    this.position = position
  }

  render (ctx) {
    let { position, radius } = this
    ctx.beginPath()
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = '#000'
    ctx.fill()

    // Links
    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i]

      ctx.beginPath()
      ctx.moveTo(position.x, position.y)
      ctx.lineTo(node.position.x, node.position.y)
      ctx.closePath()
      ctx.stroke()
    }
  }
}
