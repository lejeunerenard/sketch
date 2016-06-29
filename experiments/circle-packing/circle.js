import assign from 'object-assign'

let colors = [
  '#fff',
  '#c00'
]
let ids = 0
export default class Circle {
  constructor (x, y, r, color = 'white') {
    let pos = { x, y }
    assign(this, {
      pos,
      r,
      color,
      others: [],
      id: ids
    })

    // console.log('id', ids)

    ids++
  }

  get x () {
    return this.pos.x - this.r
  }

  get y () {
    return this.pos.y - this.r
  }

  get w () {
    return this.r * 2
  }

  get h () {
    return this.r * 2
  }

  // Colors
  periodColor (gen) {
    return colors[gen % colors.length]
  }

  differentColor (other) {
    if (this.color === other.color) {
      return colors[1]
    } else {
      return colors[0]
    }
  }

  modHue (gen) {
    return `hsl(${gen % 360}, 100%, 50%)`
  }

  modGrey (gen) {
    return `hsl(0, 0%, ${gen % 100}%)`
  }

  spawn (other, quad, gen, opposite = false) {
    let reduceMin = 0.80
    let reduceMax = 1.11

    let reduceFactor = reduceMin + Math.random() * (reduceMax - reduceMin)

    let childR = this.r * reduceFactor

    // Calc position
    let b = this.r + childR
    let a = other.r + childR
    let magL = this.r + other.r

    let l = {
      x: other.pos.x - this.pos.x,
      y: other.pos.y - this.pos.y
    }

    let theta = Math.atan(l.y / l.x)
    if (l.x < 0) {
      theta += Math.PI
    }
    let phi = Math.acos(
      (b * b + magL * magL - a * a) /
        (2 * magL * b)
    )

    let newAngle
    if (opposite) {
      newAngle = theta + phi
    } else {
      newAngle = theta - phi
    }

    let childX = b * Math.cos(newAngle) + this.pos.x
    let childY = b * Math.sin(newAngle) + this.pos.y

    let color = this.modGrey(gen * 5)

    let child = new Circle(childX, childY, childR, color)

    // Check if child should be made
    let colliders = quad.get(child)
    let collides = false
    for (let i = 0; i < colliders.length; i++) {
      let collider = colliders[i]
      if (child.isColliding(collider)) {
        collides = true
        break
      }
    }

    if (collides) {
      // console.log('collided')
      return
    }

    child.others = [this, other]

    return child
  }

  isColliding (other) {
    return this.dist(this.pos.x - other.pos.x, this.pos.y - other.pos.y) < this.r + other.r - 0.5
  }

  dist (x, y) {
    return Math.sqrt(x * x + y * y)
  }

  render (ctx, debug) {
    let { pos, r, color } = this
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false)

    if (debug) {
      ctx.strokeStyle = color
      ctx.stroke()

      // Debug lines
      this.others.forEach((other) => {
        ctx.beginPath()
        ctx.moveTo(this.pos.x, this.pos.y)
        ctx.lineTo(other.pos.x, other.pos.y)
        ctx.strokeStyle = '#0c0'
        ctx.stroke()
      })

      // Center
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 1, 0, 2 * Math.PI, false)
      ctx.fillStyle = color
      ctx.fill()
    } else {
      ctx.fillStyle = color
      ctx.fill()
    }
  }
}
