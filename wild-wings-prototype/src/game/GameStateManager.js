/**
 * GameStateManager.js
 * Manages game progress, level unlocking, and save/load functionality
 */

class GameStateManager {
  constructor() {
    this.STORAGE_KEY = 'wildWingsGameState';
    this.state = this.loadState();
  }

  /**
   * Get default game state
   */
  getDefaultState() {
    return {
      unlockedLevels: [1], // Level 1 is always unlocked
      completedLevels: [],
      unlockedAbilities: [], // Global unlocked abilities across all levels
      levelStats: {}, // Stats for each level { levelNumber: { bestTime, bestFeathers, completions } }
      firstPlay: true
    };
  }

  /**
   * Load game state from localStorage
   */
  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        // Merge with default state to ensure all properties exist
        return { ...this.getDefaultState(), ...state };
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
    return this.getDefaultState();
  }

  /**
   * Save game state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }

  /**
   * Check if a level is unlocked
   * @param {number} levelNumber - Level to check
   * @returns {boolean} True if unlocked
   */
  isLevelUnlocked(levelNumber) {
    return this.state.unlockedLevels.includes(levelNumber);
  }

  /**
   * Check if a level is completed
   * @param {number} levelNumber - Level to check
   * @returns {boolean} True if completed
   */
  isLevelCompleted(levelNumber) {
    return this.state.completedLevels.includes(levelNumber);
  }

  /**
   * Complete a level (unlock next level if applicable)
   * @param {number} levelNumber - Level completed
   * @param {Object} stats - Level completion stats { time, feathers, totalFeathers }
   */
  completeLevel(levelNumber, stats) {
    // Mark level as completed
    if (!this.state.completedLevels.includes(levelNumber)) {
      this.state.completedLevels.push(levelNumber);
    }

    // Unlock next level
    const nextLevel = levelNumber + 1;
    if (!this.state.unlockedLevels.includes(nextLevel)) {
      this.state.unlockedLevels.push(nextLevel);
    }

    // Update level stats
    if (!this.state.levelStats[levelNumber]) {
      this.state.levelStats[levelNumber] = {
        bestTime: stats.time,
        bestFeathers: stats.feathers,
        completions: 1
      };
    } else {
      const levelStats = this.state.levelStats[levelNumber];
      levelStats.completions += 1;

      // Update best time (lower is better)
      if (!levelStats.bestTime || stats.time < levelStats.bestTime) {
        levelStats.bestTime = stats.time;
      }

      // Update best feathers (higher is better)
      if (!levelStats.bestFeathers || stats.feathers > levelStats.bestFeathers) {
        levelStats.bestFeathers = stats.feathers;
      }
    }

    // Mark first play as done
    this.state.firstPlay = false;

    this.saveState();
  }

  /**
   * Unlock an ability globally
   * @param {string} abilityId - Ability to unlock
   */
  unlockAbility(abilityId) {
    if (!this.state.unlockedAbilities.includes(abilityId)) {
      this.state.unlockedAbilities.push(abilityId);
      this.saveState();
    }
  }

  /**
   * Get all unlocked abilities
   * @returns {Array} Array of ability IDs
   */
  getUnlockedAbilities() {
    return [...this.state.unlockedAbilities];
  }

  /**
   * Get stats for a specific level
   * @param {number} levelNumber - Level to get stats for
   * @returns {Object|null} Stats object or null
   */
  getLevelStats(levelNumber) {
    return this.state.levelStats[levelNumber] || null;
  }

  /**
   * Get all unlocked levels
   * @returns {Array} Array of unlocked level numbers
   */
  getUnlockedLevels() {
    return [...this.state.unlockedLevels];
  }

  /**
   * Check if this is the first time playing
   * @returns {boolean} True if first play
   */
  isFirstPlay() {
    return this.state.firstPlay;
  }

  /**
   * Reset all game progress
   */
  resetProgress() {
    this.state = this.getDefaultState();
    this.saveState();
  }

  /**
   * Get total completion percentage
   * @returns {number} Percentage (0-100)
   */
  getCompletionPercentage() {
    const totalLevels = 2; // Update this as more levels are added
    const completedCount = this.state.completedLevels.length;
    return Math.floor((completedCount / totalLevels) * 100);
  }
}

// Export singleton instance
const gameStateManager = new GameStateManager();
export default gameStateManager;
