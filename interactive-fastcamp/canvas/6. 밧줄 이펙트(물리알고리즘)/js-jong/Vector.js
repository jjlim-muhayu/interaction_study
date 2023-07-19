/**
 * Vector.js v1.0.0
 * @author Anurag Hazra
 * @borrows p5.Vector
 * @param {number} x
 * @param {number} y
 */
export default class Vector {
    constructor(x,y) {
        this.x = x || 0
        this.y = y || 0
    }

    // 내부에서 사용시
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y)
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y)
    }

    // 바깥모듈에서 호출해서 사용시
    // 더하기
    add(x, y) {
        if (arguments.length === 1) {
            this.x += x.x
            this.y += x.y
        } else if (arguments.length === 2) {
            this.x += x
            this.y += y
        }

        return this
    }

    // 빼기 subtract
    sub(x, y) {
        if (arguments.length === 1) {
            this.x -= x.x
            this.y -= x.y
        } else if (arguments.length === 2) {
            this.x -= x
            this.y -= y
        }
        return this
    }

    // multiply 곱하기
    mult(v) {
        if(typeof v === 'number') {
            this.x *= v
            this.y *= v
        }else {
            this.x *= v.x
            this.y *= v.y
        }

        return this
    }
    // vector 인스터스에서 넘어오는 x,y값을 내부에서 사용할 수 있는 x,y값으로 전달
    setXY(x,y){
        this.x = x
        this.y = y

        return this
    }

    // distance
    // 피타고라서공식을 통해 빗변값을 반환하는 함수
    dist(v){
        const dx = this.x - v.x
        const dy = this.y - v.y

        return Math.sqrt(dx * dx + dy * dy) // x, y 값
    }
}
