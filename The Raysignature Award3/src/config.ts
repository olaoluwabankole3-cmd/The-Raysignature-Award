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
      subtitle: "Cheering on Amazing Creators",
      tagline: "COOL DESIGNS • NEW IDEAS • STAR CREATORS",
      description: "We celebrate the world's most creative minds and artists. Welcome to the show where amazing creators and their hard work are remembered forever!"
    },
    {
      id: "reveal",
      title: "Meet the Creators",
      subtitle: "The Leaders of Art & Design",
      tagline: "AN AMAZING CELEBRATION",
      description: "This is a special show made just for people who love to create awesome things! Come join us as we celebrate great work and the big accomplishments of our design leaders."
    },
    {
      id: "excellence",
      title: "True Stars of Design",
      subtitle: "Our Creative World Today",
      tagline: "THE BEST OF THE BEST",
      description: "We cheer for the creators who make our favorite digital art, media, and design. This is a special place where we show off their creativity, hard work, and amazing new ideas."
    },
    {
      id: "companion",
      title: "Be Part of History",
      subtitle: "The Golden Stage",
      tagline: "CELEBRATE THE NEXT STARS",
      description: "Come with us as we find the next big stars! You can pretend to stand under the beautiful spotlights and cheer for your favorite creators."
    }
  ]
};
