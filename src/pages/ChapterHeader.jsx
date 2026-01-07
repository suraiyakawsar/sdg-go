import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiAward, FiClock, FiSave, FiVolume2, FiVolumeX } from "react-icons/fi";
import { on, off } from "../utils/eventBus";

function ChapterHeader({ title }) {
    // ✅ Title change animation state
    const [prevTitle, setPrevTitle] = useState(title);
    const [isChanging, setIsChanging] = useState(false);

    // ✅ Badges count
    const [badgesCount, setBadgesCount] = useState(() => {
        try {
            const badges = JSON.parse(localStorage.getItem("collectedBadges") || "[]");
            return badges.length;
        } catch {
            return 0;
        }
    });

    // ✅ Play time
    const [playTime, setPlayTime] = useState(0);
    const [startTime] = useState(Date.now());

    // ✅ Save indicator
    const [justSaved, setJustSaved] = useState(false);

    // ✅ Sound toggle
    const [soundOn, setSoundOn] = useState(true);

    // ✅ Parse title
    // e.g., "Hallway · Chapter 1" → { scene: "Hallway", chapter: "1" }
    const parseTitle = (t) => {
        if (!t) return { scene: "", chapter: "" };
        const parts = t.split("·").map(s => s.trim());
        const scene = parts[0] || "";
        const chapterMatch = t.match(/Chapter\s*(\d+)/i);
        const chapter = chapterMatch ? chapterMatch[1] : "";
        return { scene, chapter };
    };

    const { scene, chapter } = parseTitle(title);

    // ✅ Animate when title changes
    useEffect(() => {
        if (title !== prevTitle) {
            setIsChanging(true);
            const timer = setTimeout(() => {
                setPrevTitle(title);
                setIsChanging(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [title, prevTitle]);

    // ✅ Listen for badge updates
    useEffect(() => {
        const handleBadgeUpdate = () => {
            try {
                const badges = JSON.parse(localStorage.getItem("collectedBadges") || "[]");
                setBadgesCount(badges.length);
            } catch {
                // ignore
            }
        };

        on("badgeEarned", handleBadgeUpdate);
        window.addEventListener("storage", handleBadgeUpdate);

        return () => {
            off("badgeEarned", handleBadgeUpdate);
            window.removeEventListener("storage", handleBadgeUpdate);
        };
    }, []);

    // ✅ Play time counter
    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            setPlayTime(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    // ✅ Auto-save indicator
    useEffect(() => {
        const interval = setInterval(() => {
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // ✅ Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex items-center justify-between w-full select-none">
            {/* LEFT: Chapter info */}
            <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* SDG Badge */}
                <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-emerald-400/20 blur-md opacity-0 transition" />

                    <motion.div
                        className="relative h-9 w-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-400/40 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <span className="text-emerald-300 text-xs font-bold">SDGo!</span>

                        {/* Subtle shine effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0" />
                    </motion.div>
                </div>

                {/* Divider line */}
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

                {/* Title content */}
                <div className="flex flex-col justify-center">
                    {/* Top row:  Story Chapter label + chapter number */}
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">
                            Story Chapter
                        </span>

                        {chapter && (
                            <motion.span
                                className="px-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60"
                                key={chapter}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                                Ch. {chapter}
                            </motion.span>
                        )}
                    </div>

                    {/* Bottom row:  Scene name with animation */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={title}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.25 }}
                        >
                            <span className="text-base font-semibold text-white/90 tracking-tight">
                                {scene || title}
                            </span>
                            <motion.span
                                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* RIGHT: Stats & controls */}
            <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                {/* Badges */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-400/30 transition-all">
                    <FiAward className="text-cyan-400" size={14} />
                    <span className="text-sm font-semibold text-white/80">{badgesCount}</span>
                </div>

                {/* Play time */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-400/30 transition-all">
                    <FiClock className="text-purple-400" size={14} />
                    <span className="text-sm font-semibold text-white/80">{formatTime(playTime)}</span>
                </div>

                {/* Save indicator */}
                <motion.div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${justSaved
                        ? "bg-emerald-500/20 border border-emerald-400/40"
                        : "bg-white/5 border border-white/10"
                        }`}
                    animate={justSaved ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    <FiSave className={justSaved ? "text-emerald-400" : "text-white/40"} size={13} />
                    <span className={`text-[11px] font-medium ${justSaved ? "text-emerald-300" : "text-white/40"}`}>
                        {justSaved ? "Saved" : "Auto"}
                    </span>
                </motion.div>

                {/* Sound toggle */}
                <motion.button
                    onClick={() => setSoundOn(!soundOn)}
                    className={`p-2 mr-5 rounded-lg transition-all ${soundOn
                        ? "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                        : "bg-red-500/10 border border-red-400/30 text-red-400"
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={soundOn ? "Mute" : "Unmute"}
                >
                    {soundOn ? <FiVolume2 size={14} /> : <FiVolumeX size={14} />}
                </motion.button>
            </motion.div>
        </div>
    );
}

export default ChapterHeader;