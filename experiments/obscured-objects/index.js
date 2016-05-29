import createLoop from 'canvas-fit-loop'
import fitter from 'canvas-fit'
import CCapture from 'ccapture.js'
import defined from 'defined'
import App from './app'

let app = new App()

let capture = (localStorage.capture !== 'false')
let captureLength = defined(localStorage.captureLength || 10)

if (capture) {
  fitter(app.canvas)

  let capturer
  capturer = new CCapture({ format: 'jpg', framerate: 30, verbose: true })
  capturer.start()

  let frames = 0

  // Helpers
  function render (dt) {
    requestAnimationFrame(render)

    app.update(dt)
    app.render()

    if (frames <= captureLength * 30) {
      // capturer.capture(app.canvas)
      frames++
    } else {
      capturer.stop()
      capturer.save()
    }
  }

  app.resize()
  render()
} else {
  const loop = createLoop(app.canvas, {
    scale: window.devicePixelRatio
  })

  loop.on('resize', () => { app.resize(loop.shape[0], loop.shape[1]) })
  loop.emit('resize')

  loop.on('tick', (dt) => {
    app.update(dt)
    app.render()
  })

  loop.start()
}
