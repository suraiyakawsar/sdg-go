import GameLayout from '../components/layout/GameLayout';
import PhaserGame from '../components/game/PhaserGame';

// HUD
import BadgePopup from '../components/ui/BadgePopup';
import GameSidebar from '../components/ui/GameSidebar';
import RightSidebar from '../components/ui/RightSidebar';

export default function Game() {
  return (
    <GameLayout>
      <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
        <PhaserGame />

        {/* Overlay UI */}
        <div className="absolute inset-0">

          {/* LEFT SIDEBAR (clickable) */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto">
            <GameSidebar />
          </div>

          {/* RIGHT SIDEBAR (clickable) */}
          <div className="pointer-events-auto">
            <RightSidebar />
          </div>

          {/* HUD row (SDG + Objective bars) — visible but not blocking clicks
          <div className="pointer-events-none">
            <HUDWrapper>
              <SDGBar />
              <ObjectiveBar />
            </HUDWrapper>
          </div> */}

          {/* Badge popup (visual only, no clicks) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <BadgePopup />
          </div>

        </div>
      </div>
    </GameLayout>
  );
}
