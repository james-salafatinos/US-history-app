//class{} takes in a position and an entity and moves the entity to the position via a-star pathfinding
//_filter() filter on all entities that have "mover" component (components are user data)
//_calculate() calculates the path from the entity to the position
//update() moves the entity along the path over time
class Grid {
  constructor() {
    this.grid = [];
  }
  _refreshGameGrid(entities) {
    return this.grid;
  }
}

class FlagMovementSystem {
  constructor(scene) {
    this.scene = scene;
  }

  _filter(entities) {
    //Entities must be an array
    // console.log(entities);
    let filtered_entities = entities.filter((entity) => {
      if (entity.mesh != null) {
        return entity.mesh.userData.isMover;
      }
    });

    return filtered_entities;
  }

  _calculate(entityPos, gameGrid, flagPos) {
    //calculate the path from the entity to the flag
    //return the path
    //
  }

  addTo(systems) {
    systems.push(this);
  }

  update(entities) {
    let filtered_entities = this._filter(entities);
    // console.log(filtered_entities);

    for (let i = 0; i < filtered_entities.length; i++) {}
  }
}

export { FlagMovementSystem };
