// // src/components/GameLoadingScreen.jsx
// import { motion } from "framer-motion";

// const sdgColors = [
//     "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2",
//     "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24", "#BF8B2E",
//     "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A",
// ];

// export default function GameLoadingScreen() {
//     return (
//         <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 text-white">
//             <div className="max-w-xl w-full px-6 py-10 rounded-3xl bg-black/40 border border-purple-500/40 shadow-2xl backdrop-blur">
//                 {/* Title */}
//                 <div className="flex items-center gap-3 mb-4">
//                     <motion.span
//                         className="text-3xl"
//                         initial={{ rotate: -10, scale: 0.9 }}
//                         animate={{ rotate: 0, scale: 1 }}
//                         transition={{ type: "spring", stiffness: 200, damping: 15 }}
//                     >
//                         🌍
//                     </motion.span>
//                     <div>
//                         <h1 className="text-2xl font-bold leading-tight">
//                             Preparing SDG Explorer…
//                         </h1>
//                         <p className="text-sm text-gray-300">
//                             Loading campus, NPCs, and your SDG journey.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Animated SDG tiles */}
//                 <div className="grid grid-cols-6 gap-2 mb-6">
//                     {sdgColors.map((color, index) => (
//                         <motion.div
//                             key={color}
//                             className="w-6 h-6 rounded-md"
//                             style={{ backgroundColor: color }}
//                             initial={{ opacity: 0.2, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{
//                                 delay: index * 0.03,
//                                 repeat: Infinity,
//                                 repeatType: "reverse",
//                                 duration: 1.2,
//                             }}
//                         />
//                     ))}
//                 </div>

//                 {/* Progress bar */}
//                 <div className="mb-3">
//                     <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
//                         <motion.div
//                             className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-teal-400"
//                             initial={{ x: "-100%" }}
//                             animate={{ x: "0%" }}
//                             transition={{
//                                 duration: 2.2,
//                                 ease: "easeInOut",
//                                 repeat: Infinity,
//                             }}
//                         />
//                     </div>
//                 </div>

//                 {/* Loading text */}
//                 <motion.p
//                     className="text-sm text-gray-300 mb-1"
//                     initial={{ opacity: 0.5 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
//                 >
//                     Initialising Chapter 1 classroom and hallway…
//                 </motion.p>
//                 <p className="text-xs text-gray-400">
//                     Tip: Talk to different NPCs and explore hotspots to earn hidden SDG
//                     points and badges.
//                 </p>
//             </div>
//         </div>
//     );
// }



import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const sdgColors = [
    "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2",
    "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24", "#BF8B2E",
    "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A",
];

const loadingMessages = [
    "Initialising Chapter 1: Awareness & Choices…",
    "Syncing NPC dialogues and branching paths…",
    "Mapping SDG impact across campus life…",
    "Preparing consequences for your decisions…",
];

export default function GameLoadingScreen() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-900 text-white">

            {/* Ambient background particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.span
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-white/10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
                        transition={{
                            duration: 6 + Math.random() * 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Main card */}
            <motion.div
                className="relative z-10 max-w-xl w-full mx-6 p-8 rounded-3xl bg-black/45 border border-purple-500/40 shadow-[0_0_60px_rgba(168,85,247,0.25)] backdrop-blur-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Title / Hero */}
                <div className="flex items-center gap-4 mb-6">
                    <motion.div
                        className="relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-full bg-emerald-400/30 blur-2xl"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="relative text-4xl">🌍</span>
                    </motion.div>

                    <div>
                        <h1 className="text-2xl font-bold leading-tight">
                            Preparing SDG Explorer
                        </h1>
                        <p className="text-sm text-gray-300">
                            Building a living campus shaped by your choices.
                        </p>
                    </div>
                </div>

                {/* SDG tiles */}
                <div className="grid grid-cols-6 gap-2 mb-6">
                    {sdgColors.map((color, index) => (
                        <motion.div
                            key={color}
                            className="w-6 h-6 rounded-md"
                            style={{ backgroundColor: color }}
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                y: [0, -4, 0],
                            }}
                            transition={{
                                delay: index * 0.05,
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Progress indicator */}
                <div className="mb-4">
                    <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                        <motion.div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-cyan-400"
                            animate={{ scaleX: [0.25, 1, 0.25] }}
                            transition={{
                                duration: 2.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            style={{ transformOrigin: "left" }}
                        />
                    </div>
                </div>

                {/* Dynamic loading message */}
                <AnimatePresence mode="wait">
                    <motion.p
                        key={messageIndex}
                        className="text-sm text-gray-300 mb-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.4 }}
                    >
                        {loadingMessages[messageIndex]}
                    </motion.p>
                </AnimatePresence>

                {/* Tip */}
                <p className="text-xs text-gray-400">
                    Every conversation changes your SDG impact. Choose wisely.
                </p>
            </motion.div>
        </div>
    );
}
