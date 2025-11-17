/**
 * AbilityIntegration.test.js
 * Integration tests that demonstrate the bug where GameCanvas.jsx overrides player.update()
 */

import AbilitySystem from './AbilitySystem';
import Player from './Player';
import Physics from './Physics';

describe('Ability Integration Bug', () => {
  let abilitySystem;
  let player;

  beforeEach(() => {
    abilitySystem = new AbilitySystem();
    player = new Player(100, 100);
    player.abilitySystem = abilitySystem;
  });

  describe('Bug Demonstration: Method Override', () => {
    test('BUG: Speed boost does NOT work when player.update is overridden (like in GameCanvas)', () => {
      abilitySystem.unlockAbility('speed_boost');
      abilitySystem.activateAbility('speed_boost');

      // Simulate what GameCanvas.jsx does - override the player.update method
      // This is the bug! GameCanvas.jsx lines 273-299
      const level = { width: 800 };
      const CANVAS_HEIGHT = 600;

      player.update = function() {
        // This is what GameCanvas.jsx does - it replaces the ability-aware update
        // with a simple version that just applies gravity
        this.velocityY += Physics.GRAVITY;
        this.velocityY = Math.min(this.velocityY, Physics.TERMINAL_VELOCITY);

        this.y += this.velocityY;
        this.x += this.velocityX;

        if (this.x < 0) {
          this.x = 0;
        }
        if (this.x + this.width > level.width) {
          this.x = level.width - this.width;
        }

        if (this.y < 0) {
          this.y = 0;
          this.velocityY = 0;
        }
        if (this.y + this.height > CANVAS_HEIGHT) {
          this.y = CANVAS_HEIGHT - this.height;
          this.velocityY = 0;
        }
      };

      // Now update the player
      player.update();

      // BUG: Speed boost should set velocityX to 15, but the override doesn't check abilities!
      // So velocityX remains 0 (or whatever it was before)
      // This test SHOULD fail because the bug prevents the ability from working
      expect(player.velocityX).toBe(15); // This will FAIL - demonstrating the bug
    });

    test('BUG: Speed boost does NOT enable obstacle breaking when player.update is overridden', () => {
      abilitySystem.unlockAbility('speed_boost');
      abilitySystem.activateAbility('speed_boost');

      // Simulate GameCanvas.jsx override
      const level = { width: 800 };
      const CANVAS_HEIGHT = 600;

      player.update = function() {
        this.velocityY += Physics.GRAVITY;
        this.velocityY = Math.min(this.velocityY, Physics.TERMINAL_VELOCITY);
        this.y += this.velocityY;
        this.x += this.velocityX;
      };

      player.update();

      // BUG: canBreakObstacles should be true, but the override never sets it
      expect(player.canBreakObstacles).toBe(true); // This will FAIL - demonstrating the bug
    });

    test('BUG: Hover does NOT freeze player when player.update is overridden', () => {
      abilitySystem.unlockAbility('hover');
      player.velocityY = 5; // Set some downward velocity
      abilitySystem.activateAbility('hover');

      // Simulate GameCanvas.jsx override
      const level = { width: 800 };
      const CANVAS_HEIGHT = 600;

      player.update = function() {
        // GameCanvas override applies gravity regardless of abilities
        this.velocityY += Physics.GRAVITY;
        this.velocityY = Math.min(this.velocityY, Physics.TERMINAL_VELOCITY);
        this.y += this.velocityY;
        this.x += this.velocityX;
      };

      player.update();

      // BUG: Hover should freeze velocityY at 0, but gravity was applied instead
      // velocityY should be 0, but it's actually 5 + GRAVITY
      expect(player.velocityY).toBe(0); // This will FAIL - demonstrating the bug
    });

    test('BUG: Extended glide does NOT apply upward drift when player.update is overridden', () => {
      abilitySystem.unlockAbility('extended_glide');
      abilitySystem.activateAbility('extended_glide');

      // Simulate GameCanvas.jsx override
      const level = { width: 800 };
      const CANVAS_HEIGHT = 600;

      player.update = function() {
        this.velocityY += Physics.GRAVITY;
        this.velocityY = Math.min(this.velocityY, Physics.TERMINAL_VELOCITY);
        this.y += this.velocityY;
        this.x += this.velocityX;
      };

      player.update();

      // BUG: Extended glide should set velocityY to -0.5, but gravity was applied instead
      expect(player.velocityY).toBe(-0.5); // This will FAIL - demonstrating the bug
    });
  });

  describe('CORRECT Behavior: Without Method Override', () => {
    test('CORRECT: Speed boost works when using original Player.update()', () => {
      abilitySystem.unlockAbility('speed_boost');
      abilitySystem.activateAbility('speed_boost');

      // Call the ORIGINAL player.update (not overridden)
      player.update(800, 600);

      // This PASSES because we're using the original update method
      expect(player.velocityX).toBe(15);
      expect(player.canBreakObstacles).toBe(true);
    });

    test('CORRECT: Hover works when using original Player.update()', () => {
      abilitySystem.unlockAbility('hover');
      player.velocityY = 5;
      abilitySystem.activateAbility('hover');

      // Call the ORIGINAL player.update (not overridden)
      player.update(800, 600);

      // This PASSES because we're using the original update method
      expect(player.velocityY).toBe(0);
      expect(player.velocityX).toBe(0);
    });

    test('CORRECT: Extended glide works when using original Player.update()', () => {
      abilitySystem.unlockAbility('extended_glide');
      abilitySystem.activateAbility('extended_glide');

      // Call the ORIGINAL player.update (not overridden)
      player.update(800, 600);

      // This PASSES because we're using the original update method
      expect(player.velocityY).toBe(-0.5);
    });
  });
});

describe('Root Cause Analysis', () => {
  test('Documentation: The bug is in GameCanvas.jsx lines 273-299', () => {
    // This test documents the root cause
    const bugLocation = 'GameCanvas.jsx:273-299';
    const bugDescription = 'player.update is overridden every frame, replacing ability-aware physics with basic gravity';
    const solution = 'Remove the override and call player.update(level.width, CANVAS_HEIGHT) directly, or modify the override to check abilities';

    expect(bugLocation).toBe('GameCanvas.jsx:273-299');
    expect(bugDescription).toContain('override');
    expect(solution).toContain('Remove the override');
  });
});
