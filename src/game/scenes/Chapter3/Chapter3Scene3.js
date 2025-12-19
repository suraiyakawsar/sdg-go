// src/scenes/chapter3/Chapter3Scene3.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on /*, off*/ } from "../../../utils/eventBus";

export default class Chapter3Scene3 extends BaseStoryScene {
    constructor() {
        super("Chapter3Scene3", {
            backgroundKey: "bgNightCourtyard",
            dialogueKey: "chapter3_scene3",
            startNodeId: "n_intro_reflection",
            nextSceneKey: "Chapter4Scene1",
            exitFlag: "chapter3_completed",



            // ✅ walk polygon — replace with your new scene’s values
            walkArea: {
                topY: 790,
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


            // perfect scaling values found via tracker:
            scaleFar: 0.,
            scaleNear: 1.45,
            // Add this if you use Option 1:
            scaleTopOffset: 20,


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
        emit("updateChapterScene", { title: "Courtyard · Chapter 3" });
    }

    createSceneContent() {
        // Ambient fireflies (purely visual)
        this.createAmbientParticles({
            type: "fireflies",
            area: { x: 0, y: 0, width: 1920, height: 1080 },
            count: 18,
        });

        // Soft courtyard lights
        this.createLightSource({
            x: 620,
            y: 520,
            radius: 220,
            intensity: 0.35,
        });
        this.createLightSource({
            x: 1280,
            y: 540,
            radius: 220,
            intensity: 0.35,
        });

        // Internal narration trigger
        this.createTriggerZone({
            id: "reflection_zone",
            x: 960,
            y: 640,
            width: 500,
            height: 300,
            onEnter: () => {
                if (this.flags.has("chapter3_scene3_reflection_done")) return;
                this.startDialogue("n_intro_reflection");
            },
        });

        // Exit zone (fade out)
        this.createExitZone({
            x: 960,
            y: 880,
            width: 600,
            height: 160,
            glow: false,
            fadeOut: true,
        });
    }
}
