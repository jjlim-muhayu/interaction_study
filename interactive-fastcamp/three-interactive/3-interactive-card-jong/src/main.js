import * as THREE from 'three';
import Card from './Card.js'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

window.addEventListener('load', function () {
    init();
});

function init() {
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
        color:'#0077ff'
    })
    scene.add(card.mesh)
    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    ambientLight.position.set(-5, -5,-5);
    scene.add(ambientLight)
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
