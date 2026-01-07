// src/components/ui/RightSidebar.jsx
import { FiTarget, FiStar, FiLock, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { on, off } from "../../utils/eventBus";

export default function RightSidebar() {
    // ⭐ SDG STATE
    const [sdgPoints, setSdgPoints] = useState(() => {
        return Number(localStorage.getItem("sdgPoints")) || 0;  // Loads on mount
    });

    // ⭐ PRIMARY OBJECTIVE
    const [primaryObj, setPrimaryObj] = useState({
        collected: 0,
        goal: 1,
        title: "",
        description: "",
        complete: false,
    });

    // ⭐ SECONDARY OBJECTIVE (preview / active)
    const [secondaryObj, setSecondaryObj] = useState({
        collected: 0,
        goal: 0,
        title: "",
        description: "",
        active: false,   // becomes true when it actually starts
        preview: false,  // true = "Next objective" teaser
    });

    // ⭐ CHAPTER PROGRESSION (0–4)
    const [chapterProgress, setChapterProgress] = useState(() => {
        try {
            // ✅ Check for actual chapter completion flags
            const completedFlags = [
                "chapter1_completed",
                "chapter2_completed",
                "chapter3_completed",
                "chapter4_completed",
            ];

            let completedCount = 0;
            for (const flag of completedFlags) {
                if (localStorage.getItem(flag)) {
                    completedCount++;
                }
            }

            return completedCount;
        } catch {
            return 0;
        }
    });


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

    const SDG_BAR_MAX = 100; // visual cap only
    const sdgBarPercent = Math.min(sdgPoints, SDG_BAR_MAX);


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
            setSdgPoints((prev) => prev + delta);

            // ✅ ADD THIS:  Trigger floating text
            if (delta !== 0) {
                triggerEffects(formatDelta(delta), "SDG", "sdg");
            }
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
                    if ("title" in data) next.title = data.title;
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
                    if ("title" in data) next.title = data.title;
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
    // CHAPTER PROGRESSION - Listen for updates
    // ============================================================
    useEffect(() => {
        const handleChapterProgressUpdate = () => {
            try {
                // ✅ Check for actual chapter completion flags
                const completedFlags = [
                    "chapter1_completed",
                    "chapter2_completed",
                    "chapter3_completed",
                    "chapter4_completed",
                ];

                let completedCount = 0;
                for (const flag of completedFlags) {
                    if (localStorage.getItem(flag)) {
                        completedCount++;
                    }
                }

                setChapterProgress(completedCount);
                console.log("✅ Chapter progress updated:", completedCount);
            } catch {
                setChapterProgress(0);
            }
        };

        // Listen for storage changes (when another tab/scene updates localStorage)
        window.addEventListener("storage", handleChapterProgressUpdate);

        // Also listen for custom event bus (if scenes emit it)
        on("updateChapterProgress", handleChapterProgressUpdate);

        return () => {
            window.removeEventListener("storage", handleChapterProgressUpdate);
            off("updateChapterProgress", handleChapterProgressUpdate);
        };
    }, []);

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="h-full w-full flex items-center justify-center pointer-events-none">
            <div className="relative z-[99] w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md">

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
                        <div className="mb-3 rounded-xl p-2 -m-2" title="SDG points are cumulative across the entire game and reflect long-term sustainable choices."
                        >

                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-300/60 flex items-center justify-center">
                                        <FiStar className="text-yellow-300" size={13} />
                                    </div>
                                    <span className="text-xs text-gray-300 uppercase tracking-wide">
                                        SDG Points
                                    </span>
                                </div>
                                <div className="relative inline-flex items-center justify-end">
                                    <span className="text-sm font-semibold text-yellow-100">
                                        {sdgPoints} pts
                                    </span>

                                    {floatingText && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.6 }}
                                            className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        z-[9999] pointer-events-none
        text-yellow-300 font-bold
        drop-shadow-[0_0_10px_rgba(250,250,150,0.9)]
      "
                                        >
                                            <span className="block text-[10px] text-gray-200 uppercase tracking-wide text-center">
                                                {floatingText.label}
                                            </span>
                                            <span className="text-xl block text-center">{floatingText.text}</span>
                                        </motion.div>
                                    )}
                                </div>

                            </div>

                            <div className="flex items-center gap-3 w-full">
                                <div className="flex-grow h-3 bg-gray-800/80 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sdgBarPercent}%` }}
                                        transition={{ duration: 1.2, ease: "easeInOut" }}
                                        className={`h-full bg-gradient-to-r ${getSDGColor(sdgPoints)}`}
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

                                    <div className="flex items-start gap-2">
                                        <div
                                            className="flex flex-col"
                                            title={
                                                primaryObj.description
                                                    ? primaryObj.description
                                                    : "This is the main objective required to progress the story."
                                            }
                                        >
                                            <span className="text-[10px] uppercase tracking-wide text-gray-400">
                                                Primary Objective
                                            </span>

                                            <span className="text-[12px] uppercase tracking-wide text-cyan-400">
                                                {primaryObj.title?.trim() || "No primary objective set yet"}
                                            </span>
                                        </div>

                                        {primaryComplete && (
                                            <span className="
      text-[9px]
      px-1.5 py-0.5
      rounded-full
      bg-emerald-500/15
      border border-emerald-400/60
      text-emerald-200
      leading-none
      mt-[2px]
    ">
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
                            <div
                                className="mt-3 rounded-xl p-2 -m-2 min-h-[85px]"
                                title={
                                    secondaryObj.active
                                        ? secondaryObj.description
                                        : "This objective will unlock after completing the primary objective."
                                }
                            >
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
                                                {secondaryObj.active ? "Secondary Objective" : "Upcoming Objective"}
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
                    <div className="mt-20 border-t border-white/5 pt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-300 uppercase tracking-wide">
                                Chapter Progress
                            </span>
                            <span className="text-[11px] text-gray-400">
                                {chapterProgress}/4 completed
                            </span>
                        </div>

                        <div className=" mt-3 flex items-center justify-between gap-2">
                            {Array.from({ length: 4 }).map((_, index) => {
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
