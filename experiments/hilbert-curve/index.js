import makeLoop from 'canvas-loop'
import makeCtx from '2d-context'

import App from './app'

const dpr = window.devicePixelRatio

const app = new App()

const ctx = makeCtx({ scale: dpr })
const canvas = ctx.canvas
document.body.appendChild(canvas)

const loop = makeLoop(canvas)
loop
  .on('tick', (dt) => {
    app.update(dt)
    app.render(ctx)
  })
  .on('resize', () => {
    app.resize(...loop.shape)
  })
  .emit('resize')

loop.start()
