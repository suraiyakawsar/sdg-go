// import { useEffect, useState } from "react";
// import { subscribe } from "../../utils/eventBus";

// export default function ObjectiveBar() {
//     const [progress, setProgress] = useState({ collected: 0, goal: 2 });

//     useEffect(() => {
//         const unsubscribe = subscribe("updateObjective", (payload) => {
//             setProgress((prev) => {
//                 // Case 1: Phaser sends a number → treat as +increment
//                 if (typeof payload === "number") {
//                     const newCollected = Math.min(prev.collected + payload, prev.goal);
//                     return { ...prev, collected: newCollected };
//                 }

//                 // Case 2: Phaser sends an object { collected, goal }
//                 if (payload && typeof payload === "object") {
//                     return {
//                         collected:
//                             typeof payload.collected === "number"
//                                 ? payload.collected
//                                 : prev.collected,
//                         goal:
//                             typeof payload.goal === "number"
//                                 ? payload.goal
//                                 : prev.goal,
//                     };
//                 }

//                 return prev;
//             });
//         });

//         return () => unsubscribe();
//     }, []);

//     const { collected, goal } = progress;
//     const percentage = Math.min((collected / (goal || 1)) * 100, 100);
//     const isComplete = collected >= goal && goal > 0;

//     return (
//         <div className="fixed top-2/12 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
//             <div
//                 className={`
//                     flex items-center gap-3 px-6 py-3
//                     rounded-full shadow-lg border border-white/15
//                     backdrop-blur-xl bg-black/55
//                     ${isComplete ? "ring-2 ring-emerald-400/60" : ""}
//                 `}
//             >
//                 {/* Icon */}
//                 <div
//                     className={`
//                         w-8 h-8 rounded-full flex items-center justify-center 
//                         bg-gradient-to-br from-emerald-400 to-cyan-500
//                         text-xs font-bold text-black shadow-md
//                         ${isComplete ? "animate-pulse" : ""}
//                     `}
//                 >
//                     🎯
//                 </div>

//                 {/* Text + progress bar */}
//                 <div className="flex flex-col w-44">
//                     <div className="flex items-center justify-between mb-1">
//                         <p className="text-[10px] uppercase tracking-[0.16em] text-gray-300">
//                             Objective
//                         </p>
//                         <span className="text-xs font-semibold text-gray-100">
//                             {collected}/{goal}
//                         </span>
//                     </div>

//                     <div className="w-full h-2.5 bg-gray-800/80 rounded-full overflow-hidden">
//                         <div
//                             className={`
//                                 h-full rounded-full
//                                 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500
//                                 transition-all duration-400
//                                 ${isComplete ? "shadow-[0_0_12px_rgba(34,197,94,0.65)]" : ""}
//                             `}
//                             style={{ width: `${percentage}%` }}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }



import { useEffect, useState } from "react";
import { subscribe } from "../../utils/eventBus";

export default function ObjectiveBar({ sidebarMode = false }) {
    const [progress, setProgress] = useState({ collected: 0, goal: 2 });

    useEffect(() => {
        const unsubscribe = subscribe("updateObjective", (data) => {
            if (typeof data === "number") {
                // fallback for old emissions
                setProgress(prev => ({
                    ...prev,
                    collected: prev.collected + data
                }));
            } else {
                setProgress(data);
            }
        });

        return () => unsubscribe();
    }, []);

    const { collected, goal } = progress;
    const percentage = Math.min((collected / goal) * 100, 100);

    /* ------------------------------
      ⭐ SIDEBAR MODE
    --------------------------------*/
    if (sidebarMode) {
        return (
            <div className="flex flex-col gap-2 w-full">
                {/* Label */}
                <p className="text-xs text-gray-300 uppercase tracking-wider">
                    Objective
                </p>

                {/* Bar + Count */}
                <div className="flex items-center gap-3 w-full">
                    <div className="flex-grow h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>

                    <span className="text-sm font-semibold text-white">
                        {collected}/{goal}
                    </span>
                </div>
            </div>
        );
    }

    /* ------------------------------
      ⭐ DEFAULT TOP HUD MODE
    --------------------------------*/
    return (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-md rounded-full shadow-lg pointer-events-auto">
            <img
                src="/assets/images/ui/obj-icon.png"
                alt="Objective Icon"
                className="w-6 h-6"
            />

            <div className="flex flex-col w-52">
                <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">
                    Objective
                </p>

                <div className="flex items-center gap-2 w-full">
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-semibold text-white">
                        {collected}/{goal}
                    </span>
                </div>
            </div>
        </div>
    );
}
