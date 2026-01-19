// src/scenes/chapter2/Chapter2Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { unlockBadge } from "../../../utils/unlockBadge";

export default class Chapter2Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter2Scene2", {
            sceneId: "street",
            jsonKey: "chapter2Data",
            jsonPath: "data/dialogues/chapters/chapter2_script.json",

            backgroundKey: "bgStreet",
            startNodeId: "ch2_s2_intro",
            exitUnlockedFlag: "chapter2_scene2_exit_unlocked",

            walkArea: {
                topY: 780,
                bottomY: 1077,
                leftTopX: 700,
                rightTopX: 1490,
                leftBottomX: 200,
                rightBottomX: 1890,
            },

            scaleFar: 0.7,
            scaleNear: 1.4,
            scaleTopOffset: 20,

            door: { x: 1585, y: 510, w: 120, h: 220, texture: "streetDoor" },

            npcs: [
                {
                    name: "aprilNPC",
                    texture: "aprilNPC",
                    x: 428,
                    y: 685,
                    dialogueId: "ch2_s2_organizer",
                    inspectDialogueId: "inspect_organizer",
                },
                {
                    name: "matthewNPC",
                    texture: "matthewNPC",
                    x: 691,
                    y: 648,
                    dialogueId: "ch2_s2_matthew",
                    inspectDialogueId: "inspect_matthew",
                },
                {
                    name: "brosNPCs",
                    texture: "brosNPCs",
                    x: 1452,
                    y: 690,
                    dialogueId: "ch2_s2_group_intro",
                    inspectDialogueId: "inspect_group",
                },
                {
                    name: "squirrel",
                    texture: "squirrel",
                    x: 544,
                    y: 196,
                    dialogueId: "ch2_s2_squirrel",
                    inspectDialogueId: "inspect_squirrel",
                },
            ],
        });

        // Objectives
        this.objectiveStep = 1;
        this.objectiveCompleted = false;
        this.peopleTalked = false;
        this._chapterCompleted = false;

        // Save current route
    }

    create() {
        super.create();

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgo:lastRoute", "/game");  // ← Remove space
        localStorage.setItem("currentChapter", 2);
        localStorage.setItem("currentScene", "Chapter2Scene2");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter2Scene2");
        });

        emit("updateChapterScene", { title: "Streets · Chapter 2" });
    }

    // Runs after BaseStoryScene.create()
    _customCreate() {
        // Primary Objective: talk to your friend
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            title: "Observe What’s Happening",
            description: "See how everyone contributes outside the food bank.",
            complete: false,
        });

        // Secondary Objective (optional, preview until step 2)
        emit("updateObjective", {
            slot: "secondary",
            preview: false,
            active: true,
            collected: 0,
            goal: 1,
            title: "Engage with the Community",
            description: "Optional: Talk to people and learn about their sustainable actions.",
        });

        // Door starts locked
        this.doorUnlocked = false;
        this.screenDialogueViewed = false;

        // Listen for scene exit unlock
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "street") return;
            if (exitFlag !== "chapter2_scene2_exit_unlocked") return;

            if (this.objectiveStep === 1 && !this.objectiveCompleted) {
                this._completeStep1AndUnlock();
            }
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

                emit("badgeEarned", { name: "Reality Check", icon: "👀", subtitle: "You now see where action truly happens." });

                unlockBadge("reality-check");
            }
        };

        on("flagsUpdated", this._onFlagsUpdated);

        // Cleanup
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            off("sceneExitUnlocked", this._onSceneExitUnlocked);
            off("flagsUpdated", this._onFlagsUpdated);
        });
    }


    // Step 1 -> Step 2 transition
    _completeStep1AndUnlock() {
        if (this.objectiveCompleted) return;
        this.objectiveCompleted = true;

        // Update primary objective
        emit("updateObjective", {
            slot: "primary",
            delta: 1,
            complete: true,
        });

        emit("badgeEarned", { name: "Every Role Matters", icon: "🤝", subtitle: "You realized the impact of collective effort." });

        unlockBadge("every-role-matters");

        // Unlock door
        this.doorUnlocked = true;

        // Step 2: activate secondary objective
        this.objectiveStep = 2;
    }

    // Door click handler
    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Talk to your friend first.");
            return;
        }

        if (this.playerInExitZone) this.goToNextScene();
        else console.log("Too far from the door.");
    }
}
