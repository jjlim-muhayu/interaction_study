import CanvasOption from "./CanvasOption.js"
import { randomNumBetween } from "./utils.js"
export default class Tail extends CanvasOption {
  constructor(x, vy, colorDeg) {
    super()
    this.x = x
    this.y = this.canvasHeight
    this.vy = vy
    this.friction = 0.985
    this.colorDeg = colorDeg
    this.radius = 2
    this.opacity = 1

    this.angle = randomNumBetween(0,2)
  }

  update() {
    this.vy *= this.friction
    this.y += this.vy
    this.x += Math.cos(this.angle) * this.vy * 0.2

    this.opacity = -this.vy * 0.15
    this.angle += 1
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.fillStyle = `hsla(${this.colorDeg}, 100%, 65%, ${this.opacity})`
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.closePath()
  }
}
