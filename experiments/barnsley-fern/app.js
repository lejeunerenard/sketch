const dpr = window.devicePixelRatio

const pW = 0.5
const scale = 1 / 12

export default class App {
  constructor (rules) {
    this.point = {
      x: 0,
      y: 0
    }
    this.rules = rules
  }

  resize (shape) {
    [this.width, this.height] = shape
  }

  getRule () {
    let rand = Math.random()
    for (let rule of this.rules) {
      if (rand < rule.weight) {
        return rule
      }
      rand -= rule.weight
    }
  }

  tick () {
    let { point } = this
    let rule = this.getRule()

    let x = point.x * rule.a + point.y * rule.b + rule.tx
    let y = point.x * rule.c + point.y * rule.d + rule.ty

    this.point = { x, y }
  }

  render (dt, ctx) {
    let { point, width, height } = this

    ctx.save()

    ctx.scale(dpr, dpr)
    ctx.translate(width / 2, height)

    ctx.fillRect(point.x * width * scale, -point.y * height * scale, pW, pW)

    ctx.restore()
  }

}
