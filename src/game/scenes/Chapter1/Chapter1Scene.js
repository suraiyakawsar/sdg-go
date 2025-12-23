import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { unlockBadge } from "../../../utils/unlockBadge"; // ← ADD THIS

export default class Chapter1Scene extends BaseStoryScene {
    constructor() {
        super("Chapter1Scene", {
            sceneId: "hallway",
            jsonKey: "chapter1Data",
            jsonPath: "data/dialogues/chapters/chapter1_script.json",

            backgroundKey: "bgHallway",
            startNodeId: "h_intro_narration",
            exitUnlockedFlag: "chapter1_scene1_exit_unlocked",

            walkArea: {
                topY: 740,
                bottomY: 1077,
                leftTopX: 720,
                rightTopX: 1130,
                leftBottomX: 490,
                rightBottomX: 1600,
            },

            // perfect scaling values found via tracker:
            scaleFar: 0.70,
            scaleNear: 1.3,
            // Add this if you use Option 1:
            scaleTopOffset: 20,


            door: { x: 610, y: 587, w: 120, h: 220, texture: "classroomDoor" },

            npcs: [
                { name: "npcboy", texture: "npcboy", x: 480, y: 762, scale: 0.4, dialogueId: "h_intro_narration" },
                { name: "npcgirl", texture: "npcgirl", x: 1700, y: 740, scale: 0.3, dialogueId: "h_friends_start" },
                { name: "noticeBoard", texture: "noticeboard", x: 320, y: 355, scale: 1.0, dialogueId: "h_noticeboard", tooltip: { offsetX: 120, offsetY: 0 } },
            ],
        });

        // objectives
        this.objectiveStep = 1;         // 1 = talk, 2 = trash
        this.objectiveCompleted = false;

        this.trashCollected = 0;
        this.trashGoal = 2;

        // bind storage route
        // Save current route to localStorage whenever user enters a new scene



    }

    create() {
        super.create();


        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgExplorer:lastRoute", "/game");  // ← Remove space
        localStorage.setItem("currentChapter", 1);
        localStorage.setItem("currentScene", "Chapter1Scene");


        // ✅ NEW: Store scene before page unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter1Scene");
        });

        emit("updateChapterScene", { title: "Hallway · Chapter 1" });
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
            description: "Talk to your friend and unlock the next area.",
            complete: false,
        });

        // Secondary: trash (preview only until step 2)
        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.trashGoal,
            description: "Optional: Collect 2 pieces of trash around the hallway.",
        });

        this._createTrash();

        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "hallway") return;
            if (exitFlag !== "chapter1_scene1_exit_unlocked") return;

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
        emit("badgeEarned", "Hallway Unlocked! 🔓");

        // ← UNLOCK BADGE HERE
        unlockBadge("fast-learner");

        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;
        this._unlockDoorGlow?.();

        // Step 2: trash becomes active
        this.objectiveStep = 2;
        this.objectiveCompleted = false;
        this.trashCollected = 0;

        emit("updateObjective", {
            slot: "secondary",
            active: true,
            preview: false,
            collected: 0,
            goal: this.trashGoal,
            description: "Collect 2 pieces of trash around the hallway.",
        });
    }

    // --------------------------------
    // Trash
    // --------------------------------
    _createTrash() {
        this.trash1 = this.add.image(900, 900, "trash1").setInteractive({ useHandCursor: true }).setScale(0.3);
        this.trash2 = this.add.image(900, 800, "trash2").setInteractive({ useHandCursor: true }).setScale(0.2);

        this.trash1.on("pointerdown", () => this._handleTrashClick(this.trash1));
        this.trash2.on("pointerdown", () => this._handleTrashClick(this.trash2));
    }

    // _handleTrashClick(trashItem) {
    //     if (!trashItem?.scene) return;

    //     // trash only active in step 2
    //     if (this.objectiveStep !== 2) return;

    //     const points = 3;
    //     addSDGPoints(points);
    //     emit("updateSDGPoints", points);

    //     // small floating text
    //     const msg = this.add.text(trashItem.x, trashItem.y - 40, `+${points}`, {
    //         font: "16px Arial",
    //         fill: "#0f0",
    //     }).setOrigin(0.5);

    //     this.tweens.add({
    //         targets: msg,
    //         y: msg.y - 40,
    //         alpha: 0,
    //         duration: 700,
    //         onComplete: () => msg.destroy(),
    //     });

    //     trashItem.destroy();

    //     this.trashCollected += 1;

    //     emit("updateObjective", {
    //         slot: "secondary",
    //         delta: 1,
    //     });

    //     if (!this.objectiveCompleted && this.trashCollected >= this.trashGoal) {
    //         this.objectiveCompleted = true;
    //         unlockBadge("eco-warrior"); // Changed from emit()
    //         emit("updateObjective", { slot: "secondary", complete: true });
    //     }
    // }

    // --------------------------------
    // Door click override: locked until unlocked
    // --------------------------------


    // Add to _handleTrashClick method
    _handleTrashClick(trashItem) {
        if (!trashItem?.scene) return;
        if (this.objectiveStep !== 2) return;

        const points = 3;
        addSDGPoints(points);
        emit("updateSDGPoints", points);

        const msg = this.add.text(trashItem.x, trashItem.y - 40, `+${points}`, {
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

        trashItem.destroy();
        this.trashCollected += 1;

        emit("updateObjective", {
            slot: "secondary",
            delta: 1,
        });

        if (!this.objectiveCompleted && this.trashCollected >= this.trashGoal) {
            this.objectiveCompleted = true;

            // 🔴 DEBUG: Check if this runs
            console.log("✅ About to unlock eco-warrior badge");
            console.log("Current localStorage:", localStorage.getItem("collectedBadges"));

            unlockBadge("eco-warrior");

            console.log("After unlock:", localStorage.getItem("collectedBadges"));

            emit("updateObjective", { slot: "secondary", complete: true });


            // In your Chapter1Scene.js or wherever chapters complete: 
            const completedChapters = JSON.parse(localStorage.getItem("completedChapters") || "[]");
            if (!completedChapters.includes(1)) {
                completedChapters.push(1);
                localStorage.setItem("completedChapters", JSON.stringify(completedChapters));
            }
        }
    }


    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Talk to your friend first.");
            return;
        }

        if (this.playerInExitZone) this.goToNextScene();
        else console.log("Too far from the door.");
    }
}
