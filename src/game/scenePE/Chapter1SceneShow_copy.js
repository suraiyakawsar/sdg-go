
// You can write more code here

/* START OF COMPILED CODE */

class Chapter1SceneShow_copy extends Phaser.Scene {

	constructor() {
		super("Chapter1SceneShow");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	preload() {

		this.load.pack("assets-pack", "public/assets/assets-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// bg
		const bg = this.add.image(236, 252, "bg");
		bg.setOrigin(0.5041990043876151, 0.5);

		// npc1
		const npc1 = this.add.image(490, 261, "npc1");
		npc1.setInteractive(new Phaser.Geom.Rectangle(0, 0, 157, 441), Phaser.Geom.Rectangle.Contains);
		npc1.scaleX = 0.33298004872224707;
		npc1.scaleY = 0.33298004872224707;

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
