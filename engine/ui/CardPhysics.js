import { SpringValue } from '../animation/Spring.js';
class PhysicalCard {
  constructor(element) {
    this.element = element; this.hover = false; this.rect = null;
    this.rx = new SpringValue(0, { stiffness: 150, damping: 18 }); this.ry = new SpringValue(0, { stiffness: 150, damping: 18 }); this.lift = new SpringValue(0, { stiffness: 170, damping: 20 });
    element.addEventListener('pointerenter', () => { this.hover = true; this.rect = element.getBoundingClientRect(); this.lift.setTarget(10); });
    element.addEventListener('pointermove', (event) => { if (event.pointerType === 'touch') return; this.rect ||= element.getBoundingClientRect(); const x = (event.clientX - this.rect.left) / this.rect.width - .5; const y = (event.clientY - this.rect.top) / this.rect.height - .5; this.ry.setTarget(x * 7); this.rx.setTarget(y * -6); });
    element.addEventListener('pointerleave', () => { this.hover = false; this.rect = null; this.rx.setTarget(0); this.ry.setTarget(0); this.lift.setTarget(0); });
  }
  update(dt) { const rx = this.rx.update(dt), ry = this.ry.update(dt), lift = this.lift.update(dt); this.element.style.setProperty('--card-rx', `${rx}deg`); this.element.style.setProperty('--card-ry', `${ry}deg`); this.element.style.setProperty('--card-lift', `${-lift}px`); this.element.style.setProperty('--card-shadow-y', `${24 + lift * 1.7}px`); }
}
export class CardPhysicsSystem {
  constructor({ timing, reducedMotion = false } = {}) { this.cards = new Map(); this.reducedMotion = reducedMotion; timing?.add((dt) => this.update(dt)); }
  scan(root = document) { if (this.reducedMotion) return; root.querySelectorAll('.tilt-card').forEach((el) => { if (!this.cards.has(el)) { el.dataset.physicsReady = 'true'; this.cards.set(el, new PhysicalCard(el)); } }); }
  update(dt) { this.cards.forEach((card, el) => document.body.contains(el) ? card.update(dt) : this.cards.delete(el)); }
}
