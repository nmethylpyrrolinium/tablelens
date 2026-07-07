export class QualityManager {
  constructor() { this.pixelRatio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1.5 : 2); this.particleScale = window.innerWidth < 720 ? 0.45 : 1; this.samples = []; }
  update(dt) { this.samples.push(1 / dt); if (this.samples.length > 90) this.samples.shift(); const avg = this.samples.reduce((a,b)=>a+b,0)/this.samples.length; if (this.samples.length === 90 && avg < 45) { this.pixelRatio = Math.max(1, this.pixelRatio - 0.25); this.particleScale = Math.max(0.35, this.particleScale - 0.15); this.samples.length = 0; return true; } return false; }
}
