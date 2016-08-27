import assign from 'object-assign'

const seventyTwo = 72 * Math.PI / 180
const twoSixteen = 216 * Math.PI / 180

export default class Dart {
  constructor (x = 0, y = 0, rotation = 0, side = 100, color = 'rgba(252,210,113,1)', stroke = '#fff') {
    assign(this, {
      x,
      y,
      color,
      stroke,
      rotation,
      side
    })
  }

  set side (value) {
    let sideA = value
    let sideB = sideA * Math.sin(seventyTwo / 2) / Math.sin(twoSixteen / 2)
    let sideC = Math.sqrt(sideA * sideA + sideB * sideB - 2 * sideA * sideB * Math.cos(seventyTwo / 2))

    assign(this, {
      sideA,
      sideB,
      sideC,
      _side: value
    })
  }

  get side () {
    return this._side
  }

  get vertexA () {
    return {
      x: this.x + this.sideC * Math.cos(this.rotation),
      y: this.y + this.sideC * Math.sin(this.rotation)
    }
  }

  get vertexB () {
    return {
      x: this.x,
      y: this.y
    }
  }

  get vertexC () {
    return {
      x: this.x + this.sideA * Math.cos(seventyTwo / 2 + this.rotation),
      y: this.y + this.sideA * Math.sin(seventyTwo / 2 + this.rotation)
    }
  }

  get vertexD () {
    return {
      x: this.x + this.sideA * Math.cos(-seventyTwo / 2 + this.rotation),
      y: this.y + this.sideA * Math.sin(-seventyTwo / 2 + this.rotation)
    }
  }

  draw (ctx) {
    let { color, stroke } = this

    ctx.save()

    let a = this.vertexA
    let b = this.vertexB
    let c = this.vertexC
    let d = this.vertexD

    ctx.beginPath()
    ctx.moveTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.lineTo(a.x, a.y)
    ctx.lineTo(d.x, d.y)
    ctx.lineTo(b.x, b.y)
    ctx.strokeStyle = stroke
    ctx.stroke()
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()

    ctx.restore()
  }
}
