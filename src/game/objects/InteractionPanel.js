// export default class InteractionPanel {
//     constructor(scene, uiLayer) {
//         this.scene = scene;

//         this.panel = scene.add.container(
//             scene.scale.width / 2,
//             scene.scale.height - 180
//         )
//             .setVisible(false)
//             .setScrollFactor(0); // 👈 STICK TO SCREEN

//         // Add it to the persistent UI layer (which is already ignored by main camera)
//         uiLayer.add(this.panel);

//         this.qText = scene.add.text(-100, 0, "Q — Talk", {
//             fontSize: "18px", color: "#fff"
//         }).setOrigin(0.5).setScrollFactor(0); // 👈 Make text stick too

//         this.eText = scene.add.text(100, 0, "E — Inspect", {
//             fontSize: "18px", color: "#fff"
//         }).setOrigin(0.5).setScrollFactor(0);

//         this.panel.add([this.qText, this.eText]);

//         // Keyboard input
//         scene.input.keyboard.on("keydown-Q", () => {
//             if (this.panel.visible && this.currentNPC) {
//                 this.hide();
//                 scene.startDialogue(this.currentNPC.dialogueId);
//             }
//         });

//         scene.input.keyboard.on("keydown-E", () => {
//             if (this.panel.visible && this.currentNPC) {
//                 this.hide();
//                 scene.showNPCInfo(this.currentNPC);
//             }
//         });
//     }

//     show(npc) {
//         this.currentNPC = npc;
//         this.panel.setVisible(true);
//     }

//     hide() {
//         this.panel.setVisible(false);
//     }
// }
