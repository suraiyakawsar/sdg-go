// src/components/game/PhaserGame.jsx
import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { emit } from "../../utils/eventBus";

// Import Phaser scenes
import BootScene from "../../game/scenes/BootScene";
import UIScene from "../../game/scenes/UIScene";
import Chapter1Scene from "../../game/scenes/Chapter1Scene";
import Chapter2Scene from "../../game/scenes/Chapter2Scene";

export default function PhaserGame() {
  const containerRef = useRef(null);
  const phaserRef = useRef(null);

  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    if (phaserRef.current) return; // Prevent multiple initializations

    // const config = {
    //   type: Phaser.AUTO,
    //   width: 1140,
    //   height: 540,
    //   backgroundColor: "#000",
    //   parent: containerRef.current,
    //   physics: {
    //     default: "arcade",
    //     arcade: { gravity: { y: 0 }, debug: false },
    //   },
    //   scene: [BootScene, UIScene, Chapter1Scene, Chapter2Scene],
    //   scale: {
    //     mode: Phaser.Scale.FIT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH,
    //   },
    // };
    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#000",

      // ⭐ Use ONLY the scale system, not width/height here
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

      scene: [BootScene, UIScene, Chapter1Scene, Chapter2Scene],
    };

    phaserRef.current = new Phaser.Game(config);

    // Clean up Phaser on component unmount
    return () => {
      if (phaserRef.current) {
        phaserRef.current.destroy(true);
        phaserRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
