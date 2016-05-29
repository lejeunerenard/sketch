import THREE from 'three'
import assign from 'object-assign'

const magenta = 0xf321b0
const orange = 0xf39821

export default class App {
  constructor () {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(magenta)

    const canvas = renderer.domElement
    document.body.appendChild(canvas)

    // Init
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 6, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    const scene = new THREE.Scene()

    const geo = new THREE.SphereBufferGeometry(5, 64, 64)
    const mat = new THREE.MeshLambertMaterial({ color: magenta })
    const sphere = new THREE.Mesh(geo, mat)
    sphere.position.set(0, 0, 0)
    scene.add(sphere)

    // Lighting
    const ambient = new THREE.AmbientLight(orange)
    ambient.intensity = 0.85
    scene.add(ambient)

    const white = new THREE.AmbientLight(0xffffff)
    white.intensity = 0.85
    scene.add(white)

    const keyPoint = new THREE.PointLight(0xffffff, 1, 100)
    keyPoint.intensity = 0.65
    keyPoint.position.set(20, 20, 5)
    scene.add(keyPoint)

    assign(this, {
      renderer,
      camera,
      scene,
      canvas
    })
  }

  resize (width = this.canvas.width, height = this.canvas.height) {
    this.renderer.setSize(width, height)

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  update (dt) {
    this.scene.rotation.y -= 1 * dt / 1000
    this.scene.rotation.z -= 1 * dt / 1000
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}
