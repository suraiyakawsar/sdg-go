import Phaser from "phaser";
import { emit, on, off } from "../../utils/eventBus";
// import { addSDGPoints } from "../../utils/sdgPoints";

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: "UIScene" });

        this.dialogueLines = [];
        this.currentIndex = 0;
    }

    create() {
        this.registerEvents();

        this.infoText = this.add.text(16, 16, "SDG Explorer", {
            fontSize: "18px",
            fill: "#ffffff",
            fontFamily: "Arial",
        });
        this.infoText.setScrollFactor(0);
    }

    registerEvents() {
        // 🗣 Start dialogue when interacting with an NPC
        on("npcInteraction", (data) => {
            this.startDialogue(data);
        });

        // 🖱 Advance dialogue manually (e.g. clicking "Next")
        on("dialogueNext", () => {
            this.advanceDialogue();
        });

        // 🎯 Handle player’s choice selection
        on("dialogueChoice", (choice) => {
            // ✅ If the choice has SDG impact
            if (typeof choice.sdgPoints === "number") {
                addSDGPoints(choice.sdgPoints);
                if (choice.sdgPoints > 0) {
                    emit("showFeedback", {
                        text: `✅ Good choice! +${choice.sdgPoints} SDG points.`,
                        color: "#00ff00",
                    });
                } else if (choice.sdgPoints < 0) {
                    emit("showFeedback", {
                        text: `❌ That choice had negative impact. ${choice.sdgPoints} SDG points.`,
                        color: "#ff5555",
                    });
                }
            }

            // ✅ If the dialogue should end here
            if (choice.next === "end") {
                emit("hideDialogue");
                emit("dialogueEnded");
                return;
            }

            // ✅ If choice leads to another small branch
            if (choice.next === "more") {
                this.startDialogue({
                    text: "Nice! Let’s make the world better, one SDG at a time 🌏",
                    choices: [{ text: "Let's go!", next: "end", sdgPoints: 5 }],
                });
                return;
            }

            // ✅ Otherwise continue normally
            this.advanceDialogue();

            on("dialogueChoice", (choice) => {
                // notify current chapter scene to handle points and next step
                const scene = this.scene.getScenes(true).find(s => s instanceof Phaser.Scene && s.scene.key.startsWith("Chapter"));
                if (scene && scene.handleChoiceNext) {
                    scene.handleChoiceNext(choice.next, choice.points || 0);
                }
                emit("hideDialogue");
            });

        });
    }

    /**
     * Starts a dialogue (single or multiple lines)
     */
    startDialogue(data) {
        if (Array.isArray(data.lines)) {
            this.dialogueLines = data.lines;
            this.currentIndex = 0;
            this.showCurrentLine();
        } else {
            emit("showDialogue", {
                text: data.text || "This is a dialogue test from UIScene.",
                choices: data.choices || [
                    { text: "Continue", next: "nextLine" },
                    { text: "Goodbye", next: "end" },
                ],
            });
        }
    }

    /**
     * Shows the current dialogue line
     */
    showCurrentLine() {
        const line = this.dialogueLines[this.currentIndex];
        if (!line) {
            emit("hideDialogue");
            return;
        }

        emit("showDialogue", {
            text: line.text,
            choices: line.choices || [],
        });
    }

    /**
     * Moves to next line or ends dialogue
     */
    advanceDialogue() {
        if (this.dialogueLines.length === 0) {
            emit("hideDialogue");
            return;
        }

        this.currentIndex++;
        if (this.currentIndex >= this.dialogueLines.length) {
            emit("hideDialogue");
            emit("dialogueEnded");
        } else {
            this.showCurrentLine();
        }
    }

    shutdown() {
        off("npcInteraction");
        off("dialogueNext");
        off("dialogueChoice");
    }
}
