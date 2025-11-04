import { useEffect, useState } from "react";
import { subscribe } from "../../utils/eventBus";
import { Progress } from "./progress"; // optional: reuse SDGBar Progress component

export default function ObjectiveBar() {
    const [progress, setProgress] = useState({ collected: 0, goal: 2 });

    useEffect(() => {
        const unsubscribe = subscribe("updateObjective", (data) => {
            setProgress(data);
        });
        return () => unsubscribe();
    }, []);

    const { collected, goal } = progress;
    const percentage = Math.min((collected / goal) * 100, 100);

    return (
        <div className="fixed top-3 left-50 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-md rounded-full shadow-lg">
            {/* Icon */}
            <img
                src="/assets/images/ui/obj-icon.png"
                alt="Objective Icon"
                className="w-6 h-6"
            />

            {/* Text + Bar */}
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
