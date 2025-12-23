import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import UIScene from "./scenes/UIScene";
import Chapter1Scene2 from "./scenes/Chapter1Scene2";

import { GAME_LAYOUT } from "../config/gameLayoutConfig"; // ← adjust path if needed
import Chapter1Scene from "../../game/scenes/Chapter1/Chapter1Scene";
import Chapter1Scene2 from "../../game/scenes/Chapter1/Chapter1Scene2";
import Chapter1Scene3 from "../../game/scenes/Chapter1/Chapter1Scene3";
import Chapter2Scene1 from "../../game/scenes/Chapter2/Chapter2Scene1";
import Chapter2Scene2 from "../../game/scenes/Chapter2/Chapter2Scene2";
import Chapter2Scene3 from "../../game/scenes/Chapter2/Chapter2Scene3";
import Chapter3Scene1 from "../../game/scenes/Chapter3/Chapter3Scene1";
import Chapter3Scene2 from "../../game/scenes/Chapter3/Chapter3Scene2";
import Chapter4Scene1 from "../../game/scenes/Chapter4/Chapter4Scene1";
import Chapter4Scene3 from "../../game/scenes/Chapter4/Chapter4Scene3";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-game", // make sure PhaserGame renders a div with this id

  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_LAYOUT.designWidth,   // 1280
    height: GAME_LAYOUT.designHeight, // 720
    // zoom: window.devicePixelRatio, // optional, only if you really want it
  },

  render: {
    pixelArt: false,
    antialias: true,
    roundPixels: false,
  },

  scene: [
    BootScene,
    UIScene,
    Chapter1Scene,
    Chapter1Scene2,
    Chapter1Scene3,
    Chapter2Scene1,
    Chapter2Scene2,
    Chapter2Scene3,
    Chapter3Scene1,
    Chapter3Scene2,
    Chapter4Scene1,
    Chapter4Scene3,
  ],

  plugins: {
  },
};

export default config;
