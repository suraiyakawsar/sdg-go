import Phaser from "phaser";
import Player from "../objects/Player";
import DialogueManager from "../objects/DialogueManager";
import { SceneManager } from "../../utils/sceneManager";
import { emit } from "../../utils/eventBus";
import { addSDGPoints, getPoints } from "../../utils/sdgPoints";
import TooltipManager from "../objects/TooltipManager";

export default class Chapter1Scene extends Phaser.Scene {
    constructor() {
        super("Chapter1Scene");
    }

    init(data) {
        this.sdgPointsObj = { points: data?.sdgPoints || getPoints() || 0 };
    }

    preload() {
        // --- Environment & Characters ---
        this.load.image("bg", "assets/images/environments/bg.png");
        this.load.image("player", "assets/images/environments/player.png");
        this.load.image("npc1", "assets/images/characters/npc1.png");
        this.load.image("trash1", "assets/images/props/trash1.png");
        this.load.image("trash2", "assets/images/props/trash2.png");

        // --- UI & Audio ---
        this.load.image("ui_arrow_down", "assets/images/ui/arrow_down.png");
        this.load.image("speechBubble", "assets/images/ui/speechBubble.png");
        this.load.image("icon_eye", "assets/images/ui/icon_eye.png");
        this.load.image("icon_speech", "assets/images/ui/icon_speech.png");
        this.load.image("ui_tooltip_bg", "assets/images/ui/ui_tooltip_bg.png");
        this.load.audio("introMusic", "assets/audio/intro-music.mp3");

        // --- Dialogue Data ---
        this.load.json("chapter1Data", "/data/dialogues/chapters/chapter1.json");
    }

    create() {
        // --- Core Setup ---
        this.cameras.main.setBackgroundColor("#000000");
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.bg = this.add.image(0, 0, "bg").setOrigin(0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;

        // Physics Bounds
        this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

        // --- Player Setup ---
        this.player = new Player(this, 300, 400, "player")
            .setCollideWorldBounds(true)
            .setScale(0.5);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);


        // --- Music ---
        this.music = this.sound.add("introMusic", { loop: true, volume: 0.3 });
        this.music.play();

        // --- Intro Text ---
        this.introText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            "It’s a new day in GreenVille.\nSmall actions can make a big difference…",
            {
                fontSize: "22px",
                color: "#ffffff",
                align: "center",
                fontStyle: "italic",
            }
        ).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: this.introText,
            alpha: 1,
            duration: 2000,
            yoyo: true,
            hold: 2000,
        });

        // --- NPC Setup ---
        this.npc = this.add.image(700, 400, "npc1")
            .setInteractive({ useHandCursor: true })
            .setScale(0.5)
            .setDepth(10);
        this.npc.dialogueId = "npc1"; // attach this property

        // ✅ Clicking NPC shows tooltip icons
        // ✅ Correct: use this.npc (since you declared it earlier)
        this.npc.setInteractive({ useHandCursor: true }).on("pointerdown", (pointer) => {
            console.log("NPC clicked!");
            this.tooltipManager.show(this.npc.x, this.npc.y, this.npc);
        });



        // // Start dialogue when tooltip triggers
        // this.events.on("startDialogue", () => {
        //     console.log("Starting dialogue now...");
        //     this.startDialogue();
        // });



        // --- Trash Items ---
        this.trash1 = this.add.image(400, 500, "trash1").setInteractive().setScale(0.15);
        this.trash2 = this.add.image(600, 475, "trash2").setInteractive().setScale(0.15);
        this.trash1.on("pointerdown", () => this.handleTrashClick(this.trash1));
        this.trash2.on("pointerdown", () => this.handleTrashClick(this.trash2));

        // --- Keyboard Controls ---
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // --- Next Zone Transition ---
        // this.nextZone = this.add.circle(this.scale.width - 150, this.scale.height / 2, 50, 0x00ff00, 0.3)
        //     .setVisible(false);
        // this.physics.add.existing(this.nextZone);
        // this.nextZone.body.setAllowGravity(false).setImmovable(true);
        // this.nextZoneVisible = false;

        // this.tweens.add({
        //     targets: this.nextZone,
        //     scale: { from: 1, to: 1.2 },
        //     alpha: { from: 0.5, to: 0.8 },
        //     duration: 800,
        //     yoyo: true,
        //     repeat: -1,
        // });


        // --- Dialogue + Tooltip ---
        const dialogueData = this.cache.json.get("chapter1Data");
        this.dialogueManager = new DialogueManager(this, dialogueData, this.sdgPointsObj);


        // ✅ Initialize TooltipManager
        this.tooltipManager = new TooltipManager(this, (npc) => {
            if (this.dialogueManager) {
                this.dialogueManager.startDialogue(npc.dialogueId);
            } else {
                console.warn("DialogueManager not found!");
            }
        });


        // --- Next Zone setup (hidden initially) ---
        // inside create()
        // this.nextZone = this.add.circle(this.scale.width - 150, this.scale.height / 2, 50, 0x00ff00, 0.3)
        //     .setVisible(false);

        // this.physics.add.existing(this.nextZone); // adds body
        // this.nextZone.body.setAllowGravity(false).setImmovable(true).setCircle(50); // ensures body matches visual

        // ✅ Step 2: Listen for dialogue end to show next zone
        // this.events.on('dialogueEnded', (dialogueKey) => {
        //     // Show the next zone only after certain dialogues
        //     if (dialogueKey === "npc1" || dialogueKey === "intro") {
        //         this.nextZone.setVisible(true);
        //         this.nextZoneVisible = true;
        //     }
        // });
        // Only show nextZone after dialogue ends

        // Next Zone setup
        this.nextZone = this.add.circle(this.scale.width - 150, this.scale.height / 2, 50, 0x00ff00, 0.3)
            .setVisible(false);
        this.physics.add.existing(this.nextZone);
        this.nextZone.body.setAllowGravity(false).setImmovable(true);
        this.nextZone.body.setCircle(50);

        // Only show nextZone after dialogue ends
        this.nextZoneVisible = false;
        this.events.on("dialogueEnded", (dialogueKey) => {
            console.log("Dialogue ended for:", dialogueKey); // <-- debug
            this.nextZone.setVisible(true);
            this.nextZoneVisible = true;
        });



        this.feedbackText = this.add.text(20, 48, "", { font: "18px Arial", fill: "#00ff99" }).setScrollFactor(0);
    }

    showNPCInfo(npc) {
        // e.g., show a mini info box
        console.log(`${npc.name} is a villager from the forest.`);
    }

    startDialogue(dialogueId = "npc1") {
        if (!this.dialogueManager) {
            console.warn("DialogueManager not initialized!");
            return;
        }

        // Call the existing DialogueManager instance
        console.log(`Starting dialogue: ${dialogueId}`);
        this.dialogueManager.startDialogue(dialogueId);
    }

    handleTrashClick(trashItem) {
        trashItem.destroy();
        addSDGPoints(10);
        const msg = this.add.text(trashItem.x, trashItem.y - 40, "+10 SDG Points!", {
            font: "16px Arial",
            fill: "#0f0",
            stroke: "#000",
            strokeThickness: 2
        });
        this.tweens.add({
            targets: msg,
            y: msg.y - 40,
            alpha: 0,
            duration: 800,
            ease: "Power2",
            onComplete: () => msg.destroy()
        });
    }

    update() {
        this.player.update();

        let velocityX = 0;
        let velocityY = 0;

        if (this.keys.left.isDown) velocityX = -200;
        else if (this.keys.right.isDown) velocityX = 200;
        if (this.keys.up.isDown) velocityY = -200;
        else if (this.keys.down.isDown) velocityY = 200;

        this.player.body.setVelocity(velocityX, velocityY);

        // --- Handle Dialogue Progression ---
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            if (!this.dialogueManager.dialogueVisible && !this.dialogueManager.dialogueFinished) {
                this.dialogueManager.startDialogue("intro");
            } else if (this.dialogueManager.dialogueVisible) {
                this.dialogueManager.nextDialogue();
            }
        }

        // --- Scene Transition ---
        // if (this.nextZoneVisible) {
        //     this.physics.world.overlap(this.player, this.nextZone, () => {
        //         this.nextZoneVisible = false;
        //         this.cameras.main.fadeOut(800);
        //         this.cameras.main.once("camerafadeoutcomplete", () => {
        //             SceneManager.nextScene(this, getPoints());
        //         });
        //     });
        // }

        // In update()
        if (this.nextZoneVisible) {
            this.physics.world.overlap(this.player, this.nextZone, () => {
                this.nextZoneVisible = false;
                this.cameras.main.fadeOut(800);
                this.cameras.main.once("camerafadeoutcomplete", () => {
                    SceneManager.nextScene(this, getPoints());
                });
            });
        }


    }
}



