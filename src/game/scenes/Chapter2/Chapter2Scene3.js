// src/scenes/chapter2/Chapter2Scene3.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { saveChapterStats } from "../../../utils/gameSummary";
import { unlockBadge } from "../../../utils/unlockBadge";

export default class Chapter2Scene3 extends BaseStoryScene {
    constructor() {
        super("Chapter2Scene3", {
            sceneId: "meetingPoint",
            jsonKey: "chapter2Data",
            jsonPath: "data/dialogues/chapters/chapter2_script.json",

            backgroundKey: "bgMeeting",
            startNodeId: "ch2_s3_intro",
            exitUnlockedFlag: "chapter2_scene3_exit_unlocked",


            walkArea: {
                topY: 755,
                bottomY: 1077,
                leftTopX: 665,
                rightTopX: 1500,
                leftBottomX: 100,
                rightBottomX: 1670,
            },

            scaleFar: 0.7,
            scaleNear: 1.6,
            scaleTopOffset: 20,

            door: {
                x: 745,
                y: 535,
                w: 198,
                h: 399,
                texture: "meetingDoor",
            },

            npcs: [
                {
                    name: "alice",
                    texture: "bgMeetingGirl",
                    x: 1110,
                    y: 730,
                    scale: 1.5,
                    dialogueId: "ch2_s3_beneficiary_notice",
                    inspectDialogueId: "inspect_beneficiary_notice"
                },
                {
                    name: "cat",
                    texture: "cat",
                    x: 1400,
                    y: 700,
                    scale: 0.6,
                    dialogueId: "cat",
                    inspectDialogueId: "inspect_cat"
                },
            ],

        });

        // objectives
        this.objectiveStep = 1;
        this.objectiveCompleted = false;
        this._chapterCompleted = false;
    }

    create() {
        super.create();

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgo:lastRoute", "/game");
        localStorage.setItem("currentChapter", 2);
        localStorage.setItem("currentScene", "Chapter2Scene3");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter2Scene3");
        });

        emit("updateChapterScene", { title: "Meeting · Chapter 2" });
    }

    // Runs after base create()
    _customCreate() {
        // objectives for this scene
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            title: "Listen to Her Story",
            description: "Talk to her and understand how the food bank helps her.",
            complete: false,
        });

        emit("updateObjective", {
            slot: "secondary",
            preview: false,
            active: true,
            collected: 0,
            goal: 1,
            title: "Form a Connection",
            description: "Optional: Spend a moment interacting with the cat.",
        });

        // this._createPosters();
        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;
        this.interactedWithCat = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "meetingPoint") return;
            if (exitFlag !== "chapter2_scene3_exit_unlocked") return;

            if (this.objectiveStep === 1 && !this.objectiveCompleted) {
                this._completeStep1AndUnlock();
            }
        };

        on("sceneExitUnlocked", this._onSceneExitUnlocked);

        // ✅ Listen for cat interaction flag
        this._onFlagsUpdated = (flags) => {
            console.log(`🚩 Flags updated: `, flags);

            if (flags && flags.includes("interacted_with_cat") && !this.interactedWithCat) {
                this.interactedWithCat = true;
                console.log("✅ Cat interaction completed!");

                emit("updateObjective", {
                    slot: "secondary",
                    delta: 1,
                    complete: true,
                });

                emit("badgeEarned", { name: "Quiet Companion", icon: "🐱", subtitle: "Some support doesn’t need words." });
                unlockBadge("quiet-companion");
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
    // Step 1 -> Step 2 transition
    // --------------------------------
    _completeStep1AndUnlock() {
        if (this.objectiveCompleted) return;
        this.objectiveCompleted = true;

        emit("updateObjective", {
            slot: "primary",
            delta: 1,
            complete: true,
        });


        emit("badgeEarned", { name: "Empathy Gained", icon: "❤️", subtitle: "You now see the impact through a real person." });

        unlockBadge("empathy-gained");

        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;

        // Step 2: trash becomes active
        this.objectiveStep = 2;
    }


    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("❌ Door locked.  Talk to your friends first.");
            return;
        }

        this._onChapterComplete();
    }

    // Call this when chapter is complete
    // ✅ Chapter complete handler
    _onChapterComplete() {
        // Prevent double-triggering
        if (this._chapterCompleted) {
            console.log("⚠️ Chapter already completed, skipping.. .");
            return;
        }
        this._chapterCompleted = true;

        console.log("🎉 Chapter 2 Complete!  Showing summary.. .");

        saveChapterStats(2);

        // Mark chapter as complete
        localStorage.setItem("chapter2_completed", "true");
        emit("updateChapterProgress");

        // Freeze the player
        this.input.enabled = false;
        if (this.ladyPlayer) {
            this.ladyPlayer.setVelocity(0, 0);
            this.ladyPlayer.body.enable = false;
            this.ladyPlayer.anims?.play("idle", true);
        }

        emit("ui:showChapterSummary", { chapter: 2 });
    }

}
