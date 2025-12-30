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
    const timer = setTimeout(() => setReady(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  // ✅ FULL SCREEN LOADING - before GameLayout renders
  if (!ready) {
    return (
      <div className="fixed inset-0 z-50">
        <GameLoadingScreen />
      </div>
    );
  }
  // ✅ GAME LAYOUT - after loading
  return (
    <GameLayout>
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">

          <div className="hidden sm:flex items-center justify-center sm:w-16 lg:w-20 xl:w-24 shrink-0">
            <GameSidebar />
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-5xl rounded-2xl bg-slate-950 aspect-[16/9]">
              <PhaserGame />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <BadgePopup />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center h-full w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[320px] shrink-0">
            <RightSidebar />
          </div>

        </div>
      </div>
    </GameLayout>
  );
}