import Kite from './kite'
import Dart from './dart'

const dpr = window.devicePixelRatio
const seventyTwo = 72 * Math.PI / 180
const twoSixteen = 216 * Math.PI / 180

export default class App {
  constructor () {
    let portion = 2 * Math.PI / 5
    this.tiles = [
      new Kite(0, 0, 0 * portion, 1400),
      new Kite(0, 0, 1 * portion, 1400),
      new Kite(0, 0, 2 * portion, 1400),
      new Kite(0, 0, 3 * portion, 1400),
      new Kite(0, 0, 4 * portion, 1400)
    ]

    // Generation
    for (let i = 0; i < 8; i++) {
      this.nextGeneration()
    }
  }

  resize (shape) {
    [this.width, this.height] = shape
  }

  tick () {
  }

  nextGeneration () {
    this.tiles = this.tiles.reduce((prev, curr) => {
      return prev.concat(this.deflation(curr))
    }, [])
  }

  deflation (tile) {
    let tiles = []
    if (tile instanceof Kite) {
      let b = tile.vertexB
      let c = tile.vertexC
      let d = tile.vertexD

      tiles.push(new Kite(c.x, c.y, tile.rotation - 3 * seventyTwo / 2, tile.sideB))
      tiles.push(new Kite(d.x, d.y, tile.rotation + 3 * seventyTwo / 2, tile.sideB))
      tiles.push(new Dart(b.x, b.y, tile.rotation + seventyTwo / 2, tile.sideB))
    } else {
      let b = tile.vertexB
      let d = tile.vertexD
      tiles.push(new Kite(b.x, b.y, tile.rotation, tile.sideC))
      tiles.push(new Dart(d.x, d.y, tile.rotation - twoSixteen, tile.sideC))
    }
    return tiles
  }

  render (dt, ctx) {
    let { width, height, tiles } = this

    ctx.save()

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)

    ctx.scale(dpr, dpr)
    ctx.translate(width / 2, height / 2)

    tiles.forEach((tile) => {
      tile.draw(ctx)
    })

    ctx.restore()
  }
}
