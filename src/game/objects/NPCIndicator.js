export default class NPCIndicator {
    constructor(scene, npc) {
        this.scene = scene;
        this.npc = npc;

        this.icon = scene.add.image(npc.x, npc.y - 80, "talkIcon")
            .setScale(0)
            .setAlpha(0)
            .setDepth(5);

        scene.tweens.add({
            targets: this.icon,
            y: npc.y - 90,
            duration: 900,
            yoyo: true,
            repeat: -1
        });
    }

    update() {
        this.icon.x = this.npc.x;
        this.icon.y = this.npc.y - 80;
    }

    show() { this.icon.setAlpha(1); }
    hide() { this.icon.setAlpha(0); }
}
