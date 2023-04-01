import * as THREE from "/modules/three.module.js";
class ComplexPlot {

    constructor(scene, window) {
      this.scene = scene;
      this.window = window;
      this.points = [];
      this.line = null;
      this.time = 0;
      this.amplitude = .1;
      this.phase = 0;
      this.gridSize = 16**2;
      this.gridSpacing = 1;
      this.speed = 50;
 

  
      this.init();
    }
  
    init() {
      // Create a grid of points
      for (let i = -this.gridSize; i <= this.gridSize; i += this.gridSpacing) {
        for (let j = -this.gridSize; j <= this.gridSize; j += this.gridSpacing) {
          const x = i;
          const z = j;
          const y = this.getWaveFunction(x, z, this.time);
  
          const point = new THREE.Vector3(x, y, z);
          this.points.push(point);
        }
      }
  
  

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(this.points.length * 3);
      for (let i = 0; i < this.points.length; i++) {
        positions[i * 3] = this.points[i].x;
        positions[i * 3 + 1] = this.points[i].y;
        positions[i * 3 + 2] = this.points[i].z;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Create a line material
      // const material = new THREE.LineBasicMaterial({ color: 0x000000 });
      // Create a color gradient material
    const material = new THREE.LineBasicMaterial({
      vertexColors: true, // Enable per-vertex coloring
    });

    // Create the color gradient
    const colorGradient = [
      new THREE.Color(0xff0000), // Red
      new THREE.Color(0xffff00), // Yellow
      new THREE.Color(0x00ff00), // Green
      new THREE.Color(0x00ffff), // Cyan
      new THREE.Color(0x0000ff), // Blue
      new THREE.Color(0xff00ff), // Magenta
      new THREE.Color(0xff0000), // Red (loop back to start)
    ];
    const colorCount = colorGradient.length - 1;

    // Update the color of each point in the geometry
    const colors = new Float32Array(this.points.length * 3);
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const y = point.y;

      // Map y-coordinate to a color from the gradient
      const t = THREE.MathUtils.clamp(y / this.gridSize, 0, 1);
      const index = Math.floor(t * colorCount);
      const color1 = colorGradient[index];
      const color2 = colorGradient[index + 1];
      const interp = (t - index / colorCount) * colorCount;
      const color = new THREE.Color().lerpColors(color1, color2, interp);

      // Set the color of the vertex in the geometry
      const colorIndex = i * 3;
      colors[colorIndex] = color.r;
      colors[colorIndex + 1] = color.g;
      colors[colorIndex + 2] = color.b;
    }

    // Set the color attribute in the geometry
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3, true)
    );
     
      // Create the line object
      this.line = new THREE.Line(geometry, material);

      // Add the line to the scene
      this.scene.add(this.line);

    }

    
    getWaveFunction(x, y, t) {
      // Constants
      const wavelength = 200;
      const slitSpacing = 200
      const slitWidth = 1;
      const amplitude = 6
    
      // Calculate the distance from the slits
      const d1 = Math.sqrt((x - slitSpacing/2) ** 2 + y ** 2);
      const d2 = Math.sqrt((x + slitSpacing/2) ** 2 + y ** 2);
    
      // Calculate the phase difference between the two slits
      const phaseDiff = (d2 - d1) / wavelength * 2 * Math.PI;
    
      // Calculate the wave function
      let g1 = 2 * Math.PI * d1 / wavelength
      let g2 = 2 * Math.PI * d2 / wavelength
      let b = 2 * Math.PI * t / 20
      const psi1 = Math.sin((g1) - (b));
      const psi2 = Math.sin((g2) - (b));
      const psi = (psi1 + psi2) / Math.sqrt(2) * slitWidth * amplitude;
    
      // Return the probability density (squared amplitude)
      return psi ** 2;
    }

    

    update() {
      this.time += 0.1;
      
      
      // Update the y-coordinate of each point
      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        const x = point.x;
        const z = point.z;
        const y = this.getWaveFunction(x, z, this.time) + 25; // 25
        // point.y = y;

            // Update the position of the vertex in the geometry
    const positionIndex = i * 3;
    this.line.geometry.attributes.position.array[positionIndex + 1] = y;
      }
  
// Tell Three.js that the positions have changed
this.line.geometry.attributes.position.needsUpdate = true;
      // this.line.geometry.setFromPoints(this.points);
    }
  
  

  addTo(entities) {
    entities.push(this);
    return this;
  }
}
export { ComplexPlot };
