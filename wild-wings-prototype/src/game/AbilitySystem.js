/**
 * AbilitySystem.js
 * Manages player abilities, cooldowns, and effects
 */

const ABILITIES = {
  speed_boost: {
    id: 'speed_boost',
    name: 'Dive Bomb',
    duration: 3000, // 3 seconds
    cooldown: 10000, // 10 seconds
    icon: '⚡',
    color: '#4A90E2'
  },
  hover: {
    id: 'hover',
    name: 'Steady Hover',
    duration: 3000, // 3 seconds
    cooldown: 8000, // 8 seconds
    icon: '🌸',
    color: '#E94B3C'
  },
  extended_glide: {
    id: 'extended_glide',
    name: 'Wind Rider',
    duration: 5000, // 5 seconds
    cooldown: 12000, // 12 seconds
    icon: '🌊',
    color: '#7ED321'
  },
  endurance_flight: {
    id: 'endurance_flight',
    name: 'Marathon Wings',
    duration: 5000, // 5 seconds
    cooldown: 15000, // 15 seconds
    icon: '🌅',
    color: '#FF6B35'
  },
  echo_vision: {
    id: 'echo_vision',
    name: 'Silent Hunter',
    duration: 4000, // 4 seconds
    cooldown: 10000, // 10 seconds
    icon: '👂',
    color: '#C7A27C'
  },
  polar_stamina: {
    id: 'polar_stamina',
    name: 'Endless Journey',
    duration: 6000, // 6 seconds
    cooldown: 18000, // 18 seconds
    icon: '❄️',
    color: '#5BC0EB'
  }
};

class AbilitySystem {
  constructor() {
    // Unlocked abilities (ability IDs)
    this.unlockedAbilities = [];

    // Ability states: { abilityId: { state: 'ready|active|cooldown', cooldownEnd: timestamp, activeEnd: timestamp } }
    this.abilityStates = {};

    // Currently selected ability
    this.selectedAbilityIndex = 0;

    // Currently active ability (only one can be active at a time)
    this.activeAbility = null;

    // Visual effects state
    this.effects = [];
  }

  /**
   * Unlock an ability
   * @param {string} abilityId - The ability to unlock
   */
  unlockAbility(abilityId) {
    if (!this.unlockedAbilities.includes(abilityId) && ABILITIES[abilityId]) {
      this.unlockedAbilities.push(abilityId);
      this.abilityStates[abilityId] = {
        state: 'ready',
        cooldownEnd: 0,
        activeEnd: 0
      };
      // Auto-select the most recently unlocked ability
      this.selectedAbilityIndex = this.unlockedAbilities.length - 1;
    }
  }

  /**
   * Get the currently selected ability
   * @returns {string|null} The selected ability ID
   */
  getSelectedAbility() {
    if (this.unlockedAbilities.length === 0) return null;
    return this.unlockedAbilities[this.selectedAbilityIndex];
  }

  /**
   * Select ability by index
   * @param {number} index - Index of the ability to select
   */
  selectAbilityByIndex(index) {
    if (index >= 0 && index < this.unlockedAbilities.length) {
      this.selectedAbilityIndex = index;
    }
  }

  /**
   * Cycle to next ability
   */
  cycleAbility() {
    if (this.unlockedAbilities.length > 0) {
      this.selectedAbilityIndex = (this.selectedAbilityIndex + 1) % this.unlockedAbilities.length;
    }
  }

  /**
   * Check if an ability can be activated
   * @param {string} abilityId - The ability to check
   * @returns {boolean} True if the ability can be activated
   */
  canActivate(abilityId) {
    if (!abilityId || !this.abilityStates[abilityId]) return false;
    const state = this.abilityStates[abilityId];
    return state.state === 'ready' && !this.activeAbility;
  }

  /**
   * Activate an ability
   * @param {string} abilityId - The ability to activate
   * @returns {boolean} True if activation was successful
   */
  activateAbility(abilityId) {
    if (!this.canActivate(abilityId)) return false;

    const ability = ABILITIES[abilityId];
    if (!ability) return false;

    const now = Date.now();
    this.abilityStates[abilityId] = {
      state: 'active',
      cooldownEnd: 0,
      activeEnd: now + ability.duration
    };
    this.activeAbility = abilityId;

    return true;
  }

  /**
   * Update ability states (call every frame)
   */
  update() {
    const now = Date.now();

    // Update active ability
    if (this.activeAbility) {
      const state = this.abilityStates[this.activeAbility];
      if (state && now >= state.activeEnd) {
        // Ability ended, start cooldown
        const ability = ABILITIES[this.activeAbility];
        state.state = 'cooldown';
        state.cooldownEnd = now + ability.cooldown;
        this.activeAbility = null;
      }
    }

    // Update cooldowns
    Object.keys(this.abilityStates).forEach(abilityId => {
      const state = this.abilityStates[abilityId];
      if (state.state === 'cooldown' && now >= state.cooldownEnd) {
        state.state = 'ready';
        state.cooldownEnd = 0;
      }
    });
  }

  /**
   * Get ability state for display
   * @param {string} abilityId - The ability to check
   * @returns {Object} State object with { state, cooldownPercent, activePercent }
   */
  getAbilityState(abilityId) {
    if (!this.abilityStates[abilityId]) {
      return { state: 'locked', cooldownPercent: 0, activePercent: 0 };
    }

    const state = this.abilityStates[abilityId];
    const ability = ABILITIES[abilityId];
    const now = Date.now();

    let cooldownPercent = 0;
    let activePercent = 0;

    if (state.state === 'cooldown') {
      const cooldownRemaining = state.cooldownEnd - now;
      cooldownPercent = Math.max(0, (cooldownRemaining / ability.cooldown) * 100);
    } else if (state.state === 'active') {
      const activeRemaining = state.activeEnd - now;
      activePercent = Math.max(0, (activeRemaining / ability.duration) * 100);
    }

    return {
      state: state.state,
      cooldownPercent,
      activePercent,
      cooldownRemaining: state.state === 'cooldown' ? Math.ceil((state.cooldownEnd - now) / 1000) : 0
    };
  }

  /**
   * Get all unlocked abilities
   * @returns {Array} Array of ability IDs
   */
  getUnlockedAbilities() {
    return [...this.unlockedAbilities];
  }

  /**
   * Get ability data
   * @param {string} abilityId - The ability to get data for
   * @returns {Object} Ability data
   */
  getAbilityData(abilityId) {
    return ABILITIES[abilityId];
  }

  /**
   * Check if an ability is currently active
   * @param {string} abilityId - The ability to check
   * @returns {boolean} True if the ability is active
   */
  isActive(abilityId) {
    return this.activeAbility === abilityId;
  }

  /**
   * Get the currently active ability
   * @returns {string|null} The active ability ID
   */
  getActiveAbility() {
    return this.activeAbility;
  }

  /**
   * Reset all abilities (for level reset)
   */
  reset() {
    // Reset states but keep unlocked abilities
    Object.keys(this.abilityStates).forEach(abilityId => {
      this.abilityStates[abilityId] = {
        state: 'ready',
        cooldownEnd: 0,
        activeEnd: 0
      };
    });
    this.activeAbility = null;
  }

  /**
   * Clear all unlocked abilities (for full game reset)
   */
  clearAll() {
    this.unlockedAbilities = [];
    this.abilityStates = {};
    this.selectedAbilityIndex = 0;
    this.activeAbility = null;
    this.effects = [];
  }
}

export default AbilitySystem;
