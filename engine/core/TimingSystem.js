export class TimingSystem {
  constructor({ reducedMotion = false } = {}) {
    this.reducedMotion = reducedMotion;
    this.subscribers = new Set();
    this.last = 0;
    this.running = false;
    this.paused = document.hidden;
    this.frame = this.frame.bind(this);
    document.addEventListener('visibilitychange', () => {
      this.paused = document.hidden;
      if (!this.paused && this.running) this.last = performance.now();
    });
  }
  add(callback) { this.subscribers.add(callback); return () => this.subscribers.delete(callback); }
  start() { if (this.running || this.reducedMotion) return; this.running = true; this.last = performance.now(); requestAnimationFrame(this.frame); }
  stop() { this.running = false; }
  frame(now) {
    if (!this.running) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    if (!this.paused) this.subscribers.forEach((callback) => callback(dt, now));
    requestAnimationFrame(this.frame);
  }
}
