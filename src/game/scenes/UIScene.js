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

        this.infoText = this.add.text(16, 16, "SDGo!", {
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

        // ✅ Handle points (ONLY here, not in DialogueManager or chapter scenes)
        if (typeof choice.sdgDelta === "number" && choice.sdgDelta !== 0) {

            const sessionPoints = Number(localStorage.getItem("sessionSDGPoints")) || 0;
            localStorage.setItem("sessionSDGPoints", String(sessionPoints + choice.sdgDelta));


            // Track good/bad CHOICES (not points) - SESSION only
            if (choice.sdgDelta > 0) {
                const sessionGood = Number(localStorage.getItem("sessionGoodChoices")) || 0;
                localStorage.setItem("sessionGoodChoices", String(sessionGood + 1));
                console.log(`✅ Good choice!  Session:  ${sessionGood + 1}`);
            } else if (choice.sdgDelta < 0) {
                const sessionBad = Number(localStorage.getItem("sessionBadChoices")) || 0;
                localStorage.setItem("sessionBadChoices", String(sessionBad + 1));
                console.log(`❌ Bad choice!  Session: ${sessionBad + 1}`);
            }
        }

        // Also check for explicit markers
        if (choice.isGoodChoice === true) {
            const sessionGood = Number(localStorage.getItem("sessionGoodChoices")) || 0;
            localStorage.setItem("sessionGoodChoices", String(sessionGood + 1));
        } else if (choice.isBadChoice === true || choice.isCareless === true) {
            const sessionBad = Number(localStorage.getItem("sessionBadChoices")) || 0;
            localStorage.setItem("sessionBadChoices", String(sessionBad + 1));
        }

        // Let chapter scenes know about branching / next step
        emit("dialogueChoiceApplied", {
            next: choice.next,
            sdgPoints: choice.sdgDelta || 0,
        });

        // Handle simple branching keywords
        if (choice.next === "end") {
            emit("hideDialogue");
            emit("dialogueEnded");
            return;
        }

        if (choice.next === "more") {
            this.startDialogue({
                text: "Nice!  Let's make the world better, one SDG at a time 🌏",
                choices: [{ text: "Let's go!", next: "end", sdgDelta: 5 }],
            });
            return;
        }

        // Otherwise, treat as "continue to next line"
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
        // ... rest of the existing advanceDialogue code


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
