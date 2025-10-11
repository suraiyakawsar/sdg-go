import Phaser from "phaser";
import Player from "../objects/Player";
import DialogueManager from "../objects/DialogueManager";
import { SceneManager } from "../../utils/sceneManager";

export default class Chapter1Scene extends Phaser.Scene {
    constructor() {
        super("Chapter1Scene");
    }

    init(data) {
        // Receive SDG points from previous chapter (if any)
        this.sdgPointsObj = { points: data?.sdgPoints || 0 };
    }

    preload() {
        this.load.image("bg", "/assets/images/environments/bg.png");
        this.load.image("player", "assets/player.png");
        this.load.json("chapter1Data", "/data/dialogues/chapters/chapter1.json");
    }

    create() {
        // Background
        this.bg = this.add.image(0, 0, "bg").setOrigin(0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;
        this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

        // Player
        this.player = new Player(this, this.scale.width / 2, this.scale.height / 2, "player");
        this.player.setCollideWorldBounds(true);

        // Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

        // Click-to-move
        this.target = null;
        this.speed = 200;
        this.input.on("pointerdown", pointer => {
            if (this.dialogueManager?.dialogueVisible) return;
            this.target = { x: pointer.worldX, y: pointer.worldY };
        });

        // SDG Points Display
        // this.sdgText = this.add.text(20, 20, `SDG Points: ${this.sdgPointsObj.points}`, {
        //     fontSize: "20px",
        //     color: "#00ff99",
        //     fontFamily: "Arial",
        //     fontStyle: "bold",
        // }).setScrollFactor(0);

        // Initialize DialogueManager
        const dialogueData = this.cache.json.get("chapter1Data");
        this.dialogueManager = new DialogueManager(this, dialogueData, this.sdgPointsObj);

        // NextZone (hidden until dialogue triggers it)
        this.nextZone = this.add.circle(this.scale.width - 150, this.scale.height / 2, 50, 0x00ff00, 0.3)
            .setVisible(false);
        this.physics.add.existing(this.nextZone);
        this.nextZone.body.setCircle(50);
        this.nextZone.body.setAllowGravity(false);
        this.nextZone.body.setImmovable(true);
        this.nextZoneVisible = false;

        this.tweens.add({
            targets: this.nextZone,
            scale: { from: 1, to: 1.2 },
            alpha: { from: 0.5, to: 0.8 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Key to trigger dialogue
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // in create()
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        // in create()
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        // Always update player for WASD
        this.player.update();


        // If any WASD key is pressed, cancel click-to-move target so keyboard takes control
        if (this.keys.left.isDown || this.keys.right.isDown || this.keys.up.isDown || this.keys.down.isDown) {
            this.target = null;
        }
        // Dialogue trigger
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            if (!this.dialogueManager.dialogueVisible && !this.dialogueManager.dialogueFinished) {
                this.dialogueManager.startDialogue("intro");
            } else if (this.dialogueManager.dialogueVisible) {
                this.dialogueManager.nextDialogue();
            }
        }

        // Click-to-move behavior (only active when not in dialogue)
        if (!this.dialogueManager.dialogueVisible) {
            if (this.target) {
                const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y);
                if (dist < 8) {
                    this.player.body.setVelocity(0, 0);
                    this.target = null;
                } else {
                    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.target.x, this.target.y);
                    this.physics.velocityFromRotation(angle, this.speed, this.player.body.velocity);
                }
            }
        } else {
            // If dialogue visible, optionally freeze movement
            // But we already called player.update(), so make sure Player.update respects some flag if you want full freeze.
            // For safety, zero velocity so physics stops
            this.player.body.setVelocity(0, 0);
        }

        // // Freeze click-to-move during dialogue
        // if (this.dialogueManager.dialogueVisible) this.player.body.setVelocity(0, 0);

        // NextZone overlap
        if (this.nextZoneVisible) {
            this.physics.world.overlap(this.player, this.nextZone, () => {
                this.nextZoneVisible = false;
                this.cameras.main.fadeOut(800);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    SceneManager.nextScene(this, this.sdgPointsObj.points);
                });
            });
        }
    }

}
