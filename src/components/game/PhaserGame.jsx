import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { emit } from "../../utils/eventBus";

// Import your Phaser scenes
import BootScene from "../../game/scenes/BootScene";
import GameScene from "../../game/scenes/GameScene";
import UIScene from "../../game/scenes/UIScene";

export default function PhaserGame() {
  const gameContainer = useRef(null);
  const gameInstance = useRef(null);

  useEffect(() => {
    if (gameInstance.current) return; // Prevent multiple initializations

    // ✅ Phaser configuration
    const config = {
      type: Phaser.AUTO,
      width: 960,
      height: 540,
      backgroundColor: "#000000",
      parent: gameContainer.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: [BootScene, GameScene, UIScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    // ✅ Create Phaser game instance
    gameInstance.current = new Phaser.Game(config);

    // ✅ Optional: handle cleanup when React unmounts
    return () => {
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
        gameInstance.current = null;
      }
    };
  }, []);

  // Optional: test React → Phaser communication
  const triggerDialogue = () => {
    emit("showDialogue", {
      text: "Hey there! This is a test dialogue from PhaserGame.",
      choices: [
        { text: "Cool!", next: 1 },
        { text: "Not now", next: 2 },
      ],
    });
  };

  return (
    <div className="w-full h-full relative">
      {/* Phaser canvas container */}
      <div ref={gameContainer} className="w-full h-full" />

      {/* Example overlay button to test React → Phaser events */}
      <button
        onClick={triggerDialogue}
        className="absolute bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Test Dialogue
      </button>
    </div>
  );
}
