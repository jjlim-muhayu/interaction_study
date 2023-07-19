import {randomNumBetween} from './utils.js'
import Vector from './Vector.js'

// 점을 생성하기 위해
// 속도 구현
export default class Dot {
    constructor(x, y) {
        this.pos = new Vector(x,y)
        this.oldPos = new Vector(x,y)

        //중력과 마찰력
        this.gravity = new Vector(0,1)
        this.friction = 0.97  // 마찰력

        this.pinned = false  // 점 화면에 고정되었나?

        this.mass = 1
    }

    update() {
        if(this.pinned) return // 모든 움직임이 정지된 점일경우 아래 context pass...
        // 속도가 0인 점에도 부딛치는 점의 영향으로 인해 속도에 영향을 받도록 하기 위해
        let vel = Vector.sub(this.pos, this.oldPos)

        // 프레임 업데이트시 이전 점의 위치값을 세팅
        this.oldPos.setXY(this.pos.x, this.pos.y)
        // 새롭게 이동된 점의 위치를 설정
        //vel.y += 0.8
        vel.mult(this.friction)
        vel.add(this.gravity)

        this.pos.add(vel)
    }

    drawLight(ctx) {

    }

    draw(ctx) {
        ctx.fillStyle = '#000'
        ctx.beginPath()
        // arc(x,y,반지름,시작 각도 , 끝 각도 , 방향 설정)
        // x, y: 원 중심의 x좌표, 원 중심의 y 좌표,
        // @r: 원의 반지름,
        // @startAngle: 3시를 기준으로 시계방향으로 시작 각도 설정(원주율로 지정),
        // @endAngle: 3시를 기준으로 시계방향으로 끝 각도 설정(원주율로 지정))
        // @방향설정: 원을 그릴 때 시계방향으로 그릴지, 반시계방향으로 그릴지 설정
        //          false:시계 방향(기본값),true: 반시계 방향
        ctx.arc(this.pos.x, this.pos.y, 10,0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}
