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
            topY: 740, //okk
            bottomY: 1077, //okk
            leftTopX: 820, //ok, needs to avoid door
            rightTopX: 1130, //ok, needs to avoid locker
            leftBottomX: 490, //ok, needs to avoid npc pinky
            rightBottomX: 1600
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
        this.load.atlas(
            "ladyy",
            "/assets/images/characters/ladyy.png",
            "/assets/images/characters/spritesheet.json"
        );

        // NEW JSON (your final chapter script)
        this.load.json("chapter1Data", "/data/dialogues/chapters/chapter1_script.json");

        this.load.pack("assets-pack", "/assets/assets-pack.json");
    }

    create() {

        // Create graphics in create()
        this.debugGraphics = this.add.graphics()
            .setDepth(9998)
            .setScrollFactor(1);  // follows world;

        this._drawHallwayPolygon();

        // this.debugGraphics.lineStyle(2, 0xff0000, 1); // red border, thickness 2

        // const { topY, bottomY, leftTopX, rightTopX, leftBottomX, rightBottomX } = this.hallway;

        // this.debugGraphics.fillStyle(0x00ff00, 0.2); // green, semi-transparent
        // this.debugGraphics.fillPoints([
        //     new Phaser.Geom.Point(leftTopX, topY),
        //     new Phaser.Geom.Point(rightTopX, topY),
        //     new Phaser.Geom.Point(rightBottomX, bottomY),
        //     new Phaser.Geom.Point(leftBottomX, bottomY)
        // ], true);

        // // // // this.debugGraphics.fillCircle(this.player.x, this.player.y, 5);
        // this.debugGraphics.setDepth(10); // adjust as needed




        // ==============================
        // UI LAYER — FIXED TO SCREEN
        // ==============================
        this.uiLayer = this.add.container(0, 0)
            .setScrollFactor(0)
            .setDepth(9999);

        // ==============================
        // CAMERA + BG + PLAYER
        // ==============================
        this.cameras.main.setBackgroundColor("#000000");
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.bg = this.add.image(0, 0, "bgHallway")
            .setOrigin(0)
            .setScrollFactor(1)
            .setDepth(-10)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
        this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

        this.ladyPlayer = this.physics.add.sprite(1400, 900, "ladyy", "frame1.png")
            .setBounce(0.2)
            .setCollideWorldBounds(true)
            .setDepth(1000)
            .setOrigin(0.5, 1);   // 👈 pivot now at the feet

        // After creating ladyPlayer
        this.playerDebug = this.add.graphics()
            .setDepth(9999)
            .setScrollFactor(1); // world space


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
            frames: this.anims.generateFrameNames("ladyy", {
                start: 1,
                end: 6,
                prefix: "frame",
                suffix: ".png"
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "idle",
            frames: [{ key: "ladyy", frame: "frame1.png" }],
            frameRate: 20
        });

        // ==============================
        // NPC (FRIEND IN HALLWAY)
        // ==============================
        this.npc = this.add.image(1650, 742, "npc1")
            .setScale(1)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        this.npc2 = this.add.image(570, 650, "npc2")
            .setScale(1.0)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);


        // IMPORTANT: tie this NPC to the hallway dialogue
        // We’ll start from "h_intro_narration" (your JSON's startNodeId)
        this.npc.dialogueId = "h_intro_narration";
        this.npc2.dialogueId = "h_friend_greeting";


        this.npcIndicator = new NPCIndicator(this, this.npc);
        this.npcIndicator2 = new NPCIndicator(this, this.npc2);

        // ==============================
        // DIALOGUE / TOOLTIP / PANEL
        // ==============================
        const chapterData = this.cache.json.get("chapter1Data");
        console.log("[Chapter1Scene] chapterData:", chapterData);

        // Pull out the "hallway" scene from your JSON
        const hallwayScene = chapterData?.scenes?.find(s => s.id === "hallway");

        if (!hallwayScene) {
            console.error("[Chapter1Scene] hallway scene not found in chapter1Data.json", chapterData);
        }

        // We pass ONLY the hallway scene to DialogueManager
        // so this scene is focused on that part of the story.
        this.dialogueManager = new DialogueManager(
            this,
            hallwayScene || {},      // fail-safe so it doesn't explode if undefined
            this.sdgPointsObj,
            this.uiLayer
        );

        this.tooltipManager = new TooltipManager(this, this.uiLayer);
        this.interactionPanel = new InteractionPanel(this, this.uiLayer);

        // NPC click → show tooltip (then your TooltipManager can call startDialogue)
        this.npc.on("pointerdown", () => {
            this.tooltipManager.show(
                this.npc.x,
                this.npc.y - this.npc.displayHeight / 2,
                this.npc
            );
        });
        this.npc2.on("pointerdown", () => {
            this.tooltipManager.show(
                this.npc2.x,
                this.npc2.y - this.npc2.displayHeight / 2,
                this.npc2
            );
        });

        // ==============================
        // TRASH OBJECTIVE (UNCHANGED)
        // ==============================
        this.trash1 = this.add.image(900, 900, "trash1")
            .setInteractive()
            .setScale(0.3);

        this.trash2 = this.add.image(900, 800, "trash2")
            .setInteractive()
            .setScale(0.2);

        this.trash1.on("pointerdown", () => this.handleTrashClick(this.trash1));
        this.trash2.on("pointerdown", () => this.handleTrashClick(this.trash2));

        emit("updateObjective", {
            collected: this.trashCollected,
            goal: this.trashGoal
        });

        // ==============================
        // INPUT
        // ==============================
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });


        // ==============================
        // NEXT ZONE (EXIT TO CLASSROOM)
        // ==============================
        this.nextZone = this.add
            .zone(1000, 800)
            .setSize(100, 100);

        this.physics.world.enable(this.nextZone);
        this.nextZone.body.setAllowGravity(false);
        this.nextZone.body.setImmovable(true);
        this.nextZone.setVisible(false);

        this.nextZoneVisible = false;
        this.playerInNextZone = false; // 👈 NEW

        const zoneIndicator = this.add.graphics()
            .fillStyle(0x00ff00, 0.3)
            .fillRect(this.nextZone.x - 50, this.nextZone.y - 50, 100, 100)
            .setVisible(false); // hide until unlocked

        // Make the indicator clickable
        zoneIndicator.setInteractive(
            new Phaser.Geom.Rectangle(this.nextZone.x - 50, this.nextZone.y - 50, 100, 100),
            Phaser.Geom.Rectangle.Contains
        ).on("pointerdown", () => {
            // Only go to next scene if:
            // - zone is unlocked
            // - player is physically in the zone
            if (this.nextZoneVisible && this.playerInNextZone) {
                this.goToNextScene();
            }
        });

        this.zoneIndicator = zoneIndicator;

        // Optional pulsing tween (just for visual feedback)
        this.tweens.add({
            targets: zoneIndicator,
            alpha: { from: 0.3, to: 0.7 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // When dialogue ends, unlock + show the clickable zone
        this.events.on("dialogueEnded", () => {
            this.nextZoneVisible = true;
            this.nextZone.setVisible(true);
            this.zoneIndicator.setVisible(true); // 👈 show the clickable highlight
        });
    }


    _drawHallwayPolygon() {
        const g = this.debugGraphics;
        const { topY, bottomY, leftTopX, rightTopX, leftBottomX, rightBottomX } = this.hallway;

        g.clear();

        // Hallway polygon outline (green)
        g.lineStyle(2, 0x00ff00, 1);
        g.strokePoints(
            [
                new Phaser.Geom.Point(leftTopX, topY),
                new Phaser.Geom.Point(rightTopX, topY),
                new Phaser.Geom.Point(rightBottomX, bottomY),
                new Phaser.Geom.Point(leftBottomX, bottomY)
            ],
            true
        );

        // Top and bottom lines (optional, for clarity)
        g.lineStyle(1, 0x00ffff, 0.6);
        g.strokeLineShape(new Phaser.Geom.Line(leftTopX, topY, rightTopX, topY));
        g.strokeLineShape(new Phaser.Geom.Line(leftBottomX, bottomY, rightBottomX, bottomY));
    }


    goToNextScene() {
        this.nextZoneVisible = false;
        this.cameras.main.fadeOut(800);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            SceneManager.nextScene(this, getPoints());
        });
    }



    showNPCInfo(npc) {
        console.log(`${npc.name} is a villager from the forest.`);
    }

    // UPDATED: default start node now matches your hallway JSON
    startDialogue(startNodeId = "h_intro_narration") {
        if (!this.dialogueManager) {
            console.warn("DialogueManager not initialized!");
            return;
        }

        console.log(`Starting dialogue from node: ${startNodeId}`);
        // Assumes your DialogueManager now treats the argument as a nodeId
        this.dialogueManager.startDialogue(startNodeId);
    }

    handleTrashClick(trashItem) {
        if (!trashItem.scene) return;

        const points = 10;
        addSDGPoints(points);

        const msg = this.add.text(trashItem.x, trashItem.y - 40, `+${points} SDG Points!`, {
            font: "16px Arial",
            fill: "#0f0",
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

        this.trashCollected++;
        emit("updateObjective", {
            collected: this.trashCollected,
            goal: this.trashGoal
        });

        if (!this.objectiveCompleted && this.trashCollected >= this.trashGoal) {
            this.objectiveCompleted = true;
            emit("badgeEarned", "Eco Warrior! 🏅");
        }
    }


    update(time, delta) {
        // ============================================================
        // NPC INDICATOR(S)
        // ============================================================
        if (this.npc && this.npcIndicator) {
            const d1 = Phaser.Math.Distance.Between(
                this.ladyPlayer.x, this.ladyPlayer.y,
                this.npc.x, this.npc.y
            );

            if (d1 < 150) this.npcIndicator.show();
            else this.npcIndicator.hide();

            this.npcIndicator.update();
        }

        if (this.npc2 && this.npcIndicator2) {
            const d1 = Phaser.Math.Distance.Between(
                this.ladyPlayer.x, this.ladyPlayer.y,
                this.npc2.x, this.npc2.y
            );

            if (d1 < 150) this.npcIndicator2.show();
            else this.npcIndicator2.hide();

            this.npcIndicator2.update();
        }

        // If you have npc2 / npcIndicator2, you can copy the block above.

        // ============================================================
        // MOVEMENT
        // ============================================================
        const playerSpeed = 150;
        let velocityX = 0;
        let velocityY = 0;

        if (this.keys.left.isDown) velocityX = -playerSpeed;
        else if (this.keys.right.isDown) velocityX = playerSpeed;

        if (this.keys.up.isDown) velocityY = -playerSpeed;
        else if (this.keys.down.isDown) velocityY = playerSpeed;

        this.ladyPlayer.setVelocity(velocityX, velocityY);

        // Animations
        if (velocityX !== 0 || velocityY !== 0) {
            this.ladyPlayer.anims.play("walk", true);
            this.ladyPlayer.setFlipX(velocityX > 0);
        } else {
            this.ladyPlayer.anims.play("idle", true);
        }

        // ============================================================
        // DEPTH, SCALE, HALLWAY CLAMP
        // ============================================================
        const {
            topY,
            bottomY,
            leftTopX,
            rightTopX,
            leftBottomX,
            rightBottomX
        } = this.hallway;

        const depthRange = bottomY - topY;

        // Clamp Y first so it's always inside the path
        this.ladyPlayer.y = Phaser.Math.Clamp(this.ladyPlayer.y, topY, bottomY);

        // 0 at top, 1 at bottom, based on FEET (origin 0.5,1)
        let t = (this.ladyPlayer.y - topY) / depthRange;
        t = Phaser.Math.Clamp(t, 0, 1);

        // === SCALE (this is the part you care about) ===
        const scaleFar = 0.7;  // at topY (740)
        const scaleNear = 1.4;  // at bottomY (1077)
        const scaleFactor = Phaser.Math.Linear(scaleFar, scaleNear, t);
        this.ladyPlayer.setScale(scaleFactor);


        // // === HALLWAY X CLAMP (trapezoid) ===
        const minX = Phaser.Math.Linear(leftTopX, leftBottomX, t);
        const maxX = Phaser.Math.Linear(rightTopX, rightBottomX, t);

        this.ladyPlayer.x = Phaser.Math.Clamp(this.ladyPlayer.x, minX, maxX);

        // ============================================================
        // SHADOW
        // ============================================================
        this.playerShadow.x = this.ladyPlayer.x;
        this.playerShadow.y = this.ladyPlayer.y + 10;  // just under feet
        this.playerShadow.setDepth(this.ladyPlayer.depth - 1);
        this.playerShadow.scaleX = scaleFactor;
        this.playerShadow.scaleY = scaleFactor * 0.4;

        // ============================================================
        // NEXT ZONE OVERLAP
        // ============================================================

        // Track if player is inside the zone, but DON'T auto-transition
        this.playerInNextZone = false;

        if (this.nextZoneVisible) {
            this.physics.world.overlap(
                this.ladyPlayer,
                this.nextZone,
                () => {
                    this.playerInNextZone = true;
                },
                null,
                this
            );
        }

    }

}
