/**
 * ElderEncounter.jsx
 * Full-screen educational encounter with elder birds
 */

import React, { useState, useEffect } from 'react';

const ElderEncounter = ({ birdFact, onContinue }) => {
  const [showSparkle, setShowSparkle] = useState(false);

  // Trigger sparkle animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSparkle(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!birdFact) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Elder Bird Portrait */}
        <div style={{...styles.birdPortrait, backgroundColor: birdFact.color}}>
          <span style={styles.birdIcon}>{birdFact.icon}</span>
          <div style={styles.elderLabel}>ELDER</div>
        </div>

        {/* Bird Species Name */}
        <h2 style={styles.speciesName}>{birdFact.species}</h2>

        {/* Fact Box */}
        <div style={styles.factBox}>
          <div style={styles.factLabel}>Elder's Wisdom</div>
          <p style={styles.factText}>{birdFact.fact}</p>
        </div>

        {/* Ability Unlock Section */}
        <div style={styles.abilitySection}>
          <div style={styles.abilityHeader}>
            <span style={styles.unlockText}>New Ability Unlocked!</span>
            {showSparkle && (
              <div style={styles.sparkleContainer}>
                <span style={styles.sparkle}>✨</span>
                <span style={{...styles.sparkle, animationDelay: '0.2s'}}>✨</span>
                <span style={{...styles.sparkle, animationDelay: '0.4s'}}>✨</span>
              </div>
            )}
          </div>

          <div style={styles.abilityCard}>
            <div style={styles.abilityIcon}>
              <span style={styles.abilityIconText}>{birdFact.icon}</span>
            </div>
            <div style={styles.abilityInfo}>
              <h3 style={styles.abilityName}>{birdFact.abilityName}</h3>
              <p style={styles.abilityDescription}>{birdFact.abilityDescription}</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          style={styles.continueButton}
          onClick={onContinue}
          onMouseOver={(e) => e.target.style.backgroundColor = '#27AE60'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2ECC71'}
        >
          Continue Your Journey
        </button>

        {/* Hint */}
        <div style={styles.hint}>
          Press SPACE or click to continue
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-in'
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '700px',
    width: '90%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '25px'
  },
  birdPortrait: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    border: '5px solid #FFFFFF'
  },
  birdIcon: {
    fontSize: '64px',
    marginBottom: '5px'
  },
  elderLabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '3px 10px',
    borderRadius: '10px',
    marginTop: '5px'
  },
  speciesName: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2C3E50',
    margin: '0',
    textAlign: 'center'
  },
  factBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: '15px',
    padding: '25px',
    border: '3px solid #E0E0E0',
    width: '100%',
    boxSizing: 'border-box'
  },
  factLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#7F8C8D',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px'
  },
  factText: {
    fontSize: '22px',
    lineHeight: '1.6',
    color: '#2C3E50',
    margin: '0',
    fontFamily: 'Georgia, serif'
  },
  abilitySection: {
    width: '100%',
    backgroundColor: '#FFF9E6',
    borderRadius: '15px',
    padding: '20px',
    border: '3px solid #FFD700',
    boxSizing: 'border-box'
  },
  abilityHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    position: 'relative'
  },
  unlockText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#F39C12',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  sparkleContainer: {
    display: 'flex',
    gap: '5px'
  },
  sparkle: {
    fontSize: '24px',
    animation: 'sparkle 1.5s infinite',
    display: 'inline-block'
  },
  abilityCard: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #FFD700'
  },
  abilityIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '12px',
    backgroundColor: '#FFD700',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    boxShadow: '0 3px 10px rgba(243, 156, 18, 0.3)'
  },
  abilityIconText: {
    fontSize: '40px'
  },
  abilityInfo: {
    flex: 1
  },
  abilityName: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#2C3E50',
    margin: '0 0 8px 0'
  },
  abilityDescription: {
    fontSize: '18px',
    color: '#7F8C8D',
    margin: '0',
    lineHeight: '1.5'
  },
  continueButton: {
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '18px 50px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)',
    transition: 'all 0.2s ease',
    marginTop: '10px'
  },
  hint: {
    fontSize: '14px',
    color: '#95A5A6',
    fontStyle: 'italic'
  }
};

// Add CSS animation styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes sparkle {
      0%, 100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: scale(1.3) rotate(180deg);
        opacity: 0.7;
      }
    }
  `;
  if (!document.head.querySelector('style[data-elder-encounter]')) {
    styleSheet.setAttribute('data-elder-encounter', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default ElderEncounter;
