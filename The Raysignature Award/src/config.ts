/**
 * Premium Awards Ceremony Asset & Theme Configuration
 * 
 * Customize this configuration file to change the 3D assets, colors, and styling parameters.
 * To use your custom 3D model, place your .glb file in the public assets/ folder 
 * and update the `trophyModelPath` below.
 */

export const AWARDS_CONFIG = {
  // Navigation & Release Status Toggle Parameters
  status: {
    hasNomineesReleased: true, // Toggle this to false to see the coming soon layout
    showCountdown: true,       // Toggle this to false to hide the grand countdown timer
  },

  // Path to the 3D model. In a standard Vite setup, files under /public or /assets
  // can be resolved relative to the web server root.
  trophyModelPath: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
  
  // Custom fallback visual configuration if the model fails to load or isn't uploaded yet
  fallback: {
    // Elegant warm cinematic gold
    color: "#dca738", 
    roughness: 0.15,
    metalness: 0.95,
  },
  
  // Cinematic Spotlights & Environment
  lighting: {
    spotlightGold: {
      color: "#ffca4b", 
      intensity: 15,
      distance: 100,
      angle: Math.PI / 6,
      penumbra: 0.6,
      decay: 1.2
    },
    rimWhite: {
      color: "#ece6ff", 
      intensity: 22,
      distance: 60,
      angle: Math.PI / 4,
      penumbra: 0.8,
      decay: 1.0
    },
    ambient: {
      color: "#0b0c10",
      intensity: 0.4
    }
  },

  // Narrative configuration for ceremony sections
  sections: [
    {
      id: "welcome",
      title: "The Raysignature Awards",
      subtitle: "Honoring Creative Mastery",
      tagline: "EXCELLENCE • INNOVATION • ICONS",
      description: "Celebrating Excellence, Innovation, and Creative Icons. Welcome to an extraordinary visual architecture where elite minds and culture-defining pioneers are immortalized."
    },
    {
      id: "reveal",
      title: "Honoring The Visionaries",
      subtitle: "The Vanguard of Our Time",
      tagline: "AN EXTRAORDINARY NIGHT",
      description: "An extraordinary evening dedicated to the pioneers of creative expression. Join us as we lift the veil on a new era of prestige, celebrating the monumental records and milestones of our industry leaders."
    },
    {
      id: "excellence",
      title: "Icons of The Culture",
      subtitle: "The Modern Renaissance",
      tagline: "THE SIGNATURE STANDARD",
      description: "Honoring the definitive architects of media, digital curation, and creative culture. The Raysignature Awards serves as an extraordinary registry where exceptional vision, cultural impact, and ground-breaking innovation are permanently immortalized."
    },
    {
      id: "companion",
      title: "Witness History",
      subtitle: "The Golden Podium",
      tagline: "CROWN THE NEXT GENERATION",
      description: "Join us as we crown the next generation. Take your place under the warm gold spotlights, and craft your majestic acceptance speech using our high-thinking AI system."
    }
  ]
};
