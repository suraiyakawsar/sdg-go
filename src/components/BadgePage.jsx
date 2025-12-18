// src/pages/BadgePage.jsx
import { useEffect, useMemo, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FiHome,
    FiLock,
    FiCheckCircle,
    FiAward,
    FiDollarSign,
    FiCoffee,
    FiActivity,
    FiBookOpen,
    FiUserCheck,
    FiDroplet,
    FiZap,
    FiBriefcase,
    FiCpu,
    FiUsers,
    FiHome as FiCity,
    FiShoppingBag,
    FiWind,
    FiAnchor,
    FiFeather,
    FiShield,
    FiLink2,
    FiTarget,
    FiHeart,
    FiTrendingUp,
    FiStar,
    FiCompass,
    FiTool,
    FiArrowLeft
} from "react-icons/fi";

/** ------------------------------
 *  BADGE DATA (SDG 1–17 + extras)
 *  - Uses react-icons only (no images -> no path issues)
 *  - Every badge ALWAYS has Icon (safe)
 --------------------------------*/
const SDGS = [
    { id: 1, name: "No Poverty", color: "#E5243B", Icon: FiDollarSign, desc: "Support access to essentials and connect people to real help.", unlockHint: "Make a supportive choice for someone struggling and complete the chapter." },
    { id: 2, name: "Zero Hunger", color: "#DDA63A", Icon: FiCoffee, desc: "Reduce food waste and support responsible distribution.", unlockHint: "Pick the no-waste option and finish the cafeteria objective." },
    { id: 3, name: "Good Health", color: "#4C9F38", Icon: FiActivity, desc: "Promote wellbeing—physical and mental health choices matter.", unlockHint: "Recommend safe coping steps or support options in dialogue." },
    { id: 4, name: "Quality Education", color: "#C5192D", Icon: FiBookOpen, desc: "Help others learn and share knowledge fairly.", unlockHint: "Tutor an NPC or share resources instead of gatekeeping." },
    { id: 5, name: "Gender Equality", color: "#FF3A21", Icon: FiUserCheck, desc: "Support fairness, respect, and equal opportunity daily.", unlockHint: "Speak up constructively in a fairness conflict." },
    { id: 6, name: "Clean Water", color: "#26BDE2", Icon: FiDroplet, desc: "Save water and report waste/leaks when you notice them.", unlockHint: "Interact with water-waste hotspots and report/fix them." },
    { id: 7, name: "Affordable Energy", color: "#FCC30B", Icon: FiZap, desc: "Use energy smarter: switch off, unplug, and optimize habits.", unlockHint: "Complete an energy audit objective (spot 3 waste points)." },
    { id: 8, name: "Decent Work", color: "#A21942", Icon: FiBriefcase, desc: "Know rights, reject exploitation, support ethical work.", unlockHint: "Guide an NPC away from a sketchy internship/job offer." },
    { id: 9, name: "Industry & Innovation", color: "#FD6925", Icon: FiCpu, desc: "Build solutions for real problems—not just trends.", unlockHint: "Propose a practical campus improvement in dialogue." },
    { id: 10, name: "Reduced Inequality", color: "#DD1367", Icon: FiUsers, desc: "Remove barriers: inclusion, accessibility, and fair opportunity.", unlockHint: "Pick accessibility-first options in a design decision moment." },
    { id: 11, name: "Sustainable Cities", color: "#FD9D24", Icon: FiCity, desc: "Care for shared spaces, safety, transport, and community.", unlockHint: "Choose responsible routes/actions that benefit everyone." },
    { id: 12, name: "Responsible Consumption", color: "#BF8B2E", Icon: FiShoppingBag, desc: "Buy less, reuse more, repair first, choose quality.", unlockHint: "Choose repair/reuse instead of buying new." },
    { id: 13, name: "Climate Action", color: "#3F7E44", Icon: FiWind, desc: "Lower impact habits and influence others through action.", unlockHint: "Organise/join a low-waste or low-carbon action in-game." },
    { id: 14, name: "Life Below Water", color: "#0A97D9", Icon: FiAnchor, desc: "Cut plastics and dispose waste properly—protect oceans.", unlockHint: "Choose proper disposal options consistently in a chapter." },
    { id: 15, name: "Life on Land", color: "#56C02B", Icon: FiFeather, desc: "Protect biodiversity and respect habitats.", unlockHint: "Restore a green area with biodiversity-friendly choices." },
    { id: 16, name: "Peace & Justice", color: "#00689D", Icon: FiShield, desc: "De-escalate conflict and support fairness and safety.", unlockHint: "Pick calm, evidence-based options in a conflict chain." },
    { id: 17, name: "Partnerships", color: "#19486A", Icon: FiLink2, desc: "Collaboration wins—coordinate roles and build momentum.", unlockHint: "Recruit NPCs and delegate roles to complete a mission." },
];

const EXTRA_BADGES = [
    { key: "special-mentor", name: "Mentor", color: "#A855F7", Icon: FiBookOpen, desc: "Help an NPC understand step-by-step without gatekeeping.", unlockHint: "Choose the tutoring/support option in a chapter." },
    { key: "special-kind-heart", name: "Kind Heart", color: "#FB7185", Icon: FiHeart, desc: "Choose empathy even when it’s inconvenient.", unlockHint: "Pick empathy choices in 3 different scenes." },
    { key: "special-objective-hunter", name: "Objective Hunter", color: "#F59E0B", Icon: FiTarget, desc: "Complete every objective in a chapter (no skipping).", unlockHint: "Finish all objectives before leaving the chapter." },
    { key: "special-momentum", name: "Momentum", color: "#34D399", Icon: FiTrendingUp, desc: "Stack consistent progress across sessions.", unlockHint: "Play across 3 separate sessions." },
    { key: "special-explorer", name: "Explorer", color: "#60A5FA", Icon: FiCompass, desc: "Inspect optional hotspots and talk to extra NPCs.", unlockHint: "Interact with 5 optional hotspots in one chapter." },
    { key: "special-fixer", name: "Fixer", color: "#22D3EE", Icon: FiTool, desc: "Solve problems instead of walking away.", unlockHint: "Fix/report 3 issues (leaks, waste, conflicts) across chapters." },
    { key: "special-ace", name: "Eco Ace", color: "#FBBF24", Icon: FiStar, desc: "Finish a chapter with strong choices (no major negatives).", unlockHint: "Complete a chapter with 0 negative point choices." },
    { key: "special-collector", name: "Collector", color: "#E879F9", Icon: FiAward, desc: "Unlock a high number of badges.", unlockHint: "Collect 10+ badges." },
];

// Demo collected set — swap later with real save data
const COLLECTED_KEYS = new Set([
    "sdg-1", "sdg-2", "sdg-5", "sdg-9", "sdg-13", "sdg-16",
    "special-mentor", "special-objective-hunter", "special-explorer"
]);

const ALL_BADGES = [
    ...SDGS.map((g) => ({
        key: `sdg-${g.id}`,
        type: "sdg",
        id: g.id,
        name: `SDG ${g.id}: ${g.name}`,
        color: g.color,
        Icon: g.Icon || FiAward,
        desc: g.desc,
        unlockHint: g.unlockHint,
        collected: COLLECTED_KEYS.has(`sdg-${g.id}`),
    })),
    ...EXTRA_BADGES.map((b) => ({
        ...b,
        type: "special",
        Icon: b.Icon || FiAward,
        collected: COLLECTED_KEYS.has(b.key),
    })),
];

/** ------------------------------
 *  UI Components
 --------------------------------*/
function BadgeTile({ badge, onClick, shakeActive, reduceMotion }) {
    const locked = !badge.collected;
    const Icon = badge.Icon || FiAward;

    return (
        <m.button
            type="button"
            onClick={onClick}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            whileTap={{ scale: 0.98 }}
            animate={shakeActive ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
            className={[
                "group relative text-left rounded-2xl p-4",
                "bg-black/60 backdrop-blur-md border border-white/10",
                "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                "transition overflow-hidden",
                locked ? "opacity-80" : "opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/25",
            ].join(" ")}
            aria-label={locked ? `Locked badge: ${badge.name}` : `Open badge: ${badge.name}`}
        >
            {/* Bottom glow ONLY when collected */}
            {!locked && (
                <span
                    className="pointer-events-none absolute inset-x-1 bottom-0 h-[3px] opacity-0 group-hover:opacity-100 transition"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${badge.color}, transparent)`,
                        boxShadow: `0 0 10px ${badge.color}, 0 0 22px ${badge.color}CC, 0 0 46px ${badge.color}99`,
                        filter: "saturate(1.8)",
                    }}
                />
            )}

            {/* Top row */}
            <div className="flex items-center justify-between">
                <div className="text-xs text-white/60 font-medium">
                    {badge.type === "sdg" ? "SDG" : "Special"}
                </div>

                <div className="text-xs text-white/55 font-semibold flex items-center gap-2">
                    {badge.type === "sdg" ? badge.id : null}
                    {locked ? (
                        <FiLock className="w-3.5 h-3.5 text-white/45" />
                    ) : (
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-300/80" />
                    )}
                </div>
            </div>

            {/* Icon chip */}
            <div className="mt-3 flex items-center justify-center">
                <div
                    className={[
                        "w-14 h-14 rounded-2xl bg-black/40 border border-white/10",
                        "flex items-center justify-center",
                        locked ? "opacity-55" : "opacity-100",
                    ].join(" ")}
                >
                    <Icon className={locked ? "w-7 h-7 text-white/45" : "w-7 h-7 text-white/85"} />
                </div>
            </div>

            {/* Text */}
            <div className="mt-3">
                <div className="text-sm font-semibold text-white/90 leading-snug line-clamp-2">
                    {badge.name}
                </div>
                <div className={locked ? "text-xs text-white/45 mt-1 italic" : "text-xs text-emerald-200/90 mt-1"}>
                    {locked ? "Locked" : "Collected"}
                </div>
            </div>

            {/* Subtle hover wash */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(70%_70%_at_50%_0%,rgba(168,85,247,0.14),transparent_65%)]" />
        </m.button>
    );
}

/** ------------------------------
 *  Page
 --------------------------------*/
export default function BadgePage() {
    const reduceMotion = useReducedMotion();
    const [selected, setSelected] = useState(null);
    const [shake, setShake] = useState(null);

    const { collectedCount, totalBadges, progress } = useMemo(() => {
        const collectedCount = ALL_BADGES.filter((b) => b.collected).length;
        const totalBadges = ALL_BADGES.length;
        const progress = totalBadges ? (collectedCount / totalBadges) * 100 : 0;
        return { collectedCount, totalBadges, progress };
    }, []);

    function handleClick(badge) {
        if (!badge.collected) {
            setShake(badge.key);
            setTimeout(() => setShake(null), 420);
        }
        setSelected(badge);
    }

    // ESC to close modal
    useEffect(() => {
        if (!selected) return;
        const onKeyDown = (e) => e.key === "Escape" && setSelected(null);
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selected]);

    const pageEnter = {
        initial: { opacity: 0, y: 14, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
    };

    const selectedIcon = selected?.Icon || FiAward;

    return (
        <LazyMotion features={domAnimation}>

            <div className="min-h-screen w-screen text-white overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 pt-10">
                {/* Ambient glow like GameLayout */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/75" />
                    <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:48px_48px]" />
                </div>


                <div className="max-w-6xl mx-auto px-6 pb-14">

                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            to={-1}
                            className={[
                                "w-11 h-11 rounded-2xl",
                                "bg-black/60 backdrop-blur-md border border-white/10",
                                "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                                "flex items-center justify-center",
                                "text-white/75 hover:text-white transition",
                                "focus:outline-none focus:ring-2 focus:ring-purple-500/25",
                            ].join(" ")}
                            aria-label="Back"
                            title="Back"
                        >
                            <FiArrowLeft className="w-5 h-5 text-emerald-200" />
                        </Link>

                        <Link
                            to="/"
                            className={[
                                "w-11 h-11 rounded-2xl",
                                "bg-black/60 backdrop-blur-md border border-white/10",
                                "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                                "flex items-center justify-center",
                                "text-white/75 hover:text-white transition",
                                "focus:outline-none focus:ring-2 focus:ring-purple-500/25",
                            ].join(" ")}
                            aria-label="Home"
                            title="Home"
                        >
                            <FiHome className="w-5 h-5 text-emerald-200" />
                        </Link>
                    </div>


                    {/* Header row (Home button here; no overlap) */}
                    <m.div {...pageEnter} className="pt-6 mb-6 flex items-start justify-between gap-4">
                        <div>
                            <div className="text-xs text-white/55 uppercase tracking-[0.18em]">Achievements</div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Badges</h1>
                            <p className="text-white/65 mt-2">
                                SDG badges + special playstyle badges. Click any badge for details.
                            </p>
                        </div>


                    </m.div>

                    {/* Progress shell */}
                    <m.div
                        {...pageEnter}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className={[
                            "rounded-3xl",
                            "bg-black/60 backdrop-blur-md border border-white/10",
                            "shadow-[0_25px_80px_rgba(0,0,0,0.85)]",
                            "overflow-hidden",
                        ].join(" ")}
                    >
                        <div className="h-px bg-gradient-to-r from-purple-400/35 via-emerald-300/25 to-cyan-300/35" />
                        <div className="p-5 sm:p-6">
                            <div className="flex items-center justify-between text-sm text-white/70 mb-3">
                                <span>
                                    <span className="text-white/90 font-semibold">{collectedCount}</span>/{totalBadges} collected
                                </span>
                                <span className="text-white/60 font-semibold">{Math.round(progress)}%</span>
                            </div>

                            <div className="w-full bg-gray-800/80 rounded-full h-3 overflow-hidden">
                                <m.div
                                    className="h-3 rounded-full bg-gradient-to-r from-emerald-400/70 via-purple-400/55 to-cyan-300/60"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeInOut" }}
                                />
                            </div>

                            <div className="text-[11px] text-white/45 mt-2">
                                Locked badges still open — you’ll see “How to unlock”.
                            </div>
                        </div>
                    </m.div>

                    {/* Badge Grid */}
                    <m.div
                        {...pageEnter}
                        transition={{ duration: 0.45, delay: 0.08 }}
                        className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        {ALL_BADGES.map((b) => (
                            <BadgeTile
                                key={b.key}
                                badge={b}
                                onClick={() => handleClick(b)}
                                shakeActive={shake === b.key}
                                reduceMotion={reduceMotion}
                            />
                        ))}
                    </m.div>

                    {/* Modal */}
                    <AnimatePresence>
                        {selected && (
                            <m.div
                                className="fixed inset-0 z-50 flex items-center justify-center px-5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                aria-modal="true"
                                role="dialog"
                            >
                                <m.button
                                    type="button"
                                    className="absolute inset-0 bg-black/70"
                                    onClick={() => setSelected(null)}
                                    aria-label="Close badge modal"
                                />

                                <m.div
                                    className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0B1024]/95 backdrop-blur-xl p-6 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.95)]"
                                    initial={{ scale: 0.98, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
                                    exit={{ scale: 0.98, opacity: 0, transition: { duration: 0.15 } }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="text-xs text-white/50 font-semibold mb-1">
                                                {selected.type === "sdg" ? `SDG ${selected.id}` : "Special Badge"}
                                            </div>
                                            <h2 className="text-2xl font-extrabold tracking-tight">{selected.name}</h2>
                                        </div>

                                        <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
                                            <selectedIcon className="w-7 h-7 text-white/85" />
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="text-sm font-semibold text-white/90">Description</div>
                                        <div className="text-sm text-white/70 mt-1 leading-relaxed">{selected.desc}</div>
                                    </div>

                                    {!selected.collected && (
                                        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                            <div className="text-sm font-semibold text-white/90 flex items-center gap-2">
                                                <FiLock className="w-4 h-4 text-white/70" />
                                                How to unlock
                                            </div>
                                            <div className="text-sm text-white/70 mt-1 leading-relaxed">
                                                {selected.unlockHint || "Complete related missions to unlock this badge."}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <m.button
                                            type="button"
                                            whileHover={reduceMotion ? undefined : { y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelected(null)}
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 hover:text-white transition"
                                        >
                                            Close (Esc)
                                        </m.button>
                                    </div>
                                </m.div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </LazyMotion >
    );
}
