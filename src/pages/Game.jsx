// src/pages/Game.jsx
import { useEffect, useState } from "react";

import GameLayout from "../components/layout/GameLayout";
import PhaserGame from "../components/game/PhaserGame";

import BadgePopup from "../components/ui/BadgePopup";
import GameSidebar from "../components/ui/GameSidebar";
import RightSidebar from "../components/ui/RightSidebar";
import GameLoadingScreen from "../components/ui/GameLoadingScreen";
import { GAME_LAYOUT } from "../config/gameLayoutConfig";

export default function Game() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GameLayout>
      <div className="flex items-center justify-center w-full">
        <div className="flex w-full gap-4">
          {/* LEFT rail – hidden on very small screens, narrow on md, wider on xl */}
          <div className="hidden sm:flex items-center justify-center sm:w-16 lg:w-20 xl:w-24">
            {ready && <GameSidebar />}
          </div>

          {/* CENTER: playable canvas – grows/shrinks with viewport */}
          <div className="flex-1 flex justify-start">
            <div
              className="relative w-full max-w-5xl rounded-2xl bg-slate-950 aspect-[16/9]"
            >
              {!ready ? (
                <GameLoadingScreen />
              ) : (
                <>
                  <PhaserGame />

                  {/* overlay things that belong inside play area */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <BadgePopup />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT rail – same idea, sits outside play area
          <div className="hidden sm:flex items-center justify-center sm:w-16 lg:w-20 xl:w-24">
            {ready && <RightSidebar />}
          </div> */}
          {/* RIGHT rail (outside playable field) */}
          <div
            className="
    flex items-center justify-center h-full
    w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[420px]
  "
          >
            {ready && <RightSidebar />}
          </div>

        </div>
      </div>
    </GameLayout>
  );
}
