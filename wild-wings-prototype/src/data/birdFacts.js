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
  },
  {
    id: 4,
    species: "Bar-tailed Godwit",
    fact: "The bar-tailed godwit holds the record for the longest non-stop flight of any animal! A young godwit named B6 flew 8,425 miles from Alaska to Australia in 11 days without stopping to eat, drink, or rest. That's like flying from New York to London almost four times without landing!",
    ability: "endurance_flight",
    abilityName: "Marathon Wings",
    abilityDescription: "Fly without losing altitude for 5 seconds!",
    color: "#FF6B35", // Sunset orange
    icon: "🌅"
  },
  {
    id: 5,
    species: "Barn Owl",
    fact: "Barn owls can catch mice in complete darkness using only their hearing! Their ears are placed at different heights on their head, which lets them pinpoint sounds with less than 1 degree of error. They can hear a mouse's heartbeat under a foot of snow!",
    ability: "echo_vision",
    abilityName: "Silent Hunter",
    abilityDescription: "Detect nearby obstacles through sound!",
    color: "#C7A27C", // Warm brown
    icon: "👂"
  },
  {
    id: 6,
    species: "Arctic Tern",
    fact: "Arctic terns travel farther than any other animal on Earth! They migrate about 60,000 miles each year, flying from the Arctic to Antarctica and back. One tern was tracked flying 96,000 kilometers in just ten months! Over their 30-year life, they fly the distance from Earth to the Moon three times.",
    ability: "polar_stamina",
    abilityName: "Endless Journey",
    abilityDescription: "See two summers! Temporarily boost flight power!",
    color: "#5BC0EB", // Ice blue
    icon: "❄️"
  }
];

export default birdFacts;
