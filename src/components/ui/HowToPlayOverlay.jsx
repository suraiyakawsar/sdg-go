// // // HowToPlayOverlay.jsx
// // import React from "react";
// // import { MdKeyboard } from "react-icons/md";
// // import { IconContext } from "react-icons";

// // const sections = [
// //     { title: "Movement", body: "Use WASD to move around the environment." },
// //     { title: "Interaction", body: "Move close to people or objects and press Q, E, or R, or click the on-screen prompt." },
// //     { title: "Dialogue", body: "Click to continue conversations. Some responses affect SDG points." },
// //     { title: "Exploration", body: "Inspect objects, talk to NPCs, and discover hidden details." },
// //     { title: "Progress", body: "Objectives and SDG indicators update as you play." },
// //     { title: "Advancing", body: "New areas unlock after key actions or conversations." }
// // ];

// // export default function HowToPlayOverlay({ onClose, isBoot }) {
// //     return (
// //         <div style={{
// //             position: "absolute",
// //             top: 0,
// //             left: 0,
// //             width: "100%",
// //             height: "100%",
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             pointerEvents: "none"
// //         }}>
// //             <div style={{
// //                 background: "rgba(11,18,32,0.95)",
// //                 border: "2px solid rgba(255,255,255,0.1)",
// //                 width: "90%",
// //                 maxWidth: 1100,
// //                 padding: 40,
// //                 borderRadius: 12,
// //                 textAlign: "center",
// //                 pointerEvents: "auto",
// //                 display: "flex",
// //                 flexDirection: "column",
// //                 gap: 32
// //             }}>
// //                 {/* Title */}
// //                 <h1 style={{ fontSize: 36, color: "#F9FAFB", marginBottom: 8 }}>How to Play</h1>
// //                 <p style={{ fontSize: 18, color: "#D1D5DB", marginBottom: 24 }}>
// //                     Explore thoughtfully. Your choices shape your impact.
// //                 </p>

// //                 {/* Sections in 2 columns */}
// //                 <div style={{
// //                     display: "grid",
// //                     gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
// //                     gap: "32px"
// //                 }}>
// //                     {sections.map((s, i) => (
// //                         <div key={i} style={{
// //                             background: "rgba(2,6,23,0.85)",
// //                             border: "1.5px solid rgba(255,255,255,0.1)",
// //                             borderRadius: 8,
// //                             padding: 16,
// //                             textAlign: "left"
// //                         }}>
// //                             <h2 style={{ fontSize: 24, color: "#E5E7EB", marginBottom: 8 }}>{s.title}</h2>
// //                             <p style={{ fontSize: 18, color: "#D1D5DB", lineHeight: 1.5 }}>{s.body}</p>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 {/* Keys */}
// //                 <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 16 }}>
// //                     <KeyCard keyName="Q" label="Interact" />
// //                     <KeyCard keyName="E" label="Interact" />
// //                     <KeyCard keyName="R" label="Interact" />
// //                 </div>

// //                 {/* Primary button */}
// //                 <button
// //                     onClick={onClose}
// //                     style={{
// //                         fontSize: 22,
// //                         padding: "16px 40px",
// //                         background: "#111827",
// //                         color: "#F9FAFB",
// //                         border: "2px solid rgba(255,255,255,0.12)",
// //                         borderRadius: 8,
// //                         cursor: "pointer",
// //                         marginTop: 24,
// //                         alignSelf: "center"
// //                     }}
// //                 >
// //                     {isBoot ? "Start" : "Close"}
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // }

// // function KeyCard({ keyName, label }) {
// //     return (
// //         <IconContext.Provider value={{ size: "36px", color: "#F9FAFB" }}>
// //             <div style={{
// //                 background: "rgba(2,6,23,0.9)",
// //                 border: "1.5px solid rgba(255,255,255,0.1)",
// //                 borderRadius: 8,
// //                 padding: 16,
// //                 width: 120,
// //                 textAlign: "center",
// //                 display: "flex",
// //                 flexDirection: "column",
// //                 alignItems: "center",
// //                 gap: 8
// //             }}>
// //                 <MdKeyboard />
// //                 <div style={{ fontSize: 20 }}>{keyName}</div>
// //                 <div style={{ fontSize: 16, color: "#D1D5DB" }}>{label}</div>
// //             </div>
// //         </IconContext.Provider>
// //     );
// // }



// // HowToPlayOverlay.jsx
// import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
// import { FiX, FiMove, FiMessageCircle, FiSearch, FiTarget, FiUnlock } from "react-icons/fi";
// import { MdKeyboard } from "react-icons/md";

// const sections = [
//     {
//         title: "Movement",
//         body: "Use WASD or arrow keys to move around the environment.",
//         icon: FiMove,
//         color: "#34D399" // emerald
//     },
//     {
//         title: "Interaction",
//         body: "Move close to people or objects and press Q, E, or R, or click the on-screen prompt.",
//         icon: FiMessageCircle,
//         color: "#60A5FA" // blue
//     },
//     {
//         title: "Dialogue",
//         body: "Click to continue conversations. Some responses affect your SDG points.",
//         icon: FiMessageCircle,
//         color: "#A78BFA" // purple
//     },
//     {
//         title: "Exploration",
//         body: "Inspect objects, talk to NPCs, and discover hidden details for bonus points.",
//         icon: FiSearch,
//         color: "#FBBF24" // amber
//     },
//     {
//         title: "Progress",
//         body: "Objectives and SDG indicators update as you play.  Check the sidebar!",
//         icon: FiTarget,
//         color: "#F472B6" // pink
//     },
//     {
//         title: "Advancing",
//         body: "New areas unlock after completing key actions or conversations.",
//         icon: FiUnlock,
//         color: "#22D3EE" // cyan
//     }
// ];

// const keys = [
//     { key: "W", label: "Up" },
//     { key: "A", label: "Left" },
//     { key: "S", label: "Down" },
//     { key: "D", label: "Right" },
//     { key: "Q", label: "Interact" },
//     { key: "E", label: "Interact" },
// ];

// export default function HowToPlayOverlay({ onClose, isBoot }) {
//     return (
//         <LazyMotion features={domAnimation}>
//             <AnimatePresence>
//                 <m.div
//                     className="fixed inset-0 z-50 flex items-center justify-center p-4"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                 >
//                     {/* Backdrop */}
//                     <m.div
//                         className="absolute inset-0 bg-black/80 backdrop-blur-sm"
//                         onClick={!isBoot ? onClose : undefined}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                     />

//                     {/* Modal */}
//                     <m.div
//                         className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0B1024]/95 backdrop-blur-xl shadow-[0_30px_120px_-60px_rgba(0,0,0,0.95)]"
//                         initial={{ scale: 0.95, opacity: 0, y: 20 }}
//                         animate={{ scale: 1, opacity: 1, y: 0 }}
//                         exit={{ scale: 0.95, opacity: 0, y: 20 }}
//                         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//                     >
//                         {/* Top accent bar */}
//                         <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500/70 via-purple-400/50 to-cyan-400/60 rounded-t-3xl" />

//                         {/* Close button (only if not boot) */}
//                         {!isBoot && (
//                             <button
//                                 onClick={onClose}
//                                 className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition z-10"
//                                 aria-label="Close"
//                             >
//                                 <FiX className="w-5 h-5" />
//                             </button>
//                         )}

//                         <div className="p-8 md:p-10">
//                             {/* Header */}
//                             <div className="text-center mb-8">
//                                 <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 mb-4">
//                                     <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
//                                     <span>Game Guide</span>
//                                 </div>
//                                 <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
//                                     How to Play
//                                 </h1>
//                                 <p className="text-white/60 text-lg max-w-xl mx-auto">
//                                     Explore thoughtfully. Your choices shape your impact on the SDGs.
//                                 </p>
//                             </div>

//                             {/* Sections Grid */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//                                 {sections.map((section, i) => (
//                                     <SectionCard key={i} section={section} index={i} />
//                                 ))}
//                             </div>

//                             {/* Controls */}
//                             <div className="mb-8">
//                                 <div className="text-xs text-white/55 uppercase tracking-wider text-center mb-4">
//                                     Controls
//                                 </div>
//                                 <div className="flex flex-wrap justify-center gap-3">
//                                     {keys.map((k, i) => (
//                                         <KeyCard key={i} keyName={k.key} label={k.label} />
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Tips */}
//                             <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-8">
//                                 <div className="text-xs text-white/55 uppercase tracking-wider mb-2">
//                                     💡 Pro Tips
//                                 </div>
//                                 <ul className="text-sm text-white/70 space-y-1">
//                                     <li>• Look for glowing objects — they're interactive!</li>
//                                     <li>• Talk to everyone.  Some NPCs have hidden dialogues.</li>
//                                     <li>• Your choices matter. Different responses give different SDG points. </li>
//                                     <li>• Check your badges in the sidebar to track achievements.</li>
//                                 </ul>
//                             </div>

//                             {/* Action Button */}
//                             <div className="flex justify-center">
//                                 <m.button
//                                     onClick={onClose}
//                                     whileHover={{ y: -2 }}
//                                     whileTap={{ scale: 0.98 }}
//                                     className={[
//                                         "px-8 py-4 rounded-2xl font-semibold text-lg",
//                                         "border shadow-[0_12px_35px_-20px_rgba(16,185,129,0.6)]",
//                                         "transition",
//                                         isBoot
//                                             ? "bg-gradient-to-br from-emerald-500/30 to-lime-500/15 border-emerald-400/30 text-white"
//                                             : "bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10"
//                                     ].join(" ")}
//                                 >
//                                     {isBoot ? "🎮 Start Playing" : "Got it!"}
//                                 </m.button>
//                             </div>
//                         </div>
//                     </m.div>
//                 </m.div>
//             </AnimatePresence>
//         </LazyMotion>
//     );
// }

// function SectionCard({ section, index }) {
//     const Icon = section.icon;

//     return (
//         <m.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.05 }}
//             className="group relative rounded-2xl bg-black/40 border border-white/10 p-5 hover:bg-black/50 transition overflow-hidden"
//         >
//             {/* Bottom glow on hover */}
//             <span
//                 className="pointer-events-none absolute inset-x-1 bottom-0 h-[3px] opacity-0 group-hover: opacity-100 transition"
//                 style={{
//                     background: `linear-gradient(90deg, transparent, ${section.color}, transparent)`,
//                     boxShadow: `0 0 10px ${section.color}, 0 0 22px ${section.color}CC`,
//                     filter: "saturate(1.6)",
//                 }}
//             />

//             <div className="flex items-start gap-4">
//                 <div
//                     className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
//                     style={{ backgroundColor: `${section.color}20`, borderColor: `${section.color}40` }}
//                 >
//                     <Icon className="w-5 h-5" style={{ color: section.color }} />
//                 </div>

//                 <div className="min-w-0">
//                     <h3 className="text-base font-semibold text-white mb-1">
//                         {section.title}
//                     </h3>
//                     <p className="text-sm text-white/60 leading-relaxed">
//                         {section.body}
//                     </p>
//                 </div>
//             </div>
//         </m.div>
//     );
// }

// function KeyCard({ keyName, label }) {
//     return (
//         <m.div
//             whileHover={{ y: -2, scale: 1.05 }}
//             className="flex flex-col items-center gap-1"
//         >
//             <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:border-emerald-400/40 transition">
//                 {keyName}
//             </div>
//             <span className="text-[10px] text-white/50">{label}</span>
//         </m.div>
//     );
// }