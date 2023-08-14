import * as THREE from 'three';

export default class Firework{
    constructor({x,y}){
        const count = 1000 + Math.round(Math.random()* 5000) //1000~2000사이의 랜덤 숫자
        const velocity = 10 + Math.random() * 10 // 랜덤한 속도
        const particlesGeometry = new THREE.BufferGeometry()
        this.particles = []
        for (let i = 0; i < count; i++) {

            // 파티클 생성
            const particle = new THREE.Vector3(x,y,0) //x,y,z 점점

            particle.theta = Math.random() * Math.PI * 2; // 원의 중심각
            particle.phi = Math.random() * Math.PI * 2

            // 만약 10이라면 -5 ~ 5사이의 값 반환
            // 2차원의 좌표 이동
            // particle.deltaX = velocity * Math.cos(particle.theta)
            // particle.deltaY = velocity * Math.sin(particle.theta)
            // particle.deltaZ = 0

            //3차원 공간에서의 좌표 이동
            // 구면좌표계를 이용하여 파티클 이동을 얻는다.
            // 구면좌표계 <-> 직교좌표계로 변환 공식을 이용해 값을 얻는다.
            particle.deltaX = velocity * Math.sin(particle.theta) * Math.cos(particle.phi)*2
            particle.deltaY = velocity * Math.sin(particle.theta) * Math.sin(particle.phi)
            particle.deltaZ = velocity * Math.cos(particle.theta) * 2
            this.particles.push(particle)
        }

        // particles의 정점을 설정
        particlesGeometry.setFromPoints(this.particles)

        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load('./assets/textures/particle.png')
        const particleMaterial = new THREE.PointsMaterial({
            size:1,
            alphaMap:texture,
            transparent:true,
            depthWrite:false,
            color:new THREE.Color(Math.random(), Math.random(),Math.random()), //Three.JS의 Color인스턴스 사용
            blending: THREE.AdditiveBlending,
        })
        const points = new THREE.Points(particlesGeometry, particleMaterial)
        this.points = points
    }

    update(){
        const position = this.points.geometry.attributes.position;
        //매프레임마다 모든 파티클이 사방으로 움직이는것처럼 보일수 있도록 이곳에 파티클의 좌표를 업데이트한다.
        //원의 좌표계를 이용해서 3축 방향으로 파티클들이 움직일수 있도록 sin,cos 을 이용하여 처리한다.

        for (let i = 0; i < this.particles.length; i++) {
            //x,y,z 좌료
            const x = position.getX(i)
            const y = position.getY(i)
            const z = position.getZ(i)
            //console.log(`x:${x} y:${y}, z: ${z}`)
            // 매 프레임에 이동하는 점을 표현하기 위해 점의 좌표를 x,y,z 좌표를 업데이트한다.
            position.setX(i, x + this.particles[i].deltaX)
            position.setY(i, y + this.particles[i].deltaY)
            position.setZ(i, z + this.particles[i].deltaZ)
        }

        position.needsUpdate = true
    }
}
