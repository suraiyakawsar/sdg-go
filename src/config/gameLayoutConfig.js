// // src/config/gameLayoutConfig.js

// export const GAME_LAYOUT = {
//     // Outer shell max width (the whole card with sidebars + game)
//     shellMaxWidth: 1750, // px – was effectively ~6xl, you can bump this

//     // Central playable area (Phaser canvas + badge popup) max width
//     gameMaxWidth: 900, // px – was ~4xl, increase this to make the game bigger

//     // Left/right sidebar column width
//     sideRailWidth: 112, // px – was ~w-24 (96px). Increase if sidebars feel cramped.

//     // Aspect ratio for the game viewport
//     aspectRatio: 12 / 6,
// };


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
