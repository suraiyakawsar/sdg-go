import ChapterHeader from "./components/ChapterHeader";
import { useState, useEffect } from "react";
import { on } from "./utils/eventBus";

export default function GameContainer() {
    const [chapterTitle, setChapterTitle] = useState("Campus Life · Chapter 1");

    useEffect(() => {
        const unsubscribe = on("updateChapterScene", ({ title }) => {
            setChapterTitle(title);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <ChapterHeader title={chapterTitle} />
            {/* Phaser canvas */}
        </div>
    );
}
