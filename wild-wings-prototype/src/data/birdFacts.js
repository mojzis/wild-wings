/**
 * birdFacts.js
 * Educational bird facts and associated abilities for elder encounters
 */

const birdFacts = [
  {
    id: 1,
    species: "Peregrine Falcon",
    fact: "The peregrine falcon is the fastest animal on Earth! When diving to catch prey, it can reach speeds over 240 miles per hour. They tuck their wings close and drop like a rocket through the sky.",
    ability: "speed_boost",
    abilityName: "Dive Bomb",
    abilityDescription: "Burst forward at incredible speed for 3 seconds!",
    color: "#4A90E2", // Blue for speed
    icon: "⚡"
  },
  {
    id: 2,
    species: "Hummingbird",
    fact: "Hummingbirds are the only birds that can hover in place and fly backwards! Their wings beat up to 80 times per second, creating a humming sound. They can also fly upside down!",
    ability: "hover",
    abilityName: "Steady Hover",
    abilityDescription: "Hold position in the air without flapping!",
    color: "#E94B3C", // Red for hummingbird
    icon: "🌸"
  },
  {
    id: 3,
    species: "Albatross",
    fact: "The albatross has the longest wingspan of any living bird, reaching up to 11 feet! They can glide for hours without flapping their wings, riding ocean winds on journeys of thousands of miles.",
    ability: "extended_glide",
    abilityName: "Wind Rider",
    abilityDescription: "Glide gracefully for much longer distances!",
    color: "#7ED321", // Green for gliding
    icon: "🌊"
  }
];

export default birdFacts;
