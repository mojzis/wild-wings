/**
 * AbilitySystem.test.js
 * Tests for the ability system and ability application
 */

import AbilitySystem from './AbilitySystem';
import Player from './Player';

describe('AbilitySystem', () => {
  let abilitySystem;
  let player;

  beforeEach(() => {
    abilitySystem = new AbilitySystem();
    player = new Player(100, 100);
    player.abilitySystem = abilitySystem;
  });

  describe('Ability Unlocking', () => {
    test('should unlock speed_boost ability', () => {
      abilitySystem.unlockAbility('speed_boost');
      expect(abilitySystem.getUnlockedAbilities()).toContain('speed_boost');
    });

    test('should unlock hover ability', () => {
      abilitySystem.unlockAbility('hover');
      expect(abilitySystem.getUnlockedAbilities()).toContain('hover');
    });

    test('should unlock extended_glide ability', () => {
      abilitySystem.unlockAbility('extended_glide');
      expect(abilitySystem.getUnlockedAbilities()).toContain('extended_glide');
    });

    test('should auto-select newly unlocked ability', () => {
      abilitySystem.unlockAbility('speed_boost');
      expect(abilitySystem.getSelectedAbility()).toBe('speed_boost');
    });
  });

  describe('Ability Activation', () => {
    test('should activate speed_boost when unlocked and ready', () => {
      abilitySystem.unlockAbility('speed_boost');
      const result = abilitySystem.activateAbility('speed_boost');
      expect(result).toBe(true);
      expect(abilitySystem.getActiveAbility()).toBe('speed_boost');
    });

    test('should activate hover when unlocked and ready', () => {
      abilitySystem.unlockAbility('hover');
      const result = abilitySystem.activateAbility('hover');
      expect(result).toBe(true);
      expect(abilitySystem.getActiveAbility()).toBe('hover');
    });

    test('should activate extended_glide when unlocked and ready', () => {
      abilitySystem.unlockAbility('extended_glide');
      const result = abilitySystem.activateAbility('extended_glide');
      expect(result).toBe(true);
      expect(abilitySystem.getActiveAbility()).toBe('extended_glide');
    });

    test('should not activate locked ability', () => {
      const result = abilitySystem.activateAbility('speed_boost');
      expect(result).toBe(false);
      expect(abilitySystem.getActiveAbility()).toBeNull();
    });

    test('should not activate ability on cooldown', () => {
      abilitySystem.unlockAbility('speed_boost');
      abilitySystem.activateAbility('speed_boost');

      // Fast-forward time to end active period and start cooldown
      jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 4000);
      abilitySystem.update();

      // Try to activate again (should fail - on cooldown)
      const result = abilitySystem.activateAbility('speed_boost');
      expect(result).toBe(false);

      jest.restoreAllMocks();
    });
  });

  describe('Ability State Transitions', () => {
    test('should transition from active to cooldown after duration', () => {
      abilitySystem.unlockAbility('speed_boost');
      const startTime = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(startTime);

      abilitySystem.activateAbility('speed_boost');
      expect(abilitySystem.getActiveAbility()).toBe('speed_boost');

      // Fast-forward past ability duration (3000ms)
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 3100);
      abilitySystem.update();

      expect(abilitySystem.getActiveAbility()).toBeNull();
      const state = abilitySystem.getAbilityState('speed_boost');
      expect(state.state).toBe('cooldown');

      jest.restoreAllMocks();
    });

    test('should transition from cooldown to ready after cooldown period', () => {
      abilitySystem.unlockAbility('speed_boost');
      const startTime = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(startTime);

      abilitySystem.activateAbility('speed_boost');

      // Fast-forward past ability duration (3000ms) to cooldown
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 3100);
      abilitySystem.update();

      // Fast-forward past cooldown period (10000ms total)
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 13100);
      abilitySystem.update();

      const state = abilitySystem.getAbilityState('speed_boost');
      expect(state.state).toBe('ready');
      expect(abilitySystem.canActivate('speed_boost')).toBe(true);

      jest.restoreAllMocks();
    });
  });

  describe('Player Physics - Speed Boost', () => {
    test('should apply speed boost velocity when active', () => {
      abilitySystem.unlockAbility('speed_boost');
      abilitySystem.activateAbility('speed_boost');

      // Update player physics
      player.update(800, 600);

      // Speed boost should set velocityX to 15
      expect(player.velocityX).toBe(15);
    });

    test('should enable obstacle breaking during speed boost', () => {
      abilitySystem.unlockAbility('speed_boost');
      abilitySystem.activateAbility('speed_boost');

      // Update player physics
      player.update(800, 600);

      // Speed boost should enable obstacle breaking
      expect(player.canBreakObstacles).toBe(true);
    });

    test('should create trail particles during speed boost', () => {
      abilitySystem.unlockAbility('speed_boost');
      abilitySystem.activateAbility('speed_boost');

      // Clear any existing particles
      player.particles = [];

      // Update player multiple times
      for (let i = 0; i < 10; i++) {
        player.update(800, 600);
      }

      // Should have created some trail particles
      expect(player.particles.length).toBeGreaterThan(0);
      const trailParticles = player.particles.filter(p => p.type === 'trail');
      expect(trailParticles.length).toBeGreaterThan(0);
    });
  });

  describe('Player Physics - Hover', () => {
    test('should freeze velocityX during hover', () => {
      abilitySystem.unlockAbility('hover');
      player.velocityX = 5; // Set some initial velocity

      abilitySystem.activateAbility('hover');
      player.update(800, 600);

      // Hover should freeze horizontal movement
      expect(player.velocityX).toBe(0);
    });

    test('should freeze velocityY during hover', () => {
      abilitySystem.unlockAbility('hover');
      player.velocityY = 5; // Set some initial velocity

      abilitySystem.activateAbility('hover');
      player.update(800, 600);

      // Hover should freeze vertical movement (no gravity)
      expect(player.velocityY).toBe(0);
    });

    test('should create hover particles during hover', () => {
      abilitySystem.unlockAbility('hover');
      abilitySystem.activateAbility('hover');

      // Clear any existing particles
      player.particles = [];

      // Update player multiple times (more iterations to account for 30% random chance)
      for (let i = 0; i < 50; i++) {
        player.update(800, 600);
      }

      // Should have created some hover particles
      expect(player.particles.length).toBeGreaterThan(0);
      const hoverParticles = player.particles.filter(p => p.type === 'hover');
      expect(hoverParticles.length).toBeGreaterThan(0);
    });
  });

  describe('Player Physics - Extended Glide', () => {
    test('should apply upward drift during extended glide', () => {
      abilitySystem.unlockAbility('extended_glide');
      abilitySystem.activateAbility('extended_glide');

      player.update(800, 600);

      // Extended glide should set velocityY to -0.5 (gentle upward drift)
      expect(player.velocityY).toBe(-0.5);
    });

    test('should prevent gravity during extended glide', () => {
      abilitySystem.unlockAbility('extended_glide');
      player.velocityY = 5; // Set some initial downward velocity

      abilitySystem.activateAbility('extended_glide');
      player.update(800, 600);

      // Extended glide should override gravity with upward drift
      expect(player.velocityY).toBe(-0.5);
    });

    test('should create glide particles during extended glide', () => {
      abilitySystem.unlockAbility('extended_glide');
      abilitySystem.activateAbility('extended_glide');

      // Clear any existing particles
      player.particles = [];

      // Update player multiple times
      for (let i = 0; i < 10; i++) {
        player.update(800, 600);
      }

      // Should have created some glide particles
      expect(player.particles.length).toBeGreaterThan(0);
      const glideParticles = player.particles.filter(p => p.type === 'glide');
      expect(glideParticles.length).toBeGreaterThan(0);
    });
  });

  describe('Ability Expiration', () => {
    test('should stop applying speed boost effects after ability expires', () => {
      abilitySystem.unlockAbility('speed_boost');
      const startTime = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(startTime);

      abilitySystem.activateAbility('speed_boost');
      player.update(800, 600);
      expect(player.velocityX).toBe(15);
      expect(player.canBreakObstacles).toBe(true);

      // Fast-forward past ability duration
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 3100);
      abilitySystem.update();

      // Update player - ability should no longer be active
      player.update(800, 600);
      expect(player.canBreakObstacles).toBe(false);

      jest.restoreAllMocks();
    });

    test('should stop applying hover effects after ability expires', () => {
      abilitySystem.unlockAbility('hover');
      const startTime = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(startTime);

      abilitySystem.activateAbility('hover');
      player.velocityY = 5;
      player.update(800, 600);
      expect(player.velocityY).toBe(0);

      // Fast-forward past ability duration
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 3100);
      abilitySystem.update();

      // Update player - gravity should apply again
      player.velocityY = 5;
      player.update(800, 600);
      expect(player.velocityY).toBeGreaterThan(0); // Gravity should have increased it

      jest.restoreAllMocks();
    });
  });

  describe('Multiple Abilities', () => {
    test('should only allow one ability active at a time', () => {
      abilitySystem.unlockAbility('speed_boost');
      abilitySystem.unlockAbility('hover');

      abilitySystem.activateAbility('speed_boost');
      expect(abilitySystem.getActiveAbility()).toBe('speed_boost');

      // Try to activate another ability while one is active
      const result = abilitySystem.activateAbility('hover');
      expect(result).toBe(false);
      expect(abilitySystem.getActiveAbility()).toBe('speed_boost');
    });

    test('should allow selecting different abilities with number keys', () => {
      abilitySystem.unlockAbility('speed_boost');
      abilitySystem.unlockAbility('hover');
      abilitySystem.unlockAbility('extended_glide');

      abilitySystem.selectAbilityByIndex(0);
      expect(abilitySystem.getSelectedAbility()).toBe('speed_boost');

      abilitySystem.selectAbilityByIndex(1);
      expect(abilitySystem.getSelectedAbility()).toBe('hover');

      abilitySystem.selectAbilityByIndex(2);
      expect(abilitySystem.getSelectedAbility()).toBe('extended_glide');
    });
  });
});
