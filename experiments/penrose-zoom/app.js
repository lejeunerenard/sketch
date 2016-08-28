import TWEEN from 'tween.js'

import Kite from './kite'
import Dart from './dart'

const dpr = window.devicePixelRatio
const seventyTwo = 72 * Math.PI / 180
const twoSixteen = 216 * Math.PI / 180
const PORTION = 2 * Math.PI / 5

const totalTime = 3000
const step1Dur = totalTime / 3
const step2Dur = totalTime / 3
const step3Dur = totalTime / 3

const step1Ease = TWEEN.Easing.Sinusoidal.Out
const step2Ease = TWEEN.Easing.Circular.InOut
const step3Ease = TWEEN.Easing.Exponential.InOut

const initialGeneration = 2
const maxGenerations = 2

const SIZE = 1400
let time = null
let generation = 0
export default class App {
  constructor () {
    this.tiles = [
      new Kite(0, 0, 0 * PORTION, SIZE),
      new Kite(0, 0, 1 * PORTION, SIZE),
      new Kite(0, 0, 2 * PORTION, SIZE),
      new Kite(0, 0, 3 * PORTION, SIZE),
      new Kite(0, 0, 4 * PORTION, SIZE)
    ]

    // Generation
    for (let i = 0; i < initialGeneration; i++) {
      this.nextGeneration()
    }

    generation = maxGenerations - 1

    let nextAnimation = (currentTiles) => {
      let complete

      // Swap
      [this.movingTiles, complete] = this.animate(currentTiles)
      return complete.then(() => {
        if (!generation) {
          return
        }
        generation--

        this.tiles = this.movingTiles
        return nextAnimation(this.movingTiles)
      })
    }

    nextAnimation(this.tiles).then(() => { console.log('time', time) })
  }

  scaleThenMove (from, to) {
    let genesis = JSON.parse(JSON.stringify(from))
    genesis.side = genesis._side

    let dest = {
      side: to.side,
      x: to.x,
      y: to.y,
      rotation: to.rotation
    }

    to.x = from.x
    to.y = from.y
    to.rotation = from.rotation
    to.side = from.side

    let scale = new TWEEN.Tween(genesis)
      .to({
        side: dest.side
      }, step1Dur)
      .easing(step1Ease)
      .onUpdate(function () {
        to.side = this.side
      })

    let posNRot = new TWEEN.Tween(genesis)
      .to({
        rotation: dest.rotation,
        x: dest.x,
        y: dest.y
      }, step2Dur)
      .easing(step2Ease)
      .onUpdate(function () {
        to.x = this.x
        to.y = this.y
        to.rotation = this.rotation
      })

    return scale.chain(posNRot).start()
  }

  waitThenScale (from, to) {
    let genesis = { side: from.side }
    let dest = to.side
    genesis.side = 0
    to.side = 0

    return new TWEEN.Tween(genesis)
      .to({
        side: dest
      }, step3Dur)
      .delay(step1Dur + step2Dur)
      .easing(step3Ease)
      .onUpdate(function () {
        to.side = this.side
      }).start()
  }

  animate (tiles) {
    let pendingCompletion = []
    let moving = tiles.reduce((prev, parent) => {
      let nextSet = this.deflation(parent)

      let setComplete = new Promise((resolve, reject) => {
        let stillWaiting = nextSet.length
        function isComplete () {
          stillWaiting--
          if (!stillWaiting) {
            resolve()
          }
        }

        let tweens = []
        if (parent instanceof Kite) {
          tweens.push(this.scaleThenMove(parent, nextSet[0]))
          tweens.push(this.waitThenScale(parent, nextSet[1]))
          tweens.push(this.waitThenScale(parent, nextSet[2]))
        } else {
          tweens.push(this.scaleThenMove(parent, nextSet[1]))
          tweens.push(this.waitThenScale(parent, nextSet[0]))
        }

        tweens.forEach((tween) => {
          tween.onComplete(isComplete)
        })
      })

      pendingCompletion.push(setComplete)

      return prev.concat(nextSet)
    }, [])

    return [moving, Promise.all(pendingCompletion)]
  }

  resize (shape) {
    [this.width, this.height] = shape
  }

  tick (dt) {
    time += dt
    TWEEN.update(time)
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
    let { width, height } = this

    ctx.save()

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)

    ctx.scale(dpr, dpr)
    ctx.translate(width / 2, height / 2)

    this.movingTiles.forEach((tile) => {
      tile.draw(ctx)
    })

    ctx.restore()
  }
}
