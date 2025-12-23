// // src/scenes/chapter3/Chapter3Scene2.js
// import BaseStoryScene from "../BaseStoryScene";
// import { emit, on /*, off*/ } from "../../../utils/eventBus";

// export default class Chapter4Scene1 extends BaseStoryScene {
//     constructor() {
//         super("Chapter4Scene1", {
//             sceneId: "nightCourtyard",
//             jsonKey: "chapter4Data",
//             jsonPath: "data/dialogues/chapters/chapter4_script.json",

//             backgroundKey: "bgClassroom2",
//             dialogueKey: "chapter4_scene1",
//             startNodeId: "r_intro_prof",
//             nextSceneKey: "Chapter4Scene2",
//             exitFlag: "chapter4_scene1_exit_unlocked",


//             walkArea: {
//                 topY: 844,
//                 bottomY: 1077,
//                 leftTopX: 893,
//                 rightTopX: 1125,
//                 leftBottomX: 400,
//                 rightBottomX: 1125,
//             },


//             // perfect scaling values found via tracker:
//             scaleFar: 0.75,
//             scaleNear: 1.45,
//             // Add this if you use Option 1:
//             scaleTopOffset: 20,

//             // perfect scaling values found via tracker:
//             scaleFar: 0.75,
//             scaleNear: 1.45,
//             // Add this if you use Option 1:
//             scaleTopOffset: 20,

//             player: {
//                 x: 1125,        // Change this to your desired horizontal start
//                 y: 1077,        // Change this to your desired vertical start
//                 key: "ladyy",  // Your sprite texture key
//                 frame: "frame1.png"
//             },


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
//     }

//     create() {
//         super.create();
//         emit("updateChapterScene", { title: "Classroom · Chapter 3" });
//     }

//     createSceneContent() {
//         // Professor NPC
//         this.createNPC({
//             id: "professor",
//             x: 900,
//             y: 720,
//             texture: "npcProfessor",
//             dialogueNodeId: "r_intro_prof",
//         });

//         // Reflection trigger (player internal dialogue)
//         this.createTriggerZone({
//             id: "reflection_zone",
//             x: 960,
//             y: 620,
//             width: 400,
//             height: 240,
//             onEnter: () => {
//                 if (this.flags.has("chapter3_scene2_reflection_done")) return;
//                 this.startDialogue("r_player_reflect");
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



// src/scenes/chapter4/Chapter4Scene1.js
import BaseStoryScene from "../BaseStoryScene";
import { emit } from "../../../utils/eventBus";

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
                rightTopX: 1000,
                leftBottomX: 300,
                rightBottomX: 1050,
            },

            scaleFar: 0.8,
            scaleNear: 1.4,
            scaleTopOffset: 20,

            door: {
                x: 100,
                y: 900,
                w: 200,
                h: 400,
                texture: "pondExitDoor",
            },

            npcs: [
                {
                    name: "volunteer",
                    texture: "volunteer",
                    x: 700,
                    y: 850,
                    scale: 1.2,
                    dialogueId: "ch4_s1_npc",
                }
            ],
        });
    }

    create() {
        super.create();

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgExplorer:lastRoute", "/game");  // ← Remove space
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
            description: "Help clean the pond and reflect on environmental impact.",
            complete: false,
        });

        this.doorUnlocked = false;
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
