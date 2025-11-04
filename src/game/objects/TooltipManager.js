// src/game/ui/TooltipManager.js
import Phaser from "phaser";

export default class TooltipManager {
	constructor(scene) {
		this.scene = scene;
		this.currentNPC = null;

		this.tooltipContainer = this.scene.add.container(0, 0)
			.setDepth(10000)
			.setVisible(false)
			.setAlpha(0);

		// --- Background bubble ---
		const bg = this.scene.add.image(0, 0, "ui_tooltip_bg")
			.setDisplaySize(140, 80)
			.setOrigin(0.5)
			.setAlpha(0.95);


		// --- Icons ---
		this.eyeIcon = this.scene.add.image(-30, -0, "icon_eye").setInteractive({ useHandCursor: true }).setScale(0.05);
		this.speechIcon = this.scene.add.image(30, -0, "icon_speech").setInteractive({ useHandCursor: true }).setScale(0.05);

		this.tooltipContainer.add([bg, this.eyeIcon, this.speechIcon]);

		// --- Event handlers ---
		this.eyeIcon.on("pointerdown", () => {
			this.scene.showNPCInfo(this.currentNPC);
			this.hide();
		});

		this.speechIcon.on("pointerdown", () => {
			this.hide();
			this.scene.startDialogue(this.currentNPC.dialogueId || "npc1");
		});
	}

	show(x, y, npc) {
		this.currentNPC = npc;
		this.tooltipContainer.setPosition(x, y - 160);
		this.tooltipContainer.setVisible(true);
		this.tooltipContainer.setAlpha(0);
		this.tooltipContainer.setScale(0.8);

		// remove any previous listeners
		this.eyeIcon.removeAllListeners();
		this.speechIcon.removeAllListeners();

		this.eyeIcon.on("pointerdown", () => {
			this.scene.showNPCInfo(this.currentNPC);
			this.hide();
		});

		this.speechIcon.on("pointerdown", () => {
			this.hide();
			this.scene.startDialogue(this.currentNPC.dialogueId);
		});

		this.scene.tweens.add({
			targets: this.tooltipContainer,
			alpha: 1,
			scale: 1,
			duration: 200,
			ease: "Back.Out"
		});
	}

	hide() {
		if (!this.tooltipContainer.visible) return;
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