import {randomNumBetween} from "../js/utils.js";

import App from './App.js'
import BoundingBox from "./BoundingBox.js";

export default class Wall {
    constructor(config) {
        this.img = document.querySelector('#wall-img')
        this.type = config.type  //BIG, SMALL

        switch (this.type) {
            case'BIG':
                this.sizeX = 18 / 30
                this.sx = this.img.width * (9 / 30)
                break
            case 'SMALL':
                this.sizeX = 9 / 30
                this.sx = this.img.width * (0 / 30)
                break
        }


        this.width = App.height * this.sizeX
        this.height = App.height

        this.gapY = randomNumBetween(App.height * 0.1, App.height * 0.2)
        this.gapY = App.height * 0.15
        this.x = App.width //x의 시작점 : 캔바스 width


        /**
         * 상단 벽의 Y축 로직
         * @공식: 캠버스 높이 + (랜덤: 이미지 상하의 투명 영역이 안보이도록 하기 위해 시작값과 끝나는 값에 30을 추가, 제거를 한다.)
         *
         */
        this.y1 = -this.height + randomNumBetween(30, App.height - this.gapY - 30) // 윗벽
        //this.y1 = - this.height + App.height - this.gapY - 30
        this.y2 = this.y1 + this.height + this.gapY // 아랫벽

        this.generateNext = false  // 다음벽 생성을 위한 Boolean
        this.gapNextX = App.width * 0.6


        this.boundingBox1 = new BoundingBox(this.x + 30, this.y1 + 30, this.width - 60, this.height - 60)
        this.boundingBox2 = new BoundingBox(this.x + 30, this.y2 + 30, this.width - 60, this.height - 60)
    }

    get canGenerateNext(){
        return (
            !this.generateNext && this.x + this.width < this.gapNextX
        )
    }

    get isOutside(){
        // 벽이 화면에서 제거된것을 확인하는 코드
        return this.x + this.width < 0
    }

    isColliding(target){ // 충돌체크
        return (
            this.boundingBox1.isColliding(target) ||
            this.boundingBox2.isColliding(target)
        )
    }

    update() {
        //x축을 이동시키고, 벽이 화면에 사라지면 제거
         this.x += -6
        this.boundingBox1.x = this.boundingBox2.x = this.x + 30
    }

    draw() {
        // this.x = 700
        // this.boundingBox1.x = this.boundingBox2.x = this.x + 30

        App.ctx.drawImage(
            this.img,
            this.sx, 0, this.img.width * this.sizeX, this.img.height,
            this.x, this.y1,
            this.width, this.height
        )
        App.ctx.drawImage(
            this.img,
            this.sx, 0, this.img.width * this.sizeX, this.img.height,
            this.x, this.y2,
            this.width, this.height
        )
        this.boundingBox1.draw()
        this.boundingBox2.draw()
    }
}
