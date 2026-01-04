// src/game/scenes/Chapter3/Chapter3Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { saveChapterStats } from "../../../utils/gameSummary";


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
                topY: 840,
                bottomY: 1077,
                leftTopX: 500,
                rightTopX: 1000,
                leftBottomX: 160,
                rightBottomX: 1070,
            },

            scaleFar: 0.83,
            scaleNear: 1.45,
            scaleTopOffset: 20,

            player: {
                x: 1000,
                y: 1077,
                key: "ladyy",
                frame: "frame1.png"
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
        console.log("🎮 Chapter3Scene2.create() - BEFORE super. create()");
        console.log("Session values on boot:", {
            sessionSDGPoints: localStorage.getItem("sessionSDGPoints"),
            sessionGoodChoices: localStorage.getItem("sessionGoodChoices"),
            sessionBadChoices: localStorage.getItem("sessionBadChoices"),
        });


        super.create();

        console.log("🎮 Chapter3Scene2.create() - AFTER super.create()");
        console.log("Session values after super:", {
            sessionSDGPoints: localStorage.getItem("sessionSDGPoints"),
            sessionGoodChoices: localStorage.getItem("sessionGoodChoices"),
            sessionBadChoices: localStorage.getItem("sessionBadChoices"),
        });



        localStorage.setItem("sdgo:lastRoute", "/game");
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
        // Guard check FIRST
        if (this._chapterCompleted) {
            console.log("⚠️ Chapter already completed, skipping.. .");
            return;
        }
        this._chapterCompleted = true;

        console.log("🏁 _onChapterComplete called!");
        console.log("🎉 Chapter 3 Complete!");

        // ✅ Log BEFORE
        console.log("Session values BEFORE saveChapterStats:", {
            sessionSDGPoints: localStorage.getItem("sessionSDGPoints"),
            sessionGoodChoices: localStorage.getItem("sessionGoodChoices"),
            sessionBadChoices: localStorage.getItem("sessionBadChoices"),
        });

        // ✅ Save chapter stats (this resets session counters)
        saveChapterStats(3);

        // ✅ Log AFTER
        console.log("Session values AFTER saveChapterStats:", {
            sessionSDGPoints: localStorage.getItem("sessionSDGPoints"),
            sessionGoodChoices: localStorage.getItem("sessionGoodChoices"),
            sessionBadChoices: localStorage.getItem("sessionBadChoices"),
        });

        localStorage.setItem("chapter3_completed", "true");
        emit("updateChapterProgress");

        this.input.enabled = false;
        if (this.ladyPlayer) {
            this.ladyPlayer.setVelocity(0, 0);
            this.ladyPlayer.body.enable = false;
            this.ladyPlayer.anims?.play("idle", true);
        }

        emit("ui:showChapterSummary", { chapter: 3 });
    }
}