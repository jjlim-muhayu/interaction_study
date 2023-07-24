import Mouse from "./Mouse.js"
import Rope from "./Rope.js"
import {randomNumBetween} from './utils.js'
import Dot from "./Dot.js";
import Stick from './Stick.js'

export default class App {
    static width = innerWidth
    static height = innerHeight
    static dpr = devicePixelRatio > 1 ? 2 : 1
    static interval = 1000 / 60

    constructor() {
        this.canvas = document.querySelector('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.resize()
        window.addEventListener('resize', this.resize.bind(this))

        this.createRopes()

        // 마우스 객체 생성
        this.mouse = new Mouse(this.canvas)

        // this.ropes = []
        // const rope_1 = new Rope({
        //     x: 400,
        //     y: 100
        // })
        // rope_1.pin(0)
        // this.ropes.push(rope_1)
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

        this.initRopes()
    }

    initRopes(){
        this.ropes = []
        const TOTAL = App.width * 0.06
        for (let i = 0; i < TOTAL; i++) {
            const rope = new Rope({
                x: randomNumBetween(App.width * 0.3, App.width * 0.7),
                y:0,
                gap: randomNumBetween(App.height * 0.05, App.height * 0.08)
            })
            rope.pin(0)
            this.ropes.push(rope)
        }
        console.log('Total', TOTAL)
    }

    render() {
        let now, delta
        let then = Date.now()
        const frame = () => {
            requestAnimationFrame(frame)
            now = Date.now()
            delta = now - then // 변환값, fps

            if (delta < App.interval) return
            then = now - (delta % App.interval)
            this.ctx.clearRect(0, 0, App.width, App.height)
            //this.ctx.fillRect(100, 100, 100, 100)

            // 점과 선분을 생성
            this.ropes.forEach(rope => {
                rope.update(this.mouse)
                rope.draw(this.ctx)
            })

            // 점과 선분 업데이트


            // draw here
            // this.ropes.forEach(rope => {
            //   rope.update(this.mouse)
            //   rope.draw(this.ctx)
            // })
        }
        requestAnimationFrame(frame)
    }
}
