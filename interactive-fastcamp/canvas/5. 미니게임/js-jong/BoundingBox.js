import App from './App.js'

export default class BoundingBox {
    constructor(x, y, width, height){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = `rgba(244, 0, 0, 0.3)`
    }

    isColliding(target){ // 충돌체크
        return (
            target.x + target.width >= this.x && //벽 영역에 진입
            target.x <= this.x + this.width && //벽 영역에 포함
            target.y + target.height >= this.y &&
            target.y <= this.y + this.height

        )
    }
    draw(){
        App.ctx.fillStyle = this.color
        App.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

