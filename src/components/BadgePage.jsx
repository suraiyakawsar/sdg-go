// // src/pages/BadgePage.jsx
// import { useEffect, useMemo, useState } from "react";
// import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//     FiHome,
//     FiLock,
//     FiCheckCircle,
//     FiArrowLeft,
// } from "react-icons/fi";
// import { BADGES } from "../utils/badges";
// /** Badge Tile Component */
// function BadgeTile({ badge, onClick, shakeActive, reduceMotion }) {
//     const locked = !badge.collected;
//     const Icon = badge.Icon;

//     return (
//         <m.button
//             type="button"
//             onClick={onClick}
//             whileHover={reduceMotion ? undefined : { y: -3 }}
//             whileTap={{ scale: 0.98 }}
//             animate={shakeActive ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
//             transition={{ duration: 0.35 }}
//             className={[
//                 "group relative text-left rounded-2xl p-4",
//                 "bg-black/60 backdrop-blur-md border border-white/10",
//                 "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
//                 "transition overflow-hidden",
//                 locked ? "opacity-80" : "opacity-100",
//                 "focus:outline-none focus:ring-2 focus:ring-purple-500/25",
//             ].join(" ")}
//             aria-label={locked ? `Locked badge:  ${badge.name}` : `Open badge: ${badge.name}`}
//         >
//             {/* Bottom glow ONLY when collected */}
//             {!locked && (
//                 <span
//                     className="pointer-events-none absolute inset-x-1 bottom-0 h-[3px] opacity-0 group-hover:opacity-100 transition"
//                     style={{
//                         background: `linear-gradient(90deg, transparent, ${badge.color}, transparent)`,
//                         boxShadow: `0 0 10px ${badge.color}, 0 0 22px ${badge.color}CC, 0 0 46px ${badge.color}99`,
//                         filter: "saturate(1.8)",
//                     }}
//                 />
//             )}

//             {/* Top row */}
//             <div className="flex items-center justify-between">
//                 <div className="text-xs text-white/60 font-medium">Badge</div>
//                 <div className="text-xs text-white/55 font-semibold flex items-center gap-2">
//                     {locked ? (
//                         <FiLock className="w-3. 5 h-3.5 text-white/45" />
//                     ) : (
//                         <FiCheckCircle className="w-3.5 h-3.5 text-emerald-300/80" />
//                     )}
//                 </div>
//             </div>

//             {/* Icon chip */}
//             <div className="mt-3 flex items-center justify-center">
//                 <div
//                     className={[
//                         "w-14 h-14 rounded-2xl bg-black/40 border border-white/10",
//                         "flex items-center justify-center",
//                         locked ? "opacity-55" : "opacity-100",
//                     ].join(" ")}
//                 >
//                     <Icon className={locked ? "w-7 h-7 text-white/45" : "w-7 h-7 text-white/85"} />
//                 </div>
//             </div>

//             {/* Text */}
//             <div className="mt-3">
//                 <div className="text-sm font-semibold text-white/90 leading-snug line-clamp-2">
//                     {badge.name}
//                 </div>
//                 <div className={locked ? "text-xs text-white/45 mt-1 italic" : "text-xs text-emerald-200/90 mt-1"}>
//                     {locked ? "Locked" : "Collected"}
//                 </div>
//             </div>

//             {/* Subtle hover wash */}
//             <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(70%_70%_at_50%_0%,rgba(168,85,247,0.14),transparent_65%)]" />
//         </m.button>
//     );
// }

// /** Main Badge Page */
// export default function BadgePage() {
//     const reduceMotion = useReducedMotion();
//     const [selected, setSelected] = useState(null);
//     const [shake, setShake] = useState(null);
//     // 🔴 KEY FIX: State for badges so re-render happens
//     const [allBadges, setAllBadges] = useState([]);

//     // 🔴 Initialize badges and listen for storage changes
//     useEffect(() => {
//         const updateBadges = () => {
//             const savedKeys = JSON.parse(localStorage.getItem("collectedBadges") || "[]");
//             const collected = new Set(savedKeys);

//             const badges = BADGES.map((badge) => ({
//                 ...badge,
//                 collected: collected.has(badge.key),
//             }));

//             setAllBadges(badges);
//             console.log("Badges updated:", badges); // 🔴 DEBUG
//         };

//         // Initial load
//         updateBadges();

//         // Listen for storage changes (when unlockBadge saves)
//         const handleStorageChange = () => {
//             console.log("Storage changed, updating badges... "); // 🔴 DEBUG
//             updateBadges();
//         };

//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, []);

//     const { collectedCount, totalBadges, progress } = useMemo(() => {
//         const collectedCount = allBadges.filter((b) => b.collected).length;
//         const totalBadges = allBadges.length || BADGES.length;
//         const progress = totalBadges ? (collectedCount / totalBadges) * 100 : 0;
//         return { collectedCount, totalBadges, progress };
//     }, [allBadges]);

//     function handleClick(badge) {
//         if (!badge.collected) {
//             setShake(badge.key);
//             setTimeout(() => setShake(null), 420);
//         }
//         setSelected(badge);
//     }

//     // ESC to close modal
//     useEffect(() => {
//         if (!selected) return;
//         const onKeyDown = (e) => e.key === "Escape" && setSelected(null);
//         window.addEventListener("keydown", onKeyDown);
//         return () => window.removeEventListener("keydown", onKeyDown);
//     }, [selected]);

//     const pageEnter = {
//         initial: { opacity: 0, y: 14, filter: "blur(4px)" },
//         animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
//     };

//     const selectedIcon = selected?.Icon;

//     return (
//         <LazyMotion features={domAnimation}>
//             <div className="min-h-screen w-screen text-white overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 pt-10">
//                 {/* Ambient glow */}
//                 <div className="absolute inset-0 -z-10">
//                     <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />
//                     <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/75" />
//                     <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:48px_48px]" />
//                 </div>

//                 <div className="max-w-6xl mx-auto px-6 pb-14">
//                     {/* Navigation buttons */}
//                     <div className="flex items-center gap-2 shrink-0">
//                         <Link
//                             to={-1}
//                             className={[
//                                 "w-11 h-11 rounded-2xl",
//                                 "bg-black/60 backdrop-blur-md border border-white/10",
//                                 "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
//                                 "flex items-center justify-center",
//                                 "text-white/75 hover:text-white transition",
//                                 "focus:outline-none focus:ring-2 focus:ring-purple-500/25",
//                             ].join(" ")}
//                             aria-label="Back"
//                             title="Back"
//                         >
//                             <FiArrowLeft className="w-5 h-5 text-emerald-200" />
//                         </Link>

//                         <Link
//                             to="/"
//                             className={[
//                                 "w-11 h-11 rounded-2xl",
//                                 "bg-black/60 backdrop-blur-md border border-white/10",
//                                 "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
//                                 "flex items-center justify-center",
//                                 "text-white/75 hover:text-white transition",
//                                 "focus:outline-none focus:ring-2 focus:ring-purple-500/25",
//                             ].join(" ")}
//                             aria-label="Home"
//                             title="Home"
//                         >
//                             <FiHome className="w-5 h-5 text-emerald-200" />
//                         </Link>
//                     </div>

//                     {/* Header */}
//                     <m.div {...pageEnter} className="pt-6 mb-6 flex items-start justify-between gap-4">
//                         <div>
//                             <div className="text-xs text-white/55 uppercase tracking-[0.18em]">Achievements</div>
//                             <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Badges</h1>
//                             <p className="text-white/65 mt-2">
//                                 Unlock achievements by completing objectives and making great choices throughout the game.
//                             </p>
//                         </div>
//                     </m.div>

//                     {/* Progress Bar */}
//                     <m.div
//                         {...pageEnter}
//                         transition={{ duration: 0.45, delay: 0.05 }}
//                         className={[
//                             "rounded-3xl",
//                             "bg-black/60 backdrop-blur-md border border-white/10",
//                             "shadow-[0_25px_80px_rgba(0,0,0,0.85)]",
//                             "overflow-hidden",
//                         ].join(" ")}
//                     >
//                         <div className="h-px bg-gradient-to-r from-purple-400/35 via-emerald-300/25 to-cyan-300/35" />
//                         <div className="p-5 sm:p-6">
//                             <div className="flex items-center justify-between text-sm text-white/70 mb-3">
//                                 <span>
//                                     <span className="text-white/90 font-semibold">{collectedCount}</span>/{totalBadges} collected
//                                 </span>
//                                 <span className="text-white/60 font-semibold">{Math.round(progress)}%</span>
//                             </div>

//                             <div className="w-full bg-gray-800/80 rounded-full h-3 overflow-hidden">
//                                 <m.div
//                                     className="h-3 rounded-full bg-gradient-to-r from-emerald-400/70 via-purple-400/55 to-cyan-300/60"
//                                     initial={{ width: 0 }}
//                                     animate={{ width: `${progress}%` }}
//                                     transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeInOut" }}
//                                 />
//                             </div>

//                             <div className="text-[11px] text-white/45 mt-2">
//                                 Locked badges show unlock hints.  Check them out to learn how to earn them!
//                             </div>
//                         </div>
//                     </m.div>

//                     {/* Badge Grid */}
//                     <m.div
//                         {...pageEnter}
//                         transition={{ duration: 0.45, delay: 0.08 }}
//                         className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
//                     >
//                         {allBadges.map((b) => (
//                             <BadgeTile
//                                 key={b.key}
//                                 badge={b}
//                                 onClick={() => handleClick(b)}
//                                 shakeActive={shake === b.key}
//                                 reduceMotion={reduceMotion}
//                             />
//                         ))}
//                     </m.div>

//                     {/* Modal */}
//                     <AnimatePresence>
//                         {selected && (
//                             <m.div
//                                 className="fixed inset-0 z-50 flex items-center justify-center px-5"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 aria-modal="true"
//                                 role="dialog"
//                             >
//                                 <m.button
//                                     type="button"
//                                     className="absolute inset-0 bg-black/70"
//                                     onClick={() => setSelected(null)}
//                                     aria-label="Close badge modal"
//                                 />

//                                 <m.div
//                                     className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0B1024]/95 backdrop-blur-xl p-6 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.95)]"
//                                     initial={{ scale: 0.98, opacity: 0 }}
//                                     animate={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
//                                     exit={{ scale: 0.98, opacity: 0, transition: { duration: 0.15 } }}
//                                 >
//                                     <div className="flex items-start justify-between gap-4">
//                                         <div className="min-w-0">
//                                             <div className="text-xs text-white/50 font-semibold mb-1">Achievement</div>
//                                             <h2 className="text-2xl font-extrabold tracking-tight">{selected.name}</h2>
//                                         </div>

//                                         <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
//                                             <selectedIcon className="w-7 h-7 text-white/85" />
//                                         </div>
//                                     </div>

//                                     <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
//                                         <div className="text-sm font-semibold text-white/90">Description</div>
//                                         <div className="text-sm text-white/70 mt-1 leading-relaxed">{selected.desc}</div>
//                                     </div>

//                                     {!selected.collected && (
//                                         <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
//                                             <div className="text-sm font-semibold text-white/90 flex items-center gap-2">
//                                                 <FiLock className="w-4 h-4 text-white/70" />
//                                                 How to unlock
//                                             </div>
//                                             <div className="text-sm text-white/70 mt-1 leading-relaxed">
//                                                 {selected.unlockHint || "Complete related objectives to unlock this badge."}
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div className="mt-6">
//                                         <m.button
//                                             type="button"
//                                             whileHover={reduceMotion ? undefined : { y: -2 }}
//                                             whileTap={{ scale: 0.98 }}
//                                             onClick={() => setSelected(null)}
//                                             className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 hover:text-white transition"
//                                         >
//                                             Close (Esc)
//                                         </m.button>
//                                     </div>
//                                 </m.div>
//                             </m.div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </div>
//         </LazyMotion>
//     );
// }

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
    FiCopy,
    FiTwitter,
    FiLinkedin
} from "react-icons/fi";
import { BADGES } from "../utils/badges";

/** Badge Tile Component */
function BadgeTile({ badge, onClick, shakeActive, reduceMotion }) {
    const locked = !badge.collected;
    const Icon = badge.Icon;

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
            aria-label={locked ? `Locked badge:  ${badge.name}` : `Open badge: ${badge.name}`}
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
                <div className="text-xs text-white/60 font-medium">Badge</div>
                <div className="text-xs text-white/55 font-semibold flex items-center gap-2">
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

/** Main Badge Page */
export default function BadgePage() {
    const reduceMotion = useReducedMotion();
    const [selected, setSelected] = useState(null);
    const [shake, setShake] = useState(null);
    const [allBadges, setAllBadges] = useState([]);

    // UI state for share feedback
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

        const handleStorageChange = () => {
            updateBadges();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

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
        setIsCopied(false); // Reset copy state on new selection
        setSelected(badge);
    }

    // ESC to close modal
    useEffect(() => {
        if (!selected) return;
        const onKeyDown = (e) => e.key === "Escape" && setSelected(null);
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selected]);

    // ---- SHARE LOGIC START ----
    const shareUrl = window.location.origin; // Or specific landing page URL
    const shareText = selected
        ? `I just unlocked the "${selected.name}" badge! 🏆 #sdgo! #GameAchievement`
        : "";

    const handleNativeShare = async () => {
        const shareData = {
            title: "Badge Unlocked!",
            text: shareText,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Share canceled", err);
            }
        } else {
            // Fallback to clipboard
            handleCopyLink();
        }
    };

    const handleCopyLink = () => {
        const textToCopy = `${shareText} ${shareUrl}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        });
    };

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    // ---- SHARE LOGIC END ----

    const pageEnter = {
        initial: { opacity: 0, y: 14, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
    };

    const selectedIcon = selected?.Icon;

    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen w-screen text-white overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 pt-10">
                {/* Ambient glow */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/75" />
                    <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:48px_48px]" />
                </div>

                <div className="max-w-6xl mx-auto px-6 pb-14">
                    {/* Navigation buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            to={-1}
                            className="w-11 h-11 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)] flex items-center justify-center text-white/75 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-purple-500/25"
                            aria-label="Back"
                        >
                            <FiArrowLeft className="w-5 h-5 text-emerald-200" />
                        </Link>

                        <Link
                            to="/"
                            className="w-11 h-11 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)] flex items-center justify-center text-white/75 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-purple-500/25"
                            aria-label="Home"
                        >
                            <FiHome className="w-5 h-5 text-emerald-200" />
                        </Link>
                    </div>

                    {/* Header */}
                    <m.div {...pageEnter} className="pt-6 mb-6 flex items-start justify-between gap-4">
                        <div>
                            <div className="text-xs text-white/55 uppercase tracking-[0.18em]">Achievements</div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Badges</h1>
                            <p className="text-white/65 mt-2">
                                Unlock achievements by completing objectives and making great choices throughout the game.
                            </p>
                        </div>
                    </m.div>

                    {/* Progress Bar */}
                    <m.div
                        {...pageEnter}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className="rounded-3xl bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden"
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
                                Locked badges show unlock hints. Check them out to learn how to earn them!
                            </div>
                        </div>
                    </m.div>

                    {/* Badge Grid */}
                    <m.div
                        {...pageEnter}
                        transition={{ duration: 0.45, delay: 0.08 }}
                        className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        {allBadges.map((b) => (
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
                                            <div className="text-xs text-white/50 font-semibold mb-1">Achievement</div>
                                            <h2 className="text-2xl font-extrabold tracking-tight">{selected.name}</h2>
                                        </div>

                                        <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
                                            <selectedIcon className="w-7 h-7 text-white/85" />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="text-sm font-semibold text-white/90">Description</div>
                                        <div className="text-sm text-white/70 mt-1 leading-relaxed">{selected.desc}</div>
                                    </div>

                                    {/* Locked: Hints */}
                                    {!selected.collected && (
                                        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                            <div className="text-sm font-semibold text-white/90 flex items-center gap-2">
                                                <FiLock className="w-4 h-4 text-white/70" />
                                                How to unlock
                                            </div>
                                            <div className="text-sm text-white/70 mt-1 leading-relaxed">
                                                {selected.unlockHint || "Complete related objectives to unlock this badge."}
                                            </div>
                                        </div>
                                    )}

                                    {/* Collected: Share Options */}
                                    {selected.collected && (
                                        <div className="mt-4">
                                            <div className="text-xs text-white/50 font-semibold mb-3 uppercase tracking-wider">Share Success</div>
                                            <div className="flex gap-2">
                                                {/* Main Native/Copy Share Button */}
                                                <button
                                                    onClick={handleNativeShare}
                                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white py-2.5 px-4 text-sm font-semibold transition-all active:scale-95"
                                                >
                                                    {isCopied ? (
                                                        <>
                                                            <FiCheckCircle className="w-4 h-4" /> Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiShare2 className="w-4 h-4" /> Share Badge
                                                        </>
                                                    )}
                                                </button>

                                                {/* Twitter / X */}
                                                <a
                                                    href={twitterUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-sky-400 transition-colors"
                                                    title="Share to X (Twitter)"
                                                >
                                                    <FiTwitter className="w-5 h-5" />
                                                </a>

                                                {/* LinkedIn */}
                                                <a
                                                    href={linkedInUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-blue-500 transition-colors"
                                                    title="Share to LinkedIn"
                                                >
                                                    <FiLinkedin className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Close Button */}
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
        </LazyMotion>
    );
}