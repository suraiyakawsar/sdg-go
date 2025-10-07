// import Phaser from "phaser";

// export default class GameScene extends Phaser.Scene {
//     constructor() {
//         super("GameScene");
//     }

//     preload() {
//         // 🖼️ Load your player sprite (replace with your own image later!)
//         this.load.image("player", "/assets/player.png");
//     }

//     create() {
//         // Example background or environment
//         this.add.text(250, 50, "Welcome to SDG Explorer!", {
//             fontSize: "20px",
//             fill: "#fff",
//             fontFamily: "Samsung Sharp Sans",
//         });

//         // 🎮 Add player sprite at (x=100, y=100)
//         this.player = this.physics.add.sprite(50, 50, "player");
//         this.player.setScale(0.2); // Shrinks to 50% size

//         // 👀 Add some bounce and bounds
//         this.player.setCollideWorldBounds(true);

//         // ⌨️ Create cursor keys
//         this.cursors = this.input.keyboard.addKeys({
//             up: Phaser.Input.Keyboard.KeyCodes.W,
//             down: Phaser.Input.Keyboard.KeyCodes.S,
//             left: Phaser.Input.Keyboard.KeyCodes.A,
//             right: Phaser.Input.Keyboard.KeyCodes.D,
//         });

//         // // Add dialogue text
//         // const question = this.add.text(50, 150, 'You see trash on the ground. What do you do?', {
//         //     fontSize: '16px',
//         //     fill: '#fff',
//         //     wordWrap: { width: 400 },
//         // });

//         // // Option A - Good choice
//         // const optionA = this.add.text(50, 200, '🧹 Pick it up and throw it away properly.', {
//         //     fontSize: '14px',
//         //     fill: '#00ff00',
//         //     backgroundColor: '#002200',
//         //     padding: { x: 10, y: 5 },
//         // }).setInteractive();

//         // // Option B - Bad choice
//         // const optionB = this.add.text(50, 250, '🚶‍♀️ Walk away and pretend you didn’t see it.', {
//         //     fontSize: '14px',
//         //     fill: '#ff0000',
//         //     backgroundColor: '#220000',
//         //     padding: { x: 10, y: 5 },
//         // }).setInteractive();

//         // // Click handlers
//         // optionA.on('pointerdown', () => {
//         //     this.handleDialogueChoice(true);
//         // });

//         // optionB.on('pointerdown', () => {
//         //     this.handleDialogueChoice(false);
//         // });



//         // Interactable sprite (a square representing "trash")
//         const trash = this.add.rectangle(300, 200, 50, 50, 0x555555).setInteractive();
//         this.add.text(275, 260, '🗑️ Trash', { fontSize: '12px', fill: '#fff' });

//         // Click logic
//         trash.on('pointerdown', () => {
//             this.showInteractionDialog(trash);
//         });

//         // Store initial SDG value if not set
//         if (!this.registry.has('currentSDG')) {
//             this.registry.set('currentSDG', 50);
//         }

//     }

//     update() {
//         const speed = 160;
//         const player = this.player;
//         const cursors = this.cursors;

//         player.setVelocity(0);

//         if (cursors.left.isDown) {
//             player.setVelocityX(-speed);
//         } else if (cursors.right.isDown) {
//             player.setVelocityX(speed);
//         }

//         if (cursors.up.isDown) {
//             player.setVelocityY(-speed);
//         } else if (cursors.down.isDown) {
//             player.setVelocityY(speed);
//         }
//     }

//     // handleDialogueChoice(goodChoice) {
//     //     const currentSDG = this.registry.get('currentSDG') || 50;
//     //     let newValue = currentSDG;

//     //     if (goodChoice) {
//     //         newValue = Math.min(currentSDG + 10, 100);
//     //         this.add.text(50, 330, '✅ Great! That was responsible!', { fontSize: '14px', fill: '#0f0' });
//     //     } else {
//     //         newValue = Math.max(currentSDG - 5, 0);
//     //         this.add.text(50, 300, '⚠️ Hmm... You can do better next time.', { fontSize: '14px', fill: '#f00' });
//     //     }

//     //     this.registry.set('currentSDG', newValue);
//     //     this.registry.get('updateSDG')(newValue); // 💥 Update React SDG bar
//     // }
//     showInteractionDialog(object) {
//         // Freeze other interactions
//         object.disableInteractive();

//         const dialogBox = this.add.rectangle(400, 300, 300, 150, 0x000000, 0.8).setStrokeStyle(2, 0xffffff);
//         const text = this.add.text(320, 260, 'Pick up the trash?', {
//             fontSize: '14px',
//             fill: '#fff',
//             wordWrap: { width: 250 }
//         });

//         const yesButton = this.add.text(330, 320, '✅ Yes', {
//             fontSize: '14px',
//             backgroundColor: '#00aa00',
//             color: '#ffffff',
//             padding: { x: 10, y: 5 }
//         }).setInteractive();

//         const noButton = this.add.text(410, 320, '❌ No', {
//             fontSize: '14px',
//             backgroundColor: '#aa0000',
//             color: '#ffffff',
//             padding: { x: 10, y: 5 }
//         }).setInteractive();

//         yesButton.on('pointerdown', () => {
//             // Update SDG bar
//             const current = this.registry.get('currentSDG') || 50;
//             const newVal = Math.min(current + 10, 100);
//             this.registry.set('currentSDG', newVal);
//             this.registry.get('updateSDG')(newVal);

//             // Remove object & dialog
//             object.destroy();
//             dialogBox.destroy();
//             text.destroy();
//             yesButton.destroy();
//             noButton.destroy();


//             this.add.text(320, 350, 'You made the world cleaner 🌍✨', {
//                 fontSize: '14px',
//                 fill: '#00ff00'
//             });
//         });

//         noButton.on('pointerdown', () => {
//             dialogBox.destroy();
//             text.destroy();
//             yesButton.destroy();
//             noButton.destroy();

//         });
//     }

// }
