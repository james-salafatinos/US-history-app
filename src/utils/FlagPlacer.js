import * as THREE from "/modules/three.module.js";
class FlagPlacer {
  constructor(window, scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.mesh = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init(window);
  }

  init(window) {
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // console.log(this.mouse);
    });
    window.addEventListener("dblclick", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children);
      if (intersects.length > 0) {
        //write a loop to go through each intersect check if   this.mesh.userData.isGround = true; then place the flag
        for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object.userData.isGround) {
            const flag = new THREE.Mesh(
              new THREE.BoxGeometry(1, 10, 1),
              new THREE.MeshPhongMaterial({ color: 0x00ff00 })
            );
            flag.position.copy(intersects[0].point);
            flag.position.y += 5;
            this.scene.add(flag);

            break;
          }
        }
      }
    });
  }

  addTo(entities) {
    entities.push(this);
    return this;
  }
}

export { FlagPlacer };
