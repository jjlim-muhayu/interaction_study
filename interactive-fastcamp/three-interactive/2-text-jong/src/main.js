import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';

import {TextGeometry} from 'three/examples/jsm/geometries/Textgeometry'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {GUI} from "three/addons/libs/lil-gui.module.min.js";

window.addEventListener('load', function () {
    init();
});

async function init() {
    const gui = new GUI()
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });

    renderer.shadowMap.enabled = true; // scene에서 그림자 사용 ㅁ설정

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500,
    );

    camera.position.set(0,1, 5)

    // OrbitControls: 테스트용 카메라 설정
    new OrbitControls(camera, renderer.domElement)

    /**
     * 배경
     * @type {PlaneGeometry}
     */
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000) /* 배경 크기 정의 */
    const planeMaterial = new THREE.MeshPhongMaterial({color: 0x000000})
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.position.z = -10

    plane.receiveShadow = true; // 피사체 그림자

    scene.add(plane)


    /**
     * 폰트 사용
     * @type {FontLoader}
     */
    //fontLoader
    const fontLoader = new FontLoader()
    const font = await fontLoader.loadAsync('./assets/fonts/The Jamsil 3 Regular_regular.json')

    const textGeometry = new TextGeometry('안녕, 친구들. Three.Js Study',
        {
            font,
            size: 0.5,
            height: 0.1,
            bevelEnabled: true,
            bevelSegments: 3,
            bevelSize:0.02,
            bevelThickness: 0.02,
        }
    )
    const textMaterial = new THREE.MeshPhongMaterial(/*{color: '#488fc9'}*/)
    const text = new THREE.Mesh(textGeometry, textMaterial)
    textGeometry.computeBoundingBox()

    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x)* 0.5,
    //     - (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y)* 0.5,
    //     - (textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z)* 0.5,
    //
    // )
    // 대상의 그림자를 생성하기 위해 조명들에게 대상의 쉐이프 정보를 전파
    text.castShadow = true;
    textGeometry.center()

    // texture
    const textureLoader = new THREE.TextureLoader().setPath('./assets/textures/')
    const textTexture = textureLoader.load('holographic.jpeg')
    textMaterial.map = textTexture;
    scene.add(text)


    /*fontLoader.load(
        './assets/fonts/The Jamsil 3 Regular_regular.json',
        font => {
            const textGeometry = new TextGeometry('안녕 친구들',
                {
                    font,
                    size: 0.5,
                    height: 0.1
                }
            )
            const textMaterial = new THREE.MeshPhongMaterial({color: 0x00c896})

            const text = new THREE.Mesh(textGeometry, textMaterial)

            scene.add(text)
        }
    )*/

    // AmbientLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2) // 색상, 강도
    scene.add(ambientLight)

    /**
     * 스팟 조명
     * @type {SpotLight}
     */
    const spotLight = new THREE.SpotLight(0xffffff, 2.5, 30, Math.PI * 0.15, 0.2, 0.5)

    // 스폿조명이 피사체의 그림장를 벽에 생성할 수 있도록 그림자 설정
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.radius = 10;

    spotLight.position.set(0,0,3)
    spotLight.target.position.set(0,0,-3)  // spotLight가 비추는 타켓 설정

    const spotLightTexture = textureLoader.load('gradient.jpg');

    spotLightTexture.encoding = THREE.sRGBEncoding;
    // THREE.LinearEncoding; // 어두운 부분이 좀 더 밝게 처리됨
    spotLight.map = spotLightTexture;
    scene.add(spotLight, spotLight.target)

    /**
     * OrbitControls
     * @type {g}
     */
    const spotLightFolder = gui.addFolder('spotLight')
    spotLightFolder
        .add(spotLight, 'angle')
        .min(0)
        .max(Math.PI /2)
        .step(0.01)

    spotLightFolder
        .add(spotLight.position,'z')
        .min(1)
        .max(10)
        .step(0.01)
        .name('position.z')

    spotLightFolder
        .add(spotLight, 'distance') /* 빛이 도달하는 거리 */
        .min(1)
        .max(30)
        .step(0.01)

    spotLightFolder
        .add(spotLight, 'decay') /* 빛이 퍼지는 범위 */
        .min(0)
        .max(10)
        .step(0.01)

    spotLightFolder
        .add(spotLight, 'penumbra') /* 스팟빛의 경계면의 부드러움 처리 */
        .min(0)
        .max(1)
        .step(0.01)

    spotLightFolder
        .add(spotLight.shadow, 'radius')
        .min(1)
        .max(20)
        .step(0.01)
        .name('shadow.radius');

    /** Effects */
    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);

    composer.addPass(renderPass);

    // 레이저 광처리 효과
    const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 1, 0);

    composer.addPass(unrealBloomPass);

    const unrealBloomPassFolder = gui.addFolder('UnrealBloomPass');

    unrealBloomPassFolder
        .add(unrealBloomPass, 'strength')
        .min(0)
        .max(3)
        .step(0.01);

    unrealBloomPassFolder
        .add(unrealBloomPass, 'radius')
        .min(0)
        .max(1)
        .step(0.01);

    unrealBloomPassFolder
        .add(unrealBloomPass, 'threshold')
        .min(0)
        .max(1)
        .step(0.01);

    // const spotLightHelper = new THREE.SpotLightHelper(spotLight)
    // scene.add(spotLightHelper)

    // 이벤트 추가
    window.addEventListener('mousemove', (e)=>{
        // 마우스 x,y좌표/창의 가로, 세로 폭을 나눈 비율로 좌표 처리
        // 각각 0.5를 빼주면 데카르트 좌료로 변환된 X, Y 좌료값을 얻을 수 있다.
        const x = (e.clientX / window.innerWidth -  0.5) * 5
        // Y축 값 보정:
        // three.js에서 Y좌표는 캔바스 중심 기준으로 상단으로 이동시 양수, 윈도우 창에서는 좌상단 기준으로 하단으로 이동하면 증가되므로
        // 마이너스 단위를 붙여서 마우스 이동값을 보정한다.
        const y = -(e.clientY / window.innerHeight -  0.5) * 5
        spotLight.target.position.set(x,y, -3)
        //console.log('mousemove', spotLight, x, y)
    })

    /* PointLight */
    //const pointLight = new THREE.PointLight('#ffffff', 0.9)
    //pointLight.position.set(3, 0,2)
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
    //scene.add(pointLight,)
    //gui.add(pointLight.position, 'x').min(-3).max(3).step(0.1)

    render();

    function render() {
        composer.render(scene, camera);

        // spotLightHelper.update()

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
