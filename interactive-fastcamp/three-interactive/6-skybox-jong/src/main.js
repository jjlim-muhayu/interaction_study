import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GUI} from "three/addons/libs/lil-gui.module.min.js";

window.addEventListener('load', function () {
    init();
});

function init() {
    const gui = new GUI()
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
        10000, //카메라 거리
    );

    camera.position.z = 100;

    const controls = new OrbitControls(camera, renderer.domElement)

    /**
     * 큐브텍스쳐를 이용한 3차원 공간
     */
    /*
    controls.minDistance = 5 //카메라 줌 최소 크기
    controls.maxDistance = 100 //카메라 줌 최대 크기

    const textureLoader = new THREE.TextureLoader().setPath('assets/textures/Yokohama/')
    const images = [
       // 'X|Y|Z축 양의 방향 이미지','X|Y|Z 축 음의 방향 이미지'
        'posx.jpg','negx.jpg',
        'posy.jpg','negy.jpg',
        'posz.jpg','negz.jpg'
    ]
    //box 생성
    const geometry = new THREE.BoxGeometry(5000,5000,5000)
    const materials = images.map(image => new THREE.MeshBasicMaterial({
        map:textureLoader.load(image),
        side: THREE.BackSide,
    }))

    const skybox = new THREE.Mesh(geometry, materials)
    scene.add(skybox)
    */

    // const pointLight = new THREE.PointLight(0xffffff, 0.8)
    // scene.add(pointLight)

    /**
     * 큐브맵 텍스쳐 생성을 위한 3차원 공간 표현 2
     */
    /*
    const cubeTextureLoader = new THREE.CubeTextureLoader().setPath('assets/textures/Yokohama/')
    const images = [
        // 'X|Y|Z축 양의 방향 이미지','X|Y|Z 축 음의 방향 이미지'
        'posx.jpg','negx.jpg',
        'posy.jpg','negy.jpg',
        'posz.jpg','negz.jpg'
    ]
    const cubeTexture = cubeTextureLoader.load(images)
    scene.background = cubeTexture
    */

    /**
     * 360 파노라마 이미지를 이용한 3d 공간 구현
     */
    controls.enableZoom = false
    controls.enableDamping = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5


    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('./assets/textures/surreal_pigs_farms.jpg')
    texture.mapping = THREE.EquirectangularReflectionMapping //파노라마 이미지를 큐브에 매핑하는 옵션
    scene.background = texture;

    //spear
    const sphereGeometry = new THREE.SphereGeometry(30,50,50)
    const sphereMaterial = new THREE.MeshBasicMaterial({
        envMap: texture, //큐브 텍스쳐를 반사시킨다.
        reflectivity:1,
        // color:0xffff00
    })

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(sphere)
    // 반사,굴절 변화도 테스트
    gui
        .add(texture, 'mapping',{
            Reflection: THREE.EquirectangularReflectionMapping,
            Refraction: THREE.EquirectangularRefractionMapping
        })
        .onChange(()=>{
            sphereMaterial.needsUpdate = true
        })

    gui
        .add(sphereMaterial, 'reflectivity')
        .min(0)
        .max(1)
        .step(0.01)

    gui
        .add(sphereMaterial, 'refractionRatio')
        .min(0)
        .max(1)
        .step(0.01)

    render();

    function render() {
        renderer.render(scene, camera);
        controls.update() // 컨트롤의 설정값을 매프레임마다 업데이트하기 위해
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
