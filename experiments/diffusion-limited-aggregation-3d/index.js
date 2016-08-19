import THREE from 'three'
import makeOrbitalControls from 'three-orbit-controls'
import createLoop from 'canvas-fit-loop'

import makeOctree from './octree'
makeOctree(THREE)

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

const walkerWidth = 30
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

const point = new THREE.PointLight(0xffffff, 1, 500)
point.position.set(walkerWidth, walkerWidth, walkerWidth)
scene.add(point)

const ambient = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambient)

// Setup tree
let root = new Walker(1, 0xcccccc)
scene.add(root)
let tree = new THREE.Octree()
tree.add(root)

// Setup walkers
let walkers = []
const numWalkers = 500
function makeWalker () {
  let walker = new Walker(1, 0xffff00)

  let side = Math.floor(Math.random() * 6)
  let rand1 = (Math.random() * 2 - 1) * walkerWidth
  let rand2 = (Math.random() * 2 - 1) * walkerWidth

  switch (side) {
    case 0:
      walker.position.set(-walkerWidth, rand1, rand2)
      break
    case 1:
      walker.position.set(walkerWidth, rand1, rand2)
      break
    case 2:
      walker.position.set(rand1, -walkerWidth, rand2)
      break
    case 3:
      walker.position.set(rand1, walkerWidth, rand2)
      break
    case 4:
      walker.position.set(rand1, rand2, -walkerWidth)
      break
    case 5:
      walker.position.set(rand1, rand2, walkerWidth)
      break
  }

  walker.visible = false

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

const huePeriod = 2
app.on('tick', (dt) => {
  let n = 50
  while (n--) {
    for (let i = walkers.length - 1; i >= 0; i--) {
      let walker = walkers[i]
      walker.walk(edges)

      if (walker.doesCollide(tree)) {
        let hue = root.position.distanceToSquared(walker.position) /
          (3 * walkerWidth * walkerWidth) * 360 *
          huePeriod %
          360
        walker.color = `hsl(${hue}, 60%, 50%)`
        walker.visible = true
        tree.add(walker)
        walkers.splice(i, 1)
      }
    }
  }

  while (walkers.length < numWalkers) {
    walkers.push(makeWalker())
  }

  renderer.render(scene, camera)
  tree.update()
})

app.start()
