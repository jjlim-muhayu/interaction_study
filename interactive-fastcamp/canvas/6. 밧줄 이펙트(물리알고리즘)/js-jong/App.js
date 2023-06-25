import Mouse from "./Mouse.js"
import Rope from "./Rope.js"
import { randomNumBetween } from './utils.js'

export default class App {
  static width = innerWidth
  static height = innerHeight
  static dpr = devicePixelRatio > 1 ? 1 : 1
  static interval = 1000 / 60

  constructor() {
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.resize()
    window.addEventListener('resize', this.resize.bind(this))


    this.createRopes()
  }

  createRopes() {

  }

  resize() {
    App.width = innerWidth
    App.height = innerHeight

    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.width = App.width * App.dpr
    this.canvas.height = App.height * App.dpr
    this.ctx.scale(App.dpr, App.dpr)

    this.createRopes()
  }

  render() {
    let now, delta
    let then = Date.now()

    const frame = () => {
      requestAnimationFrame(frame)
      now = Date.now()
      delta = now - then
      if (delta < App.interval) return
      then = now - (delta % App.interval)
      this.ctx.clearRect(0, 0, App.width, App.height)

      // draw here
      // this.ropes.forEach(rope => {
      //   rope.update(this.mouse)
      //   rope.draw(this.ctx)
      // })
    }
    requestAnimationFrame(frame)
  }
}
