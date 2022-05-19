import * as THREE from "/threejs-lensflare/build/three.module.js";
import { FlyControls } from "/threejs-lensflare/jsm/controls/FlyControls.js";
import { Lensflare, LensflareElement } from "/threejs-lensflare/jsm/objects/Lensflare.js";

const domElement = document.querySelector("#myCanvas");

let camera, scene, renderer;
let controls;

const clock = new THREE.Clock();


const init = () => {
    const size = 250;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // カメラ
    camera = new THREE.PerspectiveCamera(
        40,
        width / height,
        1,
        15000
    );
    camera.position.x = 250;

    // シーン
    scene = new THREE.Scene();

    
    const geometry = new THREE.TorusGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 50
    })

    for(let i = 0; i < 2500; i++) {
        const meth = new THREE.Mesh(geometry, material);

        meth.position.x = 8000 * (2.0 * Math.random() - 1.0);
        meth.position.y = 8000 * (2.0 * Math.random() - 1.0);
        meth.position.z = 8000 * (2.0 * Math.random() - 1.0);

        // 回転度合いをランダムに決める
        meth.rotation.x = Math.random() * Math.PI;
        meth.rotation.y = Math.random() * Math.PI;
        meth.rotation.z = Math.random() * Math.PI;

        scene.add(meth);
    }

    // 平行光源
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.03);
    scene.add(dirLight);

    const textureLoader = new THREE.TextureLoader();

    const textureFlare = textureLoader.load("./LensFlare.png");


    // ポイント光源
    const addLight = (h, s, l, x, y, z) => {
        const pointLight = new THREE.PointLight(0xffffff, 1.5, 2000);
        pointLight.color.setHSL(h, s, l);
        pointLight.position.set(x, y, z);
        scene.add(pointLight);

        const lensflare = new Lensflare();
        lensflare.addElement(
          new LensflareElement(textureFlare, 700, 0, pointLight.color)
        );
        scene.add(lensflare);
    }

    addLight(0.08, 0.3, 0.9, 0, 0, -1000);

    // レンダラー
    renderer = new THREE.WebGLRenderer({
        canvas: domElement
    })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // マウス操作
    controls = new FlyControls(camera, domElement);
    controls.movementSpeed = 2500;
    controls.rollSpeed = Math.PI / 20;
    
    animate();
}

const animate = () => {
    requestAnimationFrame(animate);

    const delta = clock.getDelta()
    controls.update(delta);
    renderer.render(scene, camera);
}


init();

onResize();
// リサイズイベント発生時に実行
window.addEventListener('resize', onResize);

function onResize() {
  // サイズを取得
  const width = window.innerWidth;
  const height = window.innerHeight;

  // レンダラーのサイズを調整する
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // カメラのアスペクト比を正す
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
