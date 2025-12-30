import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const sdgData = [
    { id: 1, color: "#E5243B", name: "No Poverty" },
    { id: 2, color: "#DDA63A", name: "Zero Hunger" },
    { id: 3, color: "#4C9F38", name: "Good Health" },
    { id: 4, color: "#C5192D", name: "Quality Education" },
    { id: 5, color: "#FF3A21", name: "Gender Equality" },
    { id: 6, color: "#26BDE2", name: "Clean Water" },
    { id: 7, color: "#FCC30B", name: "Affordable Energy" },
    { id: 8, color: "#A21942", name: "Decent Work" },
    { id: 9, color: "#FD6925", name: "Industry & Innovation" },
    { id: 10, color: "#DD1367", name: "Reduced Inequality" },
    { id: 11, color: "#FD9D24", name: "Sustainable Cities" },
    { id: 12, color: "#BF8B2E", name: "Responsible Consumption" },
    { id: 13, color: "#3F7E44", name: "Climate Action" },
    { id: 14, color: "#0A97D9", name: "Life Below Water" },
    { id: 15, color: "#56C02B", name: "Life on Land" },
    { id: 16, color: "#00689D", name: "Peace & Justice" },
    { id: 17, color: "#19486A", name: "Partnerships" },
];

const loadingStages = [
    { message: "Initializing campus environment...", icon: "🏫", progress: 15 },
    { message: "Loading NPC dialogues and stories...", icon: "💬", progress: 35 },
    { message: "Mapping SDG impact systems...", icon: "🎯", progress: 55 },
    { message: "Preparing branching narratives...", icon: "🌿", progress: 75 },
    { message: "Syncing your choices with consequences...", icon: "⚡", progress: 90 },
    { message: "Almost ready.. .", icon: "✨", progress: 100 },
];

const tips = [
    "💡 Every conversation shapes your SDG impact",
    "💡 Explore hidden areas for bonus points",
    "💡 Your choices unlock different endings",
    "💡 Talk to everyone — secrets await",
    "💡 Check the sidebar to track progress",
];

export default function GameLoadingScreen() {
    const [stageIndex, setStageIndex] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [highlightedSDG, setHighlightedSDG] = useState(null);

    // Cycle through loading stages
    useEffect(() => {
        const interval = setInterval(() => {
            setStageIndex((prev) => {
                if (prev < loadingStages.length - 1) return prev + 1;
                return prev;
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    // Cycle through tips
    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % tips.length);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    // Highlight random SDGs
    useEffect(() => {
        const interval = setInterval(() => {
            setHighlightedSDG(Math.floor(Math.random() * 17));
        }, 800);

        return () => clearInterval(interval);
    }, []);

    const currentStage = loadingStages[stageIndex];

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0a0a12] text-white">

            {/* Animated gradient background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -inset-[100px] opacity-30"
                    style={{
                        background: "radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(52, 211, 153, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 60%)",
                    }}
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 120,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 4 + 2,
                            height: Math.random() * 4 + 2,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`,
                        }}
                        animate={{
                            y: [0, -30 - Math.random() * 20, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Main content */}
            <motion.div
                className="relative z-10 max-w-2xl w-full mx-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Card container */}
                <div className="relative rounded-3xl overflow-hidden">
                    {/* Card glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-emerald-500/20 to-cyan-500/20 rounded-3xl blur-xl" />

                    {/* Card content */}
                    <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">

                        {/* Top accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-emerald-400 to-cyan-400" />

                        {/* Header */}
                        <div className="flex items-center gap-5 mb-8">
                            <motion.div
                                className="relative"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                            >
                                {/* Pulsing glow behind globe */}
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-emerald-400/40 blur-2xl"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.4, 0.7, 0.4],
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                />

                                {/* Globe container */}
                                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 flex items-center justify-center">
                                    <motion.span
                                        className="text-4xl"
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        🌍
                                    </motion.span>
                                </div>
                            </motion.div>

                            <div className="flex-1">
                                <motion.h1
                                    className="text-3xl font-extrabold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    SDG Explorer
                                </motion.h1>
                                <motion.p
                                    className="text-base text-white/60 mt-1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    A living campus shaped by your choices
                                </motion.p>
                            </div>

                            {/* Loading spinner */}
                            <motion.div
                                className="w-10 h-10 rounded-full border-2 border-white/10 border-t-emerald-400"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* SDG Grid */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Loading SDG Systems
                                </span>
                                <span className="text-xs text-white/40">
                                    {Math.min(stageIndex + 1, 17)}/17 Goals
                                </span>
                            </div>

                            <div className="grid grid-cols-17 gap-1.5">
                                {sdgData.map((sdg, index) => (
                                    <motion.div
                                        key={sdg.id}
                                        className="relative aspect-square rounded-lg cursor-default group"
                                        style={{ backgroundColor: sdg.color }}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: 1,
                                            opacity: index <= stageIndex * 3 ? 1 : 0.2,
                                        }}
                                        transition={{
                                            delay: index * 0.03,
                                            duration: 0.3,
                                            type: "spring",
                                            bounce: 0.4,
                                        }}
                                        whileHover={{ scale: 1.15, zIndex: 10 }}
                                    >
                                        {/* Highlight effect */}
                                        {highlightedSDG === index && (
                                            <motion.div
                                                className="absolute inset-0 rounded-lg"
                                                style={{
                                                    boxShadow: `0 0 20px ${sdg.color}, 0 0 40px ${sdg.color}50`,
                                                }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}

                                        {/* SDG number */}
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90 opacity-0 transition-opacity">
                                            {sdg.id}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="mb-6">
                            {/* Progress bar */}
                            <div className="relative h-3 rounded-full bg-white/5 overflow-hidden mb-4">
                                {/* Shimmer effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                />

                                {/* Progress fill */}
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-purple-500 via-emerald-400 to-cyan-400"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${currentStage.progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>

                            {/* Loading message */}
                            <div className="flex items-center justify-between">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={stageIndex}
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <span className="text-xl">{currentStage.icon}</span>
                                        <span className="text-sm text-white/70">{currentStage.message}</span>
                                    </motion.div>
                                </AnimatePresence>

                                <span className="text-sm font-semibold text-white/80">
                                    {currentStage.progress}%
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                        {/* Tips section */}
                        <div className="flex items-center justify-between">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={tipIndex}
                                    className="text-sm text-white/50"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {tips[tipIndex]}
                                </motion.p>
                            </AnimatePresence>

                            {/* Dots indicator */}
                            <div className="flex gap-1. 5">
                                {tips.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1. 5 h-1.5 rounded-full transition-all duration-300 ${i === tipIndex ? "bg-emerald-400 w-4" : "bg-white/20"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom text */}
                <motion.p
                    className="text-center text-xs text-white/30 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Your journey toward sustainable impact begins now
                </motion.p>
            </motion.div>
        </div>
    );
}