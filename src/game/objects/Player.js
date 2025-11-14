// import Phaser from 'phaser';

// export default class Player extends Phaser.Physics.Arcade.Sprite {
//   constructor(scene, x, y, texture = 'player') {
//     super(scene, x, y, texture);

//     // Add player to scene
//     scene.add.existing(this);
//     scene.physics.add.existing(this);

//     // Physics properties
//     this.setCollideWorldBounds(true);

//     // Adjust scale to make sprite smaller (since your image is 221x592)
//     // this.setScale(0.2);

//     // Movement speed
//     this.speed = 200;

//     // Input keys (WASD)
//     this.keys = scene.input.keyboard.addKeys({
//       up: Phaser.Input.Keyboard.KeyCodes.W,
//       down: Phaser.Input.Keyboard.KeyCodes.S,
//       left: Phaser.Input.Keyboard.KeyCodes.A,
//       right: Phaser.Input.Keyboard.KeyCodes.D
//     });
//   }

//   update() {
//     const { up, down, left, right } = this.keys;

//     // Reset velocity each frame
//     this.body.setVelocity(0);

//     // Movement logic
//     if (up.isDown) this.body.setVelocityY(-this.speed);
//     else if (down.isDown) this.body.setVelocityY(this.speed);

//     if (left.isDown) {
//       this.body.setVelocityX(-this.speed);
//       this.setFlipX(true); // flip sprite left
//     } else if (right.isDown) {
//       this.body.setVelocityX(this.speed);
//       this.setFlipX(false); // normal facing right
//     }

//     // Normalize diagonal movement
//     this.body.velocity.normalize().scale(this.speed);
//   }
// }



import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setScale(0.8);

        this.currentAnim = "idle";
    }

    update(keys) {
        const speed = 150;
        let moving = false;

        this.body.setVelocity(0);

        if (keys.left.isDown) {
            this.body.setVelocityX(-speed);
            this.anims.play("walk_left", true);
            moving = true;
        } else if (keys.right.isDown) {
            this.body.setVelocityX(speed);
            this.anims.play("walk_right", true);
            moving = true;
        }

        if (keys.up.isDown) {
            this.body.setVelocityY(-speed);
            this.anims.play("walk_up", true);
            moving = true;
        } else if (keys.down.isDown) {
            this.body.setVelocityY(speed);
            this.anims.play("walk_down", true);
            moving = true;
        }

        if (!moving) {
            this.anims.play("idle", true);
        }

        this.body.velocity.normalize().scale(speed);
    }
}
