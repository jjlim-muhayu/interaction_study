export default class Stick {
    // 점에 연결된 선
    constructor(p1, p2) {
        // console.log('Stick==>', p1, p2)
        this.startPoint = p1
        this.endPoint = p2
        // 선의 길이 설정
        this.length = this.startPoint.pos.dist(this.endPoint.pos)

        this.tension = 0.3
        // 1보다 작아지면 질수록 텐션력이 떨어지므로, 원래대로 돌아가지 못하는 선처럼 보이게 된다.
        // 스프링효과처럼 보인다.
    }


    update() {
        // 처음 설정한 선의 길이를 일정한 길이를 갖을 수 있도록 제어
        const dx = this.endPoint.pos.x - this.startPoint.pos.x //보정전 실제 늘어난 선분의 X,Y값
        const dy = this.endPoint.pos.y - this.startPoint.pos.y

        const dist = Math.sqrt(dx * dx + dy * dy)
        const diff = (dist - this.length ) / dist

        const offsetX = diff * dx * this.tension  // aX
        const offsetY = diff * dy * this.tension // aY

        // console.log('StickUpdate => ', `
        //     this.length : ${this.length},
        //     dx: ${dx}, dy: ${dy},
        //     dist: ${dist}, diff: ${diff},
        //     offsetX: ${offsetX},
        //     offsetY: ${offsetY}
        // `)

        // 힘에 대한 분배
        const m = this.startPoint.mass + this.endPoint.mass
        const m1 = this.endPoint.mass / m
        const m2 = this.startPoint.mass / m

        /*
            m1 => 시작점: offset * e무게 / s무게 + e무게
            m2 => 끝점: offset * s무게 / s무게 + e무게
         */


        //매프레임의 startPoint가 고정안된경우
        if(!this.startPoint.pinned){
            this.startPoint.pos.x += offsetX * m1 // 0.5
            this.startPoint.pos.y += offsetY * m1 // 0.5
        }
        //매프레임의 endPoint가 고정안된경우
        if(!this.endPoint.pinned){
            this.endPoint.pos.x -= offsetX * m2
            this.endPoint.pos.y -= offsetY * m2
        }

    }

    draw(ctx) {
        ctx.beginPath() // 새로운 선 시작 알림
        ctx.strokeStyle = '#999'
        ctx.lineWidth = 1
        ctx.moveTo(this.startPoint.pos.x, this.startPoint.pos.y) // 선의 출발점
        ctx.lineTo(this.endPoint.pos.x, this.endPoint.pos.y) // 선의 도착점
        ctx.stroke() //
        ctx.closePath()

    }
}
