import Particle from "./particle.js";

const feGaussianBlur = document.querySelector('feGaussianBlur')
const feColorMatrix = document.querySelector('feColorMatrix')

const controls = new function () {
  this.blurValue = 40
  this.alphaChannel = 100
  this.alphaOffset = -23
  this.acc = 1.03
}
let gui = new dat.GUI()
const f1 = gui.addFolder('Gooey Effect')
f1.open()
f1.add(controls, 'blurValue', 0, 100).onChange(v => {
  feGaussianBlur.setAttribute('stdDeviation', v)
})
f1.add(controls, 'alphaChannel', 1, 200).onChange(v => {
  feColorMatrix.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${v} ${controls.alphaOffset}`)
})
f1.add(controls, 'alphaOffset', -40, 40).onChange(v => {
  feColorMatrix.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${v}`)
})
const f2 = gui.addFolder('Particle Property')
f2.open()
f2.add(controls, 'acc', 1, 1.5, 0.01).onChange(v => {
  particles.forEach(particle => particle.acc = v)
})

/**
 * load
 *
 */
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let canvasWidth
let canvasHeight

let interval = 1000 / 60
let now, delta
let then = Date.now()

const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min
}
let particles = []

function init(){
  canvasWidth = innerWidth
  canvasHeight = innerHeight
  const dpr = window.devicePixelRatio
  const TOTAL = canvasWidth / 30

  canvas.style.width = `${canvasWidth}px`
  canvas.style.height = `${canvasHeight}px`

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr,dpr) //레티나 디스플레이를 위해

  for (let i = 0; i < TOTAL; i++) {
    const x = randomNumBetween(0, canvasWidth)
    const y = randomNumBetween(0, canvasHeight)
    const radius = randomNumBetween(50, 100)
    const vy = randomNumBetween(1, 5)
    const myParticle = new Particle(x, y, radius, vy);
    particles.push(myParticle)
  }
  animate();
}
let animationId = null;
function animate(){
  animationId = window.requestAnimationFrame(animate)
  now = Date.now()
  delta = now - then
  //console.log(`now:${now} / delta: ${delta} / interval: ${ interval }`)
  if(delta < interval) return
  ctx.clearRect(0,0, canvasWidth, canvasHeight)
  particles.forEach(particle => {
    particle.update()
    particle.draw()
    if (particle.y - particle.radius > canvasHeight) {
      particle.y = -particle.radius
      particle.x = randomNumBetween(0, canvasWidth)
      particle.radius = randomNumBetween(50, 100)
      particle.vy = randomNumBetween(1, 5)
    }
  })
  then = now - (delta % interval)
}


window.addEventListener('load', () => {
  init()
})
window.addEventListener('resize', () => {
  init()
})
