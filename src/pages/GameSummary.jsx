// src/pages/GameSummary.jsx
import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
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
    const downloadCardRef = useRef(null);

    useEffect(() => {
        const gameStats = getGameStats();
        setStats(gameStats);
    }, []);

    if (!stats) return null;

    const { playerTitle } = stats;
    const gradeInfo = calculateGrade(stats);

    // ✅ Download as image
    const handleDownload = async () => {
        if (!downloadCardRef.current) {
            console.error("Download card ref not found");
            return;
        }

        setIsDownloading(true);

        try {
            const canvas = await html2canvas(downloadCardRef.current, {
                backgroundColor: "#0B1024",
                scale: 2,
                logging: false,
            });

            const link = document.createElement("a");
            link.download = `sdgo-${playerTitle.title.toLowerCase().replace(/\s+/g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Failed to download:", err);
        }

        setIsDownloading(false);
    };


    // ✅ Share
    const shareText = `I just finished SDGo! and earned the title "${playerTitle.title}" ${playerTitle.emoji}!\n\n🎯 ${stats.sdgPoints} SDG Points\n🏆 ${stats.badges} Badges\n📚 ${stats.chaptersCompleted}/${stats.totalChapters} Chapters\n\n#SDGo #Sustainability`;
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

            {/* Hidden card for download - simple, no emoji */}
            <div
                ref={downloadCardRef}
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                    width: '700px',
                    backgroundColor: '#0B1024',
                    borderRadius: '24px',
                    fontFamily: 'Arial, sans-serif',
                    overflow: 'hidden',
                }}
            >
                {/* Top accent bar */}
                <div style={{
                    height: '4px',
                    background: `linear-gradient(90deg, transparent, ${playerTitle.color}, transparent)`,
                }} />

                <div style={{ padding: '32px', textAlign: 'center' }}>

                    {/* Header text */}
                    <div style={{
                        fontSize: '11px',
                        color: '#888888',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        marginBottom: '16px',
                    }}>
                        Journey Complete
                    </div>

                    {/* Title */}
                    <div style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: playerTitle.color,
                        marginBottom: '8px',
                    }}>
                        {playerTitle.title}
                    </div>

                    {/* Description */}
                    <div style={{
                        fontSize: '14px',
                        color: '#aaaaaa',
                        maxWidth: '350px',
                        margin: '0 auto 16px auto',
                        lineHeight: '1.5',
                    }}>
                        {playerTitle.description}
                    </div>

                    {/* Tier badge */}
                    <div style={{
                        display: 'inline-block',
                        padding: '9px',
                        borderRadius: '20px',
                        border: `2px solid ${playerTitle.color}`,
                        color: playerTitle.color,
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '24px',
                        minHeight: '20px',
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>
                        {playerTitle.tier} Tier
                    </div>

                    {/* Grade circle */}
                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '16px',
                        border: `3px solid ${gradeInfo.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px auto',

                    }}>
                        <span style={{
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: gradeInfo.color,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '9px',

                        }}>
                            {gradeInfo.grade}
                        </span>
                    </div>

                    {/* Stats row */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '24px',
                    }}>
                        <DownloadStatBox label="SDG Points" value={stats.sdgPoints} color="#34D399" />
                        <DownloadStatBox label="Badges" value={stats.badges} color="#FBBF24" />
                        <DownloadStatBox label="Chapters" value={`${stats.chaptersCompleted}/${stats.totalChapters}`} color="#60A5FA" />
                        <DownloadStatBox label="Good Choices" value={stats.goodChoices} color="#A78BFA" />
                    </div>

                    {/* Watermark */}
                    <div style={{
                        fontSize: '10px',
                        color: '#555555',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                    }}>
                        SDGo!  - {new Date().getFullYear()}
                    </div>
                </div>
            </div>


            <m.div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <m.div
                    className="absolute inset-0 bg-black/90 backdrop-blur-md z-[100]"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />

                {/* Modal - HORIZONTAL RECTANGLE LAYOUT */}
                <m.div
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl z-[101]"
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    {/* Close button
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition"
                    >
                        <FiX className="w-5 h-5" />
                    </button> */}

                    {/* ✅ SHAREABLE CARD - HORIZONTAL LAYOUT */}
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
                            {/* ✅ HORIZONTAL GRID:  Left (Title/Grade) + Right (Stats) */}
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6">

                                {/* LEFT COLUMN - Title, Emoji, Grade */}
                                <div className="flex flex-col items-center justify-center text-center">
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
                                        className="text-2xl sm:text-3xl font-extrabold mb-2"
                                        style={{ color: playerTitle.color }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {playerTitle.title}
                                    </m.h1>

                                    <m.p
                                        className="text-sm text-white/60 max-w-xs mx-auto leading-relaxed mb-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {playerTitle.description}
                                    </m.p>

                                    {/* Tier badge */}
                                    <m.div
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4"
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

                                    {/* Grade */}
                                    <m.div
                                        className="flex justify-center"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4, type: "spring" }}
                                    >
                                        <div
                                            className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center"
                                            style={{
                                                borderColor: gradeInfo.color,
                                                boxShadow: `0 0 30px ${gradeInfo.color}40`,
                                            }}
                                        >
                                            <span
                                                className="text-3xl font-black"
                                                style={{ color: gradeInfo.color }}
                                            >
                                                {gradeInfo.grade}
                                            </span>
                                        </div>
                                    </m.div>
                                </div>

                                {/* RIGHT COLUMN - Stats Grid + Choice Breakdown */}
                                <div className="flex flex-col justify-center">
                                    {/* Stats Grid - 2x2 */}
                                    <m.div
                                        className="grid grid-cols-2 gap-3 mb-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <StatBoxSimple
                                            icon={FiTarget}
                                            value={stats.sdgPoints}
                                            label="SDG Points"
                                            color="#34D399"
                                        />
                                        <StatBoxSimple
                                            icon={FiAward}
                                            value={stats.badges}
                                            label="Badges Earned"
                                            color="#FBBF24"
                                        />
                                        <StatBoxSimple
                                            icon={FiBookOpen}
                                            value={`${stats.chaptersCompleted}/${stats.totalChapters}`}
                                            label="Chapters"
                                            color="#60A5FA"
                                        />
                                        <StatBoxSimple
                                            icon={FiCheckCircle}
                                            value={stats.goodChoices}
                                            label="Good Choices"
                                            color="#A78BFA"
                                        />
                                    </m.div>

                                    {/* Choice breakdown */}
                                    <m.div
                                        className="rounded-2xl bg-black/30 border border-white/10 p-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <div className="text-xs text-white/50 uppercase tracking-wider mb-3">
                                            Choice Breakdown
                                        </div>
                                        <div className="flex items-center gap-4">
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
                                            className="flex items-center justify-center gap-6 text-xs text-white/50 mt-4"
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
                                </div>
                            </div>

                            {/* Watermark */}
                            <div className="text-center text-[10px] text-white/30 uppercase tracking-widest mt-4">
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
        </LazyMotion >
    );
}

function DownloadStatBox({ label, value, color }) {
    return (
        <div style={{
            backgroundColor: '#1a1a2e',
            border: '1px solid #333344',
            borderRadius: '12px',
            // padding: '16px 20px',
            textAlign: 'center',
            minWidth: '100px',
            minHeight: '80px',
        }}>
            <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: color,
            }}>
                {value}
            </div>
            <div style={{
                fontSize: '9px',
                color: '#888888',
                textTransform: 'uppercase',
                marginTop: '4px',
                letterSpacing: '0.5px',
            }}>
                {label}
            </div>
        </div>
    );
}
// ✅ Stat box component
// Simple stat box component using inline styles (no Tailwind)
function StatBoxSimple({ label, value, color }) {
    return (
        <div style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '16px 12px',
            textAlign: 'center',
        }}>
            <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'white',
                margin: 0,
                lineHeight: 1,
            }}>
                {value}
            </div>
            <div style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                marginTop: '4px',
                letterSpacing: '0.05em',
            }}>
                {label}
            </div>
        </div>
    );
}