/**
 * Level.js
 * Represents a game level with obstacles, collectibles, and safe zones
 */

import Obstacle from './Obstacle';
import Collectible from './Collectible';
import birdFacts from '../data/birdFacts';

class Level {
  /**
   * Create a new Level
   * @param {number} levelNumber - The level number
   */
  constructor(levelNumber = 1) {
    this.levelNumber = levelNumber;

    // Set level dimensions based on level number
    if (levelNumber === 1) {
      this.width = 2500;
      this.levelName = 'First Flight';
    } else if (levelNumber === 2) {
      this.width = 2800;
      this.levelName = 'Storm Chaser';
    } else if (levelNumber === 3) {
      this.width = 3200;
      this.levelName = 'Sky Master';
    }
    this.height = 600; // Level height in pixels

    // Game state
    this.state = 'start'; // 'start', 'playing', 'safe_zone', 'completed'
    this.feathersCollected = 0;
    this.totalFeathers = 0;
    this.startTime = null;
    this.elapsedTime = 0;
    this.safeZonePauseTime = 0;
    this.levelCompleteTriggered = false;

    // Safe zones (can be multiple for Level 2)
    this.safeZones = [];
    this.currentSafeZoneIndex = -1;

    // Elder encounter system
    this.currentEncounter = null;
    this.encounterShown = false;
    this.encountersCompleted = [];
    this.unlockedAbilities = [];

    // Initialize level layout
    this.obstacles = [];
    this.collectibles = [];
    this.createLevelLayout();

    // Parallax background clouds
    this.clouds = this.createClouds();
  }

  /**
   * Create background clouds for parallax effect
   */
  createClouds() {
    const clouds = [];
    const numClouds = 15;
    for (let i = 0; i < numClouds; i++) {
      clouds.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height - 150),
        size: 30 + Math.random() * 50,
        speed: 0.1 + Math.random() * 0.2,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
    return clouds;
  }

  /**
   * Generate random feather positions spread throughout the level
   * @param {number} count - Number of feathers to generate
   * @param {number} startX - Minimum X position
   * @param {number} endX - Maximum X position
   * @returns {Array} Array of {x, y} positions
   */
  generateRandomFeatherPositions(count, startX, endX) {
    const positions = [];
    const minY = 80; // Avoid very top of screen
    const maxY = this.height - 120; // Avoid very bottom (ground area)
    const minDistance = 80; // Minimum distance between feathers
    const obstacleBuffer = 40; // Minimum distance from obstacles

    let attempts = 0;
    const maxAttempts = count * 50; // Prevent infinite loop

    while (positions.length < count && attempts < maxAttempts) {
      attempts++;

      // Generate random position
      const x = startX + Math.random() * (endX - startX);
      const y = minY + Math.random() * (maxY - minY);

      // Check if position is too close to existing feathers
      let tooClose = false;
      for (let pos of positions) {
        const dx = x - pos.x;
        const dy = y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          tooClose = true;
          break;
        }
      }

      if (tooClose) continue;

      // Check if position is too close to obstacles
      let tooCloseToObstacle = false;
      for (let obstacle of this.obstacles) {
        // Simple rectangular distance check
        const closestX = Math.max(obstacle.x, Math.min(x, obstacle.x + obstacle.width));
        const closestY = Math.max(obstacle.y, Math.min(y, obstacle.y + obstacle.height));
        const dx = x - closestX;
        const dy = y - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < obstacleBuffer) {
          tooCloseToObstacle = true;
          break;
        }
      }

      if (tooCloseToObstacle) continue;

      // Position is valid, add it
      positions.push({ x, y });
    }

    // If we couldn't generate enough positions, fill remaining with simple positions
    while (positions.length < count) {
      const segmentWidth = (endX - startX) / count;
      const index = positions.length;
      positions.push({
        x: startX + segmentWidth * index + Math.random() * segmentWidth * 0.5,
        y: minY + Math.random() * (maxY - minY)
      });
    }

    return positions;
  }

  /**
   * Generate random branch (obstacle) positions spread throughout the level
   * @param {number} count - Number of branches to generate
   * @param {number} startX - Minimum X position
   * @param {number} endX - Maximum X position
   * @param {number} minWidth - Minimum branch width
   * @param {number} maxWidth - Maximum branch width
   * @param {number} minHeight - Minimum branch height
   * @param {number} maxHeight - Maximum branch height
   * @returns {Array} Array of {x, y, width, height} obstacle definitions
   */
  generateRandomBranchPositions(count, startX, endX, minWidth, maxWidth, minHeight, maxHeight) {
    const branches = [];
    const minY = 50; // Minimum Y position (avoid very top)
    const maxY = this.height - 200; // Maximum Y position (avoid ground)
    const minHorizontalGap = 100; // Minimum horizontal gap for navigation
    const minVerticalGap = 120; // Minimum vertical gap between overlapping branches
    const safeZoneBuffer = 150; // Buffer around safe zones
    const startBuffer = 250; // Buffer from start position
    const endBuffer = 250; // Buffer from end position

    let attempts = 0;
    const maxAttempts = count * 100; // More attempts for complex placement

    while (branches.length < count && attempts < maxAttempts) {
      attempts++;

      // Generate random dimensions
      const width = minWidth + Math.random() * (maxWidth - minWidth);
      const height = minHeight + Math.random() * (maxHeight - minHeight);

      // Generate random position
      const x = startX + Math.random() * (endX - startX);
      const y = minY + Math.random() * (maxY - minY);

      // Skip if too close to start or end
      if (x < startX + startBuffer || x + width > endX - endBuffer) {
        continue;
      }

      // Skip if overlapping with safe zones
      let overlapsWithSafeZone = false;
      for (let zone of this.safeZones) {
        const distX = Math.abs((x + width / 2) - (zone.x + zone.width / 2));
        const distY = Math.abs((y + height / 2) - (zone.y + zone.height / 2));
        if (distX < (width / 2 + zone.width / 2 + safeZoneBuffer) &&
            distY < (height / 2 + zone.height / 2 + safeZoneBuffer)) {
          overlapsWithSafeZone = true;
          break;
        }
      }

      if (overlapsWithSafeZone) continue;

      // Check spacing from existing branches to maintain playability
      let hasValidGap = true;
      for (let other of branches) {
        const horizontalOverlap = !(x + width < other.x || x > other.x + other.width);
        const verticalOverlap = !(y + height < other.y || y > other.y + other.height);

        // If branches overlap horizontally, ensure sufficient vertical gap
        if (horizontalOverlap) {
          const verticalGap = Math.min(
            Math.abs(y - (other.y + other.height)),
            Math.abs((y + height) - other.y)
          );
          if (verticalGap < minVerticalGap) {
            hasValidGap = false;
            break;
          }
        }

        // If branches are close horizontally, ensure some navigable space
        const horizontalGap = Math.min(
          Math.abs(x - (other.x + other.width)),
          Math.abs((x + width) - other.x)
        );
        if (horizontalGap > 0 && horizontalGap < minHorizontalGap && verticalOverlap) {
          hasValidGap = false;
          break;
        }
      }

      if (!hasValidGap) continue;

      // Position is valid, add branch
      branches.push({ x, y, width, height });
    }

    // If we couldn't generate enough branches, fill remaining with safer positions
    // Distribute them evenly across the level with guaranteed gaps
    while (branches.length < count) {
      const segmentWidth = (endX - startX - startBuffer - endBuffer) / count;
      const index = branches.length;
      const segmentX = startX + startBuffer + segmentWidth * index;

      // Alternate between top and bottom placement for guaranteed gaps
      const isTop = index % 2 === 0;
      const width = minWidth + Math.random() * (maxWidth - minWidth);
      const height = minHeight + Math.random() * (maxHeight - minHeight);

      branches.push({
        x: segmentX + Math.random() * (segmentWidth * 0.3),
        y: isTop ? minY + Math.random() * 100 : maxY - Math.random() * 100,
        width: width,
        height: height
      });
    }

    return branches;
  }

  /**
   * Create the level layout with obstacles and collectibles
   */
  createLevelLayout() {
    if (this.levelNumber === 1) {
      this.createLevel1();
    } else if (this.levelNumber === 2) {
      this.createLevel2();
    } else if (this.levelNumber === 3) {
      this.createLevel3();
    }
  }

  /**
   * Create Level 1 layout (easier)
   */
  createLevel1() {
    // Safe zone for Level 1
    this.safeZones = [{
      x: 1200,
      y: 300,
      width: 120,
      height: 80,
      activated: false
    }];

    // Create obstacles for Level 1 (easy to medium difficulty) - 17 total, randomized positions
    const numBranches = 17;
    const branchData = this.generateRandomBranchPositions(
      numBranches,
      200,           // startX
      this.width,    // endX
      60,            // minWidth
      80,            // maxWidth
      100,           // minHeight
      150            // maxHeight
    );

    this.obstacles = branchData.map(b => new Obstacle(b.x, b.y, b.width, b.height));

    // Create collectibles (wind feathers) - 15 total, randomized positions
    const numFeathers = 15;
    const featherPositions = this.generateRandomFeatherPositions(numFeathers, 200, this.width - 200);

    this.collectibles = featherPositions.map(pos => new Collectible(pos.x, pos.y));
    this.totalFeathers = this.collectibles.length;
  }

  /**
   * Create Level 2 layout (harder)
   */
  createLevel2() {
    // Two safe zones for Level 2
    this.safeZones = [
      {
        x: 1100,
        y: 280,
        width: 120,
        height: 80,
        activated: false
      },
      {
        x: 2200,
        y: 320,
        width: 120,
        height: 80,
        activated: false
      }
    ];

    // Create obstacles for Level 2 (harder - 23 obstacles with tighter gaps) - randomized positions
    const numBranches = 23;
    const branchData = this.generateRandomBranchPositions(
      numBranches,
      200,           // startX
      this.width,    // endX
      60,            // minWidth
      85,            // maxWidth (slightly larger for difficulty)
      120,           // minHeight (taller branches)
      180            // maxHeight (taller branches)
    );

    this.obstacles = branchData.map(b => new Obstacle(b.x, b.y, b.width, b.height));

    // Create collectibles - 20 feathers, randomized positions
    const numFeathers = 20;
    const featherPositions = this.generateRandomFeatherPositions(numFeathers, 200, this.width - 200);

    this.collectibles = featherPositions.map(pos => new Collectible(pos.x, pos.y));
    this.totalFeathers = this.collectibles.length;
  }

  /**
   * Create Level 3 layout (hardest)
   */
  createLevel3() {
    // Three safe zones for Level 3
    this.safeZones = [
      {
        x: 1000,
        y: 260,
        width: 120,
        height: 80,
        activated: false
      },
      {
        x: 2000,
        y: 300,
        width: 120,
        height: 80,
        activated: false
      },
      {
        x: 2800,
        y: 280,
        width: 120,
        height: 80,
        activated: false
      }
    ];

    // Create obstacles for Level 3 (hardest - 30 obstacles with even tighter gaps) - randomized positions
    const numBranches = 30;
    const branchData = this.generateRandomBranchPositions(
      numBranches,
      200,           // startX
      this.width,    // endX
      65,            // minWidth (slightly wider)
      90,            // maxWidth (larger obstacles)
      130,           // minHeight (taller branches)
      200            // maxHeight (very tall branches)
    );

    this.obstacles = branchData.map(b => new Obstacle(b.x, b.y, b.width, b.height));

    // Create collectibles - 25 feathers, randomized positions
    const numFeathers = 25;
    const featherPositions = this.generateRandomFeatherPositions(numFeathers, 200, this.width - 200);

    this.collectibles = featherPositions.map(pos => new Collectible(pos.x, pos.y));
    this.totalFeathers = this.collectibles.length;
  }

  /**
   * Start the level
   */
  start() {
    this.state = 'playing';
    this.startTime = Date.now();
    this.safeZonePauseTime = 0;
  }

  /**
   * Update level state
   * @param {Object} player - Player object
   */
  update(player) {
    // Update elapsed time (excluding safe zone pause time)
    if (this.state === 'playing' && this.startTime) {
      this.elapsedTime = Math.floor((Date.now() - this.startTime - this.safeZonePauseTime) / 1000);
    }

    // Update collectibles
    this.collectibles.forEach(collectible => {
      collectible.update();
    });

    // Remove collectibles with completed sparkle animations
    this.collectibles = this.collectibles.filter(c => !c.isSparkleComplete());

    // Check if player reached any safe zone
    if (this.state === 'playing') {
      const playerBounds = player.getBounds();
      for (let i = 0; i < this.safeZones.length; i++) {
        if (!this.safeZones[i].activated && this.checkSafeZoneCollision(playerBounds, i)) {
          this.activateSafeZone(i);
          break;
        }
      }
    }

    // Check if player reached the end
    if (this.state === 'playing' && player.x > this.width - 200 && !this.levelCompleteTriggered) {
      this.complete();
      this.levelCompleteTriggered = true;
    }
  }

  /**
   * Check collision with safe zone
   * @param {Object} bounds - Bounding box to check
   * @param {number} zoneIndex - Index of safe zone to check
   * @returns {boolean} True if collision detected
   */
  checkSafeZoneCollision(bounds, zoneIndex) {
    const zone = this.safeZones[zoneIndex];
    if (!zone) return false;
    return (
      zone.x < bounds.x + bounds.width &&
      zone.x + zone.width > bounds.x &&
      zone.y < bounds.y + bounds.height &&
      zone.y + zone.height > bounds.y
    );
  }

  /**
   * Activate the safe zone (auto-land the player)
   * @param {number} zoneIndex - Index of safe zone being activated
   */
  activateSafeZone(zoneIndex) {
    this.safeZones[zoneIndex].activated = true;
    this.currentSafeZoneIndex = zoneIndex;
    this.state = 'safe_zone';
    this.safeZonePauseStartTime = Date.now();

    // Trigger elder encounter
    this.triggerElderEncounter();
  }

  /**
   * Trigger an elder encounter
   */
  triggerElderEncounter() {
    // Show different encounters based on level and safe zone
    // Level 1: Peregrine Falcon (0)
    // Level 2: Hummingbird (1), then Albatross (2)
    // Level 3: Bar-tailed Godwit (3), Barn Owl (4), Arctic Tern (5)
    let encounterIndex;

    if (this.levelNumber === 1) {
      encounterIndex = 0; // Always Peregrine Falcon for Level 1
    } else if (this.levelNumber === 2) {
      // First safe zone: Hummingbird, Second safe zone: Albatross
      encounterIndex = this.currentSafeZoneIndex + 1;
    } else if (this.levelNumber === 3) {
      // First safe zone: Bar-tailed Godwit, Second: Barn Owl, Third: Arctic Tern
      encounterIndex = this.currentSafeZoneIndex + 3;
    }

    if (encounterIndex !== undefined && encounterIndex < birdFacts.length) {
      const encounter = birdFacts[encounterIndex];
      // Only show if not already completed
      if (!this.encountersCompleted.includes(encounter.id)) {
        this.currentEncounter = encounter;
        this.encounterShown = false;
      }
    }
  }

  /**
   * Complete the current elder encounter
   */
  completeElderEncounter() {
    if (this.currentEncounter) {
      // Mark encounter as completed
      this.encountersCompleted.push(this.currentEncounter.id);

      // Unlock the ability
      if (!this.unlockedAbilities.includes(this.currentEncounter.ability)) {
        this.unlockedAbilities.push(this.currentEncounter.ability);
      }

      // Clear current encounter
      this.currentEncounter = null;
      this.encounterShown = true;
    }
  }

  /**
   * Get current elder encounter (if any)
   */
  getCurrentEncounter() {
    return this.currentEncounter;
  }

  /**
   * Continue from safe zone
   */
  continueFromSafeZone() {
    this.state = 'playing';
    // Add the pause time to total pause time
    this.safeZonePauseTime += Date.now() - this.safeZonePauseStartTime;
  }

  /**
   * Mark level as completed
   */
  complete() {
    this.state = 'completed';
  }

  /**
   * Reset the level
   */
  reset() {
    this.state = 'start';
    this.feathersCollected = 0;
    this.startTime = null;
    this.elapsedTime = 0;
    this.safeZonePauseTime = 0;
    this.currentSafeZoneIndex = -1;
    this.currentEncounter = null;
    this.encounterShown = false;
    this.encountersCompleted = [];
    this.unlockedAbilities = [];
    this.levelCompleteTriggered = false;
    this.createLevelLayout();
  }

  /**
   * Check collision with collectibles
   * @param {Object} bounds - Bounding box to check
   * @returns {boolean} True if any collectible was collected
   */
  checkCollectibleCollision(bounds) {
    let collected = false;
    this.collectibles.forEach(collectible => {
      if (collectible.checkCollision(bounds)) {
        collectible.collect();
        this.feathersCollected++;
        collected = true;
      }
    });
    return collected;
  }

  /**
   * Render the level
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   * @param {number} cameraX - Camera X offset for scrolling
   */
  render(ctx, canvasWidth, canvasHeight, cameraX) {
    // Draw background (soft watercolor sky with gradient)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#E8D5E8');  // Pale lavender
    gradient.addColorStop(0.5, '#F0DDD8'); // Soft dusty rose
    gradient.addColorStop(1, '#F5E6D3');  // Soft peach/cream
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw parallax clouds
    this.renderClouds(ctx, canvasWidth, canvasHeight, cameraX);

    // Draw ground (muted sage green)
    ctx.fillStyle = '#A8B5A0';
    ctx.fillRect(0, canvasHeight - 30, canvasWidth, 30);

    // Add soft grass texture to ground
    ctx.fillStyle = 'rgba(186, 199, 176, 0.5)';  // Very soft green overlay
    for (let i = 0; i < canvasWidth; i += 20) {
      ctx.fillRect(i, canvasHeight - 30, 10, 5);
    }

    // Render safe zones (only non-activated ones)
    this.safeZones.forEach((zone, index) => {
      if (!zone.activated) {
        this.renderSafeZone(ctx, cameraX, index);
      }
    });

    // Render obstacles
    this.obstacles.forEach(obstacle => {
      const screenX = obstacle.x - cameraX;
      // Only render if on screen
      if (screenX + obstacle.width > 0 && screenX < canvasWidth) {
        ctx.save();
        ctx.translate(-cameraX, 0);
        obstacle.render(ctx);
        ctx.restore();
      }
    });

    // Render collectibles
    this.collectibles.forEach(collectible => {
      const screenX = collectible.x - cameraX;
      // Only render if on screen
      if (screenX + collectible.width > 0 && screenX < canvasWidth) {
        collectible.render(ctx, cameraX);
      }
    });
  }

  /**
   * Render parallax background clouds
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   * @param {number} cameraX - Camera X offset
   */
  renderClouds(ctx, canvasWidth, canvasHeight, cameraX) {
    this.clouds.forEach(cloud => {
      // Apply parallax effect (clouds move slower than camera)
      const parallaxX = cloud.x - (cameraX * cloud.speed);
      const screenX = parallaxX % (canvasWidth + cloud.size * 2) - cloud.size;

      ctx.save();
      ctx.globalAlpha = cloud.opacity * 0.4;  // More subtle, watercolor-like
      ctx.fillStyle = '#F8F5F0';  // Very soft off-white

      // Draw cloud as 3 overlapping circles
      ctx.beginPath();
      ctx.arc(screenX, cloud.y, cloud.size * 0.5, 0, Math.PI * 2);
      ctx.arc(screenX + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.6, 0, Math.PI * 2);
      ctx.arc(screenX + cloud.size * 1.2, cloud.y, cloud.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  /**
   * Render the safe zone
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} cameraX - Camera X offset
   * @param {number} zoneIndex - Index of safe zone to render
   */
  renderSafeZone(ctx, cameraX, zoneIndex) {
    const zone = this.safeZones[zoneIndex];
    if (!zone) return;

    const screenX = zone.x - cameraX;

    // Draw platform with soft glow effect
    ctx.save();
    ctx.shadowColor = 'rgba(200, 230, 208, 0.6)';  // Soft mint glow
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#C8E6D0'; // Soft mint green
    ctx.fillRect(screenX, zone.y, zone.width, zone.height);
    ctx.restore();

    // Add soft border
    ctx.strokeStyle = '#9BAA8C'; // Muted moss green
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, zone.y, zone.width, zone.height);

    // Add cloud-like texture (more subtle)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(screenX + 30, zone.y + 20, 20, 0, Math.PI * 2);
    ctx.arc(screenX + 60, zone.y + 20, 25, 0, Math.PI * 2);
    ctx.arc(screenX + 90, zone.y + 20, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Add text label (softer color)
    ctx.fillStyle = '#6B7A5F';  // Muted green
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SAFE', screenX + zone.width / 2, zone.y + zone.height / 2);
    ctx.fillText('ZONE', screenX + zone.width / 2, zone.y + zone.height / 2 + 15);
  }

  /**
   * Render the level start screen
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   */
  renderStartScreen(ctx, canvasWidth, canvasHeight) {
    // Semi-transparent overlay (softer)
    ctx.fillStyle = 'rgba(232, 213, 232, 0.6)';  // Soft lavender overlay
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = '#D9B382';  // Soft amber
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${this.levelNumber}`, canvasWidth / 2, canvasHeight / 2 - 50);

    ctx.fillStyle = '#8BA3B8';  // Dusty blue
    ctx.font = 'bold 32px Arial';
    ctx.fillText(this.levelName, canvasWidth / 2, canvasHeight / 2);

    // Instructions
    ctx.font = '20px Arial';
    ctx.fillStyle = '#6B7A7A';  // Muted slate
    ctx.fillText('Press SPACE to start', canvasWidth / 2, canvasHeight / 2 + 60);

    // Controls reminder
    ctx.font = '16px Arial';
    ctx.fillStyle = '#9BA3A8';  // Soft gray
    ctx.fillText('SPACE: Flap | ARROWS: Move | E: Use Ability', canvasWidth / 2, canvasHeight / 2 + 100);
  }

  /**
   * Render the safe zone pause screen
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   */
  renderSafeZoneScreen(ctx, canvasWidth, canvasHeight) {
    // Semi-transparent overlay (softer)
    ctx.fillStyle = 'rgba(200, 230, 208, 0.5)';  // Soft mint overlay
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = '#9BAA8C';  // Muted moss green
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Safe Zone', canvasWidth / 2, canvasHeight / 2 - 30);

    // Stats
    ctx.fillStyle = '#6B7A7A';  // Muted slate
    ctx.font = '24px Arial';
    ctx.fillText(`Feathers: ${this.feathersCollected} / ${this.totalFeathers}`, canvasWidth / 2, canvasHeight / 2 + 20);
    ctx.fillText(`Time: ${this.elapsedTime}s`, canvasWidth / 2, canvasHeight / 2 + 50);

    // Continue instruction
    ctx.font = '20px Arial';
    ctx.fillStyle = '#D9B382';  // Soft amber
    ctx.fillText('Press SPACE to continue', canvasWidth / 2, canvasHeight / 2 + 100);
  }

  /**
   * Render the level end screen
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   */
  renderEndScreen(ctx, canvasWidth, canvasHeight) {
    // Semi-transparent overlay (softer)
    ctx.fillStyle = 'rgba(232, 213, 232, 0.7)';  // Soft lavender overlay
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = '#D9B382';  // Soft amber
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Level Complete!', canvasWidth / 2, canvasHeight / 2 - 80);

    // Stats
    ctx.fillStyle = '#6B7A7A';  // Muted slate
    ctx.font = '28px Arial';
    ctx.fillText(`Feathers Collected: ${this.feathersCollected} / ${this.totalFeathers}`, canvasWidth / 2, canvasHeight / 2 - 10);
    ctx.fillText(`Time: ${this.elapsedTime}s`, canvasWidth / 2, canvasHeight / 2 + 30);

    // Completion percentage
    const percentage = Math.floor((this.feathersCollected / this.totalFeathers) * 100);
    ctx.fillStyle = percentage === 100 ? '#D9B382' : '#9BAA8C';  // Soft amber or muted moss
    ctx.font = '24px Arial';
    ctx.fillText(`Completion: ${percentage}%`, canvasWidth / 2, canvasHeight / 2 + 70);

    // Instructions
    ctx.fillStyle = '#9BA3A8';  // Soft gray
    ctx.font = '20px Arial';
    ctx.fillText('Press R to restart | Press M for menu', canvasWidth / 2, canvasHeight / 2 + 120);

    // Show unlock message for Level 2
    if (this.levelNumber === 1) {
      ctx.fillStyle = '#9BAA8C';  // Muted moss green
      ctx.font = 'bold 22px Arial';
      ctx.fillText('Level 2 Unlocked!', canvasWidth / 2, canvasHeight / 2 + 160);
    }
  }

  /**
   * Render the HUD (stats during gameplay)
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} canvasWidth - Canvas width
   */
  renderHUD(ctx, canvasWidth) {
    // Feather counter (top-right)
    ctx.fillStyle = '#F5F0E8';  // Soft off-white
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'right';
    ctx.strokeStyle = 'rgba(90, 90, 90, 0.4)';  // Soft charcoal with transparency
    ctx.lineWidth = 2;

    const featherText = `Feathers: ${this.feathersCollected}/${this.totalFeathers}`;
    ctx.strokeText(featherText, canvasWidth - 20, 40);
    ctx.fillText(featherText, canvasWidth - 20, 40);

    // Time (top-right, below feathers)
    const timeText = `Time: ${this.elapsedTime}s`;
    ctx.strokeText(timeText, canvasWidth - 20, 70);
    ctx.fillText(timeText, canvasWidth - 20, 70);

    // Unlocked abilities (top-left)
    if (this.unlockedAbilities.length > 0) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#D9B382';  // Soft amber
      ctx.font = 'bold 18px Arial';
      ctx.strokeText('Abilities:', 20, 30);
      ctx.fillText('Abilities:', 20, 30);

      ctx.font = '16px Arial';
      this.unlockedAbilities.forEach((ability, index) => {
        const abilityName = this.getAbilityDisplayName(ability);
        ctx.strokeText(`✓ ${abilityName}`, 20, 55 + (index * 22));
        ctx.fillText(`✓ ${abilityName}`, 20, 55 + (index * 22));
      });
    }

    // Reset text align
    ctx.textAlign = 'left';
  }

  /**
   * Get display name for an ability
   * @param {string} abilityId - Ability ID
   * @returns {string} Display name
   */
  getAbilityDisplayName(abilityId) {
    const abilityNames = {
      'speed_boost': 'Dive Bomb',
      'hover': 'Steady Hover',
      'extended_glide': 'Wind Rider',
      'endurance_flight': 'Marathon Wings',
      'echo_vision': 'Silent Hunter',
      'polar_stamina': 'Endless Journey'
    };
    return abilityNames[abilityId] || abilityId;
  }
}

export default Level;
