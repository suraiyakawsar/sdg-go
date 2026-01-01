// src/scenes/chapter2/Chapter2Scene3.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { saveChapterStats } from "../../../utils/gameSummary";

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

            // perfect scaling values found via tracker:
            scaleFar: 0.7,
            scaleNear: 1.6,
            // Add this if you use Option 1:
            scaleTopOffset: 20,

            // ✅ door (swap texture/x/y to match your artwork)
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
                    texture: "bgMeetingGirl",   // <-- replace
                    x: 1110,
                    y: 730,
                    scale: 1.5,
                    dialogueId: "ch2_s3_beneficiary_notice", // <-- replace
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
        this.objectiveStep = 1;         // 1 = talk, 2 = posters
        this.objectiveCompleted = false;

        this.posterCollected = 0;
        this.posterGoal = 1;
        this._chapterCompleted = false;

        // bind storage route

    }

    create() {
        super.create();

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgExplorer:lastRoute", "/game");  // ← Remove space
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
            description: "Finish talking to Alice to continue.",
            complete: false,
        });

        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.posterGoal,
            description: "Optional: Find and click hidden classroom posters.",
        });

        this._createPosters();
        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;

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

        // Cleanup (only if your bus supports off())
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            // if (typeof off === "function") off("sceneExitUnlocked", this._onSceneExitUnlocked);
        });

    }

    // --------------------------------
    // Step 1 -> Step 2 transition
    // --------------------------------
    _completeStep1AndUnlock() {
        this.objectiveCompleted = true;

        emit("updateObjective", {
            slot: "primary",
            delta: 1,
            complete: true,
        });

        emit("updateSDGPoints", 10);
        emit("badgeEarned", "Professor Unlocked! 🔓");

        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;
        this._unlockDoorGlow?.();

        // Step 2: trash becomes active
        this.objectiveStep = 2;
        this.objectiveCompleted = false;
        this.posterCollected = 0;

        emit("updateObjective", {
            slot: "secondary",
            active: true,
            preview: false,
            collected: 0,
            goal: this.posterGoal,
            description: "Find and click hidden classroom posters.",
        });
    }


    _createPosters() {
        this.poster1 = this.add.image(122, 469, "posterBank1").setInteractive({ useHandCursor: true }).setScale(0.95); //volunteers
        this.poster1.on("pointerdown", () => this._handlePosterClick(this.poster1));
        // this.meetingDoorArch = this.add.image(340, 495, "meetingDoorArch");
    }

    _handlePosterClick(posterItem) {
        if (!posterItem?.scene) return;
        // poster only active in step 2
        if (this.objectiveStep !== 2) return;

        const points = 3;
        addSDGPoints(points);
        emit("updateSDGPoints", points);

        // small floating text
        const msg = this.add.text(posterItem.x, posterItem.y - 40, `+${points}`, {
            font: "16px Arial",
            fill: "#0f0",
        }).setOrigin(0.5);

        this.tweens.add({
            targets: msg,
            y: msg.y - 40,
            alpha: 0,
            duration: 700,
            onComplete: () => msg.destroy(),
        });

        posterItem.destroy();

        this.posterCollected += 1;

        emit("updateObjective", {
            slot: "secondary",
            delta: 1,
        });

        if (!this.objectiveCompleted && this.posterCollected >= this.posterGoal) {
            this.objectiveCompleted = true;
            emit("badgeEarned", "Eco Warrior! 🏅");
            emit("updateObjective", { slot: "secondary", complete: true });
        }
    }


    // _onDoorClicked() {
    //     if (!this.doorUnlocked) {
    //         console.log("Door locked. Talk to Alice first.");
    //         return;
    //     }

    //     if (this.playerInExitZone) {
    //         this._onChapterComplete(); // ✅ Show summary instead of going directly
    //     } else {
    //         console.log("Too far from the door.");
    //     }
    // }
    _onDoorClicked() {
        console.log("🚪 Door clicked!");
        console.log("  - doorUnlocked:", this.doorUnlocked);
        console.log("  - playerInExitZone:", this.playerInExitZone);

        if (!this.doorUnlocked) {
            console.log("❌ Door locked.  Talk to your friends first.");
            return;
        }

        // ✅ TEMPORARY FIX: Skip the exit zone check for now
        // if (this.playerInExitZone) {
        this._onChapterComplete();
        // } else {
        //     console.log("Too far from the door.");
        // }
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

        // ✅ Emit immediately - don't wait
        console.log("📤 Emitting ui:showChapterSummary for chapter 2.. .");
        emit("ui:showChapterSummary", { chapter: 2 });
    }

}
