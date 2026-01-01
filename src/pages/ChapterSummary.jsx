// src/components/ui/ChapterSummary.jsx
import { useEffect, useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { FiTarget, FiCheckCircle, FiXCircle, FiArrowRight } from "react-icons/fi";
// import { getChapterStats, CHAPTER_INFO } from "../utils/gameSummary";


// ✅ Chapter info
const CHAPTER_INFO = {
    1: { name: "Campus Life", sdgFocus: "Quality Education (SDG 4)" },
    2: { name: "Food Bank", sdgFocus: "Zero Hunger (SDG 2)" },
    3: { name: "Community Garden", sdgFocus: "Life on Land (SDG 15)" },
    4: { name: "Pond & Reflection", sdgFocus: "Clean Water (SDG 6)" },
};


// ✅ Chapter-specific titles based on performance
const CHAPTER_TITLES = [
    { minPoints: 40, minGoodRatio: 0.8, title: "Outstanding", emoji: "⭐", color: "#FFD700" },
    { minPoints: 25, minGoodRatio: 0.6, title: "Great Job", emoji: "🎉", color: "#34D399" },
    { minPoints: 15, minGoodRatio: 0.4, title: "Good Effort", emoji: "👍", color: "#60A5FA" },
    { minPoints: 5, minGoodRatio: 0.2, title: "Room to Grow", emoji: "🌱", color: "#A78BFA" },
    { minPoints: 0, minGoodRatio: 0, title: "Needs Reflection", emoji: "💭", color: "#F87171" },
];

function getChapterTitle(points, goodChoices, badChoices) {
    const totalChoices = goodChoices + badChoices;
    const goodRatio = totalChoices > 0 ? goodChoices / totalChoices : 0;

    for (const tier of CHAPTER_TITLES) {
        if (points >= tier.minPoints && goodRatio >= tier.minGoodRatio) {
            return tier;
        }
    }
    return CHAPTER_TITLES[CHAPTER_TITLES.length - 1];
}

export default function ChapterSummary({ chapterNumber, onContinue }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // ✅ Read SESSION stats (this chapter only)
        const sdgPoints = Number(localStorage.getItem("sessionSDGPoints")) || 0;
        const goodChoices = Number(localStorage.getItem("sessionGoodChoices")) || 0;
        const badChoices = Number(localStorage.getItem("sessionBadChoices")) || 0;

        console.log(`📊 Chapter ${chapterNumber} Summary Stats: `, {
            sdgPoints,
            goodChoices,
            badChoices,
            source: "session counters"
        });

        const chapterTitle = getChapterTitle(sdgPoints, goodChoices, badChoices);

        setStats({
            chapterNumber,
            chapterName: CHAPTER_INFO[chapterNumber]?.name || `Chapter ${chapterNumber}`,
            sdgFocus: CHAPTER_INFO[chapterNumber]?.sdgFocus || "Sustainability",
            sdgPoints,
            goodChoices,
            badChoices,
            totalChoices: goodChoices + badChoices,
            chapterTitle,
        });

        // ✅ Save this chapter's stats to permanent storage
        localStorage.setItem(`chapter${chapterNumber}_sdgPoints`, String(sdgPoints));
        localStorage.setItem(`chapter${chapterNumber}_goodChoices`, String(goodChoices));
        localStorage.setItem(`chapter${chapterNumber}_badChoices`, String(badChoices));
        localStorage.setItem(`chapter${chapterNumber}_completed`, "true");

        console.log(`💾 Saved Chapter ${chapterNumber} stats to permanent storage`);

    }, [chapterNumber]);

    if (!stats) return null;

    const { chapterTitle } = stats;

    return (
        <LazyMotion features={domAnimation}>
            <m.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

                {/* Modal */}
                <m.div
                    className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1024]/95 backdrop-blur-xl overflow-hidden shadow-[0_30px_120px_-60px_rgba(0,0,0,0.95)]"
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    {/* Top accent */}
                    <div
                        className="h-1. 5"
                        style={{ background: `linear-gradient(90deg, transparent, ${chapterTitle.color}, transparent)` }}
                    />

                    <div className="p-6">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <m.div
                                className="text-xs text-white/50 uppercase tracking-[0.2em] font-medium mb-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                Chapter {chapterNumber} Complete
                            </m.div>

                            <m.div
                                className="text-5xl mb-3"
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2 }}
                            >
                                {chapterTitle.emoji}
                            </m.div>

                            <m.h1
                                className="text-3xl font-extrabold mb-1"
                                style={{ color: chapterTitle.color }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {chapterTitle.title}!
                            </m.h1>

                            <m.p
                                className="text-sm text-white/60"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {stats.chapterName}
                            </m.p>
                        </div>

                        {/* Stats */}
                        <m.div
                            className="grid grid-cols-3 gap-3 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <StatBox
                                icon={FiTarget}
                                value={stats.sdgPoints}
                                label="SDG Points"
                                color="#34D399"
                            />
                            <StatBox
                                icon={FiCheckCircle}
                                value={stats.goodChoices}
                                label="Good"
                                color="#60A5FA"
                            />
                            <StatBox
                                icon={FiXCircle}
                                value={stats.badChoices}
                                label="Careless"
                                color="#F87171"
                            />
                        </m.div>

                        {/* SDG Focus */}
                        <m.div
                            className="rounded-xl bg-white/5 border border-white/10 p-4 mb-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                                SDG Focus
                            </div>
                            <div className="text-sm text-white/80 font-medium">
                                {stats.sdgFocus}
                            </div>
                        </m.div>

                        {/* Continue Button */}
                        <m.button
                            onClick={onContinue}
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            {chapterNumber < 4 ? (
                                <>
                                    Continue to Chapter {chapterNumber + 1}
                                    <FiArrowRight className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    See Final Results
                                    <FiArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </m.button>
                    </div>
                </m.div>
            </m.div>
        </LazyMotion>
    );
}

function StatBox({ icon: Icon, value, label, color }) {
    return (
        <div className="rounded-xl bg-black/30 border border-white/10 p-3 text-center">
            <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">{label}</div>
        </div>
    );
}