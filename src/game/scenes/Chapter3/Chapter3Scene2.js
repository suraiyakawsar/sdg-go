// src/scenes/chapter3/Chapter3Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on /*, off*/ } from "../../../utils/eventBus";

export default class Chapter3Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter3Scene2", {
            sceneId: "classroom2",
            jsonKey: "chapter3Data",
            jsonPath: "data/dialogues/chapters/chapter3_script.json",

            backgroundKey: "bgClassroom2",
            startNodeId: "ch3_s2_intro",
            exitUnlockedFlag: "chapter3_scene2_exit_unlocked",


            // walkArea: {
            //     topY: 844,
            //     bottomY: 1077,
            //     leftTopX: 893,
            //     rightTopX: 1125,
            //     leftBottomX: 400,
            //     rightBottomX: 1125,
            // },

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


            // perfect scaling values found via tracker:
            scaleFar: 0.75,
            scaleNear: 1.45,
            // Add this if you use Option 1:
            scaleTopOffset: 20,

            // perfect scaling values found via tracker:
            scaleFar: 0.75,
            scaleNear: 1.45,
            // Add this if you use Option 1:
            scaleTopOffset: 20,

            player: {
                x: 1125,        // Change this to your desired horizontal start
                y: 1077,        // Change this to your desired vertical start
                key: "ladyy",  // Your sprite texture key
                frame: "frame1.png"
            },


            // ✅ door (swap texture/x/y to match your artwork)
            door: {
                x: 243,
                y: 597,
                w: 120,
                h: 220,
                texture: "bgClassroom2Door", // <-- replace (or reuse a generic door)
            },


            npcs: [
                {
                    name: "professor",
                    texture: "professor",   // <-- replace
                    x: 470,
                    y: 680,
                    scale: 0.45,
                    dialogueId: "ch3_s2_professor_start", // <-- replace
                }
            ],
        });


        // objectives
        this.objectiveStep = 1;         // 1 = talk, 2 = posters
        this.objectiveCompleted = false;

        // local state just for posters
        this.posterFound = 0;
        this.posterGoal = 3;

        // bind storage route
    }

    create() {
        super.create();

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgExplorer:lastRoute", "/game");  // ← Remove space
        localStorage.setItem("currentChapter", 3);
        localStorage.setItem("currentScene", "Chapter3Scene2");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter3Scene2");
        });

        emit("updateChapterScene", { title: "Classroom · Chapter 3" });
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
            description: "Talk to your friends in the cafeteria.",
            complete: false,
        });

        // Secondary: trash (preview only until step 2)
        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.posterGoal,
            description: "Optional: Collect all the posters in the cafeteria.",
        });

        this._createPosters();
        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "classroom2") return;
            if (exitFlag !== "chapter3_scene2_exit_unlocked") return;

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
        emit("badgeEarned", "Food Bank Unlocked! 🔓");

        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;
        this._unlockDoorGlow?.();

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
            description: "Optional: Collect all the posters in the cafeteria.",
        });
    }

    // --------------------------------
    // Posters
    // --------------------------------
    _createPosters() {
        this.poster1 = this.add.image(614, 885, "table").setInteractive({ useHandCursor: true }).setScale(1.05);
        this.poster1.on("pointerdown", () => this._handlePosterClick(this.poster1));
    }

    _handlePosterClick(posterItem) {
        if (!posterItem?.scene) return;

        // poster only active in step 2
        if (this.objectiveStep !== 2) return;

        const points = 3;
        addSDGPoints(points);
        emit("updateSDGPoints", points);
        emit("badgeEarned", `Found a poster! (+${posterItem.reward})`);

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
            emit("badgeEarned", "Poster Hunter 2! 🏅");
            emit("updateObjective", { slot: "secondary", complete: true });
        }
    }

    // --------------------------------
    // Door click override: locked until unlocked
    // --------------------------------
    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Talk to your professor first.");
            return;
        }

        if (this.playerInExitZone) this.goToNextScene();
        else console.log("Too far from the door.");
    }

}
