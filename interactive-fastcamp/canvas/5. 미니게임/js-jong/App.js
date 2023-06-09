import Background from './background.js'
import Wall from './Wall.js'
import Player from './Player.js'
import BoundingBox from './BoundingBox.js'

export default class App {
    static canvas = document.querySelector('canvas')
    static ctx = App.canvas.getContext('2d')
    static dpr = devicePixelRatio > 1 ? 2 : 1
    static interval = 1000 / 60
    static width = 1024
    static height = 768

    constructor() {
        this.backgrounds =[
            new Background({
                img: document.querySelector('#bg3-img'),
                speed: -1,
            }),
            new Background({
                img: document.querySelector('#bg2-img'),
                speed: -2,
            }),
            new Background({
                img: document.querySelector('#bg1-img'),
                speed: -4,
            })
        ]



        this.walls = [new Wall({type:'SMALL'})]
        this.player = new Player()

        window.addEventListener('resize', this.resize.bind(this))
    }

    render() {
        let now, delta
        let then = Date.now()
        const frame = () => {
            requestAnimationFrame(frame)
            now = Date.now()
            delta = now - then
            if (delta < App.interval) return;

            App.ctx.clearRect(0, 0, App.width, App.height)
            // App.ctx.fillRect(50, 50, 100, 100)

            // 배경
            this.backgrounds.forEach(background => {
                //background.update();
                background.draw();
            })

            // 벽 관련
            /**
             * @ for문과 forEach문 비교
             * for문은 동기 방식이기 때문에 오류가 나면 오류가 난 위치 이후의 작업이 동작하지 않고 멈춰버린다.
             * forEach문은 비동기 방식이기 때문에 멈추지 않고 동작한다.
             * @ forEach문 단점:
             * 1. 반복문 내에서 배열이나 리스트 값을 변경하거나 추가할 수 없다. 오직 읽기 전용으로 불러오기 때문에 데이터를 수정할 수 없다.
             * 2. 배열을 역순으로 탐색할 수 없다.
             * 3. 여러 인스터가 있을경우 첫인스터를 제거하면, 사이드 이팩드 발생
             *    요소들이 깜빡임이 발생
             */

            // this.walls.forEach((wall, i) => {
            //     wall.update()
            //     wall.draw()
            //     console.log('isWall', wall.isOutside)
            //     if(wall.isOutside) this.walls.splice(i,1)
            // })
            // wall 인스터스가 제거될때마다 실행

            // 벽관리
            for (let i = this.walls.length-1; i >= 0; i--) {
                this.walls[i].update()
                this.walls[i].draw()
                // 벽 제거
                if(this.walls[i].isOutside) {
                    this.walls.splice(i,1)
                    continue
                }

                // 벽 생성
                if(this.walls[i].canGenerateNext){
                    this.walls[i].generateNext = true
                    const config = { type: Math.random() > 0.3 ? 'SMALL' : 'BIG' };
                    const newWall = new Wall(config)
                    this.walls.push(newWall)
                }

                // 플레이어 관련
                this.player.update()
                this.player.draw()

                // 벽과 플레이어가 충돌 관련
                if(this.walls[i].isColliding(this.player.boundingBox)){ //충돌!
                    console.log('충돌!!!')
                    this.player.boundingBox.color = 'rgba(255,100,0, 1)'
                }else{
                    this.player.boundingBox.color = 'rgba(0,0,255, 0.3)'
                }
            }
            // console.log('isWall', this.walls.length)


            then = now - (delta % App.interval)
        };
        requestAnimationFrame(frame)

    }

    resize() {
        App.canvas.width = App.width * App.dpr
        App.canvas.height = App.height * App.dpr
        App.ctx.scale(App.dpr, App.dpr)

        const width = innerWidth > innerHeight ? innerHeight * 0.8 : innerWidth * 0.9
        App.canvas.style.width = width + 'px'
        App.canvas.style.height = width * (3 / 4) + 'px'
    }
}
