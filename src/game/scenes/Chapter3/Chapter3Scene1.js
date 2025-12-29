// // src/scenes/chapter3/Chapter3Scene1.js
// import BaseStoryScene from "../BaseStoryScene";
// import { emit, on /*, off*/ } from "../../../utils/eventBus";

// export default class Chapter3Scene1 extends BaseStoryScene {
//     constructor() {
//         super("Chapter3Scene1", {
//             backgroundKey: "bgCampusGarden",
//             dialogueKey: "chapter3_scene1",
//             startNodeId: "g_intro",
//             nextSceneKey: "Chapter3Scene2",
//             exitFlag: "chapter3_scene1_exit_unlocked",

//             walkArea: {
//                 topY: 844,
//                 bottomY: 1077,
//                 leftTopX: 480,
//                 rightTopX: 980,
//                 leftBottomX: 250,
//                 rightBottomX: 1000,
//             },


//             // perfect scaling values found via tracker:
//             scaleFar: 0.9,
//             scaleNear: 1.55,
//             // Add this if you use Option 1:
//             scaleTopOffset: 20,


//             // ✅ door (swap texture/x/y to match your artwork)
//             door: {
//                 x: 300,
//                 y: 600,
//                 w: 120,
//                 h: 220,
//                 texture: "doorFoodBank", // <-- replace (or reuse a generic door)
//             },


//             npcs: [
//                 {
//                     name: "organizer",
//                     texture: "npc_organizer",   // <-- replace
//                     x: 900,
//                     y: 650,
//                     scale: 0.35,
//                     dialogueId: "ch2_scene2_organizer", // <-- replace
//                 }
//             ],

//             player: {
//                 x: 500,        // Change this to your desired horizontal start
//                 y: 850,        // Change this to your desired vertical start
//                 key: "ladyy",  // Your sprite texture key
//                 frame: "frame1.png"
//             }

//         });
//     }

//     create() {
//         super.create();
//         emit("updateChapterScene", { title: "Campus Garden · Chapter 3" });
//     }

//     createSceneContent() {
//         // Gardener NPC
//         this.createNPC({
//             id: "gardener",
//             x: 880,
//             y: 760,
//             texture: "npcGardener",
//             dialogueNodeId: "g_intro",
//         });

//         // Inspectable plants
//         this.createInspectable({
//             id: "plants",
//             x: 520,
//             y: 720,
//             width: 200,
//             height: 180,
//             dialogueNodeId: "g_inspect_plants",
//         });

//         // Inspectable compost bin
//         this.createInspectable({
//             id: "compost_bin",
//             x: 1150,
//             y: 740,
//             width: 220,
//             height: 200,
//             dialogueNodeId: "g_inspect_compost",
//         });

//         // Inspectable tools
//         this.createInspectable({
//             id: "garden_tools",
//             x: 1400,
//             y: 760,
//             width: 200,
//             height: 180,
//             dialogueNodeId: "g_inspect_tools",
//         });

//         // Micro-task trigger (compost vs trash)
//         this.createTriggerZone({
//             id: "compost_task",
//             x: 960,
//             y: 640,
//             width: 300,
//             height: 200,
//             onEnter: () => {
//                 if (this.flags.has("chapter3_scene1_task_done")) return;
//                 this.startDialogue("g_compost_task");
//             },
//         });

//         // Exit zone
//         this.createExitZone({
//             x: 1820,
//             y: 780,
//             width: 200,
//             height: 300,
//             glow: true,
//         });
//     }
// }



// src/scenes/chapter2/Chapter2Scene3.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";

export default class Chapter3Scene1 extends BaseStoryScene {
    constructor() {
        super("Chapter3Scene1", {
            sceneId: "garden",
            jsonKey: "chapter3Data",
            jsonPath: "data/dialogues/chapters/chapter3_script.json",

            backgroundKey: "bgCampusGarden",
            startNodeId: "ch3_s1_intro",
            exitUnlockedFlag: "chapter3_scene1_exit_unlocked",

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

            // ✅ door (swap texture/x/y to match your artwork)
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
                    texture: "gardener",   // <-- replace
                    x: 1060,
                    y: 650,
                    scale: 1.5,
                    dialogueId: "ch3_s1_gardener", // <-- replace
                },
                {
                    name: "cat",
                    texture: "cat",
                    x: 700,
                    y: 900,
                    scale: 0.6,
                    dialogueId: "cat"
                },
                {
                    name: "tools",
                    texture: "gardeningTools",
                    x: 755,
                    y: 700,
                    scale: 0.7,
                    dialogueId: "tools"
                },
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

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgExplorer:lastRoute", "/game");  // ← Remove space
        localStorage.setItem("currentChapter", 3);
        localStorage.setItem("currentScene", "Chapter3Scene1");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter3Scene1 ");
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
            description: "Talk to the gardener and reflect on sustainable action.",
            complete: false,
        });

        // emit("updateObjective", {
        //     slot: "secondary",
        //     preview: true,
        //     active: false,
        //     collected: 0,
        //     goal: this.posterGoal,
        //     description: "Optional: Find and click hidden classroom posters.",
        // });

        this._createPosters();
        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "garden") return;
            if (exitFlag !== "chapter3_scene1_exit_unlocked") return;

            if (this.objectiveStep === 1 && !this.objectiveCompleted) {
                this._completeStep1AndUnlock();
            }
        };

        on("sceneExitUnlocked", this._onSceneExitUnlocked);

        // Cleanup (only if your bus supports off())
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            // if (typeof off === "function") off("sceneExitUnlocked", this._onSceneExitUnlocked);
        });



        this.events.on("update", () => {
            if (!this.player || !this.tree) return;

            if (this.player.y > this.tree.y) {
                this.player.setDepth(this.tree.depth + 1);
            } else {
                this.player.setDepth(this.tree.depth - 1);
            }
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
        emit("badgeEarned", "Reflection Complete 🌱");

        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;
        this._unlockDoorGlow?.();

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
            description: "Find and click hidden classroom posters.",
        });
    }


    _createPosters() {

        // this.meetingDoorArch = this.add.image(340, 495, "meetingDoorArch");
    }

    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Talk to your professor first.");
            return;
        }

        if (this.playerInExitZone) this.goToNextScene();
        else console.log("Too far from the door.");
    }
}
