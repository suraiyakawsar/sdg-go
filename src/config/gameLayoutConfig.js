// src/config/gameLayoutConfig.js

export const GAME_LAYOUT = {
    // The whole glass card (sidebars + game) max width – still responsive because it's a max
    shellMaxWidth: 1600, // tweak up/down if you want the shell wider/narrower

    // Central playable area (Phaser canvas) max width – card grows until this, then just centers
    gameMaxWidth: 1100,  // was 900; bump if you want the game larger on big screens

    // Left/right sidebar (rail) width, used in Game.jsx
    sideRailWidth: 112,  // px – your existing value

    // Aspect ratio for the game viewport React wrapper
    aspectRatio: 16 / 9,

    // Phaser's *virtual* resolution – MUST match config.scale
    designWidth: 1280,
    designHeight: 720,
};
