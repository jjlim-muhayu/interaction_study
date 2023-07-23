import {randomNumBetween} from './utils.js'
import Vector from './Vector.js'

// 점을 생성하기 위해
// 속도 구현
export default class Dot {
    constructor(x, y) {
        this.pos = new Vector(x,y)
        this.oldPos = new Vector(x,y) //

        //중력과 마찰력
        this.gravity = new Vector(0,1)
        this.friction = 0.97  // 마찰력

        this.pinned = false  // 점 화면에 고정되었나?

        this.mass = 1
    }

    update(mouse) {
        if(this.pinned) return // 모든 움직임이 정지된 점일경우 아래 context pass...
        // 속도가 0인 점에도 부딛치는 점의 영향으로 인해 속도에 영향을 받도록 하기 위해
        let vel = Vector.sub(this.pos, this.oldPos) //점의 위치를 구분하여 속도로 계산

        // 프레임 업데이트시 이전 점의 위치값을 세팅
        this.oldPos.setXY(this.pos.x, this.pos.y)
        // 새롭게 이동된 점의 위치를 설정
        //vel.y += 0.8
        vel.mult(this.friction) // 마찰력을 매 프레임마다 곱해주기
        vel.add(this.gravity) // 중력은 매 프레임마다 더하기
        this.pos.add(vel)

        // 마우스에 점이 끌려오게 하기
        // 1. 방향벡터 구하기
        let {x:dx, y:dy} = Vector.sub(mouse.pos, this.pos)
        const dist = Math.sqrt(dx * dx + dy * dy) //2d 방향벡터

        // 선분 길이(dist)가 마우스 감지범위(정의값은 100)보다 크면, return해서 Dot인스턴스 업데이트 취소
        if(dist > mouse.radius) return
        // 마우스와 공사이의 거리 구하기
        // 공식: mouse.pos - dot.pos = (dx, dy)
        const direction = new Vector(dx / dist, dy /dist) //방향 벡터 생성
        // 2. 힘구하기
        // 공식: radius - dist / radius => 0 or 1
        // 0일경우 힘이 미치지 않고, 1에 가까워질수록 힘이 미친다.
        const force  = (mouse.radius - dist) / mouse.radius
        console.log('pointer', dist)
        // 3. 마우스가 타켓 점 반경안에 들어왔을때 조건하에 액션
        // 4. 마우스에 끌려오는 점을 위해 힘을 설정하기

        // 한프레임에 마우스 위치와 포인트가 힘을 받아 반대편의 좌표로 이동한다.
        // 다음프레임에서는 마우스위치와 점의 위치가 왼쪽으로 이동하는 과정이 반복되면서 점이 오른쪽/왼쪽 반복되는 떨림현상 발생
        // 그래서 보정을 위해 다음 조건(force)을 통해 분기처리하여 처리한다.
        // force가 0.6보다 클 경우 점의 위치를 마우스의 현재 위치로 설정하고
        // 아닐경우는 점의 위치에 방향벡터와 힘을 곱해줘서 마우스 위치에 따라 점이 따라오도록 한다.
        if(force > 0.6) this.pos.setXY(mouse.pos.x, mouse.pos.y)
        else this.pos.add(direction.mult(force).mult(5))


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
