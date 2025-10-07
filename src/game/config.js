// import GameScene from '../phaser/xGameScene';

// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     parent: 'phaser-game',
//     scene: [GameScene],
//     physics: {
//         default: 'arcade',
//         arcade: {
//             debug: false,
//         },
//     },
// };

// export default config;


// src/game/config.js
// src/game/config.js


import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import MainMenuScene from './scenes/MainMenuScene';
import Chapter1Scene from './scenes/Chapter1Scene';
import UIScene from './scenes/UIScene';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'phaser-game',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: [BootScene, PreloadScene, MainMenuScene, Chapter1Scene, UIScene]
};

export default config;
