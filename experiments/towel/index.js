import debug from 'debug'
import Fiber from './fiber'
import raf from 'raf'

let debugFiber = debug('fiber')

class App {

  constructor () {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.pixelRatio = window.devicePixelRatio || 1
    this.ctx.scale(this.pixelRatio, this.pixelRatio)

    document.body.appendChild(this.canvas)

    this.fibers = []

    // Events
    window.addEventListener('resize', this.resize.bind(this))
    this.resize()
  }

  resize () {
    this.canvas.width = window.innerWidth * this.pixelRatio
    this.canvas.height = window.innerHeight * this.pixelRatio

    // Draw frame again
    raf(this.draw.bind(this))
  }

  createFibers (density) {
    // Clear existing fibers
    this.fibers  = []

    let columns = this.canvas.width / density,
        rows    = this.canvas.height / density

    for ( let i = 0; i < columns; i ++ ) {
      for ( let j = 0; j < rows; j ++ ) {
        let rotation = Math.random() * 2 * Math.PI,
            length   = Math.random() * 2 + 3

        this.fibers.push(new Fiber({
          rotation,
          length,
          position: {
            x: this.canvas.width * i / columns,
            y: this.canvas.height * j / rows
          }
        }))

        debugFiber('Fiber options', {
          rotation,
          length
        })
      }
    }
  }

  draw () {
    let k = this.fibers.length

    while ( k-- ) {
      this.fibers[k].draw(this.ctx)
    }
  }
}

var app = new App

app.createFibers(10)
app.draw()
