/**
 * Collectible.js
 * Represents collectible items (wind feathers) in the Wild Wings game
 */

class Collectible {
  /**
   * Create a new Collectible (wind feather)
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y; // Original Y position for floating animation

    // Size
    this.width = 20;
    this.height = 20;

    // Animation properties
    this.floatOffset = 0;
    this.floatSpeed = 0.05;
    this.floatAmplitude = 10;

    // Collection state
    this.collected = false;

    // Sparkle animation for collection
    this.sparkleRadius = 0;
    this.sparkleAlpha = 1;

    // Colors - soft watercolor palette
    this.primaryColor = '#D9B382'; // Soft amber/honey
    this.secondaryColor = '#C9A574'; // Slightly darker warm beige
    this.sparkleColor = '#F5F0E8'; // Soft off-white sparkle
  }

  /**
   * Update the collectible state (animation)
   */
  update() {
    if (!this.collected) {
      // Gentle floating animation
      this.floatOffset += this.floatSpeed;
      this.y = this.baseY + Math.sin(this.floatOffset) * this.floatAmplitude;
    } else {
      // Expand and fade sparkle effect when collected
      this.sparkleRadius += 2;
      this.sparkleAlpha -= 0.05;
    }
  }

  /**
   * Render the collectible on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} cameraX - Camera X offset for scrolling
   */
  render(ctx, cameraX = 0) {
    const screenX = this.x - cameraX;

    if (!this.collected) {
      // Draw main feather circle with soft glow
      ctx.save();
      ctx.shadowColor = 'rgba(217, 179, 130, 0.4)';  // Soft amber glow
      ctx.shadowBlur = 8;
      ctx.fillStyle = this.primaryColor;
      ctx.beginPath();
      ctx.arc(screenX + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Add inner glow (more subtle)
      ctx.fillStyle = this.secondaryColor;
      ctx.globalAlpha = 0.7;  // Softer inner glow
      ctx.beginPath();
      ctx.arc(screenX + this.width / 2, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Add soft sparkle points
      ctx.fillStyle = this.sparkleColor;
      ctx.globalAlpha = 0.6;  // More subtle sparkles
      const sparkleSize = 2;
      ctx.fillRect(screenX + this.width / 2 - sparkleSize / 2, this.y + 2, sparkleSize, sparkleSize);
      ctx.fillRect(screenX + 2, this.y + this.height / 2 - sparkleSize / 2, sparkleSize, sparkleSize);
      ctx.fillRect(screenX + this.width - 2, this.y + this.height / 2 - sparkleSize / 2, sparkleSize, sparkleSize);
      ctx.fillRect(screenX + this.width / 2 - sparkleSize / 2, this.y + this.height - 2, sparkleSize, sparkleSize);
      ctx.globalAlpha = 1.0;
    } else if (this.sparkleAlpha > 0) {
      // Draw collection sparkle effect (softer)
      ctx.globalAlpha = this.sparkleAlpha * 0.7;  // More subtle
      ctx.strokeStyle = this.sparkleColor;
      ctx.lineWidth = 2;  // Thinner lines
      ctx.beginPath();
      ctx.arc(screenX + this.width / 2, this.y + this.height / 2, this.sparkleRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw sparkle rays (softer)
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const startX = screenX + this.width / 2 + Math.cos(angle) * this.sparkleRadius / 2;
        const startY = this.y + this.height / 2 + Math.sin(angle) * this.sparkleRadius / 2;
        const endX = screenX + this.width / 2 + Math.cos(angle) * this.sparkleRadius;
        const endY = this.y + this.height / 2 + Math.sin(angle) * this.sparkleRadius;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    }
  }

  /**
   * Get the collectible's bounding box for collision detection
   * @returns {Object} Bounding box with x, y, width, height
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Check if this collectible collides with another object
   * @param {Object} bounds - Bounding box of another object {x, y, width, height}
   * @returns {boolean} True if collision detected
   */
  checkCollision(bounds) {
    if (this.collected) return false;

    return (
      this.x < bounds.x + bounds.width &&
      this.x + this.width > bounds.x &&
      this.y < bounds.y + bounds.height &&
      this.y + this.height > bounds.y
    );
  }

  /**
   * Mark this collectible as collected
   */
  collect() {
    this.collected = true;
    this.sparkleRadius = 0;
    this.sparkleAlpha = 1;
  }

  /**
   * Check if the sparkle animation is finished
   * @returns {boolean} True if animation is complete
   */
  isSparkleComplete() {
    return this.sparkleAlpha <= 0;
  }
}

export default Collectible;
