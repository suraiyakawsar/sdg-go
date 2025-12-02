import { FiTarget, FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { on, off } from "../../utils/eventBus";
import { SDGProgress } from "./SDGProgress";

export default function RightSidebar() {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("sdg");

    // ⭐ SDG STATE
    const [sdgPoints, setSdgPoints] = useState(0);
    // ⭐ OBJECTIVE STATE
    const [objective, setObjective] = useState({
        collected: 0,
        goal: 2
    });

    const percentage = Math.min((objective.collected / objective.goal) * 100, 100);

    // For floating text particles
    const [floatingText, setFloatingText] = useState(null);
    const [particles, setParticles] = useState([]);

    /* ============================================================
    DYNAMIC BAR COLORS
    ============================================================ */
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


    /* -----------------------------------------------------------
        LISTEN FOR SDG UPDATES
    ----------------------------------------------------------- */
    // useEffect(() => {
    //     const handleSdgUpdate = (value) => {
    //         if (typeof value !== "number" || isNaN(value)) return;

    //         if (value >= -20 && value <= 20) {
    //             setSdgPoints(prev => prev + value);
    //         } else {
    //             setSdgPoints(value);
    //         }
    //     };

    //     on("updateSDGPoints", handleSdgUpdate);
    //     return () => off("updateSDGPoints", handleSdgUpdate);
    // }, []);

    useEffect(() => {
        const handleSdgUpdate = (value) => {
            if (typeof value !== "number") return;

            const increment = value >= -20 && value <= 20
                ? value
                : value - sdgPoints;

            setSdgPoints(prev => prev + increment);

            triggerEffects(`+${increment}`, "sdg");
        };

        on("updateSDGPoints", handleSdgUpdate);
        return () => off("updateSDGPoints", handleSdgUpdate);
    }, [sdgPoints]);

    /* ============================================================
    OBJECTIVE UPDATE LISTENER
    ============================================================ */
    useEffect(() => {
        const handleObjectiveUpdate = (data) => {
            if (typeof data === "number") {
                const inc = data;
                setObjective(prev => ({
                    ...prev,
                    collected: prev.collected + inc
                }));
                triggerEffects(`+${inc}`, "objective");
                return;
            }

            if (data && typeof data === "object") {
                setObjective(data);
                triggerEffects(`+${data.collected}`, "objective");
            }
        };

        on("updateObjective", handleObjectiveUpdate);
        return () => off("updateObjective", handleObjectiveUpdate);
    }, [objective]);

    /* ============================================================
   TRIGGER FLOATING TEXT + PARTICLES + OPEN PANEL
============================================================ */
    function triggerEffects(text, source) {
        setFloatingText(text);
        spawnParticles(source);

        setTab(source === "sdg" ? "sdg" : "objective");
        setOpen(true);

        setTimeout(() => setFloatingText(null), 1200);
        setTimeout(() => setParticles([]), 800);
        setTimeout(() => setOpen(false), 2000);
    }

    /* ============================================================
       PARTICLE SPAWNER
    ============================================================ */
    function spawnParticles(type) {
        const burst = [...Array(6)].map((_, i) => ({
            id: Math.random(),
            angle: (i / 6) * Math.PI * 2,
            color: type === "sdg" ? "#FFE680" : "#7bf8ff"
        }));

        setParticles(burst);
    }


    return (
        <div className="absolute right-9 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-auto">

            {/* ⭐ SDG BUTTON (pulse when SDG updates) */}
            <motion.button
                key={`sdg-${sdgPoints}`}   // re-trigger animation
                initial={{ scale: 1 }}
                animate={{
                    scale: [1, 1.25, 1],
                    boxShadow: ["0 0 0px #fff0", "0 0 10px #ffe680", "0 0 0px #fff0"]
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className=" bg-white/10 
        backdrop-blur-md
        border border-white/10 
        shadow-[0px_0px_12px_rgba(255,255,255,0.05)]
        p-3 rounded-xl text-white 
        transition-all 
        hover:bg-white/20
        active:scale-95"
                onClick={() => { setOpen(!open); setTab("sdg"); }}
            >
                <FiStar size={40} />
            </motion.button>

            {/* ⭐ OBJECTIVE BUTTON (pulse when Objective updates) */}
            <motion.button
                key={`obj-${objective.collected}`}  // re-trigger animation
                initial={{ scale: 1 }}
                animate={{
                    scale: [1, 1.25, 1],
                    boxShadow: ["0 0 0px #fff0", "0 0 10px #7bf8ff", "0 0 0px #fff0"]
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="        bg-white/10 
        backdrop-blur-md
        border border-white/10 
        shadow-[0px_0px_12px_rgba(255,255,255,0.05)]
        p-3 rounded-xl text-white 
        transition-all 
        hover:bg-white/20
        active:scale-95"
                onClick={() => { setOpen(!open); setTab("objective"); }}
            >
                <FiTarget size={40} />
            </motion.button>

            {/* ⭐ FLOATING +10 TEXT */}
            {floatingText && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute right-20 text-yellow-300 font-bold text-xl"
                >
                    {floatingText}
                </motion.div>
            )}

            {/* ⭐ PARTICLES */}
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    animate={{
                        opacity: 0,
                        scale: 0.2,
                        x: Math.cos(p.angle) * 25,
                        y: Math.sin(p.angle) * 25,
                    }}
                    transition={{ duration: 0.6 }}
                    className="absolute right-20 w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                />
            ))}

            {/* ⭐ SLIDING PANEL (ALWAYS MOUNTED) */}
            <motion.div
                initial={false}
                animate={{
                    x: open ? 0 : 120,
                    opacity: open ? 1 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 28,
                }}
                className="absolute right-20 top-18 -translate-y-1/2 
                           bg-black/40 backdrop-blur-xl shadow-2xl 
                           rounded-xl p-4 w-72 pointer-events-auto"
                style={{ pointerEvents: open ? "auto" : "none" }}
            >

                {/* ⭐ SDG PANEL */}
                {tab === "sdg" && (
                    <div className="flex flex-col gap-2 w-full">
                        <p className="text-xs text-gray-300 uppercase tracking-wider">
                            SDG Points
                        </p>

                        {/* ⭐ SDG Bar (Animated) */}
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-grow h-3 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={false}
                                    animate={{ width: `${Math.min(sdgPoints, 100)}%` }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 120,
                                        damping: 20
                                    }}
                                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                                />
                            </div>
                            <span className="text-sm font-semibold text-white">
                                {sdgPoints}
                            </span>
                        </div>
                    </div>
                )}

                {/* ⭐ OBJECTIVE PANEL */}
                {tab === "objective" && (
                    <div className="flex flex-col gap-2 w-full">
                        <p className="text-xs text-gray-300 uppercase tracking-wider">
                            Objective
                        </p>

                        {/* ⭐ Objective Bar (Animated) */}
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-grow h-3 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={false}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 120,
                                        damping: 22
                                    }}
                                    className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                                />
                            </div>

                            <span className="text-sm font-semibold text-white">
                                {objective.collected}/{objective.goal}
                            </span>
                        </div>
                    </div>
                )}

            </motion.div>
        </div>
    );
}
