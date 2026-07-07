import { scheduler } from './animation/Scheduler.js';
import { pointer } from './interaction/PointerSystem.js';
import { createRenderer, resizeRenderer } from './renderer/WebGLRenderer.js';
import { CinematicCamera } from './camera/CinematicCamera.js';
import { CafeTableScene } from './scene/CafeTableScene.js';
import { PhysicalCards } from './ui/PhysicalCards.js';
import { ScrollEngine } from './systems/ScrollEngine.js';
import { prefersReducedMotion } from './utilities/motion.js';
export function initTableLensExperience(){ const reduced=prefersReducedMotion(); const scroll=new ScrollEngine(); scheduler.add(pointer); scheduler.add(scroll); const cards=new PhysicalCards(); scheduler.add({update:(dt)=>{ cards.scan(); cards.update(dt); }}); const canvas=document.querySelector('#tableLensCanvas'); if(canvas && !reduced && window.WebGLRenderingContext){ const renderer=createRenderer(canvas); const cam=new CinematicCamera(canvas.clientWidth/Math.max(canvas.clientHeight,1)); const world=new CafeTableScene(reduced); new ResizeObserver(()=>resizeRenderer(renderer,cam.camera,canvas)).observe(canvas); scheduler.add({update(dt,elapsed,s){ resizeRenderer(renderer,cam.camera,canvas); cam.update(dt,elapsed,pointer,scroll.progress,reduced); world.update(dt,elapsed,pointer,s.quality); renderer.render(world.scene,cam.camera); }}); } else document.body.classList.add('no-webgl-experience'); scheduler.start(); }
