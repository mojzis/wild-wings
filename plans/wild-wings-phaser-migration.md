# Wild Wings Migration Plan: Phaser 3 + TypeScript + Vite

## Migration Overview

Migrate the existing Wild Wings prototype from **Create React App + Custom Canvas + JavaScript** to **Vite + Phaser 3 + React + TypeScript** for better performance, maintainability, and modern tooling.

## Current vs New Architecture

### Current Stack (Obsolete)
- **Build Tool**: Create React App (react-scripts 5.0.1) - deprecated
- **Language**: Plain JavaScript (.js/.jsx)
- **Game Engine**: Custom Canvas with requestAnimationFrame
- **Physics**: Manual calculations (gravity, velocity)
- **Rendering**: Manual Canvas API calls in GameCanvas.jsx
- **Collision**: Manual AABB collision detection
- **State**: React useRef for game state
- **React Version**: 19.2.0

### New Stack (Modern 2025)
- **Build Tool**: Vite 5+ - 10-100x faster builds
- **Language**: TypeScript (.ts/.tsx)
- **Game Engine**: Phaser 3.80+ - WebGL accelerated
- **Physics**: Phaser Arcade Physics (built-in)
- **Rendering**: Phaser scene system with optimized renderer
- **Collision**: Phaser overlap/collide system
- **State**: Phaser Registry + React state bridge
- **React Version**: 18.3.0 (stable, widely used)

## File Mapping: Current → New

### Game Logic Files

| Current File | New File(s) | Notes |
|--------------|-------------|-------|
| `src/game/Player.js` | `src/game/objects/Player.ts` | Extends `Phaser.GameObjects.Sprite`, use Phaser physics |
| `src/game/Level.js` | `src/game/managers/LevelManager.ts` + `src/data/levels.ts` | Separate data from logic |
| `src/game/Obstacle.js` | `src/game/objects/Obstacle.ts` | Extends `Phaser.GameObjects.Sprite` |
| `src/game/Collectible.js` | `src/game/objects/Collectible.ts` | Extends `Phaser.GameObjects.Sprite` with animations |
| `src/game/AbilitySystem.js` | `src/game/managers/AbilityManager.ts` | TypeScript class with interfaces |
| `src/game/Physics.js` | `src/game/config/physics.ts` | Constants, use Phaser physics config |
| `src/game/GameStateManager.js` | `src/game/managers/GameStateManager.ts` | Convert to TypeScript, same logic |

### Component Files

| Current File | New File(s) | Notes |
|--------------|-------------|-------|
| `src/components/GameCanvas.jsx` | `src/game/scenes/MainScene.ts` | Core game loop moves to Phaser scene |
| `src/components/MainMenu.jsx` | `src/components/MainMenu.tsx` | Convert to TypeScript, keep React |
| `src/components/Settings.jsx` | `src/components/Settings.tsx` | Convert to TypeScript, keep React |
| `src/components/ElderEncounter.jsx` | `src/components/ElderEncounter.tsx` | Convert to TypeScript, keep React |
| N/A | `src/components/PhaserGame.tsx` | **NEW**: Phaser container component |
| N/A | `src/game/scenes/MenuScene.ts` | **NEW**: Optional Phaser menu scene |
| N/A | `src/game/scenes/GameOverScene.ts` | **NEW**: Optional Phaser game over scene |

### Data & Config Files

| Current File | New File(s) | Notes |
|--------------|-------------|-------|
| `src/data/birdFacts.js` | `src/data/birdFacts.ts` | Convert to TypeScript with interfaces |
| `src/App.js` | `src/App.tsx` | Convert to TypeScript |
| `src/index.js` | `src/main.tsx` | Vite entry point |
| `package.json` | `package.json` | Update dependencies |
| N/A | `vite.config.ts` | **NEW**: Vite configuration |
| N/A | `tsconfig.json` | **NEW**: TypeScript configuration |
| N/A | `src/game/config.ts` | **NEW**: Phaser game configuration |

## New Project Structure

```
wild-wings-prototype/
├── src/
│   ├── main.tsx                          # Vite entry point (was index.js)
│   ├── App.tsx                           # Root React component
│   ├── components/
│   │   ├── PhaserGame.tsx                # NEW: Phaser container
│   │   ├── MainMenu.tsx                  # Migrated, TypeScript
│   │   ├── Settings.tsx                  # Migrated, TypeScript
│   │   ├── ElderEncounter.tsx            # Migrated, TypeScript
│   │   └── GameOverlay.tsx               # NEW: HUD overlay
│   ├── game/
│   │   ├── config.ts                     # NEW: Phaser config
│   │   ├── scenes/
│   │   │   ├── MainScene.ts              # NEW: Main game (replaces GameCanvas)
│   │   │   └── GameOverScene.ts          # NEW: Optional
│   │   ├── objects/
│   │   │   ├── Player.ts                 # Migrated from Player.js
│   │   │   ├── Obstacle.ts               # Migrated from Obstacle.js
│   │   │   └── Collectible.ts            # Migrated from Collectible.js
│   │   ├── managers/
│   │   │   ├── LevelManager.ts           # Migrated from Level.js
│   │   │   ├── AbilityManager.ts         # Migrated from AbilitySystem.js
│   │   │   └── GameStateManager.ts       # Migrated from GameStateManager.js
│   │   └── config/
│   │       └── physics.ts                # Migrated from Physics.js
│   ├── data/
│   │   ├── birdFacts.ts                  # Migrated, with interfaces
│   │   ├── levels.ts                     # NEW: Level definitions
│   │   └── theme.ts                      # NEW: Color palette
│   └── types/
│       └── index.ts                      # NEW: TypeScript type definitions
├── public/
│   └── assets/                           # Optional: sprites, sounds
├── package.json                          # Updated dependencies
├── vite.config.ts                        # NEW: Vite config
├── tsconfig.json                         # NEW: TypeScript config
└── index.html                            # Vite entry HTML
```

## Migration Phases

### Phase 1: Project Setup & Initialization

**Goal**: Set up new Vite + TypeScript project structure without breaking existing code.

**Steps**:
1. Create new branch: `git checkout -b migration/phaser-vite`
2. Initialize Vite project in new directory:
   ```bash
   npm create vite@latest wild-wings-new -- --template react-ts
   cd wild-wings-new
   ```
3. Install dependencies:
   ```bash
   npm install
   npm install phaser
   npm install -D @types/node
   ```
4. Copy over existing files to understand scope
5. Set up basic Phaser configuration (`src/game/config.ts`)
6. Create PhaserGame container component
7. Test basic Phaser scene renders

**Validation**:
- `npm run dev` starts without errors
- Basic Phaser canvas appears on screen
- React components render alongside Phaser

---

### Phase 2: TypeScript Conversion - Data & Types

**Goal**: Convert static data files and create TypeScript interfaces.

**Files to Convert**:
- `src/data/birdFacts.js` → `src/data/birdFacts.ts`
- Create `src/types/index.ts` with interfaces

**Key Interfaces**:
```typescript
// src/types/index.ts
export interface BirdFact {
  id: number;
  species: string;
  fact: string;
  ability: string;
  abilityName: string;
  color: string;
  icon: string;
}

export interface Ability {
  id: string;
  name: string;
  duration: number;
  cooldown: number;
  state: 'locked' | 'ready' | 'active' | 'cooldown';
  lastUsed: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  difficulty: string;
  width: number;
  obstacles: ObstacleConfig[];
  collectibles: CollectibleConfig[];
  safeZones: SafeZoneConfig[];
}

export interface ObstacleConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

export interface CollectibleConfig {
  x: number;
  y: number;
  value?: number;
}

export interface SafeZoneConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  birdId: number;
}
```

**Steps**:
1. Create `src/types/index.ts` with all interfaces
2. Convert `birdFacts.js` to TypeScript with `BirdFact[]` type
3. Create `src/data/levels.ts` for level data
4. Validate all types compile

**Validation**:
- TypeScript compiles without errors
- All data files have proper typing
- IntelliSense works in VS Code

---

### Phase 3: React Components Migration

**Goal**: Convert React components to TypeScript, keep functionality identical.

**Files to Convert**:
1. `App.js` → `App.tsx`
2. `MainMenu.jsx` → `MainMenu.tsx`
3. `Settings.jsx` → `Settings.tsx`
4. `ElderEncounter.jsx` → `ElderEncounter.tsx`

**Component Props Interfaces**:
```typescript
// MainMenu.tsx
interface MainMenuProps {
  onLevelSelect: (levelNumber: number) => void;
}

// Settings.tsx
interface SettingsProps {
  onClose: () => void;
}

// ElderEncounter.tsx
interface ElderEncounterProps {
  birdId: number;
  onComplete: () => void;
}
```

**Steps**:
1. Add prop interfaces to each component
2. Convert useState/useRef/useEffect with proper types
3. Update event handlers with typed parameters
4. Replace `.jsx` with `.tsx` imports

**Validation**:
- All components render correctly
- No TypeScript errors
- Props are type-safe
- All callbacks work

---

### Phase 4: Game State Manager Migration

**Goal**: Convert GameStateManager to TypeScript, keep localStorage logic.

**File**: `src/game/GameStateManager.js` → `src/game/managers/GameStateManager.ts`

**TypeScript Interface**:
```typescript
interface GameState {
  currentLevel: number;
  completedLevels: number[];
  unlockedAbilities: string[];
  highScores: { [levelId: number]: number };
  totalPlayTime: number;
}

class GameStateManager {
  private static instance: GameStateManager;
  private state: GameState;

  private constructor() {
    this.state = this.loadState();
  }

  static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  saveProgress(): void { /* ... */ }
  loadState(): GameState { /* ... */ }
  unlockLevel(levelId: number): void { /* ... */ }
  unlockAbility(abilityId: string): void { /* ... */ }
  // ... other methods
}

export default GameStateManager.getInstance();
```

**Steps**:
1. Create interface for game state
2. Convert class to TypeScript with private/public modifiers
3. Add type safety to localStorage serialization
4. Keep singleton pattern
5. Test save/load functionality

**Validation**:
- localStorage read/write works
- State persists across page reload
- Type safety prevents invalid data

---

### Phase 5: Phaser Scene Setup (MainScene)

**Goal**: Create Phaser MainScene that will replace GameCanvas game loop.

**File**: `src/game/scenes/MainScene.ts`

**Scene Structure**:
```typescript
import Phaser from 'phaser';
import Player from '../objects/Player';
import LevelManager from '../managers/LevelManager';
import AbilityManager from '../managers/AbilityManager';

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private levelManager!: LevelManager;
  private abilityManager!: AbilityManager;
  private obstacles!: Phaser.GameObjects.Group;
  private collectibles!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private cameraOffsetX: number = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  init(data: { levelNumber: number }) {
    // Initialize level data
  }

  preload() {
    // Load assets (if any)
  }

  create() {
    // Set up game world
    this.setupPhysics();
    this.createPlayer();
    this.createLevel();
    this.createInput();
    this.createHUD();
  }

  update(time: number, delta: number) {
    // Game loop (60fps)
    this.handleInput();
    this.updatePlayer(delta);
    this.updateCamera();
    this.updateAbilities(time);
    this.checkCollisions();
    this.updateHUD();
  }

  private setupPhysics() {
    this.physics.world.gravity.y = 600; // Phaser uses pixels/second²
  }

  private createPlayer() {
    this.player = new Player(this, 100, 300);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);
  }

  private handleInput() {
    // Handle keyboard input
  }

  private checkCollisions() {
    // Use Phaser overlap instead of manual AABB
    this.physics.overlap(this.player, this.obstacles, this.handleObstacleCollision, null, this);
    this.physics.overlap(this.player, this.collectibles, this.handleCollectiblePickup, null, this);
  }
}
```

**Steps**:
1. Create basic MainScene with lifecycle methods
2. Set up Phaser physics world
3. Implement game loop in update()
4. Add placeholder for player/obstacles
5. Test scene transitions

**Validation**:
- Scene loads and renders
- update() loop runs at 60fps
- Physics system initializes
- Can switch between scenes

---

### Phase 6: Player Migration to Phaser

**Goal**: Convert Player.js to Phaser.GameObjects.Sprite with Phaser physics.

**File**: `src/game/Player.js` → `src/game/objects/Player.ts`

**Class Structure**:
```typescript
import Phaser from 'phaser';
import AbilityManager from '../managers/AbilityManager';

export default class Player extends Phaser.GameObjects.Sprite {
  public body!: Phaser.Physics.Arcade.Body;
  private abilityManager: AbilityManager;
  private wingFlap: number = 0;
  private particles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ''); // No texture key, use graphics

    this.abilityManager = new AbilityManager();

    // Set up physics body
    this.body.setSize(40, 40);
    this.body.setMaxVelocity(300, 400); // Horizontal, vertical
    this.body.setDrag(200, 0); // Horizontal drag, no vertical drag
  }

  flap() {
    if (this.body.velocity.y > -300) {
      this.body.setVelocityY(-250); // Upward flap
      this.wingFlap = -10;
    }
  }

  update(keys: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Horizontal movement
    if (keys.right?.isDown) {
      this.body.setVelocityX(200);
    } else if (keys.left?.isDown) {
      this.body.setVelocityX(-200);
    } else {
      this.body.setVelocityX(100); // Default forward movement
    }

    // Apply abilities
    this.applyAbilityEffects();

    // Visual updates
    this.updateVisuals();
  }

  private applyAbilityEffects() {
    const activeAbility = this.abilityManager.getActiveAbility();
    if (activeAbility === 'windRider') {
      this.body.setMaxVelocity(500, 400); // Faster
    }
  }

  private updateVisuals() {
    // Use Phaser graphics or sprite animations
    this.wingFlap = Phaser.Math.Linear(this.wingFlap, 0, 0.1);
  }

  render() {
    // Override preUpdate or use custom rendering
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x8BA3B8, 1);
    graphics.fillCircle(this.x, this.y, 20);
    // ... draw bird shape
  }
}
```

**Migration Mapping**:
| Current (Manual) | New (Phaser) |
|------------------|--------------|
| `this.velocityY` | `this.body.velocity.y` |
| `this.velocityX` | `this.body.velocity.x` |
| Manual gravity calculation | `this.physics.world.gravity.y` |
| Manual position update | Phaser physics automatic |
| `getBounds()` for collision | `this.body` bounds automatic |
| Manual rendering | `preUpdate()` or sprite animations |

**Steps**:
1. Create Player class extending Phaser.GameObjects.Sprite
2. Set up physics body in constructor
3. Convert manual physics to Phaser body properties
4. Move flap() logic to use setVelocityY()
5. Convert rendering to Phaser Graphics
6. Add particle effects using Phaser.Particles

**Validation**:
- Player sprite appears on screen
- Flapping works with spacebar
- Gravity applies correctly
- Horizontal movement responds to arrow keys
- Physics feels similar to original

---

### Phase 7: Obstacle & Collectible Migration

**Goal**: Convert Obstacle.js and Collectible.js to Phaser sprites.

**Files**:
- `src/game/Obstacle.js` → `src/game/objects/Obstacle.ts`
- `src/game/Collectible.js` → `src/game/objects/Collectible.ts`

**Obstacle Class**:
```typescript
export default class Obstacle extends Phaser.GameObjects.Sprite {
  public body!: Phaser.Physics.Arcade.Body;
  private obstacleType: string;
  public isDestructible: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, config: ObstacleConfig) {
    super(scene, x, y, '');

    this.obstacleType = config.type;
    this.body.setSize(config.width, config.height);
    this.body.setImmovable(true);

    this.renderObstacle();
  }

  private renderObstacle() {
    // Use Phaser.Graphics to draw obstacle
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xB09A8A, 1);
    graphics.fillRect(this.x, this.y, this.body.width, this.body.height);
  }

  destroy() {
    super.destroy(true);
  }
}
```

**Collectible Class**:
```typescript
export default class Collectible extends Phaser.GameObjects.Sprite {
  public body!: Phaser.Physics.Arcade.Body;
  private floatTween!: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '');

    this.body.setSize(20, 20);
    this.body.setAllowGravity(false);

    this.createFloatAnimation();
    this.renderCollectible();
  }

  private createFloatAnimation() {
    // Use Phaser tweens instead of manual sine wave
    this.floatTween = this.scene.tweens.add({
      targets: this,
      y: this.y + 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private renderCollectible() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xF4C430, 1);
    graphics.fillCircle(this.x, this.y, 10);
    // Add golden glow effect
  }

  collect() {
    this.floatTween.stop();
    // Play collect animation (tween scale to 0)
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      alpha: 0,
      duration: 300,
      onComplete: () => this.destroy()
    });
  }
}
```

**Steps**:
1. Create Obstacle class extending Sprite
2. Set up static physics bodies (immovable)
3. Convert rendering to Phaser Graphics
4. Create Collectible class extending Sprite
5. Replace manual float animation with Phaser tweens
6. Use Phaser particle effects for collection

**Validation**:
- Obstacles appear at correct positions
- Collectibles float smoothly
- Collision boundaries match visual size
- Collection animation plays correctly

---

### Phase 8: Level Manager Migration

**Goal**: Convert Level.js to LevelManager.ts with Phaser Groups.

**File**: `src/game/Level.js` → `src/game/managers/LevelManager.ts`

**Class Structure**:
```typescript
import Phaser from 'phaser';
import { LevelConfig } from '../../types';
import Obstacle from '../objects/Obstacle';
import Collectible from '../objects/Collectible';

export default class LevelManager {
  private scene: Phaser.Scene;
  private config: LevelConfig;
  private obstacleGroup: Phaser.GameObjects.Group;
  private collectibleGroup: Phaser.GameObjects.Group;
  private safeZones: Phaser.GameObjects.Rectangle[] = [];

  constructor(scene: Phaser.Scene, levelId: number) {
    this.scene = scene;
    this.config = this.loadLevelConfig(levelId);

    this.obstacleGroup = this.scene.add.group();
    this.collectibleGroup = this.scene.add.group();

    this.generateLevel();
  }

  private loadLevelConfig(levelId: number): LevelConfig {
    // Load from src/data/levels.ts
    return LEVELS[levelId - 1];
  }

  private generateLevel() {
    // Create obstacles from config
    this.config.obstacles.forEach(obstacleConfig => {
      const obstacle = new Obstacle(this.scene, obstacleConfig.x, obstacleConfig.y, obstacleConfig);
      this.obstacleGroup.add(obstacle);
      this.scene.physics.add.existing(obstacle);
    });

    // Create collectibles
    this.config.collectibles.forEach(collectibleConfig => {
      const collectible = new Collectible(this.scene, collectibleConfig.x, collectibleConfig.y);
      this.collectibleGroup.add(collectible);
      this.scene.physics.add.existing(collectible);
    });

    // Create safe zones
    this.createSafeZones();
  }

  getObstacles(): Phaser.GameObjects.Group {
    return this.obstacleGroup;
  }

  getCollectibles(): Phaser.GameObjects.Group {
    return this.collectibleGroup;
  }

  checkLevelComplete(playerX: number): boolean {
    return playerX >= this.config.width;
  }
}
```

**Static Level Data** (`src/data/levels.ts`):
```typescript
import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'First Flight',
    difficulty: 'easy',
    width: 2000,
    obstacles: [
      { x: 400, y: 300, width: 60, height: 120, type: 'branch' },
      { x: 600, y: 150, width: 60, height: 120, type: 'branch' },
      // ... more obstacles
    ],
    collectibles: [
      { x: 350, y: 250 },
      { x: 550, y: 400 },
      // ... more collectibles
    ],
    safeZones: [
      { x: 1000, y: 200, width: 200, height: 150, birdId: 1 }
    ]
  },
  // Level 2, 3, etc.
];
```

**Steps**:
1. Create LevelManager class
2. Extract level data to separate `levels.ts` file
3. Use Phaser Groups for obstacles/collectibles
4. Implement level loading from static data
5. Port randomized branch generation logic
6. Handle safe zones and elder encounters

**Validation**:
- Levels load correctly from data
- Obstacles/collectibles spawn at correct positions
- Groups enable efficient collision checking
- Level completion detection works

---

### Phase 9: Ability Manager Migration

**Goal**: Convert AbilitySystem.js to TypeScript with type safety.

**File**: `src/game/AbilitySystem.js` → `src/game/managers/AbilityManager.ts`

**Class Structure**:
```typescript
import { Ability } from '../../types';

export default class AbilityManager {
  private abilities: Map<string, Ability> = new Map();
  private activeAbility: string | null = null;

  constructor() {
    this.initializeAbilities();
  }

  private initializeAbilities() {
    const abilityConfigs: Ability[] = [
      {
        id: 'windRider',
        name: 'Wind Rider',
        duration: 3000,
        cooldown: 10000,
        state: 'locked',
        lastUsed: 0
      },
      {
        id: 'thermalGlide',
        name: 'Thermal Glide',
        duration: 5000,
        cooldown: 15000,
        state: 'locked',
        lastUsed: 0
      },
      // ... more abilities
    ];

    abilityConfigs.forEach(ability => {
      this.abilities.set(ability.id, ability);
    });
  }

  activateAbility(abilityId: string): boolean {
    const ability = this.abilities.get(abilityId);
    if (!ability || ability.state !== 'ready') {
      return false;
    }

    ability.state = 'active';
    ability.lastUsed = Date.now();
    this.activeAbility = abilityId;

    // Schedule deactivation
    setTimeout(() => {
      this.deactivateAbility(abilityId);
    }, ability.duration);

    return true;
  }

  update(currentTime: number): void {
    this.abilities.forEach(ability => {
      if (ability.state === 'cooldown') {
        const elapsed = currentTime - ability.lastUsed;
        if (elapsed >= ability.cooldown) {
          ability.state = 'ready';
        }
      }
    });
  }

  unlockAbility(abilityId: string): void {
    const ability = this.abilities.get(abilityId);
    if (ability && ability.state === 'locked') {
      ability.state = 'ready';
    }
  }

  getActiveAbility(): string | null {
    return this.activeAbility;
  }

  getAbilityState(abilityId: string): Ability | undefined {
    return this.abilities.get(abilityId);
  }
}
```

**Steps**:
1. Convert class to TypeScript
2. Use Map<string, Ability> instead of plain object
3. Add type guards for ability states
4. Integrate with Phaser scene events
5. Keep same activation/cooldown logic

**Validation**:
- Abilities lock/unlock correctly
- Cooldowns work as expected
- Active ability applies effects to player
- State persists via GameStateManager

---

### Phase 10: Phaser-React Bridge

**Goal**: Connect Phaser game events to React UI components.

**File**: `src/components/PhaserGame.tsx`

**Component Structure**:
```typescript
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import MainScene from '../game/scenes/MainScene';
import { gameConfig } from '../game/config';

interface PhaserGameProps {
  levelNumber: number;
  onGameOver: (stats: GameStats) => void;
  onLevelComplete: () => void;
  onElderEncounter: (birdId: number) => void;
}

const PhaserGame: React.FC<PhaserGameProps> = ({
  levelNumber,
  onGameOver,
  onLevelComplete,
  onElderEncounter
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (gameRef.current) return;

    // Create Phaser game instance
    const config = {
      ...gameConfig,
      parent: 'phaser-container',
      scene: [MainScene]
    };

    gameRef.current = new Phaser.Game(config);

    // Listen to game events
    const mainScene = gameRef.current.scene.getScene('MainScene') as MainScene;

    mainScene.events.on('scoreUpdate', (newScore: number) => {
      setScore(newScore);
    });

    mainScene.events.on('distanceUpdate', (newDistance: number) => {
      setDistance(newDistance);
    });

    mainScene.events.on('gameOver', (stats: GameStats) => {
      onGameOver(stats);
    });

    mainScene.events.on('levelComplete', () => {
      onLevelComplete();
    });

    mainScene.events.on('elderEncounter', (birdId: number) => {
      onElderEncounter(birdId);
      mainScene.scene.pause(); // Pause game during encounter
    });

    // Cleanup on unmount
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [levelNumber, onGameOver, onLevelComplete, onElderEncounter]);

  return (
    <div style={{ position: 'relative' }}>
      <div id="phaser-container" />
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
        <div>Score: {score}</div>
        <div>Distance: {distance}m</div>
      </div>
    </div>
  );
};

export default PhaserGame;
```

**Event Emitters in MainScene**:
```typescript
// In MainScene.ts
updateScore(points: number) {
  this.score += points;
  this.events.emit('scoreUpdate', this.score);
}

checkLevelComplete() {
  if (this.player.x >= this.levelManager.width) {
    this.events.emit('levelComplete');
    this.scene.pause();
  }
}

handleGameOver() {
  const stats = {
    score: this.score,
    distance: this.player.x,
    feathers: this.feathersCollected
  };
  this.events.emit('gameOver', stats);
}
```

**Steps**:
1. Create PhaserGame wrapper component
2. Set up Phaser.Game instance in useEffect
3. Emit events from MainScene for UI updates
4. Listen to events in React component
5. Pass callbacks from App.tsx down to PhaserGame
6. Handle scene pause/resume for modal overlays

**Validation**:
- Phaser game renders inside React app
- Score/distance updates in React UI
- Game pauses when React modals appear
- Elder encounters trigger React component
- Game over transitions correctly

---

### Phase 11: Camera & Rendering

**Goal**: Implement camera following and parallax backgrounds in Phaser.

**In MainScene**:
```typescript
create() {
  // ... other setup

  // Camera setup
  this.cameras.main.setBounds(0, 0, this.levelManager.width, 600);
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  this.cameras.main.setDeadzone(200, 0); // Horizontal deadzone

  // Parallax background
  this.createParallaxBackground();
}

createParallaxBackground() {
  const clouds = [];
  for (let i = 0; i < 15; i++) {
    const cloud = this.add.graphics();
    cloud.fillStyle(0xFFFFFF, 0.3);
    cloud.fillCircle(
      Phaser.Math.Between(0, this.levelManager.width),
      Phaser.Math.Between(50, 400),
      Phaser.Math.Between(30, 80)
    );
    cloud.setScrollFactor(0.1 + i * 0.05); // Different layers
    clouds.push(cloud);
  }
}

update() {
  // Camera offset handled automatically by Phaser
  // No manual cameraOffsetX calculation needed
}
```

**Steps**:
1. Set up camera bounds to level width
2. Configure camera to follow player with smoothing
3. Create parallax layers with different scroll factors
4. Remove manual camera offset calculations
5. Let Phaser handle viewport culling

**Validation**:
- Camera smoothly follows player
- Parallax clouds move at different speeds
- Off-screen objects don't render (culled)
- Camera stays within level bounds

---

### Phase 12: Testing Migration

**Goal**: Update tests for new architecture.

**Test Files to Update**:
- `src/components/GameCanvas.test.jsx` → `src/game/scenes/MainScene.test.ts`
- `src/game/AbilitySystem.test.js` → `src/game/managers/AbilityManager.test.ts`

**Example Test (Phaser Scene)**:
```typescript
import Phaser from 'phaser';
import MainScene from '../scenes/MainScene';

describe('MainScene', () => {
  let scene: MainScene;
  let game: Phaser.Game;

  beforeEach(() => {
    game = new Phaser.Game({
      type: Phaser.HEADLESS,
      scene: MainScene
    });
    scene = game.scene.getScene('MainScene') as MainScene;
  });

  afterEach(() => {
    game.destroy(true);
  });

  it('should initialize player at correct position', () => {
    scene.create();
    expect(scene.player.x).toBe(100);
    expect(scene.player.y).toBe(300);
  });

  it('should handle collectible collision', () => {
    scene.create();
    const initialScore = scene.score;
    // Simulate collision
    scene.handleCollectiblePickup(scene.player, scene.collectibles.getChildren()[0]);
    expect(scene.score).toBeGreaterThan(initialScore);
  });
});
```

**Steps**:
1. Install Phaser testing utilities
2. Update test setup for headless Phaser
3. Rewrite component tests for new architecture
4. Add unit tests for managers (AbilityManager, LevelManager)
5. Test Phaser-React event bridge

**Validation**:
- All tests pass with new architecture
- Code coverage maintained or improved
- CI/CD pipeline runs successfully

---

### Phase 13: Performance Optimization

**Goal**: Leverage Phaser optimizations and remove manual performance hacks.

**Optimizations**:
1. **Object Pooling**:
   ```typescript
   // Use Phaser Groups for automatic pooling
   this.obstacleGroup = this.physics.add.group({
     classType: Obstacle,
     maxSize: 50,
     runChildUpdate: true
   });
   ```

2. **Culling**:
   ```typescript
   // Phaser automatically culls off-screen objects
   // Remove manual culling code from original
   ```

3. **Physics Optimization**:
   ```typescript
   // In config.ts
   physics: {
     default: 'arcade',
     arcade: {
       gravity: { y: 600 },
       debug: false, // Disable in production
       fps: 60
     }
   }
   ```

4. **Rendering**:
   - Use sprite batching where possible
   - Enable WebGL for hardware acceleration
   - Use render textures for complex backgrounds

**Steps**:
1. Enable Phaser object pooling for obstacles/collectibles
2. Remove manual culling code
3. Profile performance with Phaser debug mode
4. Optimize physics body shapes (use circles where possible)
5. Use Phaser's built-in performance monitoring

**Validation**:
- Game runs at solid 60fps
- Memory usage is stable (no leaks)
- CPU usage lower than original Canvas version
- Mobile performance acceptable

---

### Phase 14: Polish & Final Integration

**Goal**: Complete migration, polish visuals, ensure feature parity.

**Tasks**:
1. **Visual Polish**:
   - Refine particle effects using Phaser.Particles
   - Add tweens for smooth animations
   - Improve wing flap animation
   - Polish HUD overlay

2. **Audio**:
   - Add Phaser.Sound for sound effects (if desired)
   - Background music with fade in/out

3. **Settings Integration**:
   - Connect Settings panel to Phaser physics settings
   - Update gravity multiplier via Phaser physics

4. **Feature Parity Check**:
   - ✅ Player physics (flap, gravity, horizontal movement)
   - ✅ Obstacle collision
   - ✅ Collectible pickup
   - ✅ Safe zones and elder encounters
   - ✅ Ability system (activation, cooldown, effects)
   - ✅ Level progression
   - ✅ Save/load system
   - ✅ Settings (sensitivity)
   - ✅ Game over screen
   - ✅ Level complete screen

5. **Bug Fixes**:
   - Test all edge cases from original
   - Fix any physics inconsistencies
   - Ensure elder encounters work correctly
   - Validate all level transitions

**Validation**:
- All original features work in new version
- Visuals match or improve upon original
- No regressions in gameplay
- User experience is identical or better

---

### Phase 15: Deployment & Cleanup

**Goal**: Deploy new version, deprecate old code.

**Steps**:
1. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "preview": "vite preview",
       "test": "vitest"
     }
   }
   ```

2. Update build configuration for GitHub Pages:
   ```typescript
   // vite.config.ts
   export default defineConfig({
     base: '/wild-wings/',
     build: {
       outDir: 'dist',
       sourcemap: true
     }
   });
   ```

3. Test production build:
   ```bash
   npm run build
   npm run preview
   ```

4. Update deployment scripts:
   - Modify GitHub Actions workflow if needed
   - Test deployment to GitHub Pages

5. Documentation:
   - Update CLAUDE.md with new architecture
   - Add migration notes to README
   - Document new file structure

6. Cleanup:
   - Remove old Create React App files
   - Delete obsolete build configuration
   - Archive migration branch

**Validation**:
- Production build works correctly
- Deployment succeeds
- No broken links or assets
- Documentation is up to date

---

## Key Differences After Migration

### Code Quality
| Aspect | Before | After |
|--------|--------|-------|
| Type Safety | None (JavaScript) | Full (TypeScript) |
| Build Time | ~30s (CRA) | ~2s (Vite) |
| Hot Reload | 3-5s | <100ms |
| Bundle Size | Larger | Smaller (better tree-shaking) |

### Game Engine
| Feature | Before (Canvas) | After (Phaser) |
|---------|-----------------|----------------|
| Physics | Manual calculations | Phaser Arcade Physics |
| Collision | Manual AABB | Phaser overlap/collide |
| Rendering | Manual Canvas API | Phaser WebGL renderer |
| Animations | Manual tweening | Phaser Tween Manager |
| Particles | Custom array | Phaser Particle Emitter |

### Developer Experience
- **IntelliSense**: Full autocomplete with TypeScript
- **Debugging**: Phaser debug mode with physics visualization
- **Testing**: Better mocking with Phaser headless mode
- **Maintainability**: Clear separation of concerns (scenes, objects, managers)

## Migration Gotchas

### Physics Conversion
- **Gravity**: Convert from pixels/frame² to pixels/second²
  - Old: `0.20` per frame
  - New: `600` pixels/second² (0.20 * 60² ≈ 720, tune to 600)

- **Velocity**: Convert from pixels/frame to pixels/second
  - Old: `horizontalSpeed = 3` (3px per frame)
  - New: `setVelocityX(180)` (3 * 60 = 180px/s)

### Coordinate System
- Phaser uses **sprite centers** by default
- Original Canvas used **top-left corners**
- Solution: Use `setOrigin(0, 0)` for top-left alignment if needed

### Collision Detection
- Phaser overlap/collide requires **both objects to have physics bodies**
- Old code only checked player bounds
- New code: Add physics to all collidable objects

### Event Handling
- React synthetic events vs Phaser input events
- Use Phaser keyboard input inside scenes
- Use React events for UI components

### State Management
- Don't mix Phaser Registry and React state
- Use events to bridge Phaser → React
- Use scene data for Phaser → Phaser communication

## Rollback Plan

If migration fails or critical issues arise:

1. **Branch Strategy**:
   - Keep `main` branch stable with old version
   - Migrate on `migration/phaser-vite` branch
   - Only merge when fully validated

2. **Feature Flags**:
   - Use environment variables to toggle between versions
   - Allow A/B testing

3. **Parallel Deployment**:
   - Deploy new version to separate URL first
   - Gather feedback before replacing old version

---

## Timeline Estimate

**Note**: This is for reference only, not a commitment.

- **Phase 1-2** (Setup & Types): 1-2 days
- **Phase 3-4** (React & State): 1-2 days
- **Phase 5-6** (Phaser Scene & Player): 2-3 days
- **Phase 7-8** (Obstacles & Levels): 2-3 days
- **Phase 9-10** (Abilities & Bridge): 2-3 days
- **Phase 11-12** (Camera & Tests): 1-2 days
- **Phase 13-14** (Optimization & Polish): 2-3 days
- **Phase 15** (Deployment): 1 day

**Total**: 12-20 days of focused development

---

## Success Criteria

Migration is complete when:

- ✅ All original features work identically
- ✅ TypeScript compiles with no errors
- ✅ All tests pass
- ✅ Performance is equal or better (60fps maintained)
- ✅ Build succeeds and deploys to GitHub Pages
- ✅ No regressions in gameplay or visuals
- ✅ Code is cleaner and more maintainable
- ✅ Documentation reflects new architecture

---

*Migration plan ready - modernizes Wild Wings with Phaser 3, TypeScript, and Vite while maintaining all existing features and gameplay.*
