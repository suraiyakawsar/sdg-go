// src/components/ui/GameSidebar. jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { emit, on } from "../../utils/eventBus";
import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "../../pages/PlayerContext";
import { getAvatarUri } from "../../utils/avatar"; // ← Add this import

// ✅ Helper:  Get current chapter from localStorage
function getCurrentChapter() {
    return Number(localStorage.getItem("currentChapter")) || 1;
}

// ✅ Helper: Get player name from localStorage or context
function getPlayerName(profileName) {
    const stored = localStorage.getItem("playerName");
    return stored || profileName || "Explorer";
}

export default function GameSidebar({ currentChapter = 1 }) {
    const { profile } = usePlayer();

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Live state
    const [playerName, setPlayerName] = useState(getPlayerName(profile?.name));
    const [playerRole, setPlayerRole] = useState(profile?.role || "Eco Explorer");
    const [chapterNum, setChapterNum] = useState(getCurrentChapter());
    const [chapterTitle, setChapterTitle] = useState(""); // ← NEW: scene title
    const [active, setActive] = useState(null);

    // ✅ Get avatar URI (regenerate from config or fallback)
    const avatarUri = getAvatarUri(profile?.avatar)
        || profile?.avatar?.uri
        || "assets/images/ui/sdg-icon.png"; // fallback to default icon

    // ✅ Listen for profile and chapter changes
    useEffect(() => {
        const storedName = localStorage.getItem("playerName");
        setPlayerName(storedName || profile?.name || "Explorer");
        setPlayerRole(profile?.role || "Eco Explorer");
        setChapterNum(getCurrentChapter(currentChapter));
    }, [profile, currentChapter]);

    // ✅ Listen for chapter/scene changes from Phaser scenes
    useEffect(() => {
        const unsubscribe = on("updateChapterScene", ({ title }) => {
            // title format: "Hallway · Chapter 1" or "Food Bank · Chapter 2"
            setChapterTitle(title);

            // Extract chapter number from title
            const match = title.match(/Chapter\s*(\d+)/i);
            if (match) {
                const num = parseInt(match[1], 10);
                setChapterNum(num);
            } else {
                // Fallback to localStorage
                setChapterNum(getCurrentChapter());
            }
        });

        return () => unsubscribe();
    }, []);

    // ✅ Listen for localStorage changes from other tabs/windows
    useEffect(() => {
        const handleStorageChange = () => {
            setChapterNum(getCurrentChapter());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // ✅ On mount, read current chapter from localStorage
    useEffect(() => {
        setChapterNum(getCurrentChapter());
    }, []);

    // Routes config
    const routes = {
        badges: "/badges",
        profile: "/profile",
        menu: "/",
    };

    // Button definitions
    const buttons = useMemo(
        () => [
            { id: "menu", icon: FiHome, label: "Menu", type: "route", to: routes.menu, hotkey: "1" },
            { id: "profile", icon: FiUser, label: "Profile", type: "route", to: routes.profile, hotkey: "2" },
            { id: "badges", icon: FiAward, label: "Badges", type: "route", to: routes.badges, hotkey: "3" },
            { id: "howto", icon: FiBookOpen, label: "How To Play", type: "overlay", event: "openHowToPlay", hotkey: "H" },
        ],
        []
    );

    // ✅ Handle button clicks
    function handleClick(btn) {
        if (btn.type === "overlay") {
            emit(btn.event, { source: "GameSidebar" });
            return;
        }

        if (btn.type === "route") {
            navigate(btn.to);
            setActive(btn.id);
        }
    }

    // ✅ Auto-highlight based on current route
    const routeActiveId = (() => {
        if (location.pathname.startsWith("/badges")) return "badges";
        if (location.pathname.startsWith("/profile")) return "profile";
        if (location.pathname === "/") return "menu";
        return null;
    })();

    const resolvedActive = routeActiveId ?? active;

    // ✅ Extract scene name from title (e.g., "Hallway" from "Hallway · Chapter 1")
    const sceneName = chapterTitle ? chapterTitle.split("·")[0].trim() : "";

    return (
        <motion.aside
            className="
                pointer-events-auto z-[9999]
                bg-black/60 backdrop-blur-xl
                rounded-3xl px-4 py-5
                flex flex-col items-center gap-5
                shadow-[0_0_45px_rgba(0,0,0,0.65)]
                border border-white/10
                select-none
            "
            initial={{ x: -18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            aria-label="Game sidebar"
        >
            {/* Top:  Avatar + mini profile */}
            <div className="flex flex-col items-center gap-2 mb-1">
                {/* ✅ PROFILE AVATAR */}
                <div
                    className="relative cursor-pointer group"
                    onClick={() => navigate("/profile")}
                    title="View Profile"
                >
                    <div className="w-14 h-14 rounded-2xl shadow-lg border border-white/20 overflow-hidden bg-black/40">
                        <img
                            src={avatarUri}
                            alt={`${playerName}'s avatar`}
                            className="w-full h-full object-cover transition group-hover:scale-110"
                            draggable={false}
                        />
                    </div>

                    {/* Glow ring on hover */}
                    <span className="absolute inset-0 rounded-2xl border-2 border-emerald-400/0 group-hover:border-emerald-400/60 transition-all pointer-events-none" />

                    {/* Online indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3. 5 h-3.5 rounded-full bg-emerald-400 border-2 border-black shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                </div>

                <div className="text-center leading-tight">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                        {playerRole}
                    </p>
                    <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                        {playerName}
                    </p>
                    {/* ✅ UPDATED: Show chapter number + scene name */}
                    <p className="text-[11px] text-gray-300/90">
                        Chapter {chapterNum}
                    </p>
                    {sceneName && (
                        <p className="text-[10px] text-gray-400/80 truncate max-w-[100px]">
                            {sceneName}
                        </p>
                    )}
                </div>
            </div>

            <div className="w-10 border-t border-white/10 mb-1" />

            {/* Buttons */}
            <div className="flex flex-col items-center gap-3">
                {buttons.map((btn) => (
                    <SidebarButton
                        key={btn.id}
                        icon={btn.icon}
                        label={btn.label}
                        hotkey={btn.hotkey}
                        active={resolvedActive === btn.id}
                        onClick={() => handleClick(btn)}
                    />
                ))}
            </div>
        </motion.aside>
    );
}

function SidebarButton({ icon: Icon, label, hotkey, active, onClick }) {
    return (
        <motion.button
            type="button"
            className={`
                w-16 h-16 flex flex-col items-center justify-center
                rounded-2xl text-white
                backdrop-blur-md pointer-events-auto
                border transition-all relative outline-none
                ${active
                    ? "bg-emerald-500/25 border-emerald-300/80 shadow-[0_0_18px_rgba(16,185,129,0.35)]"
                    : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-emerald-300/40"
                }
                focus-visible:ring-2 focus-visible:ring-emerald-300/80
            `}
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            aria-pressed={active}
            aria-label={label}
        >
            <AnimatePresence>
                {active && (
                    <motion.span
                        className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    />
                )}
            </AnimatePresence>

            <div className="text-2xl">
                <Icon />
            </div>
            <span className="text-[10px] mt-1 opacity-90">{label}</span>
        </motion.button>
    );
}