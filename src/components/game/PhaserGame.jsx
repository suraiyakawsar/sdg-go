// src/components/game/PhaserGame.jsx
import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { emit } from "../../utils/eventBus";

// Import Phaser scenes
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
import Chapter3Scene3 from "../../game/scenes/Chapter3/Chapter3Scene3";
import Chapter4Scene1 from "../../game/scenes/Chapter4/Chapter4Scene1";
import Chapter4Scene2 from "../../game/scenes/Chapter4/Chapter4Scene2";
import Chapter4Scene3 from "../../game/scenes/Chapter4/Chapter4Scene3";
import Chapter5Scene1 from "../../game/scenes/Chapter5/Chapter5Scene1";
import Chapter5Scene2 from "../../game/scenes/Chapter5/Chapter5Scene2";
import Chapter5Scene3 from "../../game/scenes/Chapter5/Chapter5Scene3";

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
    //   scene: [BootScene, UIScene, Chapter1Scene, Chapter1Scene2],
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

      scene: [BootScene, UIScene, Chapter1Scene, Chapter1Scene2, Chapter1Scene3, Chapter2Scene1, Chapter2Scene2, Chapter2Scene3, Chapter3Scene1, Chapter3Scene2, Chapter3Scene3, Chapter4Scene1, Chapter4Scene2, Chapter4Scene3, Chapter5Scene1, Chapter5Scene2, Chapter5Scene3],
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
