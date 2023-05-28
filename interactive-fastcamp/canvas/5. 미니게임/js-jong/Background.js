import App from './App.js'

export default class jongjin {
    set height(value) {
        this._height = value;
    }
    get height() {
        return this._height;
    }
    constructor() {
        this.img = document.querySelector('#bg1-img')
        this._height = App.height
        // 이미지 홀더 크기 구하기(App ==> 캔버스)
        // this.width : this.height = App.width: App.height
        this.width = App.height * (this.img.width / this.img._height)

        this.leftPos = { x: 0, y: 0}
        this.rightPos = { x: this.width, y: 0}
        console.log('bgWidth', this._height, this.width)
    }

    update() {
        //this.pos.x -= 20;
    }

    draw() {
        App.ctx.drawImage(
            this.img,
            this.leftPos.x, this.leftPos.y, this.width, this._height
        )
        App.ctx.drawImage(
            this.img,
            this.rightPos.x, this.rightPos.y, this.width, this._height
        )



    }

}
