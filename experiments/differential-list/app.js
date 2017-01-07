import createContex from '2d-context'
import createLoop from 'canvas-loop'
import assign from 'object-assign'
import { vec2 } from 'gl-matrix'
import * as d3 from 'd3-quadtree'

import Node from './node'

export default class App {
  constructor () {
    const ctx = createContex()
    const canvas = ctx.canvas
    document.body.appendChild(canvas)

    let loop = createLoop(canvas, { scale: window.devicePixelRatio })

    this.width = window.innerWidth
    this.height = window.innerHeight

    // Create nodes
    this.nodes = []
    let r = 125
    let startNodes = []
    const numOfBodies = 2
    for (let i = 0; i < numOfBodies; i++) {
      let angle = i * 2 * Math.PI / numOfBodies
      startNodes.push(this.createBlob({
        x: 1.2 * 200 * Math.cos(angle),
        y: 1.2 * 200 * Math.sin(angle)
      }, r))
    }

    let frame = 0

    assign(this, {
      frame,
      loop,
      ctx,
      canvas,
      startNodes
    })

    this.createQt()

    loop.on('tick', (dt) => this.tick(dt))
    loop.on('resize', () => this.resize())
    this.resize()
  }

  createBlob (center, radius = 125) {
    let nodes = []
    let numNodes = 50
    for (let i = 0; i < numNodes; i++) {
      let angle = i * 2 * Math.PI / numNodes
      let vec = vec2.fromValues(
          radius * Math.cos(angle) + center.x,
          radius * Math.sin(angle) + center.y)
      nodes.push(new Node(vec))
    }

    // Connect them
    for (let i = 0; i < numNodes; i++) {
      let next = (i === numNodes - 1) ? 0 : i + 1

      nodes[i].connect(nodes[next])
    }
    this.nodes = this.nodes.concat(nodes)

    let xFill = (center.x / (this.width) + .5) * 255 * 3 / 2
    let yFill = (center.y / (this.height) +.5) * 255 * 3 / 2
    let fill = `rgb(${Math.floor(xFill)}, 0, ${Math.floor(yFill)})`

    return {
      firstNode: nodes[0],
      fill
    }
  }

  createQt () {
    this.qt = d3.quadtree()
      .x((d) => d.position[0])
      .y((d) => d.position[1])
    this.qt.addAll(this.nodes)
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
    dt = Math.max(dt, 33)
    for (let i = 0; i < 2; i++) {
      this.update(dt)
    }
    this.render()
  }

  update (dt) {
    this.frame++
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

    ctx.fillStyle = 'black'
    ctx.fillRect(-100, -100, 200, 200)

    if (app.debug) {
      for (let node of this.nodes) {
        node.render(ctx)
      }
    } else {
      for (let blob of this.startNodes) {
        ctx.beginPath()
        ctx.moveTo(blob.firstNode.position.x, blob.firstNode.position.y)
        let currentNode = this.nextNode(blob.firstNode, blob.firstNode)
        let prevNode = blob.firstNode
        while (currentNode !== blob.firstNode) {
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
        ctx.fillStyle = blob.fill
        ctx.fill()
      }
    }

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
