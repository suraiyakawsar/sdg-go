// import React, { useState, useEffect } from "react";
// import { subscribe } from "../../utils/eventBus";

// export default function BadgePopup() {
//     const [badge, setBadge] = useState(null);

//     useEffect(() => {
//         const unsubscribe = subscribe("badgeEarned", (badgeName) => {
//             setBadge(badgeName);
//             setTimeout(() => setBadge(null), 2000); // Hide after 2 sec
//         });
//         return () => unsubscribe();
//     }, []);

//     if (!badge) return null;

//     return (
//         <div style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             background: "#222",
//             padding: "20px 40px",
//             border: "3px solid #FFD700",
//             color: "#FFD700",
//             fontSize: "24px",
//             fontWeight: "bold",
//             textAlign: "center",
//             borderRadius: "10px",
//             zIndex: 999
//         }}>
//             {badge}
//         </div>
//     );
// }


// components/ui/BadgePopup.jsx
import { useState, useEffect } from "react";
import { subscribe } from "../../utils/eventBus";

export default function BadgePopup({ badgeName = "Eco Hero", badgeIcon = "🛡" }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribe("badgeEarned", () => {
            setVisible(true);
            setTimeout(() => setVisible(false), 3000); // auto hide after 3s
        });
        return () => unsubscribe();
    }, []);

    if (!visible) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 rounded-xl p-6 flex flex-col items-center animate-bounce drop-shadow-2xl">
                <div className="text-6xl">{badgeIcon}</div>
                <div className="mt-4 text-white font-extrabold text-xl text-center">
                    {badgeName} Badge Earned!
                </div>
            </div>
        </div>
    );
}
