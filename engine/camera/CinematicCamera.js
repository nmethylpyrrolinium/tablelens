import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
export class CinematicCamera {
  constructor(aspect) { this.camera = new THREE.PerspectiveCamera(42, aspect, .1, 80); this.position = new THREE.Vector3(0, 2.2, 7.2); this.targetPosition = this.position.clone(); this.lookAt = new THREE.Vector3(0, .55, 0); this.targetLookAt = this.lookAt.clone(); this.camera.position.copy(this.position); }
  focus(position, lookAt) { this.targetPosition.copy(position); this.targetLookAt.copy(lookAt); }
  update(dt, elapsed, pointer, scroll = 0, reduced = false) { const idle = reduced ? 0 : Math.sin(elapsed * .45) * .045; this.targetPosition.set(pointer.x * .22, 2.05 + idle - scroll * .28, 6.45 - scroll * .8); this.targetLookAt.set(pointer.x * .08, .54 + pointer.y * .05, 0); const ease = 1 - Math.exp(-2.4 * dt); this.position.lerp(this.targetPosition, ease); this.lookAt.lerp(this.targetLookAt, ease); this.camera.position.copy(this.position); this.camera.lookAt(this.lookAt); }
}
