import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {GUI} from "three/addons/libs/lil-gui.module.min.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

window.addEventListener('load', function () {
    init();
});

async function init() {
    const control = new GUI()
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding; //SRGB 컬러프로파일을 사용, 어두운 영역을 좀더 자연스럽게
    renderer.shadowMap.enabled = true

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500,
    );

    camera.position.set(0, 5, 20)

    //orbitControll
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // 컨트롤의 가중치를 부여하는 데 사용할 수있는 댐핑 (관성)을 활성화
    controls.minDistance = 15
    controls.maxDistgance = 25
    // 수직으로 궤도를 얼마나 돌 수 있는지 하한을 설정합니다. 0 부터 Math.PI radians 까지 범위를 가질 수 있습니다. 기본값은 0 입니다.
    controls.minPolarAngle = Math.PI / 4
    controls.maxPolarAngle = Math.PI / 3
    controls.zomm = 2

    const progressBar = document.querySelector('#progress-bar')
    const progressBarContainer = document.querySelector('#progress-bar-container')


    //로딩매니저
    const loadingManager = new THREE.LoadingManager()

    //3d 모델 불러오기
    const gltfLoader = new GLTFLoader(loadingManager)
    loadingManager.onProgress = ((url, loaded, total) => {
        progressBar.value = (loaded / total) * 100
        if (progressBar.value === 100) progressBarContainer.style.display = "none"
    })
    const gltf = await gltfLoader.loadAsync('./models/character.gltf')
    console.log('gltf', gltf)

    const model = gltf.scene
    model.scale.set(0.1, 0.1, 0.1)
    model.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = true
        }
    })
    scene.add(model)
    camera.lookAt(model.position) //카메라의 시점을 모델에 맞춘다.

    // 애니메이션 실행
    // three.js에서 제공하는 애니메이션 제어용 인스턴스
    const mixer = new THREE.AnimationMixer(model)
    const buttons = document.querySelector('.actions')
    let currentAction;
    const combatAnimations = gltf.animations.slice(0, 5)
    const dancingAnimations = gltf.animations.slice(5)

    for (let i = 0; i < combatAnimations.length; i++) {
        const button = document.createElement('button')
        const animation = combatAnimations[i]
        button.innerText = animation.name
        buttons.appendChild(button)

        button.addEventListener('click', () => {
            const previousAction = currentAction
            currentAction = mixer.clipAction(animation)

            if (previousAction !== currentAction) {
                previousAction.fadeOut(0.5)
                currentAction.reset().fadeIn(0.5).play()
            }
        })
    }

    const hasAnimation = gltf.animations.length !== 0
    if (hasAnimation) {
        currentAction = mixer.clipAction(gltf.animations[0])
        currentAction.play()
    }

    const raycaster = new THREE.Raycaster() // 클릭한 지점에서 광선을 이용해 scene내에서 광선과 교차되는 아이템 정보를 넘겨준다.
    const pointer = new THREE.Vector2()  //2차원 벡터 정보
    const clock = new THREE.Clock()

    // 그림자 만들기
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000)
    const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -7.5
    plane.receiveShadow = true
    scene.add(plane)

    const spotLight = new THREE.SpotLight(0xffffff, 1.5, 30, Math.PI * 0.15, 0.5, 0.5)
    spotLight.position.set(0, 20, 0)
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.radius = 9
    scene.add(spotLight)

    // 기본 조명추가
    //hemisphere 조명은 그림자를 표현할 수 없다.
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x3333333)
    hemisphereLight.position.set(0, 20, 10)
    scene.add(hemisphereLight) //화면에 추가한 모델이 카메라 화각보다 클경우이다.

    render();

    function render() {
        const delta = clock.getDelta()
        mixer.update(delta)

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

    window.addEventListener('pointerdown', (event) => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = -(event.clientY / window.innerHeight - 0.5) * 2;

        raycaster.setFromCamera(pointer, camera)

        // 클릭한 지점에 있는 아이템 체크
        const intersects = raycaster.intersectObjects(scene.children)
        console.log('마우스 클릭한 지점에서 광선과 교차하는 아이템:', intersects)

        const object = intersects[0]?.object
        // console.log('currentAction', currentAction, dancingAnimations)

        if (object?.name === 'Ch46') {
            const previousAction = currentAction
            const index = Math.round(Math.random() * (dancingAnimations.length - 1))
            currentAction = mixer.clipAction(dancingAnimations[index])

            currentAction.loop  = THREE.LoopOnce; //애니메이션을 한번만 진행
            currentAction.clampWhenFinished  = true //애니메이션 끝나면 마지막 프레임에서 멈춘다.
            if (previousAction !== currentAction) {
                previousAction.fadeOut(0.5)
                currentAction.reset().fadeIn(0.5).play()
            }

            //object.material.color.set(0x00aacc)

            // 선택한 애니메이션이 끝나면 다시 대기상태의 애니메이션을 실행
            mixer.addEventListener('finished', ()=>{
                const previousAction = currentAction
                currentAction = mixer.clipAction(combatAnimations[0])

                previousAction.fadeOut(0.5)
                currentAction.reset().fadeIn(0.5).play()
            })
        }
    })
}
