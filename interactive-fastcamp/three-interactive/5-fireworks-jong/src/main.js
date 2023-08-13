import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import Fireworks from "./FireWorks.js";

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

    // fireWorks 클래스 사용
    //const fireWorks = new Fireworks({x:0, y:0})
    //scene.add(fireWorks)

    const geometry = new THREE.BufferGeometry();
    const count = 1000;
    const positions = new Float32Array(count * 3) //정점 생성 갯수 * 3(x,y,z)
    const colors = new Float32Array(count * 3)
    // 화면중심으로 특정한 크기의 정육면체안에 점점들을 랜덤하게 생성한다.
    // 정점의 위치 정보를 담고 있다.
    for (let i = 0; i < count; i++) {
        // 기본 랜덤값 정의: 0~1
        // position[i * 3] = Math.random() - 0.5
        // position[i * 3 + 1] = Math.random() - 0.5
        // position[i * 3 + 2] = Math.random() - 0.5

        //THREE.js의 내장객체를 이용한 랜덤값 정의
        positions[i * 3] = THREE.MathUtils.randFloatSpread(10) //x좌료, 1: -0.5~0.5
        positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(10) //y좌표
        positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(10) //z좌표

        //랜덤 컬러 좌표별로 담기
        colors[i *3] = Math.random()
        colors[i *3 + 1] = Math.random()
        colors[i *3 + 2] = Math.random()

    }
    //버퍼위치 정점 위치 정보를 담는다.
    // BufferAttribute에 정점들을 등록한다.
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) //마지막 인자 3은 점 한개에 대한 좌표의 집합(x,y,z) 의미함
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)) // 점에 대하여 랜덤하게 컬러 적용하기

    const material = new THREE.PointsMaterial(
        {
            color: 'pink',
            size: 0.1,
            vertexColors: true
            //sizeAttenuation: false, // 원근에 따른 점의 크기 차이를 사용하지, 말지...
        }
    )

    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('./assets/textures/particle.png')
     material.map = texture;

    material.alphaMap = texture
    material.transparent = true
    material.depthWrite = false

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
