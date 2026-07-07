import { Timing } from '../core/Timing.js';
export class Scheduler {
  constructor() { this.timing = new Timing(); this.systems = new Set(); this.running = false; this.quality = 1; this.fps = 60; this.samples = []; this.loop = this.loop.bind(this); }
  add(system) { if (system?.update) this.systems.add(system); return system; }
  remove(system) { this.systems.delete(system); }
  start() { if (!this.running) { this.running = true; requestAnimationFrame(this.loop); } }
  loop(now) { if (!this.running) return; const active = this.timing.tick(now); if (active) { const dt = this.timing.delta; this.samples.push(1 / Math.max(dt, 0.001)); if (this.samples.length > 90) this.samples.shift(); this.fps = this.samples.reduce((a,b)=>a+b,0) / this.samples.length; this.quality = this.fps < 42 ? 0.55 : this.fps < 52 ? 0.75 : 1; this.systems.forEach((system) => system.update(dt, this.timing.elapsed, this)); } requestAnimationFrame(this.loop); }
}
export const scheduler = new Scheduler();
