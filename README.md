# 🦅 Wild Wings: Storm Chaser

An educational side-scrolling flight game for children ages 6-8 that combines reading practice with engaging gameplay. **Read about birds to fly like birds** - learning ornithological facts unlocks new in-game abilities.

## 🎮 Game Overview

Players control a bird navigating through obstacle-filled environments while collecting wind feathers. By discovering safe zones and reading about real bird species, players unlock special flight abilities that help them master increasingly challenging levels.

### Core Concept
**Knowledge = Power** - Educational content directly enhances gameplay abilities, creating intrinsic motivation to read and learn.

## 🎯 Current Levels

### Level 1: "First Flight" (Tutorial)
- **Difficulty:** Easy
- **Objective:** Learn basic flight controls and mechanics
- **Environment:** Forest with 17 randomized tree branches
- **Collectibles:** 15 wind feathers
- **Safe Zones:** 1 safe zone
- **Bird Species:** Peregrine Falcon
- **Ability Unlocked:** Dive Bomb (15px/frame speed boost, breaks obstacles)
- **Level Width:** 2500px

A gentle introduction to flight physics, obstacle navigation, and the ability system. Perfect for learning the core mechanics in a forgiving environment.

### Level 2: "Storm Chaser" (Challenge)
- **Difficulty:** Hard
- **Objective:** Master abilities under pressure
- **Environment:** Dense forest with 23 randomized branches and tighter gaps
- **Collectibles:** 20 wind feathers
- **Safe Zones:** 2 safe zones
- **Bird Species:** Hummingbird, Albatross
- **Abilities Unlocked:**
  - Steady Hover (freezes position for 3s, perfect hovering)
  - Wind Rider (gentle upward drift for 5s, extended gliding)
- **Level Width:** 2800px

Tests mastery of all three abilities with more challenging obstacle patterns and longer flight duration.

## 🕹️ Controls

| Key | Action |
|-----|--------|
| **SPACE** | Flap wings (gain altitude) |
| **← →** | Move left/right |
| **↓** | Soft descent |
| **E** | Activate equipped ability |
| **↑ ↓** (Menu) | Select ability in safe zones |

## 🦜 Abilities System

### Dive Bomb (Peregrine Falcon)
- **Effect:** 15px/frame horizontal speed, breaks through obstacles
- **Duration:** 3 seconds
- **Cooldown:** 10 seconds
- **Real Fact:** Peregrine falcons can dive at 240+ mph, the fastest animal on Earth

### Steady Hover (Hummingbird)
- **Effect:** Freezes position (zero gravity, zero velocity)
- **Duration:** 3 seconds
- **Cooldown:** 8 seconds
- **Real Fact:** Hummingbirds are the only birds that can truly hover in place

### Wind Rider (Albatross)
- **Effect:** Gentle upward drift with minimal effort
- **Duration:** 5 seconds
- **Cooldown:** 12 seconds
- **Real Fact:** Albatrosses can glide for hours without flapping using wind currents

## 🎓 Educational Features

- **Age-Appropriate:** Lexile 200-500L (grades 1-3)
- **Vocabulary Building:** Introduces academic and domain-specific terms naturally
- **Reading Practice:** Facts are 50-100 words, presented in safe, non-pressured environments
- **Real Science:** All bird facts are scientifically accurate

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation

```bash
cd wild-wings-prototype
npm install
```

### Running the Game

```bash
npm start
```

Opens the game at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

### Running Tests

```bash
npm test
```

## 🎨 Game Features

- **Dynamic Obstacle Generation:** Randomized level layouts ensure replayability
- **Physics-Based Flight:** Realistic gravity and momentum mechanics
- **Collectible System:** Wind feathers with sparkle animations
- **Progress Tracking:** Best times and feather counts saved locally
- **Adjustable Difficulty:** Flight sensitivity settings (0.5x to 1.5x)
- **Safe Zones:** Non-pressured learning environments with elder bird encounters
- **Ability Cooldowns:** Strategic timing adds gameplay depth

## 📊 Game Progression

- Complete Level 1 to unlock Level 2
- Collect all feathers for 100% completion
- Beat your best times
- Master all three abilities

## 🛠️ Technology Stack

- **React 19.2.0** - UI framework
- **HTML5 Canvas** - Game rendering
- **Create React App** - Build tooling
- **localStorage** - Progress persistence

## 🎯 Future Plans

The game design includes 45 levels across 4 seasons:
- **Season 1: Summer Fledging** (8 levels) - Forest birds tutorial
- **Season 2: Fall Migration** (12 levels) - Migratory species challenge
- **Season 3: Winter Survival** (10 levels) - Tropical environments
- **Season 4: Spring Return** (15 levels) - Advanced mastery

Additional planned features:
- 47 more bird species with unique facts
- Field guide collection system
- Achievements and missions
- Nest customization
- Difficulty adaptation
- Audio narration with bird calls
- Mobile touch controls

## 📝 License

This project is a prototype educational game.

## 🤝 Contributing

For development guidance, see [CLAUDE.md](./CLAUDE.md)

---

**Made with ❤️ for young learners and bird enthusiasts**
