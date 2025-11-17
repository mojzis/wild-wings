/**
 * MainMenu.jsx
 * Main menu with title and level selection
 */

import React from 'react';
import gameStateManager from '../game/GameStateManager';

const MainMenu = ({ onStartLevel }) => {
  const unlockedLevels = gameStateManager.getUnlockedLevels();
  const completedLevels = gameStateManager.state.completedLevels;
  const completionPercentage = gameStateManager.getCompletionPercentage();

  const levels = [
    { number: 1, name: 'First Flight', description: 'Learn the basics of flight' },
    { number: 2, name: 'Storm Chaser', description: 'Master your abilities in tougher winds' }
  ];

  const handleLevelSelect = (levelNumber) => {
    onStartLevel(levelNumber);
  };

  return (
    <div style={styles.container}>
      {/* Title Section */}
      <div style={styles.titleSection}>
        <h1 style={styles.mainTitle}>Wild Wings</h1>
        <h2 style={styles.subtitle}>Storm Chaser</h2>
        <div style={styles.featherIcon}>🪶</div>
      </div>

      {/* Level Selection */}
      <div style={styles.levelSection}>
        <h3 style={styles.sectionTitle}>Select Level</h3>
        <div style={styles.levelGrid}>
          {levels.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.number);
            const isCompleted = completedLevels.includes(level.number);
            const stats = gameStateManager.getLevelStats(level.number);

            return (
              <div
                key={level.number}
                style={{
                  ...styles.levelCard,
                  ...(isUnlocked ? styles.levelCardUnlocked : styles.levelCardLocked),
                  ...(isCompleted ? styles.levelCardCompleted : {})
                }}
                onClick={() => isUnlocked && handleLevelSelect(level.number)}
              >
                {/* Level Number Badge */}
                <div style={styles.levelBadge}>
                  <span style={styles.levelNumber}>{level.number}</span>
                  {isCompleted && <span style={styles.checkmark}>✓</span>}
                </div>

                {/* Level Info */}
                <div style={styles.levelInfo}>
                  <h4 style={styles.levelName}>{level.name}</h4>
                  <p style={styles.levelDescription}>{level.description}</p>

                  {/* Stats (if completed) */}
                  {stats && (
                    <div style={styles.levelStats}>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Best Time:</span>
                        <span style={styles.statValue}>{stats.bestTime}s</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Feathers:</span>
                        <span style={styles.statValue}>{stats.bestFeathers}</span>
                      </div>
                    </div>
                  )}

                  {/* Locked Overlay */}
                  {!isUnlocked && (
                    <div style={styles.lockedOverlay}>
                      <span style={styles.lockIcon}>🔒</span>
                      <span style={styles.lockedText}>Complete previous level</span>
                    </div>
                  )}
                </div>

                {/* Play Button */}
                {isUnlocked && (
                  <div style={styles.playButton}>
                    <span style={styles.playIcon}>▶</span>
                    <span style={styles.playText}>Play</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressLabel}>
          <span>Overall Progress</span>
          <span>{completionPercentage}%</span>
        </div>
        <div style={styles.progressBarContainer}>
          <div style={{...styles.progressBar, width: `${completionPercentage}%`}}></div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>Use SPACE to flap, ARROWS to move, E to activate abilities</p>
        <button
          style={styles.resetButton}
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all progress?')) {
              gameStateManager.resetProgress();
              window.location.reload();
            }
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#C0392B'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#E74C3C'}
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#2C3E50',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif'
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: '50px',
    position: 'relative'
  },
  mainTitle: {
    fontSize: '72px',
    fontWeight: 'bold',
    color: '#ECF0F1',
    margin: '0',
    textShadow: '4px 4px 8px rgba(0,0,0,0.5)',
    letterSpacing: '2px'
  },
  subtitle: {
    fontSize: '36px',
    color: '#3498DB',
    margin: '10px 0 0 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    fontStyle: 'italic'
  },
  featherIcon: {
    fontSize: '48px',
    marginTop: '20px',
    animation: 'float 3s ease-in-out infinite'
  },
  levelSection: {
    maxWidth: '900px',
    width: '100%',
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '32px',
    color: '#ECF0F1',
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: 'bold'
  },
  levelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
    padding: '0 20px'
  },
  levelCard: {
    backgroundColor: '#34495E',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column'
  },
  levelCardUnlocked: {
    cursor: 'pointer',
    border: '3px solid #3498DB'
  },
  levelCardLocked: {
    opacity: 0.6,
    border: '3px solid #7F8C8D'
  },
  levelCardCompleted: {
    border: '3px solid #2ECC71'
  },
  levelBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#3498DB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  },
  levelNumber: {
    fontSize: '28px'
  },
  checkmark: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#2ECC71',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    border: '2px solid #FFFFFF'
  },
  levelInfo: {
    flex: 1,
    paddingRight: '80px'
  },
  levelName: {
    fontSize: '28px',
    color: '#ECF0F1',
    margin: '0 0 10px 0',
    fontWeight: 'bold'
  },
  levelDescription: {
    fontSize: '16px',
    color: '#BDC3C7',
    margin: '0 0 15px 0',
    lineHeight: '1.5'
  },
  levelStats: {
    display: 'flex',
    gap: '20px',
    marginTop: '15px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#95A5A6',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: '18px',
    color: '#FFD700',
    fontWeight: 'bold'
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    borderRadius: '15px'
  },
  lockIcon: {
    fontSize: '48px'
  },
  lockedText: {
    color: '#ECF0F1',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  playButton: {
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    padding: '15px 30px',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '15px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 8px rgba(46, 204, 113, 0.4)'
  },
  playIcon: {
    fontSize: '16px'
  },
  playText: {
    fontSize: '20px'
  },
  progressSection: {
    width: '100%',
    maxWidth: '600px',
    marginBottom: '30px'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#ECF0F1',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  progressBarContainer: {
    width: '100%',
    height: '30px',
    backgroundColor: '#34495E',
    borderRadius: '15px',
    overflow: 'hidden',
    border: '2px solid #7F8C8D'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2ECC71',
    transition: 'width 0.5s ease',
    boxShadow: '0 0 10px rgba(46, 204, 113, 0.5)'
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px'
  },
  footerText: {
    color: '#95A5A6',
    fontSize: '14px',
    marginBottom: '15px'
  },
  resetButton: {
    backgroundColor: '#E74C3C',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(231, 76, 60, 0.4)'
  }
};

// Add CSS animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
  `;
  if (!document.head.querySelector('style[data-main-menu]')) {
    styleSheet.setAttribute('data-main-menu', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default MainMenu;
