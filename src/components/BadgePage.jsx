// src/pages/BadgePage.jsx
import { useEffect, useMemo, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FiHome,
    FiLock,
    FiCheckCircle,
    FiArrowLeft,
    FiShare2,
    FiTwitter,
    FiLinkedin,
    FiAward,
    FiStar,
    FiFilter,
    FiGrid,
    FiList,
} from "react-icons/fi";
import { BADGES } from "../utils/badges";

// ✅ Category definitions
const CATEGORIES = [
    { key: "all", label: "All", icon: FiGrid },
    { key: "collected", label: "Collected", icon: FiCheckCircle },
    { key: "locked", label: "Locked", icon: FiLock },
];

/** Badge Tile Component */
function BadgeTile({ badge, onClick, shakeActive, reduceMotion, index }) {
    const locked = !badge.collected;
    const Icon = badge.Icon;

    return (
        <m.button
            type="button"
            onClick={onClick}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.4,
                delay: reduceMotion ? 0 : index * 0.03,
                type: "spring",
                stiffness: 300,
                damping: 25,
            }}
            whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={[
                "group relative text-left rounded-2xl p-5",
                "bg-black/50 backdrop-blur-md border",
                locked ? "border-white/5" : "border-white/10",
                "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                "transition-all duration-300 overflow-hidden",
                locked ? "opacity-70 hover:opacity-90" : "opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/30",
            ].join(" ")}
            aria-label={locked ? `Locked badge:  ${badge.name}` : `Open badge: ${badge.name}`}
        >
            {/* Collected glow effect */}
            {!locked && (
                <>
                    {/* Background glow */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle at 50% 0%, ${badge.color}15 0%, transparent 70%)`,
                        }}
                    />

                    {/* Bottom glow line */}
                    <span
                        className="pointer-events-none absolute inset-x-2 bottom-0 h-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${badge.color}, transparent)`,
                            boxShadow: `0 0 12px ${badge.color}, 0 0 24px ${badge.color}80`,
                            filter: "saturate(1.6)",
                        }}
                    />
                </>
            )}

            {/* Corner ribbon for collected */}
            {!locked && (
                <div className="absolute -top-1 -right-1">
                    <div
                        className="w-8 h-8 rounded-bl-xl flex items-end justify-start p-1"
                        style={{ backgroundColor: `${badge.color}30` }}
                    >
                        <FiCheckCircle className="w-3. 5 h-3.5 text-emerald-300" />
                    </div>
                </div>
            )}

            {/* Icon container */}
            <div className="flex items-center justify-center mb-4">
                <div className="relative">
                    {/* Glow behind icon when collected */}
                    {!locked && (
                        <div
                            className="absolute inset-0 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"
                            style={{ backgroundColor: badge.color }}
                        />
                    )}

                    <div
                        className={[
                            "relative w-16 h-16 rounded-2xl border flex items-center justify-center transition-all duration-300",
                            locked
                                ? "bg-black/40 border-white/10"
                                : "bg-black/60 border-white/20 group-hover:border-white/30",
                        ].join(" ")}
                        style={!locked ? {
                            boxShadow: `0 0 20px ${badge.color}20`,
                        } : undefined}
                    >
                        <Icon
                            className={[
                                "w-8 h-8 transition-all duration-300",
                                locked ? "text-white/30" : "text-white/90 group-hover:scale-110",
                            ].join(" ")}
                            style={!locked ? { color: badge.color } : undefined}
                        />

                        {/* Lock overlay */}
                        {locked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                                <FiLock className="w-5 h-5 text-white/40" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Badge info */}
            <div className="text-center">
                <div className={[
                    "text-sm font-semibold leading-tight line-clamp-2 transition-colors",
                    locked ? "text-white/50" : "text-white/90 group-hover:text-white",
                ].join(" ")}>
                    {badge.name}
                </div>

                <div className={[
                    "text-xs mt-1.5 font-medium",
                    locked ? "text-white/30" : "text-emerald-400/80",
                ].join(" ")}>
                    {locked ? "Locked" : "✓ Collected"}
                </div>
            </div>

            {/* Shake animation for locked badges */}
            {shakeActive && (
                <m.div
                    className="absolute inset-0 rounded-2xl border-2 border-red-400/50"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                />
            )}
        </m.button>
    );
}

/** Stat Card */
function StatCard({ icon: Icon, value, label, color }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
            >
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/50">{label}</div>
            </div>
        </div>
    );
}

/** Main Badge Page */
export default function BadgePage() {
    const reduceMotion = useReducedMotion();
    const [selected, setSelected] = useState(null);
    const [shake, setShake] = useState(null);
    const [allBadges, setAllBadges] = useState([]);
    const [filter, setFilter] = useState("all");
    const [isCopied, setIsCopied] = useState(false);

    // Initialize badges and listen for storage changes
    useEffect(() => {
        const updateBadges = () => {
            const savedKeys = JSON.parse(localStorage.getItem("collectedBadges") || "[]");
            const collected = new Set(savedKeys);

            const badges = BADGES.map((badge) => ({
                ...badge,
                collected: collected.has(badge.key),
            }));

            setAllBadges(badges);
        };

        updateBadges();

        window.addEventListener("storage", updateBadges);
        return () => window.removeEventListener("storage", updateBadges);
    }, []);

    // Filter badges
    const filteredBadges = useMemo(() => {
        switch (filter) {
            case "collected":
                return allBadges.filter(b => b.collected);
            case "locked":
                return allBadges.filter(b => !b.collected);
            default:
                return allBadges;
        }
    }, [allBadges, filter]);

    const { collectedCount, totalBadges, progress } = useMemo(() => {
        const collectedCount = allBadges.filter((b) => b.collected).length;
        const totalBadges = allBadges.length || BADGES.length;
        const progress = totalBadges ? (collectedCount / totalBadges) * 100 : 0;
        return { collectedCount, totalBadges, progress };
    }, [allBadges]);

    function handleClick(badge) {
        if (!badge.collected) {
            setShake(badge.key);
            setTimeout(() => setShake(null), 420);
        }
        setIsCopied(false);
        setSelected(badge);
    }

    // ESC to close modal
    useEffect(() => {
        if (!selected) return;
        const onKeyDown = (e) => e.key === "Escape" && setSelected(null);
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selected]);

    // Share logic
    const shareUrl = window.location.origin;
    const shareText = selected
        ? `I just unlocked the "${selected.name}" badge in SDGo! 🏆 #SDGExplorer #Achievement`
        : "";

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Badge Unlocked! ",
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                handleCopyLink();
            }
        } else {
            handleCopyLink();
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        });
    };

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

    const pageEnter = {
        initial: { opacity: 0, y: 14, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen w-full text-white overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 pt-10">
                {/* Ambient glow */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/75" />
                    <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:48px_48px]" />
                </div>

                <div className="max-w-6xl mx-auto px-6 pb-14">
                    {/* Navigation */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            to={-1}
                            className="w-11 h-11 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-center text-white/75 hover:text-white hover:bg-black/70 transition"
                            aria-label="Back"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </Link>

                        <Link
                            to="/"
                            className="w-11 h-11 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-center text-white/75 hover:text-white hover:bg-black/70 transition"
                            aria-label="Home"
                        >
                            <FiHome className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Header */}
                    <m.div {...pageEnter} className="pt-8 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                                        <FiAward className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <span className="text-xs text-white/50 uppercase tracking-[0.2em] font-medium">
                                        Achievements
                                    </span>
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                                    Badge Collection
                                </h1>
                                <p className="text-white/55 mt-3 max-w-xl text-base leading-relaxed">
                                    Unlock achievements by completing objectives and making impactful choices throughout your SDG journey.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-3">
                                <StatCard
                                    icon={FiCheckCircle}
                                    value={collectedCount}
                                    label="Collected"
                                    color="#34D399"
                                />
                                <StatCard
                                    icon={FiStar}
                                    value={`${Math.round(progress)}%`}
                                    label="Complete"
                                    color="#FBBF24"
                                />
                            </div>
                        </div>
                    </m.div>

                    {/* Progress Card */}
                    <m.div
                        {...pageEnter}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className="relative rounded-3xl bg-black/50 backdrop-blur-md border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden"
                    >
                        {/* Top gradient line */}
                        <div className="h-1 bg-gradient-to-r from-emerald-500/60 via-purple-500/60 to-cyan-500/60" />

                        <div className="p-6">
                            {/* Progress bar */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-white/70">
                                            <span className="text-white font-semibold">{collectedCount}</span> of {totalBadges} badges collected
                                        </span>
                                        <span className="text-white/60 font-semibold">{Math.round(progress)}%</span>
                                    </div>

                                    <div className="relative w-full h-4 bg-black/40 rounded-full overflow-hidden">
                                        {/* Background segments */}
                                        <div className="absolute inset-0 flex gap-0.5 p-0.5">
                                            {Array.from({ length: totalBadges }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-full transition-all duration-500 ${i < collectedCount
                                                        ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                                                        : "bg-white/5"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Shimmer effect */}
                                        <m.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                        />
                                    </div>
                                </div>

                                {/* Trophy icon */}
                                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-400/30 items-center justify-center">
                                    <span className="text-2xl">🏆</span>
                                </div>
                            </div>

                            {/* Filter tabs */}
                            <div className="mt-5 flex items-center gap-2">
                                <FiFilter className="w-4 h-4 text-white/40" />
                                <div className="flex gap-1">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.key}
                                            onClick={() => setFilter(cat.key)}
                                            className={[
                                                "px-3 py-1. 5 rounded-lg text-xs font-medium transition-all",
                                                filter === cat.key
                                                    ? "bg-white/10 text-white border border-white/20"
                                                    : "text-white/50 hover:text-white/80 hover:bg-white/5",
                                            ].join(" ")}
                                        >
                                            {cat.label}
                                            {cat.key === "collected" && ` (${collectedCount})`}
                                            {cat.key === "locked" && ` (${totalBadges - collectedCount})`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </m.div>

                    {/* Badge Grid */}
                    <div className="mt-8">
                        {filteredBadges.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filteredBadges.map((b, i) => (
                                    <BadgeTile
                                        key={b.key}
                                        badge={b}
                                        onClick={() => handleClick(b)}
                                        shakeActive={shake === b.key}
                                        reduceMotion={reduceMotion}
                                        index={i}
                                    />
                                ))}
                            </div>
                        ) : (
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                    <FiAward className="w-8 h-8 text-white/30" />
                                </div>
                                <div className="text-lg font-semibold text-white/60">No badges found</div>
                                <div className="text-sm text-white/40 mt-1">
                                    {filter === "collected"
                                        ? "Start playing to earn your first badge!"
                                        : "All badges have been collected! "}
                                </div>
                            </m.div>
                        )}
                    </div>

                    {/* Modal */}
                    <AnimatePresence>
                        {selected && (
                            <m.div
                                className="fixed inset-0 z-50 flex items-center justify-center px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Backdrop */}
                                <m.div
                                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                    onClick={() => setSelected(null)}
                                />

                                {/* Modal content */}
                                <m.div
                                    className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1024]/95 backdrop-blur-xl overflow-hidden shadow-[0_30px_120px_-60px_rgba(0,0,0,0.95)]"
                                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    {/* Top accent */}
                                    <div
                                        className="h-1"
                                        style={{
                                            background: selected.collected
                                                ? `linear-gradient(90deg, transparent, ${selected.color}, transparent)`
                                                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
                                        }}
                                    />

                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                {selected.collected && (
                                                    <div
                                                        className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                                                        style={{ backgroundColor: selected.color }}
                                                    />
                                                )}
                                                <div
                                                    className={[
                                                        "relative w-16 h-16 rounded-2xl border flex items-center justify-center",
                                                        selected.collected
                                                            ? "bg-black/60 border-white/20"
                                                            : "bg-black/40 border-white/10",
                                                    ].join(" ")}
                                                >
                                                    <selected.Icon
                                                        className="w-8 h-8"
                                                        style={{ color: selected.collected ? selected.color : "rgba(255,255,255,0.4)" }}
                                                    />

                                                    {!selected.collected && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                                                            <FiLock className="w-5 h-5 text-white/50" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-white/50 uppercase tracking-wider font-medium">
                                                        Achievement
                                                    </span>
                                                    {selected.collected && (
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-semibold text-emerald-300">
                                                            COLLECTED
                                                        </span>
                                                    )}
                                                </div>
                                                <h2 className="text-2xl font-extrabold mt-1 text-white">
                                                    {selected.name}
                                                </h2>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                                            <div className="text-xs text-white/50 uppercase tracking-wider font-medium mb-2">
                                                Description
                                            </div>
                                            <div className="text-sm text-white/80 leading-relaxed">
                                                {selected.desc}
                                            </div>
                                        </div>

                                        {/* Unlock hint (locked only) */}
                                        {!selected.collected && (
                                            <div className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                                                <div className="flex items-center gap-2 text-xs text-amber-400/80 uppercase tracking-wider font-medium mb-2">
                                                    <FiLock className="w-3. 5 h-3.5" />
                                                    How to unlock
                                                </div>
                                                <div className="text-sm text-white/70 leading-relaxed">
                                                    {selected.unlockHint || "Complete related objectives to unlock this badge."}
                                                </div>
                                            </div>
                                        )}

                                        {/* Share (collected only) */}
                                        {selected.collected && (
                                            <div className="mt-5">
                                                <div className="text-xs text-white/50 uppercase tracking-wider font-medium mb-3">
                                                    Share your achievement
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleNativeShare}
                                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 px-4 text-sm font-semibold transition-all"
                                                    >
                                                        {isCopied ? (
                                                            <>
                                                                <FiCheckCircle className="w-4 h-4" />
                                                                Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiShare2 className="w-4 h-4" />
                                                                Share Badge
                                                            </>
                                                        )}
                                                    </button>

                                                    <a
                                                        href={twitterUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 rounded-xl border border-white/10 bg-white/5 hover:bg-sky-500/20 hover:border-sky-400/30 flex items-center justify-center text-white/60 hover:text-sky-400 transition-all"
                                                    >
                                                        <FiTwitter className="w-5 h-5" />
                                                    </a>

                                                    <a
                                                        href={linkedInUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 rounded-xl border border-white/10 bg-white/5 hover:bg-blue-500/20 hover:border-blue-400/30 flex items-center justify-center text-white/60 hover:text-blue-400 transition-all"
                                                    >
                                                        <FiLinkedin className="w-5 h-5" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Close button */}
                                        <m.button
                                            type="button"
                                            onClick={() => setSelected(null)}
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 text-sm font-semibold text-white/70 hover:text-white transition-all"
                                        >
                                            Close
                                            <span className="ml-2 text-white/40">(Esc)</span>
                                        </m.button>
                                    </div>
                                </m.div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </LazyMotion>
    );
}