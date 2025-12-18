export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.atlas(
            "ladyy",
            "assets/images/characters/ladyy.png",
            "assets/images/characters/spritesheet.json"
        );

    }

    create() {
        //Hallway Scene
        // this.scene.start('Chapter1Scene');

        //Classroom Scene
        // this.scene.start('Chapter1Scene2');

        //Cafeteria Scene
        // this.scene.start('Chapter1Scene3');

        //Food Bank Scene
        // this.scene.start('Chapter2Scene1');

        //Community Center STREET Scene
        // this.scene.start('Chapter2Scene2');

        //Park Scene SEATED FRIENDLY NPC
        // this.scene.start('Chapter2Scene3');

        //Garden Scene
        this.scene.start('Chapter3Scene1');

        //Classroom Scene 2
        // this.scene.start('Chapter3Scene2');

        //Nighttime Courtyard Scene
        // this.scene.start('Chapter3Scene3');


        // this.scene.start('Chapter4Scene1');

        // this.scene.start('Chapter4Scene2');

        // this.scene.start('Chapter4Scene3');

        // this.scene.start('Chapter5Scene1');

        // this.scene.start('Chapter5Scene2');

        // this.scene.start('Chapter5Scene3');
    }
}