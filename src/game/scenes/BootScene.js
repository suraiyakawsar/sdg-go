export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('loading', '/assets/images/ui/loading.png');
        this.load.image('bg', '/assets/images/environments/bg.png');
        // this.load.spritesheet('lady', '/assets/images/characters/lady.png', {
        //     frameWidth: 32,
        //     frameHeight: 48,
        // });
        // this.load.spritesheet('lady', 'assets/images/characters/lady.png', {
        // });


        this.load.spritesheet('lady',
            'assets/images/characters/lady.png',
            { frameWidth: 214, frameHeight: 528 }
        );
    }

    create() {
        this.scene.start('Chapter1Scene');
    }
}