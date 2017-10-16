export default class Renderer {
  constructor (canvas) {
    if (!canvas) {
      throw Error('Renderer was not given a canvas')
    }
  }

  resize () {
    throw Error(this.constructor.name + ' hasn\'t implemented resize()')
  }

  render () {
    throw Error(this.constructor.name + ' hasn\'t implemented render()')
  }
}
