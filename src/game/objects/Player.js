import Phaser from "phaser";
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        // this.setScale(2);

        this.currentAnim = "idle";
    }

    update(keys) {
        const speed = 250;
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
