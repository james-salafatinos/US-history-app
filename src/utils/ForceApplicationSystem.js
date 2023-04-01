import * as THREE from "/modules/three.module.js";
class ForceApplicationSystem {
  constructor(scene) {
    this.scene = scene;
  }

  _filter(entities) {
    //Entities must be an array
    // console.log(entities);
    let filtered_entities = entities.filter((entity) => {
      if (entity.mesh != null) {
        return entity.mesh.userData.hasGravity;
      }
    });

    return filtered_entities;
  }

  addTo(systems) {
    systems.push(this);
  }

  update(entities) {
    let filtered_entities = this._filter(entities);

    //update userData.velocity and mesh.position based on userData.acceleration using eulerian integration
    for (let i = 0; i < filtered_entities.length; i++) {
      //add the force to the velocity
      filtered_entities[i].mesh.userData.velocity.add(
        filtered_entities[i].mesh.userData.acceleration
      );
      filtered_entities[i].mesh.position.add(
        filtered_entities[i].mesh.userData.velocity
      );
      // console.log(filtered_entities[i].mesh.userData.velocity);

      //reset acceleration to 0
      filtered_entities[i].mesh.userData.acceleration.x = 0;
      filtered_entities[i].mesh.userData.acceleration.y = 0;
      filtered_entities[i].mesh.userData.acceleration.z = 0;
    }
  }
}

export { ForceApplicationSystem };
