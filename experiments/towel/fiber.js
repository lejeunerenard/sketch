export default class Fiber {
  constructor (options) {
    options = options || {}

    this.length = options.length || 1
    this.position = options.position || { x: 0, y: 0 }
    this.rotation = options.rotation || 0

    this.color = options.color || '#000'
  }

  update () {

  }

  draw (ctx) {
    ctx.beginPath()
    ctx.moveTo(this.position.x, this.position.y)
    ctx.lineTo(this.position.x + Math.cos(this.rotation) * this.length, this.position.y + Math.sin(this.rotation) * this.length)

    ctx.strokeStyle = this.color
    ctx.stroke()
  }
}
