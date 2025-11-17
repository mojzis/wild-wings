# JavaScript Prototype Development Plan
## Wild Wings: Storm Chaser - Proof of Concept

---

## Prototype Goals

**Primary Objective:** Validate that "reading unlocks abilities" creates genuine motivation for a 7-year-old to engage with text during action gameplay.

**Key Questions to Answer:**
1. Does the flight mechanic feel fun and responsive?
2. Do Elder Bird encounters feel like rewards or interruptions?
3. Does unlocking abilities through reading motivate continued play?
4. Is the text appropriately sized and readable for the target age?
5. Does your son ask to play again after the first session?

---

## Prototype Scope (MVP - Minimum Viable Prototype)

### What's INCLUDED:

**Core Gameplay:**
- Side-scrolling flight with keyboard/touch controls
- 2 short levels (~2 minutes each)
- Basic flight physics (flap to go up, gravity pulls down, momentum)
- Simple obstacles (tree branches, clouds to navigate through)
- Collectibles (wind feathers - just visual/count for now)

**Reading Integration:**
- 3 Elder Bird encounters with real bird facts
- Facts unlock 3 different abilities:
  - Speed Boost (peregrine falcon)
  - Hover (hummingbird)
  - Glide Extended (albatross)
- Clear visual indication of ability unlocks
- Button/key to activate abilities during flight

**Visual Design:**
- Simple 2D art (can use basic shapes initially)
- Clear player bird sprite
- Readable backgrounds
- Clean UI with large text

**Audio (Optional for v1):**
- Background music (simple loop)
- Wing flap sound
- Collectible pickup sound
- Ability activation sound

### What's EXCLUDED (for now):

- Multiple seasons/regions
- 50 bird species (just 3-4 for prototype)
- Nest customization
- Mission system
- Field guide/encyclopedia
- Save system
- Parent dashboard
- Advanced weather effects
- Complex stamina mechanics

---

## Technical Approach

### Option A: Pure React + Canvas (Simpler)

**Stack:**
- React for UI structure and state management
- HTML5 Canvas for game rendering
- Custom physics (very simple)
- CSS for menus/Elder encounters

**Pros:**
- You've already seen this work
- Fast to build
- Easy to iterate
- No external dependencies to learn

**Cons:**
- Canvas performance can be tricky
- More manual work for game loop

### Option B: React + Phaser 3 (Better for Gameplay)

**Stack:**
- React for UI/menus
- Phaser 3 for actual flight gameplay
- Phaser's built-in physics and sprite system

**Pros:**
- Phaser handles game loop, physics, collisions automatically
- Better performance
- Easier to add polish later
- Lots of examples/tutorials

**Cons:**
- Learning curve for Phaser (small, but exists)
- Slightly more setup

**Recommendation:** Start with **Option A** (pure React/Canvas) for speed, can migrate to Phaser if needed.

---

## Development Phases

### Phase 1: Core Flight Mechanic (Day 1-2)
**Goal:** Make flying feel good

**Tasks:**
- [ ] Set up React project with Canvas
- [ ] Implement player bird sprite
- [ ] Add keyboard controls (Space = flap up, Arrow keys = move)
- [ ] Add touch controls (tap = flap, swipe = direction)
- [ ] Implement gravity and momentum physics
- [ ] Create scrolling background (simple parallax)
- [ ] Add 3-5 simple obstacles (static branches)
- [ ] Collision detection (hit obstacle = restart level)

**Acceptance Criteria:**
- Bird responds smoothly to input
- Flying feels rewarding, not frustrating
- Collision works correctly

### Phase 2: First Level (Day 2-3)
**Goal:** Playable level start to finish

**Tasks:**
- [ ] Design level 1 layout (2 minutes of flight)
- [ ] Place obstacles thoughtfully (easy → medium difficulty)
- [ ] Add wind feathers to collect (just visuals + counter)
- [ ] Create "safe zone" at midpoint (no obstacles, bird auto-lands)
- [ ] Add level start/end screens
- [ ] Implement simple scoring (feathers collected, time)

**Acceptance Criteria:**
- Level is completable
- Clear beginning and end
- Safe zone feels like natural pause

### Phase 3: Elder Bird Encounter (Day 3-4)
**Goal:** Reading integration that feels natural

**Tasks:**
- [ ] Create Elder Bird encounter UI
  - Full-screen overlay
  - Bird illustration (can be simple)
  - Text box with fact (2-3 sentences, 25 words)
  - Large, readable font (OpenDyslexic or similar)
  - "Continue" button
- [ ] Write 3 real bird facts:
  - Peregrine Falcon (speed/diving)
  - Hummingbird (hovering)
  - Albatross (gliding endurance)
- [ ] Trigger encounter when player enters safe zone
- [ ] Show ability unlock animation after reading
- [ ] Add ability to player's available powers

**Acceptance Criteria:**
- Text is large and readable
- Encounter doesn't feel jarring
- Clear what ability was unlocked
- No time pressure to read

### Phase 4: Ability System (Day 4-5)
**Goal:** Make reading payoff feel powerful

**Tasks:**
- [ ] Implement 3 abilities:
  - **Speed Boost:** Press 'E' or double-tap = 3 seconds of fast flight
  - **Hover:** Press 'E' or double-tap = freeze in place for 3 seconds
  - **Extended Glide:** Press 'E' or double-tap = no gravity for 5 seconds
- [ ] Add ability UI (show which abilities are available)
- [ ] Add cooldown system (can't spam abilities)
- [ ] Visual effects for each ability (simple particles or color shifts)
- [ ] Sound effects for activation

**Acceptance Criteria:**
- Abilities feel impactful
- Clear when abilities are available/on cooldown
- Easy to activate during flight

### Phase 5: Second Level + Polish (Day 5-6)
**Goal:** Replayability and testing

**Tasks:**
- [ ] Create level 2 (slightly harder)
- [ ] Add 2 more Elder encounters
- [ ] Polish UI (main menu, pause menu)
- [ ] Add restart/replay options
- [ ] Improve visual feedback (smoother animations)
- [ ] Test with your son and iterate

**Acceptance Criteria:**
- Both levels playable end-to-end
- Your son wants to replay it
- Can easily restart and try again

---

## File Structure

```
wild-wings-prototype/
├── public/
│   ├── index.html
│   └── assets/
│       ├── images/
│       │   ├── bird.png
│       │   ├── elder-falcon.png
│       │   ├── elder-hummingbird.png
│       │   ├── background.png
│       │   └── obstacles.png
│       └── sounds/
│           ├── flap.mp3
│           ├── collect.mp3
│           └── ability.mp3
├── src/
│   ├── components/
│   │   ├── MainMenu.jsx
│   │   ├── GameCanvas.jsx
│   │   ├── ElderEncounter.jsx
│   │   ├── AbilityUI.jsx
│   │   └── PauseMenu.jsx
│   ├── game/
│   │   ├── Player.js
│   │   ├── Obstacle.js
│   │   ├── Collectible.js
│   │   ├── Physics.js
│   │   └── Level.js
│   ├── data/
│   │   ├── birdFacts.js
│   │   └── levels.js
│   ├── App.jsx
│   └── index.js
└── package.json
```

---

## Key Design Decisions for Prototype

### Controls
**Keyboard:**
- **Spacebar:** Flap/gain altitude
- **Arrow Keys:** Move left/right/down
- **E Key:** Activate ability

**Touch/Mobile:**
- **Tap:** Flap/gain altitude
- **Swipe Left/Right:** Move horizontally
- **Double-tap:** Activate ability

### Reading Presentation
- **Font:** Sans-serif, 24px minimum
- **Background:** Solid light color with dark text (high contrast)
- **Pacing:** Player-controlled (button to continue)
- **Word Count:** 20-30 words per fact
- **No timers:** Zero pressure to read quickly

### Bird Facts (Examples)
```javascript
const birdFacts = [
  {
    id: 1,
    species: "Peregrine Falcon",
    fact: "The peregrine falcon is the fastest animal on Earth! When diving, it can reach speeds over 240 miles per hour. They tuck their wings and drop like a rocket.",
    ability: "speed_boost",
    abilityName: "Dive Bomb",
    abilityDescription: "Burst forward at incredible speed for 3 seconds!"
  },
  {
    id: 2,
    species: "Ruby-throated Hummingbird",
    fact: "Hummingbirds can flap their wings 50 times per second! They're the only birds that can fly backwards and hover perfectly still in one spot.",
    ability: "hover",
    abilityName: "Hover Focus",
    abilityDescription: "Freeze in place to carefully navigate tight spaces!"
  },
  {
    id: 3,
    species: "Albatross",
    fact: "Albatrosses have the longest wingspan of any bird—up to 11 feet! They can glide for hours without flapping, riding ocean winds across thousands of miles.",
    ability: "extended_glide",
    abilityName: "Eternal Glide",
    abilityDescription: "Float effortlessly without losing altitude for 5 seconds!"
  }
];
```

---

## Testing Plan

### Internal Testing (You)
- [ ] Complete both levels without crashing
- [ ] All abilities work as expected
- [ ] Text is readable on different screen sizes
- [ ] Controls feel responsive
- [ ] No major bugs

### User Testing (Your Son)
**Session 1 (15-20 min):**
- Observe without helping
- Note: Where does he struggle? Where does he smile?
- Ask after: "Was that fun?" "Do you want to play again?"
- Ask: "Which bird power was your favorite?"

**Session 2 (after fixes):**
- Did changes improve experience?
- Does he voluntarily read the facts or skip through?
- How many times does he replay levels?

### Key Metrics to Watch:
- Does he complete both levels?
- Does he use the abilities?
- Does he read the full facts or just skim?
- Does he ask to play more after finishing?
- Does he talk about the bird facts afterwards?

---

## Timeline Estimate

**Aggressive Schedule (focused work):**
- Phase 1: 1-2 days
- Phase 2: 1 day
- Phase 3: 1-2 days
- Phase 4: 1 day
- Phase 5: 1-2 days
- **Total: 5-8 days of development**

**Realistic Schedule (part-time):**
- 2-3 hours per day
- **Total: 2-3 weeks**

**Just Weekends:**
- **Total: 4-6 weeks**

---

## Success Criteria

### Prototype is SUCCESSFUL if:
✅ Your son completes both levels
✅ He asks to play again
✅ He actually reads the bird facts (not just button mashing through)
✅ He uses at least 2 of the 3 abilities
✅ He mentions something about the birds afterwards ("Dad, did you know falcons are super fast?")

### Prototype FAILS if:
❌ He gets frustrated and quits
❌ He skips through all the reading without looking
❌ Flight controls feel unresponsive or unfair
❌ Elder encounters feel like annoying interruptions
❌ He shows no interest in replaying

---

## After the Prototype: Decision Point

### If Successful → Next Steps:
1. **Expand prototype:** Add 2-3 more levels, 5 more birds
2. **Start seeking feedback:** Show to other parents with 6-8 year-olds
3. **Consider funding:** Apply to educational game grants, pitch to indie publishers
4. **Explore mobile port:** Test React Native or Capacitor for tablet deployment
5. **Build out full GDD features gradually**

### If Mixed Results → Iterate:
- Adjust reading difficulty (shorter/longer text)
- Change when reading appears (more/less frequent)
- Modify ability balance (make them more impactful)
- Improve flight feel (physics tuning)
- Test with 2-3 other kids for additional data points

### If Fails → Pivot:
- Maybe action + reading doesn't work for your son specifically
- Try different genre (collection/exploration instead of flying)
- Consider simpler reading integration
- Test hypothesis with existing educational games first

---

## Tools & Resources Needed

### Development:
- Code editor (VS Code)
- Node.js + npm
- React (create-react-app or Vite)
- Basic image editor (for bird sprites - even MS Paint works)

### Assets (Prototype-friendly sources):
- **Art:** OpenGameArt.org, Kenney.nl (free game assets)
- **Fonts:** Google Fonts (Quicksand, Lexend, OpenDyslexic)
- **Sound:** Freesound.org, Zapsplat.com
- **Music:** Incompetech.com (Kevin MacLeod's royalty-free music)

### Learning Resources (if needed):
- Phaser 3 tutorials: phaser.io/tutorials
- HTML5 Canvas game dev: MDN Web Docs
- React game patterns: Various YouTube tutorials

---

## Risk Mitigation

**Risk 1:** Prototype takes way longer than planned
- **Mitigation:** Cut scope aggressively. 1 level with 2 abilities is fine for testing.

**Risk 2:** Your son hates it immediately
- **Mitigation:** Have backup activities. Make testing playful, not formal. Get feedback gently.

**Risk 3:** Flight controls feel terrible
- **Mitigation:** Spend extra time in Phase 1 getting this right. It's the foundation.

**Risk 4:** You get stuck on technical problems
- **Mitigation:** Keep it simple. Ugly prototype > perfect vaporware. Use existing code examples liberally.

---

## Immediate Next Steps (If You Want to Start)

1. **Set up environment:**
   ```bash
   npx create-react-app wild-wings-prototype
   cd wild-wings-prototype
   npm start
   ```

2. **Create basic canvas:**
   - Start with GameCanvas component
   - Draw a simple rectangle (your bird)
   - Make it respond to spacebar (moves up)

3. **Test with your son immediately:**
   - Even just "press space to make the bird go up" is worth showing him
   - Get his reaction to the core feel

4. **Iterate from there:**
   - Add one feature at a time
   - Test frequently
   - Build confidence that this will work

---

## Final Thoughts

The prototype isn't about making a beautiful game—it's about **validating the core hypothesis**: *Does reading about birds to gain their powers motivate a 7-year-old to engage with text?*

Everything else (art, sound, story, polish) can come later if the answer is yes.

**Start small, test early, iterate fast.** 🚀

---

## Appendix: Phase 1 Implementation Guide

### Step-by-Step for Core Flight Mechanic

**1. Set up React Project:**
```bash
npx create-react-app wild-wings-prototype
cd wild-wings-prototype
npm start
```

**2. Create GameCanvas Component:**
```jsx
// src/components/GameCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [bird, setBird] = useState({ x: 100, y: 300, velocityY: 0 });
  
  // Game loop will go here
  
  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={600}
      style={{ border: '1px solid black' }}
    />
  );
};

export default GameCanvas;
```

**3. Implement Game Loop:**
```javascript
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  
  const gameLoop = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update bird physics
    setBird(prev => ({
      ...prev,
      velocityY: prev.velocityY + 0.5, // gravity
      y: prev.y + prev.velocityY
    }));
    
    // Draw bird
    ctx.fillStyle = 'blue';
    ctx.fillRect(bird.x, bird.y, 40, 40);
    
    requestAnimationFrame(gameLoop);
  };
  
  gameLoop();
}, [bird]);
```

**4. Add Keyboard Controls:**
```javascript
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.code === 'Space') {
      setBird(prev => ({
        ...prev,
        velocityY: -8 // flap upward
      }));
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

**5. Add Obstacles:**
```javascript
const [obstacles, setObstacles] = useState([
  { x: 400, y: 200, width: 50, height: 200 },
  { x: 600, y: 100, width: 50, height: 250 }
]);

// In game loop, draw obstacles:
obstacles.forEach(obs => {
  ctx.fillStyle = 'brown';
  ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
});
```

**6. Collision Detection:**
```javascript
const checkCollision = (bird, obstacle) => {
  return (
    bird.x < obstacle.x + obstacle.width &&
    bird.x + 40 > obstacle.x &&
    bird.y < obstacle.y + obstacle.height &&
    bird.y + 40 > obstacle.y
  );
};

// In game loop:
obstacles.forEach(obs => {
  if (checkCollision(bird, obs)) {
    alert('Collision! Restarting...');
    // Reset game
  }
});
```

This gives you the foundation. From here, you build level 2, add Elder encounters, etc.

---

**Document Version:** 1.0  
**Created:** November 2025  
**For:** Wild Wings: Storm Chaser JavaScript Prototype