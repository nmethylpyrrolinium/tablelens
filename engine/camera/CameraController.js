import { VectorSpring } from '../animation/Spring.js';
export class CameraController {
  constructor(camera, { pointer, reducedMotion = false } = {}) {
    this.camera = camera; this.pointer = pointer; this.reducedMotion = reducedMotion;
    this.base = { x: 0, y: 1.45, z: 5.6 }; this.focus = { x: 0, y: .55, z: 0 };
    this.position = new VectorSpring(this.base.x, this.base.y, this.base.z, { stiffness: 42, damping: 16, mass: 1.2 });
  }
  setScroll(progress) { this.scroll = progress; }
  update(dt, time = 0) {
    if (this.reducedMotion) return;
    const px = this.pointer?.x || 0, py = this.pointer?.y || 0;
    const idle = Math.sin(time * 0.00035) * 0.035;
    this.position.setTarget(this.base.x + px * .18, this.base.y - py * .08 + idle, this.base.z - (this.scroll || 0) * .8);
    const p = this.position.update(dt);
    this.camera.position.set(p.x, p.y, p.z);
    this.camera.lookAt(this.focus.x + px * .08, this.focus.y - py * .04, this.focus.z);
  }
}
