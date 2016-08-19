import THREE from 'three'
import makeOrbitalControls from 'three-orbit-controls'
import createLoop from 'canvas-fit-loop'

import { randomVec } from './utils'

import Walker from './walker'

const Controls = makeOrbitalControls(THREE)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

const canvas = renderer.domElement
document.body.appendChild(canvas)

let numOfWalkers = document.createElement('div')
numOfWalkers.style.position = 'absolute'
numOfWalkers.style.left = '10px'
numOfWalkers.style.top = '10px'
numOfWalkers.style.color = '#fff'
document.body.appendChild(numOfWalkers)

const walkerWidth = 50
const edges = [
  new THREE.Vector3(-1, -1, -1).multiplyScalar(walkerWidth),
  new THREE.Vector3(1, 1, 1).multiplyScalar(walkerWidth)
]

// Init
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(2, 2, 5).multiplyScalar(20)
scene.add(camera)

const controls = new Controls(camera, canvas)
controls

const point = new THREE.PointLight(0xff00ff, 1, 500)
point.position.set(walkerWidth, walkerWidth, walkerWidth)
scene.add(point)

const ambient = new THREE.AmbientLight(0x00ffff, 0.1)
scene.add(ambient)

// Setup tree
let root = new Walker(1, 0xcccccc)
scene.add(root)
let tree = [root]

// Setup walkers
let walkers = []
const numWalkers = 500
function makeWalker () {
  let walker = new Walker(0.5, 0xffff00)
  let vec = randomVec().multiplyScalar(walkerWidth)
  walker.position.copy(vec)
  scene.add(walker)
  return walker
}
for (let i = 0; i < numWalkers; i++) {
  walkers.push(makeWalker())
}

const app = createLoop(canvas, {
  scale: window.devicePixelRatio
})

app.on('resize', () => {
  let [width, height] = app.shape

  renderer.setSize(width, height)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
})

app.on('tick', (dt) => {
  let n = 100
  while (n--) {
    for (let i = walkers.length - 1; i >= 0; i--) {
      let walker = walkers[i]
      walker.walk(edges)

      if (walker.doesCollide(tree)) {
        walker.color = 0xcccccc
        tree.push(walker)
        walkers.splice(i, 1)
      }
    }
  }

  // while (walkers.length < numWalkers) {
  //   walkers.push(makeWalker())
  // }

  numOfWalkers.innerText = walkers.length + tree.length

  renderer.render(scene, camera)
})

app.start()
