// src/components/ui/GameSummary. jsx
import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import {
    FiShare2,
    FiDownload,
    FiTwitter,
    FiCheckCircle,
    FiTarget,
    FiAward,
    FiBookOpen,
    FiClock,
    FiUsers,
    FiSearch,
    FiX,
    FiRefreshCw,
} from "react-icons/fi";
import html2canvas from "html2canvas";
import { getGameStats, formatPlayTime, calculateGrade } from "../utils/gameSummary";

export default function GameSummary({ onClose, onPlayAgain }) {
    const [stats, setStats] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const gameStats = getGameStats();
        setStats(gameStats);
    }, []);

    if (!stats) return null;

    const { playerTitle } = stats;
    const gradeInfo = calculateGrade(stats);

    // ✅ Download as image
    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: "#0B1024",
                scale: 2,
                useCORS: true,
            });

            const link = document.createElement("a");
            link.download = `sdg-explorer-${playerTitle.title.toLowerCase().replace(/\s+/g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("Failed to download:", err);
        }

        setIsDownloading(false);
    };

    // ✅ Share
    const shareText = `I just finished SDGo! and earned the title "${playerTitle.title}" ${playerTitle.emoji}!\n\n🎯 ${stats.sdgPoints} SDG Points\n🏆 ${stats.badges} Badges\n📚 ${stats.chaptersCompleted}/${stats.totalChapters} Chapters\n\n#SDGExplorer #Sustainability`;
    const shareUrl = window.location.origin;

    const handleShare = async () => {
        setIsSharing(true);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `SDGo! - ${playerTitle.title}`,
                    text: shareText,
                    url: shareUrl,
                });
            } catch {
                handleCopy();
            }
        } else {
            handleCopy();
        }

        setIsSharing(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

    return (
        <LazyMotion features={domAnimation}>
            <m.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <m.div
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />

                {/* Modal */}
                <m.div
                    className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl"
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition"
                    >
                        <FiX className="w-5 h-5" />
                    </button>

                    {/* ✅ SHAREABLE CARD (this gets captured) */}
                    <div
                        ref={cardRef}
                        className={`relative rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-br ${playerTitle.bgGradient} bg-[#0B1024]`}
                    >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:32px_32px]" />

                        {/* Top accent */}
                        <div
                            className="h-1. 5"
                            style={{ background: `linear-gradient(90deg, transparent, ${playerTitle.color}, transparent)` }}
                        />

                        <div className="relative p-6">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="text-xs text-white/50 uppercase tracking-[0.2em] font-medium mb-2">
                                    Journey Complete
                                </div>

                                {/* Title with emoji */}
                                <m.div
                                    className="text-6xl mb-3"
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                >
                                    {playerTitle.emoji}
                                </m.div>

                                <m.h1
                                    className="text-3xl sm:text-4xl font-extrabold mb-2"
                                    style={{ color: playerTitle.color }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {playerTitle.title}
                                </m.h1>

                                <m.p
                                    className="text-sm text-white/60 max-w-xs mx-auto leading-relaxed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {playerTitle.description}
                                </m.p>

                                {/* Tier badge */}
                                <m.div
                                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider"
                                    style={{
                                        borderColor: `${playerTitle.color}40`,
                                        backgroundColor: `${playerTitle.color}15`,
                                        color: playerTitle.color,
                                    }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {playerTitle.tier} Tier
                                </m.div>
                            </div>

                            {/* Grade */}
                            <m.div
                                className="flex justify-center mb-6"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                            >
                                <div
                                    className="w-20 h-20 rounded-2xl border-2 flex items-center justify-center"
                                    style={{
                                        borderColor: gradeInfo.color,
                                        boxShadow: `0 0 30px ${gradeInfo.color}40`,
                                    }}
                                >
                                    <span
                                        className="text-4xl font-black"
                                        style={{ color: gradeInfo.color }}
                                    >
                                        {gradeInfo.grade}
                                    </span>
                                </div>
                            </m.div>

                            {/* Stats Grid */}
                            <m.div
                                className="grid grid-cols-2 gap-3 mb-6"
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
                                    icon={FiAward}
                                    value={stats.badges}
                                    label="Badges Earned"
                                    color="#FBBF24"
                                />
                                <StatBox
                                    icon={FiBookOpen}
                                    value={`${stats.chaptersCompleted}/${stats.totalChapters}`}
                                    label="Chapters"
                                    color="#60A5FA"
                                />
                                <StatBox
                                    icon={FiCheckCircle}
                                    value={stats.goodChoices}
                                    label="Good Choices"
                                    color="#A78BFA"
                                />
                            </m.div>

                            {/* Choice breakdown */}
                            <m.div
                                className="rounded-2xl bg-black/30 border border-white/10 p-4 mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="text-xs text-white/50 uppercase tracking-wider mb-3">
                                    Choice Breakdown
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-emerald-400">Good Choices</span>
                                            <span className="text-white/60">{stats.goodChoices}</span>
                                        </div>
                                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-400 rounded-full transition-all"
                                                style={{
                                                    width: stats.totalChoices > 0
                                                        ? `${(stats.goodChoices / stats.totalChoices) * 100}%`
                                                        : "0%"
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-red-400">Careless Choices</span>
                                            <span className="text-white/60">{stats.badChoices}</span>
                                        </div>
                                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red-400 rounded-full transition-all"
                                                style={{
                                                    width: stats.totalChoices > 0
                                                        ? `${(stats.badChoices / stats.totalChoices) * 100}%`
                                                        : "0%"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </m.div>

                            {/* Extra stats row */}
                            {(stats.playTimeSeconds > 0 || stats.npcsTalkedTo > 0) && (
                                <m.div
                                    className="flex items-center justify-center gap-6 text-xs text-white/50 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    {stats.playTimeSeconds > 0 && (
                                        <div className="flex items-center gap-1. 5">
                                            <FiClock className="w-3. 5 h-3.5" />
                                            <span>{formatPlayTime(stats.playTimeSeconds)}</span>
                                        </div>
                                    )}
                                    {stats.npcsTalkedTo > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <FiUsers className="w-3.5 h-3.5" />
                                            <span>{stats.npcsTalkedTo} NPCs</span>
                                        </div>
                                    )}
                                    {stats.objectsInspected > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <FiSearch className="w-3.5 h-3.5" />
                                            <span>{stats.objectsInspected} inspected</span>
                                        </div>
                                    )}
                                </m.div>
                            )}

                            {/* Watermark */}
                            <div className="text-center text-[10px] text-white/30 uppercase tracking-widest">
                                SDGo! • {new Date().getFullYear()}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons (outside the card so they don't get captured) */}
                    <m.div
                        className="mt-4 flex gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        {/* Share */}
                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-all disabled:opacity-50"
                        >
                            {isCopied ? (
                                <>
                                    <FiCheckCircle className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <FiShare2 className="w-4 h-4" />
                                    Share
                                </>
                            )}
                        </button>

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 text-white font-semibold transition-all disabled:opacity-50"
                        >
                            <FiDownload className="w-4 h-4" />
                            {isDownloading ? "..." : "Save"}
                        </button>

                        {/* Twitter */}
                        <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-12 rounded-xl bg-white/10 border border-white/10 hover:bg-sky-500/20 hover:border-sky-400/30 text-white/70 hover:text-sky-400 transition-all"
                        >
                            <FiTwitter className="w-5 h-5" />
                        </a>
                    </m.div>

                    {/* Play again */}
                    {onPlayAgain && (
                        <m.button
                            onClick={onPlayAgain}
                            className="mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <FiRefreshCw className="w-4 h-4" />
                            Play Again
                        </m.button>
                    )}
                </m.div>
            </m.div>
        </LazyMotion>
    );
}

// ✅ Stat box component
function StatBox({ icon: Icon, value, label, color }) {
    return (
        <div className="rounded-xl bg-black/30 border border-white/10 p-3 text-center">
            <div
                className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
            >
                <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">{label}</div>
        </div>
    );
}