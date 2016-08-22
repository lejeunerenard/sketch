import THREE from 'three'

export function randomVec () {
  return new THREE.Vector3(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1)
}
