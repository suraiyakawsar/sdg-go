// src/scenes/chapter3/Chapter3Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { saveChapterStats } from "../../../utils/gameSummary";
import { unlockBadge } from "../../../utils/unlockBadge";

export default class Chapter3Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter3Scene2", {
            sceneId: "garden",
            jsonKey: "chapter3Data",
            jsonPath: "data/dialogues/chapters/chapter3_script.json",

            backgroundKey: "bgCampusGarden",
            startNodeId: "ch3_s2_intro",
            exitUnlockedFlag: "chapter3_scene2_exit_unlocked",

            walkArea: {
                topY: 844,
                bottomY: 1077,
                leftTopX: 480,
                rightTopX: 980,
                leftBottomX: 250,
                rightBottomX: 1000,
            },

            // perfect scaling values found via tracker:
            scaleFar: 0.7,
            scaleNear: 1.6,
            // Add this if you use Option 1:
            scaleTopOffset: 20,

            // ✅ door (swap texture/x/y to match artwork)
            door: {
                x: 192,
                y: 558,
                w: 198,
                h: 399,
                texture: "gardenDoor",
            },

            npcs: [
                {
                    name: "gardener",
                    texture: "gardener",
                    x: 1060,
                    y: 650,
                    scale: 1.5,
                    dialogueId: "ch3_s2_gardener",
                    inspectDialogueId: "inspect_gardener",
                },
                {
                    name: "cat",
                    texture: "cat",
                    x: 700,
                    y: 900,
                    scale: 0.6,
                    dialogueId: "cat",
                    inspectDialogueId: "inspect_cat"
                },
                {
                    name: "tools",
                    texture: "gardeningTools",
                    x: 755,
                    y: 700,
                    scale: 0.7,
                    dialogueId: "ch3_s2_tools_interact",
                    inspectDialogueId: "inspect_tools"
                },
            ],
        });

        // objectives
        this.objectiveStep = 1;
        this.objectiveCompleted = false;
        this.tableTalked = false;
        this._chapterCompleted = false;

        // bind storage route

    }

    create() {
        super.create();


        // ✅ Store current scene
        localStorage.setItem("sdgo:lastRoute", "/game");
        localStorage.setItem("currentChapter", 3);
        localStorage.setItem("currentScene", "Chapter3Scene2");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter3Scene2");
        });

        emit("updateChapterScene", { title: "Garden · Chapter 3" });
    }

    // Runs after base create()
    _customCreate() {
        // objectives for this scene
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            title: "Learn Through Practice",
            description: "Talk to the gardener to understand composting and climate action.",
            complete: false,
        });

        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            // goal: 1,
            title: "Understand the Process",
            description: "Optional: Interact with the composting table to learn how it works.",
        });

        // this._createPosters();
        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;
        this.compostTableInteracted = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "garden") return;
            if (exitFlag !== "chapter3_scene2_exit_unlocked") return;

            if (this.objectiveStep === 1 && !this.objectiveCompleted) {
                this._completeStep1AndUnlock();
            }
        };

        on("sceneExitUnlocked", this._onSceneExitUnlocked);

        this._onFlagsUpdated = (flags) => {
            console.log(`🚩 Flags updated: `, flags);

            if (flags && flags.includes("compost_table_interacted") && !this.compostTableInteracted) {
                this.compostTableInteracted = true;
                console.log("✅ Compost table interaction completed!");

                emit("updateObjective", {
                    slot: "secondary",
                    delta: 1,
                    complete: true,
                });

                emit("badgeEarned", { name: "Composting Basics", icon: "🌱", subtitle: "Waste can be part of the solution." });
                unlockBadge("composting-basics");
            }
        };

        on("flagsUpdated", this._onFlagsUpdated);

        // // Cleanup
        // this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        //     off("sceneExitUnlocked", this._onSceneExitUnlocked);
        //     off("flagsUpdated", this._onFlagsUpdated);
        // });
    }

    // --------------------------------
    // Step 1 -> Step 2 transition
    // --------------------------------
    _completeStep1AndUnlock() {
        if (this.objectiveCompleted) return;
        this.objectiveCompleted = true;

        console.log("🔓 Primary objective complete! Unlocking door.");

        emit("updateObjective", {
            slot: "primary",
            delta: 1,
            complete: true,
        });


        emit("badgeEarned", { name: "Climate in Action", icon: "🌍", subtitle: "You learned how everyday actions affect the environment." });
        unlockBadge("climate-in-action");
        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;

        this.objectiveStep = 2;
    }


    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Talk to your professor first.");
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

        console.log("🎉 Chapter 3 Complete!");

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