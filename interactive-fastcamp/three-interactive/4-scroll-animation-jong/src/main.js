import * as THREE from 'three';
import GUI from "lil-gui";

window.addEventListener('load', function () {
    init();
});

function init() {
    const gui = new GUI();
    const canvas = document.querySelector('#canvas')
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas,
    });

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

    camera.position.set(0,25,150)

    const waveGeometry = new THREE.PlaneGeometry(1500,1500,150,150)
    const waveMaterial = new THREE.MeshStandardMaterial({
        // wireframe: true,
        color: '#00ffff'
    })

    const wave = new THREE.Mesh(waveGeometry, waveMaterial)
     wave.rotation.x = -Math.PI / 2

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

    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(15,15,15)
    scene.add(pointLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(-15,15,15)
    scene.add(directionalLight)

    //THREE.js에서 사용되는 절대 시간 Clock함수
    const clock = new THREE.Clock();

    wave.update = ()=>{
        const elapsedTime = clock.getElapsedTime();
        console.log('time', elapsedTime)
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
        wave.update();
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
