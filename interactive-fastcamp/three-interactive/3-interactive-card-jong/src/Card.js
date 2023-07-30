import * as THREE from "three";

class Card{
    constructor({width, height, radius, color}){
        // x,y축의 중심을 정의한다.
        const x = width /2 - radius
        const y = height /2 - radius
        const shape = new THREE.Shape()
        shape
            .absarc(x, y, radius,Math.PI / 2, 0, true)
            .lineTo(x + radius, -y)
            .absarc(x, -y, radius, 0,-Math.PI / 2, true)
            .lineTo(-x, -(y + radius))
            .absarc(-x, -y, radius,-Math.PI / 2, Math.PI, true)
            .lineTo(-(x+radius), y)
            .absarc(-x, y, radius,Math.PI, Math.PI / 2,true)
        const geometry = new THREE.ShapeGeometry(shape)
        const material = new THREE.MeshStandardMaterial({
             color,
            side: THREE.DoubleSide, // 앞뒤 양면 모두에 메터리얼 적용
            roughness: 0.5,
            metalness: 0.5,
        })

        const mesh = new THREE.Mesh(geometry, material)
        this.mesh = mesh;
    }
}

export default Card;
