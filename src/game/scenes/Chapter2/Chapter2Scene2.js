// src/scenes/Chapter2Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on /*, off*/ } from "../../../utils/eventBus";

export default class Chapter2Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter2Scene2", {
            sceneId: "street",

            jsonKey: "chapter2Data",
            jsonPath: "data/dialogues/chapters/chapter2_script.json",


            backgroundKey: "bgStreet",
            // nextScene: "Chapter2Scene3",
            startNodeId: "ch2_s2_intro",
            // dialogueKey: "street",
            exitUnlockedFlag: "chapter2_scene2_exit_unlocked",


            // ✅ walk polygon — replace with your new scene’s values
            walkArea: {
                topY: 830,
                bottomY: 1077,
                leftTopX: 534,
                rightTopX: 1500,
                leftBottomX: 200,
                rightBottomX: 1600,
            },

            // perfect scaling values found via tracker:
            scaleFar: 0.75,
            scaleNear: 1.45,
            // Add this if you use Option 1:
            scaleTopOffset: 20,


            // ✅ door (swap texture/x/y to match your artwork)
            door: {
                x: 300,
                y: 600,
                w: 120,
                h: 220,
                texture: "doorFoodBank", // <-- replace (or reuse a generic door)
            },


            npcs: [
                {
                    name: "organizer",
                    texture: "npc_organizer",   // <-- replace
                    x: 900,
                    y: 650,
                    scale: 0.35,
                    dialogueId: "ch2_scene2_organizer", // <-- replace
                }
            ],
        });

        // objective state (optional for this scene)
        this.objectiveCompleted = false;
    }

    create() {
        super.create();
        emit("updateChapterScene", { title: "Street · Chapter 2" });
    }

    // createNPCs() {
    //     this.organizer = this.createNPC({
    //         id: "organizer",
    //         x: 900,
    //         y: 820,
    //         texture: "npc_organizer",
    //         dialogueKey: "ch2_scene2_organizer",
    //     });

    //     this.createNPC({
    //         id: "student1",
    //         x: 620,
    //         y: 860,
    //         texture: "npc_student",
    //         dialogueKey: "ch2_scene2_student_positive",
    //         ambient: true,
    //     });

    //     this.createNPC({
    //         id: "student2",
    //         x: 1180,
    //         y: 860,
    //         texture: "npc_student",
    //         dialogueKey: "ch2_scene2_student_neutral",
    //         ambient: true,
    //     });
    // }

    // --------------------------------
    // called after BaseStoryScene.create()
    // --------------------------------
    _customCreate() {
        // Example objective (edit or delete)
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            description: "Help at the food bank (talk to staff).",
            complete: false,
        });

        // Listen for JSON unlock event
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== this._story?.sceneId) return;
            if (exitFlag !== this._story?.exitUnlockedFlag) return;

            if (!this.objectiveCompleted) {
                this.objectiveCompleted = true;

                emit("updateObjective", {
                    slot: "primary",
                    delta: 1,
                    complete: true,
                });

                // unlock door (BaseStoryScene glow helper)
                this.doorUnlocked = true;
                this._unlockDoorGlow?.();
            }
        };


        on("sceneExitUnlocked", this._onSceneExitUnlocked);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            // if (typeof off === "function") off("sceneExitUnlocked", this._onSceneExitUnlocked);
        });

        // start intro dialogue (optional; remove if you want “click NPC to start” only)
        this.time.delayedCall(350, () => this.startDialogue());
    }

    // --------------------------------
    // door click override
    // --------------------------------
    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Finish the scene first.");
            return;
        }

        if (this.playerInExitZone) this.goToNextScene();
        else console.log("Too far from the door.");
    }


    //     createExitZone() {
    //         this.createDoorExit({
    //             x: 1550,
    //             y: 860,
    //             width: 120,
    //             height: 220,
    //             targetScene: this.nextScene,
    //         });
    //     }
}