import fitter from 'canvas-fit'
import CCapture from 'ccapture.js'
import defined from 'defined'

const app = window.app
const captureLength = defined(localStorage.captureLength || 10)

fitter(app.canvas)

const framerate = 30
const capturer = new CCapture({ format: 'jpg', framerate, verbose: true })
capturer.start()

let frames = 0
const dt = 1 / framerate * 1000

// Helpers
function render () {
  requestAnimationFrame(render)

  app.update(dt)
  app.render()

  if (frames <= captureLength * 30) {
    capturer.capture(app.canvas)
    frames++
  } else {
    capturer.stop()
    capturer.save()
  }
}

app.resize()
render()
