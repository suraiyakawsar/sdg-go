// src/pages/Game.jsx
import { useEffect, useState, useRef } from "react";

import GameLayout from "../components/layout/GameLayout";
import PhaserGame from "../components/game/PhaserGame";

import BadgePopup from "../components/ui/BadgePopup";
import GameSidebar from "../components/ui/GameSidebar";
import RightSidebar from "../components/ui/RightSidebar";
import GameLoadingScreen from "../components/ui/GameLoadingScreen";
import { on, off, emit } from "../utils/eventBus";
import GameSummary from "./GameSummary";
import ChapterSummary from "./ChapterSummary";

export default function Game() {
  const [ready, setReady] = useState(false);

  // ✅ Chapter summary state
  const [showChapterSummary, setShowChapterSummary] = useState(false);
  const [completedChapter, setCompletedChapter] = useState(null);

  // ✅ Final game summary state
  const [showGameSummary, setShowGameSummary] = useState(false);

  // ✅ Reference to the Phaser game instance
  const phaserGameRef = useRef(null);

  // ✅ LOCK SCROLLING ON GAME PAGE
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      // ✅ RESTORE SCROLLING WHEN LEAVING GAME PAGE
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Listen for chapter complete events
  useEffect(() => {
    if (!ready) return;

    const handleChapterComplete = (data) => {
      console.log("📥 Game. jsx received ui:showChapterSummary!", data); // ✅ ADD THIS
      const chapterNum = data?.chapter || data?.chapterNumber || 1;
      console.log(`📊 Chapter ${chapterNum} complete!  Showing summary...`);
      setCompletedChapter(chapterNum);
      setShowChapterSummary(true);
    };

    const handleShowGameSummary = () => {
      console.log("🏆 Showing final game summary.. .");
      setShowGameSummary(true);
    };

    // ✅ REMOVE THE DELAY - it might be causing issues
    on("ui:showChapterSummary", handleChapterComplete);
    on("ui:showGameSummary", handleShowGameSummary);

    return () => {
      off("ui:showChapterSummary", handleChapterComplete);
      off("ui:showGameSummary", handleShowGameSummary);
    };
  }, [ready]);

  // ✅ Handle continuing after chapter summary
  const handleChapterContinue = () => {
    setShowChapterSummary(false);

    if (completedChapter >= 4) {
      // Last chapter - show final game summary
      setShowGameSummary(true);
    } else {
      // ✅ Map chapter to next scene
      const nextSceneMap = {
        1: "Chapter2Scene1",
        2: "Chapter3Scene1",
        3: "Chapter4Scene1",
      };

      const nextScene = nextSceneMap[completedChapter];

      if (nextScene) {
        // ✅ Reset session counters BEFORE starting next chapter
        // localStorage.setItem("sessionSDGPoints", "0");
        // localStorage.setItem("sessionGoodChoices", "0");
        // localStorage.setItem("sessionBadChoices", "0");
        // console.log("🔄 Session counters reset before next chapter");

        // Update localStorage for the next scene
        localStorage.setItem("currentChapter", String(completedChapter + 1));
        localStorage.setItem("currentScene", nextScene);


        // ✅ Get the Phaser game instance and start the next scene
        const game = window.__PHASER_GAME__;
        if (game) {
          console.log(`🎮 Starting ${nextScene}...`);

          // Stop current scenes and start new one
          game.scene.getScenes(true).forEach(scene => {
            if (scene.scene.key !== "UIScene") {
              game.scene.stop(scene.scene.key);
            }
          });

          // const currentSceneKey = `Chapter${completedChapter}Scene3`; // or the last scene of the chapter

          // Stop all chapter scenes and start the new one
          game.scene.start(nextScene);

          console.log(`🎮 Starting ${nextScene}...`);
        } else {
          // Fallback:  reload the page with the new chapter
          console.log("⚠️ No Phaser game found, reloading.. .");
          window.location.reload();
        }
      }
    }
  };



  // ✅ Handle play again
  const handlePlayAgain = () => {
    setShowGameSummary(false);

    // Reset all game progress
    for (let i = 1; i <= 4; i++) {
      localStorage.removeItem(`chapter${i}_sdgPoints`);
      localStorage.removeItem(`chapter${i}_goodChoices`);
      localStorage.removeItem(`chapter${i}_badChoices`);
      localStorage.removeItem(`chapter${i}_completed`);
    }
    localStorage.removeItem("sessionSDGPoints");
    localStorage.removeItem("sessionGoodChoices");
    localStorage.removeItem("sessionBadChoices");
    localStorage.removeItem("sdgPoints");
    localStorage.removeItem("goodChoices");
    localStorage.removeItem("badChoices");
    localStorage.removeItem("collectedBadges");
    localStorage.setItem("sdgo: lastRoute", "/game");

    window.location.reload();
  };

  // ✅ FULL SCREEN LOADING
  if (!ready) {
    return (
      <div className="fixed inset-0 z-50">
        <GameLoadingScreen />
      </div>
    );
  }

  // ✅ GAME LAYOUT
  return (
    <GameLayout>
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">

          {/* Left Sidebar */}
          <div className="hidden sm:flex items-center justify-center sm:w-16 lg:w-20 xl:w-24 shrink-0">
            <GameSidebar />
          </div>

          {/* Game Canvas */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-5xl rounded-2xl bg-slate-950 aspect-[16/9]">
              <PhaserGame />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <BadgePopup />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex items-center justify-center h-full w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[320px] shrink-0">
            <RightSidebar />
          </div>

        </div>
      </div>

      {/* ✅ CHAPTER SUMMARY MODAL */}
      {showChapterSummary && completedChapter && (
        <ChapterSummary
          chapterNumber={completedChapter}
          onContinue={handleChapterContinue}
        />
      )}

      {/* ✅ FINAL GAME SUMMARY MODAL */}
      {showGameSummary && (
        <GameSummary
          onClose={() => setShowGameSummary(false)}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </GameLayout>
  );
}

// 🔄 Chapter 1: Session counters reset
// ✅ Good choice!  Total: 1 Session: 1
// ✅ Good choice! Total: 2 Session: 2
// ❌ Bad choice!  Total: 1 Session: 1
// 📊 Chapter 1 Summary Stats: { sdgPoints: 15, goodChoices: 2, badChoices: 1 }
// 💾 Saved Chapter 1 stats to permanent storage
// 🔄 Session counters reset before next chapter
// 🔄 Chapter 2: Session counters reset
// ✅ Good choice! Total: 3 Session: 1  ← Notice Session resets to 1! 