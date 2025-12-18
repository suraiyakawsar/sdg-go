// src/scenes/chapter2/Chapter2Scene3.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on /*, off*/ } from "../../../utils/eventBus";

export default class Chapter2Scene3 extends BaseStoryScene {
    constructor() {
        super("Chapter2Scene3", {
            backgroundKey: "bgMeeting",
            dialogueKey: "chapter2_scene3",
            startNodeId: "b_intro",
            nextSceneKey: "Chapter3Scene1",
            exitFlag: "chapter2_completed",


            walkArea: {
                topY: 755,
                bottomY: 1077,
                leftTopX: 665,
                rightTopX: 1500,
                leftBottomX: 100,
                rightBottomX: 1670,
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
        emit("updateChapterScene", { title: "Meeting · Chapter 2" });
    }

    createSceneContent() {
        // Beneficiary NPC
        this.createNPC({
            id: "beneficiary",
            x: 960,
            y: 760,
            texture: "npcBeneficiary",
            dialogueNodeId: "b_intro",
        });

        // Friend A (non-physical, message-only trigger)
        this.createTriggerZone({
            id: "friend_message_trigger",
            x: 960,
            y: 600,
            width: 400,
            height: 200,
            onEnter: () => {
                if (this.flags.has("chapter2_scene3_message_shown")) return;
                this.flags.add("chapter2_scene3_message_shown");
                this.startDialogue("f_message");
            },
        });

        // Exit
        this.createExitZone({
            x: 1800,
            y: 780,
            width: 200,
            height: 300,
            glow: true,
        });
    }
}
