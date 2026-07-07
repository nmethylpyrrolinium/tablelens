export class PointerSystem {
  constructor(root = window) { this.x = 0; this.y = 0; this.tx = 0; this.ty = 0; this.velocityX = 0; this.velocityY = 0; this.active = false; root.addEventListener('pointermove', (e) => { const nx = (e.clientX / innerWidth - .5) * 2; const ny = (e.clientY / innerHeight - .5) * 2; this.velocityX = nx - this.tx; this.velocityY = ny - this.ty; this.tx = nx; this.ty = ny; this.active = true; }, { passive: true }); root.addEventListener('pointerleave', () => { this.tx = 0; this.ty = 0; this.active = false; }, { passive: true }); }
  update(dt) { const ease = 1 - Math.exp(-7 * dt); this.x += (this.tx - this.x) * ease; this.y += (this.ty - this.y) * ease; this.velocityX *= .92; this.velocityY *= .92; }
}
export const pointer = new PointerSystem();
