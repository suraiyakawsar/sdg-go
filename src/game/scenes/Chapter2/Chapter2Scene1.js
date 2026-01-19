import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { unlockBadge } from "../../../utils/unlockBadge"; // ← ADD THIS
import { title } from "framer-motion/client";

export default class Chapter2Scene1 extends BaseStoryScene {
    constructor() {
        super("Chapter2Scene1", {
            sceneId: "foodbank",
            jsonKey: "chapter2Data",
            jsonPath: "data/dialogues/chapters/chapter2_script.json",

            backgroundKey: "bgFoodBank",
            startNodeId: "ch2_s1_intro",
            exitUnlockedFlag: "chapter2_scene1_exit_unlocked",

            walkArea: {
                zones: [
                    { xMin: 600, xMax: 1580, yMin: 950, yMax: 1090 },
                ],
                topY: 850,
                bottomY: 1080,
                leftBottomX: 200,
                leftTopX: 500,
                rightTopX: 700,
                rightBottomX: 600,
                scaleFar: 1.5,
                scaleNear: 0.5,
                playerSpeed: 200
            },

            scaleFar: 1,
            scaleNear: 1.4,
            scaleTopOffset: 20,

            door: { x: 276, y: 600, w: 120, h: 220, texture: "doorFoodBank" },


            npcs: [
                {
                    name: "owenOrganizer",
                    texture: "owenOrganizer",
                    x: 1010,
                    y: 664,
                    scale: 0.7,
                    dialogueId: "ch2_s1_staff",
                }
            ],
        });

        // objectives
        this.objectiveStep = 1;         // 1 = talk, 2 = posters
        this.objectiveCompleted = false;

        this.posterCollected = 0;
        this.posterGoal = 5;

        // bind storage route
    }

    create() {
        super.create();

        // ✅ Reset session counters at the START of chapter 2
        localStorage.setItem("sessionSDGPoints", "0");
        localStorage.setItem("sessionGoodChoices", "0");
        localStorage.setItem("sessionBadChoices", "0");
        console.log("🔄 Chapter 2: Session counters reset");

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgo:lastRoute", "/game");  // ← Remove space
        localStorage.setItem("currentChapter", 2);
        localStorage.setItem("currentScene", "Chapter2Scene1");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter2Scene1");
        });

        emit("updateChapterScene", { title: "Food Bank · Chapter 2" });

    }

    // --------------------------------
    // Called after BaseStoryScene.create()
    // --------------------------------
    _customCreate() {
        // Primary: talk to friend
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            title: "Learn How the Food Bank Works",
            description: "Talk to the food bank organiser to understand what they do and why it matters.",
            complete: false,
        });

        // Secondary: poster (preview only until step 2)
        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.posterGoal,
            title: "Recognise the System",
            description: "Optional: Collect all food bank posters.",
        });

        this._createPosters();

        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "foodbank") return;
            if (exitFlag !== "chapter2_scene1_exit_unlocked") return;

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

        emit("badgeEarned", { name: "First-Hand Experience", icon: "🥫", subtitle: "You didn’t just hear about it, you showed up." });

        // ← UNLOCK BADGE HERE
        unlockBadge("fast-learner");

        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;

        // Step 2: posters becomes active
        this.objectiveStep = 2;
        this.objectiveCompleted = false;
        this.posterCollected = 0;

        emit("updateObjective", {
            slot: "secondary",
            active: true,
            preview: false,
            collected: 0,
            goal: this.posterGoal,
            title: "Recognise the System",
            description: "Optional: Collect all food bank posters.",
        });
    }

    // --------------------------------
    // Posters
    // --------------------------------
    _createPosters() {
        this.poster1 = this.add.image(122, 469, "posterBank1").setInteractive({ useHandCursor: true }).setScale(0.95); //volunteers
        this.poster2 = this.add.image(594, 260, "posterBank2").setInteractive({ useHandCursor: true }); //beside banner

        this.poster3 = this.add.image(967, 240, "posterBank3").setInteractive({ useHandCursor: true }); //banner

        this.poster4 = this.add.image(1475, 479, "posterBank4").setInteractive({ useHandCursor: true });

        this.poster5 = this.add.image(1796, 458, "posterBank5").setInteractive({ useHandCursor: true }); //calendar

        this.poster1.on("pointerdown", () => this._handlePosterClick(this.poster1));
        this.poster2.on("pointerdown", () => this._handlePosterClick(this.poster2));
        this.poster3.on("pointerdown", () => this._handlePosterClick(this.poster3));
        this.poster4.on("pointerdown", () => this._handlePosterClick(this.poster4));
        this.poster5.on("pointerdown", () => this._handlePosterClick(this.poster5));
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

            emit("badgeEarned", { name: "Understanding the Process", icon: "📦", subtitle: "Real change starts with small, everyday actions." });

            unlockBadge("eco-warrior");

            emit("updateObjective", { slot: "secondary", complete: true });
        }
    }

    // --------------------------------
    // Door click override: locked until unlocked
    // --------------------------------
    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Talk to your friend first.");
            return;
        }

        if (this.playerInExitZone) this.goToNextScene();
        else console.log("Too far from the door.");
    }
}
