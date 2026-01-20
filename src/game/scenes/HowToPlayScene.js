import Phaser from "phaser";
import { emit } from "../../utils/eventBus";

export default class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super("HowToPlayScene");
    }

    init(data) {
        this.returnSceneKey = data?.returnSceneKey || null;
        this.nextSceneKey = data?.nextSceneKey || "Chapter1Scene";
        this.isBoot = !!data?.isBoot;
    }

    preload() {
        // ✅ Load your "How to Play" image
        // Replace the path with wherever you store your image
        this.load.image("howtoplay", "assets/images/ui/howtoplay.png");
    }

    create() {
        const { width, height } = this.scale;

        // Blurred dark background
        this.add.rectangle(0, 0, width * 2, height * 2, 0x000000, 0.88)
            .setInteractive();

        // ✅ Display the "How to Play" image
        const howToPlayImage = this.add.image(width / 2, height / 2, "howtoplay");

        // Scale the image to fit nicely on screen (adjust as needed)
        const maxWidth = width * 0.85;
        const maxHeight = height * 0.85;
        const scale = Math.min(maxWidth / howToPlayImage.width, maxHeight / howToPlayImage.height);
        howToPlayImage.setScale(scale);

        // Optional: Add a subtle border/shadow effect
        const borderPadding = 20;
        const borderBg = this.add.graphics();
        borderBg.fillStyle(0x0b1024, 0.95);
        borderBg.lineStyle(2, 0xffffff, 0.15);
        borderBg.fillRoundedRect(
            howToPlayImage.x - howToPlayImage.displayWidth / 2 - borderPadding,
            howToPlayImage.y - howToPlayImage.displayHeight / 2 - borderPadding,
            howToPlayImage.displayWidth + borderPadding * 2,
            howToPlayImage.displayHeight + borderPadding * 2,
            16
        );
        borderBg.strokeRoundedRect(
            howToPlayImage.x - howToPlayImage.displayWidth / 2 - borderPadding,
            howToPlayImage.y - howToPlayImage.displayHeight / 2 - borderPadding,
            howToPlayImage.displayWidth + borderPadding * 2,
            howToPlayImage.displayHeight + borderPadding * 2,
            16
        );

        // Move image to front
        this.children.bringToTop(howToPlayImage);

        // ✅ Close button (X) in top-right corner
        const closeX = howToPlayImage.x + howToPlayImage.displayWidth / 2 - 30;
        const closeY = howToPlayImage.y - howToPlayImage.displayHeight / 2 + 30;
        this._createCloseButton(closeX, closeY);

        // ✅ Optional: "Start Playing" button at bottom (only if boot)
        if (this.isBoot) {
            const btnY = howToPlayImage.y + howToPlayImage.displayHeight / 2 + 50;
            this._createActionButton(width / 2, btnY, "🎮 Start Playing", () => {
                this.scene.stop();
                this.scene.start(this.nextSceneKey);
            });
        }

        // ESC key listener
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        if (this.input.mouse) {
            this.input.mouse.disableContextMenu();
        }
        this.input.setTopOnly(true);
    }

    update() {
        if (!this.isBoot && Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this._closeOverlay();
        }
    }

    _closeOverlay() {
        emit("ui: clearSidebarActive");
        if (this.returnSceneKey) this.scene.resume(this.returnSceneKey);
        this.scene.stop();
    }

    _createCloseButton(x, y) {
        const btn = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.8);
        bg.lineStyle(2, 0xffffff, 0.3);
        bg.fillCircle(0, 0, 22);
        bg.strokeCircle(0, 0, 22);

        const xText = this.add.text(0, 0, "✕", {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "28px",
            color: "#FFFFFF",
        }).setOrigin(0.5);

        const hitArea = this.add.circle(0, 0, 22, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        hitArea.on("pointerover", () => {
            bg.clear();
            bg.fillStyle(0xffffff, 0.2);
            bg.lineStyle(2, 0xffffff, 0.6);
            bg.fillCircle(0, 0, 22);
            bg.strokeCircle(0, 0, 22);
            xText.setColor("#FFFFFF");
        });

        hitArea.on("pointerout", () => {
            bg.clear();
            bg.fillStyle(0x000000, 0.8);
            bg.lineStyle(2, 0xffffff, 0.3);
            bg.fillCircle(0, 0, 22);
            bg.strokeCircle(0, 0, 22);
            xText.setColor("#FFFFFF");
        });

        hitArea.on("pointerdown", () => this._closeOverlay());

        btn.add([bg, xText, hitArea]);
    }

    _createActionButton(x, y, label, onClick) {
        const btn = this.add.container(x, y);
        const w = 220;
        const h = 50;

        const bg = this.add.graphics();
        bg.fillStyle(0x34D399, 0.3);
        bg.lineStyle(2, 0x34D399, 0.7);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);

        const text = this.add.text(0, 0, label, {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "20px",
            fontStyle: "700",
            color: "#FFFFFF",
        }).setOrigin(0.5);

        const hitArea = this.add.rectangle(0, 0, w, h, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        hitArea.on("pointerover", () => {
            bg.clear();
            bg.fillStyle(0x34D399, 0.5);
            bg.lineStyle(2, 0x34D399, 0.9);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
        });

        hitArea.on("pointerout", () => {
            bg.clear();
            bg.fillStyle(0x34D399, 0.3);
            bg.lineStyle(2, 0x34D399, 0.7);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
        });

        hitArea.on("pointerdown", onClick);

        btn.add([bg, text, hitArea]);
    }
}