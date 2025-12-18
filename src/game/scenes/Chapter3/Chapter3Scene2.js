// src/scenes/chapter3/Chapter3Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on /*, off*/ } from "../../../utils/eventBus";

export default class Chapter3Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter3Scene2", {
            backgroundKey: "bgClassroom2",
            dialogueKey: "chapter3_scene2",
            startNodeId: "r_intro_prof",
            nextSceneKey: "Chapter3Scene3",
            exitFlag: "chapter3_scene2_exit_unlocked",


            walkArea: {
                topY: 844,
                bottomY: 1077,
                leftTopX: 893,
                rightTopX: 1125,
                leftBottomX: 400,
                rightBottomX: 1125,
            },

            // perfect scaling values found via tracker:
            scaleFar: 0.75,
            scaleNear: 1.45,
            // Add this if you use Option 1:
            scaleTopOffset: 20,

            player: {
                x: 1125,        // Change this to your desired horizontal start
                y: 1077,        // Change this to your desired vertical start
                key: "ladyy",  // Your sprite texture key
                frame: "frame1.png"
            },


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
    }

    create() {
        super.create();
        emit("updateChapterScene", { title: "Classroom · Chapter 3" });
    }

    createSceneContent() {
        // Professor NPC
        this.createNPC({
            id: "professor",
            x: 900,
            y: 720,
            texture: "npcProfessor",
            dialogueNodeId: "r_intro_prof",
        });

        // Reflection trigger (player internal dialogue)
        this.createTriggerZone({
            id: "reflection_zone",
            x: 960,
            y: 620,
            width: 400,
            height: 240,
            onEnter: () => {
                if (this.flags.has("chapter3_scene2_reflection_done")) return;
                this.startDialogue("r_player_reflect");
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
