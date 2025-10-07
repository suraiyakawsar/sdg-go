import { useEffect, useState } from "react";
import { on, off } from "../../utils/eventBus";

export default function SDGBar() {
  const [sdgPoints, setSdgPoints] = useState(0);

  useEffect(() => {
    // Listen for updates from Phaser or other parts of the app
    const handleSdgUpdate = (points) => {
      setSdgPoints(points);
    };

    on("updateSDGPoints", handleSdgUpdate);

    return () => {
      off("updateSDGPoints", handleSdgUpdate);
    };
  }, []);

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
      <img
        src="/assets/ui/sdg-icon.png"
        alt="SDG Icon"
        className="w-6 h-6"
      />
      <div className="flex flex-col items-start">
        <p className="text-xs text-gray-300 uppercase tracking-wider">
          SDG Points
        </p>
        <div className="flex items-center gap-2">
          <div className="w-40 bg-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${Math.min(sdgPoints, 100)}%` }}
            ></div>
          </div>
          <span className="text-sm font-semibold">{sdgPoints}</span>
        </div>
      </div>
    </div>
  );
}
