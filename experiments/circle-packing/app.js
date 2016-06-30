import Quad from 'simple-quadtree'
import makeCtx from '2d-context'
import makeLoop from 'canvas-loop'
import assign from 'object-assign'
import defined from 'defined'

import Circle from './circle'

export default class App {
  constructor (opt = {}) {
    const ctx = makeCtx()
    const canvas = ctx.canvas

    const loop = makeLoop(canvas, {
      scale: window.devicePixelRatio
    })
    let [width, height] = loop.shape

    const quad = new Quad(0, 0, width, height)

    // Populate
    let total = 7
    let maxGen = defined(opt.nGen, 45)
    let startR = 20

    loop.on('resize', this.resize.bind(this))
    loop.on('tick', (dt) => {
      this.update(dt)
      this.render(dt)
    })

    assign(this, {
      ctx,
      canvas,
      loop,
      quad,
      maxGen,
      startR,
      total
    })

    this.loop.emit('resize')
    this.setup()
  }

  resize () {
    [this.width, this.height] = this.loop.shape
  }

  addObj (obj) {
    this.objs[obj.id] = obj
    this.quad.put(obj)
  }

  circlePairs (total, color) {
    let { width, height } = this

    // Gen pairs
    var angle = 2 * Math.PI / this.total
    let pairsRadius = width / 10

    for (let i = 0; i < this.total; i++) {
      let pairAngle = angle * i

      let r = this.startR
      let x = width / 2 + Math.cos(pairAngle) * pairsRadius
      let y = height / 2 + Math.sin(pairAngle) * pairsRadius

      let obj = new Circle(x, y, r, color)
      this.addObj(obj)

      let otherAngle = Math.random() * 2 * Math.PI

      let r2 = r * 0.7
      let x2 = x + Math.cos(otherAngle) * (r + r2)
      let y2 = y + Math.sin(otherAngle) * (r + r2)

      let obj2 = new Circle(x2, y2, r2, color)
      obj2.others = [obj]
      this.addObj(obj2)
    }
  }

  setup () {
    let { width, height } = this

    this.objs = {}
    this.quad.clear()
    this.gen = 1

    console.log('gen', this.gen)
    this.circlePairs(this.total, '#000')
  }

  nextGen () {
    let values = Object.keys(this.objs).map((key) => this.objs[key])

    values.forEach((obj, i) => {
      let others = obj.others

      if (!others) {
        return
      }

      for (let i = 0; i < others.length; i++) {
        let other = others[i]

        let left = obj.spawn(other, this.quad, this.gen, false)
        if (left) {
          this.addObj(left)
        }

        let right = obj.spawn(other, this.quad, this.gen, true)
        if (right) {
          this.addObj(right)
        }
      }
    })

    this.gen++
    console.log('gen', this.gen)
  }

  start () {
    this.loop.start()
  }

  update () {
    if (this.gen < this.maxGen) {
      this.nextGen()
    } else {
      if (!this.done) {
        console.log('done')
        this.done = true
      }
    }
  }

  render () {
    let { ctx, width, height, objs } = this

    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, width, height)

    Object.keys(objs).map((key) => objs[key]).forEach((obj) => {
      obj.render(ctx)
    })
  }
}
