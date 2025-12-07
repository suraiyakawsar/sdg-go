// import Phaser from 'phaser';
// import BootScene from './scenes/BootScene';
// import PreloadScene from './scenes/PreloadScene';
// import MainMenuScene from './scenes/MainMenuScene';
// import Chapter1SceneShow from './scenes/Chapter1SceneShow';
// import UIScene from './scenes/UIScene';
// import Chapter2Scene from './scenes/Chapter2Scene';
// import NineSlicePlugin from 'phaser3-nineslice';


// const config = {
//   type: Phaser.AUTO,
//   // width: 1140,
//   // height: 540,
//   parent: 'phaser-game',
//   physics: {
//     default: 'arcade',
//     arcade: {
//       debug: false,
//       gravity: { y: 0 }
//     }
//   },
//   scale: {
//     mode: Phaser.Scale.FIT,
//     autoCenter: Phaser.Scale.CENTER_BOTH,
//     width: 1280,
//     height: 720,
//     // zoom: window.devicePixelRatio,  // ⭐ important
//   },
//   render: {
//     pixelArt: false,
//     antialias: true,
//     roundPixels: false,
//   },
//   scene: [BootScene, PreloadScene, MainMenuScene, Chapter2Scene, UIScene, Chapter1SceneShow],
//   plugins: {
//     global: [
//       {
//         key: 'NineSlicePlugin',
//         plugin: window.rexNinePatchPlugin || Phaser.Plugins.NineSlicePlugin,
//         start: true
//       }
//     ]
//   },
//   "compilerOptions": {
//     "baseUrl": ".",
//     "paths": {
//       "@/*": ["./src/*"]
//     }
//   }

// };

// export default config;



import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import MainMenuScene from "./scenes/MainMenuScene";
import Chapter1SceneShow from "./scenes/Chapter1SceneShow";
import UIScene from "./scenes/UIScene";
import Chapter2Scene from "./scenes/Chapter2Scene";
import NineSlicePlugin from "phaser3-nineslice";

import { GAME_LAYOUT } from "../config/gameLayoutConfig"; // ← adjust path if needed

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
    PreloadScene,
    MainMenuScene,
    Chapter2Scene,
    UIScene,
    Chapter1SceneShow,
  ],

  plugins: {
    global: [
      {
        key: "NineSlicePlugin",
        plugin: window.rexNinePatchPlugin || Phaser.Plugins.NineSlicePlugin,
        start: true,
      },
    ],
  },
};

export default config;
