import makeContext from '2d-context'
import makeLoop from 'canvas-loop'
import App from './app'

import { fern } from './rules'

const ctx = makeContext()
const canvas = ctx.canvas
document.body.appendChild(canvas)

const app = new App(fern)

const loop = makeLoop(canvas, { scale: window.devicePixelRatio })
loop.on('resize', app.resize.bind(app, loop.shape))
loop.on('tick', (dt) => {
  for (let i = 0; i < 250; i++) {
    app.tick(dt)
    app.render(dt, ctx)
  }
})

loop.emit('resize')
loop.start()
