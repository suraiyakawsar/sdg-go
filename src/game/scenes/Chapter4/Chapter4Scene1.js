// src/scenes/chapter4/Chapter4Scene1.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { saveChapterStats } from "../../../utils/gameSummary";
import { unlockBadge } from "../../../utils/unlockBadge";

export default class Chapter4Scene1 extends BaseStoryScene {
    constructor() {
        super("Chapter4Scene1", {
            sceneId: "pond",
            jsonKey: "chapter4Data",
            jsonPath: "data/dialogues/chapters/chapter4_script.json",

            backgroundKey: "bgPond",
            startNodeId: "ch4_s1_intro",
            exitUnlockedFlag: "chapter4_scene1_exit_unlocked",

            walkArea: {
                topY: 800,
                bottomY: 1100,
                leftTopX: 400,
                rightTopX: 1300,
                leftBottomX: 300,
                rightBottomX: 1450,
            },

            scaleFar: 0.6,
            scaleNear: 1.4,
            scaleTopOffset: 20,

            door: {
                x: 200,
                y: 900,
                w: 447,
                h: 1230,
                scale: 0.5,
                texture: "busStopSignPond",
            },

            npcs: [
                {
                    name: "pondBoy",
                    texture: "pondBoy",
                    x: 1310,
                    y: 710,
                    scale: 1.45,
                    dialogueId: "ch4_s1_npc",
                    inspectDialogueId: "inspect_pondBoy",
                }
            ],
        });

        // objectives
        this.objectiveStep = 1;         // 1 = talk, 2 = trash
        this.objectiveCompleted = false;

        this.trashCollected = 0;
        this.trashGoal = 3;

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

        // ✅ Reset session counters at the START of chapter 4
        localStorage.setItem("sessionSDGPoints", "0");
        localStorage.setItem("sessionGoodChoices", "0");
        localStorage.setItem("sessionBadChoices", "0");
        console.log("🔄 Chapter 4: Session counters reset");

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgo:lastRoute", "/game");  // ← Remove space
        localStorage.setItem("currentChapter", 4);
        localStorage.setItem("currentScene", "Chapter4Scene1");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter4Scene1");
        });


        emit("updateChapterScene", { title: "Pond · Chapter 4" });
    }

    _customCreate() {
        // Initialize objectives
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            title: "Meet the Volunteer",
            description: "Help clean the pond and reflect on environmental impact.",
            // Talk to the volunteer and learn why he helps clean up the area.
            complete: false,
        });

        // Secondary: trash (preview only until step 2)
        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.trashGoal,
            title: "Lend a Hand",
            description: "Optional: Help clean up trash around the pond.",
        });

        this._createTrash();

        this.doorUnlocked = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "pond") return;
            if (exitFlag !== "chapter4_scene1_exit_unlocked") return;

            if (this.objectiveStep === 1 && !this.objectiveCompleted) {
                this._completeStep1AndUnlock();
            }
        };

        on("sceneExitUnlocked", this._onSceneExitUnlocked);

        // Cleanup on scene shutdown
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

        emit("badgeEarned", { name: "Hands-On Help", icon: "🧤", subtitle: "You learned from someone who leads by example." });

        unlockBadge("hands-on-help");

        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;


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
            description: "Collect all the trash.",
        });
    }

    // --------------------------------
    // Trash
    // --------------------------------
    _createTrash() {
        this.trash1 = this.add.image(900, 800, "pondTrash").setInteractive({ useHandCursor: true }).setScale(1.2); //volunteers
        this.trash2 = this.add.image(500, 800, "pondTrash2").setInteractive({ useHandCursor: true }).setScale(1.2); //beside banner
        this.trash3 = this.add.image(1200, 800, "pondTrash3").setInteractive({ useHandCursor: true }).setScale(1.2); //banner

        this.trash1.on("pointerdown", () => this._handleTrashClick(this.trash1));
        this.trash2.on("pointerdown", () => this._handleTrashClick(this.trash2));
        this.trash3.on("pointerdown", () => this._handleTrashClick(this.trash3));

    }

    _handleTrashClick(trashItem) {
        if (!trashItem?.scene) return;
        // trash only active in step 2
        if (this.objectiveStep !== 2) return;

        const points = 3;
        addSDGPoints(points);

        // small floating text
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

            emit("badgeEarned", { name: "Leave It Better", icon: "🏞️", subtitle: "You improved a shared space through action." });

            unlockBadge("leave-it-better");

            emit("updateObjective", { slot: "secondary", complete: true });

            // Save chapter stats in profile
            const completedChapters = JSON.parse(localStorage.getItem("completedChapters") || "[]");
            if (!completedChapters.includes(4)) {
                completedChapters.push(4);
                localStorage.setItem("completedChapters", JSON.stringify(completedChapters));
            }
        }
    }


    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Complete the pond activity first.");
            return;
        }
        if (this.playerInExitZone) this.goToNextScene();
        else console.log("Too far from the door.");
    }
}
