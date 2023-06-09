import App from './App.js'
import BoundingBox from "./BoundingBox.js";

export default class Player {
    constructor() {
        this.img = document.querySelector('#bird-img')
        // 새 이미지가 생성되는 좌표
        this.x = App.width * 0.1
        this.y = App.height * 0.5
        this.width = 130
        this.height = this.width * (96 / 140);

        this.boundingBox = new BoundingBox(this.x + 10, this.y + 16, this.width - 20, this.height - 20)


        this.counter = 0;
        this.frameX = 0

        // event, 중력을 이용
        this.vy = -10
        this.gravity = 0.15
        App.canvas.addEventListener('click', () => {

            this.vy -= 10
            console.log('log', this.vy)
        })
    }

    update() {
        if( ++this.counter % 1 === 0){
            //this.frameX += 1
            //if(this.frameX === 15) this.frameX = 0
            //if(this.frameX % 15 === 0) this.frameX = 0
            this.frameX = ++this.frameX % 15
        }
        // this.vy += this.gravity
        // this.y += this.vy

        this.boundingBox.y = this.y + 16
    }

    draw() {

        App.ctx.drawImage(
            this.img,
            /*
            * sx: 크롭할 X좌표 (이미지 가로폭 / 이미지 시퀀스 갯수 * 프레임 카운터),sy: 크롭할 Y좌표,sw: 크롭할 가로크기,sh: 크롭할 세로크기 / 크롭할 위치 지정
            * sx: this.img.width / 15 * this.frameX
            * */
            this.img.width / 15 * this.frameX,0,this.img.width / 15, this.img.height,
            this.x, this.y, this.width, this.height
        )

        this.boundingBox.draw()
    }
}
