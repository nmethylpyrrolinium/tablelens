export class ScrollRevealSystem {
  constructor({ reducedMotion = false } = {}) {
    if (reducedMotion) return;
    this.observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-revealed'); }), { threshold: .14, rootMargin: '0px 0px -8% 0px' });
  }
  scan(root = document) { this.observer && root.querySelectorAll('.glass-panel,.dish-card,.related-card,.viewer-card,.menu-hero,.steps').forEach((el) => this.observer.observe(el)); }
}
