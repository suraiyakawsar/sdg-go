import { useState, useEffect } from "react";
import { subscribe } from "../../utils/eventBus";

export default function BadgePopup({ badgeName = "Achievement", badgeIcon = "🏆" }) {
    const [visible, setVisible] = useState(false);
    const [earnedBadge, setEarnedBadge] = useState({ name: badgeName, icon: badgeIcon });

    useEffect(() => {
        const unsubscribe = subscribe("badgeEarned", (badge) => {
            setEarnedBadge({
                name: badge || badgeName,
                icon: badgeIcon
            });

            setVisible(true);

            setTimeout(() => setVisible(false), 3300);
        });

        return () => unsubscribe();
    }, []);

    if (!visible) return null;

    return (
        <div className="absolute inset-0 flex items-start justify-center pt-24 pointer-events-none z-[9999] overflow-visible">
            <div
                className="
                    relative px-8 py-5 min-w-[320px]
                    backdrop-blur-xl rounded-2xl
                    bg-gradient-to-br from-[#2a2a2a]/90 to-[#1b1b1b]/90 
                    border border-[#ffd774]/30 shadow-2xl
                    flex flex-row items-center gap-4
                    animate-achievementIn
                "
            >
                {/* Left gold bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-b from-[#ffde8a] to-[#caa85a] rounded-l-xl animate-goldPulse"></div>

                {/* Icon */}
                <div className="text-5xl animate-impactBounce">{earnedBadge.icon}</div>

                {/* Text block */}
                <div className="flex flex-col">
                    <span className="text-[#ffefc8] font-bold text-lg tracking-wide animate-shimmer bg-clip-text">
                        ACHIEVEMENT UNLOCKED
                    </span>
                    <span className="text-white text-xl font-semibold drop-shadow-md tracking-wide">
                        {earnedBadge.name}
                    </span>
                </div>

                {/* Spark particles */}
                <div className="absolute -top-2 right-4 text-yellow-300 animate-spark1">✦</div>
                <div className="absolute -bottom-2 left-6 text-yellow-200 animate-spark2">✧</div>

                {/* Animation keyframes */}
                <style>{`
                    /* Entrance slide + pop */
                    @keyframes achievementIn {
                        0% { 
                            opacity: 0; 
                            transform: translateY(-40px) scale(0.9); 
                        }
                        50% { 
                            opacity: 1; 
                            transform: translateY(4px) scale(1.03); 
                        }
                        100% { 
                            opacity: 1; 
                            transform: translateY(0) scale(1); 
                        }
                    }
                    .animate-achievementIn {
                        animation: achievementIn 0.7s cubic-bezier(0.25, 0.1, 0.25, 1.4) forwards;
                    }

                    /* Trophy bounce */
                    @keyframes impactBounce {
                        0% { transform: scale(0.6) rotate(-5deg); }
                        50% { transform: scale(1.15) rotate(3deg); }
                        100% { transform: scale(1) rotate(0); }
                    }
                    .animate-impactBounce {
                        animation: impactBounce 0.6s ease-out;
                    }

                    /* Gold shimmer sweeping across text */
                    @keyframes shimmer {
                        0% { 
                            opacity: 0.4; 
                            filter: brightness(1); 
                        }
                        50% { 
                            opacity: 1; 
                            filter: brightness(1.8); 
                        }
                        100% { 
                            opacity: 0.5; 
                            filter: brightness(1); 
                        }
                    }
                    .animate-shimmer {
                        animation: shimmer 1.8s ease-in-out infinite;
                    }

                    /* Gold pulse on left bar */
                    @keyframes goldPulse {
                        0% { opacity: 0.6; }
                        50% { opacity: 1; }
                        100% { opacity: 0.6; }
                    }
                    .animate-goldPulse {
                        animation: goldPulse 2s ease-in-out infinite;
                    }

                    /* Sparkles */
                    @keyframes spark1 {
                        0% { opacity: 0; transform: scale(0.3) translateY(-4px); }
                        40% { opacity: 1; transform: scale(1) translateY(0px); }
                        100% { opacity: 0; transform: scale(1) translateY(-6px); }
                    }
                    @keyframes spark2 {
                        0% { opacity: 0; transform: scale(0.4) translateY(4px); }
                        40% { opacity: 1; transform: scale(1) translateY(0px); }
                        100% { opacity: 0; transform: scale(1) translateY(6px); }
                    }
                    .animate-spark1 { animation: spark1 1.6s ease-out infinite; }
                    .animate-spark2 { animation: spark2 1.6s ease-out infinite; }
                `}</style>
            </div>
        </div>
    );
}
