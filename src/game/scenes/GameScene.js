import Phaser from "phaser";
import Player from "../objects/Player";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("bg", "/assets/images/environments/bg.png");
    this.load.image("lady", "assets/images/characters/lady.png");
  }

  create() {
    // 🌆 Background
    this.bg = this.add.image(0, 0, "bg").setOrigin(0);
    this.bg.displayWidth = this.scale.width;
    this.bg.displayHeight = this.scale.height;
    this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

    // 🧍 Player
    this.lady = new Player(this, this.scale.width / 2, this.scale.height / 2, "lady");
    this.lady.setCollideWorldBounds(true);

    // 🎥 Camera
    this.cameras.main.startFollow(this.lady);
    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

    // 🖱️ Click-to-move
    this.target = null;
    this.speed = 200;
    this.input.on("pointerdown", (pointer) => {
      if (this.dialogueVisible) return;
      this.target = { x: pointer.worldX, y: pointer.worldY };
    });

    // 🌱 SDG Points System
    this.sdgPoints = 0;
    this.sdgText = this.add.text(20, 20, "SDG Points: 0", {
      fontSize: "20px",
      color: "#00ff99",
      fontFamily: "Arial",
      fontStyle: "bold",
    }).setScrollFactor(0);

    // 💬 Dialogue data

    this.dialogueScript = {
      intro: [
        { text: "Hey there, explorer! Welcome to SDG World 🌍" },
        {
          text: "Would you like to know more about how you can make a difference?",
          choices: [
            { text: "Tell me more!", next: "info", points: +5 },
            { text: "Maybe later", next: "close", points: -5 },
          ],
        },
      ],
      info: [
        { text: "The SDGs are 17 goals to make the world a better place." },
        { text: "They cover poverty, climate, health, and equality." },
        {
          text: "If you see trash on the street, what would you do?",
          choices: [
            { text: "Pick it up and throw it away ♻️", next: "reward", points: +10 },
            { text: "Ignore it — not my problem 😐", next: "penalty", points: -5 },
          ],
        },
      ],
      reward: [
        { text: "Nice work! Small actions make a big difference 🌿" },
        {
          text: "Want to continue learning?",
          choices: [
            { text: "Yes, tell me more!", next: "info", points: +3 },
            { text: "Not now", next: "end", points: 0 },
          ],
        },
      ],
      penalty: [
        { text: "Hmm... that wasn’t the best choice 😔" },
        {
          text: "Everyone can make small changes to help our planet.",
          choices: [
            { text: "I’ll do better next time", next: "info", points: +5 },
            { text: "I don’t care", next: "end", points: -3 },
          ],
        },
      ],
      end: [
        { text: "Thanks for playing this part of the story! 🌏" },
        { text: "Keep exploring and making good choices 💪" },
      ],
    };


    // Add a flag to track if dialogue has ended
    this.dialogueFinished = false;
    this.currentDialogue = null;
    this.dialogueIndex = 0;
    this.dialogueVisible = false;

    // 🗨️ Dialogue Box
    this.dialogueBox = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 80,
      640,
      120,
      0x000000,
      0.7
    ).setStrokeStyle(2, 0xffffff)
      .setScrollFactor(0)
      .setVisible(false);

    this.dialogueText = this.add.text(180, this.scale.height - 120, "", {
      fontSize: "18px",
      color: "#ffffff",
      wordWrap: { width: 500 },
    }).setScrollFactor(0)
      .setVisible(false);

    // 🎯 Choice buttons
    this.choiceButtons = [];

    // 🎹 Press E to trigger dialogue
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.dialogueFinished = false; // flag to prevent re-triggering after end

  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
      if (!this.dialogueVisible && !this.dialogueFinished) {
        this.startDialogue("intro");
      } else if (this.dialogueVisible) {
        this.nextDialogue();
      }
      return;
    }

    if (!this.dialogueVisible) {
      this.lady.update();

      if (this.target) {
        const distance = Phaser.Math.Distance.Between(
          this.lady.x,
          this.lady.y,
          this.target.x,
          this.target.y
        );

        if (distance < 8) {
          this.lady.body.setVelocity(0, 0);
          this.target = null;
        } else {
          const angle = Phaser.Math.Angle.Between(
            this.lady.x,
            this.lady.y,
            this.target.x,
            this.target.y
          );
          this.physics.velocityFromRotation(
            angle,
            this.speed,
            this.lady.body.velocity
          );
        }
      }
    } else {
      this.lady.body.setVelocity(0, 0);
    }
  }

  // 🗨️ Dialogue Handling
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
    this.choiceButtons.forEach((btn) => btn.destroy());
    this.choiceButtons = [];

    // If there are choices, show them
    if (line.choices) {
      this.createChoices(line.choices);
    }
  }

  nextDialogue() {
    const line = this.currentDialogue[this.dialogueIndex];
    if (line && line.choices) return; // Wait for player choice

    this.dialogueIndex++;
    if (this.dialogueIndex < this.currentDialogue.length) {
      this.showCurrentLine();
    } else {
      this.endDialogue();
    }
  }

  createChoices(choices) {
    const baseY = this.scale.height - 50;
    choices.forEach((choice, i) => {
      const btn = this.add.text(
        220 + i * 180,
        baseY,
        choice.text,
        {
          fontSize: "16px",
          color: "#00ffcc",
          backgroundColor: "#222",
          padding: { x: 8, y: 4 },
        }
      )
        .setScrollFactor(0)
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

    // Update SDG Points via eventBus
    if (choice.sdgImpacts) {
      if (window.eventBus) {
        window.eventBus.emit('sdg-update', choice.sdgImpacts);
      }
    }

    // Move to next dialogue branch or end
    if (choice.next === "close") {
      this.endDialogue();
    } else if (choice.next === "end") {
      this.startDialogue("end");
      // Automatically close after final message
      this.time.delayedCall(2500, () => this.endDialogue());
    } else {
      this.startDialogue(choice.next);
    }
  }




  endDialogue() {
    this.dialogueVisible = false;
    this.dialogueBox.setVisible(false);
    this.dialogueText.setVisible(false);
    this.choiceButtons.forEach((btn) => btn.destroy());
    this.choiceButtons = [];
  }
}
