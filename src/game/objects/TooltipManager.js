export default class TooltipManager {
    constructor(scene, uiLayer) {
        this.scene = scene;
        this.uiLayer = uiLayer;
        this.currentNPC = null;
        this.keyListener = null;

        // Base scale for tooltip UI
        this.baseScale = 1.5; // tweak this to make it bigger/smaller

        // ============================================================
        // Tooltip container (SCREEN SPACE — FIXED TO uiLayer)
        // ============================================================
        this.tooltipContainer = this.scene.add.container(0, 0)
            .setVisible(false)
            .setAlpha(0)
            .setScale(this.baseScale)
            .setScrollFactor(0);

        if (this.uiLayer) {
            this.uiLayer.add(this.tooltipContainer);
        }

        // === Buttons (Q = Talk, E = Inspect) ===
        const talkBtn = this._createKeyHint("Q", "Talk");
        const inspectBtn = this._createKeyHint("E", "Inspect");

        talkBtn.y = -60;
        inspectBtn.y = -90;

        this.tooltipContainer.add([talkBtn, inspectBtn]);

        this.talkBtn = talkBtn;
        this.inspectBtn = inspectBtn;
    }

    // ============================================================
    // CREATE BUTTON
    // ============================================================
    _createKeyHint(keyLabel, actionText) {
        const container = this.scene.add.container(0, 0)
            .setScrollFactor(0);

        const circle = this.scene.add.circle(-60, 0, 12, 0x000000, 0.15)
            .setStrokeStyle(1.2, 0x000000, 0.6)
            .setScrollFactor(0);

        const key = this.scene.add.text(-60, 0, keyLabel, {
            fontFamily: "Poppins, sans-serif",
            fontSize: "13px",
            color: "#000000",
            fontStyle: "bold"
        }).setOrigin(0.5)
            .setScrollFactor(0);

        const text = this.scene.add.text(-30, 0, actionText, {
            fontFamily: "Poppins, sans-serif",
            fontSize: "15px",
            color: "#000000",
            align: "left"
        }).setOrigin(0, 0.5)
            .setScrollFactor(0);

        const hitRect = this.scene.add.rectangle(0, 0, 120, 26, 0x000000, 0)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);

        hitRect.on("pointerover", () => {
            circle.setFillStyle(0x000000, 0.35);
            text.setColor("#ffcc88");
        });

        hitRect.on("pointerout", () => {
            circle.setFillStyle(0x000000, 0.15);
            text.setColor("#000000");
        });

        container.add([hitRect, circle, key, text]);
        container.hitRect = hitRect; // keep a ref for events

        return container;
    }

    // ============================================================
    // SHOW TOOLTIP (uses NPC + Q/E)
    // ============================================================
    show(worldX, worldY, npc) {
        this.currentNPC = npc;

        const cam = this.scene.cameras.main;

        // world → screen (because tooltip is in screen-space)
        const screenX = (worldX - cam.worldView.x) * cam.zoom;
        const screenY = (worldY - cam.worldView.y) * cam.zoom;

        // Position a bit offset from NPC
        this.tooltipContainer.setPosition(screenX + 90, screenY + 60);

        this.tooltipContainer.setVisible(true);
        this.tooltipContainer.setAlpha(0);
        this.tooltipContainer.setScale(this.baseScale * 0.8); // small pop-in

        // --- Keyboard listener cleanup ---
        if (this.keyListener) {
            window.removeEventListener("keydown", this.keyListener);
            this.keyListener = null;
        }

        // --- Keyboard: Q = Talk, E = Inspect ---
        this.keyListener = (event) => {
            if (!this.tooltipContainer.visible) return;

            const key = event.key.toLowerCase();

            if (key === "q") {
                // Talk
                this.hide();
                console.log("[Tooltip] Q pressed, starting dialogue:", this.currentNPC?.dialogueId);
                this.scene.startDialogue(this.currentNPC?.dialogueId || "h_intro_narration");
            } else if (key === "e") {
                // Inspect
                console.log("[Tooltip] E pressed, show info for NPC");
                this.scene.showNPCInfo(this.currentNPC);
                this.hide();
            }
        };

        window.addEventListener("keydown", this.keyListener);

        // --- Mouse handlers ---
        this.talkBtn.hitRect.removeAllListeners();
        this.inspectBtn.hitRect.removeAllListeners();

        this.talkBtn.hitRect.on("pointerdown", () => {
            this.hide();
            console.log("[Tooltip] Talk clicked, starting dialogue:", this.currentNPC?.dialogueId);
            this.scene.startDialogue(this.currentNPC?.dialogueId || "h_intro_narration");
        });

        this.inspectBtn.hitRect.on("pointerdown", () => {
            console.log("[Tooltip] Inspect clicked");
            this.scene.showNPCInfo(this.currentNPC);
            this.hide();
        });

        // --- Pop-in animation ---
        this.scene.tweens.add({
            targets: this.tooltipContainer,
            alpha: 1,
            scale: this.baseScale,
            duration: 200,
            ease: "Back.Out"
        });
    }

    // ============================================================
    // HIDE TOOLTIP
    // ============================================================
    hide() {
        if (!this.tooltipContainer.visible) return;

        if (this.keyListener) {
            window.removeEventListener("keydown", this.keyListener);
            this.keyListener = null;
        }

        this.scene.tweens.add({
            targets: this.tooltipContainer,
            alpha: 0,
            scale: this.baseScale * 0.8,
            duration: 150,
            ease: "Sine.easeIn",
            onComplete: () => {
                this.tooltipContainer.setVisible(false);
            }
        });
    }
}
