import Voyeur from '@lejeunerenard/voyeur'
import makeCtx from '2d-context'

import App from './app'

const dpr = window.devicePixelRatio

const app = new App()

const ctx = makeCtx({ scale: dpr })
const canvas = ctx.canvas
document.body.appendChild(canvas)

canvas.width = window.innerWidth
canvas.height = window.innerHeight
app.resize(canvas.width, canvas.height)

let voyeur = new Voyeur(canvas, 28, {
  framerate: 60
})
voyeur.capture = !!(JSON.parse(window.localStorage.capture || 'false'))
voyeur.update = app.update.bind(app)
voyeur.render = app.render.bind(app, ctx)
voyeur.start()
