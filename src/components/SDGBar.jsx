// // import { useEffect, useState } from "react";
// // import { on, off } from "../../utils/eventBus";
// // import { SDGProgress } from "./SDGProgress";

// // export default function SDGBar({ sidebarMode = false }) {
// //   const [sdgPoints, setSdgPoints] = useState(0);
// //   const [animating, setAnimating] = useState(false); // pulse animation

// //   useEffect(() => {
// //     const handleSdgUpdate = (points) => {
// //       const safePoints = Math.max(0, Number(points) || 0);

// //       // Trigger pulse when points increase
// //       setAnimating(true);
// //       setTimeout(() => setAnimating(false), 500);

// //       setSdgPoints(safePoints);
// //     };

// //     on("updateSDGPoints", handleSdgUpdate);
// //     return () => off("updateSDGPoints", handleSdgUpdate);
// //   }, []);

// //   // Keep progress capped at 100 for the visual bar (but show actual number too)
// //   const displayProgress = Math.min(sdgPoints, 100);
// //   const percent = displayProgress;

// //   // return (
// //   //   <div className="fixed top-6 left-6 z-[9998] pointer-events-none">
// //   //     <div className={`
// //   //               flex items-center gap-4 px-6 py-3
// //   //               rounded-full shadow-lg border border-white/15
// //   //               backdrop-blur-xl bg-black/55
// //   //               transition-all duration-300
// //   //               ${animating ? "ring-2 ring-cyan-400/60" : ""}
// //   //           `}>
// //   //       {/* SDG Circular Gauge */}
// //   //       <div className="relative w-10 h-10">
// //   //         {/* Background circle */}
// //   //         <svg className="absolute inset-0" viewBox="0 0 36 36">
// //   //           <circle
// //   //             cx="18"
// //   //             cy="18"
// //   //             r="16"
// //   //             fill="none"
// //   //             stroke="rgba(255,255,255,0.15)"
// //   //             strokeWidth="4"
// //   //           />
// //   //         </svg>

// //   //         {/* Foreground animated circle */}
// //   //         <svg className="absolute inset-0" viewBox="0 0 36 36">
// //   //           <circle
// //   //             cx="18"
// //   //             cy="18"
// //   //             r="16"
// //   //             fill="none"
// //   //             stroke="url(#sdgGradient)"
// //   //             strokeWidth="4"
// //   //             strokeDasharray={`${percent * 1.005}, 100`}
// //   //             strokeLinecap="round"
// //   //             className="transition-all duration-500"
// //   //           />

// //   //           {/* Gradient definition */}
// //   //           <defs>
// //   //             <linearGradient id="sdgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
// //   //               <stop offset="0%" stopColor="#22d3ee" />       {/* cyan */}
// //   //               <stop offset="50%" stopColor="#38bdf8" />      {/* sky blue */}
// //   //               <stop offset="100%" stopColor="#3b82f6" />     {/* blue */}
// //   //             </linearGradient>
// //   //           </defs>
// //   //         </svg>

// //   //         {/* SDG Icon overlay */}
// //   //         <div className={`
// //   //                       absolute inset-0 flex items-center justify-center
// //   //                       text-lg font-bold text-white
// //   //                       drop-shadow-md
// //   //                       ${animating ? "scale-110 transition-transform duration-300" : "scale-100"}
// //   //                   `}>
// //   //           🌍
// //   //         </div>

// //   //         {/* Sparkle on update */}
// //   //         {animating && (
// //   //           <>
// //   //             <div className="absolute -top-1 -right-1 text-cyan-300 text-xs animate-sparkle">✦</div>
// //   //             <div className="absolute -bottom-1 -left-1 text-sky-200 text-xs animate-sparkle2">✧</div>
// //   //           </>
// //   //         )}
// //   //       </div>

// //   //       {/* SDG Text + Bar */}
// //   //       <div className="flex flex-col w-52">
// //   //         <p className="text-[10px] uppercase tracking-[0.16em] text-gray-300">
// //   //           SDG Points
// //   //         </p>

// //   //         <div className="flex items-center gap-2">
// //   //           <div className="w-full h-2.5 bg-gray-800/80 rounded-full overflow-hidden">
// //   //             <div
// //   //               className="
// //   //                                   h-full rounded-full
// //   //                                   bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500
// //   //                                   transition-all duration-500
// //   //                               "
// //   //               style={{ width: `${percent}%` }}
// //   //             />
// //   //           </div>

// //   //           <span className="text-sm font-semibold text-white drop-shadow-sm min-w-[28px]">
// //   //             {sdgPoints}
// //   //           </span>
// //   //         </div>
// //   //       </div>
// //   //     </div>

// //   //     {/* Extra spark animations */}
// //   //     <style jsx>{`
// //   //               @keyframes sparkle {
// //   //                   0% { opacity: 0; transform: scale(0.3) rotate(0deg); }
// //   //                   50% { opacity: 1; transform: scale(1) rotate(15deg); }
// //   //                   100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
// //   //               }
// //   //               @keyframes sparkle2 {
// //   //                   0% { opacity: 0; transform: scale(0.3) rotate(0deg); }
// //   //                   50% { opacity: 1; transform: scale(1) rotate(-15deg); }
// //   //                   100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
// //   //               }
// //   //               .animate-sparkle { animation: sparkle 1.2s ease-out; }
// //   //               .animate-sparkle2 { animation: sparkle2 1.2s ease-out; }
// //   //           `}</style>
// //   //   </div>
// //   // );

// //   // If sidebar mode, render only compact contents
// //   if (sidebarMode) {
// //     return (
// //       <div className="w-full text-white flex flex-col gap-1">
// //         { /* Keep your existing full SDG UI here */}
// //         <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">
// //           SDG Points
// //         </p>

// //         <div className="w-full flex items-center gap-2">
// //           <div className="flex-grow">
// //             <SDGProgress value={Math.min(sdgPoints, 100)} />
// //           </div>
// //           <span className="text-sm font-semibold">{sdgPoints}</span>
// //         </div>
// //       </div>
// //     );
// //   }

// // }



// // import { useEffect, useState } from "react";
// // import { on, off } from "../../utils/eventBus";
// // import { SDGProgress } from "./SDGProgress";

// // export default function SDGBar({ sidebarMode = false }) {
// //   const [sdgPoints, setSdgPoints] = useState(0);

// //   useEffect(() => {
// //     const handleSdgUpdate = (value) => {
// //       const num = Number(value);

// //       // ⭐ Detect increment vs total
// //       if (Math.abs(num) <= 20) {
// //         // Likely an increment (+10, +5)
// //         setSdgPoints(prev => prev + num);
// //       } else {
// //         // Likely a full total (40, 75, 100)
// //         setSdgPoints(num);
// //       }
// //     };

// //     on("updateSDGPoints", handleSdgUpdate);
// //     return () => off("updateSDGPoints", handleSdgUpdate);
// //   }, []);


// //   /* ------------------------------
// //     ⭐ SIDEBAR MODE (full expanded UI)
// //   --------------------------------*/
// //   if (sidebarMode) {
// //     return (
// //       <div className="flex flex-col gap-2 w-full">
// //         {/* Label */}
// //         <p className="text-xs text-gray-300 uppercase tracking-wider">
// //           SDG Points
// //         </p>

// //         {/* Bar + Number */}
// //         <div className="flex items-center gap-3 w-full">
// //           <div className="flex-grow">
// //             <SDGProgress value={Math.min(sdgPoints, 100)} />
// //           </div>
// //           <span className="text-sm font-semibold text-white">
// //             {sdgPoints}
// //           </span>
// //         </div>
// //       </div>
// //     );
// //   }

// //   /* ------------------------------
// //     ⭐ DEFAULT TOP HUD MODE
// //   --------------------------------*/
// //   return (
// //     <div className="mx-10 fixed top-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50 pointer-events-auto">
// //       <img
// //         src="assets/images/ui/sdg-icon.png"
// //         alt="SDG Icon"
// //         className="w-6 h-6"
// //       />

// //       <div className="flex flex-col items-start w-52">
// //         <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">
// //           SDG Points
// //         </p>

// //         <div className="flex items-center gap-2 w-full">
// //           <SDGProgress value={Math.min(sdgPoints, 100)} />
// //           <span className="text-sm font-semibold">{sdgPoints}</span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { on, off } from "../../utils/eventBus";
// import { SDGProgress } from "./SDGProgress";

// export default function SDGBar({ sidebarMode = false }) {
//   const [sdgPoints, setSdgPoints] = useState(0);

//   useEffect(() => {
//     const handleSdgUpdate = (value) => {
//       // Ignore invalid payloads
//       if (typeof value !== "number" || isNaN(value)) {
//         return;
//       }

//       // Detect increment vs total
//       if (value >= -20 && value <= 20) {
//         // Increment (like +10)
//         setSdgPoints((prev) => prev + value);
//       } else {
//         // Complete total replacement
//         setSdgPoints(value);
//       }
//     };

//     on("updateSDGPoints", handleSdgUpdate);
//     return () => off("updateSDGPoints", handleSdgUpdate);
//   }, []);

//   /* ------------------------------
//         SIDEBAR MODE
//   --------------------------------*/
//   if (sidebarMode) {
//     return (
//       <div className="flex flex-col gap-2 w-full">
//         <p className="text-xs text-gray-300 uppercase tracking-wider">
//           SDG Points
//         </p>

//         <div className="flex items-center gap-3 w-full">
//           <div className="flex-grow">
//             <SDGProgress value={Math.min(sdgPoints, 100)} />
//           </div>
//           <span className="text-sm font-semibold text-white">{sdgPoints}</span>
//         </div>
//       </div>
//     );
//   }

//   /* ------------------------------
//         HUD MODE
//   --------------------------------*/
//   return (
//     <div className="mx-10 fixed top-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50 pointer-events-auto">
//       <img
//         src="/assets/images/ui/sdg-icon.png"
//         alt="SDG Icon"
//         className="w-6 h-6"
//       />

//       <div className="flex flex-col items-start w-52">
//         <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">
//           SDG Points
//         </p>

//         <div className="flex items-center gap-2 w-full">
//           <SDGProgress value={Math.min(sdgPoints, 100)} />
//           <span className="text-sm font-semibold">{sdgPoints}</span>
//         </div>
//       </div>
//     </div>
//   );
// }