// src/scenes/chapter4/Chapter4Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { saveChapterStats } from "../../../utils/gameSummary";
import { addSDGPoints } from "../../../utils/sdgPoints";
export default class Chapter4Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter4Scene2", {
            sceneId: "busStop",
            jsonKey: "chapter4Data",
            jsonPath: "data/dialogues/chapters/chapter4_script.json",

            backgroundKey: "bgBusStop",
            startNodeId: "ch4_s2_intro",
            exitUnlockedFlag: "chapter4_scene3_exit_unlocked",

            walkArea: {
                topY: 900,
                bottomY: 1100,
                leftTopX: 500,
                rightTopX: 1350,
                leftBottomX: 200,
                rightBottomX: 1450,
            },

            scaleFar: 1.2,
            scaleNear: 1.4,
            scaleTopOffset: 20,

            door: {
                x: 63,
                y: 540,
                w: 85,
                h: 768,
                scale: 1.41,
                texture: "busStopDoor",
            },

            npcs: [
                {
                    name: "busStopMark",
                    texture: "busStopMark",
                    x: 665,
                    y: 665,
                    scale: 0.9,
                    dialogueId: "ch4_s2_junior",
                    inspectDialogueId: "inspect_student",
                }
            ],
        });
        // objectives
        this.objectiveStep = 1;         // 1 = talk, 2 = posters
        this.objectiveCompleted = false;

        this.posterCollected = 0;
        this.posterGoal = 2;
        this._chapterCompleted = false;
    }

    create() {
        super.create();

        // 🔥 Scene-specific door scaling
        if (this.door) {
            const s = this.CONFIG.door.scale ?? 1;
            this.door.setScale(s);

            // Match exit zone to visual size
            this.exitZone.setSize(
                this.CONFIG.door.w * s,
                this.CONFIG.door.h * s
            );
        }

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgo:lastRoute", "/game");  // ← Remove space
        localStorage.setItem("currentChapter", 4);
        localStorage.setItem("currentScene", "Chapter4Scene2");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter4Scene2");
        });


        emit("updateChapterScene", { title: "Bus Stop · Chapter 4" });
    }

    _customCreate() {
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            title: "Rethink Your Commute",
            description: "Talk to the commuter to learn how public transport helps the environment.",
            complete: false,
        });

        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.posterGoal,
            title: "Everyday Climate Choices",
            description: "Optional: Explore the posters at the bus stop.",
        });

        this._createPosters();
        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "busStop") return;
            if (exitFlag !== "chapter4_scene2_exit_unlocked") return;

            if (this.objectiveStep === 1 && !this.objectiveCompleted) {
                this._completeStep1AndUnlock();
            }
        };

        on("sceneExitUnlocked", this._onSceneExitUnlocked);

        // Cleanup (only if bus supports off())
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

        emit("badgeEarned", { name: "Greener Commute", icon: "🚌", subtitle: "Small transport choices have big impact." });

        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;

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
            title: "Bus Stop Posters",
            description: "Optional: Explore the posters at the bus stop.",
        });
    }


    _createPosters() {
        this.poster1 = this.add.image(580, 380, "busStopPoster1").setInteractive({ useHandCursor: true }).setScale(1.5); //volunteers
        this.poster2 = this.add.image(1230, 380, "busStopPoster2").setInteractive({ useHandCursor: true }).setScale(1.5); //volunteers
        this.poster1.on("pointerdown", () => this._handlePosterClick(this.poster1));
        this.poster2.on("pointerdown", () => this._handlePosterClick(this.poster2));
    }

    _handlePosterClick(posterItem) {
        if (!posterItem?.scene) return;
        // poster only active in step 2
        if (this.objectiveStep !== 2) return;

        const points = 3;
        addSDGPoints(points);

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
            emit("badgeEarned", { name: "Everyday Awareness", icon: "🚌", subtitle: "Sustainability exists in ordinary spaces." });
            emit("updateObjective", { slot: "secondary", complete: true });
        }
    }


    _onDoorClicked() {
        console.log("🚪 Door clicked!");
        console.log("  - doorUnlocked:", this.doorUnlocked);
        console.log("  - playerInExitZone:", this.playerInExitZone);

        if (!this.doorUnlocked) {
            console.log("Door locked. Complete the bus stop conversation first.");
            return;
        }

        // ✅ TEMPORARY FIX: Skip the exit zone check for now
        // if (this.playerInExitZone) {
        this._onChapterComplete();
        // } else {
        //     console.log("Too far from the door.");
        // }
    }

    _onChapterComplete() {
        // Prevent double-triggering
        if (this._chapterCompleted) {
            console.log("⚠️ Chapter already completed, skipping.. .");
            return;
        }
        this._chapterCompleted = true;

        console.log("🎉 Chapter 2 Complete!  Showing summary.. .");

        saveChapterStats(4);

        // Freeze the player
        this.input.enabled = false;
        if (this.ladyPlayer) {
            this.ladyPlayer.setVelocity(0, 0);
            this.ladyPlayer.body.enable = false;
            this.ladyPlayer.anims?.play("idle", true);
        }

        // ✅ Emit immediately - don't wait
        console.log("📤 Emitting ui:showChapterSummary for chapter 4.. .");
        emit("ui:showChapterSummary", { chapter: 4 });
    }
}
