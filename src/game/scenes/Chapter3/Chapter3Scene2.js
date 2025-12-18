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
