// import Phaser from "phaser";
// import Player from "../objects/Player";
// import DialogueManager from "../objects/DialogueManager";

// export default class Chapter2Scene extends Phaser.Scene {
//     constructor() {
//         super("Chapter2Scene");
//     }

//     init(data) {
//         // 👇 Receive SDG points from previous scene
//         this.sdgPointsObj = { points: data?.sdgPoints || 0 };
//     }

//     preload() {
//         this.load.image("bg2", "/assets/images/environments/bg2.webp");
//         this.load.image("player", "assets/player.png");
//         this.load.json("chapter2Data", "/data/dialogues/chapters/chapter2.json");
//     }

//     create() {
//         // --- Background ---
//         this.bg = this.add.image(0, 0, "bg2").setOrigin(0);
//         this.bg.displayWidth = this.scale.width;
//         this.bg.displayHeight = this.scale.height;
//         this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

//         // --- Player ---
//         this.player = new Player(this, 200, this.scale.height / 2, "player");
//         this.player.setCollideWorldBounds(true);

//         // --- Camera ---
//         this.cameras.main.startFollow(this.player);
//         this.cameras.main.fadeIn(800, 0, 0, 0);
//         this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

//         // --- SDG points display ---
//         // this.sdgText = this.add.text(20, 20, `SDG Points: ${this.sdgPointsObj.points}`, {
//         //     fontSize: "20px",
//         //     color: "#00ff99",
//         //     fontFamily: "Arial",
//         //     fontStyle: "bold",
//         // }).setScrollFactor(0);

//         // --- Dialogue manager ---
//         const dialogueData = this.cache.json.get("chapter2Data");
//         this.dialogueManager = new DialogueManager(this, dialogueData, this.sdgPointsObj);

//         // --- Keyboard and click-to-move reuse ---
//         this.keys = this.input.keyboard.addKeys({
//             up: Phaser.Input.Keyboard.KeyCodes.W,
//             down: Phaser.Input.Keyboard.KeyCodes.S,
//             left: Phaser.Input.Keyboard.KeyCodes.A,
//             right: Phaser.Input.Keyboard.KeyCodes.D,
//         });
//         this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

//         this.target = null;
//         this.speed = 200;
//         this.input.on("pointerdown", pointer => {
//             if (this.dialogueManager?.dialogueVisible) return;
//             this.target = { x: pointer.worldX, y: pointer.worldY };
//         });
//     }

//     update() {
//         // --- Player control ---
//         this.player.update();

//         // Cancel click-to-move if keyboard pressed
//         if (
//             this.keys.left.isDown ||
//             this.keys.right.isDown ||
//             this.keys.up.isDown ||
//             this.keys.down.isDown
//         ) {
//             this.target = null;
//         }

//         // --- Dialogue trigger (E) ---
//         if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
//             if (!this.dialogueManager.dialogueVisible && !this.dialogueManager.dialogueFinished) {
//                 this.dialogueManager.startDialogue("intro");
//             } else if (this.dialogueManager.dialogueVisible) {
//                 this.dialogueManager.nextDialogue();
//             }
//         }

//         // --- Click-to-move motion ---
//         if (!this.dialogueManager.dialogueVisible && this.target) {
//             const dist = Phaser.Math.Distance.Between(
//                 this.player.x,
//                 this.player.y,
//                 this.target.x,
//                 this.target.y
//             );
//             if (dist < 8) {
//                 this.player.body.setVelocity(0, 0);
//                 this.target = null;
//             } else {
//                 const angle = Phaser.Math.Angle.Between(
//                     this.player.x,
//                     this.player.y,
//                     this.target.x,
//                     this.target.y
//                 );
//                 this.physics.velocityFromRotation(angle, this.speed, this.player.body.velocity);
//             }
//         }
//     }
// }


// src/phaser/scenes/Chapter2Scene.js



import Phaser from 'phaser';

export default class Chapter2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Chapter2Scene' });
        
        // Scene variables
        this.player = null;
        this.npcs = [];
        this.backgrounds = {};
        this.cursors = null;
        this.ambientSound = null;
        this.lights = [];
    }

    preload() {
        // Load parallax background layers
        this.load.image('bg_sky', 'assets/images/environments/bg_sky.png');
        this.load.image('bg_buildings', 'assets/images/environments/bg_buildings.png');
        this.load.image('bg_mid', 'assets/images/environments/bg_mid.png');
        
        // Load main layer assets
        this.load.image('player', 'assets/images/environments/player.png');
        this.load.image('npc', 'assets/images/environments/npc.png');
        
        // Load foreground layer
        this.load.image('fg_fog', 'assets/images/environments/fg_fog.png');
        
        // Load ambient sound
        // this.load.audio('ambient', '/assets/ambient.mp3');
    }

    create() {
        // Initialize camera and world bounds
        this.setupWorld();
        
        // Create parallax background layers
        this.createBackgrounds();
        
        // Create player and setup controls
        this.createPlayer();
        
        // Create ambient NPCs
        this.createNPCs();
        
        // Setup lighting system
        this.setupLighting();
        
        // Setup ambient sound
        // this.setupAudio();
        
        // Setup camera with smooth follow
        this.setupCamera();
    }

    update(time, delta) {
        // Handle player movement
        this.handlePlayerMovement();
        
        // Update parallax scrolling based on camera position
        this.updateParallax();
        
        // Update NPC animations and movements
        this.updateNPCs(time);
        
        // Update player idle animation
        this.updatePlayerIdle(time);
    }

    setupWorld() {
        // Set world bounds (adjust based on your level size)
        this.physics.world.setBounds(0, 0, 2000, 600);
        
        // Enable lighting system
        this.lights.enable();
        this.lights.setAmbientColor(0x333333); // Soft ambient light
    }

    createBackgrounds() {
        const { width, height } = this.scale;
        
        // Sky layer (farthest, moves slowest)
        this.backgrounds.sky = this.add.tileSprite(0, 0, width * 2, height * 2, 'bg_sky')
            .setOrigin(0, 0)
            .setScrollFactor(0.1, 0);
        
        // Buildings layer (middle distance)
        this.backgrounds.buildings = this.add.tileSprite(0, 0, width * 2, height, 'bg_buildings')
            .setOrigin(0, 0)
            .setScrollFactor(0.3, 0);
        
        // Midground details (closer background)
        this.backgrounds.mid = this.add.tileSprite(0, 0, width * 2, height, 'bg_mid')
            .setOrigin(0, 0)
            .setScrollFactor(0.6, 0);
        
        // Foreground layer (closest, moves with camera but slightly slower)
        this.backgrounds.foreground = this.add.tileSprite(0, 0, width * 2, height, 'fg_fog')
            .setOrigin(0, 0)
            .setScrollFactor(1.1, 0)
            .setAlpha(0.3); // Semi-transparent for depth effect
    }

    createPlayer() {
        // Create player sprite with physics
        this.player = this.physics.add.sprite(200, 400, 'player')
            .setCollideWorldBounds(true)
            .setScale(0.5);
        
        // Enable lighting on player
        this.player.setPipeline('Light2D');
        
        // Setup keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Additional keys (A/D for movement)
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        // Player animation variables
        this.player.idleTime = 0;
        this.player.isIdle = true;
    }

    createNPCs() {
        // Create multiple NPCs at different positions
        const npcCount = 2;
        const npcPositions = [
            { x: 300, y: 350 },
            { x: 600, y: 380 },
            { x: 900, y: 350 },
            { x: 1200, y: 380 }
        ];
        
        for (let i = 0; i < npcCount; i++) {
            const npc = this.add.sprite(npcPositions[i].x, npcPositions[i].y, 'npc')
                .setScale(0.65)
                .setPipeline('Light2D');
            
            // Store NPC data for movement
            this.npcs.push({
                sprite: npc,
                startX: npcPositions[i].x,
                direction: Phaser.Math.Between(0, 1) === 0 ? -1 : 1,
                speed: Phaser.Math.FloatBetween(0.3, 0.8),
                walkDistance: Phaser.Math.Between(100, 200)
            });
            
            // Start NPC walking animation
            this.startNPCWalk(this.npcs[i]);
        }
    }

   setupLighting() {
  // Initialize our own array to store created light objects
  this.lightObjects = [];

  const lightPositions = [
    { x: 250, y: 300, radius: 120, intensity: 0.6 },
    { x: 650, y: 320, radius: 100, intensity: 0.5 },
    { x: 1050, y: 300, radius: 120, intensity: 0.6 },
    { x: 1450, y: 320, radius: 100, intensity: 0.5 }
  ];

  lightPositions.forEach(pos => {
    const light = this.lights.addLight(pos.x, pos.y, pos.radius, 0xffeedd, pos.intensity);
    this.lightObjects.push(light); // ✅ use lightObjects, not this.lights

    // Flicker effect
    this.tweens.add({
      targets: light,
      intensity: pos.intensity * 0.9,
      duration: Phaser.Math.Between(2000, 4000),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  });
}

    // setupAudio() {
    //     // Create and configure ambient sound
    //     this.ambientSound = this.sound.add('ambient', {
    //         volume: 0.3,
    //         loop: true
    //     });
        
    //     // Start ambient sound (you might want to trigger this on user interaction)
    //     // this.ambientSound.play();
    // }

    setupCamera() {
        // Setup camera to follow player with smooth movement
        this.cameras.main.setBounds(0, 0, 2000, 600);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        
        // Set zoom level if needed
        this.cameras.main.setZoom(1);
    }

    handlePlayerMovement() {
        const speed = 160;
        
        // Reset velocity
        this.player.setVelocityX(0);
        
        // Handle left movement (A or left arrow)
        if (this.cursors.left.isDown || this.keyA.isDown) {
            this.player.setVelocityX(-speed);
            this.player.isIdle = false;
        }
        // Handle right movement (D or right arrow)
        else if (this.cursors.right.isDown || this.keyD.isDown) {
            this.player.setVelocityX(speed);
            this.player.isIdle = false;
        } else {
            this.player.isIdle = true;
        }
        
        // Flip player sprite based on movement direction
        if (this.player.body.velocity.x < 0) {
            this.player.setFlipX(true);
        } else if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        }
    }

    updateParallax() {
        const cameraX = this.cameras.main.scrollX;
        
        // Update tile positions for parallax effect
        this.backgrounds.sky.tilePositionX = cameraX * 0.1;
        this.backgrounds.buildings.tilePositionX = cameraX * 0.3;
        this.backgrounds.mid.tilePositionX = cameraX * 0.6;
        this.backgrounds.foreground.tilePositionX = cameraX * 1.1;
    }

    updateNPCs(time) {
        this.npcs.forEach(npcData => {
            const npc = npcData.sprite;
            
            // Simple NPC movement logic
            const targetX = npcData.startX + (Math.sin(time * 0.001 * npcData.speed) * npcData.walkDistance);
            npc.x = targetX;
            
            // Flip NPC based on movement direction
            const direction = Math.sin(time * 0.001 * npcData.speed + npcData.startX);
            npc.setFlipX(direction < 0);
        });
    }

    updatePlayerIdle(time) {
        if (this.player.isIdle) {
            this.player.idleTime += 0.016; // Approximate delta time
            
            // Subtle breathing animation every 2 seconds
            if (this.player.idleTime >= 2) {
                this.tweens.add({
                    targets: this.player,
                    scaleY: 0.53,
                    duration: 800,
                    yoyo: true,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        this.player.idleTime = 0;
                    }
                });
            }
        } else {
            this.player.idleTime = 0;
        }
    }

    startNPCWalk(npcData) {
        const npc = npcData.sprite;
        
        // Create walking tween for NPC
        this.tweens.add({
            targets: npc,
            x: npcData.startX + (npcData.direction * npcData.walkDistance),
            duration: 2000 / npcData.speed,
            yoyo: true,
            repeat: -1,
            ease: 'Linear',
            onUpdate: () => {
                // Flip sprite based on movement direction
                const velocity = npcData.direction * npcData.speed;
                npc.setFlipX(velocity < 0);
            },
            onRepeat: () => {
                // Change direction for variety
                npcData.direction *= -1;
            }
        });
    }
}