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


        // this.load.spritesheet('lady',
        //     'assets/images/characters/spritesheet.json',
        //     { frameWidth: 200, frameHeight: 460 }
        // );
        this.load.atlas(
            "ladyy",
            "/assets/images/characters/ladyy.png",
            "/assets/images/characters/spritesheet.json"
        );

    }

    create() {
        this.scene.start('Chapter1Scene');
    }
}