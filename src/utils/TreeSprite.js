import * as THREE from "/modules/three.module.js";

class TreeSprite {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.init();
  }

  init() {
    const loader = new THREE.TextureLoader();
    var treetexture = loader.load("/static/tree.jpg");
    treetexture.magFilter = THREE.NearestFilter;
    var treematerial = new THREE.SpriteMaterial({ map: treetexture });
    var treesprite = new THREE.Sprite(treematerial);
    treesprite.scale.set(10, 10, 10);
    treesprite.position.set(0, 5, 0);

    this.mesh = treesprite;
    this.scene.add(this.mesh);
  }
  update() {
    this.mesh.position.x += Math.sin(Date.now() / 1000) / 10;
    this.mesh.position.y += Math.cos(Date.now() / 1000) / 10;
  }
  addTo(entities) {
    entities.push(this);
  }
}

export { TreeSprite };
