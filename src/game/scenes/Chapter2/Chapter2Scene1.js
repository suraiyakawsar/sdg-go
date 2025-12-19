import BaseStoryScene from "../BaseStoryScene";
import { emit, on /*, off*/ } from "../../../utils/eventBus";

export default class Chapter2Scene1 extends BaseStoryScene {
    constructor() {
        super("Chapter2Scene1", {
            // ✅ MUST match your JSON scene id for Chapter 2 Scene 1
            // change this once you add the chapter2_script.json
            sceneId: "chapter2_scene1",

            // ✅ change these to your real Chapter 2 json file/key
            jsonKey: "chapter2Data",
            jsonPath: "data/dialogues/chapters/chapter2_script.json",

            // ✅ change these to your real scene assets + node ids
            backgroundKey: "bgFoodBank",      // <-- replace if different
            startNodeId: "ch2_s1_intro",      // <-- replace with your first node id
            exitUnlockedFlag: "chapter2_scene1_exit_unlocked",

            // ✅ walk polygon — replace with your new scene’s values
            // walkArea: {
            //     topY: 900,
            //     bottomY: 1077,
            //     leftTopX: 400,
            //     rightTopX: 1300,
            //     leftBottomX: 200,
            //     rightBottomX: 1600,
            // },

            walkArea: {
                zones: [

                    // { xMin: 400, xMax: 1300, yMin: 700, yMax: 1000 }, // Main area

                    { xMin: 600, xMax: 1580, yMin: 950, yMax: 1090 }, // Main area
                    // { xMin: 400, xMax: 1600, yMin: 960, yMax: 1200 } // Floor
                ],
                // Required only for character scaling math
                topY: 850,
                bottomY: 1080,

                leftBottomX: 200,
                leftTopX: 500,

                rightTopX: 700,
                rightBottomX: 600,

                scaleFar: 1.5,  // Increase this if she is too small at the back
                scaleNear: 0.5,  // Decrease this if she is too big at the front
                playerSpeed: 200
            },


            // perfect scaling values found via tracker:
            scaleFar: 1,
            scaleNear: 1.4,
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

            // ✅ NPCs: replace with your actual Chapter 2 Scene 1 NPCs
            npcs: [
                {
                    name: "staff",
                    texture: "npc_staff",   // <-- replace
                    x: 900,
                    y: 650,
                    scale: 0.35,
                    dialogueId: "ch2_s1_staff", // <-- replace
                }
                // {
                //     name: "friendA",
                //     texture: "npc_friendA", // <-- replace
                //     x: 700,
                //     y: 780,
                //     scale: 0.35,
                //     dialogueId: "ch2_s1_friendA", // <-- replace
                // },
                // {
                //     name: "friendB",
                //     texture: "npc_friendB", // <-- replace
                //     x: 1100,
                //     y: 780,
                //     scale: 0.35,
                //     dialogueId: "ch2_s1_friendB", // <-- replace
                // },
            ],
        });

        // objective state (optional for this scene)
        this.objectiveCompleted = false;
    }


    create() {
        super.create();
        emit("updateChapterScene", { title: "Food Bank · Chapter 2" });
    }

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
}
