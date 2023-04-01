import * as THREE from "/modules/three.module.js";
class Mover {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.init();
  }

  init() {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshPhongMaterial({ color: 0xf3343f });
    const mesh = new THREE.Mesh(geometry, material);

    this.mesh = mesh;

    //Characterists of the mover
    this.mesh.userData.hasGravity = true;
    this.mesh.userData.hasForces = true;
    this.mesh.userData.isMover = true;
    this.mesh.userData.velocity = new THREE.Vector3(0, 0, 0);
    this.mesh.userData.acceleration = new THREE.Vector3(0, 0, 0);
    this.mesh.userData.mass = 1;
    //has shadow
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    mesh.position.set(30, 0, 0);

    this.scene.add(this.mesh);
    return this;
  }

  addTo(entities) {
    entities.push(this);
    return this;
  }
}

export { Mover };
