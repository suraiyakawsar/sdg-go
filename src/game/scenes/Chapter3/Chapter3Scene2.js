// src/game/scenes/Chapter3/Chapter3Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";

export default class Chapter3Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter3Scene2", {
            sceneId: "classroom2",
            jsonKey: "chapter3Data",
            jsonPath: "data/dialogues/chapters/chapter3_script.json",

            backgroundKey: "bgClassroom2",
            startNodeId: "ch3_s2_intro",
            exitUnlockedFlag: "chapter3_scene2_exit_unlocked",

            walkArea: {
                zones: [
                    { xMin: 300, xMax: 600, yMin: 650, yMax: 1000 },
                    { xMin: 100, xMax: 1300, yMin: 700, yMax: 900 },
                    { xMin: 300, xMax: 600, yMin: 650, yMax: 1000 },
                    { xMin: 50, xMax: 1920, yMin: 990, yMax: 1080 },
                ],
                topY: 700,
                bottomY: 1080
            },

            scaleFar: 0.75,
            scaleNear: 1.45,
            scaleTopOffset: 20,

            player: {
                x: 1125,
                y: 1077,
                key: "ladyy",
                frame: "frame1. png"
            },

            door: {
                x: 243,
                y: 597,
                w: 120,
                h: 220,
                texture: "bgClassroom2Door",
            },

            npcs: [
                {
                    name: "professor",
                    texture: "professor",
                    x: 470,
                    y: 680,
                    dialogueId: "ch3_s2_professor_start",
                    inspectDialogueId: "inspect_professor",
                },
                {
                    name: "screen",
                    texture: "screen",
                    x: 710,
                    y: 407,
                    scale: 0.98,
                    dialogueId: "ch3_s2_screen_read",
                    inspectDialogueId: "inspect_screen",
                }
            ],
        });

        // objectives
        this.objectiveStep = 1;
        this.objectiveCompleted = false;
        this.professorTalked = false;
        this._chapterCompleted = false;
    }

    create() {
        super.create();

        localStorage.setItem("sdgExplorer: lastRoute", "/game");
        localStorage.setItem("currentChapter", 3);
        localStorage.setItem("currentScene", "Chapter3Scene2");

        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter3Scene2");
        });

        emit("updateChapterScene", { title: "Classroom · Chapter 3" });
    }

    // --------------------------------
    // Called after BaseStoryScene.create()
    // --------------------------------
    // --------------------------------
    // Called after BaseStoryScene. create()
    // --------------------------------
    _customCreate() {
        console.log("🎬 Chapter3Scene2 _customCreate called");

        // Primary:   talk to professor (REQUIRED)
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            description: "Talk to the professor.",
            complete: false,
        });

        // Secondary: talk to screen NPC (OPTIONAL)
        emit("updateObjective", {
            slot: "secondary",
            preview: false,
            active: true,
            collected: 0,
            goal: 1,
            description: "Talk to the person at the screen.",
        });

        // Door starts locked
        this.doorUnlocked = false;
        this.screenDialogueViewed = false;

        // ✅ Listen for professor dialogue completion
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            console.log(`📤 sceneExitUnlocked - sceneId: ${sceneId}, exitFlag: ${exitFlag}`);

            if (sceneId !== "classroom2") return;
            if (exitFlag !== "chapter3_scene2_exit_unlocked") return;

            console.log("✅ Professor dialogue complete!");
            this._completeStep1AndUnlock();
        };

        on("sceneExitUnlocked", this._onSceneExitUnlocked);

        // ✅ Listen for screen dialogue flag
        this._onFlagsUpdated = (flags) => {
            console.log(`🚩 Flags updated: `, flags);

            if (flags && flags.includes("screen_dialogue_viewed") && !this.screenDialogueViewed) {
                this.screenDialogueViewed = true;
                console.log("✅ Screen dialogue completed!");

                emit("updateObjective", {
                    slot: "secondary",
                    delta: 1,
                    complete: true,
                });
                emit("updateSDGPoints", 5);
                emit("badgeEarned", "Screen Info Read!  📺");
            }
        };

        on("flagsUpdated", this._onFlagsUpdated);

        // Cleanup
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            off("sceneExitUnlocked", this._onSceneExitUnlocked);
            off("flagsUpdated", this._onFlagsUpdated);
        });
    }

    // --------------------------------
    // Unlock door when PRIMARY objective is met
    // --------------------------------
    _completeStep1AndUnlock() {
        if (this.objectiveCompleted) return;
        this.objectiveCompleted = true;

        console.log("🔓 Primary objective complete! Unlocking door.");

        // Mark PRIMARY objective complete
        emit("updateObjective", {
            slot: "primary",
            delta: 1,
            complete: true,
        });

        emit("updateSDGPoints", 10);
        emit("badgeEarned", "Professor Conversation! 💬");

        // Unlock door visuals
        this.doorUnlocked = true;

        this.objectiveStep = 2;
    }

    // --------------------------------
    // Door click override
    // --------------------------------
    _onDoorClicked() {
        console.log("🚪 Door clicked!  doorUnlocked:", this.doorUnlocked);

        if (!this.doorUnlocked) {
            console.log("❌ Door is locked.  Talk to the professor first.");
            return;
        }

        this._onChapterComplete();
    }

    // ✅ Chapter complete handler
    _onChapterComplete() {
        if (this._chapterCompleted) {
            console.log("⚠️ Chapter already completed, skipping.. .");
            return;
        }
        this._chapterCompleted = true;

        console.log("🎉 Chapter 3 Complete!");

        localStorage.setItem("chapter3_completed", "true");
        emit("updateChapterProgress");

        this.input.enabled = false;
        if (this.ladyPlayer) {
            this.ladyPlayer.setVelocity(0, 0);
            this.ladyPlayer.body.enable = false;
            this.ladyPlayer.anims?.play("idle", true);
        }

        emit("ui: showChapterSummary", { chapter: 3 });
    }
}