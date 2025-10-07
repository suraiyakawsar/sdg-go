import Phaser from "phaser";
import { emit, on, off } from "../../utils/eventBus";

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: "UIScene" });
    }

    create() {
        // Listen for dialogue events from GameScene
        this.registerEvents();

        // Example text overlay (optional)
        this.infoText = this.add.text(16, 16, "SDG Explorer", {
            fontSize: "18px",
            fill: "#ffffff",
            fontFamily: "Arial",
        });
        this.infoText.setScrollFactor(0);
    }

    registerEvents() {
        // Listen to an in-game trigger from GameScene
        on("npcInteraction", (data) => {
            this.showDialogue(data);
        });
    }

    showDialogue(data) {
        // Emit dialogue data to React’s DialogueBox
        emit("showDialogue", {
            text: data.text || "This is a dialogue test from UIScene.",
            choices: data.choices || [
                { text: "Continue", next: "nextLine" },
                { text: "Goodbye", next: "close" },
            ],
        });
    }

    update() {
        // Optional: Could update overlay UI, timers, etc.
    }

    shutdown() {
        // Cleanup when scene is stopped
        off("npcInteraction", this.showDialogue);
    }
}
