export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export function spring(state, target, stiffness, damping, dt) { const force = (target - state.value) * stiffness; state.velocity = (state.velocity + force * dt) * Math.exp(-damping * dt); state.value += state.velocity * dt; return state.value; }
