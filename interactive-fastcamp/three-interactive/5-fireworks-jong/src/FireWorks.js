import THREE from "three";

export default class Fireworks{
    constructor(x,y){
        const count = 1000
        //const particlesGeometry = new THREE.BufferGeometry()

        const particles = []
        for (let i = 0; i < count; i++) {
            const particle = new THREE.Vector3(x,y, 0)

            // particles의 정점을 설정
        }
    }
}
