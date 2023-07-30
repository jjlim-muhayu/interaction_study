import * as THREE from 'three';

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
    // scene.background = new THREE.Color('orange') // scene컬러 배경 설정은 최상의 레이어와 색상주는것과 같은 개념
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('https://previews.123rf.com/images/rutchapong/rutchapong1607/rutchapong160700028/62443595-%ED%91%B8%EB%A5%B8-%ED%95%98%EB%8A%98%EA%B3%BC-%EA%B5%AC%EB%A6%84%EC%9E%85%EB%8B%88%EB%8B%A4-%ED%95%98%EB%8A%98%EA%B3%BC-%EA%B5%AC%EB%A6%84-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-%ED%95%98%EB%8A%98-%EB%B0%B0%EA%B2%BD.jpg')
    scene.background = texture;
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500,
    );

    camera.position.z = 5;

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
