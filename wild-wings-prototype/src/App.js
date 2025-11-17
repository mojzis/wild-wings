import './App.css';
import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameCanvas from './components/GameCanvas';

function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu' or 'playing'
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleStartLevel = (levelNumber) => {
    setCurrentLevel(levelNumber);
    setGameState('playing');
  };

  const handleReturnToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="App">
      {gameState === 'menu' ? (
        <MainMenu onStartLevel={handleStartLevel} />
      ) : (
        <GameCanvas
          levelNumber={currentLevel}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
}

export default App;
