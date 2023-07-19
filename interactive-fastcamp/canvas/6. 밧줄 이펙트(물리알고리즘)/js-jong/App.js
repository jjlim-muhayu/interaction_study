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
        //선의 시작점과 끝점을 위해 배열로 생성한다.
        //this.dots = [new Dot(400,50), new Dot(500,100), new Dot(100,50), new Dot(200,100)]
        this.dots = [new Dot(400,50), new Dot(450,100), new Dot(500,50), new Dot(650,100)]
        //세로선
        this.sticks = [
            new Stick(this.dots[0], this.dots[1]),
            new Stick(this.dots[1], this.dots[2]),
            new Stick(this.dots[2], this.dots[3]),
        ]

        this.dots[0].pinned = true
        // this.dots[2].pinned = true
        //
        // this.dots[1].mass = 10
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
            delta = now - then // 변환값, fps

            if (delta < App.interval) return
            then = now - (delta % App.interval)
            this.ctx.clearRect(0, 0, App.width, App.height)
            //this.ctx.fillRect(100, 100, 100, 100)

            // 점 생성
            this.dots.forEach(dot => {
                dot.update()
                dot.draw(this.ctx)
            })

            // 선 생성
            this.sticks.forEach(stick => {
                stick.update()
                stick.draw(this.ctx)
            })
            // draw here
            // this.ropes.forEach(rope => {
            //   rope.update(this.mouse)
            //   rope.draw(this.ctx)
            // })
        }
        requestAnimationFrame(frame)
    }
}
