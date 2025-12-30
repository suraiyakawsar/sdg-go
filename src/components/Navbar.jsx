// src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiAward, FiUser, FiPlay } from "react-icons/fi";
import { usePlayer } from "../pages/PlayerContext";
import { getAvatarUri } from "../utils/avatar";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const reduceMotion = useReducedMotion();



    // ✅ Get profile FIRST
    const { profile, resetProfile } = usePlayer();

    // ✅ Then use profile for derived values
    const avatarUri = getAvatarUri(profile?.avatar)
        || profile?.avatar?.uri
        || "assets/images/characters/ladyy. png"; // fallback


    const displayName = profile?.name || "Guest";
    const subtitle = profile?.role || "Eco Explorer 🌱";

    const isActive = (path) => location.pathname === path;

    // Close popover on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close popover on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    function goOrOnboard(targetPath) {
        setOpen(false);
        if (profile) navigate(targetPath);
        else navigate(`/onboarding?next=${encodeURIComponent(targetPath)}`);
    }

    function handleLogout() {
        resetProfile();
        setOpen(false);
        navigate("/", { replace: true });
    }

    return (
        <LazyMotion features={domAnimation}>
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="relative border-b border-white/10 bg-black/60 backdrop-blur-md">
                    {/* subtle color wash */}
                    <div className="pointer-events-none absolute inset-0 opacity-70">
                        <div className="absolute -top-10 left-8 h-20 w-52 rounded-full bg-purple-500/18 blur-2xl" />
                        <div className="absolute -top-12 right-10 h-20 w-52 rounded-full bg-cyan-400/14 blur-2xl" />
                    </div>

                    {/* thin gradient accent line */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-purple-400/35 via-emerald-300/25 to-cyan-300/35" />

                    <div className="relative max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
                        {/* Brand */}
                        <Link to="/" className="flex items-center gap-2 select-none">
                            <span className="text-lg">🌍</span>
                            <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                                SDG Explorer
                            </span>
                            <span className="hidden sm:inline-flex ml-2 text-[11px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60">
                                Hub
                            </span>
                        </Link>

                        {/* Right side */}
                        <div className="flex items-center gap-2">
                            {/* Avatar + popover */}
                            <div className="relative overflow-visible" ref={ref}>
                                <m.button
                                    type="button"
                                    onClick={() => setOpen((p) => !p)}
                                    whileHover={reduceMotion ? undefined : { y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={[
                                        "relative w-11 h-11 rounded-2xl",
                                        "bg-white/5 border border-white/10",
                                        "flex items-center justify-center",
                                        // ✅ REMOVED overflow-hidden from here
                                        "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                                        "transition outline-none focus: ring-2 focus: ring-purple-500/30",
                                        "group",
                                    ].join(" ")}
                                    aria-haspopup="menu"
                                    aria-expanded={open}
                                    aria-label="Open user menu"
                                >
                                    {/* subtle rim glow on hover */}
                                    <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-purple-400/18 group-hover:ring-emerald-400/40 transition" />


                                    {/* ✅ DYNAMIC AVATAR */}
                                    <img
                                        src={avatarUri}
                                        alt={`${displayName}'s avatar`}
                                        className="w-9 h-9 rounded-xl object-cover transition group-hover:scale-105"
                                        draggable="false"
                                    />

                                    {/* Online indicator */}
                                    {profile && (
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                    )}
                                </m.button>

                                <AnimatePresence>
                                    {open && (
                                        <m.div
                                            className={[
                                                "absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl",
                                                "border border-white/10 bg-[#0B1024]/95 backdrop-blur-xl",
                                                "shadow-[0_30px_120px_-60px_rgba(0,0,0,0.95)]",
                                            ].join(" ")}
                                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                            transition={
                                                reduceMotion
                                                    ? { duration: 0.12 }
                                                    : { type: "spring", stiffness: 360, damping: 26 }
                                            }
                                            role="menu"
                                        >
                                            {/* tiny gradient header */}
                                            <div className="h-1 bg-gradient-to-r from-purple-500/70 via-emerald-400/50 to-cyan-400/60" />

                                            <div className="p-4">
                                                <div className="flex items-start gap-3">
                                                    {/* ✅ DYNAMIC AVATAR IN POPOVER */}
                                                    {/* ✅ DYNAMIC AVATAR IN POPOVER */}
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                                            <img
                                                                src={avatarUri}
                                                                alt=""
                                                                className="w-11 h-11 rounded-xl object-cover"
                                                                draggable="false"
                                                            />
                                                        </div>
                                                        {/* ✅ GREEN DOT OUTSIDE THE OVERFLOW CONTAINER */}
                                                        {profile && (
                                                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0B1024] shadow-[0_0_10px_rgba(52,211,153,0.7)] pointer-events-none" />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-semibold text-white leading-tight truncate">
                                                            {displayName}
                                                        </div>
                                                        <div className="text-sm text-white/60 truncate">{subtitle}</div>
                                                        {profile && (
                                                            <button
                                                                type="button"
                                                                onClick={() => goOrOnboard("/profile")}
                                                                className="mt-1 text-xs text-emerald-300/80 hover:text-emerald-300 transition"
                                                            >
                                                                Edit profile →
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {!profile && (
                                                    <div className="mt-3 text-xs text-white/50 leading-relaxed">
                                                        Guest mode. Create a profile to save progress + badges.
                                                    </div>
                                                )}
                                            </div>

                                            <div className="h-px bg-white/10" />

                                            <div className="p-2 flex flex-col">
                                                <button
                                                    type="button"
                                                    onClick={() => goOrOnboard("/game")}
                                                    className="px-3 py-2.5 rounded-xl text-left text-sm text-white/80 hover:bg-white/5 hover:text-white transition flex items-center gap-3"
                                                    role="menuitem"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
                                                        <FiPlay className="w-4 h-4 text-emerald-300" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Start / Continue</div>
                                                        <div className="text-xs text-white/50">Resume your journey</div>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => goOrOnboard("/profile")}
                                                    className="px-3 py-2.5 rounded-xl text-left text-sm text-white/80 hover:bg-white/5 hover:text-white transition flex items-center gap-3"
                                                    role="menuitem"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-fuchsia-500/15 border border-fuchsia-400/30 flex items-center justify-center">
                                                        <FiUser className="w-4 h-4 text-fuchsia-300" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Profile</div>
                                                        <div className="text-xs text-white/50">View stats & avatar</div>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => goOrOnboard("/badges")}
                                                    className="px-3 py-2.5 rounded-xl text-left text-sm text-white/80 hover:bg-white/5 hover:text-white transition flex items-center gap-3"
                                                    role="menuitem"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
                                                        <FiAward className="w-4 h-4 text-cyan-300" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Badges</div>
                                                        <div className="text-xs text-white/50">View achievements</div>
                                                    </div>
                                                </button>

                                                <div className="h-px bg-white/10 my-2" />

                                                {profile ? (
                                                    <button
                                                        type="button"
                                                        onClick={handleLogout}
                                                        className="px-3 py-2 rounded-xl text-left text-sm text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition"
                                                        role="menuitem"
                                                    >
                                                        Logout
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => goOrOnboard("/onboarding")}
                                                        className="px-3 py-2. 5 rounded-xl text-left text-sm text-emerald-300 hover:bg-emerald-500/10 transition flex items-center gap-2"
                                                        role="menuitem"
                                                    >
                                                        <span className="text-lg">✨</span>
                                                        Create Profile
                                                    </button>
                                                )}
                                            </div>
                                        </m.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </LazyMotion>
    );
}