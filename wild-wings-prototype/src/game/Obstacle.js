/**
 * Obstacle.js
 * Represents static obstacles (tree branches) in the Wild Wings game
 */

class Obstacle {
  /**
   * Create a new Obstacle
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width of the obstacle
   * @param {number} height - Height of the obstacle
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Soft muted brown/taupe color for tree branches
    this.color = '#B09A8A';  // Soft taupe
    this.shadowColor = '#9B8578';  // Slightly darker muted brown
    this.highlightColor = '#C4B5A8';  // Lighter taupe for highlights
  }

  /**
   * Render the obstacle on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  render(ctx) {
    // Draw main obstacle with soft edges
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Add soft shadow/depth effect
    ctx.fillStyle = this.shadowColor;
    ctx.globalAlpha = 0.5;  // Softer shadow
    ctx.fillRect(this.x + this.width - 5, this.y, 5, this.height);
    ctx.globalAlpha = 1.0;

    // Add subtle texture lines
    ctx.strokeStyle = this.shadowColor;
    ctx.lineWidth = 1;  // Thinner lines for subtlety
    ctx.globalAlpha = 0.4;  // Very subtle
    for (let i = 10; i < this.height; i += 15) {
      ctx.beginPath();
      ctx.moveTo(this.x + 5, this.y + i);
      ctx.lineTo(this.x + this.width - 5, this.y + i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Add soft highlight on left edge
    ctx.fillStyle = this.highlightColor;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(this.x, this.y, 3, this.height);
    ctx.globalAlpha = 1.0;
  }

  /**
   * Get the obstacle's bounding box for collision detection
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
   * Check if this obstacle collides with another object
   * @param {Object} bounds - Bounding box of another object {x, y, width, height}
   * @returns {boolean} True if collision detected
   */
  checkCollision(bounds) {
    return (
      this.x < bounds.x + bounds.width &&
      this.x + this.width > bounds.x &&
      this.y < bounds.y + bounds.height &&
      this.y + this.height > bounds.y
    );
  }
}

export default Obstacle;
