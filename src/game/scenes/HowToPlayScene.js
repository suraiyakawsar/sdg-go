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
        this.add.rectangle(0, 0, width * 2, height * 2, 0x000000, 0.85)
            .setInteractive();

        // Panel dimensions - slightly smaller to fit content better
        const panelW = width * 0.90;
        const panelH = height * 0.85;

        this.panel = this.add.container(width / 2, height / 2);

        // Panel background
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x0b1024, 0.95);
        panelBg.fillRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 24);

        // Border
        panelBg.lineStyle(2, 0xffffff, 0.1);
        panelBg.strokeRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 24);

        this.panel.add(panelBg);

        // Top accent bar
        const accentBar = this.add.graphics();
        const barY = -panelH / 2;
        const barH = 5;
        const segmentW = panelW / 3;

        accentBar.fillStyle(0x34D399, 0.8);
        accentBar.fillRoundedRect(-panelW / 2, barY, segmentW, barH, { tl: 24, tr: 0, bl: 0, br: 0 });

        accentBar.fillStyle(0xA855F7, 0.6);
        accentBar.fillRect(-panelW / 2 + segmentW, barY, segmentW, barH);

        accentBar.fillStyle(0x22D3EE, 0.7);
        accentBar.fillRoundedRect(-panelW / 2 + segmentW * 2, barY, segmentW, barH, { tl: 0, tr: 24, bl: 0, br: 0 });

        this.panel.add(accentBar);

        // === CALCULATE VERTICAL LAYOUT ===
        // We'll position everything relative to panel center

        const topPadding = 40;
        const bottomPadding = 30;

        // Content measurements
        const pillH = 28;
        const titleH = 50;
        const subtitleH = 30;
        const cardH = 90;
        const cardRows = 4;
        const cardGapY = 15;
        const controlsH = 120; // label + keys
        const buttonH = 60;

        // Total content height
        const totalContentH = pillH + 20 + titleH + 10 + subtitleH + 24 +
            (cardH * cardRows + cardGapY * (cardRows - 1)) +
            30 + controlsH + 24 + buttonH;

        // Start Y position (centered)
        let currentY = -totalContentH / 2 + topPadding;

        // Badge pill
        this._createPill(0, currentY, "Game Guide");
        currentY += pillH + 16;

        // Title
        const title = this.add.text(0, currentY, "How to Play", {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "55px",
            fontStyle: "800",
            color: "#FFFFFF",
        }).setOrigin(0.5, 0.5);
        this.panel.add(title);
        currentY += titleH + 8;

        // Subtitle
        const subtitle = this.add.text(0, currentY, "Explore thoughtfully.  Your choices shape your impact on the SDGs.", {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "30px",
            color: "#9CA3AF",
            align: "center",
            wordWrap: { width: panelW * 0.75 },
        }).setOrigin(0.5, 0);
        this.panel.add(subtitle);
        currentY += subtitleH + 24;

        // Sections
        const sections = [
            { icon: "🎯", title: "Movement", body: "Use WASD or arrow keys to move around.", color: 0x34D399 },
            { icon: "💬", title: "Interaction", body: "Move close to objects and press Q, E, or R.", color: 0x60A5FA },
            { icon: "🗨️", title: "Dialogue", body: "Click to continue.  Choices affect SDG points!", color: 0xA78BFA },
            { icon: "🔍", title: "Exploration", body: "Inspect objects and discover hidden details.", color: 0xFBBF24 },
            { icon: "📊", title: "Progress", body: "Track objectives in the sidebar.", color: 0xF472B6 },
            { icon: "🔓", title: "Advancing", body: "Complete tasks to unlock new areas.", color: 0x22D3EE },
        ];

        // Grid layout
        const cols = 2;
        const cardW = (panelW - 80 - 16) / cols;
        const cardGapX = 16;
        const startX = -panelW / 2 + 40 + cardW / 2;
        const cardsStartY = currentY;

        sections.forEach((s, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cardW + cardGapX);
            const y = cardsStartY + row * (cardH + cardGapY) + cardH / 2;
            this._createSectionCard(x, y, cardW, cardH, s);
        });

        currentY += cardRows * cardH + (cardRows - 1) * cardGapY + 28;

        // Controls label
        const controlsLabel = this.add.text(0, currentY, "CONTROLS", {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "34px",
            fontStyle: "600",
            color: "#6B7280",
            letterSpacing: 2,
        }).setOrigin(0.5, 0);
        this.panel.add(controlsLabel);
        currentY += 28;

        // Key hints
        const keys = [
            { key: "W", label: "Up" },
            { key: "A", label: "Left" },
            { key: "S", label: "Down" },
            { key: "D", label: "Right" },
            { key: "Q", label: "Act" },
            { key: "E", label: "Act" },
        ];

        const keySize = 44;
        const keyGap = 12;
        const totalKeysWidth = keys.length * keySize + (keys.length - 1) * keyGap;
        const keyStartX = -totalKeysWidth / 2 + keySize / 2;

        keys.forEach((k, i) => {
            this._createKeyHint(keyStartX + i * (keySize + keyGap), currentY + keySize / 2, k.key, k.label, keySize);
        });

        currentY += keySize + 20 + 24;

        // Action button
        this._createActionButton(0, currentY + buttonH / 2, this.isBoot ? "🎮 Start Playing" : "Got it!", () => {
            if (this.isBoot) {
                this.scene.stop();
                this.scene.start(this.nextSceneKey);
            } else {
                this._closeOverlay();
            }
        }, this.isBoot);

        // Close button (X) - only if not boot
        if (!this.isBoot) {
            this._createCloseButton(panelW / 2 - 40, -panelH / 2 + 40);
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

    _createPill(x, y, text) {
        const pill = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 0.05);
        bg.lineStyle(1, 0xffffff, 0.1);
        bg.fillRoundedRect(-60, -12, 120, 24, 12);
        bg.strokeRoundedRect(-60, -12, 120, 24, 12);

        const dot = this.add.circle(-105, 0, 7, 0x34D399);

        const label = this.add.text(6, 0, text, {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "33px",
            color: "#9CA3AF",
        }).setOrigin(0.5);

        pill.add([bg, dot, label]);
        this.panel.add(pill);
    }

    _createSectionCard(x, y, w, h, section) {
        const card = this.add.container(x, y);

        // Card background
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.4);
        bg.lineStyle(1, 0xffffff, 0.1);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);

        // Bottom glow line
        const glow = this.add.graphics();
        glow.setAlpha(0);

        // Icon background
        const iconSize = 36;
        const iconBg = this.add.graphics();
        iconBg.fillStyle(section.color, 0.15);
        iconBg.fillRoundedRect(-w / 2 + 12, -iconSize / 2, iconSize, iconSize, 10);

        // Icon
        const icon = this.add.text(-w / 2 + 12 + iconSize / 2, 0, section.icon, {
            fontSize: "35px",
        }).setOrigin(0.5);

        // Title
        const title = this.add.text(-w / 2 + 12 + iconSize + 12, -10, section.title, {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "28px",
            fontStyle: "700",
            color: "#FFFFFF",
        }).setOrigin(0, 0.5);

        // Body
        const body = this.add.text(-w / 2 + 12 + iconSize + 12, 12, section.body, {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "24px",
            color: "#9CA3AF",
            wordWrap: { width: w - iconSize - 50 },
        }).setOrigin(0, 0.5);

        card.add([bg, glow, iconBg, icon, title, body]);

        // Hover effect
        const hitArea = this.add.rectangle(0, 0, w, h, 0x000000, 0)
            .setInteractive({ useHandCursor: false });

        hitArea.on("pointerover", () => {
            glow.clear();
            glow.fillStyle(section.color, 0.8);
            glow.fillRoundedRect(-w / 2 + 6, h / 2 - 3, w - 12, 3, 2);
            glow.setAlpha(1);
        });

        hitArea.on("pointerout", () => {
            glow.setAlpha(0);
        });

        card.add(hitArea);
        this.panel.add(card);
    }

    _createKeyHint(x, y, key, label, size = 44) {
        const hint = this.add.container(x, y);

        // Key box
        const keyBg = this.add.graphics();
        keyBg.fillStyle(0x000000, 0.6);
        keyBg.lineStyle(1, 0xffffff, 0.2);
        keyBg.fillRoundedRect(-size / 2, -size / 2, size, size, 10);
        keyBg.strokeRoundedRect(-size / 2, -size / 2, size, size, 10);

        const keyText = this.add.text(0, 0, key, {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "28px",
            fontStyle: "700",
            color: "#FFFFFF",
        }).setOrigin(0.5);

        const labelText = this.add.text(0, size / 2 + 10, label, {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "24px",
            color: "#6B7280",
        }).setOrigin(0.5);

        hint.add([keyBg, keyText, labelText]);
        this.panel.add(hint);
    }

    _createActionButton(x, y, label, onClick, isPrimary = false) {
        const btn = this.add.container(x, y);

        const w = 180;
        const h = 48;

        const bg = this.add.graphics();
        this._drawButton(bg, w, h, isPrimary, false);

        const text = this.add.text(0, 0, label, {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "28px",
            fontStyle: "700",
            color: "#FFFFFF",
        }).setOrigin(0.5);

        const hitArea = this.add.rectangle(0, 0, w, h, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        hitArea.on("pointerover", () => {
            bg.clear();
            this._drawButton(bg, w, h, isPrimary, true);
        });

        hitArea.on("pointerout", () => {
            bg.clear();
            this._drawButton(bg, w, h, isPrimary, false);
        });

        hitArea.on("pointerdown", onClick);

        btn.add([bg, text, hitArea]);
        this.panel.add(btn);
    }

    _drawButton(bg, w, h, isPrimary, isHover) {
        if (isPrimary) {
            bg.fillStyle(0x34D399, isHover ? 0.4 : 0.25);
            bg.lineStyle(2, 0x34D399, isHover ? 0.7 : 0.5);
        } else {
            bg.fillStyle(0xffffff, isHover ? 0.12 : 0.05);
            bg.lineStyle(1, 0xffffff, isHover ? 0.25 : 0.1);
        }
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
    }

    _createCloseButton(x, y) {
        const btn = this.add.container(x, y);

        const bg = this.add.graphics();
        this._drawCloseButton(bg, false);

        const xText = this.add.text(0, 0, "✕", {
            fontFamily: "Inter, system-ui, Arial",
            fontSize: "30px",
            color: "#6B7280",
        }).setOrigin(0.5);

        const hitArea = this.add.rectangle(0, 0, 40, 40, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        hitArea.on("pointerover", () => {
            bg.clear();
            this._drawCloseButton(bg, true);
            xText.setColor("#FFFFFF");
        });

        hitArea.on("pointerout", () => {
            bg.clear();
            this._drawCloseButton(bg, false);
            xText.setColor("#6B7280");
        });

        hitArea.on("pointerdown", () => this._closeOverlay());

        btn.add([bg, xText, hitArea]);
        this.panel.add(btn);
    }

    _drawCloseButton(bg, isHover) {
        bg.fillStyle(0xffffff, isHover ? 0.12 : 0.05);
        bg.lineStyle(1, 0xffffff, isHover ? 0.25 : 0.1);
        bg.fillRoundedRect(-20, -20, 40, 40, 12);
        bg.strokeRoundedRect(-20, -20, 40, 40, 12);
    }
}