import THREE from 'three'
import makeOrbitControls from 'three-orbit-controls'
import createLoop from 'canvas-fit-loop'

const magenta = 0xf321b0
const orange = 0xf39821

const OrbitControls = makeOrbitControls(THREE)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(magenta)

const canvas = renderer.domElement
document.body.appendChild(canvas)

// Init
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(0, 6, 10)
camera.lookAt(new THREE.Vector3(0, 0, 0))

let controls = new OrbitControls(camera, canvas)
controls.update()

const scene = new THREE.Scene()

let sphereGeo = new THREE.SphereBufferGeometry(5, 64, 64)
let sphereMat = new THREE.MeshLambertMaterial({ color: magenta })
let sphere = new THREE.Mesh(sphereGeo, sphereMat)
sphere.position.set(0, 0, 0)
scene.add(sphere)

// Lighting
let ambient = new THREE.AmbientLight(orange)
ambient.intensity = 0.85
scene.add(ambient)

let white = new THREE.AmbientLight(0xffffff)
white.intensity = 0.85
scene.add(white)

let keyPoint = new THREE.PointLight(0xffffff, 1, 100)
keyPoint.intensity = 0.65
keyPoint.position.set(20, 20, 5)
scene.add(keyPoint)

const app = createLoop(canvas, {
  scale: window.devicePixelRatio
})

app.on('resize', () => {
  let [width, height] = app.shape

  renderer.setSize(width, height)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
})
app.emit('resize')

app.on('tick', (dt) => {
  renderer.render(scene, camera)
})

app.start()
