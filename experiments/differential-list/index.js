import App from './app'

const dpr = window.devicePixelRatio

const canvas = document.createElement('canvas')
canvas.style = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  position: 'absolute'
}
document.body.appendChild(canvas)

canvas.width = window.innerWidth * dpr
canvas.height = window.innerWidth * dpr

let app = new App(canvas)
app.resize()

function tick (dt) {
  window.requestAnimationFrame(tick)

  app.tick(dt)
}
tick(16.6667)

window.app = app
