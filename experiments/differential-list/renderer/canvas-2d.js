import Renderer from './renderer'
import createContex from '2d-context'

const dpr = window.devicePixelRatio

export default class Canvas2DRenderer extends Renderer {
  constructor (canvas) {
    super(canvas)

    this.debug = false

    this.ctx = createContex({ canvas })
    this.canvas = canvas

    this.resize()
  }

  resize () {
    this.width = this.canvas.width
    this.height = this.canvas.height
  }

  render (app) {
    let { ctx, width, height } = this
    ctx.save()

    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)

    ctx.translate(width / 2, height / 2)

    if (this.debug) {
      for (let node of app.nodes) {
        node.render(ctx)
      }
    } else {
      for (let firstNode of app.startNodes) {
        ctx.beginPath()
        ctx.moveTo(firstNode.position.x, firstNode.position.y)
        let currentNode = app.nextNode(firstNode, firstNode)
        let prevNode = firstNode
        while (currentNode && currentNode !== firstNode) {
          let next = app.nextNode(prevNode, currentNode)

          if (!next) break

          // Curve Render
          // source: http://stackoverflow.com/a/7058606/630490
          let xc = (currentNode.x + next.x) / 2
          let yc = (currentNode.y + next.y) / 2

          ctx.quadraticCurveTo(currentNode.x, currentNode.y, xc, yc)

          prevNode = currentNode
          currentNode = next
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
    }

    ctx.restore()
  }
}
