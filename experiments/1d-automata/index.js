import makeCtx from '2d-context'
import makeLoop from 'canvas-loop'
import assign from 'object-assign'
import Color from 'color'

const ctx = makeCtx()
const canvas = ctx.canvas

document.body.appendChild(canvas)

const dpr = window.devicePixelRatio / 2
const app = makeLoop(canvas, {
  scale: dpr
})

const background = '#303030'
const background2 = '#242424'
const fromColor = '#555'
const toColor = '#fff'

let gen = 0
let state = []

function nextGen () {
  let newState = []

  for (let i = 1; i < state.length; i++) {
    let slot = state[i]
    if (!slot) {
      let others = 0

      if (i > 0 && state[i - 1]) {
        others++
      }
      if (i !== state.length && state[i + 1]) {
        others++
      }

      if (others === 1) {
        newState[i] = 1
        continue
      }
    }

    newState[i] = 0
  }

  state = newState

  gen++
}

const offset = 0.1

function percentageThrough () {
  let topOffset = app.height * offset

  return gen / (app.height - 2 * topOffset)
}

function mixColor (percentage) {
  let from = Color(fromColor)
  return from.mix(Color(toColor), percentage).hexString()
}

function draw () {
  // ctx.fillStyle = `hsl(${percentageThrough() * 360 / 6}, 100%, 50%)`
  ctx.fillStyle = mixColor(percentageThrough())

  for (let i = 0; i < state.length && i < app.width; i++) {
    if (state[i]) {
      ctx.fillRect(i, Math.floor(gen + app.height * offset), 1, 1)
    }
  }
}

app.on('resize', () => {
  let [width, height] = app.shape
  width *= dpr
  height *= dpr

  assign(app, {
    width,
    height })

  if (!state.length) {
    let center = [ width / 2, height / 2 ]
    var grad = ctx.createRadialGradient(...center, Math.max(width, height), ...center, 0)
    grad.addColorStop(0, background2)
    grad.addColorStop(1, background)
    ctx.fillStyle = grad

    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < width; i++) {
      state[i] = 0

      if (i === Math.floor(width / 2)) {
        console.log('middle set at', i)
        state[i] = 1
      }
    }
  }
})

app.on('tick', (dt) => {
  if (gen > 605) {
  // if (gen > 639 || gen > (app.height * (1 - 2 * offset))) {
    console.log('stopped')
    console.log('gen', gen)
    app.stop()
  }
  nextGen()
  draw()
})

app.emit('resize')
app.start()
