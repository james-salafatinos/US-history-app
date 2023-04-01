//External Libraries
import * as THREE from "/modules/three.module.js";

import Stats from "/modules/stats.module.js";
import { OrbitControls } from "/modules/orbitControls.module.js";

//Internal Libraries
import { Cube } from "/utils/Cube.js";
import { Plane } from "/utils/Plane.js";
import { Mover } from "/utils/Mover.js";
import { FlagPlacer } from "/utils/FlagPlacer.js";

import { GravitySystem } from "/utils/GravitySystem.js";
import { ForceApplicationSystem } from "/utils/ForceApplicationSystem.js";
import { FlagMovementSystem } from "/utils/FlagMovementSystem.js";

import { ComplexPlot } from "/utils/ComplexPlot.js";

//THREE JS
let camera, scene, renderer, controls, stats;
let entities = [];
let systems = [];
console.log(math)

let complexPlot;

init();
animate();

function init() {
  let createScene = function () {
    scene = new THREE.Scene();
    var loader = new THREE.TextureLoader(),
      texture = loader.load("/static/bg.jpg");
    scene.background = texture;
    scene.fog = new THREE.Fog(0x102234, 700, 1000);
  };
  createScene();

  let createLights = function () {
    // LIGHTS
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);

    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-50, 50, -50);
    scene.add(light2);
    //casts shadow
    light2.castShadow = true;
    light2.shadow.mapSize.width = 2 ** 14;
    light2.shadow.mapSize.height = 2 ** 14;
    light2.shadow.camera.near = 0.1;
    light2.shadow.camera.far = 1000;
    light2.shadow.camera.left = -500;
    light2.shadow.camera.bottom = -500;
    light2.shadow.camera.right = 500;
    light2.shadow.camera.top = 500;

    // const helper = new THREE.DirectionalLightHelper(light2, 5);
    // scene.add(helper);
  };
  createLights();

  let createStats = function () {
    stats = new Stats();
    container.appendChild(stats.dom);
  };
  createStats();

  let createRenderer = function () {
    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement).setAttribute("id", "canvas");
  };
  createRenderer();

  let createCamera = function () {
    //Camera
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.y = 30;
    camera.position.z = 150;
    camera.position.x = 10;
  };
  createCamera();

  //App Manager
  //##############################################################################

  //Mirror

  // Controls
  controls = new OrbitControls(camera, canvas);

  //Entities
  let plane = new Plane(scene).addTo(entities);
  let cube = new Cube(scene).addTo(entities);
  let mover = new Mover(scene).addTo(entities);

  let gravity = new GravitySystem(scene).addTo(systems);
  let forceApplication = new ForceApplicationSystem(scene).addTo(systems);
  let flagMovementSystem = new FlagMovementSystem(scene).addTo(systems);

  complexPlot = new ComplexPlot(scene).addTo(systems);


  let flagPlacer = new FlagPlacer(window, scene, camera).addTo(entities);
  console.log(flagPlacer);
}
function animate() {
  //Frame Start up
  requestAnimationFrame(animate);

  controls.update();

  complexPlot.update();

  for (const system of systems) {
    system.update(entities);
  }

  stats.update();
  renderer.render(scene, camera);
}
