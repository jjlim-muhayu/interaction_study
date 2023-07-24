import Dot from "./Dot.js"
import Stick from "./Stick.js"

export default class Rope {
  constructor(config) {
      this.x = config.x
      this.y = config.y
      this.segments = config.segments || 10 //생성할 점의 갯수
      this.gap = config.gap || 50 // 점간의 간격
      this.color = config.color || 'gray' //컬러

      this.iterations = config.iterations || 10 // 스틱의 업데이트 반복 횟수

      this.dots = []
      this.sticks = []



      this.create()
  }

  pin(index) {
      this.dots[index].pinned = true
  }

  // 밧줄을 뽑아준다.
  checkPullingOut(){
      // 실제 늘어난 첫번째 선분의 길이를 체크
      const dist = this.dots[0].pos.dist(this.dots[1].pos)
      if (dist /this.sticks[0].length > 1.4){
          this.dots[0].pinned = false
      }
  }

  create() {
      for (let i = 0; i < this.segments; i++) {
          this.dots.push(new Dot(this.x, this.y + i * this.gap))
      }

      // 선분 생성
      for (let i = 0; i < this.segments - 1; i++) {
          this.sticks.push(new Stick(this.dots[i], this.dots[i + 1]))
      }
  }

  update(mouse) {
      this.checkPullingOut()
      // 점과 선분을 업데이트
      this.dots.forEach(dot => {
          dot.update(mouse)
      })
      for (let i = 0; i < this.iterations; i++) {
          this.sticks.forEach(stick => {
              stick.update()
          })
      }
  }

  draw(ctx) {
      this.dots.forEach(dot => {
          // 프레임 업데이트시 마우스 객체를 update 함수에 전달
          dot.draw(ctx)
      })
      this.sticks.forEach(stick => {
          stick.draw(ctx)
      })

      // 점이미지 생성, 불빛 이미지를 마지막 점에만 붙이기
      this.dots[this.dots.length - 1].drawLight(ctx)
  }
}
