import * as THREE from "/modules/three.module.js";
class Plane {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.init();
  }

  init() {
    const geometry = new THREE.BoxGeometry(250, 1, 250);
    const material = new THREE.MeshPhongMaterial({ color: 0xffff66 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -0.5;
    //has shadow

    this.mesh = mesh;
    this.mesh.userData.isGround = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
    return this;
  }

  addTo(entities) {
    entities.push(this);
    return this;
  }
}

export { Plane };
