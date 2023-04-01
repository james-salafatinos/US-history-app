import * as THREE from "/modules/three.module.js";
class Cube {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.init();
  }

  init() {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(15, 50, 0);
    this.mesh = mesh;
    this.mesh.userData.hasGravity = true;
    this.mesh.userData.hasForces = true;
    this.mesh.userData.velocity = new THREE.Vector3(0, 0, 0);
    this.mesh.userData.acceleration = new THREE.Vector3(0, 0, 0);
    this.mesh.userData.mass = 1;

    //has shadow
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);
    return this;
  }

  addTo(entities) {
    entities.push(this);
    return this;
  }
}

export { Cube };
