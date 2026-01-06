import createLoop from 'canvas-fit-loop'
import App from './app'

const app = new App()
window.app = app

const capture = (localStorage.capture !== 'false' && localStorage.capture)

if (capture) {
  const captureScript = document.createElement('script')
  document.body.appendChild(captureScript)
  captureScript.src = 'bundle.capture.js'
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
