import { useState } from "react";
import { emit } from "../../utils/eventBus";
import { FiAward, FiUser, FiHome, FiBookOpen } from "react-icons/fi";

export default function GameSidebar() {
    return (
        <div className="
            absolute -translate-y-1/2 
            bg-black/40 backdrop-blur-md
            rounded-2xl p-3 
            flex flex-col items-center gap-6 
            z-50 shadow-xl
        ">
            {/* Logo */}
            <img
                src="/assets/images/ui/sdg-icon.png"
                alt="SDG Explorer"
                className="w-16 h-16 rounded-xl shadow-md"
            />

            {/* Buttons */}
            <SidebarButton icon={<FiAward />} label="Badges" onClick={() => emit("openBadges")} />
            <SidebarButton icon={<FiUser />} label="Profile" onClick={() => emit("openProfile")} />
            <SidebarButton icon={<FiHome />} label="Menu" onClick={() => emit("openMainMenu")} />
            <SidebarButton icon={<FiBookOpen />} label="How To Play" onClick={() => emit("openHowToPlay")} />
        </div>
    );
}

function SidebarButton({ icon, label, onClick }) {
    return (
        <button
            className="
                w-16 h-16 flex flex-col items-center justify-center
                bg-white/10 hover:bg-white/20
                text-white rounded-xl
                transition-all
                backdrop-blur-md
                pointer-events-auto
                shadow-md hover:shadow-lg
            "
            onClick={onClick}
        >
            <div className="text-2xl">{icon}</div>
            <span className="text-[10px] mt-1 opacity-80">{label}</span>
        </button>
    );
}