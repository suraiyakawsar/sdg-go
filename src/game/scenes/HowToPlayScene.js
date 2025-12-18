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

    create() {
        const { width, height } = this.scale;

        // Dim background
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setInteractive();

        // Panel (almost full-screen)
        const panelW = width * 0.95;
        const panelH = height * 0.9;

        this.panel = this.add.container(width / 2, height / 2);

        const panelBg = this.add.rectangle(0, 0, panelW, panelH, 0x0b1220, 0.95);

        this.panel.add(panelBg);

        // Title
        this.panel.add(
            this.add.text(0, -panelH / 2 + 70, "🎮 How to Play", {
                fontFamily: "Inter, system-ui, Arial",
                fontSize: "56px",
                fontStyle: "700",
                color: "#F9FAFB",
                shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 6, stroke: true, fill: true }
            }).setOrigin(0.5)
        );

        // Subtitle
        this.panel.add(
            this.add.text(0, -panelH / 2 + 140, "Explore thoughtfully. Your choices shape your impact.", {
                fontFamily: "Inter, system-ui, Arial",
                fontSize: "28px",
                color: "#D1D5DB",
                align: "center",
                wordWrap: { width: panelW * 0.85 },
                shadow: { offsetX: 1, offsetY: 1, color: "#000", blur: 4, stroke: true, fill: true }
            }).setOrigin(0.5)
        );

        // Section titles with emoji
        const sections = [
            { title: "🏃 Movement", body: "Use WASD to move around the environment." },
            { title: "🤝 Interaction", body: "Move close to people or objects and press E, or click the on-screen prompt." },
            { title: "💬 Dialogue", body: "Click to continue conversations. Some responses affect SDG points." },
            { title: "🔍 Exploration", body: "Inspect objects, talk to NPCs, and discover hidden details." },
            { title: "📊 Progress", body: "Objectives and SDG indicators update as you play." },
            { title: "🚪 Advancing", body: "New areas unlock after key actions or conversations." }
        ];

        const twoCol = panelW > 900;
        const colGap = 80;
        const colW = twoCol ? (panelW - 100 - colGap) / 2 : panelW - 100;

        let x = -panelW / 2 + 50;
        let y = -panelH / 2 + 200;

        sections.forEach((s, i) => {
            if (twoCol && i === Math.ceil(sections.length / 2)) {
                x += colW + colGap;
                y = -panelH / 2 + 200;
            }

            this.panel.add(
                this.add.text(x, y, s.title, { fontFamily: "Inter", fontSize: "32px", fontStyle: "700", color: "#E5E7EB" }).setOrigin(0, 0)
            );

            this.panel.add(
                this.add.text(x, y + 50, s.body, { fontFamily: "Inter", fontSize: "26px", color: "#D1D5DB", lineSpacing: 12, wordWrap: { width: colW } }).setOrigin(0, 0)
            );

            y += 160;
        });

        // Control hints
        const hintY = panelH / 2 - 160;
        this._hint(-240, hintY, "WASD", "Move", 32, 28);
        this._hint(0, hintY, "E", "Interact", 32, 28);
        this._hint(240, hintY, "Click", "Select", 32, 28);

        // Buttons
        const btnY = panelH / 2 - 90;
        // Buttons with emojis
        const primaryLabel = this.isBoot ? "▶️ Start" : "❌ Close";
        this._button(0, btnY, primaryLabel, () => {
            if (this.isBoot) {
                this.scene.stop();
                this.scene.start(this.nextSceneKey);
            } else {
                this._closeOverlay();
            }
        });

        // ESC key
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.input.mouse.disableContextMenu();
        this.input.setTopOnly(true);
    }

    update() {
        if (!this.isBoot && Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this._closeOverlay();
        }
    }

    _closeOverlay() {
        emit("ui:clearSidebarActive");
        if (this.returnSceneKey) this.scene.resume(this.returnSceneKey);
        this.scene.stop();
    }

    _hint(x, y, key, label, keySize = 32, labelSize = 28) {
        const group = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 240, 64, 0x020617, 0.9);

        const k = this.add.text(-60, 0, key, { fontFamily: "Inter", fontSize: `${keySize}px`, fontStyle: "700", color: "#F9FAFB" }).setOrigin(0.5);
        const l = this.add.text(60, 0, label, { fontFamily: "Inter", fontSize: `${labelSize}px`, color: "#9CA3AF" }).setOrigin(0.5);

        group.add([bg, k, l]);
        this.panel.add(group);
    }

    _button(x, y, label, onClick) {
        const btn = this.add.rectangle(x, y, 280, 80, 0x111827, 1)
            .setInteractive({ useHandCursor: true });

        const txt = this.add.text(x, y, label, { fontFamily: "Inter", fontSize: "32px", fontStyle: "700", color: "#F9FAFB" }).setOrigin(0.5);

        btn.on("pointerover", () => btn.setAlpha(0.9));
        btn.on("pointerout", () => btn.setAlpha(1));
        btn.on("pointerdown", onClick);

        this.panel.add([btn, txt]);
    }
}
