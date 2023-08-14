import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

window.addEventListener('load', function () {
    init();
});

function init() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
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

    camera.position.z = 5;

    new OrbitControls(camera, renderer.domElement)

    const geometry = new THREE.SphereGeometry();
    const material = new THREE.PointsMaterial(
        {
            color: 'pink',
            size: 10,
            sizeAttenuation: false, // 원근에 따른 점의 크기 차이를 사용하지, 말지...
        }
    )

    const points = new THREE.Points(geometry, material)
    scene.add(points)
    // const mesh = new THREE.Mesh(geometry, material)
    // scene.add(mesh)

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
