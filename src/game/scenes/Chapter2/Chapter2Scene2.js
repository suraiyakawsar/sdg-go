// // src/scenes/Chapter2Scene2.js
// import BaseStoryScene from "../BaseStoryScene";
// import { emit, on /*, off*/ } from "../../../utils/eventBus";

// export default class Chapter2Scene2 extends BaseStoryScene {
//     constructor() {
//         super("Chapter2Scene2", {
//             sceneId: "street",

//             jsonKey: "chapter2Data",
//             jsonPath: "data/dialogues/chapters/chapter2_script.json",


//             backgroundKey: "bgStreet",
//             // nextScene: "Chapter2Scene3",
//             startNodeId: "ch2_s2_intro",
//             // dialogueKey: "street",
//             exitUnlockedFlag: "chapter2_scene2_exit_unlocked",


//             // ✅ walk polygon — replace with your new scene’s values
//             walkArea: {
//                 topY: 830,
//                 bottomY: 1077,
//                 leftTopX: 534,
//                 rightTopX: 1500,
//                 leftBottomX: 200,
//                 rightBottomX: 1600,
//             },

//             // perfect scaling values found via tracker:
//             scaleFar: 0.8,
//             scaleNear: 1.45,
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
//         });

//         // objective state (optional for this scene)
//         this.objectiveCompleted = false;
//     }

//     create() {
//         super.create();
//         emit("updateChapterScene", { title: "Street · Chapter 2" });
//     }

//     // createNPCs() {
//     //     this.organizer = this.createNPC({
//     //         id: "organizer",
//     //         x: 900,
//     //         y: 820,
//     //         texture: "npc_organizer",
//     //         dialogueKey: "ch2_scene2_organizer",
//     //     });

//     //     this.createNPC({
//     //         id: "student1",
//     //         x: 620,
//     //         y: 860,
//     //         texture: "npc_student",
//     //         dialogueKey: "ch2_scene2_student_positive",
//     //         ambient: true,
//     //     });

//     //     this.createNPC({
//     //         id: "student2",
//     //         x: 1180,
//     //         y: 860,
//     //         texture: "npc_student",
//     //         dialogueKey: "ch2_scene2_student_neutral",
//     //         ambient: true,
//     //     });
//     // }

//     // --------------------------------
//     // called after BaseStoryScene.create()
//     // --------------------------------
//     _customCreate() {
//         // Example objective (edit or delete)
//         emit("updateObjective", {
//             slot: "primary",
//             collected: 0,
//             goal: 1,
//             description: "Help at the food bank (talk to staff).",
//             complete: false,
//         });

//         // Listen for JSON unlock event
//         this._onSceneExitUnlocked = (payload) => {
//             const { sceneId, exitFlag } = payload || {};
//             if (sceneId !== this._story?.sceneId) return;
//             if (exitFlag !== this._story?.exitUnlockedFlag) return;

//             if (!this.objectiveCompleted) {
//                 this.objectiveCompleted = true;

//                 emit("updateObjective", {
//                     slot: "primary",
//                     delta: 1,
//                     complete: true,
//                 });

//                 // unlock door (BaseStoryScene glow helper)
//                 this.doorUnlocked = true;
//                 this._unlockDoorGlow?.();
//             }
//         };


//         on("sceneExitUnlocked", this._onSceneExitUnlocked);

//         this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
//             // if (typeof off === "function") off("sceneExitUnlocked", this._onSceneExitUnlocked);
//         });

//         // start intro dialogue (optional; remove if you want “click NPC to start” only)
//         this.time.delayedCall(350, () => this.startDialogue());
//     }

//     // --------------------------------
//     // door click override
//     // --------------------------------
//     _onDoorClicked() {
//         if (!this.doorUnlocked) {
//             console.log("Door locked. Finish the scene first.");
//             return;
//         }

//         if (this.playerInExitZone) this.goToNextScene();
//         else console.log("Too far from the door.");
//     }


//     //     createExitZone() {
//     //         this.createDoorExit({
//     //             x: 1550,
//     //             y: 860,
//     //             width: 120,
//     //             height: 220,
//     //             targetScene: this.nextScene,
//     //         });
//     //     }
// }










// import BaseStoryScene from "../BaseStoryScene";
// import { emit, on, off } from "../../../utils/eventBus";
// import { addSDGPoints } from "../../../utils/sdgPoints";

// export default class Chapter2Scene2 extends BaseStoryScene {
//     constructor() {
//         super("Chapter2Scene2", {
//             sceneId: "street",
//             jsonKey: "chapter2Data",
//             jsonPath: "data/dialogues/chapters/chapter2_script.json",

//             backgroundKey: "bgStreet",
//             startNodeId: "ch2_s1_intro",
//             exitUnlockedFlag: "chapter2_scene2_exit_unlocked",



//             walkArea: {
//                 topY: 780,
//                 bottomY: 1077,
//                 leftTopX: 700,
//                 rightTopX: 1230,
//                 leftBottomX: 200,
//                 rightBottomX: 1600,
//             },


//             scaleFar: 0.7,
//             scaleNear: 1.4,
//             scaleTopOffset: 20,

//             door: { x: 1585, y: 510, w: 120, h: 220, texture: "streetDoor" },

//             npcs: [
//                 {
//                     name: "aprilNPC",
//                     texture: "aprilNPC",
//                     x: 428,
//                     y: 685,
//                     // scale: 0.7,
//                     dialogueId: "ch2_scene2_organizer",
//                 },
//                 {
//                     name: "matthewNPC",
//                     texture: "matthewNPC",
//                     x: 691,
//                     y: 648,
//                     // scale: 0.7,
//                     dialogueId: "ch2_s1_staff",
//                 },
//                 {
//                     name: "brosNPCs",
//                     texture: "brosNPCs",
//                     x: 1452,
//                     y: 690,
//                     // scale: 0.7,
//                     dialogueId: "ch2_s1_staff",
//                 },
//                 {
//                     name: "squirrel",
//                     texture: "squirrel",
//                     x: 544,
//                     y: 196,
//                     // scale: 0.7,
//                     dialogueId: "ch2_s1_staff",
//                 },
//             ],
//         });

//         // objectives
//         this.objectiveStep = 1;         // 1 = talk, 2 = poster
//         this.objectiveCompleted = false;


//         // bind storage route
//         localStorage.setItem("sdgExplorer:lastRoute", "/game");
//     }

//     create() {
//         super.create();
//         emit("updateChapterScene", { title: "Street Outside Food Bank · Chapter 2" });

//     }

//     // --------------------------------
//     // Called after BaseStoryScene.create()
//     // --------------------------------
//     _customCreate() {
//         // Primary: talk to friend
//         emit("updateObjective", {
//             slot: "primary",
//             collected: 0,
//             goal: 1,
//             description: "Talk to your friend and unlock the next area.",
//             complete: false,
//         });

//         // Secondary: poster (preview only until step 2)
//         emit("updateObjective", {
//             slot: "secondary",
//             preview: true,
//             active: false,
//             collected: 0,
//             goal: 3,
//             description: "Optional: Talk to everyone.",
//         });

//         // emit("updateObjective", {
//         //     slot: "secondary",
//         //     delta: 1,
//         // });

//         // if (!this.objectiveCompleted && this.posterCollected >= this.posterGoal) {
//         //     this.objectiveCompleted = true;
//         //     emit("badgeEarned", "Eco Warrior! 🏅");
//         //     emit("updateObjective", { slot: "secondary", complete: true });



//         // Door starts locked until JSON unlock event fires
//         this.doorUnlocked = false;

//         // Listen once for JSON unlock flag
//         this._onSceneExitUnlocked = (payload) => {
//             const { sceneId, exitFlag } = payload || {};
//             if (sceneId !== "street") return;
//             if (exitFlag !== "chapter2_scene2_exit_unlocked") return;

//             if (this.objectiveStep === 1 && !this.objectiveCompleted) {
//                 this._completeStep1AndUnlock();
//             }
//         };

//         on("sceneExitUnlocked", this._onSceneExitUnlocked);

//         // Cleanup (only if your bus supports off())
//         this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
//             // if (typeof off === "function") off("sceneExitUnlocked", this._onSceneExitUnlocked);
//         });
//     }

//     // --------------------------------
//     // Step 1 -> Step 2 transition
//     // --------------------------------
//     _completeStep1AndUnlock() {
//         this.objectiveCompleted = true;

//         emit("updateObjective", {
//             slot: "primary",
//             delta: 1,
//             complete: true,
//         });

//         emit("updateSDGPoints", 10);
//         emit("badgeEarned", "Meeting Point Unlocked! 🔓");

//         // unlock door visuals + logic (BaseStoryScene has the glow helper)
//         this.doorUnlocked = true;
//         this._unlockDoorGlow?.();

//         // Step 2: posters becomes active
//         this.objectiveStep = 2;
//         this.objectiveCompleted = false;
//         this.posterCollected = 0;

//         emit("updateObjective", {
//             slot: "secondary",
//             active: true,
//             preview: false,
//             collected: 0,
//             goal: 3,
//             description: "Talk to everyone.",
//         });
//     }

//     // --------------------------------
//     // Posters
//     // --------------------------------






//     // --------------------------------
//     // Door click override: locked until unlocked
//     // --------------------------------
//     _onDoorClicked() {
//         if (!this.doorUnlocked) {
//             console.log("Door locked. Talk to your friend first.");
//             return;
//         }

//         if (this.playerInExitZone) this.goToNextScene();
//         else console.log("Too far from the door.");
//     }
// }





// src/scenes/chapter2/Chapter2Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on } from "../../../utils/eventBus";

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
                },
                {
                    name: "matthewNPC",
                    texture: "matthewNPC",
                    x: 691,
                    y: 648,
                    dialogueId: "ch2_s2_student",
                },
                {
                    name: "brosNPCs",
                    texture: "brosNPCs",
                    x: 1452,
                    y: 690,
                    dialogueId: "ch2_s2_group_help",
                },
                {
                    name: "squirrel",
                    texture: "squirrel",
                    x: 544,
                    y: 196,
                    dialogueId: "ch2_s2_squirrel",
                },
            ],
        });

        // Objectives
        this.objectiveStep = 1; // 1 = primary (talk), 2 = secondary (optional)
        this.objectiveCompleted = false;
        this.posterCollected = 0;
        this.posterGoal = 3;

        // Save current route
    }

    create() {
        super.create();

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgExplorer:lastRoute", "/game");  // ← Remove space
        localStorage.setItem("currentChapter", 2);
        localStorage.setItem("currentScene", "Chapter2Scene2");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter2Scene2");
        });

        emit("updateChapterScene", { title: "Street Outside Food Bank · Chapter 2" });
    }

    // Runs after BaseStoryScene.create()
    _customCreate() {
        // Primary Objective: talk to your friend
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            description: "Talk to your friend and unlock the next area.",
            complete: false,
        });

        // Secondary Objective (optional, preview until step 2)
        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.posterGoal,
            description: "Optional: Talk to everyone.",
        });

        // Door starts locked
        this.doorUnlocked = false;

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

        // Cleanup when scene shuts down
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            // off("sceneExitUnlocked", this._onSceneExitUnlocked); // enable if using off()
        });
    }

    // Step 1 -> Step 2 transition
    _completeStep1AndUnlock() {
        this.objectiveCompleted = true;

        // Update primary objective
        emit("updateObjective", {
            slot: "primary",
            delta: 1,
            complete: true,
        });

        emit("updateSDGPoints", 10);
        emit("badgeEarned", "Meeting Point Unlocked! 🔓");

        // Unlock door
        this.doorUnlocked = true;
        this._unlockDoorGlow?.();

        // Step 2: activate secondary objective
        this.objectiveStep = 2;
        this.objectiveCompleted = false;
        this.posterCollected = 0;

        emit("updateObjective", {
            slot: "secondary",
            active: true,
            preview: false,
            collected: 0,
            goal: this.posterGoal,
            description: "Talk to everyone.",
        });
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
