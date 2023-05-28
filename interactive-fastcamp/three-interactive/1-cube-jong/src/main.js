import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

window.addEventListener('load', function () {
  init();
});

function init() {
  console.log('init App')
  const options = {
    color : 0x00ffff,
  }
  const renderer = new THREE.WebGLRenderer(
    {
      // alpha: true
      antialias: true,
    }
  );

  // 캔버스 사이즈를 윈도우 사이즈로 설정ㅎ291800
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 본문에 부착
  document.body.appendChild(renderer.domElement)

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  )

  // 궤도 컨트롤
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  // controls.autoRotateSpeed = 10;

  controls.enableDamping = true;
  // controls.dampingFactor = 0.1;
  // controls.enableZoom = true; // 기본값
  // controls.maxDistance = 50;
  // controls.minDistance = 10;
  // controls.enablePan = true; // 기본값
  // controls.maxAzimuthAngle = Math.PI / 2;
  // controls.minAzimuthAngle = Math.PI / 3;
  // const axesHelper = new THREE.AxesHelper(5)
  // scene.add(axesHelper)

  // 아이템, 메터리얼 추가 및 설정
  // const geometry = new THREE.BoxGeometry(2,2,2)
  const cubeGeometry = new THREE.IcosahedronGeometry(1)
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    emissive: 0x111111
    // transparent: true,
    // opacity: 0.5,
    // visible: false,
    // wireframe: true,
    // side: THREE.DoubleSide
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);

  const skeletonGeometry = new THREE.IcosahedronGeometry(2)
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity : 0.2,
    color: 0xaaaaaa,
  })
  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);
  scene.add(skeleton);


  // 카메라 설정
  camera.position.z = 5
  //camera.position.set(3,4, 5);
  //camera.lookAt(cube.position) // 큐브를 정 중앙을 볼 수 있도록 카메라 조정

  // 조명 설정
  const directionalLight = new THREE.DirectionalLight('white', 1)
  // directionalLight.position.set(-1, 2, 3)
  // const ambientLight = new THREE.AmbientLight('white', 0.1) // 그림자 조명
  // ambientLight.position.set(3, 2, 1)

  scene.add(directionalLight)
  // scene.add(ambientLight)

 // clock
  // three가 생성되는 시점기준으로 타임을 카운트
  const clock = new THREE.Clock()

  renderer.render(scene, camera)
  function render(){
    const elapsedTime = clock.getElapsedTime()
    // cube.rotation.x = elapsedTime;
    // cube.rotation.y = elapsedTime;

    // cube.rotation.x = Date.now() / 1000
    // cube.rotation.x = clock.getElapsedTime()
    // cube.rotation.x += clock.getDelta()
    // cube.rotation.y +=0.01
    //cube.position.y = Math.sin(cube.rotation.x)
    //cube.scale.x = Math.cos(cube.rotation.x)

    // skeleton.rotation.x = elapsedTime * 1.5;
    // skeleton.rotation.y = elapsedTime * 1.;

    renderer.render(scene,camera)
    controls.update();
    requestAnimationFrame(render)
  }
  render()

  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight; // 카메라 종횡비 속석
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    controls.update();
  })

  const gui = new GUI ();
  gui.add(cube.position, 'y', -3, 3, 0.1)
  gui.add(cube, 'visible')

  gui.addColor(options, 'color')
    .onChange((value)=>{
      cube.material.color.set(value)
    })
}
