import * as THREE from "/modules/three.module.js";
class ComplexPlot {

    constructor(scene, window) {
      this.scene = scene;
      this.window = window;

      this.points = [];
      this.line = null;
      this.time = 0;
      this.frequency = 1;
      this.amplitude = 1;
      this.phase = 0;
      this.gridSize = 50;
      this.gridSpacing = .5;
      this.speed = 0.5;
      this.slitWidth = 0.2; // Width of each slit
      this.slitSeparation = 2; // Distance between the slits
      this.centralMaxima = 0.01; // Intensity of the central maximum
      this.interference = true; // Enable/disable interference effects

      this.init();
  }

  init() {
    // Create a grid of points
    for (let i = -this.gridSize; i <= this.gridSize; i += this.gridSpacing) {
      for (let j = -this.gridSize; j <= this.gridSize; j += this.gridSpacing) {
        const x = i;
        const z = j;
        const y = this.getWaveFunction(x, z, this.time) + 25;

        const point = new THREE.Vector3(x, y, z);
        this.points.push(point);
      }
    }

    // Create a line geometry from the points
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);

    // Create a line material
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Create the line object
    this.line = new THREE.Line(geometry, material);

    // Add the line to the scene
    this.scene.add(this.line);
  }

  getWaveFunction(x, y, t) {
    // Calculate the wave function
    const k = 2 * Math.PI / this.slitSeparation;
    const k1 = k * this.slitWidth / 2;
    const k2 = k * (this.slitSeparation - this.slitWidth) / 2;
    const psi1 = this.amplitude * Math.sin(k1 * (x - this.slitSeparation / 2) + this.phase);
    const psi2 = this.amplitude * Math.sin(k2 * (x + this.slitSeparation / 2) + this.phase);
    const psi = this.centralMaxima * (psi1 + psi2);

    if (this.interference) {
      const interference = 2 * Math.cos(k * x) * Math.cos(k * this.slitSeparation / 2);
      return psi * interference * Math.sin(t * this.speed);
    }

    // Return the probability density (squared amplitude)
    return psi * psi * Math.sin(t * this.speed);
  }

  update() {
    this.time += 0.1;

    // Update the z-coordinate of each point
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const x = point.x;
      const y = point.y;
      const z = this.getWaveFunction(x, y, this.time);
      point.z = z;
    }

    // Update the line geometry
    this.line.geometry.setFromPoints(this.points);
  }

  
  

  addTo(entities) {
    entities.push(this);
    return this;
  }
}
export { ComplexPlot };
