import App from './App.js'

export default class Background {
    set height(value) {
        this._height = value;
    }
    get height() {
        return this._height;
    }
    constructor(config) {
        this.img = config.img
        this._height = App.height
        // 이미지 홀더 크기 구하기(App ==> 캔버스)
        // this.width : this.height = App.width: App.height
        this.width = App.height * (this.img.width / this.img.height)

        this.leftPos = { x: 0, y: 0}
        this.rightPos = { x: this.width -4, y: 0}
        //테스트

        this.speed = config.speed
        //console.log('bgWidth', this._height, this.img.width)


    }

    update() {
        //this.pos.x -= 20;
        if(this.leftPos.x + this.width < 0 ) {
            this.leftPos.x = this.rightPos.x + this.width -4
        }
        if(this.rightPos.x + this.width < 0 ) {
            this.rightPos.x = this.leftPos.x + this.width -4
        }
        this.leftPos.x += this.speed
        this.rightPos.x += this.speed
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
