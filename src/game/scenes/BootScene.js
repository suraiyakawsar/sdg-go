import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.atlas(
            "ladyy",
            "assets/images/characters/ladyy.png",
            "assets/images/characters/spritesheet.json"
        );
    }

    create() {
        // ✅ NEW: Try to read saved scene first
        let sceneToStart = localStorage.getItem("currentScene");

        // If no scene saved, try to determine from chapter
        if (!sceneToStart) {
            const chapter = localStorage.getItem("currentChapter") || "1";
            console.log("📖 No scene saved, using chapter:", chapter);

            // Map chapter to first scene of that chapter
            const chapterMap = {
                "1": "Chapter1Scene",
                "2": "Chapter2Scene1",
                "3": "Chapter3Scene1",
                "4": "Chapter4Scene1",
            };

            sceneToStart = chapterMap[chapter] || "Chapter1Scene";
        }

        console.log("🎮 BootScene loading:", sceneToStart);
        this.scene.start(sceneToStart);
    }
}