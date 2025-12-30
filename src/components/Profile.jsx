import { useState, useEffect } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiPlay,
    FiEdit3,
    FiAward,
    FiTarget,
    FiBookOpen,
    FiTrendingUp,
    FiHome,
} from "react-icons/fi";
import { SDGProgress } from "./ui/SDGProgress";
import { usePlayer } from "../pages/PlayerContext";
import { BADGES } from "../utils/badges";
import { getAvatarUri } from "../utils/avatar";
import AvatarPicker from "./ui/AvatarPicker";


// ✅ Helper functions to read live data from storage
function getSDGPoints() {
    return Number(localStorage.getItem("sdgPoints")) || 0;
}

function getBadgesKeys() {
    try {
        return JSON.parse(localStorage.getItem("collectedBadges") || "[]");
    } catch {
        return [];
    }
}

function getBadgesCount() {
    return getBadgesKeys().length;
}

function getCompletedChapters() {
    try {
        const stored = localStorage.getItem("completedChapters");
        if (stored) {
            const arr = JSON.parse(stored);
            return Array.isArray(arr) ? arr.length : Number(arr) || 1;
        }
        return 1;
    } catch {
        return 1;
    }
}

function getXP(points) {
    // XP is 0-100 based on points
    return Math.min(Math.round((points / 300) * 100), 100);
}

function HudButton({ children, className = "", ...props }) {
    return (
        <m.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={[
                "w-full rounded-2xl h-11 px-4",
                "bg-black/60 backdrop-blur-md border border-white/10",
                "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                "text-white/85 hover:text-white hover:bg-black/55 transition",
                "flex items-center justify-center gap-2",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/25",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </m.button>
    );
}

function StatMini({ label, value, Icon, glow }) {
    return (
        <m.div
            whileHover={{ y: -2 }}
            className={[
                "group relative rounded-2xl p-4",
                "bg-black/60 backdrop-blur-md",
                "border border-white/10",
                "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                "overflow-hidden transition",
            ].join(" ")}
        >
            <span
                className="pointer-events-none absolute inset-x-1 bottom-0 h-[3px] opacity-0 group-hover:opacity-100 transition"
                style={{
                    background: `linear-gradient(90deg, transparent, ${glow}, transparent)`,
                    boxShadow: `0 0 10px ${glow}, 0 0 22px ${glow}CC, 0 0 46px ${glow}99`,
                    filter: "saturate(1.8)",
                }}
            />
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white/80" />
                </div>
                <div className="min-w-0">
                    <div className="text-xs text-white/55 uppercase tracking-wider">{label}</div>
                    <div className="text-2xl font-extrabold text-white/95 leading-tight">{value}</div>
                </div>
            </div>
        </m.div>
    );
}

export default function Profile() {
    const reduceMotion = useReducedMotion();
    const { profile, updateProfile } = usePlayer();
    const navigate = useNavigate();
    // Inside the Profile component: 
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    // ✅ Editing state
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(profile?.name || "");

    // ✅ Live stats state
    const [stats, setStats] = useState({
        username: profile?.name || "Raya",
        title: profile?.role || "Eco Explorer",
        sdgPoints: 0,
        badges: 0,
        chapters: 1,
        xp: 0,
        badgeKeys: [],
    });

    // ✅ Continue button route - read fresh from localStorage
    const [lastRoute, setLastRoute] = useState(() =>
        localStorage.getItem("sdgExplorer:lastRoute") || "/game"
    );

    // Get avatar URI (regenerate from config or use cached)
    const avatarUri = profile?.avatar?.uri
        || getAvatarUri(profile?.avatar)
        || "assets/images/characters/ladyy.png";

    // Handle avatar selection
    const handleAvatarSelect = (avatarConfig) => {
        updateProfile({
            ...profile,
            avatar: avatarConfig,
        });
        setShowAvatarPicker(false);
    };


    // ✅ Update stats whenever profile or storage changes
    useEffect(() => {
        const points = getSDGPoints();
        const badgeKeys = getBadgesKeys();
        const badgesCount = badgeKeys.length;
        const chapters = getCompletedChapters();
        const xp = getXP(points);

        setStats({
            username: profile?.name || "Raya",
            title: profile?.role || "Eco Explorer",
            sdgPoints: points,
            badges: badgesCount,
            chapters: chapters,
            xp: xp,
            badgeKeys: badgeKeys,
        });

        setEditName(profile?.name || "");
    }, [profile]);

    // ✅ Listen for storage changes (when badges unlock, points change, etc.)
    useEffect(() => {
        const handleStorageChange = () => {
            const points = getSDGPoints();
            const badgeKeys = getBadgesKeys();
            const badgesCount = badgeKeys.length;
            const chapters = getCompletedChapters();
            const xp = getXP(points);

            setStats(prev => ({
                ...prev,
                sdgPoints: points,
                badges: badgesCount,
                chapters: chapters,
                xp: xp,
                badgeKeys: badgeKeys,
            }));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // ✅ Update lastRoute when component mounts or focus returns
    useEffect(() => {
        const updateLastRoute = () => {
            const saved = localStorage.getItem("sdgExplorer:lastRoute") || "/game";
            setLastRoute(saved);
            console.log("✅ Updated lastRoute in Profile:", saved);
        };

        // Load on mount
        updateLastRoute();

        // Listen for visibility changes (when user returns to tab)
        document.addEventListener("visibilitychange", updateLastRoute);

        // Listen for window focus
        window.addEventListener("focus", updateLastRoute);

        return () => {
            document.removeEventListener("visibilitychange", updateLastRoute);
            window.removeEventListener("focus", updateLastRoute);
        };
    }, []);

    // ✅ Save edited name using updateProfile
    function saveName() {
        const newName = editName.trim();
        if (newName && updateProfile) {
            // Use updateProfile from PlayerContext
            updateProfile({
                ...profile,
                name: newName,
            });
            setStats(s => ({ ...s, username: newName }));
            setEditing(false);
            console.log("✅ Profile name saved:", newName);
        }
    }

    // ✅ Get recent badges (last 4)
    const recentBadges = stats.badgeKeys
        .slice(-4)
        .reverse()
        .map(key => BADGES.find(b => b.key === key));

    const pageEnter = {
        initial: { opacity: 0, y: 14, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 text-white pt-10">
                {/* Ambient glow */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/75" />
                    <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:48px_48px]" />
                </div>

                <div className="max-w-6xl mx-auto px-6 pb-14 relative">
                    {/* Top HUD nav */}
                    <div className="flex items-center gap-2 shrink-0 mb-5">
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

                    {/* Main container */}
                    <m.div {...pageEnter} className="relative">
                        <div
                            className={[
                                "relative rounded-3xl",
                                "bg-black/70 border border-white/10",
                                "shadow-[0_25px_80px_rgba(0,0,0,0.9)]",
                                "backdrop-blur-2xl overflow-hidden",
                            ].join(" ")}
                        >
                            {/* Top meta bar */}
                            <div className="flex items-center justify-between px-5 h-12 border-b border-white/5 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-sm font-semibold">
                                        SDG
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                            Player Profile
                                        </span>
                                        <span className="text-sm font-semibold text-slate-100">
                                            {stats.username} · {stats.title}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                                    <span>Progress autosaves on this device</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                                {/* LEFT:  Identity + actions */}
                                <m.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.35, delay: 0.05 }}
                                    className="space-y-4"
                                >
                                    {/* Profile Card */}
                                    <div className="group relative rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md overflow-hidden p-5 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]">
                                        <span
                                            className="pointer-events-none absolute inset-x-1 bottom-0 h-[3px] opacity-0 group-hover:opacity-100 transition"
                                            style={{
                                                background: `linear-gradient(90deg, transparent, #34D399, transparent)`,
                                                boxShadow: `0 0 10px #34D399, 0 0 22px #34D399CC, 0 0 46px #34D39999`,
                                                filter: "saturate(1.8)",
                                            }}
                                        />

                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                {/* <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
                                                    <img
                                                        src="assets/images/characters/ladyy.png"
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                        draggable={false}
                                                    />
                                                </div> */}


                                                <div
                                                    className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 overflow-hidden cursor-pointer hover:border-emerald-400/50 transition relative group"
                                                    onClick={() => setShowAvatarPicker(true)}
                                                >
                                                    <img
                                                        src={avatarUri}  // ← DYNAMIC AVATAR
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                        draggable={false}
                                                    />
                                                    {/* Hover edit overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-2xl">
                                                        <FiEdit3 className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>


                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400/90 shadow-[0_0_18px_rgba(52,211,153,0.5)] border border-black/40" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs text-white/55 uppercase tracking-wider">
                                                    Username
                                                </div>
                                                {!editing ? (
                                                    <div className="text-xl font-extrabold truncate">
                                                        {stats.username}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={e => setEditName(e.target.value)}
                                                        maxLength={24}
                                                        placeholder="Enter name"
                                                        className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-lg font-extrabold focus:outline-none focus:border-emerald-400/60"
                                                        autoFocus
                                                    />
                                                )}
                                                <div className="text-sm text-emerald-300/90">
                                                    {stats.title}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Edit controls */}
                                        {editing && (
                                            <div className="mt-4 flex gap-2">
                                                <m.button
                                                    type="button"
                                                    whileHover={{ y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={saveName}
                                                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition text-sm"
                                                >
                                                    ✓ Save
                                                </m.button>
                                                <m.button
                                                    type="button"
                                                    whileHover={{ y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        setEditing(false);
                                                        setEditName(stats.username);
                                                    }}
                                                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-semibold transition text-sm"
                                                >
                                                    Cancel
                                                </m.button>
                                            </div>
                                        )}

                                        {/* XP Progress */}
                                        <div className="mt-5">
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-white/55 uppercase tracking-wider">
                                                    XP Progress
                                                </div>
                                                <div className="text-xs text-white/60 font-semibold">
                                                    {stats.xp}%
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <SDGProgress value={stats.xp} />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <HudButton onClick={() => setEditing(!editing)}>
                                                <FiEdit3 className="w-4 h-4 text-fuchsia-200" />
                                                {editing ? "Cancel" : "Edit"}
                                            </HudButton>

                                            <HudButton
                                                onClick={() => navigate(lastRoute)}
                                                className="from-emerald-500/28 to-lime-500/12"
                                            >
                                                <FiPlay className="w-4 h-4 text-emerald-200" />
                                                Continue
                                            </HudButton>
                                        </div>
                                    </div>

                                    {/* Recent Badges */}
                                    <div className="rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md p-5 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-white/55 uppercase tracking-wider">
                                                Recent Badges
                                            </div>
                                            <Link
                                                to="/badges"
                                                className="text-xs text-white/60 hover:text-white transition"
                                            >
                                                View all →
                                            </Link>
                                        </div>

                                        <div className="mt-4 grid grid-cols-4 gap-2">
                                            {recentBadges.length > 0 ? (
                                                recentBadges.map((badge, i) =>
                                                    badge ? (
                                                        <m.div
                                                            key={i}
                                                            whileHover={{ scale: 1.05 }}
                                                            className="aspect-square rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center group cursor-pointer"
                                                            title={badge.name}
                                                        >
                                                            <badge.Icon
                                                                className="w-6 h-6 transition group-hover:scale-110"
                                                                style={{ color: badge.color }}
                                                            />
                                                        </m.div>
                                                    ) : (
                                                        <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                            <FiAward className="w-5 h-5 text-white/40" />
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                        <FiAward className="w-5 h-5 text-white/40" />
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="mt-3 text-xs text-white/45">
                                            You've earned{" "}
                                            <span className="text-white/75 font-semibold">
                                                {stats.badges}
                                            </span>{" "}
                                            badge{stats.badges !== 1 ? "s" : ""} so far.
                                        </div>
                                    </div>
                                </m.div>

                                {/* RIGHT: Stats + progress */}
                                <m.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.35, delay: 0.08 }}
                                    className="space-y-4"
                                >
                                    {/* Stats row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <StatMini
                                            label="SDG Points"
                                            value={stats.sdgPoints}
                                            Icon={FiTarget}
                                            glow="#34D399"
                                        />
                                        <StatMini
                                            label="Badges"
                                            value={stats.badges}
                                            Icon={FiAward}
                                            glow="#FBBF24"
                                        />
                                        <StatMini
                                            label="Chapters"
                                            value={stats.chapters}
                                            Icon={FiBookOpen}
                                            glow="#60A5FA"
                                        />
                                    </div>

                                    {/* Progress module */}
                                    <div className="group relative rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md p-6 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)] overflow-hidden">
                                        <span
                                            className="pointer-events-none absolute inset-x-1 bottom-0 h-[3px] opacity-0 group-hover:opacity-100 transition"
                                            style={{
                                                background: `linear-gradient(90deg, transparent, #A855F7, transparent)`,
                                                boxShadow: `0 0 10px #A855F7, 0 0 22px #A855F7CC, 0 0 46px #A855F799`,
                                                filter: "saturate(1.8)",
                                            }}
                                        />

                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-xs text-white/55 uppercase tracking-wider">
                                                    Progress Summary
                                                </div>
                                                <div className="text-lg font-extrabold text-white/90 mt-1">
                                                    {stats.chapters >= 17
                                                        ? "🎉 All chapters complete!"
                                                        : "You're building momentum. "}
                                                </div>
                                                <div className="text-sm text-white/65 mt-2 leading-relaxed">
                                                    {stats.chapters >= 17
                                                        ? "Amazing!  You've completed all SDG chapters.  Explore badges and replay for higher SDG points!"
                                                        : "Keep completing chapters to unlock more SDGs, missions, and badges. "}
                                                </div>
                                            </div>

                                            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <FiTrendingUp className="w-5 h-5 text-fuchsia-200" />
                                            </div>
                                        </div>

                                        {/* Chapter completion bar */}
                                        <div className="mt-5">
                                            <div className="flex items-center justify-between text-xs text-white/55">
                                                <span>Chapter Completion</span>
                                                <span className="text-white/60 font-semibold">
                                                    {stats.chapters}/17
                                                </span>
                                            </div>

                                            <div className="mt-2 h-3 bg-gray-800/80 rounded-full overflow-hidden">
                                                <m.div
                                                    className="h-full bg-gradient-to-r from-purple-400 to-cyan-300 transition-all duration-500"
                                                    style={{
                                                        width: `${Math.min(
                                                            (stats.chapters / 17) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>

                                            <div className="mt-2 text-[11px] text-white/45">
                                                Tip: explore SDGs on the Home hub to preview actions before each chapter.
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next Up */}
                                    <div className="rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md p-5 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]">
                                        <div className="text-xs text-white/55 uppercase tracking-wider">
                                            Next Up
                                        </div>
                                        <div className="mt-2 text-sm text-white/75 leading-relaxed">
                                            {stats.chapters >= 17
                                                ? "All chapters completed! Review your badges or replay for higher SDG points."
                                                : `Continue Chapter ${stats.chapters + 1} and aim for a +10 SDG point choice.`}
                                        </div>
                                    </div>
                                </m.div>
                            </div>
                        </div>
                    </m.div>
                </div>
            </div>


            {/* Avatar Picker Modal */}
            {showAvatarPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70">
                    <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1024]/95 backdrop-blur-xl shadow-[0_30px_120px_-60px_rgba(0,0,0,0.95)] overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500/70 via-cyan-400/50 to-purple-400/60" />

                        <div className="p-2">
                            <div className="text-center pt-4">
                                <h2 className="text-xl font-extrabold text-white">Change Avatar</h2>
                                <p className="text-sm text-white/60 mt-1">Pick a new look</p>
                            </div>

                            <AvatarPicker
                                initialSeed={profile?.avatar?.seed || profile?.name || "player"}
                                onSelect={handleAvatarSelect}
                                onCancel={() => setShowAvatarPicker(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </LazyMotion>
    );
}