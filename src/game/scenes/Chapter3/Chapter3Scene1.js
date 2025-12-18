// src/scenes/chapter3/Chapter3Scene1.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on /*, off*/ } from "../../../utils/eventBus";

export default class Chapter3Scene1 extends BaseStoryScene {
    constructor() {
        super("Chapter3Scene1", {
            backgroundKey: "bgCampusGarden",
            dialogueKey: "chapter3_scene1",
            startNodeId: "g_intro",
            nextSceneKey: "Chapter3Scene2",
            exitFlag: "chapter3_scene1_exit_unlocked",

            walkArea: {
                topY: 844,
                bottomY: 1077,
                leftTopX: 480,
                rightTopX: 980,
                leftBottomX: 250,
                rightBottomX: 1000,
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

            player: {
                x: 500,        // Change this to your desired horizontal start
                y: 850,        // Change this to your desired vertical start
                key: "ladyy",  // Your sprite texture key
                frame: "frame1.png"
            }

        });
    }

    create() {
        super.create();
        emit("updateChapterScene", { title: "Campus Garden · Chapter 3" });
    }

    createSceneContent() {
        // Gardener NPC
        this.createNPC({
            id: "gardener",
            x: 880,
            y: 760,
            texture: "npcGardener",
            dialogueNodeId: "g_intro",
        });

        // Inspectable plants
        this.createInspectable({
            id: "plants",
            x: 520,
            y: 720,
            width: 200,
            height: 180,
            dialogueNodeId: "g_inspect_plants",
        });

        // Inspectable compost bin
        this.createInspectable({
            id: "compost_bin",
            x: 1150,
            y: 740,
            width: 220,
            height: 200,
            dialogueNodeId: "g_inspect_compost",
        });

        // Inspectable tools
        this.createInspectable({
            id: "garden_tools",
            x: 1400,
            y: 760,
            width: 200,
            height: 180,
            dialogueNodeId: "g_inspect_tools",
        });

        // Micro-task trigger (compost vs trash)
        this.createTriggerZone({
            id: "compost_task",
            x: 960,
            y: 640,
            width: 300,
            height: 200,
            onEnter: () => {
                if (this.flags.has("chapter3_scene1_task_done")) return;
                this.startDialogue("g_compost_task");
            },
        });

        // Exit zone
        this.createExitZone({
            x: 1820,
            y: 780,
            width: 200,
            height: 300,
            glow: true,
        });
    }
}
