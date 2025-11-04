import { useEffect, useState } from "react";
import { on, off } from "../../utils/eventBus";
import { Progress } from "./progress";

export default function SDGBar() {
  const [sdgPoints, setSdgPoints] = useState(0);

  useEffect(() => {
    const handleSdgUpdate = (points) => {
      const safePoints = Math.max(0, Number(points) || 0);
      setSdgPoints(safePoints);
    };

    on("updateSDGPoints", handleSdgUpdate);
    return () => off("updateSDGPoints", handleSdgUpdate);
  }, []);

  return (
    <div className="mx-10 mt-10 fixed top-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
      <img
        src="assets/images/ui/sdg-icon.png"
        alt="SDG Icon"
        className="w-6 h-6"
      />

      <div className="flex flex-col items-start w-52">
        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">
          SDG Points
        </p>

        <div className="flex items-center gap-2 w-full">
          <Progress value={Math.min(sdgPoints, 100)} />
          <span className="text-sm font-semibold">{sdgPoints}</span>
        </div>
      </div>
    </div>
  );
}
