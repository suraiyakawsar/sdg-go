// // src/components/game/PhaserGame.jsx
// import { useEffect, useRef } from "react";
// import Phaser from "phaser";
// import { emit } from "../../utils/eventBus";

// // Import Phaser scenes
// import BootScene from "../../game/scenes/BootScene";
// import UIScene from "../../game/scenes/UIScene";
// import Chapter1Scene from "../../game/scenes/Chapter1/Chapter1Scene";
// import Chapter1Scene2 from "../../game/scenes/Chapter1/Chapter1Scene2";
// import Chapter1Scene3 from "../../game/scenes/Chapter1/Chapter1Scene3";
// import Chapter2Scene1 from "../../game/scenes/Chapter2/Chapter2Scene1";
// import Chapter2Scene2 from "../../game/scenes/Chapter2/Chapter2Scene2";
// import Chapter2Scene3 from "../../game/scenes/Chapter2/Chapter2Scene3";
// import Chapter3Scene1 from "../../game/scenes/Chapter3/Chapter3Scene1";
// import Chapter3Scene2 from "../../game/scenes/Chapter3/Chapter3Scene2";
// import Chapter4Scene1 from "../../game/scenes/Chapter4/Chapter4Scene1";
// import Chapter4Scene2 from "../../game/scenes/Chapter4/Chapter4Scene2";
// import HowToPlayScene from "../../game/scenes/HowToPlayScene";

// export default function PhaserGame() {
//   const containerRef = useRef(null);
//   const phaserRef = useRef(null);

//   const width = window.innerWidth;
//   const height = window.innerHeight;

//   useEffect(() => {
//     if (phaserRef.current) return; // Prevent multiple initializations

//     // ✅ Get the saved scene from localStorage
//     const savedScene = localStorage.getItem("currentScene") || "Chapter1Scene";
//     console.log("🎮 Loading scene:", savedScene);

//     const config = {
//       type: Phaser.AUTO,
//       parent: containerRef.current,
//       backgroundColor: "#000",

//       // ⭐ Use ONLY the scale system, not width/height here
//       scale: {
//         mode: Phaser.Scale.FIT,
//         autoCenter: Phaser.Scale.CENTER_BOTH,
//         width: 1920,
//         height: 1080,
//       },

//       physics: {
//         default: "arcade",
//         arcade: {
//           gravity: { y: 0 },
//           debug: false,
//         },
//       },

//       render: {
//         antialias: true,
//         pixelArt: false,
//         roundPixels: false,
//       },

//       scene: [BootScene, UIScene, HowToPlayScene, Chapter1Scene, Chapter1Scene2, Chapter1Scene3, Chapter2Scene1, Chapter2Scene2, Chapter2Scene3, Chapter3Scene1, Chapter3Scene2, Chapter4Scene1, Chapter4Scene2],
//     };

//     phaserRef.current = new Phaser.Game(config);

//     // Clean up Phaser on component unmount
//     return () => {
//       if (phaserRef.current) {
//         phaserRef.current.destroy(true);
//         phaserRef.current = null;
//       }
//     };

//     const game = new Phaser.Game(config);
//     phaserRef.current = game;

//     // ✅ CORRECT: Listen for Boot scene to complete, then start saved scene
//     game.events.once("ready", () => {
//       console.log("✅ Phaser ready, starting scene:", savedScene);

//       // Stop any running scenes first
//       game.scene.isActive("BootScene") && game.scene.stop("BootScene");
//       game.scene.isActive("UIScene") && game.scene.sleep("UIScene");

//       // Start the saved scene
//       game.scene.start(savedScene, { resumed: true });
//     });

//     // Clean up on unmount
//     return () => {
//       if (phaserRef.current) {
//         phaserRef.current.destroy(true);
//         phaserRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div className="relative w-full h-full">
//       <div ref={containerRef} className="w-full h-full" />
//     </div>
//   );
// }

import BootScene from "../../game/scenes/BootScene";
import UIScene from "../../game/scenes/UIScene";
import Chapter1Scene from "../../game/scenes/Chapter1/Chapter1Scene";
import Chapter1Scene2 from "../../game/scenes/Chapter1/Chapter1Scene2";
import Chapter1Scene3 from "../../game/scenes/Chapter1/Chapter1Scene3";
import Chapter2Scene1 from "../../game/scenes/Chapter2/Chapter2Scene1";
import Chapter2Scene2 from "../../game/scenes/Chapter2/Chapter2Scene2";
import Chapter2Scene3 from "../../game/scenes/Chapter2/Chapter2Scene3";
import Chapter3Scene1 from "../../game/scenes/Chapter3/Chapter3Scene1";
import Chapter3Scene2 from "../../game/scenes/Chapter3/Chapter3Scene2";
import Chapter4Scene1 from "../../game/scenes/Chapter4/Chapter4Scene1";
import HowToPlayScene from "../../game/scenes/HowToPlayScene";
import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { emit } from "../../utils/eventBus";
import { useLocation } from "react-router-dom"; // ← ADD THIS
import Chapter4Scene2 from "../../game/scenes/Chapter4/Chapter4Scene3";

// ... imports ...

export default function PhaserGame() {
  const containerRef = useRef(null);
  const phaserRef = useRef(null);
  const location = useLocation(); // ← ADD THIS

  useEffect(() => {
    if (phaserRef.current) {
      // ✅ NEW: If game exists, just switch scenes instead of destroying
      const savedScene = localStorage.getItem("currentScene") || "Chapter1Scene";
      console.log("🎮 Switching to scene:", savedScene);

      // Stop all running scenes and start the saved one
      phaserRef.current.scene.stopAll();
      phaserRef.current.scene.start(savedScene, { resumed: true });

      return; // Don't create a new game
    }

    // ✅ ORIGINAL: Create game only on first load
    const savedScene = localStorage.getItem("currentScene") || "Chapter1Scene";
    console.log("🎮 Loading scene:", savedScene);

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#000",

      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
      },

      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },

      render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
      },

      scene: [
        BootScene, UIScene, HowToPlayScene, Chapter1Scene, Chapter1Scene2,
        Chapter1Scene3, Chapter2Scene1, Chapter2Scene2, Chapter2Scene3,
        Chapter3Scene1, Chapter3Scene2, Chapter4Scene1, Chapter4Scene2
      ],
    };

    const game = new Phaser.Game(config);
    phaserRef.current = game;

    game.events.once("ready", () => {
      console.log("✅ Phaser ready, starting scene:", savedScene);
      game.scene.isActive("BootScene") && game.scene.stop("BootScene");
      game.scene.isActive("UIScene") && game.scene.sleep("UIScene");
      game.scene.start(savedScene, { resumed: true });
    });

    return () => {
      if (phaserRef.current) {
        phaserRef.current.destroy(true);
        phaserRef.current = null;
      }
    };
  }, [location.pathname]); // ✅ Change dependency to pathname! 

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}