// // import GameLayout from '../components/layout/GameLayout';
// // import PhaserGame from '../components/game/PhaserGame';

// // // HUD
// // import BadgePopup from '../components/ui/BadgePopup';
// // import GameSidebar from '../components/ui/GameSidebar';
// // import RightSidebar from '../components/ui/RightSidebar';

// // export default function Game() {
// //   return (
// //     <GameLayout>
// //       <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
// //         <PhaserGame />

// //         {/* Overlay UI */}
// //         <div className="absolute inset-0">

// //           {/* LEFT SIDEBAR (clickable) */}
// //           <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto">
// //             <GameSidebar />
// //           </div>

// //           {/* RIGHT SIDEBAR (clickable) */}
// //           <div className="pointer-events-auto">
// //             <RightSidebar />
// //           </div>

// //           {/* HUD row (SDG + Objective bars) — visible but not blocking clicks
// //           <div className="pointer-events-none">
// //             <HUDWrapper>
// //               <SDGBar />
// //               <ObjectiveBar />
// //             </HUDWrapper>
// //           </div> */}

// //           {/* Badge popup (visual only, no clicks) */}
// //           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
// //             <BadgePopup />
// //           </div>

// //         </div>
// //       </div>
// //     </GameLayout>
// //   );
// // }


// // src/pages/Game.jsx
// import { useEffect, useState } from 'react';

// import GameLayout from '../components/layout/GameLayout';
// import PhaserGame from '../components/game/PhaserGame';

// // HUD
// import BadgePopup from '../components/ui/BadgePopup';
// import GameSidebar from '../components/ui/GameSidebar';
// import RightSidebar from '../components/ui/RightSidebar';
// import GameLoadingScreen from '../components/ui/GameLoadingScreen'; // ✅ new

// export default function Game() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     // For now: simple fake loading delay (2s).
//     // Later: replace with a callback from Phaser when assets are loaded.
//     const timer = setTimeout(() => {
//       setReady(true);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <GameLayout>
//       {!ready ? (
//         // 🔹 Show loading screen first
//         <GameLoadingScreen />
//       ) : (
//         // 🔹 Your existing game layout, unchanged
//         <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
//           <PhaserGame />

//           {/* Overlay UI */}
//           <div className="absolute inset-0">

//             {/* LEFT SIDEBAR (clickable) */}
//             <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto">
//               <GameSidebar />
//             </div>

//             {/* RIGHT SIDEBAR (clickable) */}
//             <div className="pointer-events-auto">
//               <RightSidebar />
//             </div>

//             {/* Badge popup (visual only, no clicks) */}
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//               <BadgePopup />
//             </div>

//           </div>
//         </div>
//       )}
//     </GameLayout>
//   );
// }



// // src/pages/Game.jsx
// import { useEffect, useState } from "react";

// import GameLayout from "../components/layout/GameLayout";
// import PhaserGame from "../components/game/PhaserGame";

// import BadgePopup from "../components/ui/BadgePopup";
// import GameSidebar from "../components/ui/GameSidebar";
// import RightSidebar from "../components/ui/RightSidebar";
// import GameLoadingScreen from "../components/ui/GameLoadingScreen";

// export default function Game() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setReady(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <GameLayout>
//       <div className="flex items-center justify-center gap-4 w-full">
//         {/* LEFT RAIL (outside playable field) */}
//         <div className="w-24 flex items-center justify-center">
//           {ready && <GameSidebar />}
//         </div>

//         {/* CENTER: playable 16:9 field */}
//         <div className="flex-1 flex justify-center">
//           <div className="relative aspect-[16/9] w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden">
//             {!ready ? (
//               <GameLoadingScreen />
//             ) : (
//               <>
//                 <PhaserGame />

//                 {/* In-field overlay (badge popup etc.) */}
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <BadgePopup />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* RIGHT RAIL (outside playable field) */}
//         <div className="w-24 flex items-center justify-center">
//           {ready && <RightSidebar />}
//         </div>
//       </div>
//     </GameLayout>
//   );
// }


// // src/pages/Game.jsx
// import { useEffect, useState } from "react";

// import GameLayout from "../components/layout/GameLayout";
// import PhaserGame from "../components/game/PhaserGame";

// import BadgePopup from "../components/ui/BadgePopup";
// import GameSidebar from "../components/ui/GameSidebar";
// import RightSidebar from "../components/ui/RightSidebar";
// import GameLoadingScreen from "../components/ui/GameLoadingScreen";

// export default function Game() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setReady(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <GameLayout>
//       {/* 🔹 This row now controls total game height */}
//       <div
//         className="flex items-center justify-center gap-4 w-full"
//         style={{ height: "80vh" }} // ⬅️ key: fills 80% of viewport height
//       >
//         {/* LEFT RAIL (outside playable field) */}
//         <div className="w-20 flex items-center justify-center">
//           {ready && <GameSidebar />}
//         </div>

//         {/* CENTER: playable 16:9 field */}
//         <div className="flex-1 flex justify-center h-full">
//           <div
//             className="
//               relative
//               h-full
//               aspect-[16/9]
//               bg-slate-950
//               rounded-2xl
//               overflow-hidden
//             "
//           >
//             {!ready ? (
//               <GameLoadingScreen />
//             ) : (
//               <>
//                 <PhaserGame />

//                 {/* In-field overlay (badge popup etc.) */}
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <BadgePopup />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* RIGHT RAIL (outside playable field) */}
//         <div className="w-20 flex items-center justify-center">
//           {ready && <RightSidebar />}
//         </div>
//       </div>
//     </GameLayout>
//   );
// }


// // src/pages/Game.jsx
// import { useEffect, useState } from "react";

// import GameLayout from "../components/layout/GameLayout";
// import PhaserGame from "../components/game/PhaserGame";

// import BadgePopup from "../components/ui/BadgePopup";
// import GameSidebar from "../components/ui/GameSidebar";
// import RightSidebar from "../components/ui/RightSidebar";
// import GameLoadingScreen from "../components/ui/GameLoadingScreen";

// export default function Game() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setReady(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <GameLayout>
//       <div className="flex items-center justify-center gap-4 w-full">
//         {/* LEFT RAIL (outside playable field) */}
//         <div className="w-24 flex items-center justify-center">
//           {ready && <GameSidebar />}
//         </div>

//         {/* CENTER: playable 16:9 field */}
//         <div className="flex-1 flex justify-center">
//           <div className="relative aspect-[16/9] w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden">
//             {!ready ? (
//               <GameLoadingScreen />
//             ) : (
//               <>
//                 <PhaserGame />

//                 {/* In-field overlay (badge popup etc.) */}
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <BadgePopup />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* RIGHT RAIL (outside playable field) */}
//         <div className="w-24 flex items-center justify-center">
//           {ready && <RightSidebar />}
//         </div>
//       </div>
//     </GameLayout>
//   );
// }

// // src/pages/Game.jsx
// import { useEffect, useState } from "react";

// import GameLayout from "../components/layout/GameLayout";
// import PhaserGame from "../components/game/PhaserGame";

// import BadgePopup from "../components/ui/BadgePopup";
// import GameSidebar from "../components/ui/GameSidebar";
// import RightSidebar from "../components/ui/RightSidebar";
// import GameLoadingScreen from "../components/ui/GameLoadingScreen";

// export default function Game() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setReady(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <GameLayout>
//       <div className="flex items-center justify-center gap-4 w-full">
//         {/* LEFT rail */}
//         <div className="w-24 flex items-center justify-center">
//           <GameSidebar />
//         </div>

//         {/* CENTER: canvas only */}
//         <div className="flex-1 flex justify-center">
//           <div className="relative aspect-[16/9] w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden">
//             <PhaserGame />
//             {/* things that *should* be inside the play area, like badge popup */}
//           </div>
//         </div>

//         {/* RIGHT rail */}
//         <div className="w-24 flex items-center justify-center">
//           <RightSidebar />
//         </div>
//       </div>
//     </GameLayout>

//   );
// }


// // src/pages/Game.jsx
// import { useEffect, useState } from "react";

// import GameLayout from "../components/layout/GameLayout";
// import PhaserGame from "../components/game/PhaserGame";

// import BadgePopup from "../components/ui/BadgePopup";
// import GameSidebar from "../components/ui/GameSidebar";
// import RightSidebar from "../components/ui/RightSidebar";
// import GameLoadingScreen from "../components/ui/GameLoadingScreen";

// export default function Game() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setReady(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <GameLayout>
//       <div className="flex items-center justify-center gap-4 w-full">
//         {/* LEFT rail (outside playable field) */}
//         <div className="w-24 flex items-center justify-center">
//           {ready && <GameSidebar />}
//         </div>

//         {/* CENTER: playable canvas only */}
//         <div className="flex-1 flex justify-center">
//           <div className="relative aspect-[16/9] w-full max-w-4xl bg-slate-950 rounded-2xl">
//             {!ready ? (
//               <GameLoadingScreen />
//             ) : (
//               <>
//                 <PhaserGame />

//                 {/* stuff that should be inside the play area only */}
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <BadgePopup />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* RIGHT rail (outside playable field) */}
//         <div className="w-24 flex items-center justify-center">
//           {ready && <RightSidebar />}
//         </div>
//       </div>
//     </GameLayout>
//   );
// }


// // src/pages/Game.jsx
// import { useEffect, useState } from "react";

// import GameLayout from "../components/layout/GameLayout";
// import PhaserGame from "../components/game/PhaserGame";

// import BadgePopup from "../components/ui/BadgePopup";
// import GameSidebar from "../components/ui/GameSidebar";
// import RightSidebar from "../components/ui/RightSidebar";
// import GameLoadingScreen from "../components/ui/GameLoadingScreen";
// import { GAME_LAYOUT } from "../config/gameLayoutConfig";

// export default function Game() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setReady(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <GameLayout>
//       <div className="flex items-center justify-center gap-4 w-full">
//         {/* LEFT rail (outside playable field) */}
//         <div
//           className="flex items-center justify-center"
//           style={{ width: GAME_LAYOUT.sideRailWidth }}
//         >
//           {ready && <GameSidebar />}
//         </div>

//         {/* CENTER: playable canvas only */}
//         <div className="flex-1 flex justify-start">
//           <div
//             className="relative aspect-[16/9] w-full bg-slate-950 rounded-2xl"
//             style={{ maxWidth: GAME_LAYOUT.gameMaxWidth }}
//           >
//             {!ready ? (
//               <GameLoadingScreen />
//             ) : (
//               <>
//                 <PhaserGame />

//                 {/* stuff that should be inside the play area only */}
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <BadgePopup />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* RIGHT rail (outside playable field) */}
//         <div
//           className="flex items-center justify-center"
//           style={{ width: GAME_LAYOUT.sideRailWidth }}
//         >
//           {ready && <RightSidebar />}
//         </div>
//       </div>
//     </GameLayout>
//   );
// }



// src/pages/Game.jsx
import { useEffect, useState } from "react";

import GameLayout from "../components/layout/GameLayout";
import PhaserGame from "../components/game/PhaserGame";

import BadgePopup from "../components/ui/BadgePopup";
import GameSidebar from "../components/ui/GameSidebar";
import RightSidebar from "../components/ui/RightSidebar";
import GameLoadingScreen from "../components/ui/GameLoadingScreen";
import { GAME_LAYOUT } from "../config/gameLayoutConfig";

export default function Game() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GameLayout>
      <div className="flex items-center justify-center w-full">
        <div className="flex w-full gap-4">
          {/* LEFT rail – hidden on very small screens, narrow on md, wider on xl */}
          <div className="hidden sm:flex items-center justify-center sm:w-16 lg:w-20 xl:w-24">
            {ready && <GameSidebar />}
          </div>

          {/* CENTER: playable canvas – grows/shrinks with viewport */}
          <div className="flex-1 flex justify-start">
            <div
              className="relative w-full max-w-5xl rounded-2xl bg-slate-950 aspect-[16/9]"
            >
              {!ready ? (
                <GameLoadingScreen />
              ) : (
                <>
                  <PhaserGame />

                  {/* overlay things that belong inside play area */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <BadgePopup />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT rail – same idea, sits outside play area
          <div className="hidden sm:flex items-center justify-center sm:w-16 lg:w-20 xl:w-24">
            {ready && <RightSidebar />}
          </div> */}
          {/* RIGHT rail (outside playable field) */}
          <div
            className="
    flex items-center justify-center h-full
    w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[420px]
  "
          >
            {ready && <RightSidebar />}
          </div>

        </div>
      </div>
    </GameLayout>
  );
}
