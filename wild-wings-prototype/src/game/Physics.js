/**
 * Physics.js
 * Core physics constants and utilities for the Wild Wings game
 */

const Physics = {
  // Gravity pulls the bird down (adjustable via settings)
  GRAVITY: 0.15,

  // Flap strength pushes the bird up (negative because up is negative Y)
  FLAP_STRENGTH: -6,

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
