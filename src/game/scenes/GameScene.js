import Phaser from 'phaser';
import Player from '../objects/Player';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // Example: load player spritesheet
    // this.load.spritesheet('player', '/characters/player.png', {
    //   frameWidth: 32,
    //   frameHeight: 48
    // });
this.load.image('player', 'assets/player.png');

    // Example: load background map
    this.load.image('bg', '/assets/images/environments/bg.png');
  }

  create() {
    // Background
    this.bg = this.add.image(0, 0, 'bg').setOrigin(0).setScale(2);

    // Enable world bounds
    this.physics.world.setBounds(0, 0, this.bg.width * 2, this.bg.height * 2);

    // Create player
    this.player = new Player(this, 400, 300, 'player');
    

    // Camera follow
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1);

    // Optional: collision with world bounds
    this.player.setCollideWorldBounds(true);


    this.anims.create({
  key: 'walk',
  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }), // adjust based on your sprite sheet
  frameRate: 8,
  repeat: -1,
});

this.anims.create({
  key: 'idle',
  frames: [{ key: 'player', frame: 0 }],
  frameRate: 1,
});

  }

  update() {
    this.player.update();
  }
}
