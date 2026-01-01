// src/scenes/chapter4/Chapter4Scene2.js
import BaseStoryScene from "../BaseStoryScene";
import { emit } from "../../../utils/eventBus";
import { saveChapterStats } from "../../../utils/gameSummary";

export default class Chapter4Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter4Scene2", {
            sceneId: "busStop",
            jsonKey: "chapter4Data",
            jsonPath: "data/dialogues/chapters/chapter4_script.json",

            backgroundKey: "bgBusStop",
            startNodeId: "ch4_s3_intro",
            exitUnlockedFlag: "chapter4_scene3_exit_unlocked",

            walkArea: {
                topY: 750,
                bottomY: 1050,
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
                texture: "busStopExitDoor",
            },

            npcs: [
                {
                    name: "friend",
                    texture: "busStopFriend",
                    x: 700,
                    y: 850,
                    scale: 1.2,
                    dialogueId: "ch4_s3_npc",
                }
            ],
        });

        this._chapterCompleted = false;

    }

    create() {
        super.create();

        // ✅ Store current scene (NO SPACE in key)
        localStorage.setItem("sdgExplorer:lastRoute", "/game");  // ← Remove space
        localStorage.setItem("currentChapter", 4);
        localStorage.setItem("currentScene", "Chapter4Scene2");

        // ✅ Store scene before unload
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("currentScene", "Chapter4Scene2");
        });


        emit("updateChapterScene", { title: "Bus Stop · Chapter 4" });
    }

    _customCreate() {
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            description: "Interact with the person at the bus stop and reflect on the day's actions.",
            complete: false,
        });

        this.doorUnlocked = false;
    }

    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Complete the bus stop conversation first.");
            return;
        }

        if (this.playerInExitZone) {
            this._onChapterComplete(); // ✅ Show summary instead of going directly
        } else {
            console.log("Too far from the door.");
        }
    }

    _onChapterComplete() {
        // Save chapter stats
        saveChapterStats(4); // Pass chapter number

        // Mark chapter as complete
        localStorage.setItem("chapter4_completed", "true");
        emit("updateChapterProgress");

        // Show chapter summary after a short delay
        this.time.delayedCall(1000, () => {
            emit("ui:showChapterSummary", { chapter: 4 });
        });
    }
}
