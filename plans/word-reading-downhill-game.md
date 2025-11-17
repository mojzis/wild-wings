# Word-Reading Downhill Game Prototype

## Game Concept

An endless-runner style downhill skiing/sledding game where the player must read and respond to single-word signs to avoid obstacles and hazards. Reading comprehension under time pressure is the core mechanic - miss a sign and you crash. The game features a distinctive visual style with gentle, thin-line aesthetics and subdued pastel tones.

Think: Tux Racer meets Duolingo, but for early readers practicing sight words and action verbs under pressure.

## Core Mechanics

### Movement
- Auto-scroll downhill (constant forward momentum)
- Left/Right lane switching (3-5 lanes)
- Speed increases gradually as player progresses
- No jumping - pure lateral movement decisions

### Word Signs
- Appear 3-5 seconds before obstacle/hazard
- Single word commands or warnings
- Must be read and acted upon to survive
- Signs fade/disappear after passing decision point

### Sign Types & Actions

**Directional Commands:**
- "LEFT" - move to left lane(s)
- "RIGHT" - move to right lane(s)
- "CENTER" - move to middle lane
- "STAY" - don't move from current position

**Hazard Warnings:**
- "ROCKS" - rocks appear in certain lanes
- "TREE" - tree obstacle ahead
- "ICE" - slippery patch (harder to control)
- "GAP" - missing track section
- "BRANCH" - low-hanging branch

**Action Modifiers:**
- "SLOW" - speed bump ahead (auto-slows)
- "FAST" - speed boost zone
- "JUMP" - launch ramp (automatic)
- "DUCK" - tunnel/low clearance

### Failure States
- Hit obstacle = crash and restart
- Wrong lane after sign = crash
- Ignore directional sign = crash
- 3 strikes system for warnings vs instant failure

### Progression
- Endless mode: see how far you can go
- Score based on distance traveled
- Speed increases every 500m
- Sign complexity increases (compound words later)
- More signs appear simultaneously at higher levels

## Technical Architecture

### Project Structure
```
word-reader-downhill/
├── src/
│   ├── App.js                    # Root component
│   ├── components/
│   │   ├── GameCanvas.jsx        # Main game loop (60fps)
│   │   ├── MainMenu.jsx          # Start screen
│   │   ├── GameOver.jsx          # Results screen
│   │   └── Settings.jsx          # Difficulty/speed settings
│   ├── game/
│   │   ├── Player.js             # Skier/slider character
│   │   ├── Lane.js               # Lane system (3-5 lanes)
│   │   ├── Sign.js               # Word sign entities
│   │   ├── Obstacle.js           # Hazard objects
│   │   ├── WordManager.js        # Sign generation & logic
│   │   ├── Physics.js            # Movement constants
│   │   └── ScoreManager.js       # Distance/score tracking
│   └── data/
│       ├── wordLists.js          # Categorized word lists
│       └── visualTheme.js        # Color palette definitions
└── public/
    └── index.html
```

### Game Loop (GameCanvas.jsx)
- 60fps via requestAnimationFrame
- Vertical auto-scroll (downhill perspective)
- Lateral player movement (lane switching)
- Sign spawning based on upcoming obstacles
- Collision detection (player lane vs obstacle lane)
- Sign visibility and timing

### Lane System (Lane.js)
- 3 lanes initially, 5 lanes at higher speeds
- Each lane has x-position
- Player snaps to lane center
- Smooth transitions between lanes (100-200ms)
- Lane highlighting on sign instructions

### Sign System (Sign.js)
- Spawn 3-5 seconds before related obstacle
- Position: centered above lanes or at specific lane
- Fade-in animation
- Large, readable font (minimum 48px)
- Disappear after player passes decision point
- Different colors for different sign types

### Word Manager (WordManager.js)
- Maintains active word lists by difficulty
- Generates sign + obstacle pairs
- Ensures variety (no repeating same word 3x in row)
- Difficulty scaling:
  - Level 1: 1-syllable words (STOP, GO, LEFT)
  - Level 2: 2-syllable words (CAREFUL, DANGER)
  - Level 3: Compound situations (two signs at once)
- Random but logical pairing (sign matches obstacle)

### Player (Player.js)
- Current lane (0-4 index)
- Target lane (for smooth transitions)
- Animation state (idle, turning, crash)
- Visual: simple character silhouette on sled/skis
- Thin outline style matching theme

### Obstacle (Obstacle.js)
- Lane position
- Type (rock, tree, gap, branch, etc.)
- Y position (distance down track)
- Collision bounds
- Visual style: minimal line art

## Visual Design

### Color Palette

**Primary Palette (Subdued Pastels):**
- Sky gradient: `#E1F5FE` → `#F7E6F2` (light blue to soft lavender)
- Snow/ground: `#F5F5F0` (warm off-white)
- Track lines: `#D4D4C8` (soft gray-beige)

**Character & Objects (Gentle Accents):**
- Player outline: `#8FA9B8` (dusty blue-gray)
- Tree obstacles: `#B8C4B8` (sage green)
- Rock obstacles: `#C9B8AD` (soft taupe)
- Warning signs: `#F4C8B8` (pale coral)
- Action signs: `#B8D4E8` (powder blue)

**Text & UI:**
- Sign text: `#4A5568` (charcoal gray)
- Score/distance: `#6B7280` (medium gray)
- Highlights: `#E8C4A8` (warm cream)

### Visual Style Guidelines

**Line Work:**
- 1-2px stroke width maximum
- Hand-drawn quality (subtle wobble)
- No thick outlines or bold strokes
- Minimal detail

**Shapes:**
- Simplified geometric forms
- Rounded corners everywhere
- No harsh angles
- Organic, gentle curves

**Typography:**
- Sans-serif, rounded (like Quicksand or Nunito)
- Generous letter spacing
- Minimum 48px for signs (readability at speed)
- Maximum 3-4 font weights (light, regular, semibold)

**Animation:**
- Smooth easing (no linear)
- Gentle fades (300-500ms)
- Subtle floating/bobbing on signs
- Minimal particle effects (small dots, not explosions)

**Background Elements:**
- Parallax layers (distant hills, trees)
- Muted colors (50% opacity max)
- Blurred/soft focus
- Thin line silhouettes only

## Word Lists & Content Strategy

### Word Categories

**Directional (Core Vocabulary):**
- LEFT, RIGHT, CENTER, MIDDLE, STAY
- UP, DOWN, OVER, UNDER
- TURN, STRAIGHT, CURVE

**Hazards (Nouns):**
- ROCK, TREE, BRANCH, LOG
- GAP, HOLE, CLIFF, DROP
- ICE, SNOW, MUD, WATER

**Actions (Verbs):**
- STOP, GO, SLOW, FAST
- JUMP, DUCK, DODGE, AVOID
- WAIT, WATCH, LOOK

**Modifiers (Adjectives/Adverbs):**
- BIG, SMALL, WIDE, NARROW
- CAREFUL, QUICK, SLOW
- SOON, NOW, NEXT

**Compound Phrases (Advanced):**
- "LEFT TREE" (tree on left, move right)
- "BIG GAP" (major obstacle ahead)
- "FAST RIGHT" (quick move to right)

### Word List Scaling

**Distance 0-500m (Beginner):**
- 8-10 unique words
- 1 syllable only
- High frequency sight words
- Single sign at a time
- 5-7 seconds reading time

**Distance 500-1500m (Intermediate):**
- 20-25 unique words
- 1-2 syllables
- Mix of nouns/verbs
- Occasional 2 signs (5+ seconds apart)
- 4-5 seconds reading time

**Distance 1500m+ (Advanced):**
- 40-50 unique words
- 1-3 syllables
- Compound phrases
- Multiple simultaneous signs
- 3-4 seconds reading time
- Unfamiliar words (vocabulary building)

### Word Variety Strategy

**Rotation System:**
- Pool of 100+ total words
- Active pool of 15-20 at current difficulty
- Swap out 3-5 words every 250m
- Track last 5 words shown, avoid repeating
- Prioritize words player struggled with (missed)

**Contextual Pairing:**
- Sign must match obstacle logically
- "TREE" sign → tree obstacle in lane
- "LEFT" sign → hazard in right lanes
- "DUCK" sign → low branch overhead
- "GAP" sign → missing track section

## Implementation Plan

### Phase 1: Core Engine
- Set up React project structure
- Implement GameCanvas with 60fps loop
- Create Lane system (3 lanes initially)
- Build Player with lane-switching movement
- Add basic auto-scroll (vertical downhill)
- Implement visual theme (colors, styles)

### Phase 2: Obstacle System
- Create Obstacle class
- Implement basic obstacle types (rock, tree, gap)
- Add collision detection (lane-based)
- Build obstacle spawning system
- Create obstacle rendering (thin line style)
- Add crash/failure state

### Phase 3: Sign System
- Build Sign class
- Implement sign spawning logic
- Create sign-obstacle pairing
- Add sign rendering (large text, pastels)
- Implement sign timing (appear before obstacle)
- Add sign fade animations

### Phase 4: Word Management
- Create WordManager class
- Build word list data structure
- Implement difficulty scaling
- Add word rotation logic
- Create contextual pairing system
- Build variety/anti-repeat logic

### Phase 5: Scoring & Progression
- Implement distance tracking
- Add speed scaling (increases over time)
- Create score calculation
- Build difficulty transitions
- Add high score persistence (localStorage)
- Implement game over screen

### Phase 6: Polish & Refinement
- Refine visual aesthetics (line weights, colors)
- Add background parallax layers
- Implement smooth lane transitions
- Add subtle sound effects (optional)
- Create settings panel (speed, difficulty)
- Add tutorial/practice mode

### Phase 7: Content Expansion
- Expand word lists to 100+ words
- Test word-obstacle pairings
- Balance difficulty curve
- Add compound phrases
- Create word introduction system
- Test with target age group

## Technical Considerations

### Performance
- Canvas rendering only (no DOM manipulation during game)
- Object pooling for obstacles/signs
- Efficient collision detection (only check active lane)
- Lazy sign spawning (only when needed)
- Clean up off-screen objects

### Accessibility
- High contrast text on signs
- Minimum font size requirements
- Color-blind friendly palette
- Keyboard controls (arrow keys)
- Adjustable speed settings

### State Management
- React state for UI (menu, game over, settings)
- Game state in refs (player, obstacles, signs)
- localStorage for high scores
- No global state needed (simple game)

### Input Handling
- Arrow keys for lane switching
- Spacebar for pause
- Enter for restart
- Touch/swipe support (mobile future)

### Collision Detection
- Lane-based (not pixel-perfect)
- Check player lane vs obstacle lane
- Buffer zone (50px before/after obstacle)
- Immediate failure on match

## Content Design Notes

### Word Selection Criteria
- Age-appropriate (grades 1-3 target)
- High utility (useful across contexts)
- Clear visual pairing (tree → picture of tree)
- Phonetically regular (for decoding practice)
- Mix of familiar and stretch words

### Difficulty Balancing
- Start easy (build confidence)
- Gradual introduction of new words
- Repeat words in different contexts
- Increase speed before adding complexity
- Provide recovery time after difficult sections

### Educational Value
- Sight word recognition
- Rapid decoding practice
- Context clues (sign + visual obstacle)
- Vocabulary expansion
- Reading under time pressure (real-world skill)

## Future Expansion Ideas

**Advanced Features:**
- Multiple characters (unlockable)
- Different environments (forest, mountain, tundra)
- Weather effects (fog reduces visibility)
- Power-ups (slow time, shield)
- Reading comprehension questions at checkpoints

**Word Complexity:**
- Sentences ("Turn left now")
- Negation ("Don't go right")
- Comparatives ("Bigger gap ahead")
- Multiple steps ("Duck then jump")

**Multiplayer:**
- Two-player split screen
- Same obstacle course, who survives longer
- Cooperative (both must read different signs)

**Analytics:**
- Track which words cause most failures
- Measure reading speed improvement
- Generate practice word lists
- Parent/teacher dashboard

## Key Differences from Wild Wings

- **Perspective:** Top-down/isometric vs side-scrolling
- **Movement:** Lane-based vs free flight
- **Reading task:** Action-critical vs educational enrichment
- **Pacing:** Speed increases vs player-controlled
- **Failure:** Immediate crash vs gradual health loss
- **Art style:** Thin lines/pastels vs medium-weight/saturated
- **Word count:** 100+ words vs 3-5 bird facts
- **Complexity:** Simple mechanics/hard reading vs complex mechanics/easy reading

---

## Quick Tech Stack

- React 18+
- HTML5 Canvas
- Vanilla JavaScript (game classes)
- localStorage (persistence)
- No external game engines
- No physics library needed (simple kinematics)

## Content Requirements

- 100+ single words (various categories)
- 10+ obstacle types
- 5+ sign visual styles
- 3 difficulty tiers
- Palette: 10-12 colors total

---

*Plan ready for prototyping - focus on core loop first (movement + signs + obstacles), then expand word lists and polish visuals.*
