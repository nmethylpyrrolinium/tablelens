import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
export class ParticleField {
  constructor({ count = 360, pointer, reducedMotion = false } = {}) {
    this.reducedMotion = reducedMotion; this.pointer = pointer;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3); const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i*3] = (Math.random() - .5) * 7;
      positions[i*3+1] = Math.random() * 3.2 - .4;
      positions[i*3+2] = (Math.random() - .5) * 5;
      speeds[i] = .15 + Math.random() * .45;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); this.positions = positions; this.speeds = speeds;
    const material = new THREE.PointsMaterial({ color: 0xffd58a, size: .018, transparent: true, opacity: .58, depthWrite: false, blending: THREE.AdditiveBlending });
    this.points = new THREE.Points(geometry, material);
  }
  update(dt) {
    if (this.reducedMotion) return;
    const px = (this.pointer?.x || 0) * .08, py = (this.pointer?.y || 0) * .04;
    for (let i = 0; i < this.speeds.length; i++) {
      const j = i * 3; this.positions[j] += px * dt * this.speeds[i]; this.positions[j+1] += dt * this.speeds[i] * .18 - py * dt;
      if (this.positions[j+1] > 3) this.positions[j+1] = -.45;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}
