let width, height
const margin = 10

export default class App {
  constructor () {
    this.color = '#111'
    this.curve = 'A'
    // Source:
    // https://en.wikipedia.org/wiki/Hilbert_curve#Representation_as_Lindenmayer_system
    this.rules = {
      'A': '-BF+AFA+FB-',
      'B': '+AF-BFB-FA+'
    }

    this.current = 0

    this.iterations = 7
    this.vertexes = []
    this.drawRate = 10
  }

  getUnit (iterations, maxD) {
    return maxD / Math.floor(Math.pow(2, iterations))
  }

  getCurve (start, rules, it) {
    let curve = start
    for (let i = 0; i < it; i++) {
      curve = this.generation(curve, rules)
    }
    return curve
  }

  generation (prev, rules) {
    let next = ''
    for (let letter of prev) {
      if (rules[letter]) {
        next += rules[letter]
      } else {
        next += letter
      }
    }
    return next
  }

  resize (w, h) {
    width = w
    height = h

    let unit = this.getUnit(this.iterations, Math.min(width, height) - 2 * margin)
    // unit = Math.max(unit, 3)
    this.curve = this.getCurve('A', this.rules, this.iterations)
    this.vertexes = this.points(this.curve, unit)
  }

  update (dt) {
    // Current point to draw
    let vertLength = this.vertexes.length

    this.current += this.drawRate
    this.current = Math.min(this.current, vertLength)
  }

  drawCalls (ctx, curve, unit) {
    for (let step of curve) {
      switch (step) {
        case 'F':
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(unit, 0)
          ctx.stroke()
          ctx.closePath()
          ctx.translate(unit, 0)
          break
        case '-':
          ctx.rotate(-Math.PI / 2)
          break
        case '+':
          ctx.rotate(Math.PI / 2)
          break
      }
    }
  }

  points (curve, unit) {
    let vertexes = []

    let rotation = 0
    let lastPos = { x: 0, y: 0 }

    for (let step of curve) {
      switch (step) {
        case 'F':
          let pos = { x: lastPos.x, y: lastPos.y }
          pos.x += unit * Math.cos(rotation)
          pos.y += unit * Math.sin(rotation)

          vertexes.push(pos)
          lastPos = pos

          break
        case '-':
          rotation += -Math.PI / 2
          break
        case '+':
          rotation += Math.PI / 2
          break
      }
    }

    return vertexes
  }

  render (ctx) {
    ctx.save()

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#000'
    ctx.translate(0, height)

    if (width > height) {
      ctx.translate((width - height) / 2, 0)
    } else {
      ctx.translate(0, -(height - width) / 2)
    }
    ctx.translate(margin, -margin)

    // L to draw calls
    // this.drawCalls(ctx, curve, unit)

    // Points to draw calls
    ctx.beginPath()
    ctx.moveTo(0, 0)
    let p
    for (let i = 0; i < this.current; i++) {
      p = this.vertexes[i]
      ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()

    ctx.restore()
  }
}
