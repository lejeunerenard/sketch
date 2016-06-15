import makeCtx from '2d-context'
import makeLoop from 'canvas-loop'

const ctx = makeCtx()
const canvas = ctx.canvas

document.body.appendChild(canvas)

const DEBUG = false
const num = 9

const dpr = window.devicePixelRatio
const app = makeLoop(canvas, {
  scale: dpr
})

// C = Cell
// o = Rotate 90 deg
// l = Translate left half
// L = Translate left
// r = Translate down half
// R = Translate down
// u = Translate up half
// U = Translate up
// d = Translate down half
// D = Translate down
// H = Horizontal flip
// V = Vertical flip
// S = Scale
// I = Draw image
// [ = Save state
// ] = Restore state

let phrase = 'S[oI]R[I]D[HoI]L[I]'

let vocab = {
  'I': phrase
}

function generate () {
  let newPhrase = ''
  for (let i = 0; i < phrase.length; i++) {
    let c = phrase.charAt(i)
    let replace = vocab[c]
    if (replace) {
      newPhrase += replace
    } else {
      newPhrase += c
    }
  }

  phrase = newPhrase
}

for (let i = 0; i < num; i++) {
  generate()
}

function download () {
  let link = document.createElement('a')
  link.href = canvas.toDataURL()
  link.download = 'download.png'
  link.innerText = 'Download'
  document.body.appendChild(link)
}

function draw () {
  let currentWidth = canvas.width
  let currentHeight = canvas.height

  ctx.fillStyle = '#343434'

  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (DEBUG) {
    ctx.moveTo(currentWidth / 2, 0)
    ctx.lineTo(currentWidth / 2, currentHeight)
    ctx.stroke()

    ctx.moveTo(0, currentHeight / 2)
    ctx.lineTo(currentWidth, currentHeight / 2)
  }

  for (let i = 0; i < phrase.length; i++) {
    let c = phrase.charAt(i)

    if (c === 'S') {
      ctx.scale(1 / 2, 1 / 2)
    } else if (c === 'I') {
      ctx.fillRect(currentWidth / 4, currentHeight / 4, currentWidth / 2, currentHeight / 2)
    } else if (c === 'o') {
      ctx.translate(currentWidth / 2, currentHeight / 2)
      ctx.rotate(Math.PI / 2)
      ctx.translate(- currentWidth / 2, - currentHeight / 2)
    } else if (c === 'H') {
      ctx.translate(currentWidth / 2, currentHeight / 2)
      ctx.scale(-1, 1)
      ctx.translate(- currentWidth / 2, - currentHeight / 2)
    } else if (c === 'V') {
      ctx.translate(currentWidth / 2, currentHeight / 2)
      ctx.scale(1, -1)
      ctx.translate(- currentWidth / 2, - currentHeight / 2)
    } else if (c === 'l') {
      ctx.translate(- currentWidth / 2, 0)
    } else if (c === 'L') {
      ctx.translate(- currentWidth, 0)
    } else if (c === 'r') {
      ctx.translate(currentWidth / 2, 0)
    } else if (c === 'R') {
      ctx.translate(currentWidth, 0)
    } else if (c === 'u') {
      ctx.translate(0, - currentHeight / 2)
    } else if (c === 'U') {
      ctx.translate(0, - currentHeight)
    } else if (c === 'd') {
      ctx.translate(0, currentHeight / 2)
    } else if (c === 'D') {
      ctx.translate(0, currentHeight)
    } else if (c === '[') {
      ctx.save()
    } else if (c === ']') {
      ctx.restore()
    }
  }

  ctx.restore()
}

app.on('tick', (dt) => {
  draw()
})
app.on('resize', () => {
  app.emit('tick')
})

app.emit('resize')
// app.emit('tick')
// app.start()

window.phrase = phrase
window.download = download
