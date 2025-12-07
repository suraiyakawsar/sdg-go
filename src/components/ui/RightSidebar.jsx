// // src/components/ui/RightSidebar.jsx
// import { FiTarget, FiStar, FiLock, FiCheck } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { on, off } from "../../utils/eventBus";

// export default function RightSidebar() {
//     // SDG STATE
//     const [sdgPoints, setSdgPoints] = useState(0);

//     // OBJECTIVES STATE: primary + secondary
//     const [objectives, setObjectives] = useState({
//         primary: {
//             collected: 0,
//             goal: 1,
//             description: "",
//         },
//         secondary: null, // will be filled later
//     });

//     // CHAPTER PROGRESSION (0–5)
//     const [chapterProgress, setChapterProgress] = useState(0);

//     const primary = objectives.primary;
//     const secondary = objectives.secondary;

//     // Helpers for goals / percentages
//     const getGoalSafe = (goal) => {
//         const raw = Number(goal) || 0;
//         return raw > 0 ? raw : 1;
//     };

//     const primaryGoal = getGoalSafe(primary.goal);
//     const primaryPct = Math.min((primary.collected / primaryGoal) * 100, 100);
//     const primaryComplete = primary.collected >= primaryGoal;

//     const secondaryGoal = secondary ? getGoalSafe(secondary.goal) : 1;
//     const secondaryPct = secondary
//         ? Math.min((secondary.collected / secondaryGoal) * 100, 100)
//         : 0;
//     const secondaryComplete = secondary
//         ? secondary.collected >= secondaryGoal
//         : false;

//     const sdgBarPercent = Math.max(0, Math.min(sdgPoints, 100));

//     // FLOATING TEXT & PARTICLES
//     const [floatingText, setFloatingText] = useState(null); // { text, label } | null
//     const [particles, setParticles] = useState([]);

//     const getSDGColor = (value) => {
//         if (value < 30) return "from-green-400 to-yellow-400";
//         if (value < 70) return "from-yellow-400 to-orange-500";
//         return "from-orange-500 to-red-500";
//     };

//     const getObjectiveColor = (value) => {
//         if (value < 50) return "from-blue-400 to-indigo-500";
//         if (value < 80) return "from-purple-500 to-purple-700";
//         return "from-pink-400 to-pink-600";
//     };

//     const formatDelta = (value) => (value > 0 ? `+${value}` : `${value}`);

//     function triggerEffects(text, sourceLabel, sourceKey) {
//         setFloatingText({ text, label: sourceLabel });
//         spawnParticles(sourceKey);

//         setTimeout(() => setFloatingText(null), 1200);
//         setTimeout(() => setParticles([]), 800);
//     }

//     function spawnParticles(type) {
//         const burst = [...Array(6)].map((_, i) => ({
//             id: Math.random(),
//             angle: (i / 6) * Math.PI * 2,
//             color: type === "sdg" ? "#FFE680" : "#7bf8ff",
//         }));
//         setParticles(burst);
//     }

//     // ================= SDG updates (delta) =================
//     useEffect(() => {
//         const handleSdgUpdate = (delta) => {
//             if (typeof delta !== "number" || isNaN(delta)) return;

//             setSdgPoints((prev) => {
//                 const next = prev + delta;
//                 if (delta !== 0) {
//                     triggerEffects(formatDelta(delta), "SDG", "sdg");
//                 }
//                 return next;
//             });
//         };

//         on("updateSDGPoints", handleSdgUpdate);
//         return () => off("updateSDGPoints", handleSdgUpdate);
//     }, []);

//     // ================= Objective updates (primary + secondary) =================
//     useEffect(() => {
//         const handleObjectiveUpdate = (data) => {
//             // Case 1: numeric delta → increment whichever objective is active
//             if (typeof data === "number") {
//                 const delta = data;
//                 setObjectives((prev) => {
//                     let { primary, secondary } = prev;

//                     const primaryGoal = getGoalSafe(primary.goal);
//                     const secondaryGoal = secondary ? getGoalSafe(secondary.goal) : null;

//                     // If primary exists and is not complete, increment primary
//                     if (primary.description && primary.collected < primaryGoal) {
//                         const updatedPrimary = {
//                             ...primary,
//                             collected: (primary.collected ?? 0) + delta,
//                         };
//                         triggerEffects(formatDelta(delta), "Objective", "objective");
//                         return {
//                             primary: updatedPrimary,
//                             secondary,
//                         };
//                     }

//                     // Else, if secondary exists and not complete, increment secondary
//                     if (
//                         secondary &&
//                         secondary.description &&
//                         secondary.collected < secondaryGoal
//                     ) {
//                         const updatedSecondary = {
//                             ...secondary,
//                             collected: (secondary.collected ?? 0) + delta,
//                         };
//                         triggerEffects(formatDelta(delta), "Objective", "objective");
//                         return {
//                             primary,
//                             secondary: updatedSecondary,
//                         };
//                     }

//                     // No active objective to update
//                     return prev;
//                 });

//                 return;
//             }

//             // Case 2: object → set/replace primary or secondary
//             if (data && typeof data === "object") {
//                 setObjectives((prev) => {
//                     let { primary, secondary } = prev;

//                     const payload = data;
//                     const slot =
//                         payload.slot === "primary" || payload.slot === "secondary"
//                             ? payload.slot
//                             : null;

//                     const base = {
//                         collected: payload.collected ?? 0,
//                         goal: payload.goal ?? 1,
//                         description: payload.description || payload.text || "",
//                     };

//                     // Explicit slot override (if you ever want to use it later)
//                     if (slot === "primary") {
//                         return {
//                             primary: { ...primary, ...base },
//                             secondary,
//                         };
//                     }
//                     if (slot === "secondary") {
//                         return {
//                             primary,
//                             secondary: { ...(secondary || {}), ...base },
//                         };
//                     }

//                     // Auto-assignment:
//                     //  - If primary empty → fill primary
//                     //  - Else → fill/overwrite secondary
//                     if (!primary.description) {
//                         return {
//                             primary: { ...primary, ...base },
//                             secondary,
//                         };
//                     }

//                     return {
//                         primary,
//                         secondary: { ...(secondary || {}), ...base },
//                     };
//                 });
//             }
//         };

//         on("updateObjective", handleObjectiveUpdate);
//         return () => off("updateObjective", handleObjectiveUpdate);
//     }, []);

//     // ================= Chapter progression updates =================
//     useEffect(() => {
//         const handleChapterProgressUpdate = (data) => {
//             let value = 0;

//             if (typeof data === "number") {
//                 value = data;
//             } else if (data && typeof data === "object") {
//                 value = Number(data.completed ?? data.chapter ?? 0) || 0;
//             }

//             value = Math.max(0, Math.min(5, value));
//             setChapterProgress(value);
//         };

//         on("updateChapterProgress", handleChapterProgressUpdate);
//         return () => off("updateChapterProgress", handleChapterProgressUpdate);
//     }, []);

//     // ================= RENDER =================
//     return (
//         <div className="h-full w-full flex items-center justify-center pointer-events-none">
//             <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md">
//                 {/* FLOATING TEXT */}
//                 {floatingText && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 16, x: 0 }}
//                         animate={{ opacity: 1, y: -8, x: 0 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.8 }}
//                         className="absolute -top-6 left-2 text-yellow-300 font-bold drop-shadow-[0_0_10px_rgba(250,250,150,0.9)]"
//                     >
//                         <span className="block text-[10px] text-gray-200 uppercase tracking-wide">
//                             {floatingText.label}
//                         </span>
//                         <span className="text-xl">{floatingText.text}</span>
//                     </motion.div>
//                 )}

//                 {/* PARTICLES */}
//                 {particles.map((p) => (
//                     <motion.div
//                         key={p.id}
//                         initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
//                         animate={{
//                             opacity: 0,
//                             scale: 0.2,
//                             x: Math.cos(p.angle) * 26,
//                             y: Math.sin(p.angle) * 26,
//                         }}
//                         transition={{ duration: 0.65 }}
//                         className="absolute left-4 top-4 w-2 h-2 rounded-full pointer-events-none"
//                         style={{ backgroundColor: p.color }}
//                     />
//                 ))}

//                 {/* PANEL – now flex column so we can push chapter progress to bottom */}
//                 <motion.div
//                     initial={{ opacity: 0, x: 16 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ type: "spring", stiffness: 260, damping: 24 }}
//                     className="
//             pointer-events-auto
//             w-full
//             bg-black/80 backdrop-blur-2xl
//             shadow-[0_0_35px_rgba(0,0,0,0.8)]
//             rounded-2xl p-4
//             border border-white/10
//             text-white
//             flex flex-col
//             min-h-[320px]
//           "
//                 >
//                     {/* Header */}
//                     <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-2">
//                             <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-xs font-semibold">
//                                 XP
//                             </span>
//                             <div className="flex flex-col">
//                                 <span className="text-xs uppercase tracking-[0.16em] text-gray-400">
//                                     Progress Overview
//                                 </span>
//                                 <span className="text-sm text-gray-100">
//                                     SDG & chapter objectives
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* SDG section */}
//                     <div className="mb-3 rounded-xl p-2 -m-2">
//                         <div className="flex items-center justify-between mb-1">
//                             <div className="flex items-center gap-2">
//                                 <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-300/60 flex items-center justify-center">
//                                     <FiStar className="text-yellow-300" size={13} />
//                                 </div>
//                                 <span className="text-xs text-gray-300 uppercase tracking-wide">
//                                     SDG Points
//                                 </span>
//                             </div>
//                             <span className="text-sm font-semibold text-yellow-100">
//                                 {sdgPoints} pts
//                             </span>
//                         </div>

//                         <div className="flex items-center gap-3 w-full">
//                             <div className="flex-grow h-3 bg-gray-800/80 rounded-full overflow-hidden">
//                                 <motion.div
//                                     initial={false}
//                                     animate={{ width: `${sdgBarPercent}%` }}
//                                     transition={{
//                                         type: "spring",
//                                         stiffness: 120,
//                                         damping: 20,
//                                     }}
//                                     className={`h-full bg-gradient-to-r ${getSDGColor(
//                                         sdgPoints
//                                     )}`}
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* OBJECTIVES SECTION */}
//                     <div className="rounded-xl p-2 -m-2 space-y-3">
//                         {/* Primary Objective */}
//                         <div>
//                             <div className="flex items-center justify-between mb-1">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center">
//                                         {primaryComplete ? (
//                                             <FiCheck className="text-emerald-300" size={13} />
//                                         ) : (
//                                             <FiTarget className="text-cyan-300" size={13} />
//                                         )}
//                                     </div>
//                                     <span className="text-xs text-gray-300 uppercase tracking-wide flex items-center gap-1">
//                                         {primaryComplete && (
//                                             <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/60 text-emerald-200">
//                                                 Done
//                                             </span>
//                                         )}
//                                         {primaryComplete
//                                             ? "Primary Objective Complete"
//                                             : "Primary Objective"}
//                                     </span>
//                                 </div>
//                                 <span className="text-sm font-semibold text-cyan-100">
//                                     {Math.min(primary.collected, primaryGoal)}/{primaryGoal}
//                                 </span>
//                             </div>

//                             <p
//                                 className={`text-[11px] mb-2 leading-snug ${primaryComplete ? "text-emerald-200" : "text-gray-200"
//                                     }`}
//                             >
//                                 {primary.description && primary.description.trim().length > 0
//                                     ? primary.description
//                                     : "No primary objective set yet."}
//                             </p>

//                             <div className="flex items-center gap-3 w-full">
//                                 <div className="flex-grow h-3 bg-gray-800/80 rounded-full overflow-hidden">
//                                     <motion.div
//                                         initial={false}
//                                         animate={{ width: `${primaryPct}%` }}
//                                         transition={{
//                                             type: "spring",
//                                             stiffness: 120,
//                                             damping: 22,
//                                         }}
//                                         className={`h-full bg-gradient-to-r ${primaryComplete
//                                             ? "from-emerald-400 to-emerald-500"
//                                             : getObjectiveColor(primaryPct)
//                                             }`}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Secondary Objective (if exists) */}
//                         {secondary && secondary.description && (
//                             <div className="pt-2 border-t border-white/5">
//                                 <div className="flex items-center justify-between mb-1">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-6 h-6 rounded-full bg-purple-400/20 border border-purple-300/60 flex items-center justify-center">
//                                             {secondaryComplete ? (
//                                                 <FiCheck className="text-emerald-300" size={13} />
//                                             ) : (
//                                                 <FiTarget className="text-purple-300" size={13} />
//                                             )}
//                                         </div>
//                                         <span className="text-xs text-gray-300 uppercase tracking-wide flex items-center gap-1">
//                                             {secondaryComplete && (
//                                                 <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/60 text-emerald-200">
//                                                     Done
//                                                 </span>
//                                             )}
//                                             {secondaryComplete
//                                                 ? "Secondary Objective Complete"
//                                                 : "Secondary Objective"}
//                                         </span>
//                                     </div>
//                                     <span className="text-sm font-semibold text-purple-100">
//                                         {Math.min(secondary.collected, secondaryGoal)}/
//                                         {secondaryGoal}
//                                     </span>
//                                 </div>

//                                 <p
//                                     className={`text-[11px] mb-2 leading-snug ${secondaryComplete ? "text-emerald-200" : "text-gray-200"
//                                         }`}
//                                 >
//                                     {secondary.description}
//                                 </p>

//                                 <div className="flex items-center gap-3 w-full">
//                                     <div className="flex-grow h-3 bg-gray-800/80 rounded-full overflow-hidden">
//                                         <motion.div
//                                             initial={false}
//                                             animate={{ width: `${secondaryPct}%` }}
//                                             transition={{
//                                                 type: "spring",
//                                                 stiffness: 120,
//                                                 damping: 22,
//                                             }}
//                                             className={`h-full bg-gradient-to-r ${secondaryComplete
//                                                 ? "from-emerald-400 to-emerald-500"
//                                                 : getObjectiveColor(secondaryPct)
//                                                 }`}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         <p className="mt-2 text-[11px] text-gray-400 leading-snug">
//                             Make good choices in dialogue and complete these objectives to
//                             progress the chapter.
//                         </p>
//                     </div>

//                     {/* CHAPTER PROGRESSION – pinned to bottom */}
//                     <div className="mt-auto pt-3 border-t border-white/5">
//                         <div className="flex items-center justify-between mb-2">
//                             <span className="text-xs text-gray-300 uppercase tracking-wide">
//                                 Chapter Progress
//                             </span>
//                             <span className="text-[11px] text-gray-400">
//                                 {chapterProgress}/5 completed
//                             </span>
//                         </div>

//                         <div className="flex items-center justify-between gap-2">
//                             {Array.from({ length: 5 }).map((_, index) => {
//                                 const unlocked = index < chapterProgress;
//                                 return (
//                                     <div
//                                         key={index}
//                                         className="flex flex-col items-center gap-1"
//                                     >
//                                         <motion.div
//                                             initial={false}
//                                             animate={{
//                                                 scale: unlocked ? 1.05 : 1,
//                                                 boxShadow: unlocked
//                                                     ? "0 0 16px rgba(74,222,128,0.55)"
//                                                     : "0 0 0 rgba(0,0,0,0)",
//                                             }}
//                                             className={`
//                         flex items-center justify-center
//                         w-8 h-8 rounded-full border text-xs
//                         ${unlocked
//                                                     ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
//                                                     : "bg-slate-900 border-slate-600 text-slate-400"
//                                                 }
//                       `}
//                                         >
//                                             {unlocked ? (
//                                                 <FiCheck size={14} />
//                                             ) : (
//                                                 <FiLock size={14} />
//                                             )}
//                                         </motion.div>
//                                         <span className="text-[10px] text-gray-400">
//                                             Ch {index + 1}
//                                         </span>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }


// src/components/ui/RightSidebar.jsx
import { FiTarget, FiStar, FiLock, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { on, off } from "../../utils/eventBus";

export default function RightSidebar() {
    // ⭐ SDG STATE
    const [sdgPoints, setSdgPoints] = useState(0);

    // ⭐ PRIMARY OBJECTIVE
    const [primaryObj, setPrimaryObj] = useState({
        collected: 0,
        goal: 1,
        description: "",
        complete: false,
    });

    // ⭐ SECONDARY OBJECTIVE (preview / active)
    const [secondaryObj, setSecondaryObj] = useState({
        collected: 0,
        goal: 0,
        description: "",
        active: false,   // becomes true when it actually starts
        preview: false,  // true = "Next objective" teaser
    });

    // ⭐ CHAPTER PROGRESSION (0–5)
    const [chapterProgress, setChapterProgress] = useState(0);

    // ========== DERIVED NUMBERS ==========
    const primarySafeGoal = Number(primaryObj.goal) > 0 ? Number(primaryObj.goal) : 1;
    const primaryPercent = Math.min(
        (primaryObj.collected / primarySafeGoal) * 100,
        100
    );
    const primaryComplete = primaryObj.complete || primaryObj.collected >= primarySafeGoal;

    const secondarySafeGoal =
        Number(secondaryObj.goal) > 0 ? Number(secondaryObj.goal) : 1;
    const secondaryPercent = secondaryObj.active
        ? Math.min((secondaryObj.collected / secondarySafeGoal) * 100, 100)
        : 0;
    const secondaryComplete =
        secondaryObj.active && secondaryObj.collected >= secondarySafeGoal;

    const sdgBarPercent = Math.max(0, Math.min(sdgPoints, 100));

    // FLOATING TEXT & PARTICLES
    const [floatingText, setFloatingText] = useState(null); // { text, label } | null
    const [particles, setParticles] = useState([]);

    const getSDGColor = (value) => {
        if (value < 30) return "from-green-400 to-yellow-400";
        if (value < 70) return "from-yellow-400 to-orange-500";
        return "from-orange-500 to-red-500";
    };

    const getObjectiveColor = (value) => {
        if (value < 50) return "from-blue-400 to-indigo-500";
        if (value < 80) return "from-purple-500 to-purple-700";
        return "from-pink-400 to-pink-600";
    };

    const formatDelta = (value) => (value > 0 ? `+${value}` : `${value}`);

    function triggerEffects(text, sourceLabel, sourceKey) {
        setFloatingText({ text, label: sourceLabel });
        spawnParticles(sourceKey);

        setTimeout(() => setFloatingText(null), 1200);
        setTimeout(() => setParticles([]), 800);
    }

    function spawnParticles(type) {
        const burst = [...Array(6)].map((_, i) => ({
            id: Math.random(),
            angle: (i / 6) * Math.PI * 2,
            color: type === "sdg" ? "#FFE680" : "#7bf8ff",
        }));
        setParticles(burst);
    }

    // ============================================================
    // SDG UPDATES (delta)
    // ============================================================
    useEffect(() => {
        const handleSdgUpdate = (delta) => {
            if (typeof delta !== "number" || isNaN(delta)) return;

            setSdgPoints((prev) => {
                const next = prev + delta;
                if (delta !== 0) {
                    triggerEffects(formatDelta(delta), "SDG", "sdg");
                }
                return next;
            });
        };

        on("updateSDGPoints", handleSdgUpdate);
        return () => off("updateSDGPoints", handleSdgUpdate);
    }, []);

    // ============================================================
    // OBJECTIVE UPDATES  (primary / secondary / preview)
    // ============================================================
    useEffect(() => {
        const handleObjectiveUpdate = (data) => {
            // Legacy: if number → treat as primary delta
            if (typeof data === "number") {
                setPrimaryObj((prev) => {
                    const nextCollected = (prev.collected ?? 0) + data;
                    if (data !== 0) {
                        triggerEffects(formatDelta(data), "Objective", "objective");
                    }
                    return { ...prev, collected: nextCollected };
                });
                return;
            }

            if (!data || typeof data !== "object") return;

            const slot = data.slot || "primary"; // "primary" | "secondary"

            // ---------- PRIMARY ----------
            if (slot === "primary") {
                setPrimaryObj((prev) => {
                    const next = { ...prev };

                    // delta
                    if (typeof data.delta === "number") {
                        next.collected = (prev.collected ?? 0) + data.delta;
                    }

                    // direct fields (overwrite)
                    if ("collected" in data) next.collected = data.collected;
                    if ("goal" in data) next.goal = data.goal;
                    if ("description" in data || "text" in data) {
                        next.description = data.description || data.text || "";
                    }
                    if ("complete" in data) next.complete = !!data.complete;

                    const inc = (next.collected ?? 0) - (prev.collected ?? 0);
                    if (inc !== 0) {
                        triggerEffects(formatDelta(inc), "Objective", "objective");
                    }

                    return next;
                });
                return;
            }

            // ---------- SECONDARY ----------
            if (slot === "secondary") {
                setSecondaryObj((prev) => {
                    const next = { ...prev };

                    if (typeof data.delta === "number") {
                        next.collected = (prev.collected ?? 0) + data.delta;
                    }
                    if ("collected" in data) next.collected = data.collected;
                    if ("goal" in data) next.goal = data.goal;
                    if ("description" in data || "text" in data) {
                        next.description = data.description || data.text || "";
                    }
                    if ("active" in data) next.active = !!data.active;
                    if ("preview" in data) next.preview = !!data.preview;

                    const inc = (next.collected ?? 0) - (prev.collected ?? 0);
                    if (inc !== 0) {
                        triggerEffects(formatDelta(inc), "Objective", "objective");
                    }

                    return next;
                });
            }
        };

        on("updateObjective", handleObjectiveUpdate);
        return () => off("updateObjective", handleObjectiveUpdate);
    }, []);

    // ============================================================
    // CHAPTER PROGRESSION
    // ============================================================
    useEffect(() => {
        const handleChapterProgressUpdate = (data) => {
            let value = 0;

            if (typeof data === "number") {
                value = data;
            } else if (data && typeof data === "object") {
                value = Number(data.completed ?? data.chapter ?? 0) || 0;
            }

            value = Math.max(0, Math.min(5, value));
            setChapterProgress(value);
        };

        on("updateChapterProgress", handleChapterProgressUpdate);
        return () => off("updateChapterProgress", handleChapterProgressUpdate);
    }, []);

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="h-full w-full flex items-center justify-center pointer-events-none">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md">
                {/* FLOATING TEXT */}
                {floatingText && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, x: 0 }}
                        animate={{ opacity: 1, y: -8, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute -top-6 left-2 text-yellow-300 font-bold drop-shadow-[0_0_10px_rgba(250,250,150,0.9)]"
                    >
                        <span className="block text-[10px] text-gray-200 uppercase tracking-wide">
                            {floatingText.label}
                        </span>
                        <span className="text-xl">{floatingText.text}</span>
                    </motion.div>
                )}

                {/* PARTICLES */}
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        animate={{
                            opacity: 0,
                            scale: 0.2,
                            x: Math.cos(p.angle) * 26,
                            y: Math.sin(p.angle) * 26,
                        }}
                        transition={{ duration: 0.65 }}
                        className="absolute left-4 top-4 w-2 h-2 rounded-full pointer-events-none"
                        style={{ backgroundColor: p.color }}
                    />
                ))}

                {/* PANEL */}
                <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="
            pointer-events-auto
            w-full h-full
            bg-black/80 backdrop-blur-2xl
            shadow-[0_0_35px_rgba(0,0,0,0.8)]
            rounded-2xl p-4
            border border-white/10
            text-white
            flex flex-col
          "
                >
                    {/* TOP CONTENT (fills height) */}
                    <div className="flex-1 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-xs font-semibold">
                                    XP
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                        Progress Overview
                                    </span>
                                    <span className="text-sm text-gray-100">
                                        SDG & chapter objective
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* SDG section */}
                        <div className="mb-3 rounded-xl p-2 -m-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-300/60 flex items-center justify-center">
                                        <FiStar className="text-yellow-300" size={13} />
                                    </div>
                                    <span className="text-xs text-gray-300 uppercase tracking-wide">
                                        SDG Points
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-yellow-100">
                                    {sdgPoints} pts
                                </span>
                            </div>

                            <div className="flex items-center gap-3 w-full">
                                <div className="flex-grow h-3 bg-gray-800/80 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={false}
                                        animate={{ width: `${sdgBarPercent}%` }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 20,
                                        }}
                                        className={`h-full bg-gradient-to-r ${getSDGColor(
                                            sdgPoints
                                        )}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PRIMARY OBJECTIVE */}
                        <div className="rounded-xl p-2 -m-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center">
                                        {primaryComplete ? (
                                            <FiCheck className="text-emerald-300" size={13} />
                                        ) : (
                                            <FiTarget className="text-cyan-300" size={13} />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                                            Primary Objective
                                        </span>
                                        {primaryComplete && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/60 text-emerald-200">
                                                Done
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <span className="text-sm font-semibold text-cyan-100">
                                    {Math.min(primaryObj.collected, primarySafeGoal)}/{primarySafeGoal}
                                </span>
                            </div>

                            <p
                                className={`text-[11px] mb-2 leading-snug ${primaryComplete ? "text-emerald-200" : "text-gray-200"
                                    }`}
                            >
                                {primaryObj.description && primaryObj.description.trim().length > 0
                                    ? primaryObj.description
                                    : "No primary objective set yet."}
                            </p>

                            {/* Primary bar */}
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex-grow h-3 bg-gray-800/80 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={false}
                                        animate={{ width: `${primaryComplete ? 100 : primaryPercent}%` }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 22,
                                        }}
                                        className={`h-full bg-gradient-to-r ${primaryComplete
                                            ? "from-emerald-400 to-emerald-500"
                                            : getObjectiveColor(primaryPercent)
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECONDARY / NEXT OBJECTIVE */}
                        {secondaryObj.description && (
                            <div className="mt-3 rounded-xl p-2 -m-2">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-purple-400/20 border border-purple-300/60 flex items-center justify-center">
                                            {secondaryObj.active ? (
                                                secondaryComplete ? (
                                                    <FiCheck className="text-emerald-300" size={13} />
                                                ) : (
                                                    <FiTarget className="text-purple-200" size={13} />
                                                )
                                            ) : (
                                                <FiLock className="text-purple-200" size={13} />
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-wide text-gray-400">
                                                {secondaryObj.active
                                                    ? "Secondary Objective"
                                                    : "Next Objective"}
                                            </span>
                                            {!secondaryObj.active && (
                                                <span className="text-[9px] text-purple-200">
                                                    Unlocks after primary is done
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {secondaryObj.active && (
                                        <span className="text-sm font-semibold text-purple-100">
                                            {Math.min(secondaryObj.collected, secondarySafeGoal)}/
                                            {secondarySafeGoal}
                                        </span>
                                    )}
                                </div>

                                <p
                                    className={`text-[11px] mb-2 leading-snug ${secondaryObj.active ? "text-gray-200" : "text-gray-400"
                                        }`}
                                >
                                    {secondaryObj.description}
                                </p>

                                {secondaryObj.active && (
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="flex-grow h-3 bg-gray-800/80 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={false}
                                                animate={{ width: `${secondaryPercent}%` }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 120,
                                                    damping: 22,
                                                }}
                                                className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <p className="mt-3 text-[11px] text-gray-400 leading-snug">
                            Complete the primary objective to unlock the next task and push the
                            story forward.
                        </p>
                    </div>

                    {/* FOOTER – CHAPTER PROGRESS (STICK TO BOTTOM) */}
                    <div className="mt-35 border-t border-white/5 pt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-300 uppercase tracking-wide">
                                Chapter Progress
                            </span>
                            <span className="text-[11px] text-gray-400">
                                {chapterProgress}/5 completed
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            {Array.from({ length: 5 }).map((_, index) => {
                                const unlocked = index < chapterProgress;
                                return (
                                    <div key={index} className="flex flex-col items-center gap-1">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                scale: unlocked ? 1.05 : 1,
                                                boxShadow: unlocked
                                                    ? "0 0 16px rgba(74,222,128,0.55)"
                                                    : "0 0 0 rgba(0,0,0,0)",
                                            }}
                                            className={`
                        flex items-center justify-center
                        w-8 h-8 rounded-full border text-xs
                        ${unlocked
                                                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                                                    : "bg-slate-900 border-slate-600 text-slate-400"
                                                }
                      `}
                                        >
                                            {unlocked ? <FiCheck size={14} /> : <FiLock size={14} />}
                                        </motion.div>
                                        <span className="text-[10px] text-gray-400">
                                            Ch {index + 1}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
