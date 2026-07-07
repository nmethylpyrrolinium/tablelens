import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
export class WebGLExperience {
  constructor({ canvas, timing, pointer, quality, reducedMotion = false, createScene, createCameraController }) {
    this.canvas = canvas; this.timing = timing; this.pointer = pointer; this.quality = quality; this.reducedMotion = reducedMotion;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !/Mobi/.test(navigator.userAgent), alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(quality.pixelRatio); this.renderer.shadowMap.enabled = !reducedMotion;
    this.camera = new THREE.PerspectiveCamera(42, 1, .1, 40);
    this.tableScene = createScene(); this.scene = this.tableScene.scene;
    this.cameraController = createCameraController(this.camera);
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(canvas.parentElement || canvas); this.resize();
    window.addEventListener('scroll', () => this.cameraController.setScroll(Math.min(1, window.scrollY / Math.max(1, window.innerHeight))), { passive: true });
    timing.add((dt, now) => this.update(dt, now));
  }
  resize() { const rect = (this.canvas.parentElement || this.canvas).getBoundingClientRect(); this.renderer.setSize(rect.width, rect.height, false); this.camera.aspect = rect.width / Math.max(1, rect.height); this.camera.updateProjectionMatrix(); }
  update(dt, now) { if (this.quality.update(dt)) this.renderer.setPixelRatio(this.quality.pixelRatio); this.cameraController.update(dt, now); this.tableScene.update(dt, now, this.pointer); this.renderer.render(this.scene, this.camera); }
}
