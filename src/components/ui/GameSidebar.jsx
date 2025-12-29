// // src/components/ui/GameSidebar.jsx
// import { useMemo, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { emit } from "../../utils/eventBus"; // React
// import { on, off } from "../../utils/eventBus"; // Phaser
// import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { usePlayer } from "../../pages/PlayerContext";

// export default function GameSidebar({ currentChapter = 1 }) {
//     const { profile } = usePlayer();
//     const navigate = useNavigate();
//     const location = useLocation();

//     const [active, setActive] = useState(null);

//     const playerName = profile?.name || "Explorer";
//     const playerRole = profile?.role || "Eco Explorer";
//     const chapterNum = profile?.currentChapter ?? currentChapter;

//     // Your routes (edit if your paths differ)
//     const routes = {
//         badges: "/badges",
//         profile: "/profile",
//         menu: "/", // home page
//     };

//     const buttons = useMemo(
//         () => [
//             { id: "badges", icon: FiAward, label: "Badges", type: "route", to: routes.badges, hotkey: "1" },
//             { id: "profile", icon: FiUser, label: "Profile", type: "route", to: routes.profile, hotkey: "2" },
//             { id: "menu", icon: FiHome, label: "Menu", type: "route", to: routes.menu, hotkey: "3" },
//             { id: "howto", icon: FiBookOpen, label: "How To Play", type: "overlay", event: "openHowToPlay", hotkey: "H" },
//         ],
//         []
//     );

//     // function handleClick(btn) {
//     //     if (btn.id === "howto") {
//     //         emit("openHowToPlay", { source: "GameSidebar" });
//     //         return; // ⛔️ do not setActive
//     //     }

//     //     setActive(btn.id);
//     //     emit(btn.event, { source: "GameSidebar" });
//     // }



//     function handleClick(btn) {
//         if (btn.type === "overlay") {
//             emit("openHowToPlay", { source: "GameSidebar" });
//             return;
//         }

//         if (btn.type === "route") {
//             navigate(btn.to);
//             setActive(btn.id);
//         }
//     }


//     // Optional: auto-highlight based on current route
//     // (only affects badges/profile/menu)
//     const routeActiveId = (() => {
//         if (location.pathname.startsWith("/badges")) return "badges";
//         if (location.pathname.startsWith("/profile")) return "profile";
//         if (location.pathname === "/") return "menu";
//         return null;
//     })();

//     const resolvedActive = routeActiveId ?? active;

//     return (
//         <motion.aside
//             className="
//         pointer-events-auto z-[9999]
//         bg-black/60 backdrop-blur-xl
//         rounded-3xl px-4 py-5
//         flex flex-col items-center gap-5
//         shadow-[0_0_45px_rgba(0,0,0,0.65)]
//         border border-white/10
//         select-none
//       "
//             initial={{ x: -18, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ type: "spring", stiffness: 240, damping: 20 }}
//             aria-label="Game sidebar"
//         >
//             {/* Top: logo + mini profile */}
//             <div className="flex flex-col items-center gap-2 mb-1">
//                 <div className="relative">
//                     <img
//                         src="assets/images/ui/sdg-icon.png"
//                         alt="SDG Explorer"
//                         className="w-14 h-14 rounded-2xl shadow-lg border border-white/20 object-cover"
//                     />
//                     <span className="absolute inset-0 rounded-2xl border border-emerald-400/35 animate-pulse pointer-events-none" />
//                 </div>

//                 <div className="text-center leading-tight">
//                     <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">{playerRole}</p>
//                     <p className="text-sm font-semibold text-white">{playerName}</p>
//                     <p className="text-[11px] text-gray-300/90">Chapter {chapterNum}</p>
//                 </div>
//             </div>

//             <div className="w-10 border-t border-white/10 mb-1" />

//             {/* Buttons */}
//             <div className="flex flex-col items-center gap-3">
//                 {buttons.map((btn) => (
//                     <SidebarButton
//                         key={btn.id}
//                         icon={btn.icon}
//                         label={btn.label}
//                         hotkey={btn.hotkey}
//                         active={resolvedActive === btn.id}
//                         onClick={() => handleClick(btn)}
//                     />
//                 ))}
//             </div>

//             {/* <div className="mt-1 text-[10px] text-gray-300/70">
//                 1 Badges • 2 Profile • 3 Menu • H HowTo
//             </div> */}
//         </motion.aside>
//     );
// }

// function SidebarButton({ icon: Icon, label, hotkey, active, onClick }) {
//     return (
//         <motion.button
//             type="button"
//             className={`
//         w-16 h-16 flex flex-col items-center justify-center
//         rounded-2xl text-white
//         backdrop-blur-md pointer-events-auto
//         border transition-all relative outline-none
//         ${active
//                     ? "bg-emerald-500/25 border-emerald-300/80 shadow-[0_0_18px_rgba(16,185,129,0.35)]"
//                     : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-emerald-300/40"
//                 }
//         focus-visible:ring-2 focus-visible:ring-emerald-300/80
//       `}
//             whileHover={{ scale: 1.06, y: -1 }}
//             whileTap={{ scale: 0.96 }}
//             onClick={onClick}
//             aria-pressed={active}
//             aria-label={label}
//         >
//             <AnimatePresence>
//                 {active && (
//                     <motion.span
//                         className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
//                         initial={{ scale: 0, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0, opacity: 0 }}
//                     />
//                 )}
//             </AnimatePresence>
//             {/* 
//             <span className="absolute left-2 top-2 text-[9px] px-1.5 py-0.5 rounded-md bg-black/35 border border-white/10 text-gray-200/90">
//                 {hotkey}
//             </span> */}

//             <div className="text-2xl">
//                 <Icon />
//             </div>
//             <span className="text-[10px] mt-1 opacity-90">{label}</span>
//         </motion.button>
//     );
// }



// src/components/ui/GameSidebar.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { emit } from "../../utils/eventBus";
import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "../../pages/PlayerContext";

// ✅ Helper:  Get current chapter from localStorage or props
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
    // const [currentScene, setCurrentScene] = useState(getCurrentScene());

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Live state
    const [playerName, setPlayerName] = useState(getPlayerName(profile?.name));
    const [playerRole, setPlayerRole] = useState(profile?.role || "Eco Explorer");
    const [chapterNum, setChapterNum] = useState(getCurrentChapter()); // ✅ Read from stored value
    const [active, setActive] = useState(null);

    // ✅ Listen for profile and chapter changes
    useEffect(() => {
        const storedName = localStorage.getItem("playerName");
        setPlayerName(storedName || profile?.name || "Explorer");
        setPlayerRole(profile?.role || "Eco Explorer");
        setChapterNum(getCurrentChapter(currentChapter));
    }, [profile, currentChapter]);

    // ✅ Listen for localStorage changes from other tabs/windows
    useEffect(() => {
        const handleStorageChange = () => {
            setChapterNum(getCurrentChapter());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
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
            {/* Top:  logo + mini profile */}
            <div className="flex flex-col items-center gap-2 mb-1">
                <div className="relative">
                    <img
                        src="assets/images/ui/sdg-icon.png"
                        alt="SDG Explorer"
                        className="w-14 h-14 rounded-2xl shadow-lg border border-white/20 object-cover"
                    />
                    <span className="absolute inset-0 rounded-2xl border border-emerald-400/35 animate-pulse pointer-events-none" />
                </div>

                <div className="text-center leading-tight">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                        {playerRole}
                    </p>
                    <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                        {playerName}
                    </p>
                    <p className="text-[11px] text-gray-300/90">
                        Chapter {chapterNum}
                    </p>
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

            {/* Hotkey hints (optional—uncomment to show) */}
            {/* 
            <div className="mt-1 text-[10px] text-gray-300/70">
                1 Badges • 2 Profile • 3 Menu • H HowTo
            </div>
            */}
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

            {/* Hotkey indicator (optional—uncomment to show) */}
            {/* 
            <span className="absolute left-2 top-2 text-[9px] px-1.5 py-0.5 rounded-md bg-black/35 border border-white/10 text-gray-200/90">
                {hotkey}
            </span>
            */}

            <div className="text-2xl">
                <Icon />
            </div>
            <span className="text-[10px] mt-1 opacity-90">{label}</span>
        </motion.button>
    );
}