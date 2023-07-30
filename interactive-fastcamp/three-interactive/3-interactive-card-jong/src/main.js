import * as THREE from 'three';
import Card from './Card.js'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GUI} from 'lil-gui'

window.addEventListener('load', function () {
    init();
});

function init() {
    const gui = new GUI();
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500,
    );

    camera.position.z = 25;

    // orbitControl
    const controls = new OrbitControls(camera, renderer.domElement)

    // 카드 생성
    const card = new Card({
        width: 10,
        height: 15.8,
        radius: 0.5,
        color:'#0077ff'
    })
    scene.add(card.mesh)

    // GUI TEST
    const cardFolder = gui.addFolder('Card')
    cardFolder
        .add(card.mesh.material, 'roughness') //빛에 의한 거칠상태 표현
        .min(0)
        .max(1)
        .step(0.01)
        .name('material.roughness')

    cardFolder
        .add(card.mesh.material, 'metalness') // 메탈 재질 표현
        .min(0)
        .max(1)
        .step(0.01)
        .name('material.metalness')

    // 기본 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    ambientLight.position.set(-5, -5,-5);
    scene.add(ambientLight)

    // 메탈 효과를 위한 조명
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6)
    const directionalLight2 = directionalLight1.clone()
    directionalLight1.position.set(1,1,3)
    directionalLight2.position.set(-1, 1, -3);
    scene.add(directionalLight1,directionalLight2)

    render();

    function render() {
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', handleResize);
}
