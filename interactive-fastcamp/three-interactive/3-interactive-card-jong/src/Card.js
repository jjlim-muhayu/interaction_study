import * as THREE from "three";

class Card{
    constructor({width, height, color}){
        const geometry = new THREE.PlaneGeometry(width, height)
        const material = new THREE.MeshStandardMaterial({
             color,
            side: THREE.DoubleSide // 앞뒤 양면 모두에 메터리얼 적용
        })

        const mesh = new THREE.Mesh(geometry, material)
        this.mesh = mesh;
    }
}

export default Card;
