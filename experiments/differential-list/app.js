import assign from 'object-assign'
import { vec2 } from 'gl-matrix'
import { quadtree } from 'd3-quadtree'

import Canvas2DRenderer from './renderer/canvas-2d'
import Node from './node'

export default class App {
  constructor (canvas) {
    this.renderer = new Canvas2DRenderer(canvas)

    // Create nodes
    this.nodes = []
    let r = 125 / 4
    let startNodes = []
    const numOfBodies = 3
    for (let i = 0; i < numOfBodies; i++) {
      let angle = i * 2 * Math.PI / numOfBodies
      startNodes.push(this.createBlob({
        x: 1.2 * r * Math.cos(angle),
        y: 1.2 * r * Math.sin(angle)
      }, r))
    }

    assign(this, {
      startNodes,
      prevT: 0,
      accumulatedT: 0
    })

    this.createQt()

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
    return nodes[0]
  }

  createQt () {
    this.qt = quadtree()
      .x((d) => d.position[0])
      .y((d) => d.position[1])
    this.qt.addAll(this.nodes)
  }

  // Source: http://bl.ocks.org/mbostock/4343214
  searchQt (x0, y0, x3, y3) {
    let nodes = []
    this.qt.visit((node, x1, y1, x2, y2) => {
      if (!node.length) {
        do {
          var d = node.data
          if ((d.x >= x0) && (d.x < x3) && (d.y >= y0) && (d.y < y3)) {
            nodes.push(d)
          }
        } while (node = node.next) // eslint-disable-line no-cond-assign
      }
      return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0
    })
    return nodes
  }

  resize () {
    this.renderer.resize()
  }

  tick (dt) {
    let temp = dt
    dt = dt - this.prevT
    this.prevT = temp

    this.accumulatedT += dt
    const STEP = 16.666667

    while (this.accumulatedT > STEP) {
      this.update(STEP)
      this.accumulatedT -= STEP
    }

    this.render()
  }

  update (dt) {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].update(dt, this)
    }
    this.createQt()
  }

  render () {
    this.renderer.render(this)
  }

  nextNode (prev, node) {
    for (let i = 0; i < node.nodes.length; i++) {
      let other = node.nodes[i]
      if (other !== prev) {
        return other
      }
    }
  }
}
