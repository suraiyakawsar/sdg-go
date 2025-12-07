// export default class TooltipManager {
//     constructor(scene, uiLayer) {
//         this.scene = scene;
//         this.uiLayer = uiLayer;
//         this.currentNPC = null;
//         this.keyListener = null;

//         // Base scale for tooltip UI
//         this.baseScale = 1.5; // tweak this to make it bigger/smaller

//         // ============================================================
//         // Tooltip container (SCREEN SPACE — FIXED TO uiLayer)
//         // ============================================================
//         this.tooltipContainer = this.scene.add.container(0, 0)
//             .setVisible(false)
//             .setAlpha(0)
//             .setScale(this.baseScale)
//             .setScrollFactor(0);

//         if (this.uiLayer) {
//             this.uiLayer.add(this.tooltipContainer);
//         }

//         // === Buttons (Q = Talk, E = Inspect) ===
//         const talkBtn = this._createKeyHint("Q", "Talk");
//         const inspectBtn = this._createKeyHint("E", "Inspect");

//         talkBtn.y = -60;
//         inspectBtn.y = -90;

//         this.tooltipContainer.add([talkBtn, inspectBtn]);

//         this.talkBtn = talkBtn;
//         this.inspectBtn = inspectBtn;
//     }

//     // ============================================================
//     // CREATE BUTTON
//     // ============================================================
//     _createKeyHint(keyLabel, actionText) {
//         const container = this.scene.add.container(0, 0)
//             .setScrollFactor(0);

//         const circle = this.scene.add.circle(-60, 0, 12, 0x000000, 0.15)
//             .setStrokeStyle(1.2, 0x000000, 0.6)
//             .setScrollFactor(0);

//         const key = this.scene.add.text(-60, 0, keyLabel, {
//             fontFamily: "Poppins, sans-serif",
//             fontSize: "13px",
//             color: "#000000",
//             fontStyle: "bold"
//         }).setOrigin(0.5)
//             .setScrollFactor(0);

//         const text = this.scene.add.text(-30, 0, actionText, {
//             fontFamily: "Poppins, sans-serif",
//             fontSize: "15px",
//             color: "#000000",
//             align: "left"
//         }).setOrigin(0, 0.5)
//             .setScrollFactor(0);

//         const hitRect = this.scene.add.rectangle(0, 0, 120, 26, 0x000000, 0)
//             .setInteractive({ useHandCursor: true })
//             .setScrollFactor(0);

//         hitRect.on("pointerover", () => {
//             circle.setFillStyle(0x000000, 0.35);
//             text.setColor("#ffcc88");
//         });

//         hitRect.on("pointerout", () => {
//             circle.setFillStyle(0x000000, 0.15);
//             text.setColor("#000000");
//         });

//         container.add([hitRect, circle, key, text]);
//         container.hitRect = hitRect; // keep a ref for events

//         return container;
//     }

//     // ============================================================
//     // SHOW TOOLTIP (uses NPC + Q/E)
//     // ============================================================
//     show(worldX, worldY, npc) {
//         this.currentNPC = npc;

//         const cam = this.scene.cameras.main;

//         // world → screen (because tooltip is in screen-space)
//         const screenX = (worldX - cam.worldView.x) * cam.zoom;
//         const screenY = (worldY - cam.worldView.y) * cam.zoom;

//         // Position a bit offset from NPC
//         this.tooltipContainer.setPosition(screenX + 90, screenY + 60);

//         this.tooltipContainer.setVisible(true);
//         this.tooltipContainer.setAlpha(0);
//         this.tooltipContainer.setScale(this.baseScale * 0.8); // small pop-in

//         // --- Keyboard listener cleanup ---
//         if (this.keyListener) {
//             window.removeEventListener("keydown", this.keyListener);
//             this.keyListener = null;
//         }

//         // --- Keyboard: Q = Talk, E = Inspect ---
//         this.keyListener = (event) => {
//             if (!this.tooltipContainer.visible) return;

//             const key = event.key.toLowerCase();

//             if (key === "q") {
//                 // Talk
//                 this.hide();
//                 console.log("[Tooltip] Q pressed, starting dialogue:", this.currentNPC?.dialogueId);
//                 this.scene.startDialogue(this.currentNPC?.dialogueId || "h_intro_narration");
//             } else if (key === "e") {
//                 // Inspect
//                 console.log("[Tooltip] E pressed, show info for NPC");
//                 this.scene.showNPCInfo(this.currentNPC);
//                 this.hide();
//             }
//         };

//         window.addEventListener("keydown", this.keyListener);

//         // --- Mouse handlers ---
//         this.talkBtn.hitRect.removeAllListeners();
//         this.inspectBtn.hitRect.removeAllListeners();

//         this.talkBtn.hitRect.on("pointerdown", () => {
//             this.hide();
//             console.log("[Tooltip] Talk clicked, starting dialogue:", this.currentNPC?.dialogueId);
//             this.scene.startDialogue(this.currentNPC?.dialogueId || "h_intro_narration");
//         });

//         this.inspectBtn.hitRect.on("pointerdown", () => {
//             console.log("[Tooltip] Inspect clicked");
//             this.scene.showNPCInfo(this.currentNPC);
//             this.hide();
//         });

//         // --- Pop-in animation ---
//         this.scene.tweens.add({
//             targets: this.tooltipContainer,
//             alpha: 1,
//             scale: this.baseScale,
//             duration: 200,
//             ease: "Back.Out"
//         });
//     }

//     // ============================================================
//     // HIDE TOOLTIP
//     // ============================================================
//     hide() {
//         if (!this.tooltipContainer.visible) return;

//         if (this.keyListener) {
//             window.removeEventListener("keydown", this.keyListener);
//             this.keyListener = null;
//         }

//         this.scene.tweens.add({
//             targets: this.tooltipContainer,
//             alpha: 0,
//             scale: this.baseScale * 0.8,
//             duration: 150,
//             ease: "Sine.easeIn",
//             onComplete: () => {
//                 this.tooltipContainer.setVisible(false);
//             }
//         });
//     }
// }

// src/scenes/objects/TooltipManager.js
export default class TooltipManager {
    constructor(scene, uiLayer) {
        console.log(
            "%c[TooltipManager] elevated tooltip active",
            "color:#38bdf8;font-weight:bold;"
        );

        this.scene = scene;
        this.uiLayer = uiLayer;
        this.currentNPC = null;
        this.keyListener = null;

        // Base scale for tooltip UI
        this.baseScale = 1.5;

        // ============================================================
        // Tooltip container (SCREEN SPACE — FIXED TO uiLayer)
        // ============================================================
        this.tooltipContainer = this.scene.add
            .container(0, 0)
            .setVisible(false)
            .setAlpha(0)
            .setScale(this.baseScale)
            .setScrollFactor(0)
            .setDepth(10_000);

        if (this.uiLayer) {
            this.uiLayer.add(this.tooltipContainer);
        }

        // === Buttons (Q = Talk, E = Inspect) ===
        const talkBtn = this._createKeyHint("Q", "Talk");
        const inspectBtn = this._createKeyHint("E", "Inspect");

        // stack them like your old one, but a bit tighter
        talkBtn.y = -18;
        inspectBtn.y = 18;

        this.tooltipContainer.add([talkBtn, inspectBtn]);

        this.talkBtn = talkBtn;
        this.inspectBtn = inspectBtn;
    }

    // ============================================================
    // CREATE BUTTON (elevated look)
    // ============================================================
    // _createKeyHint(keyLabel, actionText) {
    //     const container = this.scene.add
    //         .container(0, 0)
    //         .setScrollFactor(0);

    //     const ROW_WIDTH = 180;
    //     const ROW_HEIGHT = 28;

    //     // Hit area for hover + click
    //     const hitRect = this.scene.add
    //         .rectangle(0, 0, ROW_WIDTH, ROW_HEIGHT, 0x000000, 0)
    //         .setInteractive({ useHandCursor: true })
    //         .setScrollFactor(0);

    //     // Pills / background using Graphics
    //     const bg = this.scene.add.graphics().setScrollFactor(0);
    //     bg.fillStyle(0x020617, 0.92); // deep navy
    //     bg.fillRoundedRect(
    //         -ROW_WIDTH / 2,
    //         -ROW_HEIGHT / 2,
    //         ROW_WIDTH,
    //         ROW_HEIGHT,
    //         999
    //     );
    //     bg.lineStyle(1, 0x38bdf8, 0.8); // cyan border
    //     bg.strokeRoundedRect(
    //         -ROW_WIDTH / 2 + 0.5,
    //         -ROW_HEIGHT / 2 + 0.5,
    //         ROW_WIDTH - 1,
    //         ROW_HEIGHT - 1,
    //         999
    //     );

    //     // Key circle (fake Fi icon vibe)
    //     const circle = this.scene.add
    //         .circle(-ROW_WIDTH / 2 + 18, 0, 11, 0x22c55e, 1)
    //         .setScrollFactor(0);

    //     const key = this.scene.add
    //         .text(circle.x, circle.y, keyLabel, {
    //             fontFamily: "Poppins, sans-serif",
    //             fontSize: "12px",
    //             color: "#020617",
    //             fontStyle: "bold"
    //         })
    //         .setOrigin(0.5)
    //         .setScrollFactor(0);

    //     const text = this.scene.add
    //         .text(circle.x + 16, 0, actionText, {
    //             fontFamily: "Poppins, sans-serif",
    //             fontSize: "13px",
    //             color: "#e5e7eb",
    //             align: "left"
    //         })
    //         .setOrigin(0, 0.5)
    //         .setScrollFactor(0);

    //     // Hover styling
    //     hitRect.on("pointerover", () => {
    //         bg.clear();
    //         bg.fillStyle(0x020617, 0.96);
    //         bg.fillRoundedRect(
    //             -ROW_WIDTH / 2,
    //             -ROW_HEIGHT / 2,
    //             ROW_WIDTH,
    //             ROW_HEIGHT,
    //             999
    //         );
    //         bg.lineStyle(1.2, 0xfacc15, 1); // yellow border on hover
    //         bg.strokeRoundedRect(
    //             -ROW_WIDTH / 2 + 0.5,
    //             -ROW_HEIGHT / 2 + 0.5,
    //             ROW_WIDTH - 1,
    //             ROW_HEIGHT - 1,
    //             999
    //         );

    //         text.setColor("#facc15");
    //     });

    //     hitRect.on("pointerout", () => {
    //         bg.clear();
    //         bg.fillStyle(0x020617, 0.92);
    //         bg.fillRoundedRect(
    //             -ROW_WIDTH / 2,
    //             -ROW_HEIGHT / 2,
    //             ROW_WIDTH,
    //             ROW_HEIGHT,
    //             999
    //         );
    //         bg.lineStyle(1, 0x38bdf8, 0.8);
    //         bg.strokeRoundedRect(
    //             -ROW_WIDTH / 2 + 0.5,
    //             -ROW_HEIGHT / 2 + 0.5,
    //             ROW_WIDTH - 1,
    //             ROW_HEIGHT - 1,
    //             999
    //         );

    //         text.setColor("#e5e7eb");
    //     });

    //     container.add([bg, circle, key, text, hitRect]);
    //     container.hitRect = hitRect; // keep a ref for events

    //     return container;
    // }
    _createKeyHint(keyLabel, actionText) {
        const container = this.scene.add
            .container(0, 0)
            .setScrollFactor(0);

        const PILL_WIDTH = 140;
        const PILL_HEIGHT = 35;
        const RADIUS = PILL_HEIGHT / 2;

        // --- Click area (same size as pill) ---
        const hitRect = this.scene.add.rectangle(
            0,
            0,
            PILL_WIDTH,
            PILL_HEIGHT,
            0x000000,
            0 // invisible, just for input
        )
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);

        // --- Pill background ---
        const pill = this.scene.add.graphics().setScrollFactor(0);

        pill.fillStyle(0x020617, 0.78); // translucent black/blue
        pill.fillRoundedRect(
            -PILL_WIDTH / 2,
            -PILL_HEIGHT / 2,
            PILL_WIDTH,
            PILL_HEIGHT,
            RADIUS
        );

        pill.lineStyle(1, 0x38bdf8, 0.65); // cyan border
        pill.strokeRoundedRect(
            -PILL_WIDTH / 2 + 0.5,
            -PILL_HEIGHT / 2 + 0.5,
            PILL_WIDTH - 1,
            PILL_HEIGHT - 1,
            RADIUS
        );

        // --- Key badge (left side) ---
        const circleX = -PILL_WIDTH / 2 + 16;

        const keyCircle = this.scene.add.circle(
            circleX,
            0,
            10,
            0x22c55e,
            1
        ).setScrollFactor(0);

        const keyText = this.scene.add.text(circleX, 0, keyLabel, {
            fontFamily: "Poppins, sans-serif",
            fontSize: "18px",
            color: "#020617",
            fontStyle: "bold"
        })
            .setOrigin(0.5)
            .setScrollFactor(0);

        // --- Label text ---
        const label = this.scene.add.text(circleX + 18, 0, actionText, {
            fontFamily: "Poppins, sans-serif",
            fontSize: "20px",
            color: "#e5e7eb",
            align: "left"
        })
            .setOrigin(0, 0.5)
            .setScrollFactor(0);

        // --- Hover state (subtle glow, text tint) ---
        hitRect.on("pointerover", () => {
            pill.clear();
            pill.fillStyle(0x020617, 0.9);
            pill.fillRoundedRect(
                -PILL_WIDTH / 2,
                -PILL_HEIGHT / 2,
                PILL_WIDTH,
                PILL_HEIGHT,
                RADIUS
            );
            pill.lineStyle(1.2, 0x4ade80, 0.9);
            pill.strokeRoundedRect(
                -PILL_WIDTH / 2 + 0.5,
                -PILL_HEIGHT / 2 + 0.5,
                PILL_WIDTH - 1,
                PILL_HEIGHT - 1,
                RADIUS
            );

            keyCircle.setFillStyle(0x4ade80, 1);
            label.setColor("#facc15");
        });

        hitRect.on("pointerout", () => {
            pill.clear();
            pill.fillStyle(0x020617, 0.78);
            pill.fillRoundedRect(
                -PILL_WIDTH / 2,
                -PILL_HEIGHT / 2,
                PILL_WIDTH,
                PILL_HEIGHT,
                RADIUS
            );
            pill.lineStyle(1, 0x38bdf8, 0.65);
            pill.strokeRoundedRect(
                -PILL_WIDTH / 2 + 0.5,
                -PILL_HEIGHT / 2 + 0.5,
                PILL_WIDTH - 1,
                PILL_HEIGHT - 1,
                RADIUS
            );

            keyCircle.setFillStyle(0x22c55e, 1);
            label.setColor("#e5e7eb");
        });

        container.add([pill, hitRect, keyCircle, keyText, label]);
        container.hitRect = hitRect;

        return container;
    }

    show(worldX, worldY, npc) {
        console.log("[TooltipManager] show() called for npc:", npc?.dialogueId);

        this.currentNPC = npc;

        const cam = this.scene.cameras.main;

        // world → screen (because tooltip is in screen-space)
        const screenX = (worldX - cam.worldView.x) * cam.zoom;
        const screenY = (worldY - cam.worldView.y) * cam.zoom;

        // Position a bit offset from NPC
        this.tooltipContainer.setPosition(screenX + 90, screenY - 65);

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
                console.log(
                    "[Tooltip] Q pressed, starting dialogue:",
                    this.currentNPC?.dialogueId
                );
                this.scene.startDialogue(
                    this.currentNPC?.dialogueId || "h_intro_narration"
                );
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
            console.log(
                "[Tooltip] Talk clicked, starting dialogue:",
                this.currentNPC?.dialogueId
            );
            this.scene.startDialogue(
                this.currentNPC?.dialogueId || "h_intro_narration"
            );
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
