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
   * Create the level layout with obstacles and collectibles
   */
  createLevelLayout() {
    if (this.levelNumber === 1) {
      this.createLevel1();
    } else if (this.levelNumber === 2) {
      this.createLevel2();
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

    // Create obstacles for Level 1 (easy to medium difficulty)
    this.obstacles = [
      // Starting area - easy obstacles
      new Obstacle(300, 80, 70, 100),
      new Obstacle(250, 400, 80, 120),

      // Early section
      new Obstacle(500, 150, 60, 120),
      new Obstacle(520, 350, 75, 150),

      // Before safe zone
      new Obstacle(750, 50, 65, 140),
      new Obstacle(800, 420, 70, 100),
      new Obstacle(950, 200, 80, 130),

      // Around safe zone (gaps for entry/exit)
      new Obstacle(1050, 80, 60, 100),
      new Obstacle(1450, 100, 70, 120),
      new Obstacle(1500, 380, 75, 140),

      // After safe zone - medium difficulty
      new Obstacle(1700, 150, 65, 150),
      new Obstacle(1750, 400, 80, 120),
      new Obstacle(1900, 250, 70, 100),
      new Obstacle(2000, 90, 75, 140),
      new Obstacle(2050, 440, 70, 100),

      // End section
      new Obstacle(2200, 180, 65, 130),
      new Obstacle(2250, 380, 80, 150)
    ];

    // Create collectibles (wind feathers) - 15 total
    const featherPositions = [
      // Starting area - easy to reach
      { x: 350, y: 250 },
      { x: 450, y: 180 },

      // Early section
      { x: 600, y: 280 },
      { x: 700, y: 150 },
      { x: 650, y: 420 },

      // Before safe zone
      { x: 850, y: 300 },
      { x: 1000, y: 380 },

      // Near safe zone
      { x: 1150, y: 250 },

      // After safe zone - requires more skill
      { x: 1600, y: 200 },
      { x: 1650, y: 330 },
      { x: 1800, y: 180 },
      { x: 1950, y: 350 },

      // End section - challenging
      { x: 2100, y: 280 },
      { x: 2150, y: 420 },
      { x: 2300, y: 300 }
    ];

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

    // Create obstacles for Level 2 (harder - 23 obstacles with tighter gaps)
    this.obstacles = [
      // Starting area - tighter gaps immediately
      new Obstacle(250, 60, 70, 140),
      new Obstacle(280, 380, 75, 160),
      new Obstacle(400, 200, 65, 100),

      // Early section - vertical challenges
      new Obstacle(550, 50, 60, 180),
      new Obstacle(580, 400, 70, 150),
      new Obstacle(700, 150, 75, 120),
      new Obstacle(720, 350, 80, 140),

      // Before first safe zone - requires abilities
      new Obstacle(850, 80, 65, 160),
      new Obstacle(900, 420, 70, 120),
      new Obstacle(1000, 200, 60, 140),
      new Obstacle(1250, 100, 70, 130),

      // Between safe zones - challenging corridors
      new Obstacle(1400, 50, 65, 170),
      new Obstacle(1450, 400, 75, 150),
      new Obstacle(1600, 120, 70, 140),
      new Obstacle(1650, 380, 80, 160),
      new Obstacle(1800, 180, 65, 120),
      new Obstacle(1850, 350, 70, 140),
      new Obstacle(1950, 80, 75, 150),
      new Obstacle(2000, 420, 70, 130),
      new Obstacle(2100, 200, 65, 130),

      // After second safe zone - final challenge
      new Obstacle(2400, 100, 70, 160),
      new Obstacle(2450, 400, 75, 140),
      new Obstacle(2600, 150, 65, 180)
    ];

    // Create collectibles - 20 feathers with some in tight spots
    const featherPositions = [
      // Starting area
      { x: 330, y: 280 },
      { x: 480, y: 150 },

      // Early section - some require precise flying
      { x: 620, y: 310 },
      { x: 750, y: 90 },
      { x: 780, y: 480 },
      { x: 930, y: 320 },

      // Before first safe zone
      { x: 1050, y: 380 },
      { x: 1150, y: 200 },

      // Between safe zones - challenging positions
      { x: 1500, y: 280 },
      { x: 1550, y: 100 },
      { x: 1700, y: 450 },
      { x: 1880, y: 310 },
      { x: 1920, y: 480 },
      { x: 2050, y: 360 },
      { x: 2150, y: 150 },

      // After second safe zone
      { x: 2350, y: 320 },
      { x: 2480, y: 280 },
      { x: 2550, y: 420 },
      { x: 2650, y: 380 },
      { x: 2700, y: 250 }
    ];

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
    let encounterIndex;

    if (this.levelNumber === 1) {
      encounterIndex = 0; // Always Peregrine Falcon for Level 1
    } else if (this.levelNumber === 2) {
      // First safe zone: Hummingbird, Second safe zone: Albatross
      encounterIndex = this.currentSafeZoneIndex + 1;
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
    // Draw background (sky with gradient)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#B0D8F0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw parallax clouds
    this.renderClouds(ctx, canvasWidth, canvasHeight, cameraX);

    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvasHeight - 30, canvasWidth, 30);

    // Add grass texture to ground
    ctx.fillStyle = '#32CD32';
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
      ctx.globalAlpha = cloud.opacity;
      ctx.fillStyle = '#FFFFFF';

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

    // Draw platform with glow effect
    ctx.save();
    ctx.shadowColor = '#90EE90';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#90EE90'; // Light green
    ctx.fillRect(screenX, zone.y, zone.width, zone.height);
    ctx.restore();

    // Add border
    ctx.strokeStyle = '#228B22'; // Forest green
    ctx.lineWidth = 3;
    ctx.strokeRect(screenX, zone.y, zone.width, zone.height);

    // Add cloud-like texture
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(screenX + 30, zone.y + 20, 20, 0, Math.PI * 2);
    ctx.arc(screenX + 60, zone.y + 20, 25, 0, Math.PI * 2);
    ctx.arc(screenX + 90, zone.y + 20, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Add text label
    ctx.fillStyle = '#228B22';
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
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${this.levelNumber}`, canvasWidth / 2, canvasHeight / 2 - 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(this.levelName, canvasWidth / 2, canvasHeight / 2);

    // Instructions
    ctx.font = '20px Arial';
    ctx.fillText('Press SPACE to start', canvasWidth / 2, canvasHeight / 2 + 60);

    // Controls reminder
    ctx.font = '16px Arial';
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText('SPACE: Flap | ARROWS: Move | E: Use Ability', canvasWidth / 2, canvasHeight / 2 + 100);
  }

  /**
   * Render the safe zone pause screen
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   */
  renderSafeZoneScreen(ctx, canvasWidth, canvasHeight) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = '#90EE90';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Safe Zone', canvasWidth / 2, canvasHeight / 2 - 30);

    // Stats
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Feathers: ${this.feathersCollected} / ${this.totalFeathers}`, canvasWidth / 2, canvasHeight / 2 + 20);
    ctx.fillText(`Time: ${this.elapsedTime}s`, canvasWidth / 2, canvasHeight / 2 + 50);

    // Continue instruction
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('Press SPACE to continue', canvasWidth / 2, canvasHeight / 2 + 100);
  }

  /**
   * Render the level end screen
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   */
  renderEndScreen(ctx, canvasWidth, canvasHeight) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Level Complete!', canvasWidth / 2, canvasHeight / 2 - 80);

    // Stats
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px Arial';
    ctx.fillText(`Feathers Collected: ${this.feathersCollected} / ${this.totalFeathers}`, canvasWidth / 2, canvasHeight / 2 - 10);
    ctx.fillText(`Time: ${this.elapsedTime}s`, canvasWidth / 2, canvasHeight / 2 + 30);

    // Completion percentage
    const percentage = Math.floor((this.feathersCollected / this.totalFeathers) * 100);
    ctx.fillStyle = percentage === 100 ? '#FFD700' : '#90EE90';
    ctx.font = '24px Arial';
    ctx.fillText(`Completion: ${percentage}%`, canvasWidth / 2, canvasHeight / 2 + 70);

    // Instructions
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '20px Arial';
    ctx.fillText('Press R to restart | Press M for menu', canvasWidth / 2, canvasHeight / 2 + 120);

    // Show unlock message for Level 2
    if (this.levelNumber === 1) {
      ctx.fillStyle = '#2ECC71';
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
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'right';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;

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
      ctx.fillStyle = '#FFD700';
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
      'extended_glide': 'Wind Rider'
    };
    return abilityNames[abilityId] || abilityId;
  }
}

export default Level;
