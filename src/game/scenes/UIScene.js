import Phaser from "phaser";
import { emit, on, off } from "../../utils/eventBus";
// import { addSDGPoints } from "../../utils/sdgPoints";

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: "UIScene" });

        this.dialogueLines = [];
        this.currentIndex = 0;

        // store handler refs so we can off() them
        this.handleNpcInteraction = this.handleNpcInteraction.bind(this);
        this.handleDialogueNext = this.handleDialogueNext.bind(this);
        this.handleDialogueChoice = this.handleDialogueChoice.bind(this);
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

    /* ============================================================
       EVENT REGISTRATION
    ============================================================ */
    registerEvents() {
        on("npcInteraction", this.handleNpcInteraction);
        on("dialogueNext", this.handleDialogueNext);
        on("dialogueChoice", this.handleDialogueChoice);


        // NEW: handle autoplay nodes for cinematic scenes
        on("startNodeAutoplay", (nodeId) => {
            console.log("[UIScene] startNodeAutoplay received:", nodeId);

            // Lookup the node from JSON
            const sceneData = this.scene.dialogueData.scenes.find(s => s.id === "nightCourtyard");
            const node = sceneData.nodes.find(n => n.id === nodeId);
            if (!node) {
                console.warn("[UIScene] Node not found:", nodeId);
                return;
            }

            // Start the node as a single-line dialogue
            this.startDialogue({ lines: [node] });

            // Auto-advance after a short delay based on text length
            const delay = 1000 + node.text.length * 50; // 50ms per char + 1s buffer
            this.time.delayedCall(delay, () => {
                console.log("[UIScene] Auto-advancing node:", nodeId);
                this.advanceDialogue(); // this will trigger dialogueEnded for the single line
            });
        });

    }

    handleNpcInteraction(data) {
        this.startDialogue(data);
    }

    handleDialogueNext() {
        this.advanceDialogue();
    }

    handleDialogueChoice(choice) {
        if (!choice) return;

        // ✅ Optionally handle SDG points here OR just emit to React/UI
        if (typeof choice.sdgPoints === "number") {
            // If you want UIScene to directly mutate SDG points:
            // addSDGPoints(choice.sdgPoints);

            // Or: use your existing UI/event pipeline:
            emit("updateSDGPoints", choice.sdgPoints);

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

        // ✅ Let chapter scenes know about branching / next step
        emit("dialogueChoiceApplied", {
            next: choice.next,
            sdgPoints: choice.sdgPoints || 0,
        });

        // ✅ handle simple branching keywords
        if (choice.next === "end") {
            emit("hideDialogue");
            emit("dialogueEnded");
            return;
        }

        if (choice.next === "more") {
            this.startDialogue({
                text: "Nice! Let’s make the world better, one SDG at a time 🌏",
                choices: [{ text: "Let's go!", next: "end", sdgPoints: 5 }],
            });
            return;
        }

        // ✅ Otherwise, treat as "continue to next line"
        this.advanceDialogue();
    }

    /* ============================================================
       DIALOGUE FLOW
    ============================================================ */

    /**
     * Starts a dialogue (single or multiple lines)
     * data can be:
     *  - { lines: [{ text, choices? }, ...] }
     *  - { text, choices? }
     */
    startDialogue(data = {}) {
        if (Array.isArray(data.lines)) {
            this.dialogueLines = data.lines;
            this.currentIndex = 0;
            this.showCurrentLine();
            return;
        }

        // single-line fallback
        emit("showDialogue", {
            text: data.text || "This is a dialogue test from UIScene.",
            choices:
                data.choices || [
                    { text: "Continue", next: "nextLine" },
                    { text: "Goodbye", next: "end" },
                ],
        });
    }

    /**
     * Shows the current dialogue line from dialogueLines[]
     */
    showCurrentLine() {
        const line = this.dialogueLines[this.currentIndex];
        if (!line) {
            emit("hideDialogue");
            emit("dialogueEnded");
            return;
        }

        emit("showDialogue", {
            text: line.text,
            choices: line.choices || [],
        });
    }

    /**
     * Moves to the next line or ends dialogue
     */
    advanceDialogue() {
        console.log("[UIScene] advanceDialogue called, currentIndex:", this.currentIndex);
        // ... rest of your existing advanceDialogue code


        if (!this.dialogueLines || this.dialogueLines.length === 0) {
            emit("hideDialogue");
            emit("dialogueEnded");
            return;
        }

        this.currentIndex += 1;

        if (this.currentIndex >= this.dialogueLines.length) {
            emit("hideDialogue");
            emit("dialogueEnded");
            this.dialogueLines = [];
            this.currentIndex = 0;
        } else {
            this.showCurrentLine();
        }
    }

    /* ============================================================
       CLEANUP
    ============================================================ */
    shutdown() {
        off("npcInteraction", this.handleNpcInteraction);
        off("dialogueNext", this.handleDialogueNext);
        off("dialogueChoice", this.handleDialogueChoice);
        off("startNodeAutoplay"); // remove new handler

    }

    destroy() {
        this.shutdown();
        super.destroy();
    }
}
