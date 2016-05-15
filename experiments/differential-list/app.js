import createContex from '2d-context'
import createLoop from 'canvas-loop'
import assign from 'object-assign'
import Vec2 from 'vec2'

import Node from './node'

export default class App {
  constructor () {
    const ctx = createContex()
    const canvas = ctx.canvas
    document.body.appendChild(canvas)

    let loop = createLoop(canvas, { scale: window.devicePixelRatio })

    // Create nodes
    let nodes = []
    let numNodes = 50
    let radius = 125
    for (let i = 0; i < numNodes; i++) {
      let angle = i * 2 * Math.PI / numNodes
      nodes.push(new Node(
        new Vec2(
          radius * Math.cos(angle),
          radius * Math.sin(angle))))
    }

    // Connect them
    for (let i = 0; i < numNodes; i++) {
      let next = (i === numNodes - 1) ? 0 : i + 1

      nodes[i].connect(nodes[next])
    }

    assign(this, {
      loop,
      ctx,
      canvas,
      nodes
    })

    loop.on('tick', (dt) => this.tick(dt))
    loop.on('resize', () => this.resize())
    this.resize()
  }

  resize () {
    let [width, height] = this.loop.shape
    assign(this, {
      width,
      height
    })
  }

  tick (dt) {
    this.update(dt)
    this.render()
  }

  update (dt) {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].update(dt, this)
    }
  }

  render () {
    let { ctx, width, height } = this
    ctx.save()

    const dpr = window.devicePixelRatio
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)
    // ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    // ctx.fillRect(0, 0, width, height)

    ctx.translate(width / 2, height / 2)

    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].render(ctx)
    }

    ctx.restore()
  }

  start () {
    this.loop.start()
  }
}
