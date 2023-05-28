import { randomNumBetween } from "./utils.js"

export default class Particle {
  constructor(r) {
    //this.r = r
    this.rFriction = randomNumBetween(0.95, 0.6)
    this.rAlpha = randomNumBetween(0, 5)
    this.r = innerHeight / 4

    this.angleAlpha = randomNumBetween(1, 2)
    this.angleFriction = randomNumBetween(0.95, 0.99)
    this.angle = randomNumBetween(0, 360)

    this.opacity = randomNumBetween(0.2, 1)
  }
  update() {
    // this.r +=1 // 수직방향으로 벗어난다.
    // this.angle +=1 // 원운동을 한다.
    // 360도:2파이R = 세타 : 반지름
    // this.r += this.rAlpha

    this.rAlpha *= this.rFriction
    this.r += this.rAlpha

    this.angleAlpha *= this.angleFriction
    this.angle += this.angleAlpha
    //
    // 좌표위치: 캔버스 중심점 + 반지름 * 코사인|사인(라다안 값)
    this.x = innerWidth / 2 + this.r * Math.cos(Math.PI / 180 * this.angle)
    this.y = innerHeight / 2 + this.r * Math.sin(Math.PI / 180 * this.angle)
    //
    this.opacity -= 0.015
  }
  draw(ctx) {
    ctx.beginPath()
    //ctx.arc(this.x, this.y, 1, 0, Math.PI * 2)
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2)

    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
    ctx.fill()
    ctx.closePath()
  }
}
