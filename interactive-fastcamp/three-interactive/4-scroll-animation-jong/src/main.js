import * as THREE from 'three';
import GUI from "lil-gui";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {gsap} from 'gsap'
import {ScrollTrigger} from "gsap/ScrollTrigger";

window.addEventListener('load', function () {
    init();
});

async function init() {
    gsap.registerPlugin(ScrollTrigger) // 스크롤 플러그인 등록

    const params = {
        waveColor: '#00ffff',
        backgroundColor: '#ffffff',
        fogColor: '#f0f0f0'
    }
    const gui = new GUI();
    const canvas = document.querySelector('#canvas')
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas,
    });

    // 쉐도우 맵을 사용
    renderer.shadowMap.enabled = true

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // 안개정의
    scene.fog = new THREE.Fog(
        0xf9f9f9, 0.1, 500
    )
    // 안개의 범위

    gui.add(scene.fog, 'near')
        .min(0)
        .max(100)
        .step(0.1)
    gui.add(scene.fog, 'far')
        .min(100)
        .max(500)
        .step(0.1)

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500,
    );

    camera.position.set(0, 25, 150)

    const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150)
    const waveMaterial = new THREE.MeshStandardMaterial({
        // wireframe: true,
        color: params.waveColor
    })

    const wave = new THREE.Mesh(waveGeometry, waveMaterial)
    wave.rotation.x = -Math.PI / 2
    wave.receiveShadow = true // 모델의 그림자가 닿는 대상

    //z좌표 랜덤하게 조정하기
    const waveHeight = 2.5
    const initialZPositions = []
    // 방법1
    // for (let i = 0; i < waveGeometry.attributes.position.array.length; i += 3) {
    //     waveGeometry.attributes.position.array[i + 2] += (Math.random() - 0.5) * waveHeight
    // }
    //console.log('waveGeometry', waveGeometry.attributes.position.array)
    //방법2
    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
        const z = waveGeometry.attributes.position.getZ(i) + (Math.random() - 0.5) * waveHeight
        waveGeometry.attributes.position.setZ(i, z)
        //설정했던 z축 값
        initialZPositions.push(z)
    }
    scene.add(wave)

    // 3d model추가
    const gltfLoader = new GLTFLoader()
    const gltf = await gltfLoader.loadAsync('./models/classic_bathtub/scene.gltf')
    const myModel = gltf.scene
    myModel.castShadow = true
    myModel.traverse((obj) => {
        // console.log('objMesh', obj.isMesh, obj )
        if (obj.isMesh) {
            obj.castShadow = true;
        }
    })
    myModel.update = function () {
        const elapsedTime = clock.getElapsedTime()
        myModel.position.y = Math.sin(elapsedTime * 3)
    }
    myModel.rotation.set(0.35, Math.PI * 0.25, 0)
    myModel.position.set(0, -20, 50)
    myModel.scale.set(20, 20, 20)
    scene.add(myModel)

    // light 설정
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(15, 15, 15)
    pointLight.castShadow = true
    pointLight.shadow.mapSize.width = 1024
    pointLight.shadow.mapSize.height = 1024
    pointLight.shadow.radius = 10
    scene.add(pointLight)


    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(-15, 15, 15)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.radius = 10 // 그림자 끝의 블러효과
    scene.add(directionalLight)

    //THREE.js에서 사용되는 절대 시간 Clock함수, 모니터의 프레임수를 맞추기 위한 용도
    const clock = new THREE.Clock();

    wave.update = () => {
        const elapsedTime = clock.getElapsedTime();
        const arr = waveGeometry.attributes.position.count //실제 정점의 갯수
        //z좌표값만 얻어내면 된다.
        for (let i = 0; i < arr; i++) {
            //waveGeometry.attributes.position.array[i + 2] += elapsedTime * Math.sin(elapsedTime  * 3);
            //sin곡선을 이용하여 높이가 +1 ~ -1에서 반복하도록 한다.
            const z = initialZPositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight
            waveGeometry.attributes.position.setZ(i, z)
        }
        // THREE.js에 정점위치가 바꼈다는것을 실시간(매프레임마다)으로 알려줘야 함.
        waveGeometry.attributes.position.needsUpdate = true
    }

    render();

    function render() {
        myModel.update()
        wave.update();

        camera.lookAt(myModel.position) // 카메라 시점을 모델에 고정

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

    //scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.wrapper',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
        }
    })
    tl
        .to(params, {
            waveColor: '#ff0000',
            onUpdate: () => {
                // 웹의 HashColor는 THREE.Color 인스턴스로 변환하여 적용
                waveMaterial.color = new THREE.Color(params.waveColor)
            },
            duration: 1.5,
        })
        .to(params, {
            backgroundColor: '#2a2a2a',
            onUpdate: () => {
                // 웹의 HashColor는 THREE.Color 인스턴스로 변환하여 적용
                scene.background = new THREE.Color(params.backgroundColor)
            },
            duration: 1.5,
        }, '<')
        .to(params, {
            fogColor: '#2f2f2f',
            onUpdate: () => {
                // 웹의 HashColor는 THREE.Color 인스턴스로 변환하여 적용
                scene.fog.color = new THREE.Color(params.fogColor)
            },
            duration: 1.5,
        }, '<')
        .to(camera.position, {
                x: 100,
                z: -50,
                duration: 1,
            },
        )
        .to(camera.position, {
            z: 150, duration: 1,
        })
        .to(camera.position, {
            x: 50,
            y: 25,
            z: 100,
            duration: 1,
        })
        .to(camera.position, {
            x: 0,
            y: 50,
            z: 300,
            duration: 3,
        })

    // title 효과
    gsap.to('.title', {
        opacity:0,
        scrollTrigger: {
            trigger:'.wrapper',
            scrub: true,
            pin: true,
            end:'+=1000'
        }
    })
}
