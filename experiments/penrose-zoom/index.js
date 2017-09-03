import makeContext from '2d-context'
import makeLoop from 'canvas-loop'
import CCapture from 'ccapture.js'

import App from './app'

const ctx = makeContext()
const canvas = ctx.canvas
document.body.appendChild(canvas)

const app = new App()

if (JSON.parse(localStorage.capture || 'false')) {
  const fr = 60
  console.log('capturing')
  const capturer = new CCapture({
    name: 'penrose-zoom',
    quality: 100,
    format: 'jpg',
    framerate: fr,
    verbose: true
  })
  const length = 8 * 1000
  const dt = 1 / fr * 1000

  const maxFrames = length / dt
  const loop = makeLoop(canvas, { scale: window.devicePixelRatio })
  loop.on('resize', app.resize.bind(app, loop.shape))
  loop.emit('resize')

  let frame = 0
  function render () { // eslint-disable-line no-inner-declarations
    if (frame > maxFrames) {
      capturer.stop()
      capturer.save()
      return
    }
    requestAnimationFrame(render)

    app.tick(dt)
    app.render(dt, ctx)

    capturer.capture(canvas)
    frame++
  }

  capturer.start()
  render()
} else {
  console.log('normal render')
  const loop = makeLoop(canvas, { scale: window.devicePixelRatio })
  loop.on('resize', app.resize.bind(app, loop.shape))
  loop.on('tick', (dt) => {
    app.tick(dt)
    app.render(dt, ctx)
  })

  loop.emit('resize')
  loop.start()
}
