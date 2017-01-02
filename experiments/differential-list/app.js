import createContex from '2d-context'
import createLoop from 'canvas-loop'
import assign from 'object-assign'
import Vec2 from 'vec2'
import * as d3 from 'd3-quadtree'

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

    this.createQt()

    loop.on('tick', (dt) => this.tick(dt))
    loop.on('resize', () => this.resize())
    this.resize()
  }

  createQt () {
    this.qt = d3.quadtree()
      .x((d) => d.position.x)
      .y((d) => d.position.y)
      .addAll(this.nodes)
  }

  // Source: http://bl.ocks.org/mbostock/4343214
  searchQt(x0, y0, x3, y3) {
    let nodes = []
    this.qt.visit((node, x1, y1, x2, y2) => {
      if (!node.length) {
        do {
          var d = node.data
          if ((d.x >= x0) && (d.x < x3) && (d.y >= y0) && (d.y < y3)) {
            nodes.push(d)
          }
        } while (node = node.next)
      }
      return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
    })
    return nodes
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
    this.createQt()
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


    ctx.beginPath()
    let firstNode = this.nodes[0] 
    ctx.moveTo(firstNode.position.x, firstNode.position.y)
    let currentNode = this.nextNode(firstNode, firstNode)
    let prevNode = firstNode
    while (currentNode !== firstNode) {
      let next = this.nextNode(prevNode, currentNode)

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

    ctx.restore()
  }

  nextNode (prev, node) {
    for (let i = 0; i < node.nodes.length; i++) {
      let other = node.nodes[i]
      if (other !== prev) {
        return other
      }
    }
  }

  start () {
    this.loop.start()
  }
}
