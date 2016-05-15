import assign from 'object-assign'
import Vec2 from 'vec2'

export default class Node {
  constructor (position) {
    let nodes = []
    let mass = 1000
    let velocity = new Vec2(0, 0)
    let radius = 20

    assign(this, {
      nodes,
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

  update (dt) {
    let { position, nodes, radius, mass, velocity } = this

    let posVec2 = new Vec2(position.x, position.y)
    let accel = new Vec2(0, 0)

    nodes.forEach((node) => {
      let displacement = posVec2.clone().subtract(node.position.x, node.position.y)
      let dispMagSqr = displacement.lengthSquared()

      // let minDis = 5
      // let pushK = 9
      // let push = displacement.clone()
      //   .normalize()
      //   .multiply(pushK * 1 / Math.max(displacement.length() - minDis, 0.0001))

      // let force = push.clone().divide(mass)
      // accel.add(force)

      // let pushK = 9
      // let push = displacement.clone().multiply(pushK)
      // accel.add(push.clone().divide(mass))

      let pushK = 90
      let push = displacement.clone()
        .normalize()
        .multiply(pushK * Math.max(100 - displacement.length(), 0))
      accel.add(push.clone().divide(mass))

      let pullK = 9
      let pull = displacement.clone()
        .normalize()
        .multiply(-pullK * displacement.length())
      accel.add(pull.clone().divide(mass))

      velocity.add(accel.clone().multiply(dt / 1000))
    })

    // Centering
    // velocity.add(posVec2.clone().multiply(-0.001))

    // Dampinging
    velocity.multiply(0.99)

    posVec2.add(velocity.clone().multiply(dt / 1000))

    this.position = posVec2.toJSON()
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
