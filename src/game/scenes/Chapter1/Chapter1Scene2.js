
import BaseStoryScene from "../BaseStoryScene";
import { emit, on } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { unlockBadge } from "../../../utils/unlockBadge"; // ← ADD THIS
import { title } from "framer-motion/client";


export default class Chapter1Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter1Scene2", {
            // JSON hookup
            sceneId: "classroom",
            jsonKey: "chapter1Data",
            jsonPath: "data/dialogues/chapters/chapter1_script.json",

            // scene basics
            backgroundKey: "bgClassroom",
            startNodeId: "c_intro_prof",
            exitUnlockedFlag: "chapter1_scene2_exit_unlocked",

            // per-scene walk area
            walkArea: {
                topY: 780,
                bottomY: 1077,
                leftTopX: 700,
                rightTopX: 1230,
                leftBottomX: 200,
                rightBottomX: 1600,
            },

            // perfect scaling values found via tracker:
            scaleFar: 0.80,
            scaleNear: 1.4,
            // Add this if you use Option 1:
            scaleTopOffset: 20,

            // door (same logic everywhere)
            door: {
                x: 291, y: 649, w: 120, h: 220, texture: "bgClassroomDoor"
            },


            // NPC list (BaseStoryScene will create + tooltip + indicator automatically)
            npcs: [
                { name: "teacher", texture: "teacher", x: 950, y: 630, scale: 0.37, dialogueId: "c_prof_start", inspectDialogueId: "inspect_professor" },
                { name: "students", texture: "students", x: 940, y: 770, dialogueId: "c_bench_1", tooltip: { offsetX: 60, offsetY: 50 }, inspectDialogueId: "inspect_student" },
            ],

        });

        // objectives
        this.objectiveStep = 1;
        this.objectiveCompleted = false;

        // local state just for posters
        this.posterCollected = 0;
        this.posterGoal = 2;
    }

    create() {
        super.create();

        localStorage.setItem("sdgo:lastRoute", "/game");
        localStorage.setItem("currentChapter", 1);
        localStorage.setItem("currentScene", "Chapter1Scene2");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter1Scene2");
        });

        emit("updateChapterScene", { title: "Classroom · Chapter 1" });
    }

    // Runs after base create()
    _customCreate() {
        // objectives for this scene
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            title: "Understand the Bigger Picture",
            description: "Talk to Miss Riza and learn what the SDGs are.",
            complete: false,
        });

        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.posterGoal,
            title: "Spread the Word",
            description: "Optional: Collect all SDG posters in the classroom.",
        });

        this._createPosters();
        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "classroom") return;
            if (exitFlag !== "chapter1_scene2_exit_unlocked") return;

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

        emit("badgeEarned", { name: "SDG 101", icon: "🚌", subtitle: "You’ve been formally introduced to the SDGs." });

        // ← UNLOCK BADGE HERE
        unlockBadge("water-saver");

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
            title: "Spread the Word",
            description: "Optional: Collect all SDG posters in the classroom.",
        });
    }

    // -------------------------
    // Posters (scene-specific)
    // -------------------------
    _createPosters() {
        // const posters = [
        //     { name: "poster_sdg4", x: 420, y: 420, w: 140, h: 180, reward: 5 },
        //     { name: "poster_sdg13", x: 1180, y: 430, w: 140, h: 180, reward: 5 },
        // ];

        this.poster1 = this.add.image(580, 450, "poster_sdg13").setInteractive({ useHandCursor: true });
        this.poster2 = this.add.image(1235, 459, "poster_sdg4").setInteractive({ useHandCursor: true });
        this.clock = this.add.image(922, 285, "clock").setInteractive({ useHandCursor: true });

        this.poster1.on("pointerdown", () => this._handlePosterClick(this.poster1));
        this.poster2.on("pointerdown", () => this._handlePosterClick(this.poster2));
        this.clock.on("pointerdown", () => this._handlePosterClick(this.clock));

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
            delta: 1
        });

        if (!this.objectiveCompleted && this.posterCollected >= this.posterGoal) {
            this.objectiveCompleted = true;
            unlockBadge("water-saver");

            emit("badgeEarned", { name: "Awareness Advocate", icon: "📣", subtitle: "Sustainability exists in ordinary spaces." });
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
