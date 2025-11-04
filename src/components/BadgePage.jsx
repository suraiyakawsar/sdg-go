import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const badges = [
    { id: 1, name: "No Poverty", color: "#E5243B", desc: "Help eliminate poverty by making conscious choices!", collected: true },
    { id: 2, name: "Zero Hunger", color: "#DDA63A", desc: "Support sustainable food sources and reduce waste.", collected: true },
    { id: 3, name: "Good Health", color: "#4C9F38", desc: "Promote well-being for all ages!", collected: false },
    { id: 4, name: "Quality Education", color: "#C5192D", desc: "Encourage equal learning opportunities for everyone.", collected: false },
    { id: 5, name: "Gender Equality", color: "#FF3A21", desc: "Empower everyone regardless of gender.", collected: true },
    { id: 6, name: "Clean Water", color: "#26BDE2", desc: "Ensure clean water and sanitation for all.", collected: false },
];

export default function BadgePage() {
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [shake, setShake] = useState(null);

    const collectedCount = badges.filter(b => b.collected).length;
    const totalBadges = badges.length;
    const progress = (collectedCount / totalBadges) * 100;

    const handleBadgeClick = (badge) => {
        if (badge.collected) {
            setSelectedBadge(badge);
        } else {
            setShake(badge.id);
            setTimeout(() => setShake(null), 600);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 text-white pt-20">
            <div className="max-w-6xl mx-auto py-10 px-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold">🏅 Your Badges</h1>
                    <Link
                        to="/"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-all shadow-lg shadow-green-500/30"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>{collectedCount}/{totalBadges} badges collected</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                        <motion.div
                            className="h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* Badge Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {badges.map((badge) => (
                        <motion.div
                            key={badge.id}
                            whileHover={{ scale: 1.1 }}
                            animate={
                                shake === badge.id
                                    ? { x: [-10, 10, -10, 10, 0] }
                                    : { x: 0 }
                            }
                            transition={{ duration: 0.5 }}
                            onClick={() => handleBadgeClick(badge)}
                            className={`relative flex flex-col items-center justify-center rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 ${badge.collected
                                ? "bg-gradient-to-br from-purple-600 to-indigo-700 hover:shadow-purple-500/40"
                                : "bg-gray-700 bg-opacity-40 opacity-60 hover:opacity-80"
                                }`}
                        >
                            {/* Glow */}
                            {badge.collected && (
                                <motion.div
                                    className="absolute inset-0 rounded-2xl blur-2xl"
                                    style={{
                                        background: `radial-gradient(circle at center, ${badge.color}55, transparent 70%)`,
                                    }}
                                    animate={{
                                        opacity: [0.4, 0.7, 0.4],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                    }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                className={`w-20 h-20 mb-4 rounded-full border-4 ${badge.collected
                                    ? "border-yellow-400"
                                    : "border-gray-500 opacity-50"
                                    }`}
                                style={{
                                    backgroundColor: badge.collected ? badge.color : "#555",
                                }}
                                whileHover={badge.collected ? { rotate: 10 } : {}}
                                transition={{ type: "spring", stiffness: 200 }}
                            />

                            <p className="font-semibold z-10 text-center">{badge.name}</p>
                            <p
                                className={`text-sm mt-1 z-10 ${badge.collected ? "text-yellow-300" : "text-gray-400 italic"
                                    }`}
                            >
                                {badge.collected ? "Collected!" : "Locked"}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedBadge && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-900 text-white rounded-3xl p-8 max-w-md mx-4 relative shadow-2xl border border-purple-500/40"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span
                                    className="inline-block w-6 h-6 rounded-full"
                                    style={{ backgroundColor: selectedBadge.color }}
                                ></span>
                                {selectedBadge.name}
                            </h2>
                            <p className="text-gray-300 mb-6">{selectedBadge.desc}</p>
                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="w-full bg-purple-700 hover:bg-purple-800 rounded-full py-2 text-white font-semibold transition"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
