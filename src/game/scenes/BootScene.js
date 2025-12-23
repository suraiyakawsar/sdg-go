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

    // create() {
    //     //Hallway Scene
    //     this.scene.start('Chapter1Scene');

    //     //Classroom Scene
    //     // this.scene.start('Chapter1Scene2');

    //     //Cafeteria Scene
    //     // this.scene.start('Chapter1Scene3');

    //     //Food Bank Scene
    //     // this.scene.start('Chapter2Scene1');

    //     //Community Center STREET Scene
    //     // this.scene.start('Chapter2Scene2');

    //     //Park Scene SEATED FRIENDLY NPC
    //     // this.scene.start('Chapter2Scene3');

    //     //Garden Scene
    //     // this.scene.start('Chapter3Scene1');

    //     //Classroom Scene 2
    //     // this.scene.start('Chapter3Scene2'); //come back to it to fix walk area

    //     //Nighttime Courtyard Scene
    //     // this.scene.start('Chapter3Scene3');

    //     //Pond Scene
    //     // this.scene.start('Chapter4Scene1');

    //     //Bus Stop Scene
    //     // this.scene.start('Chapter4Scene3');
    // }

    //     create() {
    //         // ✅ NEW: Read saved scene from localStorage
    //         const savedScene = localStorage.getItem("currentScene") || "Chapter1Scene";
    //         console.log("🎮 BootScene loading:", savedScene);

    //         // Start the saved scene (or default to Chapter1Scene)
    //         this.scene.start(savedScene);
    //     }
    // }

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