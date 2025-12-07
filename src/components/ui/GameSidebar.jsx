// import { useState } from "react";
// import { emit } from "../../utils/eventBus";
// import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";

// export default function GameSidebar() {
//     return (
//         <div className="
//             absolute -translate-y-1/2 
//             bg-black/40 backdrop-blur-md
//             rounded-2xl p-3 
//             flex flex-col items-center gap-6 
//             z-50 shadow-xl
//         ">
//             {/* Logo */}
//             <img
//                 src="/assets/images/ui/sdg-icon.png"
//                 alt="SDG Explorer"
//                 className="w-16 h-16 rounded-xl shadow-md"
//             />

//             {/* Buttons */}
//             <SidebarButton icon={<FiAward />} label="Badges" onClick={() => emit("openBadges")} />
//             <SidebarButton icon={<FiUser />} label="Profile" onClick={() => emit("openProfile")} />
//             <SidebarButton icon={<FiHome />} label="Menu" onClick={() => emit("openMainMenu")} />
//             <SidebarButton icon={<FiBookOpen />} label="How To Play" onClick={() => emit("openHowToPlay")} />
//         </div>
//     );
// }

// function SidebarButton({ icon, label, onClick }) {
//     return (
//         <button
//             className="
//                 w-16 h-16 flex flex-col items-center justify-center
//                 bg-white/10 hover:bg-white/20
//                 text-white rounded-xl
//                 transition-all
//                 backdrop-blur-md
//                 pointer-events-auto
//                 shadow-md hover:shadow-lg
//             "
//             onClick={onClick}
//         >
//             <div className="text-2xl">{icon}</div>
//             <span className="text-[10px] mt-1 opacity-80">{label}</span>
//         </button>
//     );
// }


// import { useState } from "react";
// import { emit } from "../../utils/eventBus";
// import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { usePlayer } from "../../pages/PlayerContext"; // ✅ uses your player profile

// const buttons = [
//     {
//         id: "badges",
//         icon: FiAward,
//         label: "Badges",
//         event: "openBadges",
//     },
//     {
//         id: "profile",
//         icon: FiUser,
//         label: "Profile",
//         event: "openProfile",
//     },
//     {
//         id: "menu",
//         icon: FiHome,
//         label: "Menu",
//         event: "openMainMenu",
//     },
//     {
//         id: "howto",
//         icon: FiBookOpen,
//         label: "How To Play",
//         event: "openHowToPlay",
//     },
// ];

// export default function GameSidebar({ currentChapter = 1 }) {
//     const { profile } = usePlayer();
//     const [active, setActive] = useState(null);

//     const playerName = profile?.name || "Explorer";
//     const playerRole = profile?.role || "Eco Explorer";

//     function handleClick(btn) {
//         setActive(btn.id);
//         emit(btn.event);
//     }

//     return (
//         <motion.div
//             className="
//         absolute -translate-y-1/2
//         bg-black/60 backdrop-blur-xl
//         rounded-3xl px-4 py-5
//         flex flex-col items-center gap-5
//         z-50 shadow-[0_0_40px_rgba(0,0,0,0.6)]
//         border border-white/10
//       "
//             initial={{ x: -40, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ type: "spring", stiffness: 220, damping: 18 }}
//         >
//             {/* Top: logo + mini profile */}
//             <div className="flex flex-col items-center gap-2 mb-1">
//                 <div className="relative">
//                     <img
//                         src="/assets/images/ui/sdg-icon.png"
//                         alt="SDG Explorer"
//                         className="w-14 h-14 rounded-2xl shadow-lg border border-white/20 object-cover"
//                     />
//                     {/* small glow ring */}
//                     <span className="absolute inset-0 rounded-2xl border border-emerald-400/40 animate-pulse pointer-events-none" />
//                 </div>

//                 <div className="text-center">
//                     <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
//                         {playerRole}
//                     </p>
//                     <p className="text-sm font-semibold text-white">
//                         {playerName}
//                     </p>
//                     <p className="text-[11px] text-gray-300/90">
//                         Chapter {profile?.currentChapter ?? currentChapter}
//                     </p>
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
//                         active={active === btn.id}
//                         onClick={() => handleClick(btn)}
//                     />
//                 ))}
//             </div>
//         </motion.div>
//     );
// }

// function SidebarButton({ icon: Icon, label, active, onClick }) {
//     return (
//         <motion.button
//             className={`
//         w-16 h-16 flex flex-col items-center justify-center
//         rounded-2xl
//         text-white
//         backdrop-blur-md
//         pointer-events-auto
//         shadow-md
//         border
//         transition-all
//         relative
//         ${active
//                     ? "bg-emerald-500/25 border-emerald-300/80 shadow-emerald-500/40"
//                     : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-emerald-300/40"
//                 }
//       `}
//             whileHover={{ scale: 1.06, y: -1 }}
//             whileTap={{ scale: 0.96 }}
//             onClick={onClick}
//         >
//             {/* tiny active indicator dot */}
//             {active && (
//                 <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
//             )}

//             <div className="text-2xl">
//                 <Icon />
//             </div>
//             <span className="text-[10px] mt-1 opacity-85">{label}</span>
//         </motion.button>
//     );
// }


// // src/components/ui/GameSidebar.jsx
// import { useState } from "react";
// import { emit } from "../../utils/eventBus";
// import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { usePlayer } from "../../pages/PlayerContext";

// const buttons = [
//     { id: "badges", icon: FiAward, label: "Badges", event: "openBadges" },
//     { id: "profile", icon: FiUser, label: "Profile", event: "openProfile" },
//     { id: "menu", icon: FiHome, label: "Menu", event: "openMainMenu" },
//     { id: "howto", icon: FiBookOpen, label: "How To Play", event: "openHowToPlay" },
// ];

// export default function GameSidebar({ currentChapter = 1 }) {
//     const { profile } = usePlayer();
//     const [active, setActive] = useState(null);

//     const playerName = profile?.name || "Explorer";
//     const playerRole = profile?.role || "Eco Explorer";

//     function handleClick(btn) {
//         setActive(btn.id);
//         emit(btn.event);
//     }

//     return (
//         <motion.div
//             className="
//         bg-black/60 backdrop-blur-xl
//         rounded-3xl px-4 py-5
//         flex flex-col items-center gap-5
//         z-50 shadow-[0_0_40px_rgba(0,0,0,0.6)]
//         border border-white/10
//       "
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ type: "spring", stiffness: 220, damping: 18 }}
//         >
//             {/* Top: logo + mini profile */}
//             <div className="flex flex-col items-center gap-2 mb-1">
//                 <div className="relative">
//                     <img
//                         src="/assets/images/ui/sdg-icon.png"
//                         alt="SDG Explorer"
//                         className="w-14 h-14 rounded-2xl shadow-lg border border-white/20 object-cover"
//                     />
//                     <span className="absolute inset-0 rounded-2xl border border-emerald-400/40 animate-pulse pointer-events-none" />
//                 </div>

//                 <div className="text-center">
//                     <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
//                         {playerRole}
//                     </p>
//                     <p className="text-sm font-semibold text-white">{playerName}</p>
//                     <p className="text-[11px] text-gray-300/90">
//                         Chapter {profile?.currentChapter ?? currentChapter}
//                     </p>
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
//                         active={active === btn.id}
//                         onClick={() => handleClick(btn)}
//                     />
//                 ))}
//             </div>
//         </motion.div>
//     );
// }

// function SidebarButton({ icon: Icon, label, active, onClick }) {
//     return (
//         <motion.button
//             className={`
//         w-16 h-16 flex flex-col items-center justify-center
//         rounded-2xl
//         text-white
//         backdrop-blur-md
//         pointer-events-auto
//         shadow-md
//         border
//         transition-all
//         relative
//         ${active
//                     ? "bg-emerald-500/25 border-emerald-300/80 shadow-emerald-500/40"
//                     : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-emerald-300/40"
//                 }
//       `}
//             whileHover={{ scale: 1.06, y: -1 }}
//             whileTap={{ scale: 0.96 }}
//             onClick={onClick}
//         >
//             {active && (
//                 <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
//             )}
//             <div className="text-2xl">
//                 <Icon />
//             </div>
//             <span className="text-[10px] mt-1 opacity-85">{label}</span>
//         </motion.button>
//     );
// }

// import { useState } from "react";
// import { emit } from "../../utils/eventBus";
// import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { usePlayer } from "../../pages/PlayerContext";

// const buttons = [
//     { id: "badges", icon: FiAward, label: "Badges", event: "openBadges" },
//     { id: "profile", icon: FiUser, label: "Profile", event: "openProfile" },
//     { id: "menu", icon: FiHome, label: "Menu", event: "openMainMenu" },
//     { id: "howto", icon: FiBookOpen, label: "How To Play", event: "openHowToPlay" },
// ];

// export default function GameSidebar({ currentChapter = 1 }) {
//     const { profile } = usePlayer();
//     const [active, setActive] = useState(null);

//     const playerName = profile?.name || "Explorer";
//     const playerRole = profile?.role || "Eco Explorer";

//     function handleClick(btn) {
//         setActive(btn.id);
//         emit(btn.event);
//     }

//     return (
//         <motion.div
//             className="
//         bg-black/60 backdrop-blur-xl
//         rounded-3xl px-4 py-5
//         flex flex-col items-center gap-5
//         z-50 shadow-[0_0_40px_rgba(0,0,0,0.6)]
//         border border-white/10
//       "
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ type: "spring", stiffness: 220, damping: 18 }}
//         >
//             {/* Top: logo + mini profile */}
//             <div className="flex flex-col items-center gap-2 mb-1">
//                 <div className="relative">
//                     <img
//                         src="/assets/images/ui/sdg-icon.png"
//                         alt="SDG Explorer"
//                         className="w-14 h-14 rounded-2xl shadow-lg border border-white/20 object-cover"
//                     />
//                     {/* glow ring */}
//                     <span className="absolute inset-0 rounded-2xl border border-emerald-400/40 animate-pulse pointer-events-none" />
//                 </div>

//                 <div className="text-center">
//                     <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
//                         {playerRole}
//                     </p>
//                     <p className="text-sm font-semibold text-white">{playerName}</p>
//                     <p className="text-[11px] text-gray-300/90">
//                         Chapter {profile?.currentChapter ?? currentChapter}
//                     </p>
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
//                         active={active === btn.id}
//                         onClick={() => handleClick(btn)}
//                     />
//                 ))}
//             </div>
//         </motion.div>
//     );
// }

// function SidebarButton({ icon: Icon, label, active, onClick }) {
//     return (
//         <motion.button
//             className={`
//         w-16 h-16 flex flex-col items-center justify-center
//         rounded-2xl
//         text-white
//         backdrop-blur-md
//         pointer-events-auto
//         shadow-md
//         border
//         transition-all
//         relative
//         ${active
//                     ? "bg-emerald-500/25 border-emerald-300/80 shadow-emerald-500/40"
//                     : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-emerald-300/40"
//                 }
//       `}
//             whileHover={{ scale: 1.06, y: -1 }}
//             whileTap={{ scale: 0.96 }}
//             onClick={onClick}
//         >
//             {active && (
//                 <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
//             )}
//             <div className="text-2xl">
//                 <Icon />
//             </div>
//             <span className="text-[10px] mt-1 opacity-85">{label}</span>
//         </motion.button>
//     );
// }


// // src/components/ui/GameSidebar.jsx
// import { useState } from "react";
// import { emit } from "../../utils/eventBus";
// import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { usePlayer } from "../../pages/PlayerContext";

// const buttons = [
//     { id: "badges", icon: FiAward, label: "Badges", event: "openBadges" },
//     { id: "profile", icon: FiUser, label: "Profile", event: "openProfile" },
//     { id: "menu", icon: FiHome, label: "Menu", event: "openMainMenu" },
//     { id: "howto", icon: FiBookOpen, label: "How To Play", event: "openHowToPlay" },
// ];

// export default function GameSidebar({ currentChapter = 1 }) {
//     const { profile } = usePlayer();
//     const [active, setActive] = useState(null);

//     const playerName = profile?.name || "Explorer";
//     const playerRole = profile?.role || "Eco Explorer";

//     function handleClick(btn) {
//         setActive(btn.id);
//         emit(btn.event);
//     }

//     return (
//         <motion.div
//             className="
//         bg-black/60 backdrop-blur-xl
//         rounded-3xl px-4 py-5
//         flex flex-col items-center gap-5
//         z-50 shadow-[0_0_40px_rgba(0,0,0,0.6)]
//         border border-white/10
//       "
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ type: "spring", stiffness: 220, damping: 18 }}
//         >
//             {/* Top: logo + mini profile */}
//             <div className="flex flex-col items-center gap-2 mb-1">
//                 <div className="relative">
//                     <img
//                         src="/assets/images/ui/sdg-icon.png"
//                         alt="SDG Explorer"
//                         className="w-14 h-14 rounded-2xl shadow-lg border border-white/20 object-cover"
//                     />
//                     <span className="absolute inset-0 rounded-2xl border border-emerald-400/40 animate-pulse pointer-events-none" />
//                 </div>

//                 <div className="text-center">
//                     <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
//                         {playerRole}
//                     </p>
//                     <p className="text-sm font-semibold text-white">{playerName}</p>
//                     <p className="text-[11px] text-gray-300/90">
//                         Chapter {profile?.currentChapter ?? currentChapter}
//                     </p>
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
//                         active={active === btn.id}
//                         onClick={() => handleClick(btn)}
//                     />
//                 ))}
//             </div>
//         </motion.div>
//     );
// }

// function SidebarButton({ icon: Icon, label, active, onClick }) {
//     return (
//         <motion.button
//             className={`
//         w-16 h-16 flex flex-col items-center justify-center
//         rounded-2xl
//         text-white
//         backdrop-blur-md
//         pointer-events-auto
//         shadow-md
//         border
//         transition-all
//         relative
//         ${active
//                     ? "bg-emerald-500/25 border-emerald-300/80 shadow-emerald-500/40"
//                     : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-emerald-300/40"
//                 }
//       `}
//             whileHover={{ scale: 1.06, y: -1 }}
//             whileTap={{ scale: 0.96 }}
//             onClick={onClick}
//         >
//             {active && (
//                 <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
//             )}
//             <div className="text-2xl">
//                 <Icon />
//             </div>
//             <span className="text-[10px] mt-1 opacity-85">{label}</span>
//         </motion.button>
//     );
// }

// src/components/ui/GameSidebar.jsx
import { useState } from "react";
import { emit } from "../../utils/eventBus";
import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";
import { motion } from "framer-motion";
import { usePlayer } from "../../pages/PlayerContext";

const buttons = [
    { id: "badges", icon: FiAward, label: "Badges", event: "openBadges" },
    { id: "profile", icon: FiUser, label: "Profile", event: "openProfile" },
    { id: "menu", icon: FiHome, label: "Menu", event: "openMainMenu" },
    { id: "howto", icon: FiBookOpen, label: "How To Play", event: "openHowToPlay" },
];

export default function GameSidebar({ currentChapter = 1 }) {
    const { profile } = usePlayer();
    const [active, setActive] = useState(null);

    const playerName = profile?.name || "Explorer";
    const playerRole = profile?.role || "Eco Explorer";

    function handleClick(btn) {
        setActive(btn.id);
        emit(btn.event);
    }

    return (
        <motion.div
            className="
        bg-black/60 backdrop-blur-xl
        rounded-3xl px-4 py-5
        flex flex-col items-center gap-5
        z-50 shadow-[0_0_40px_rgba(0,0,0,0.6)]
        border border-white/10
      "
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
            {/* Top: logo + mini profile */}
            <div className="flex flex-col items-center gap-2 mb-1">
                <div className="relative">
                    <img
                        src="/assets/images/ui/sdg-icon.png"
                        alt="SDG Explorer"
                        className="w-14 h-14 rounded-2xl shadow-lg border border-white/20 object-cover"
                    />
                    <span className="absolute inset-0 rounded-2xl border border-emerald-400/40 animate-pulse pointer-events-none" />
                </div>

                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                        {playerRole}
                    </p>
                    <p className="text-sm font-semibold text-white">{playerName}</p>
                    <p className="text-[11px] text-gray-300/90">
                        Chapter {profile?.currentChapter ?? currentChapter}
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
                        active={active === btn.id}
                        onClick={() => handleClick(btn)}
                    />
                ))}
            </div>
        </motion.div>
    );
}

function SidebarButton({ icon: Icon, label, active, onClick }) {
    return (
        <motion.button
            className={`
        w-16 h-16 flex flex-col items-center justify-center
        rounded-2xl
        text-white
        backdrop-blur-md
        pointer-events-auto
        shadow-md
        border
        transition-all
        relative
        ${active
                    ? "bg-emerald-500/25 border-emerald-300/80 shadow-emerald-500/40"
                    : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-emerald-300/40"
                }
      `}
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
        >
            {active && (
                <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            )}
            <div className="text-2xl">
                <Icon />
            </div>
            <span className="text-[10px] mt-1 opacity-85">{label}</span>
        </motion.button>
    );
}
