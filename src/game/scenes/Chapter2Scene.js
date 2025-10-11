// import DialogueManager from "../objects/DialogueManager";

// export default class Chapter2Scene extends Phaser.Scene {
//     constructor() { super("Chapter2Scene"); }

//         // Receive SDG points from previous chapter (if any)
//     init(data) { this.sdgPointsObj = { points: data?.sdgPoints || 0 }; }

//     preload() {
//         this.load.image("bg2", "/assets/images/environments/bg2.webp");
//         this.load.image("player", "assets/player.png");
//         this.load.json("chapter2Data", "/data/dialogues/chapters/chapter2.json");
//     }

//     create() {
//         this.bg = this.add.image(0, 0, "bg2").setOrigin(0);
//         this.bg.displayWidth = this.scale.width;
//         this.bg.displayHeight = this.scale.height;
//         this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

//         this.player = new Player(this, this.scale.width / 2, this.scale.height / 2, "player");
//         this.player.setCollideWorldBounds(true);

//         this.cameras.main.startFollow(this.player);
//         this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

//         this.target = null;
//         this.speed = 200;
//         this.input.on("pointerdown", pointer => {
//             if (this.dialogueManager?.dialogueVisible) return;
//             this.target = { x: pointer.worldX, y: pointer.worldY };
//         });

//         this.sdgText = this.add.text(20, 20, `SDG Points: ${this.sdgPointsObj.points}`, {
//             fontSize: "20px",
//             color: "#00ff99",
//             fontFamily: "Arial",
//             fontStyle: "bold",
//         }).setScrollFactor(0);

//         const dialogueData = this.cache.json.get("chapter2Data");
//         this.dialogueManager = new DialogueManager(this, dialogueData, this.sdgPointsObj);

//         // Next zone
//         this.nextZone = this.add.circle(this.scale.width - 150, this.scale.height / 2, 50, 0x00ff00, 0.3)
//             .setVisible(false);
//         this.physics.add.existing(this.nextZone);
//         this.nextZone.body.setCircle(50);
//         this.nextZone.body.setAllowGravity(false);
//         this.nextZone.body.setImmovable(true);
//         this.nextZoneVisible = false;

//         this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
//     }

//     update() {
//         // Dialogue trigger
//         if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
//             if (!this.dialogueManager.dialogueVisible && !this.dialogueManager.dialogueFinished) {
//                 this.dialogueManager.startDialogue("intro");
//             } else if (this.dialogueManager.dialogueVisible) {
//                 this.dialogueManager.nextDialogue();
//             }
//         }

//         // Player movement
//         if (!this.dialogueManager.dialogueVisible) {
//             this.player.update();
//             if (this.target) {
//                 const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y);
//                 if (dist < 8) this.player.body.setVelocity(0, 0);
//                 else {
//                     const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.target.x, this.target.y);
//                     this.physics.velocityFromRotation(angle, this.speed, this.player.body.velocity);
//                 }
//             }

//             // NextZone overlap
//             if (this.nextZoneVisible) {
//                 this.physics.world.overlap(this.player, this.nextZone, () => {
//                     this.nextZoneVisible = false;
//                     this.cameras.main.fadeOut(800);
//                     this.cameras.main.once('camerafadeoutcomplete', () => {
//                         SceneManager.nextScene(this, this.sdgPointsObj.points);
//                     });
//                 });
//             }
//         } else {
//             this.player.body.setVelocity(0, 0);
//         }
//     }
// }



import Phaser from "phaser";
import Player from "../objects/Player";
import DialogueManager from "../objects/DialogueManager";

export default class Chapter2Scene extends Phaser.Scene {
    constructor() {
        super("Chapter2Scene");
    }

    init(data) {
        // 👇 Receive SDG points from previous scene
        this.sdgPointsObj = { points: data?.sdgPoints || 0 };
    }

    preload() {
        this.load.image("bg2", "/assets/images/environments/bg2.webp");
        this.load.image("player", "assets/player.png");
        this.load.json("chapter2Data", "/data/dialogues/chapters/chapter2.json");
    }

    create() {
        // --- Background ---
        this.bg = this.add.image(0, 0, "bg2").setOrigin(0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;
        this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

        // --- Player ---
        this.player = new Player(this, 200, this.scale.height / 2, "player");
        this.player.setCollideWorldBounds(true);

        // --- Camera ---
        this.cameras.main.startFollow(this.player);
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);

        // --- SDG points display ---
        // this.sdgText = this.add.text(20, 20, `SDG Points: ${this.sdgPointsObj.points}`, {
        //     fontSize: "20px",
        //     color: "#00ff99",
        //     fontFamily: "Arial",
        //     fontStyle: "bold",
        // }).setScrollFactor(0);

        // --- Dialogue manager ---
        const dialogueData = this.cache.json.get("chapter2Data");
        this.dialogueManager = new DialogueManager(this, dialogueData, this.sdgPointsObj);

        // --- Keyboard and click-to-move reuse ---
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.target = null;
        this.speed = 200;
        this.input.on("pointerdown", pointer => {
            if (this.dialogueManager?.dialogueVisible) return;
            this.target = { x: pointer.worldX, y: pointer.worldY };
        });
    }

    update() {
        // --- Player control ---
        this.player.update();

        // Cancel click-to-move if keyboard pressed
        if (
            this.keys.left.isDown ||
            this.keys.right.isDown ||
            this.keys.up.isDown ||
            this.keys.down.isDown
        ) {
            this.target = null;
        }

        // --- Dialogue trigger (E) ---
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            if (!this.dialogueManager.dialogueVisible && !this.dialogueManager.dialogueFinished) {
                this.dialogueManager.startDialogue("intro");
            } else if (this.dialogueManager.dialogueVisible) {
                this.dialogueManager.nextDialogue();
            }
        }

        // --- Click-to-move motion ---
        if (!this.dialogueManager.dialogueVisible && this.target) {
            const dist = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.target.x,
                this.target.y
            );
            if (dist < 8) {
                this.player.body.setVelocity(0, 0);
                this.target = null;
            } else {
                const angle = Phaser.Math.Angle.Between(
                    this.player.x,
                    this.player.y,
                    this.target.x,
                    this.target.y
                );
                this.physics.velocityFromRotation(angle, this.speed, this.player.body.velocity);
            }
        }
    }
}
