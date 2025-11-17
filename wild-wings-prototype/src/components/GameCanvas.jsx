/**
 * GameCanvas.jsx
 * Main game canvas component with game loop and rendering
 */

import React, { useEffect, useRef, useState } from 'react';
import Player from '../game/Player';
import Level from '../game/Level';
import AbilitySystem from '../game/AbilitySystem';
import ElderEncounter from './ElderEncounter';
import gameStateManager from '../game/GameStateManager';

const GameCanvas = ({ levelNumber = 1, onReturnToMenu }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [showElderEncounter, setShowElderEncounter] = useState(false);
  const [currentElderEncounter, setCurrentElderEncounter] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Game state refs (using refs to avoid re-renders in game loop)
  const playerRef = useRef(null);
  const levelRef = useRef(null);
  const abilitySystemRef = useRef(null);
  const cameraRef = useRef({ x: 0 });
  const keysRef = useRef({});
  const animationFrameRef = useRef(null);
  const handlingCollisionRef = useRef(false);

  // Canvas dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  /**
   * Handle elder encounter completion (accessible from JSX)
   */
  const handleElderEncounterComplete = () => {
    const level = levelRef.current;
    const abilitySystem = abilitySystemRef.current;
    if (level) {
      level.completeElderEncounter();

      // Sync unlocked abilities to ability system
      if (abilitySystem) {
        level.unlockedAbilities.forEach(abilityId => {
          abilitySystem.unlockAbility(abilityId);
        });
      }
    }
    setShowElderEncounter(false);
    setCurrentElderEncounter(null);
  };

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Create player starting in the middle-left area
    playerRef.current = new Player(100, CANVAS_HEIGHT / 2 - 20);

    // Create ability system
    abilitySystemRef.current = new AbilitySystem();

    // Connect ability system to player
    playerRef.current.abilitySystem = abilitySystemRef.current;

    // Create level with specified level number
    levelRef.current = new Level(levelNumber);

    // Load previously unlocked abilities from game state
    const unlockedAbilities = gameStateManager.getUnlockedAbilities();
    unlockedAbilities.forEach(abilityId => {
      abilitySystemRef.current.unlockAbility(abilityId);
    });

    // Initialize camera
    cameraRef.current = { x: 0 };

    /**
     * Handle collision with obstacle
     */
    const handleCollision = () => {
      // Prevent multiple simultaneous collision handlers
      if (handlingCollisionRef.current) {
        return;
      }

      handlingCollisionRef.current = true;
      const player = playerRef.current;
      const level = levelRef.current;
      const abilitySystem = abilitySystemRef.current;

      // Trigger visual feedback
      if (player) {
        player.triggerCollisionFlash();
      }

      // Small delay to show flash before alert
      setTimeout(() => {
        setGameOver(true);
        alert(`Game Over!\n\nFeathers: ${level.feathersCollected}/${level.totalFeathers}\nTime: ${level.elapsedTime}s\n\nClick OK to restart.`);
        // Reset player
        if (player) {
          player.reset(100, CANVAS_HEIGHT / 2 - 20);
        }
        // Reset level
        if (level) {
          level.reset();
        }
        // Reset ability system (cooldowns, but keep unlocked abilities)
        if (abilitySystem) {
          abilitySystem.reset();
        }
        // Reset camera
        cameraRef.current.x = 0;
        // Reset game over state to restart the game
        setGameOver(false);
        // Reset collision flag to allow new game to detect collisions
        handlingCollisionRef.current = false;
      }, 100);
    };

    /**
     * Update camera to follow player
     */
    const updateCamera = () => {
      const player = playerRef.current;
      if (!player) return;

      // Keep player roughly in left-center of screen
      const targetCameraX = player.x - CANVAS_WIDTH / 3;

      // Smooth camera movement
      cameraRef.current.x += (targetCameraX - cameraRef.current.x) * 0.1;

      // Clamp camera to level bounds
      cameraRef.current.x = Math.max(0, cameraRef.current.x);
      const maxCameraX = levelRef.current.width - CANVAS_WIDTH;
      cameraRef.current.x = Math.min(cameraRef.current.x, maxCameraX);
    };

    /**
     * Update game state
     */
    const update = () => {
      const player = playerRef.current;
      const level = levelRef.current;
      const abilitySystem = abilitySystemRef.current;
      if (!player || !level || isPaused) return;

      // Update ability system
      if (abilitySystem) {
        abilitySystem.update();
      }

      // Handle level state
      if (level.state === 'start' || level.state === 'completed') {
        // Don't update gameplay in these states
        return;
      }

      if (level.state === 'safe_zone') {
        // Auto-land player in current safe zone
        const currentZone = level.safeZones[level.currentSafeZoneIndex];
        if (currentZone) {
          player.velocityY = 0;
          player.velocityX = 0;
          player.y = currentZone.y + currentZone.height - player.height - 5;
          player.x = currentZone.x + currentZone.width / 2 - player.width / 2;
        }

        // Check if there's an elder encounter to show
        const encounter = level.getCurrentEncounter();
        if (encounter && !level.encounterShown) {
          setCurrentElderEncounter(encounter);
          setShowElderEncounter(true);
        }

        return;
      }

      // Handle keyboard input (only during playing state)
      if (keysRef.current['ArrowLeft']) {
        player.moveLeft();
      } else if (keysRef.current['ArrowRight']) {
        player.moveRight();
      }

      if (keysRef.current['ArrowDown']) {
        player.moveDown();
      }

      // Update player physics (use level dimensions instead of canvas)
      player.update = function() {
        // Apply gravity
        this.velocityY += 0.5;
        this.velocityY = Math.min(this.velocityY, 10);

        // Update position
        this.y += this.velocityY;
        this.x += this.velocityX;

        // Keep player within horizontal bounds of level
        if (this.x < 0) {
          this.x = 0;
        }
        if (this.x + this.width > level.width) {
          this.x = level.width - this.width;
        }

        // Keep player within vertical bounds
        if (this.y < 0) {
          this.y = 0;
          this.velocityY = 0;
        }
        if (this.y + this.height > CANVAS_HEIGHT) {
          this.y = CANVAS_HEIGHT - this.height;
          this.velocityY = 0;
        }
      };
      player.update();

      // Update camera
      updateCamera();

      // Get player bounds for collision detection
      const playerBounds = player.getBounds();

      // Check collisions with obstacles (unless player can break through them)
      if (!player.canBreakObstacles) {
        for (let obstacle of level.obstacles) {
          if (obstacle.checkCollision(playerBounds)) {
            handleCollision();
            return;
          }
        }
      }

      // Check collisions with collectibles
      level.checkCollectibleCollision(playerBounds);

      // Update level
      level.update(player);
    };

    /**
     * Render game
     */
    const render = (ctx) => {
      const level = levelRef.current;
      const player = playerRef.current;
      if (!level || !player) return;

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Render level (background, obstacles, collectibles)
      level.render(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, cameraRef.current.x);

      // Render player (translate for camera)
      ctx.save();
      const playerScreenX = player.x - cameraRef.current.x;
      ctx.translate(playerScreenX - player.x, 0);
      player.render(ctx);
      ctx.restore();

      // Render HUD (if playing)
      if (level.state === 'playing') {
        level.renderHUD(ctx, CANVAS_WIDTH);

        // Render ability UI
        renderAbilityUI(ctx);

        // Draw controls hint (softer colors)
        ctx.font = '14px Arial';
        ctx.fillStyle = '#F5F0E8';  // Soft off-white
        ctx.strokeStyle = 'rgba(90, 90, 90, 0.4)';  // Soft charcoal
        ctx.lineWidth = 2;
        ctx.textAlign = 'left';
        const hint = 'SPACE: Flap | ARROWS: Move | E: Use Ability';
        ctx.strokeText(hint, 20, CANVAS_HEIGHT - 20);
        ctx.fillText(hint, 20, CANVAS_HEIGHT - 20);
      }

      // Render level state screens
      if (level.state === 'start') {
        level.renderStartScreen(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else if (level.state === 'safe_zone') {
        level.renderSafeZoneScreen(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else if (level.state === 'completed') {
        level.renderEndScreen(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    };

    /**
     * Render ability UI
     */
    const renderAbilityUI = (ctx) => {
      const abilitySystem = abilitySystemRef.current;
      if (!abilitySystem) return;

      const unlockedAbilities = abilitySystem.getUnlockedAbilities();
      if (unlockedAbilities.length === 0) return;

      const startX = CANVAS_WIDTH / 2 - (unlockedAbilities.length * 70) / 2;
      const startY = CANVAS_HEIGHT - 100;

      // Render each ability slot
      unlockedAbilities.forEach((abilityId, index) => {
        const abilityData = abilitySystem.getAbilityData(abilityId);
        const abilityState = abilitySystem.getAbilityState(abilityId);
        const isSelected = index === abilitySystem.selectedAbilityIndex;

        const x = startX + index * 75;
        const y = startY;
        const size = 50;

        // Background box (softer colors)
        ctx.fillStyle = isSelected ? '#D9B382' : '#8BA3B8';  // Soft amber or dusty blue
        ctx.globalAlpha = 0.8;  // Subtle transparency
        ctx.fillRect(x, y, size, size);
        ctx.globalAlpha = 1.0;

        // Border (softer)
        ctx.strokeStyle = isSelected ? '#C9A574' : '#6B8399';  // Muted tones
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);

        // Ability icon
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Gray out if on cooldown
        if (abilityState.state === 'cooldown') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(x, y, size, size);
        }

        // Active glow effect (softer)
        if (abilityState.state === 'active') {
          ctx.save();
          // Use softer glow color
          const softGlowColor = abilityData.color === '#4A90E2' ? '#8BA3B8' :
                                abilityData.color === '#E94B3C' ? '#D9A5A0' : '#A8B89F';
          ctx.shadowColor = softGlowColor;
          ctx.shadowBlur = 12;
          ctx.fillStyle = softGlowColor;
          ctx.globalAlpha = 0.6;
          ctx.fillRect(x, y, size, size);
          ctx.globalAlpha = 1.0;
          ctx.restore();
        }

        // Draw icon (softer colors)
        ctx.fillStyle = abilityState.state === 'ready' ? '#F5F0E8' : '#9BA3A8';  // Soft off-white or gray
        ctx.fillText(abilityData.icon, x + size / 2, y + size / 2);

        // Cooldown overlay
        if (abilityState.state === 'cooldown') {
          const cooldownHeight = (abilityState.cooldownPercent / 100) * size;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(x, y, size, cooldownHeight);

          // Cooldown timer text (softer colors)
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = '#F5F0E8';  // Soft off-white
          ctx.strokeStyle = 'rgba(90, 90, 90, 0.5)';  // Soft charcoal
          ctx.lineWidth = 2;
          ctx.strokeText(abilityState.cooldownRemaining + 's', x + size / 2, y + size / 2);
          ctx.fillText(abilityState.cooldownRemaining + 's', x + size / 2, y + size / 2);
        }

        // Number key indicator (softer)
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#F5F0E8';
        ctx.strokeStyle = 'rgba(90, 90, 90, 0.5)';
        ctx.lineWidth = 2;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.strokeText(index + 1, x + 3, y + 3);
        ctx.fillText(index + 1, x + 3, y + 3);

        // Ability name below (softer)
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#F5F0E8';
        ctx.strokeStyle = 'rgba(90, 90, 90, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeText(abilityData.name, x + size / 2, y + size + 5);
        ctx.fillText(abilityData.name, x + size / 2, y + size + 5);
      });

      // "Press E to use" hint if an ability is selected and ready
      const selectedAbilityId = abilitySystem.getSelectedAbility();
      if (selectedAbilityId) {
        const selectedState = abilitySystem.getAbilityState(selectedAbilityId);
        if (selectedState.state === 'ready') {
          const selectedData = abilitySystem.getAbilityData(selectedAbilityId);
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#D9B382';  // Soft amber
          ctx.strokeStyle = 'rgba(90, 90, 90, 0.4)';  // Soft charcoal
          ctx.lineWidth = 2;
          const text = `Press E to use ${selectedData.name}`;
          ctx.strokeText(text, CANVAS_WIDTH / 2, startY - 25);
          ctx.fillText(text, CANVAS_WIDTH / 2, startY - 25);
        }
      }
    };

    /**
     * Main game loop
     */
    const gameLoop = () => {
      if (!gameOver) {
        // Update game state
        update();

        // Render game (always render to show level state screens)
        render(ctx);

        // Continue loop
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    // Keyboard event handlers
    const handleKeyDown = (e) => {
      const level = levelRef.current;
      const player = playerRef.current;
      const abilitySystem = abilitySystemRef.current;

      // ESC key to toggle pause
      if (e.key === 'Escape') {
        e.preventDefault();
        if (level && (level.state === 'playing' || level.state === 'safe_zone')) {
          setIsPaused(prev => !prev);
        }
        return;
      }

      // F key to toggle fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Don't process other keys if paused
      if (isPaused) return;

      keysRef.current[e.key] = true;

      // Spacebar handling depends on level state
      if (e.key === ' ') {
        e.preventDefault();
        if (!gameOver && level && player) {
          // If elder encounter is showing, dismiss it
          if (showElderEncounter) {
            handleElderEncounterComplete();
            return;
          }

          if (level.state === 'start') {
            // Start the level
            level.start();
          } else if (level.state === 'safe_zone') {
            // Continue from safe zone
            level.continueFromSafeZone();
          } else if (level.state === 'playing') {
            // Flap
            player.flap();
          }
        }
      }

      // E key to activate selected ability
      if ((e.key === 'e' || e.key === 'E') && !showElderEncounter) {
        e.preventDefault();
        if (level && level.state === 'playing' && abilitySystem) {
          const selectedAbility = abilitySystem.getSelectedAbility();
          if (selectedAbility) {
            abilitySystem.activateAbility(selectedAbility);
          }
        }
      }

      // Number keys (1, 2, 3) to select abilities
      if (level && level.state === 'playing' && abilitySystem) {
        const keyNum = parseInt(e.key);
        if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 3) {
          e.preventDefault();
          abilitySystem.selectAbilityByIndex(keyNum - 1);
        }
      }

      // R key to restart from completed state
      if (e.key === 'r' || e.key === 'R') {
        if (level && level.state === 'completed') {
          e.preventDefault();
          player.reset(100, CANVAS_HEIGHT / 2 - 20);
          level.reset();
          cameraRef.current.x = 0;
          setLevelComplete(false);
          // Reload unlocked abilities
          const unlockedAbilities = gameStateManager.getUnlockedAbilities();
          if (abilitySystem) {
            abilitySystem.clearAll();
            unlockedAbilities.forEach(abilityId => {
              abilitySystem.unlockAbility(abilityId);
            });
          }
        }
      }

      // M key to return to menu from completed state
      if (e.key === 'm' || e.key === 'M') {
        if (level && level.state === 'completed' && onReturnToMenu) {
          e.preventDefault();
          onReturnToMenu();
        }
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;

      // Stop horizontal movement when arrow keys are released
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && playerRef.current) {
        playerRef.current.stopHorizontal();
      }
    };

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Start game loop
    gameLoop();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, isPaused, levelNumber]);

  // Watch for level completion and save progress
  useEffect(() => {
    const checkLevelCompletion = setInterval(() => {
      const level = levelRef.current;
      if (level && level.state === 'completed' && !levelComplete) {
        // Save level completion
        gameStateManager.completeLevel(levelNumber, {
          time: level.elapsedTime,
          feathers: level.feathersCollected,
          totalFeathers: level.totalFeathers
        });

        // Save unlocked abilities
        level.unlockedAbilities.forEach(abilityId => {
          gameStateManager.unlockAbility(abilityId);
        });

        setLevelComplete(true);
      }
    }, 100);

    return () => clearInterval(checkLevelCompletion);
  }, [levelNumber, levelComplete]);

  return (
    <div ref={containerRef} style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Wild Wings</h1>
        <button
          onClick={toggleFullscreen}
          style={styles.fullscreenButton}
          onMouseOver={(e) => e.target.style.backgroundColor = '#6B8399'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#8BA3B8'}
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? '⊗' : '⛶'}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={styles.canvas}
      />
      <div style={styles.info}>
        <p>Use SPACEBAR to flap and gain altitude</p>
        <p>Use ARROW KEYS to move left, right, or descend</p>
        <p>Collect golden feathers and reach the safe zone!</p>
        <p>Avoid the brown tree branches!</p>
        <p>Press F to toggle fullscreen mode</p>
      </div>

      {/* Elder Encounter Overlay */}
      {showElderEncounter && currentElderEncounter && (
        <ElderEncounter
          birdFact={currentElderEncounter}
          onContinue={handleElderEncounterComplete}
        />
      )}

      {/* Pause Menu Overlay */}
      {isPaused && (
        <div style={pauseStyles.overlay}>
          <div style={pauseStyles.menu}>
            <h2 style={pauseStyles.title}>Paused</h2>
            <div style={pauseStyles.buttonContainer}>
              <button
                style={pauseStyles.button}
                onClick={() => setIsPaused(false)}
                onMouseOver={(e) => e.target.style.backgroundColor = '#8A9A7D'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#9BAA8C'}
              >
                Resume (ESC)
              </button>
              <button
                style={{...pauseStyles.button, ...pauseStyles.secondaryButton}}
                onClick={() => {
                  if (window.confirm('Return to main menu? Progress will be saved.')) {
                    onReturnToMenu();
                  }
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#7A93A9'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#8BA3B8'}
              >
                Main Menu
              </button>
            </div>
            <p style={pauseStyles.hint}>Press ESC to resume</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#E8D5E8',  // Soft lavender background
    padding: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px'
  },
  title: {
    color: '#6B7A7A',  // Muted slate
    fontSize: '48px',
    margin: '0',
    fontFamily: 'Arial, sans-serif',
    textShadow: '2px 2px 4px rgba(232, 213, 232, 0.3)'  // Soft shadow
  },
  fullscreenButton: {
    backgroundColor: '#8BA3B8',  // Dusty blue
    color: '#F5F0E8',  // Soft off-white
    border: 'none',
    borderRadius: '8px',
    width: '50px',
    height: '50px',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 8px rgba(139, 163, 184, 0.3)',  // Soft shadow
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  canvas: {
    border: '4px solid #C8B8C8',  // Soft mauve border
    borderRadius: '8px',
    boxShadow: '0 8px 16px rgba(107, 122, 122, 0.2)',  // Very soft shadow
    backgroundColor: '#E8D5E8'  // Match background
  },
  info: {
    marginTop: '20px',
    color: '#6B7A7A',  // Muted slate
    textAlign: 'center',
    fontSize: '16px',
    lineHeight: '1.6'
  }
};

const pauseStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(232, 213, 232, 0.7)',  // Soft lavender overlay
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  },
  menu: {
    backgroundColor: '#F5F0E8',  // Soft off-white
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(107, 122, 122, 0.3)',  // Soft shadow
    textAlign: 'center',
    minWidth: '400px'
  },
  title: {
    color: '#6B7A7A',  // Muted slate
    fontSize: '48px',
    margin: '0 0 30px 0',
    fontWeight: 'bold'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px'
  },
  button: {
    backgroundColor: '#9BAA8C',  // Muted moss green
    color: '#F5F0E8',  // Soft off-white
    border: 'none',
    padding: '15px 30px',
    borderRadius: '30px',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 8px rgba(155, 170, 140, 0.3)'  // Soft shadow
  },
  secondaryButton: {
    backgroundColor: '#8BA3B8'  // Dusty blue
  },
  hint: {
    color: '#9BA3A8',  // Soft gray
    fontSize: '14px',
    margin: '0',
    fontStyle: 'italic'
  }
};

export default GameCanvas;
