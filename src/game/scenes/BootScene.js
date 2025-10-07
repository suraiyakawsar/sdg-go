export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('loading', '/assets/images/ui/loading.png');
        this.load.image('bg', '/assets/images/environments/bg.png');
        // this.load.spritesheet('player', '/assets/images/characters/player.png', {
        //     frameWidth: 32,
        //     frameHeight: 48,
        // });
         this.load.image('player', '/assets/images/characters/player.png', {
        });


    }

    create() {
        this.scene.start('GameScene');
    }
}