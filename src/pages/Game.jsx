// import GameLayout from '../components/layout/GameLayout';
// import PhaserGame from '../components/game/PhaserGame';
// import DialogueBox from '../components/ui/DialogueBox';
// import SDGBar from '../components/ui/SDGBar';

// export default function Game() {
//   return (
//     <GameLayout>
//       {/* Phaser game canvas */}
//       <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
//         <PhaserGame />

//         {/* Overlay UI */}
//         <div className="absolute inset-0 pointer-events-none">
//           {/* SDG progress bar */}
//           <div className="absolute top-4 left-1/8 -translate-x-1/2 pointer-events-auto">
//             <SDGBar />
//           </div>

//           {/* Dialogue Box (shown when triggered via eventBus) */}
//           <div className="absolute bottom-0 w-full pointer-events-auto">
//             <DialogueBox />
//           </div>
//         </div>
//       </div>
//     </GameLayout>
//   );
// }


import GameLayout from '../components/layout/GameLayout';
import PhaserGame from '../components/game/PhaserGame';
import DialogueBox from '../components/ui/DialogueBox';
import SDGBar from '../components/ui/SDGBar';
import ObjectiveBar from '../components/ui/ObjectiveBar'; // ✅ new
import BadgePopup from '../components/ui/BadgePopup';     // ✅ new

export default function Game() {
  return (
    <GameLayout>
      {/* Phaser game canvas */}
      <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
        <PhaserGame />

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* SDG progress bar */}
          <div className="absolute top-4 left-1/8 -translate-x-1/2 pointer-events-auto">
            <SDGBar />
          </div>

          {/* Objective bar */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-auto">
            <ObjectiveBar />
          </div>

          {/* Dialogue Box */}
          <div className="absolute bottom-0 w-full pointer-events-auto">
            <DialogueBox />
          </div>

          {/* Badge popup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <BadgePopup />
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
