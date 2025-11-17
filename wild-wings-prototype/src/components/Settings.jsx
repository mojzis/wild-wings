/**
 * Settings.jsx
 * Settings modal for adjusting game parameters like flight sensitivity
 */

import React, { useState, useEffect } from 'react';
import Physics from '../game/Physics';

const Settings = ({ isOpen, onClose }) => {
  const [sensitivity, setSensitivity] = useState(Physics.sensitivity);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSensitivity = localStorage.getItem('wildWingsFlightSensitivity');
    if (savedSensitivity !== null) {
      const sensitivityValue = parseFloat(savedSensitivity);
      setSensitivity(sensitivityValue);
      Physics.sensitivity = sensitivityValue;
    }
  }, []);

  const handleSensitivityChange = (e) => {
    const newSensitivity = parseFloat(e.target.value);
    setSensitivity(newSensitivity);
    Physics.sensitivity = newSensitivity;
    localStorage.setItem('wildWingsFlightSensitivity', newSensitivity.toString());
  };

  const resetToDefault = () => {
    const defaultSensitivity = 0.75;
    setSensitivity(defaultSensitivity);
    Physics.sensitivity = defaultSensitivity;
    localStorage.setItem('wildWingsFlightSensitivity', defaultSensitivity.toString());
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Settings</h2>

        <div style={styles.settingGroup}>
          <label style={styles.label}>
            Flight Sensitivity: <span style={styles.value}>{sensitivity.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={sensitivity}
            onChange={handleSensitivityChange}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span style={styles.labelText}>Easier (Gentle)</span>
            <span style={styles.labelText}>Harder (Responsive)</span>
          </div>
        </div>

        <div style={styles.description}>
          <p>Lower sensitivity makes flight more forgiving with gentler gravity and softer flaps.</p>
          <p>Higher sensitivity makes flight more responsive and challenging.</p>
          <p>This balances both gravity and flap strength to keep controls smooth.</p>
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={resetToDefault}
            style={styles.resetButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#A8B89F'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#9BAA8C'}
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7A93A9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#8BA3B8'}
          >
            Close
          </button>
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
    backgroundColor: 'rgba(232, 213, 232, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000
  },
  modal: {
    backgroundColor: '#F5F0E8',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(107, 122, 122, 0.3)',
    minWidth: '500px',
    maxWidth: '600px'
  },
  title: {
    color: '#6B7A7A',
    fontSize: '36px',
    margin: '0 0 30px 0',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  settingGroup: {
    marginBottom: '30px'
  },
  label: {
    display: 'block',
    color: '#6B7A7A',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  value: {
    color: '#8BA3B8',
    fontFamily: 'monospace',
    fontSize: '24px'
  },
  slider: {
    width: '100%',
    height: '8px',
    borderRadius: '5px',
    outline: 'none',
    opacity: 0.9,
    WebkitTransition: '.2s',
    transition: 'opacity .2s',
    cursor: 'pointer',
    accentColor: '#8BA3B8'
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px'
  },
  labelText: {
    color: '#9BA3A8',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  description: {
    backgroundColor: 'rgba(139, 163, 184, 0.1)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '30px'
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center'
  },
  resetButton: {
    backgroundColor: '#9BAA8C',
    color: '#F5F0E8',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '30px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 8px rgba(155, 170, 140, 0.3)'
  },
  closeButton: {
    backgroundColor: '#8BA3B8',
    color: '#F5F0E8',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '30px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 8px rgba(139, 163, 184, 0.3)'
  }
};

export default Settings;
