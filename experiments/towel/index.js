import debug from 'debug'
import Fiber from './fiber'
import raf from 'raf'

let debugFiber = debug('fiber')
let debugApp = debug('app')

class App {

  constructor (options) {
    options = options || {}

    // Setup Canvas
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.pixelRatio = window.devicePixelRatio || 1
    this.ctx.scale(this.pixelRatio, this.pixelRatio)

    document.body.appendChild(this.canvas)

    // Fibers
    this.fibers = []
    this.fiberWidth = 0
    this.fiberHeight = 0

    this.density = options.density || 10

    // Events
    let touchTimeout

    window.addEventListener('resize', this.resize.bind(this))
    window.addEventListener('touchstart', (event) => {
      if (event.target !== this.canvas) {
        return
      }

      // Double tap
      if (touchTimeout) {
        window.clearTimeout(touchTimeout)
        touchTimeout = null

        // Toggle GUI
        dat.GUI.toggleHide()
      } else {
        touchTimeout = window.setTimeout(() => {
          touchTimeout = null

          this.clear()
        }, 500)
      }
    })

    // GUI
    var gui = new dat.GUI()
    gui.add(this, 'density').min(4)
  }

  get density () {
    return this._density
  }

  // Changing density automatically redraws the entire app
  set density (value) {
    this._density = value

    this.clear()
  }

  clear () {
    this.fibers = []

    this.fiberWidth = this.fiberHeight = 0
    this.resize()
  }

  resize () {
    this.canvas.width = window.innerWidth * this.pixelRatio
    this.canvas.height = window.innerHeight * this.pixelRatio

    // Add new fibers
    // Cover new height
    if (this.canvas.height > this.fiberHeight) {
      // Skip if there is no known width
      // This is a slight optimization
      if (this.fiberWidth) {
        this.createFibers({
          x: 0,
          y: this.fiberHeight
        }, this.fiberWidth, this.canvas.height - this.fiberHeight)
      }

      // Set new height
      this.fiberHeight = this.canvas.height
    }

    // Cover new width
    if (this.canvas.width > this.fiberWidth) {
      this.createFibers({
        x: this.fiberWidth,
        y: 0
      }, this.canvas.width - this.fiberWidth, this.fiberHeight)

      // Set new height
      this.fiberWidth = this.canvas.width
    }

    // Draw frame again
    debugApp('draw scheduled')
    raf(this.draw.bind(this))
  }

  createFibers (offset, width, height) {
    debugApp('create fired params', offset, width, height)

    let columns = width / this._density
    let rows = height / this._density

    debugApp('create fired dimensions', columns, rows)
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        let rotation = Math.random() * 2 * Math.PI
        let length = Math.random() * 2 + 3

        this.fibers.push(new Fiber({
          rotation,
          length,
          position: {
            x: offset.x + width * i / columns,
            y: offset.y + height * j / rows
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

    while (k--) {
      this.fibers[k].draw(this.ctx)
    }

    debugApp('drawn')
  }
}

let app = new App({ density: 15 })
app.draw()
