import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
import { ParticleField } from '../particles/ParticleField.js';
export class TableScene {
  constructor({ particleScale = 1, pointer, reducedMotion = false } = {}) {
    this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(0x140d09, 4.2, 10);
    this.group = new THREE.Group(); this.scene.add(this.group);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x4a2d18, roughness: .72, metalness: .08 });
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.25, .16, 96), tableMat); top.position.y = 0; top.scale.z = .72; top.receiveShadow = true; this.group.add(top);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(.72, .78, .05, 96), new THREE.MeshStandardMaterial({ color: 0xf2dcae, roughness: .42 })); plate.position.y = .13; plate.receiveShadow = true; this.group.add(plate);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(.18, .24, .48, 48), new THREE.MeshStandardMaterial({ color: 0x2b1710, roughness: .5 })); cup.position.set(.78, .38, -.18); this.group.add(cup);
    const menu = new THREE.Mesh(new THREE.BoxGeometry(.72, .03, .98), new THREE.MeshStandardMaterial({ color: 0x1e1510, roughness: .65 })); menu.position.set(-.72, .17, .18); menu.rotation.y = -.28; this.group.add(menu);
    this.scene.add(new THREE.HemisphereLight(0x9db8ff, 0x2a1208, 1.4));
    const key = new THREE.PointLight(0xffc36b, 4.2, 7); key.position.set(-2.2, 3.2, 2.5); this.scene.add(key); this.key = key;
    const rim = new THREE.DirectionalLight(0x9bc5ff, 1.1); rim.position.set(2.2, 2.4, -2.4); this.scene.add(rim);
    this.particles = new ParticleField({ count: Math.round(420 * particleScale), pointer, reducedMotion }); this.scene.add(this.particles.points);
  }
  update(dt, time, pointer) { this.group.rotation.y = Math.sin(time * .00018) * .035 + (pointer?.x || 0) * .025; this.key.position.x = -2.2 + (pointer?.x || 0) * .25; this.particles.update(dt); }
}
