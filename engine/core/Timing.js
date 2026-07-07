export class Timing {
  constructor() { this.clock = performance.now(); this.delta = 0; this.elapsed = 0; this.frame = 0; this.paused = document.hidden; document.addEventListener('visibilitychange', () => { this.paused = document.hidden; this.clock = performance.now(); }); }
  tick(now = performance.now()) { this.delta = Math.min((now - this.clock) / 1000, 0.05); this.clock = now; if (!this.paused) { this.elapsed += this.delta; this.frame += 1; } return !this.paused; }
}
