// // Game.jsx
// import { useEffect, useRef, useState } from 'react';
// import Phaser from 'phaser';
// import GameScene from '../phaser/xGameScene';
// import config from '../game/config';
// import SDGBar from '../components/ui/SDGBar';

// export default function Game() {
//     const [sdgValue, setSdgValue] = useState(50);
//     const gameRef = useRef(null);

//     useEffect(() => {
//         if (!gameRef.current) {
//             gameRef.current = new Phaser.Game({
//                 ...config,
//                 callbacks: {
//                     postBoot: (game) => {
//                         game.registry.set('updateSDG', setSdgValue);
//                     },
//                 },
//             });

//             gameRef.current = true;
//         }

//         return () => {
//             if (gameRef.current && gameRef.current.destroy) {
//                 gameRef.current.destroy(true);
//                 gameRef.current = null;
//             }
//         };


//     }, []);

//     return (
//         <div className="min-h-screen bg-white">
//             <SDGBar value={sdgValue} />
//             <div id="phaser-game" />
//         </div>
//     );
// }
// src/pages/Game.jsx
// src/pages/Game.jsx


import GameLayout from '../components/layout/GameLayout';
import PhaserGame from '../components/game/PhaserGame';
import DialogueBox from '../components/ui/DialogueBox';
import SDGBar from '../components/ui/SDGBar';

export default function Game() {
  return (
    <GameLayout>
      {/* Phaser game canvas */}
      <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
        <PhaserGame />

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* SDG progress bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
            <SDGBar />
          </div>

          {/* Dialogue Box (shown when triggered via eventBus) */}
          <div className="absolute bottom-0 w-full pointer-events-auto">
            <DialogueBox />
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
