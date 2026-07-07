export class SpringValue {
  constructor(value = 0, { stiffness = 160, damping = 22, mass = 1 } = {}) {
    this.value = value; this.target = value; this.velocity = 0;
    this.stiffness = stiffness; this.damping = damping; this.mass = mass;
  }
  setTarget(target) { this.target = target; }
  snap(value) { this.value = value; this.target = value; this.velocity = 0; }
  update(dt) {
    const force = -this.stiffness * (this.value - this.target);
    const dampingForce = -this.damping * this.velocity;
    const acceleration = (force + dampingForce) / this.mass;
    this.velocity += acceleration * dt;
    this.value += this.velocity * dt;
    return this.value;
  }
}
export class VectorSpring {
  constructor(x = 0, y = 0, z = 0, options) {
    this.x = new SpringValue(x, options); this.y = new SpringValue(y, options); this.z = new SpringValue(z, options);
  }
  setTarget(x, y, z = 0) { this.x.setTarget(x); this.y.setTarget(y); this.z.setTarget(z); }
  update(dt) { return { x: this.x.update(dt), y: this.y.update(dt), z: this.z.update(dt) }; }
}
