// src/components/GameLoadingScreen.jsx
import { motion } from "framer-motion";

const sdgColors = [
    "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2",
    "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24", "#BF8B2E",
    "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A",
];

export default function GameLoadingScreen() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 text-white">
            <div className="max-w-xl w-full px-6 py-10 rounded-3xl bg-black/40 border border-purple-500/40 shadow-2xl backdrop-blur">
                {/* Title */}
                <div className="flex items-center gap-3 mb-4">
                    <motion.span
                        className="text-3xl"
                        initial={{ rotate: -10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        🌍
                    </motion.span>
                    <div>
                        <h1 className="text-2xl font-bold leading-tight">
                            Preparing SDG Explorer…
                        </h1>
                        <p className="text-sm text-gray-300">
                            Loading campus, NPCs, and your SDG journey.
                        </p>
                    </div>
                </div>

                {/* Animated SDG tiles */}
                <div className="grid grid-cols-6 gap-2 mb-6">
                    {sdgColors.map((color, index) => (
                        <motion.div
                            key={color}
                            className="w-6 h-6 rounded-md"
                            style={{ backgroundColor: color }}
                            initial={{ opacity: 0.2, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: index * 0.03,
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 1.2,
                            }}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                    <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                        <motion.div
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-teal-400"
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{
                                duration: 2.2,
                                ease: "easeInOut",
                                repeat: Infinity,
                            }}
                        />
                    </div>
                </div>

                {/* Loading text */}
                <motion.p
                    className="text-sm text-gray-300 mb-1"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                >
                    Initialising Chapter 1 classroom and hallway…
                </motion.p>
                <p className="text-xs text-gray-400">
                    Tip: Talk to different NPCs and explore hotspots to earn hidden SDG
                    points and badges.
                </p>
            </div>
        </div>
    );
}
