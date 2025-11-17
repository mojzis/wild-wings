/**
 * Physics.js
 * Core physics constants and utilities for the Wild Wings game
 */

const Physics = {
  // Base values for physics (scaled by sensitivity)
  BASE_GRAVITY: 0.20,
  BASE_FLAP_STRENGTH: -8,

  // Flight sensitivity multiplier (0.5 = easy, 1.0 = normal, 1.5 = hard)
  // This scales both gravity and flap strength to keep controls balanced
  sensitivity: 0.75,

  // Computed values (updated when sensitivity changes)
  get GRAVITY() {
    return this.BASE_GRAVITY * this.sensitivity;
  },

  get FLAP_STRENGTH() {
    return this.BASE_FLAP_STRENGTH * this.sensitivity;
  },

  // Terminal velocity - maximum falling speed
  TERMINAL_VELOCITY: 6,

  // Maximum upward velocity
  MAX_UPWARD_VELOCITY: -8,

  /**
   * Apply gravity to velocity
   * @param {number} velocityY - Current vertical velocity
   * @returns {number} New velocity after applying gravity
   */
  applyGravity(velocityY) {
    const newVelocity = velocityY + this.GRAVITY;
    // Clamp to terminal velocity
    return Math.min(newVelocity, this.TERMINAL_VELOCITY);
  },

  /**
   * Apply flap force to velocity
   * @returns {number} New velocity after flapping
   */
  applyFlap() {
    return this.FLAP_STRENGTH;
  },

  /**
   * Clamp velocity within bounds
   * @param {number} velocity - Current velocity
   * @returns {number} Clamped velocity
   */
  clampVelocity(velocity) {
    return Math.max(this.MAX_UPWARD_VELOCITY, Math.min(velocity, this.TERMINAL_VELOCITY));
  }
};

export default Physics;
