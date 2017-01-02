let Voyeur = require('@lejeunerenard/voyeur')
import App from './app'

let app = new App()
document.body.appendChild(app.canvas)

let voyeur = new Voyeur(app.canvas, 5, {
  framerate: 10
})
voyeur.capture = !!(JSON.parse(localStorage.capture || 'false'))
voyeur.update = app.update.bind(app)
voyeur.render = app.render.bind(app)
voyeur.start()

window.app = app
