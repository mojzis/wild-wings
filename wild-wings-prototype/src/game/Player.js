/**
 * Player.js
 * Represents the player character (bird) in the Wild Wings game
 */

import Physics from './Physics';

class Player {
  /**
   * Create a new Player
   * @param {number} x - Starting X position
   * @param {number} y - Starting Y position
   */
  constructor(x, y) {
    // Position
    this.x = x;
    this.y = y;

    // Velocity
    this.velocityY = 0;
    this.velocityX = 0;

    // Size (simple rectangle for now)
    this.width = 40;
    this.height = 40;

    // Horizontal movement speed
    this.horizontalSpeed = 3;

    // Color (soft dusty blue bird)
    this.color = '#8BA3B8';  // Muted dusty blue
    this.wingColor = '#6B8399';  // Darker muted blue for wings
    this.beakColor = '#D9B382';  // Soft amber/honey for beak

    // Ability system reference (set externally)
    this.abilitySystem = null;

    // Visual effect particles
    this.particles = [];

    // Ability flags
    this.canBreakObstacles = false;

    // Visual state
    this.wingFlap = 0;
    this.collisionFlash = 0;
  }

  /**
   * Apply flap force to the bird (spacebar)
   */
  flap() {
    this.velocityY = Physics.applyFlap();
    this.wingFlap = 10; // Animate wing flap
  }

  /**
   * Move the bird left
   */
  moveLeft() {
    this.velocityX = -this.horizontalSpeed;
  }

  /**
   * Move the bird right
   */
  moveRight() {
    this.velocityX = this.horizontalSpeed;
  }

  /**
   * Move the bird down (soft descent)
   */
  moveDown() {
    this.velocityY = Math.min(this.velocityY + 1, Physics.TERMINAL_VELOCITY);
  }

  /**
   * Stop horizontal movement
   */
  stopHorizontal() {
    this.velocityX = 0;
  }

  /**
   * Update the player's position and velocity
   * @param {number} canvasWidth - Width of the game canvas
   * @param {number} canvasHeight - Height of the game canvas
   */
  update(canvasWidth, canvasHeight) {
    // Check for active abilities and apply their effects
    const activeAbility = this.abilitySystem ? this.abilitySystem.getActiveAbility() : null;

    // Reset ability flags
    this.canBreakObstacles = false;

    // Apply ability-specific physics
    if (activeAbility === 'speed_boost') {
      // Speed Boost: Fast horizontal movement
      this.velocityX = 15; // Much faster
      this.canBreakObstacles = true;
      this.velocityY = Physics.applyGravity(this.velocityY);

      // Create soft blue trail particles
      this.createTrailParticle('#8BA3B8', '#6B8399');
    } else if (activeAbility === 'hover') {
      // Hover: Freeze in place
      this.velocityX = 0;
      this.velocityY = 0;
      // No gravity during hover

      // Create circular ripple effect
      this.createHoverParticle();
    } else if (activeAbility === 'extended_glide') {
      // Extended Glide: No gravity, gentle float
      this.velocityY = -0.5; // Very gentle upward drift
      // No gravity during glide

      // Create wind streak particles
      this.createGlideParticle();
    } else {
      // Normal physics
      this.velocityY = Physics.applyGravity(this.velocityY);
    }

    // Update position
    this.y += this.velocityY;
    this.x += this.velocityX;

    // Keep player within horizontal bounds
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width;
    }

    // Keep player within vertical bounds (but allow collision detection to handle ground)
    if (this.y < 0) {
      this.y = 0;
      this.velocityY = 0;
    }
    if (this.y + this.height > canvasHeight) {
      this.y = canvasHeight - this.height;
      this.velocityY = 0;
    }

    // Update particles
    this.updateParticles();

    // Update wing flap animation
    if (this.wingFlap > 0) this.wingFlap--;

    // Update collision flash
    if (this.collisionFlash > 0) this.collisionFlash--;
  }

  /**
   * Create trail particle for speed boost
   */
  createTrailParticle(color1, color2) {
    if (Math.random() < 0.5) { // Don't create every frame
      this.particles.push({
        type: 'trail',
        x: this.x + Math.random() * this.width,
        y: this.y + Math.random() * this.height,
        radius: 3 + Math.random() * 3,
        color: Math.random() < 0.5 ? color1 : color2,
        alpha: 1,
        life: 20
      });
    }
  }

  /**
   * Create hover particle
   */
  createHoverParticle() {
    const angle = Date.now() / 200; // Rotating angle
    const radius = 30 + Math.sin(Date.now() / 300) * 5;
    const count = 8;

    // Only create particles occasionally
    if (Math.random() < 0.3) {
      for (let i = 0; i < count; i++) {
        const particleAngle = angle + (i * Math.PI * 2) / count;
        this.particles.push({
          type: 'hover',
          x: this.x + this.width / 2 + Math.cos(particleAngle) * radius,
          y: this.y + this.height / 2 + Math.sin(particleAngle) * radius,
          radius: 2,
          color: '#D9A5A0',  // Soft dusty rose
          alpha: 0.5,  // More subtle
          life: 10
        });
      }
    }
  }

  /**
   * Create glide particle
   */
  createGlideParticle() {
    if (Math.random() < 0.4) {
      this.particles.push({
        type: 'glide',
        x: this.x + Math.random() * this.width,
        y: this.y + Math.random() * this.height,
        vx: -2 - Math.random() * 2,
        vy: (Math.random() - 0.5) * 2,
        length: 10 + Math.random() * 10,
        color: Math.random() < 0.5 ? '#A8B89F' : '#F5F0E8',  // Soft sage or off-white
        alpha: 0.6,  // More subtle
        life: 30
      });
    }
  }

  /**
   * Update all particles
   */
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life--;
      particle.alpha = particle.life / 30;

      // Update position for glide particles
      if (particle.type === 'glide') {
        particle.x += particle.vx;
        particle.y += particle.vy;
      }

      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Render the player on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  render(ctx) {
    // Render particles first (behind player)
    this.renderParticles(ctx);

    ctx.save();

    // Collision flash effect
    if (this.collisionFlash > 0) {
      ctx.shadowColor = '#FF0000';
      ctx.shadowBlur = 15;
    }

    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    // Bird body (main oval)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, this.width / 2, this.height / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bird head (smaller circle)
    ctx.beginPath();
    ctx.arc(centerX + this.width / 4, centerY - this.height / 6, this.height / 3, 0, Math.PI * 2);
    ctx.fill();

    // Beak (small triangle)
    ctx.fillStyle = this.beakColor;  // Soft amber
    ctx.beginPath();
    ctx.moveTo(centerX + this.width / 2, centerY - this.height / 6);
    ctx.lineTo(centerX + this.width / 2 + 8, centerY - this.height / 6 - 3);
    ctx.lineTo(centerX + this.width / 2 + 8, centerY - this.height / 6 + 3);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';  // Soft white
    ctx.beginPath();
    ctx.arc(centerX + this.width / 3, centerY - this.height / 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(90, 90, 90, 0.8)';  // Soft charcoal
    ctx.beginPath();
    ctx.arc(centerX + this.width / 3 + 1, centerY - this.height / 4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Wings (animated based on wingFlap)
    const wingOffset = this.wingFlap > 0 ? -this.wingFlap : 0;
    ctx.fillStyle = this.wingColor;  // Darker muted blue

    // Left wing
    ctx.beginPath();
    ctx.ellipse(
      centerX - this.width / 6,
      centerY + wingOffset,
      this.width / 3,
      this.height / 2,
      -0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Right wing
    ctx.beginPath();
    ctx.ellipse(
      centerX + this.width / 6,
      centerY + wingOffset,
      this.width / 3,
      this.height / 2,
      0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Tail feathers
    ctx.beginPath();
    ctx.moveTo(centerX - this.width / 2, centerY);
    ctx.lineTo(centerX - this.width / 2 - 8, centerY - 6);
    ctx.lineTo(centerX - this.width / 2 - 8, centerY + 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * Render particle effects
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  renderParticles(ctx) {
    this.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;

      if (particle.type === 'trail') {
        // Circular trail particles
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.type === 'hover') {
        // Small circular hover particles
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.type === 'glide') {
        // Wind streak particles (lines)
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + particle.length, particle.y);
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  /**
   * Get the player's bounding box for collision detection
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
   * Trigger collision flash effect
   */
  triggerCollisionFlash() {
    this.collisionFlash = 10;
  }

  /**
   * Reset the player to starting position
   * @param {number} x - Starting X position
   * @param {number} y - Starting Y position
   */
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocityY = 0;
    this.velocityX = 0;
    this.particles = [];
    this.canBreakObstacles = false;
    this.wingFlap = 0;
    this.collisionFlash = 0;
  }
}

export default Player;
