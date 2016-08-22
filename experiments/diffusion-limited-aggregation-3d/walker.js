import THREE from 'three'
import assign from 'object-assign'

import { randomVec } from './utils'

export default class Walker extends THREE.Mesh {
  constructor (radius = 1, color = 0xff0000) {
    let mat = new THREE.MeshPhongMaterial({ color })
    let geo = new THREE.SphereBufferGeometry(radius, 16, 16)
    super(geo, mat)

    assign(this, { radius })
  }

  set color (value) {
    this.material.color.set(value)
  }

  walk (edges) {
    this.position.add(randomVec())
    this.position.clamp(edges[0], edges[1])
  }

  doesCollide (tree) {
    let matches = tree.search(this.position, this.radius * 2)
    for (let { object } of matches) {
      let d = object.position.distanceToSquared(this.position)
      if (d < (object.radius + this.radius) * (object.radius + this.radius)) {
        return true
      }
    }
    return false
  }
}
