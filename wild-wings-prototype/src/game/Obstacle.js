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

    // Brown color for tree branches
    this.color = '#8B4513';
    this.shadowColor = '#654321';
  }

  /**
   * Render the obstacle on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  render(ctx) {
    // Draw main obstacle
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Add shadow/depth effect
    ctx.fillStyle = this.shadowColor;
    ctx.fillRect(this.x + this.width - 5, this.y, 5, this.height);

    // Add texture lines to make it look more like wood
    ctx.strokeStyle = this.shadowColor;
    ctx.lineWidth = 2;
    for (let i = 10; i < this.height; i += 15) {
      ctx.beginPath();
      ctx.moveTo(this.x + 5, this.y + i);
      ctx.lineTo(this.x + this.width - 5, this.y + i);
      ctx.stroke();
    }
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
