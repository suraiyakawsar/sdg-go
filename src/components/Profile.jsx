import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FiArrowLeft,
    FiPlay,
    FiEdit3,
    FiAward,
    FiTarget,
    FiBookOpen,
    FiTrendingUp,
} from "react-icons/fi";
import { Button } from "./ui/button";
import { SDGProgress } from "./ui/SDGProgress";
import { usePlayer } from "../pages/PlayerContext";
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


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

export default function Profile() {
    const reduceMotion = useReducedMotion();
    const { profile } = usePlayer();
    const navigate = useNavigate();

    // Replace with real data when ready (points, badges, chapters, xp)
    const dummyStats = {
        username: profile?.name || "Raya",
        title: profile?.role || "Eco Explorer",
        sdgPoints: 240,
        badges: 8,
        chapters: 3,
        xp: 65,
    };

    const pageEnter = {
        initial: { opacity: 0, y: 14, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
    };

    function GlowBottom({ color = "#34D399" }) {
        return (
            <span
                className="pointer-events-none absolute inset-x-1 bottom-0 h-[3px] opacity-0 group-hover:opacity-100 transition"
                style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    boxShadow: `0 0 10px ${color}, 0 0 22px ${color}CC, 0 0 46px ${color}99`,
                    filter: "saturate(1.8)",
                }}
            />
        );
    }

    function StatMini({ label, value, Icon, glow }) {
        return (
            <m.div
                whileHover={reduceMotion ? undefined : { y: -2 }}
                className={[
                    "group relative rounded-2xl p-4",
                    "bg-black/60 backdrop-blur-md",
                    "border border-white/10",
                    "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                    "overflow-hidden transition",
                ].join(" ")}
            >
                <GlowBottom color={glow} />
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

    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 text-white pt-10">
                {/* Ambient glow like GameLayout */}
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


                    {/* Shell (same as game container vibe) */}
                    <m.div {...pageEnter} className="relative">
                        <div
                            className={[
                                "relative rounded-3xl",
                                "bg-black/70 border border-white/10",
                                "shadow-[0_25px_80px_rgba(0,0,0,0.9)]",
                                "backdrop-blur-2xl overflow-hidden",
                            ].join(" ")}
                        >
                            {/* Top meta bar (GameLayout style) */}
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
                                            {dummyStats.username} · {dummyStats.title}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                                        <span>Progress autosaves on this device</span>
                                    </div>



                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                                {/* LEFT: Identity + actions */}
                                <m.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.35, delay: 0.05 }}
                                    className="space-y-4"
                                >
                                    <div className="group relative rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md overflow-hidden p-5 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]">
                                        <GlowBottom color="#34D399" />

                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
                                                    <img
                                                        src="assets/images/characters/ladyy.png"
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                        draggable={false}
                                                    />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400/90 shadow-[0_0_18px_rgba(52,211,153,0.5)] border border-black/40" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="text-xs text-white/55 uppercase tracking-wider">
                                                    Username
                                                </div>
                                                <div className="text-xl font-extrabold truncate">{dummyStats.username}</div>
                                                <div className="text-sm text-emerald-300/90">{dummyStats.title}</div>
                                            </div>
                                        </div>

                                        {/* XP */}
                                        <div className="mt-5">
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-white/55 uppercase tracking-wider">
                                                    XP Progress
                                                </div>
                                                <div className="text-xs text-white/60 font-semibold">
                                                    {dummyStats.xp}%
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <SDGProgress value={dummyStats.xp} />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <HudButton onClick={() => { /* open edit modal later */ }}>
                                                <FiEdit3 className="w-4 h-4 text-fuchsia-200" />
                                                Edit
                                            </HudButton>

                                            <HudButton onClick={() => navigate("/game")}>
                                                <FiPlay className="w-4 h-4 text-emerald-200" />
                                                Continue
                                            </HudButton>
                                        </div>


                                    </div>

                                    {/* Quick badges preview (tiny, not a whole page) */}
                                    <div className="rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md p-5 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-white/55 uppercase tracking-wider">
                                                Recent Badges
                                            </div>
                                            <Link to="/badges" className="text-xs text-white/60 hover:text-white transition">
                                                View all →
                                            </Link>
                                        </div>

                                        <div className="mt-4 grid grid-cols-4 gap-2">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
                                                >
                                                    <FiAward className="w-5 h-5 text-white/60" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-3 text-xs text-white/45">
                                            You’ve earned <span className="text-white/75 font-semibold">{dummyStats.badges}</span> badges so far.
                                        </div>
                                    </div>
                                </m.div>

                                {/* RIGHT: Stats + progress modules */}
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
                                            value={dummyStats.sdgPoints}
                                            Icon={FiTarget}
                                            glow="#34D399"
                                        />
                                        <StatMini
                                            label="Badges"
                                            value={dummyStats.badges}
                                            Icon={FiAward}
                                            glow="#FBBF24"
                                        />
                                        <StatMini
                                            label="Chapters"
                                            value={dummyStats.chapters}
                                            Icon={FiBookOpen}
                                            glow="#60A5FA"
                                        />
                                    </div>

                                    {/* Bigger “progress” module */}
                                    <div className="group relative rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md p-6 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)] overflow-hidden">
                                        <GlowBottom color="#A855F7" />

                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-xs text-white/55 uppercase tracking-wider">
                                                    Progress Summary
                                                </div>
                                                <div className="text-lg font-extrabold text-white/90 mt-1">
                                                    You’re building momentum.
                                                </div>
                                                <div className="text-sm text-white/65 mt-2 leading-relaxed">
                                                    Keep completing chapters to unlock more SDGs, missions, and badges.
                                                </div>
                                            </div>

                                            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <FiTrendingUp className="w-5 h-5 text-fuchsia-200" />
                                            </div>
                                        </div>

                                        {/* A simple “chapter completion” bar */}
                                        <div className="mt-5">
                                            <div className="flex items-center justify-between text-xs text-white/55">
                                                <span>Chapter Completion</span>
                                                <span className="text-white/60 font-semibold">{dummyStats.chapters}/17</span>
                                            </div>

                                            <div className="mt-2 h-3 bg-gray-800/80 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-400 to-cyan-300 transition-all duration-300"
                                                    style={{ width: `${Math.min((dummyStats.chapters / 17) * 100, 100)}%` }}
                                                />
                                            </div>

                                            <div className="mt-2 text-[11px] text-white/45">
                                                Tip: explore SDGs on the Home hub to preview actions before each chapter.
                                            </div>
                                        </div>
                                    </div>

                                    {/* Optional: “Next up” module (small) */}
                                    <div className="rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md p-5 shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]">
                                        <div className="text-xs text-white/55 uppercase tracking-wider">Next Up</div>
                                        <div className="mt-2 text-sm text-white/75 leading-relaxed">
                                            Continue Chapter {dummyStats.chapters + 1} and aim for a +10 SDG point choice.
                                        </div>
                                    </div>
                                </m.div>
                            </div>
                        </div>
                    </m.div>
                </div>
            </div>
        </LazyMotion>
    );
}
