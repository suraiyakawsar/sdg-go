// src/components/layout/GameLayout.jsx
import { GAME_LAYOUT } from "../../config/gameLayoutConfig";
import ChapterHeader from "../../pages/ChapterHeader";
import { useState, useEffect } from "react";
import { on } from "../../utils/eventBus"; // make sure path is correct

export default function GameLayout({ children }) {

    const [chapterTitle, setChapterTitle] = useState("Campus Life · Chapter 1");

    useEffect(() => {
        const unsubscribe = on("updateChapterScene", ({ title }) => {
            setChapterTitle(title);
        });

        return () => unsubscribe();
    }, []);



    return (
        <div
            className="
                h-screen w-screen
                overflow-hidden
                bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900
                flex items-center justify-center
            "
        >
            <div
                className="relative w-full h-full flex items-center justify-center"
                style={{ maxWidth: GAME_LAYOUT.shellMaxWidth }}
            >
                {/* Ambient glow */}
                <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />

                {/* Main shell */}
                <div
                    className="
                        relative
                        h-[90vh] w-[96vw]
                        max-w-full
                        rounded-3xl
                        bg-black/70
                        border border-white/10
                        shadow-[0_25px_80px_rgba(0,0,0,0.9)]
                        backdrop-blur-2xl
                        flex flex-col
                        overflow-hidden
                    "
                >
                    {/* Top meta bar – fixed height */}
                    <div className="flex items-center justify-between px-5 h-13 border-b border-white/5 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80">
                        <ChapterHeader title={chapterTitle} />

                        <div className="flex items-center gap-4 text-[10px] text-slate-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                            <span className="w-40">Progress autosaves on this device</span>
                        </div>
                    </div>

                    {/* Content area: fills remaining height, no scroll */}
                    <div className="flex-1 px-4 py-4 flex items-center justify-center overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
