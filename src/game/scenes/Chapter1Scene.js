import Phaser from "phaser";
import Player from "../objects/Player";
import DialogueManager from "../objects/DialogueManager";
import { SceneManager } from "../../utils/sceneManager";
import { emit } from "../../utils/eventBus";
import { addSDGPoints, getPoints } from "../../utils/sdgPoints";
import TooltipManager from "../objects/TooltipManager";
import NPCIndicator from "../objects/NPCIndicator";
import InteractionPanel from "../objects/InteractionPanel";

export default class Chapter1Scene extends Phaser.Scene {
    constructor() {
        super("Chapter1Scene");

        this.hallway = {
            topY: 285,    // furthest point (ceiling) - ok
            bottomY: 480, // closest point (floor)
            leftTopX: 495,  // left edge at top
            rightTopX: 710, // right edge at top
            leftBottomX: -100, // left edge at bottom
            rightBottomX: 1400 // right edge at bottom - ok
        };

    }

    init(data) {
        this.sdgPointsObj = { points: data?.sdgPoints || getPoints() || 0 };
        // Objective tracking
        this.trashCollected = 0;
        this.trashGoal = 2; // Number of trash items needed
        this.objectiveCompleted = false;
    }

    preload() {
        // --- Dialogue Data ---
        this.load.spritesheet('lady',
            '/assets/images/characters/lady.png',
            { frameWidth: 214, frameHeight: 528 }
        );
        this.load.json("chapter1Data", "/data/dialogues/chapters/chapter1.json");
        this.load.pack("assets-pack", "public/assets/assets-pack.json");
    }

    create() {

        // // Create graphics in create()
        // this.debugGraphics = this.add.graphics();
        // this.debugGraphics.lineStyle(2, 0xff0000, 1); // red border, thickness 2

        const { topY, bottomY, leftTopX, rightTopX, leftBottomX, rightBottomX } = this.hallway;

        // this.debugGraphics.fillStyle(0x00ff00, 0.2); // green, semi-transparent
        // this.debugGraphics.fillPoints([
        //     new Phaser.Geom.Point(leftTopX, topY),
        //     new Phaser.Geom.Point(rightTopX, topY),
        //     new Phaser.Geom.Point(rightBottomX, bottomY),
        //     new Phaser.Geom.Point(leftBottomX, bottomY)
        // ], true);

        // // this.debugGraphics.fillCircle(this.player.x, this.player.y, 5);
        // this.debugGraphics.setDepth(10); // adjust as needed


        // ============================================================
        // UI LAYER — FIXED TO SCREEN (DO NOT MOVE WITH CAMERA)
        // ============================================================
        this.uiLayer = this.add.container(0, 0)
            .setScrollFactor(0)
            .setDepth(9999);     // always on top


        // ============================================================
        // CAMERA + BACKGROUND + PLAYER (WORLD SPACE)
        // ============================================================
        this.cameras.main.setBackgroundColor("#000000");
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.bg = this.add.image(0, 0, "bg")
            .setOrigin(0)
            .setScrollFactor(1)
            .setDepth(-10)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
        this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

        this.ladyPlayer = this.physics.add.sprite(300, 450, "lady")
            .setBounce(0.2)
            .setCollideWorldBounds(true)
            .setDepth(5)
            .setScale(0.5);

        this.playerShadow = this.add.ellipse(
            this.ladyPlayer.x,
            this.ladyPlayer.y + 50,
            40,
            15,
            0x000000,
            0.2
        ).setDepth(4);

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("lady", { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "idle",
            frames: [{ key: "lady", frame: 4 }],
            frameRate: 20,
        });

        // this.cameras.main.startFollow(this.ladyPlayer, true, 0.1, 0.1);


        // ============================================================
        // NPC (WORLD)
        // ============================================================
        this.npc = this.add.image(600, 288, "npc1")
            .setScale(0.2)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        this.npc.dialogueId = "npc1";

        this.npcIndicator = new NPCIndicator(this, this.npc);


        // ============================================================
        // UI SYSTEMS (ALL INSIDE uiLayer FOR FIXED SCREEN POSITION)
        // ============================================================
        const dialogueData = this.cache.json.get("chapter1Data");

        this.dialogueManager = new DialogueManager(
            this,
            dialogueData,
            this.sdgPointsObj,
            this.uiLayer
        );

        this.tooltipManager = new TooltipManager(this, this.uiLayer);

        this.interactionPanel = new InteractionPanel(this, this.uiLayer);


        // NPC click → show tooltip on screen, not world
        this.npc.on("pointerdown", () => {
            this.tooltipManager.show(
                this.npc.x,
                this.npc.y - this.npc.displayHeight / 2,
                this.npc
            );
        });


        // ============================================================
        // TRASH (WORLD)
        // ============================================================
        this.trash1 = this.add.image(400, 500, "trash1")
            .setInteractive()
            .setScale(0.15);

        this.trash2 = this.add.image(600, 475, "trash2")
            .setInteractive()
            .setScale(0.15);

        this.trash1.on("pointerdown", () => this.handleTrashClick(this.trash1));
        this.trash2.on("pointerdown", () => this.handleTrashClick(this.trash2));


        // ============================================================
        // INPUT
        // ============================================================
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });


        // ============================================================
        // NEXT ZONE (WORLD)
        // ============================================================
        this.nextZone = this.add
            .zone(this.scale.width - 150, this.scale.height / 2)
            .setSize(100, 100);

        this.physics.world.enable(this.nextZone);
        this.nextZone.body.setAllowGravity(false);
        this.nextZone.body.setImmovable(true);
        this.nextZone.setVisible(false);

        this.nextZoneVisible = false;


        // Debug highlight
        const zoneIndicator = this.add.graphics()
            .fillStyle(0x00ff00, 0.3)
            .fillRect(this.nextZone.x - 50, this.nextZone.y - 50, 100, 100);

        this.tweens.add({
            targets: zoneIndicator,
            alpha: { from: 0.3, to: 0.7 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            onUpdate: () => zoneIndicator.setVisible(this.nextZone.visible),
        });

        // Dialogue → unlock next zone
        this.events.on("dialogueEnded", () => {
            this.nextZoneVisible = true;
            this.nextZone.setVisible(true);
        });
    }


    onZoneOverlap() {
        if (this.nextZoneVisible) {
            this.nextZoneVisible = false; // Prevent multiple triggers
            this.cameras.main.fadeOut(800);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                SceneManager.nextScene(this, getPoints());
            });
        }
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
        if (!trashItem.scene) return; // Prevent errors if clicked multiple times quickly

        const points = 10;

        addSDGPoints(points);


        // Feedback
        // const msg = this.add.text(trashItem.x, trashItem.y - 40, "+10 SDG Points!", {
        const msg = this.add.text(trashItem.x, trashItem.y - 40, `+${points} SDG Points!`, {
            font: "16px Arial",
            fill: "#0f0",
            // strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: msg,
            y: msg.y - 50,
            alpha: 0,
            duration: 1000,
            ease: "Power2",
            onComplete: () => msg.destroy()
        });

        trashItem.destroy();


        // --- Objective Progress ---
        emit("updateObjective", 1); // increase by 1 for each trash

        this.trashCollected++;
        emit("updateObjective", {
            collected: this.trashCollected,
            goal: this.trashGoal
        });

        if (!this.objectiveCompleted && this.trashCollected >= this.trashGoal) {
            this.objectiveCompleted = true;
            emit("badgeEarned", "Eco Warrior! 🏅"); // Badge trigger
        }
    }

    showBadge(badgeText) {
        const badge = this.add.text(this.scale.width / 2, this.scale.height / 2, badgeText, {
            font: "24px Arial",
            fill: "#FFD700",
            fontStyle: "bold",
            stroke: "#000",
            strokeThickness: 3,
            align: "center"
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0);

        this.tweens.add({
            targets: badge,
            alpha: 1,
            scale: { from: 0.8, to: 1.2 },
            duration: 600,
            ease: "Back.easeOut",
            yoyo: true,
            hold: 1000,
            onComplete: () => {
                this.tweens.add({
                    targets: badge,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => badge.destroy()
                });
            }
        });
        // ✅ Emit event to connect to BadgePage.jsx later
        emit("badgeEarned", badgeText);
    }


    update(time, delta) {

        const distance = Phaser.Math.Distance.Between(
            this.ladyPlayer.x,
            this.ladyPlayer.y,
            this.npc.x,
            this.npc.y
        );

        if (distance < 150) {
            this.npcIndicator.show();
        } else {
            this.npcIndicator.hide();
        }


        // this.tooltipManager.update();
        this.npcIndicator.update();
        const playerSpeed = 150;

        // --- Player Movement ---
        let velocityX = 0;
        let velocityY = 0;

        if (this.keys.left.isDown) velocityX = -playerSpeed;
        else if (this.keys.right.isDown) velocityX = playerSpeed;

        if (this.keys.up.isDown) velocityY = -playerSpeed;
        else if (this.keys.down.isDown) velocityY = playerSpeed;

        this.ladyPlayer.setVelocity(velocityX, velocityY);

        // Play animation based on movement
        if (velocityX !== 0 || velocityY !== 0) {
            this.ladyPlayer.anims.play('walk', true);
            this.ladyPlayer.setFlipX(velocityX > 0); // Flip for right
        } else {
            this.ladyPlayer.anims.play('idle', true);
        }

        // --- Shadow ---
        this.playerShadow.x = this.ladyPlayer.x;
        this.playerShadow.y = this.ladyPlayer.y + 50;
        this.playerShadow.setDepth(this.ladyPlayer.depth - 1);

        // --- Perspective scaling & camera zoom ---
        const t = Phaser.Math.Clamp(
            (this.ladyPlayer.y - this.hallway.bottomY) / (this.hallway.topY - this.hallway.bottomY),
            0, 1
        );

        // Scale player
        const scaleFactor = Phaser.Math.Linear(1.0, 0.15, t); // bottom = 1, top = 0.15
        this.ladyPlayer.setScale(scaleFactor);

        // Camera zoom
        // const targetZoom = Phaser.Math.Linear(1, 1.6, t);
        // this.cameras.main.zoom = Phaser.Math.Linear(this.cameras.main.zoom, targetZoom, 0.05);

        // Clamp position to hallway boundaries
        const minX = Phaser.Math.Linear(this.hallway.leftBottomX, this.hallway.leftTopX, t);
        const maxX = Phaser.Math.Linear(this.hallway.rightBottomX, this.hallway.rightTopX, t);
        this.ladyPlayer.x = Phaser.Math.Clamp(this.ladyPlayer.x, minX, maxX);
        this.ladyPlayer.y = Phaser.Math.Clamp(this.ladyPlayer.y, this.hallway.topY, this.hallway.bottomY);



        // --- Next Zone Overlap ---
        if (this.nextZoneVisible) {
            this.physics.world.overlap(this.ladyPlayer, this.nextZone, this.onZoneOverlap, null, this);
        }
    }

}