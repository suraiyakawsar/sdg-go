import Phaser from "phaser";
export default class TooltipManager {
	constructor(scene, uiLayer) {
		this.scene = scene;
		this.uiLayer = uiLayer;
		this.currentNPC = null;

		// ============================================================
		// Tooltip container (SCREEN SPACE — FIXED TO uiLayer)
		// ============================================================
		this.tooltipContainer = this.scene.add.container(0, 0)
			.setVisible(false)
			.setAlpha(0)
			.setScale(0.1)
			.setScrollFactor(0);

		// IMPORTANT: add tooltip to UI layer
		this.uiLayer.add(this.tooltipContainer);

		// === Buttons (Q = Talk, E = Inspect) ===
		const talkBtn = this.createKeyHint("Q", "Talk");
		const inspectBtn = this.createKeyHint("E", "Inspect");

		talkBtn.y = -40;
		inspectBtn.y = -70;

		this.tooltipContainer.add([talkBtn, inspectBtn]);

		this.talkBtn = talkBtn;
		this.inspectBtn = inspectBtn;
	}

	// ============================================================
	// CREATE BUTTON
	// ============================================================
	createKeyHint(keyLabel, actionText) {
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
		container.hitRect = hitRect;

		return container;
	}

	// ============================================================
	// SHOW TOOLTIP (POSITION STILL BASED ON NPC)
	// ============================================================
	show(worldX, worldY, npc) {
		this.currentNPC = npc;

		// Convert world coordinates → screen coordinates
		const screenPos = this.scene.cameras.main.worldView;
		const cam = this.scene.cameras.main;

		// world → screen conversion
		const screenX = (worldX - cam.worldView.x) * cam.zoom;
		const screenY = (worldY - cam.worldView.y) * cam.zoom;

		this.tooltipContainer.setPosition(screenX + 90, screenY + 60);

		this.tooltipContainer.setVisible(true);
		this.tooltipContainer.setAlpha(0);
		this.tooltipContainer.setScale(0.01);

		// Keyboard listener cleanup
		if (this.keyListener) window.removeEventListener("keydown", this.keyListener);

		this.keyListener = (event) => {
			if (!this.tooltipContainer.visible) return;

			const key = event.key.toLowerCase();
			if (key === "q") {
				this.hide();
				this.scene.startDialogue(this.currentNPC.dialogueId || "npc1");
			} else if (key === "e") {
				this.scene.showNPCInfo(this.currentNPC);
				this.hide();
			}
		};

		window.addEventListener("keydown", this.keyListener);

		// Mouse handlers
		this.talkBtn.hitRect.removeAllListeners();
		this.inspectBtn.hitRect.removeAllListeners();

		this.talkBtn.hitRect.on("pointerdown", () => {
			this.hide();
			this.scene.startDialogue(this.currentNPC.dialogueId || "npc1");
		});

		this.inspectBtn.hitRect.on("pointerdown", () => {
			this.scene.showNPCInfo(this.currentNPC);
			this.hide();
		});

		this.scene.tweens.add({
			targets: this.tooltipContainer,
			alpha: 1,
			scale: 1,
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
			scale: 0.8,
			duration: 150,
			ease: "Sine.easeIn",
			onComplete: () => {
				this.tooltipContainer.setVisible(false);
			}
		});
	}
}
