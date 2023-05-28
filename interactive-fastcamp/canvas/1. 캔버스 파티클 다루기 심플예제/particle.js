const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

export default class Particle {
  constructor(x, y, radius, vy) {
    this.x = x
    this.y = y
    this.radius = radius
    this.vy = vy
    this.acc = 1.016
  }
  update() {
    this.vy *= this.acc
    this.y += this.vy
  }
  draw(){
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI / 180 * 360)
    ctx.fillStyle = 'orange'
    ctx.fill()
    ctx.closePath()
  }
}
