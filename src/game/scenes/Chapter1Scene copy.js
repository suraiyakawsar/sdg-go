import Phaser from "phaser";
// import Player from "../objects/Player";
import DialogueManager from "../objects/DialogueManager";
import { SceneManager } from "../../utils/sceneManager";
import { chapter1Scenes, emit } from "../../utils/eventBus";
import { addSDGPoints, getPoints } from "../../utils/sdgPoints";
import TooltipManager from "../objects/TooltipManager";

export default class Chapter1Scene extends Phaser.Scene {
    constructor() {
        super("Chapter1Scene");

        // Set these once in create() or constructor
        // this.hallway = {
        //     topY: 320,    // furthest point (ceiling) - ok
        //     bottomY: 539, // closest point (floor) - ok
        //     leftTopX: 490,  // left edge at top - ok
        //     rightTopX: 710, // right edge at top - ok
        //     leftBottomX: 95, // left edge at bottom - ok
        //     rightBottomX: 1129 // right edge at bottom
        // };

        this.hallway = {
            topY: 300,    // furthest point (ceiling) - ok
            bottomY: 539, // closest point (floor)
            leftTopX: 490,  // left edge at top
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
        // --- Environment & Characters ---
        this.load.image("bg", "assets/images/environments/bg.png");
        // this.load.image("player", "assets/images/characters/mymc.png");

        // this.load.spritesheet("player", "assets/images/characters/mymc.png", {
        //     frameWidth:  223,
        //     frameHeight: 539
        // });

        // this.load.spritesheet("player", "assets/images/characters/mymc.png", {
        //     frameWidth: 220,
        //     frameHeight: 537
        // });

        this.load.spritesheet('lady',
            'assets/images/characters/lady.png',
            { frameWidth: 214, frameHeight: 528 }
        );


        this.load.image("npc1", "assets/images/characters/npc1.png");
        this.load.image("trash1", "assets/images/props/trash1.png");
        this.load.image("trash2", "assets/images/props/trash2.png");

        // --- UI & Audio ---
        this.load.image("ui_arrow_down", "assets/images/ui/arrow_down.png");
        this.load.image("speechBubble", "assets/images/ui/speechBubble.png");
        this.load.image("icon_eye", "assets/images/ui/icon_eye.png");
        this.load.image("icon_speech", "assets/images/ui/icon_speech.png");
        this.load.image("ui_tooltip_bg", "assets/images/ui/ui_tooltip_bg.png");
        // this.load.audio("introMusic", "assets/audio/intro-music.mp3");

        // --- Dialogue Data ---
        this.load.json("chapter1Data", "/data/dialogues/chapters/chapter1.json");
    }

    create() {
        // Create graphics in create()
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.lineStyle(2, 0xff0000, 1); // red border, thickness 2

        const { topY, bottomY, leftTopX, rightTopX, leftBottomX, rightBottomX } = this.hallway;

        this.debugGraphics.fillStyle(0x00ff00, 0.2); // green, semi-transparent
        this.debugGraphics.fillPoints([
            new Phaser.Geom.Point(leftTopX, topY),
            new Phaser.Geom.Point(rightTopX, topY),
            new Phaser.Geom.Point(rightBottomX, bottomY),
            new Phaser.Geom.Point(leftBottomX, bottomY)
        ], true);

        // this.debugGraphics.fillCircle(this.player.x, this.player.y, 5);
        this.debugGraphics.setDepth(10); // adjust as needed


        // --- Background Setup ---
        this.currentScene = chapter1Scenes[0];
        this.bg = this.add.image(0, 0, "bg")
            .setOrigin(0)
            .setTexture(this.currentScene?.background || "bg");
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;

        // Physics Bounds
        this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

        // --- Player Setup ---
        // this.player = new Player(this, 300, 400, "player")
        //     .setCollideWorldBounds(true)
        //     .setScale(0.2)
        //     .setOrigin(0.5, 0.5);

        // --- Player ---
        // this.player = new Player(this, 400, 300, "player").setScale(0.2);

        // this.player = this.physics.add.sprite(400, 300, 'player');
        // this.player.setCollideWorldBounds(true);
        // this.player.setScale(0.2);
        // this.player.setOrigin(0.5, 0.5);

        // .setCollideWorldBounds(true)
        // .setScale(0.2)
        // .setOrigin(0.5, 0.5);


        // --- Player Setup using 'lady' sprite ---
        this.ladyPlayer = this.physics.add.sprite(300, 450, 'lady') // Initial position
            .setBounce(0.2)
            .setCollideWorldBounds(true)
            .setDepth(5); // Ensure player is above some elements, but depth will change with perspective

        // --- Player shadow ---
        this.playerShadow = this.add.ellipse(this.ladyPlayer.x, this.ladyPlayer.y + 50, 40, 15, 0x000000, 0.2);
        this.playerShadow.setDepth(this.ladyPlayer.depth - 1); // shadow behind player



        // --- Animations for 'lady' ---
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('lady', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'lady', frame: 4 }],
            frameRate: 20
        });


        // this.player.anims.play("walk_down");

        // this.player.anims.play("walk_down", true);

        // this.player = new Player(this, 300, 400, "player")
        //     .setCollideWorldBounds(true)
        //     .setScale(0.2)
        //     .setOrigin(0.5, 0.5);

        // --- Camera Setup ---
        // this.cameras.main.startFollow(this.player)
        //     .setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight)
        //     .setBackgroundColor("#000000")
        //     .fadeIn(1000, 0, 0, 0);
        // this.cameras.main.startFollow(this.player, true, 0.05, 0.05); // Line 81 in your Chapter1Scene.js
        // this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight)

        // --- Camera Setup ---
        // this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        // this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
        // this.cameras.main.setBackgroundColor("#000000").fadeIn(1000, 0, 0, 0);

        this.cameras.main.startFollow(this.ladyPlayer, true, 0.1, 0.1)
        this.cameras.main.setZoom(1.5); // Adjust zoom as needed
        this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);


        // --- Keyboard Controls ---
        // this.keys = this.input.keyboard.createCursorKeys(); // Using built-in cursor keys

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });


        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // --- Keyboard Controls ---
        // this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);



        // --- Music ---
        // this.music = this.sound.add("introMusic", { loop: true, volume: 0.3 });
        // this.music.play();

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


        // ✅ Initialize TooltipManager
        this.tooltipManager = new TooltipManager(this, (npc) => {
            if (this.dialogueManager) {
                this.dialogueManager.startDialogue(npc.dialogueId);
            } else {
                console.warn("DialogueManager not found!");
            }
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


        // --- Trash Items ---
        this.trash1 = this.add.image(400, 500, "trash1").setInteractive().setScale(0.15);
        this.trash2 = this.add.image(600, 475, "trash2").setInteractive().setScale(0.15);
        this.trash1.on("pointerdown", () => this.handleTrashClick(this.trash1));
        this.trash2.on("pointerdown", () => this.handleTrashClick(this.trash2));

        // Create a group for trash to handle depth later if needed
        this.trashGroup = this.physics.add.group();
        this.trashGroup.add(this.trash1);
        this.trashGroup.add(this.trash2);

        [this.trash1, this.trash2].forEach(trash => {
            trash.on('pointerover', () => {
                // small bounce/scale effect
                this.tweens.add({
                    targets: trash,
                    scale: trash.scale + 0.05,
                    duration: 200,
                    yoyo: true
                });
            });
        });


        // --- Dialogue + Tooltip ---
        const dialogueData = this.cache.json.get("chapter1Data");
        this.dialogueManager = new DialogueManager(this, dialogueData, this.sdgPointsObj);
        this.dialogueManager.events.on("dialogueEnded", () => {
            this.nextZone.setVisible(true);

        });




        // --- Scene Transition Zone ---
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

        // --- Feedback Text? ---
        this.feedbackText = this.add.text(20, 48, "", { font: "18px Arial", fill: "#00ff99" }).setScrollFactor(0);

        // Start initial dialogue if any
        // this.dialogueManager.startDialogue("intro");
    }

    showNPCInfo(npc) {
        // e.g., show a mini info box
        console.log(`${npc.name} is a villager from the forest.`);
    }

    startSceneDialogue(sceneIndex = 0) {
        const sceneData = chapter1Scenes[sceneIndex];
        if (sceneData && this.dialogueManager) {
            this.dialogueManager.startDialogue(sceneData.dialogueId);
        }
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
        // --- Objective Progress ---
        emit("updateObjective", 1); // increase by 1 for each trash

        // Feedback
        const msg = this.add.text(trashItem.x, trashItem.y - 40, "+10 SDG Points!", {
            font: "16px Arial",
            fill: "#0f0",
            stroke: "#000",
            strokeThickness: 2
        }).setDepth(100);
        this.tweens.add({
            targets: msg,
            y: msg.y - 40,
            alpha: 0,
            duration: 800,
            ease: "Power2",
            onComplete: () => msg.destroy()
        });

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


    update() {
        // this.player.update();
        this.ladyPlayer.update(this.keys);


        this.playerShadow.x = this.ladyPlayer.x;
        this.playerShadow.y = this.ladyPlayer.y + 50;
        this.playerShadow.setDepth(this.ladyPlayer.depth - 1);


        const playerSpeed = 150;

        // let velocityX = 0;
        // let velocityY = 0;

        // if (this.keys.left.isDown) velocityX = -200;
        // else if (this.keys.right.isDown) velocityX = 200;
        // if (this.keys.up.isDown) velocityY = -200;
        // else if (this.keys.down.isDown) velocityY = 200;

        // this.player.body.setVelocity(velocityX, velocityY);

        // Horizontal Movement (Left/Right)
        if (this.keys.left.isDown) {
            this.ladyPlayer.setVelocityX(-playerSpeed);
            this.ladyPlayer.anims.play('walk', true); // Play left animation
            this.ladyPlayer.setFlipX(false); // Flip sprite to face left
        } else if (this.keys.right.isDown) {
            this.ladyPlayer.setVelocityX(playerSpeed);
            this.ladyPlayer.anims.play('walk', true); // Play right animation
            this.ladyPlayer.setFlipX(true); // Do not flip sprite (it will face right)

        } else {
            this.ladyPlayer.setVelocityX(0); // Stop horizontal movement
        }

        // Vertical Movement (Up/Down)
        if (this.keys.up.isDown) {
            this.ladyPlayer.setVelocityY(-playerSpeed);
        } else if (this.keys.down.isDown) {
            this.ladyPlayer.setVelocityY(playerSpeed);
        } else {
            this.ladyPlayer.setVelocityY(0); // Stop vertical movement
        }

        // If no keys are pressed for movement, play the idle animation
        // if (this.ladyPlayer.body.velocity.x === 0 && this.ladyPlayer.body.velocity.y === 0) {
        //     this.ladyPlayer.anims.play('walk', false); // Use 'walk' as idle for simplicity
        // }


        // if (this.keys.left.isDown) {
        //     this.player.x -= speed * this.game.loop.delta / 1000;
        // } else if (this.keys.right.isDown) {
        //     this.player.x += speed * this.game.loop.delta / 1000;
        // }

        // --- Perspective setup ---
        // const minY = 200;    // top of the hallway (furthest point)
        // const maxY = 500;    // bottom (closest point)
        // const minScale = 0.15; // how small the character looks at the back
        // const maxScale = 1.9; // normal size when near camera

        // Define limits
        // const minX = 160;
        // const maxX = 1000;
        // const minY = 350;
        // const maxY = 520;

        // Clamp position
        // this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);
        // this.player.y = Phaser.Math.Clamp(this.player.y, minY, maxY);

        const minY = 200;  // top of hallway
        const maxY = 500;  // bottom of hallway
        const minZoom = 1.5; // camera stays zoomed in
        const maxZoom = 1.6; // slight zoom-out possible for perspective feel

        // proportion along the hallway
        const tZoom = Phaser.Math.Clamp((this.ladyPlayer.y - minY) / (maxY - minY), 0, 1);
        const targetZoom = Phaser.Math.Linear(minZoom, maxZoom, tZoom);
        // this.cameras.main.setZoom(targetZoom);
        // Smooth zoom
        this.cameras.main.zoom = Phaser.Math.Linear(this.cameras.main.zoom, targetZoom, 0.05);

        // Proportion of player along the hallway
        const t = Phaser.Math.Clamp((this.ladyPlayer.y - this.hallway.bottomY) / (this.hallway.topY - this.hallway.bottomY), 0, 1);

        // Interpolate left/right boundaries based on Y
        const minX = Phaser.Math.Linear(this.hallway.leftBottomX, this.hallway.leftTopX, t);
        const maxX = Phaser.Math.Linear(this.hallway.rightBottomX, this.hallway.rightTopX, t);

        // Clamp player's position
        this.ladyPlayer.x = Phaser.Math.Clamp(this.ladyPlayer.x, minX, maxX);

        // Clamp Y normally
        this.ladyPlayer.y = Phaser.Math.Clamp(this.ladyPlayer.y, this.hallway.topY, this.hallway.bottomY);


        // Clamp Y position to hallway bounds
        // this.ladyPlayer.y = Phaser.Math.Clamp(this.ladyPlayer.y, minY, maxY);


        // Calculate the proportion of how far "up" the player is
        // const t = Phaser.Math.Clamp((this.player.y - maxY) / (minY - maxY), 0, 1);

        // Smoothly scale the player between min and max
        // const scaleFactor = Phaser.Math.Linear(maxScale, minScale, t);
        const scaleFactor = Phaser.Math.Linear(1.0, 0.15, t); // 1.0 = bottom, 0.15 = top
        this.ladyPlayer.setScale(scaleFactor);
        // Apply same scale to both axes


        // Optional: keep physics body aligned if using physics
        // if (this.player.body) {
        //     this.player.body.setSize(this.player.width, this.player.height, true);
        // }
        // --- Optional: transition when reaching the back of hallway ---
        // if (this.player.y <= minY + 5) {
        //     this.scene.start("RoomScene"); // replace "RoomScene" with your actual scene key
        // }



        // --- Handle Dialogue Progression ---
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            if (!this.dialogueManager.dialogueVisible && !this.dialogueManager.dialogueFinished) {
                this.dialogueManager.startDialogue("intro");
            } else if (this.dialogueManager.dialogueVisible) {
                this.dialogueManager.nextDialogue();
            }
        }

        // In update()
        if (this.nextZoneVisible) {
            this.physics.world.overlap(this.ladyPlayer, this.nextZone, () => {
                this.nextZoneVisible = false;
                this.cameras.main.fadeOut(800);
                this.cameras.main.once("camerafadeoutcomplete", () => {
                    SceneManager.nextScene(this, getPoints());
                });
            });
        }
    }
}



