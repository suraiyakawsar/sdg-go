// export default function GameLayout({ children }) {
//     return (
//         <div className="w-full h-full font-sans text-white">
//             {children}
//         </div>
//     );
// }

// src/components/layout/GameLayout.jsx


// export default function GameLayout({ children }) {
//     return (
//         <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 flex items-center justify-center px-4 py-6">
//             {/* Outer glow frame */}
//             <div className="relative w-full max-w-6xl">
//                 {/* Ambient glow behind */}
//                 <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />

//                 {/* Game shell */}
//                 <div className="
//           relative
//           rounded-3xl
//           bg-black/70
//           border border-white/10
//           shadow-[0_25px_80px_rgba(0,0,0,0.9)]
//           overflow-hidden
//           backdrop-blur-2xl
//         ">
//                     {/* Top meta bar */}
//                     <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80">
//                         <div className="flex items-center gap-2">
//                             <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-sm font-semibold">
//                                 SDG
//                             </span>
//                             <div className="flex flex-col">
//                                 <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
//                                     Story Chapter
//                                 </span>
//                                 <span className="text-sm font-semibold text-slate-100">
//                                     Campus Life · Chapter 1
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-1 text-[10px] text-slate-400">
//                             <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
//                             <span>Progress autosaves on this device</span>
//                         </div>
//                     </div>

//                     {/* Game viewport area */}
//                     <div className="relative aspect-[16/9] bg-slate-950">
//                         {children}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }




// // src/components/layout/GameLayout.jsx
// export default function GameLayout({ children }) {
//     return (
//         <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 flex items-center justify-center px-4 py-6">
//             <div className="relative w-full max-w-7xl">
//                 {/* Ambient glow */}
//                 <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />

//                 {/* Main shell */}
//                 <div className="relative rounded-3xl bg-black/70 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl">
//                     {/* Top meta bar */}
//                     <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80">
//                         <div className="flex items-center gap-2">
//                             <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-sm font-semibold">
//                                 SDG
//                             </span>
//                             <div className="flex flex-col">
//                                 <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
//                                     Story Chapter
//                                 </span>
//                                 <span className="text-sm font-semibold text-slate-100">
//                                     Campus Life · Chapter 1
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-1 text-[10px] text-slate-400">
//                             <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
//                             <span>Progress autosaves on this device</span>
//                         </div>
//                     </div>

//                     {/* Content area: we’ll put sidebars + game here */}
//                     <div className="px-4 py-4">
//                         {children}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// // src/components/layout/GameLayout.jsx
// export default function GameLayout({ children }) {
//     return (
//         <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 flex items-center justify-center px-4 py-6">
//             <div className="relative w-full max-w-450">
//                 {/* Ambient glow behind card */}
//                 <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />

//                 {/* Main game shell */}
//                 <div className="
//           relative
//           rounded-3xl
//           bg-black/70
//           border border-white/10
//           shadow-[0_25px_80px_rgba(0,0,0,0.9)]
//           overflow-hidden
//           backdrop-blur-2xl
//         ">
//                     {/* Top meta bar */}
//                     <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80">
//                         <div className="flex items-center gap-2">
//                             <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-sm font-semibold">
//                                 SDG
//                             </span>
//                             <div className="flex flex-col">
//                                 <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
//                                     Story Chapter
//                                 </span>
//                                 <span className="text-sm font-semibold text-slate-100">
//                                     Campus Life · Chapter 1
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-1 text-[10px] text-slate-400">
//                             <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
//                             <span>Progress autosaves on this device</span>
//                         </div>
//                     </div>

//                     {/* Inner content (your 80vh layout lives here) */}
//                     <div className="px-4 py-4">
//                         {children}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // src/components/layout/GameLayout.jsx
// export default function GameLayout({ children }) {
//     return (
//         <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 flex items-center justify-center px-4 py-6">
//             <div className="relative w-full max-w-6xl">
//                 {/* Ambient glow */}
//                 <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />

//                 {/* Main shell */}
//                 <div className="relative rounded-3xl bg-black/70 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl">
//                     {/* Top meta bar */}
//                     <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80">
//                         <div className="flex items-center gap-2">
//                             <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-sm font-semibold">
//                                 SDG
//                             </span>
//                             <div className="flex flex-col">
//                                 <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
//                                     Story Chapter
//                                 </span>
//                                 <span className="text-sm font-semibold text-slate-100">
//                                     Campus Life · Chapter 1
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-1 text-[10px] text-slate-400">
//                             <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
//                             <span>Progress autosaves on this device</span>
//                         </div>
//                     </div>

//                     {/* Content area: we’ll put sidebars + game here */}
//                     <div className="px-4 py-4">
//                         {children}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// src/components/layout/GameLayout.jsx
// export default function GameLayout({ children }) {
//     return (
//         <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 flex items-center justify-center px-4 py-6">
//             <div className="relative w-full max-w-6xl">
//                 {/* Ambient glow */}
//                 <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />

//                 {/* Main shell */}
//                 <div
//                     className="
//             relative
//             rounded-3xl
//             bg-black/70
//             border border-white/10
//             shadow-[0_25px_80px_rgba(0,0,0,0.9)]
//             backdrop-blur-2xl
//           "
//                 >
//                     {/* Top meta bar */}
//                     <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80">
//                         <div className="flex items-center gap-2">
//                             <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-sm font-semibold">
//                                 SDG
//                             </span>
//                             <div className="flex flex-col">
//                                 <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
//                                     Story Chapter
//                                 </span>
//                                 <span className="text-sm font-semibold text-slate-100">
//                                     Campus Life · Chapter 1
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-1 text-[10px] text-slate-400">
//                             <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
//                             <span>Progress autosaves on this device</span>
//                         </div>
//                     </div>

//                     {/* Content area: sidebars + game */}
//                     <div className="px-4 py-4">{children}</div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// src/components/layout/GameLayout.jsx
// import { GAME_LAYOUT } from "../../config/gameLayoutConfig";

// export default function GameLayout({ children }) {
//     return (
//         <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 flex items-center justify-center px-4 py-6">
//             <div
//                 className="relative w-full"
//                 style={{ maxWidth: GAME_LAYOUT.shellMaxWidth }}
//             >
//                 {/* Ambient glow */}
//                 <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />

//                 {/* Main shell */}
//                 <div className="relative rounded-3xl bg-black/70 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
//                     {/* Top meta bar */}
//                     <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80">
//                         <div className="flex items-center gap-2">
//                             <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-sm font-semibold">
//                                 SDG
//                             </span>
//                             <div className="flex flex-col">
//                                 <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
//                                     Story Chapter
//                                 </span>
//                                 <span className="text-sm font-semibold text-slate-100">
//                                     Campus Life · Chapter 1
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-1 text-[10px] text-slate-400">
//                             <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
//                             <span>Progress autosaves on this device</span>
//                         </div>
//                     </div>

//                     {/* Content area: sidebars + game */}
//                     <div className="px-4 py-4">{children}</div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// src/components/layout/GameLayout.jsx
import { GAME_LAYOUT } from "../../config/gameLayoutConfig";

export default function GameLayout({ children }) {
    return (
        <div
            className="
                h-screen w-screen
                overflow-hidden
                bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900
                flex items-center justify-center
            "
        >
            <div
                className="relative w-full h-full flex items-center justify-center"
                style={{ maxWidth: GAME_LAYOUT.shellMaxWidth }}
            >
                {/* Ambient glow */}
                <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />

                {/* Main shell */}
                <div
                    className="
                        relative
                        h-[90vh] w-[96vw]
                        max-w-full
                        rounded-3xl
                        bg-black/70
                        border border-white/10
                        shadow-[0_25px_80px_rgba(0,0,0,0.9)]
                        backdrop-blur-2xl
                        flex flex-col
                        overflow-hidden
                    "
                >
                    {/* Top meta bar – fixed height */}
                    <div className="flex items-center justify-between px-5 h-12 border-b border-white/5 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-sm font-semibold">
                                SDG
                            </span>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                    Story Chapter
                                </span>
                                <span className="text-sm font-semibold text-slate-100">
                                    Campus Life · Chapter 1
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                            <span>Progress autosaves on this device</span>
                        </div>
                    </div>

                    {/* Content area: fills remaining height, no scroll */}
                    <div className="flex-1 px-4 py-4 flex items-center justify-center overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
