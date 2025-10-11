// src/game/objects/DialogueManager.js
import Phaser from "phaser";
import { addPoints, getPoints, resetPoints } from "../../utils/sdgPoints.js";
import { emit } from "../../utils/eventBus";

export default class DialogueManager {
    constructor(scene, dialogueData, sdgPointsObj) {
        this.scene = scene;
        this.dialogueScript = dialogueData;
        this.sdgPointsObj = sdgPointsObj; // { points: number }

        this.dialogueIndex = 0;
        this.currentDialogue = null;
        this.dialogueVisible = false;
        this.dialogueFinished = false;

        this.choiceButtons = [];

        // Dialogue UI
        this.dialogueBox = scene.add.rectangle(
            scene.scale.width / 2,
            scene.scale.height - 80,
            640,
            120,
            0x000000,
            0.7
        ).setStrokeStyle(2, 0xffffff)
            .setScrollFactor(0)
            .setVisible(false);

        this.dialogueText = scene.add.text(180, scene.scale.height - 120, "", {
            fontSize: "18px",
            color: "#ffffff",
            wordWrap: { width: 500 },
        }).setScrollFactor(0)
            .setVisible(false);
    }

    startDialogue(key) {
        this.currentDialogue = this.dialogueScript[key];
        this.dialogueIndex = 0;
        this.dialogueVisible = true;
        this.dialogueBox.setVisible(true);
        this.dialogueText.setVisible(true);
        this.showCurrentLine();
    }

    showCurrentLine() {
        const line = this.currentDialogue[this.dialogueIndex];
        if (!line) {
            this.endDialogue();
            return;
        }

        this.dialogueText.setText(line.text);

        // Remove old choices
        this.choiceButtons.forEach(btn => btn.destroy());
        this.choiceButtons = [];

        if (line.choices) this.createChoices(line.choices);
        else if (this.dialogueIndex === this.currentDialogue.length - 1) {
            // Auto-close after last line
            this.scene.time.delayedCall(800, () => this.endDialogue());
        }
    }

    nextDialogue() {
        const line = this.currentDialogue[this.dialogueIndex];
        if (line && line.choices) return; // Wait for choice

        this.dialogueIndex++;
        if (this.dialogueIndex < this.currentDialogue.length) this.showCurrentLine();
        else this.endDialogue();
    }

    createChoices(choices) {
        const baseY = this.scene.scale.height - 50;
        choices.forEach((choice, i) => {
            const btn = this.scene.add.text(
                220 + i * 180,
                baseY,
                choice.text,
                { fontSize: "16px", color: "#00ffcc", backgroundColor: "#222", padding: { x: 8, y: 4 } }
            ).setScrollFactor(0)
                .setInteractive({ useHandCursor: true })
                .on("pointerover", () => btn.setStyle({ backgroundColor: "#333" }))
                .on("pointerout", () => btn.setStyle({ backgroundColor: "#222" }))
                .on("pointerdown", () => this.handleChoice(choice));

            this.choiceButtons.push(btn);
        });
    }

    handleChoice(choice) {
        this.choiceButtons.forEach(btn => btn.destroy());
        this.choiceButtons = [];

        // SDG points
        // inside DialogueManager.handleChoice(choice)
        // if (choice.points) {
        //     this.sdgPointsObj.points += choice.points;
        //     addPoints(choice.points); // local/global tally (optional)
        //     // update visible UI on the scene
        //     if (this.scene.sdgText && typeof this.scene.sdgText.setText === 'function') {
        //         this.scene.sdgText.setText(`SDG Points: ${this.sdgPointsObj.points}`);
        //     }
        // }
        if (choice.points) {
            this.sdgPointsObj.points += choice.points;
            const total = addPoints(choice.points);
            emit("updateSDGPoints", total); // 🔥 send new points to React
        }


        // Next action
        if (choice.next === "close" || choice.next === "end") {
            this.endDialogue();
        } else if (choice.next === "nextChapter") {
            if (this.scene.nextZone) {
                this.scene.nextZone.setVisible(true);
                this.scene.nextZoneVisible = true; // ⚡ must set the flag
            }
            this.endDialogue();
        } else {
            this.startDialogue(choice.next);
        }
    }

    endDialogue() {
        this.dialogueVisible = false;
        this.dialogueBox.setVisible(false);
        this.dialogueText.setVisible(false);
        this.choiceButtons.forEach(btn => btn.destroy());
        this.choiceButtons = [];
        this.dialogueFinished = true;
    }
}
