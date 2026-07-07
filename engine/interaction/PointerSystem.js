import { VectorSpring } from '../animation/Spring.js';
export class PointerSystem {
  constructor({ timing, reducedMotion = false } = {}) {
    this.reducedMotion = reducedMotion;
    this.pointer = new VectorSpring(0, 0, 0, { stiffness: 90, damping: 18 });
    this.raw = { x: 0, y: 0 };
    window.addEventListener('pointermove', (event) => {
      this.raw.x = (event.clientX / window.innerWidth - 0.5) * 2;
      this.raw.y = (event.clientY / window.innerHeight - 0.5) * 2;
      if (!this.reducedMotion) this.pointer.setTarget(this.raw.x, this.raw.y, 0);
    }, { passive: true });
    timing?.add((dt) => this.pointer.update(dt));
  }
  get x() { return this.pointer.x.value; }
  get y() { return this.pointer.y.value; }
}
