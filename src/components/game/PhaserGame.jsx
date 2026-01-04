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
  const location = useLocation();

  // 🔧 DEBUG:  Hardcode scene here
  const DEBUG_SCENE = "Chapter3Scene2"; // ← Change this line

  useEffect(() => {
    // ✅ If game already exists, just switch scenes
    if (phaserRef.current) {
      // ✅ NEW: If game exists, just switch scenes instead of destroying
      // const savedScene = localStorage.getItem("currentScene") || "Chapter1Scene";
      console.log("🎮 Switching to scene:", DEBUG_SCENE);

      // Stop all running scenes and start the saved one
      phaserRef.current.scene.stopAll();
      phaserRef.current.scene.start(DEBUG_SCENE, { resumed: true });
      return; // Don't create a new game
    }

    // ✅ Create game only on first load
    console.log("🎮 Loading scene:", DEBUG_SCENE);


    // // ✅ ORIGINAL: Create game only on first load
    // const savedScene = localStorage.getItem("currentScene") || "Chapter1Scene";
    // console.log("🎮 Loading scene:", savedScene);

    const game = new Phaser.Game({
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
    });

    phaserRef.current = game;

    // ✅ Expose the game instance globally so React can access it
    window.__PHASER_GAME__ = game;

    game.events.once("ready", () => {
      console.log("✅ Phaser ready, starting scene:", DEBUG_SCENE);
      // game.scene.isActive("BootScene") && game.scene.stop("BootScene");
      // game.scene.isActive("UIScene") && game.scene.sleep("UIScene");
      // game.scene.start(savedScene, { resumed: true });
      // 🔧 DEBUG: Start debug scene directly instead of BootScene
      game.scene.stop("BootScene");
      game.scene.start(DEBUG_SCENE);
    });

    return () => {
      if (phaserRef.current) {
        phaserRef.current.destroy(true);
        phaserRef.current = null;
        window.__PHASER_GAME__ = null; // ✅ Clean up global reference
      }
    };
  }, [location.pathname]); // ✅ Change dependency to pathname! 

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={containerRef} className="w-full h-full overflow-hidden" />
    </div>
  );
}