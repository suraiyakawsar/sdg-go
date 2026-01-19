// src/game/scenes/Chapter3/Chapter3Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { unlockBadge } from "../../../utils/unlockBadge";

export default class Chapter3Scene1 extends BaseStoryScene {
    constructor() {
        super("Chapter3Scene1", {
            sceneId: "classroom2",
            jsonKey: "chapter3Data",
            jsonPath: "data/dialogues/chapters/chapter3_script.json",

            backgroundKey: "bgClassroom2",
            startNodeId: "ch3_s1_intro",
            exitUnlockedFlag: "chapter3_scene1_exit_unlocked",

            walkArea: {
                topY: 840,
                bottomY: 1077,
                leftTopX: 500,
                rightTopX: 1000,
                leftBottomX: 160,
                rightBottomX: 1070,
            },

            scaleFar: 0.83,
            scaleNear: 1.45,
            scaleTopOffset: 20,

            player: {
                x: 1000,
                y: 1077,
                key: "ladyy",
                frame: "frame1.png"
            },

            door: {
                x: 243,
                y: 597,
                w: 120,
                h: 220,
                texture: "bgClassroom2Door",
            },

            npcs: [
                {
                    name: "professor",
                    texture: "professor",
                    x: 470,
                    y: 680,
                    dialogueId: "ch3_s1_professor_start",
                    inspectDialogueId: "inspect_professor",
                },
                {
                    name: "screen",
                    texture: "screen",
                    x: 710,
                    y: 407,
                    scale: 0.98,
                    dialogueId: "ch3_s1_screen_read",
                    inspectDialogueId: "inspect_screen",
                }
            ],
        });

        // objectives
        this.objectiveStep = 1;
        this.objectiveCompleted = false;
        this.professorTalked = false;
        this._chapterCompleted = false;
    }

    create() {
        super.create();

        // ✅ Reset session counters at the START of chapter 3
        localStorage.setItem("sessionSDGPoints", "0");
        localStorage.setItem("sessionGoodChoices", "0");
        localStorage.setItem("sessionBadChoices", "0");
        console.log("🔄 Chapter 3: Session counters reset");


        localStorage.setItem("sdgo:lastRoute", "/game");
        localStorage.setItem("currentChapter", 3);
        localStorage.setItem("currentScene", "Chapter3Scene1");

        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter3Scene1");
        });

        emit("updateChapterScene", { title: "Classroom · Chapter 3" });
    }

    // --------------------------------
    // Called after BaseStoryScene. create()
    // --------------------------------
    _customCreate() {
        // Primary:   talk to professor (REQUIRED)
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            title: "Seek Guidance for Real Action",
            description: "Talk to Professor Danny to learn what initiatives you can take part in.",
            complete: false,
        });

        // Secondary: talk to screen NPC (OPTIONAL)
        emit("updateObjective", {
            slot: "secondary",
            preview: false,
            active: true,
            collected: 0,
            goal: 1,
            title: "Test Your Knowledge",
            description: "Interact with the Sustainable Development Initiatives screen.",
        });

        // Door starts locked
        this.doorUnlocked = false;
        this.screenDialogueViewed = false;

        // ✅ Listen for professor dialogue completion
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "classroom2") return;
            if (exitFlag !== "chapter3_scene1_exit_unlocked") return;


            if (this.objectiveStep === 1 && !this.objectiveCompleted) {
                this._completeStep1AndUnlock();
            }
        };

        on("sceneExitUnlocked", this._onSceneExitUnlocked);

        // ✅ Listen for screen dialogue flag
        this._onFlagsUpdated = (flags) => {
            console.log(`🚩 Flags updated: `, flags);

            if (flags && flags.includes("screen_dialogue_viewed") && !this.screenDialogueViewed) {
                this.screenDialogueViewed = true;
                console.log("✅ Screen dialogue completed!");

                emit("updateObjective", {
                    slot: "secondary",
                    delta: 1,
                    complete: true,
                });

                emit("badgeEarned", { name: "Putting Knowledge to the Test", icon: "📝", subtitle: "You completed the SDG quiz after guidance." });
                unlockBadge("putting-knowledge-to-the-test");
            }
        };

        on("flagsUpdated", this._onFlagsUpdated);

        // Cleanup
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            off("sceneExitUnlocked", this._onSceneExitUnlocked);
            off("flagsUpdated", this._onFlagsUpdated);
        });
    }

    // --------------------------------
    // Unlock door when PRIMARY objective is met
    // --------------------------------
    _completeStep1AndUnlock() {
        if (this.objectiveCompleted) return;
        this.objectiveCompleted = true;

        // Mark PRIMARY objective complete
        emit("updateObjective", {
            slot: "primary",
            delta: 1,
            complete: true,
        });

        emit("badgeEarned", { name: "Guided by Experience", icon: "🧠", subtitle: "You sought advice instead of guessing your way forward." });
        unlockBadge("guided-by-experience");
        // Unlock door visuals
        this.doorUnlocked = true;

        this.objectiveStep = 2;
    }

    // --------------------------------
    // Door click override
    // --------------------------------
    _onDoorClicked() {
        console.log("🚪 Door clicked!  doorUnlocked:", this.doorUnlocked);

        if (!this.doorUnlocked) {
            console.log("❌ Door is locked.  Talk to the professor first.");
            return;
        }

        if (this.playerInExitZone) this.goToNextScene();
        else console.log("Too far from the door.");
    }
}