import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';

import {TextGeometry} from 'three/examples/jsm/geometries/Textgeometry'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {GUI} from "three/addons/libs/lil-gui.module.min.js";

window.addEventListener('load', function () {
    init();
});

async function init() {
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
        500,
    );

    camera.position.z = 5;

    // OrbitControls: 테스트용 카메라 설정
    new OrbitControls(camera, renderer.domElement)

    // AmbientLight
    const ambientLight = new THREE.AmbientLight('#363631', 1) // 색상, 강도
    scene.add(ambientLight)

    // PointLight
    const pointLight = new THREE.PointLight('#ffffff', 0.9)
    pointLight.position.set(3, 0,2)
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
    scene.add(pointLight, pointLightHelper)

    gui.add(pointLight.position, 'x').min(-3).max(3).step(0.1)


    //fontLoader
    const fontLoader = new FontLoader()
    const font = await fontLoader.loadAsync('./assets/fonts/The Jamsil 3 Regular_regular.json')

    const textGeometry = new TextGeometry('안녕, 친구들.',
        {
            font,
            size: 0.5,
            height: 0.1
        }
    )
    const textMaterial = new THREE.MeshPhongMaterial({color: '#488fc9'})

    const text = new THREE.Mesh(textGeometry, textMaterial)
    textGeometry.computeBoundingBox()
    scene.add(text)
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x)* 0.5,
    //     - (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y)* 0.5,
    //     - (textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z)* 0.5,
    //
    // )
    textGeometry.center()
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
