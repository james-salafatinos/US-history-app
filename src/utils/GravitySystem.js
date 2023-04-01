import * as THREE from "/modules/three.module.js";
class GravitySystem {
  constructor(scene) {
    this.scene = scene;
    this.params = {
      gravity: -0.0098,
    };
  }

  _filter(entities) {
    //Entities must be an array
    let filtered_entities = entities.filter((entity) => {
      if (entity.mesh != null) {
        return entity.mesh.userData.hasGravity;
      }
    });
    return filtered_entities;
  }

  _calculateForces(filtered_entities) {
    //creates an array of forces equal to 0
    let forces = new Array(filtered_entities.length).fill(
      new THREE.Vector3(0, this.params.gravity, 0)
    );
    return forces;
  }

  _checkIfGrounded(filtered_entities) {
    for (let i = 0; i < filtered_entities.length; i++) {
      if (filtered_entities[i].mesh.position.y <= 0) {
        filtered_entities[i].mesh.userData.velocity.y = 0;
        filtered_entities[i].mesh.position.y = 0;
      }
    }
  }

  addTo(systems) {
    systems.push(this);
  }

  update(entities) {
    let filtered_entities = this._filter(entities);
    let forces = this._calculateForces(filtered_entities);
    //loop through forces array and apply the force at that indext to the entity at that index
    for (let i = 0; i < forces.length; i++) {
      //if he user data doesnt have velocity, create it
      if (!filtered_entities[i].mesh.userData.velocity) {
        filtered_entities[i].mesh.userData.velocity = new THREE.Vector3(
          0,
          0,
          0
        );
      }

      if (
        filtered_entities[i].mesh.position.y -
          filtered_entities[i].mesh.geometry.parameters.height / 2 <=
        0
      ) {
        filtered_entities[i].mesh.userData.velocity.y = 0;
        filtered_entities[i].mesh.position.y =
          0 + filtered_entities[i].mesh.geometry.parameters.height / 2;
        return;
      }

      //add the force to the velocity
      filtered_entities[i].mesh.userData.velocity.add(forces[i]);
    }
  }
}

export { GravitySystem };
