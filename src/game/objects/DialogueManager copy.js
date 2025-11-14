// // src/game/objects/DialogueManager.js
// import Phaser from "phaser";
// import { addSDGPoints } from "../../utils/sdgPoints.js";
// import { emit } from "../../utils/eventBus.js";

// /**
//  * Handles dialogue boxes, choices, SDG points, and interactions.
//  * Works with React via eventBus emit() calls.
//  */
// export default class DialogueManager {
//   constructor(scene, dialogueData = {}, sdgPointsObj = { points: 0 }) {
//     this.scene = scene;
//     this.dialogueScript = dialogueData;
//     this.sdgPointsObj = sdgPointsObj;

//     // this.events = new Phaser.Events.EventEmitter();

//     // Screen dimensions
//     // this.gameWidth = () => this.scene.scale.width || 100;
//     // this.gameHeight = () => this.scene.scale.height || 400;

//     // --- Dialogue state ---
//     this.dialogueIndex = 0;
//     this.currentDialogue = null;
//     // this.currentKey = null;
//     // this.dialogueVisible = false;
//     // this.dialogueFinished = false;
//     // this.choiceButtons = [];

//     // --- Typewriter state ---
//     this.isTyping = false;
//     this.currentText = "";
//     this.typeSpeed = 30;
//     this.typeEvent = null;
//     this.skipRequested = false;
//     this.pendingChoices = null;

//     // Default position (center-top)
//     // this.targetPos = { x: Math.round(this.gameWidth() / 2), y: 150 };

//     // --- Setup UI ---
//     this.createUI();

//     // --- Input listeners ---
//     this.handleKeyDown = this.handleKeyDown.bind(this);
//     this.handlePointerDown = this.handlePointerDown.bind(this);
//   }

//   // ---------------------------------------------------------
//   // PUBLIC METHODS
//   // ---------------------------------------------------------


//   /** Start a new dialogue node */
//   // startDialogue(keyOrNode, playerX, playerY) {
//   //   const node =
//   //     typeof keyOrNode === "string"
//   //       ? this.dialogueScript?.[keyOrNode]
//   //       : keyOrNode;

//   //   if (!node) return console.warn("[DialogueManager] Invalid key:", keyOrNode);

//   //   this.currentDialogue = node;
//   //   this.dialogueIndex = 0;
//   //   this.dialogueFinished = false;

//   //   if (playerX && playerY) this.setTargetPosition(this.gameWidth() / 2, 100);
//   //   else this.updateContainerPosition();

//   //   this.toggleUI(true);
//   //   this.showLine();
//   //   // this.currentDialogueKey = typeof keyOrNode === "string" ? keyOrNode : null;

//   //   // if (playerX !== undefined && playerY !== undefined)
//   //   //   this.setTargetPosition(playerX, playerY);
//   //   // else
//   //   //   this.updateContainerPosition();

//   //   // this.showUI(true);
//   //   // this.showCurrentLine();
//   // }
//   startDialogue(keyOrNode, x = null, y = null) {
//     const node = typeof keyOrNode === "string" ? this.dialogueScript?.[keyOrNode] : keyOrNode;
//     if (!node) return console.warn("[DialogueManager] Invalid key:", keyOrNode);

//     this.currentDialogue = node;
//     this.dialogueIndex = 0;
//     this.dialogueFinished = false;

//     if (x !== null && y !== null) this.setPosition(x, y);
//     else this.updateContainerPosition();

//     this.toggleUI(true);
//     this.showLine();
//   }

//   /** Proceed to next dialogue line */
//   nextDialogue() {
//     if (this.isTyping) return this.skipTypewriter();

//     const line = this.currentDialogue[this.dialogueIndex];
//     if (line?.choices) return; // Wait for player choice

//     this.dialogueIndex++;
//     if (this.dialogueIndex < this.currentDialogue.length) this.showLine();
//     else this.endDialogue();
//   }

//   /** End dialogue manually */
//   endDialogue() {
//     if (this.typeEvent) this.typeEvent.remove(false);
//     this.clearChoices();
//     this.toggleUI(false);
//     this.dialogueFinished = true;
//     // Inside DialogueManager.js endDialogue()
//     // this.scene.events.emit("dialogueEnded", this.currentKey || "custom");
//     this.scene.events.emit("dialogueEnded");
//   }

//   /** Apply SDG points and trigger feedback */
//   applySDGPoints(points) {
//     this.sdgPointsObj.points += points;
//     const total = addSDGPoints(points);
//     emit("updateSDGPoints", total); // triggers SDGBar update in React
//     this.showFeedback(points);
//   }

//   // ---------------------------------------------------------
//   // PRIVATE: UI SETUP
//   // ---------------------------------------------------------

//   /** Create main dialogue UI elements */
//   createUI() {
//     this.dialogueContainer = this.scene.add
//       .container(0, 0)
//       .setDepth(10000)
//       .setVisible(false)
//       .setAlpha(0);
//     // .setScrollFactor(0)
//     // .setScale(1);

//     // const panelW = Math.min(700, this.gameWidth() * 0.9);
//     // const panelW = Math.min(1000, this.gameWidth() * 0.9);
//     const panelW = Math.min(1000, this.scene.scale.width * 0.9);
//     const panelH = 180;

//     this.panelW = panelW;
//     this.panelH = panelH;

//     // Dialogue        
//     // Background panel with fallback if no nineslice
//     // this.dialogueBox = this.scene.add.nineslice
//     //   ? this.scene.add.nineslice(0, 0, panelW, panelH, "ui_dialogue_box", 16)
//     //   : this.scene.add.rectangle(0, 0, panelW, panelH, 0x1a1a1a, 0.85);

//     // this.dialogueBox.setOrigin(0.5);
//     // this.dialogueBox.setStrokeStyle?.(2, 0x6d28d9);

//     // if (this.dialogueBubble.setStrokeStyle)
//     //   this.dialogueBubble.setStrokeStyle(2, 0x6d28d9); // soft purple border

//     // Dialogue background
//     this.dialogueBox = this.scene.add.rectangle(0, 0, panelW, panelH, 0x1a1a1a, 0.85)
//       .setOrigin(0.5)
//       .setStrokeStyle(2, 0x6d28d9);

//     // Avatar
//     this.avatarContainer = this.scene.add.container(-panelW / 2 + 80, 0);

//     // Speaker name
//     this.nameText = this.scene.add
//       .text(-panelW / 2 + 160, -panelH / 2 + 18, "", {
//         fontFamily: "Arial",
//         fontSize: "20px",
//         color: "#C4B5FD",
//         fontStyle: "bold"
//       }).setOrigin(0, 0.5);

//     // Dialogue text
//     // this.dialogueText = this.scene.add
//     //   .text(-panelW / 2 + 160, -panelH / 2 + 44, "", {
//     //     fontFamily: "Arial",
//     //     fontSize: "18px",
//     //     color: "#FFFFFF",
//     //     wordWrap: { width: panelW - 240 },
//     //     lineSpacing: 6
//     //   }).setOrigin(0, 0);
//     this.dialogueText = this.scene.add.text(-panelW / 2 + 160, -panelH / 2 + 44, "", {
//       fontFamily: "Arial",
//       fontSize: "18px",
//       color: "#FFFFFF",
//       wordWrap: { width: panelW - 240 }, // adjust if panelW changes
//       lineSpacing: 6
//     }).setOrigin(0, 0);


//     // Continue arrow or fallback icon
//     // this.continueIcon = this.scene.textures.exists("ui_arrow_down")
//     //   ? this.scene.add.image(panelW / 2 - 28, panelH / 2 - 20, "ui_arrow_down")
//     //   : this.scene.add.triangle(panelW / 2 - 28, panelH / 2 - 20, 0, 0, 8, 0, 4, 8, 0xffffff);
//     // this.continueIcon.setScale(0.09).setAlpha(0.85).setVisible(false);

//     this.continueIcon = this.scene.add.triangle(panelW / 2 - 28, panelH / 2 - 20, 0, 0, 8, 0, 4, 8, 0xffffff)
//       .setScale(0.09)
//       .setAlpha(0.85)
//       .setVisible(false);

//     // Add idle bounce to continue arrow
//     this.scene.tweens.add({
//       targets: this.continueIcon,
//       y: this.continueIcon.y + 6,
//       duration: 600,
//       ease: "Sine.easeInOut",
//       yoyo: true,
//       repeat: -1
//     });

//     // Choice container
//     this.choicesContainer = this.scene.add.container(0, panelH / 2 + 34);

//     // Add all UI parts to the main container
//     this.dialogueContainer.add([
//       this.dialogueBox,
//       this.avatarContainer,
//       this.nameText,
//       this.dialogueText,
//       this.continueIcon,
//       this.choicesContainer
//     ]);
//   }

//   /** Draw debug boxes around dialogue UI elements */
//   drawDebug() {
//     if (this.debugGraphics) this.debugGraphics.destroy();
//     this.debugGraphics = this.scene.add.graphics();
//     this.debugGraphics.lineStyle(2, 0xff0000, 1); // red lines

//     // Dialogue box
//     if (this.dialogueBox) {
//       const bounds = this.dialogueBox.getBounds();
//       this.debugGraphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
//     }

//     // Dialogue text
//     if (this.dialogueText) {
//       const bounds = this.dialogueText.getBounds();
//       this.debugGraphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
//     }

//     // Speaker name
//     if (this.nameText) {
//       const bounds = this.nameText.getBounds();
//       this.debugGraphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
//     }

//     // Avatar
//     if (this.avatarContainer) {
//       this.avatarContainer.iterate((child) => {
//         const bounds = child.getBounds();
//         this.debugGraphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
//       });
//     }

//     // Choice buttons
//     this.choiceButtons.forEach(({ buttonBg, buttonText }) => {
//       if (buttonBg) {
//         const bounds = buttonBg.getBounds();
//         this.debugGraphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
//       }
//       if (buttonText) {
//         const bounds = buttonText.getBounds();
//         this.debugGraphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
//       }
//     });

//     console.log(this.dialogueContainer.x, this.dialogueContainer.y);
//     this.dialogueContainer.list.forEach(child => console.log(child.x, child.y));

//   }

//   // ---------------------------------------------------------
//   // PRIVATE: DIALOGUE FLOW
//   // ---------------------------------------------------------

//   /** Display current line */

//   showDialogueAt(x, y) {
//     this.dialogueContainer.setPosition(x, y - 120); // above NPC
//   }


//   showLine() {
//     const dialogueLine = this.currentDialogue[this.dialogueIndex];
//     if (!dialogueLine) return this.endDialogue();

//     this.nameText.setText(dialogueLine.character || dialogueLine.speaker || "");
//     this.setAvatar(dialogueLine.avatarKey || dialogueLine.avatar);
//     this.clearChoices();
//     this.continueIcon.setVisible(false);

//     this.startTypewriter(dialogueLine.text || "");
//     this.pendingChoices = Array.isArray(dialogueLine.choices)
//       ? dialogueLine.choices
//       : null;

//     this.drawDebug();  // temporarily visualize boundaries

//   }

//   // ---------------------------------------------------------
//   // TYPEWRITER EFFECT
//   // ---------------------------------------------------------
//   startTypewriter(fullText) {
//     if (this.typeEvent) this.typeEvent.remove(false);

//     this.isTyping = true;
//     this.currentText = "";
//     this.dialogueText.setText("");
//     this.SkipRequested = false;

//     let i = 0;
//     this.typeEvent = this.scene.time.addEvent({
//       delay: this.typeSpeed,
//       loop: true,
//       callback: () => {
//         if (i >= fullText.length) return this.onTypeComplete();
//         this.currentText += fullText[i];
//         this.dialogueText.setText(this.currentText);
//         i++;
//         if (this.skipRequested) {
//           this.dialogueText.setText(fullText);
//           this.onTypeComplete();
//         }
//       },
//     });
//   }

//   /** Skip typing instantly */
//   skipTypewriter() {
//     if (this.isTyping) this.skipRequested = true;
//   }

//   /** Called when typewriter finishes */
//   onTypeComplete() {
//     if (this.typeEvent) this.typeEvent.remove(false);
//     this.isTyping = false;
//     this.continueIcon.setVisible(true);

//     if (this.pendingChoices) {
//       this.createChoices(this.pendingChoices);
//       this.pendingChoices = null;
//     } else if (this.dialogueIndex === this.currentDialogue.length - 1) {
//       this.scene.time.delayedCall(600, () => this.endDialogue());
//     }
//   }


//   // ---------------------------------------------------------
//   // PRIVATE: CHOICES
//   // ---------------------------------------------------------

//   /** Create choice buttons */
//   // createChoices(choices = []) {
//   //   this.clearChoices();
//   //   if (!choices.length) return;

//   //   const buttonW = Math.min(220, Math.round(this.gameWidth() * 0.18));
//   //   const buttonH = 44;
//   //   const spacing = 16;
//   //   const maxPerRow = 3;


//   //   for (let i = 0; i < choices.length; i += maxPerRow) {
//   //     const rowChoices = choices.slice(i, i + maxPerRow);
//   //     const row = this.scene.add.container(0, (i / maxPerRow) * (buttonH + 12));
//   //     const totalW = rowChoices.length * (buttonW + spacing) - spacing;
//   //     const startX = -Math.round(totalW / 2);


//   //     // const rows = [];
//   //     // for (let i = 0; i < choices.length; i += maxPerRow)
//   //     //   rows.push(choices.slice(i, i + maxPerRow));

//   //     // rows.forEach((rowChoices, rowIndex) => {
//   //     //   const rowContainer = this.scene.add.container(0, rowIndex * (buttonH + 12));
//   //     //   const totalWidth = rowChoices.length * (buttonW + spacing) - spacing;
//   //     //   const startX = -Math.round(totalWidth / 2);

//   //     rowChoices.forEach((choice, idx) => {
//   //       const x = startX + idx * (buttonW + spacing);

//   //       const buttonBg = this.scene.add
//   //         .rectangle(x + buttonW / 2, 0, buttonW, buttonH, 0x2563eb, 0.95)
//   //         .setOrigin(0.5)
//   //         .setInteractive({ useHandCursor: true });


//   //       const buttonText = this.scene.add
//   //         .text(x + buttonW / 2, 0, choice.text, {
//   //           fontFamily: "Arial",
//   //           fontSize: "14px",
//   //           color: "#FFFFFF",
//   //           align: "center",
//   //           wordWrap: { width: buttonW - 10 }
//   //         })
//   //         .setOrigin(0.5);

//   //       buttonBg.on("pointerover", () => buttonBg.setFillStyle(0x3b82f6, 0.98));
//   //       buttonBg.on("pointerout", () => buttonBg.setFillStyle(0x2563eb, 0.95));

//   //       const select = () => this.handleChoice(choice);
//   //       buttonBg.on("pointerdown", select);
//   //       buttonText.setInteractive({ useHandCursor: true }).on("pointerdown", select);

//   //       row.add([buttonBg, buttonText]);
//   //       this.choiceButtons.push({ buttonBg, buttonText });
//   //     });

//   //     this.choicesContainer.add(row);
//   //   }
//   // }


//   // createChoices(choices = []) {
//   //   this.clearChoices();
//   //   if (!choices.length) return;

//   //   const panelH = this.panelH;
//   //   const buttonW = Math.min(220, Math.round(this.gameWidth() * 0.18));
//   //   const buttonH = 44;
//   //   const spacing = 16;
//   //   const maxPerRow = 3;

//   //   const rowContainer = [];
//   //   for (let i = 0; i < choices.length; i += maxPerRow) {
//   //     rowContainer.push(choices.slice(i, i + maxPerRow));
//   //   }

//   //   rowContainer.forEach((rowChoices, rowIndex) => {
//   //     const rowContainer = this.scene.add.container(0, rowIndex * (buttonH + 12));

//   //     const totalWidth = rowChoices.length * (buttonW + spacing) - spacing;
//   //     const startX = -Math.round(totalWidth / 2);

//   //     rowChoices.forEach((choice, idx) => {
//   //       const x = startX + idx * (buttonW + spacing) + buttonW / 2;

//   //       const buttonBg = this.scene.add.rectangle(x, 0, buttonW, buttonH, 0x2563eb, 0.95)
//   //         .setOrigin(0.5)
//   //         .setInteractive({ useHandCursor: true });

//   //       const buttonText = this.scene.add.text(x, 0, choice.text, {
//   //         fontFamily: "Arial",
//   //         fontSize: "14px",
//   //         color: "#FFFFFF",
//   //         align: "center",
//   //         wordWrap: { width: buttonW - 10 }
//   //       }).setOrigin(0.5).setInteractive({ useHandCursor: true });

//   //       const select = () => this.handleChoice(choice);
//   //       buttonBg.on("pointerdown", select);
//   //       // buttonText.on("pointerdown", select );
//   //       buttonText.setInteractive({ useHandCursor: true }).on("pointerdown", select);


//   //       rowContainer.add([buttonBg, buttonText]);
//   //       this.choiceButtons.push({ buttonBg, buttonText });
//   //     });

//   //     this.choicesContainer.add(rowContainer);
//   //   });

//   //   this.drawDebug();

//   // }

//   createChoices(choices = []) {
//     this.clearChoices();
//     if (!choices.length) return;

//     const buttonW = Math.min(220, Math.round(this.scene.scale.width * 0.18));
//     const buttonH = 44;
//     const spacing = 16;

//     choices.forEach((choice, idx) => {
//       const x = (-choices.length / 2 + idx + 0.5) * (buttonW + spacing);

//       const buttonBg = this.scene.add.rectangle(x, 0, buttonW, buttonH, 0x2563eb, 0.95)
//         .setOrigin(0.5)
//         .setInteractive({ useHandCursor: true });

//       const buttonText = this.scene.add.text(x, 0, choice.text, {
//         fontFamily: "Arial",
//         fontSize: "14px",
//         color: "#FFFFFF",
//         align: "center",
//         wordWrap: { width: buttonW - 10 }
//       }).setOrigin(0.5).setInteractive({ useHandCursor: true });

//       const select = () => this.handleChoice(choice);
//       buttonBg.on("pointerdown", select);
//       buttonText.on("pointerdown", select);

//       this.choicesContainer.add([buttonBg, buttonText]);
//       this.choiceButtons.push({ buttonBg, buttonText });
//     });

//     // Keyboard shortcuts (Q/E)
//     this.scene.input.keyboard.on("keydown-Q", () => {
//       if (choices[0]) this.handleChoice(choices[0]);
//     });
//     this.scene.input.keyboard.on("keydown-E", () => {
//       if (choices[1]) this.handleChoice(choices[1]);
//     });
//   }

//   /** Handle choice selection */
//   // handleChoice(choice) {
//   //   this.clearChoices();
//   //   this.animateChoice();

//   //   const points = choice.points || choice.sdgPoints || 0;
//   //   if (points) this.applySDGPoints(points);

//   //   this.scene.time.delayedCall(200, () => {
//   //     const next = choice.next;
//   //     if (!next || next === "close" || next === "end") return this.endDialogue();
//   //     if (next === "nextChapter") {
//   //       this.scene.nextZone?.setVisible(true);
//   //       return this.endDialogue();
//   //     }
//   //     this.startDialogue(next);
//   //   });
//   // }

//   // ---------------------------------------------------------
//   // PRIVATE: VISUALS & CLEANUP
//   // ---------------------------------------------------------

//   handleChoice(choice) {
//     this.clearChoices();
//     const points = choice.points || choice.sdgPoints || 0;
//     if (points) this.applySDGPoints(points);

//     this.scene.time.delayedCall(200, () => {
//       const next = choice.next;
//       if (!next || next === "close" || next === "end") return this.endDialogue();
//       if (next === "nextChapter") {
//         this.scene.nextZone?.setVisible(true);
//         return this.endDialogue();
//       }
//       this.startDialogue(next);
//     });
//   }

//   clearChoices() {
//     this.choicesContainer.removeAll(true);
//     this.choiceButtons.forEach(({ buttonBg, buttonText }) => {
//       buttonBg?.destroy?.();
//       buttonText?.destroy?.();
//     });
//     this.choiceButtons = [];
//   }

//   // animateChoice() {
//   //   this.scene.tweens.add({
//   //     targets: [this.dialogueBox, this.dialogueText],
//   //     scaleX: 1.05,
//   //     scaleY: 1.05,
//   //     duration: 120,
//   //     ease: "Power2",
//   //     yoyo: true
//   //   });
//   // }

//   // showFeedback(points) {
//   //   const msg = points > 0 ? `+${points} SDG Points! ✨` : "No points this time!";
//   //   const color = points > 0 ? "#22c55e" : "#ef4444";

//   //   const feedback = this.scene.add
//   //     .text(this.targetPos.x, this.targetPos.y - 80, msg, {
//   //       fontSize: "16px",
//   //       color,
//   //       fontStyle: "bold",
//   //       fontFamily: "Arial",
//   //     })
//   //     .setOrigin(0.5)
//   //     .setScrollFactor(0)
//   //     .setAlpha(0);

//   //   this.scene.tweens.add({
//   //     targets: feedback,
//   //     y: feedback.y - 40,
//   //     alpha: 1,
//   //     duration: 400,
//   //     ease: "Back.easeOut"
//   //   });
//   //   this.scene.tweens.add({
//   //     targets: feedback,
//   //     y: feedback.y - 60,
//   //     alpha: 0,
//   //     duration: 400,
//   //     delay: 600,
//   //     onComplete: () => feedback.destroy()
//   //   });
//   // }

//   // ---------------------------------------------------------
//   // CLEANUP
//   // ---------------------------------------------------------
//   // clearChoices() {
//   //   this.choicesContainer.removeAll(true);
//   //   this.choiceButtons.forEach(({ buttonBg, buttonText }) => {
//   //     buttonBg?.destroy?.();
//   //     buttonText?.destroy?.();
//   //   });
//   //   this.choiceButtons = [];
//   // }

//   // ----------------------
//   // AVATAR
//   // ----------------------

//   /** Load or update character avatar */
//   setAvatar(key, size = 90) {
//     this.avatarContainer.removeAll(true);
//     if (key && this.scene.textures.exists(key)) {
//       const img = this.scene.add
//         .image(0, 0, key)
//         .setDisplaySize(size, size)
//         .setOrigin(0.5)
//         .setAlpha(0.95);
//       this.avatarContainer.add(img);
//     } else {
//       // fallback circle
//       this.avatarContainer.add(this.scene.add.circle(0, 0, size / 2, 0x7b2cbf));
//     }
//   }

//   // setTargetPosition(x, y) {
//   //   this.targetPosition.x = x;
//   //   this.targetPosition.y = y - 80;
//   //   this.updateContainerPosition();
//   // }

//   setPosition(x, y) {
//     this.dialogueContainer.setPosition(x, y - 120);
//   }
//   // updateContainerPosition() {
//   //   // this.dialogueContainer.setPosition(this.targetPos.x, this.targetPos.y);
//   //   this.dialogueContainer.setPosition(this.gameWidth() / 2, 150);

//   // }
//   updateContainerPosition() {
//     this.dialogueContainer.setPosition(this.scene.scale.width / 2, 150);
//   }

//   toggleUI(visible) {
//     this.dialogueContainer.setVisible(visible);
//     if (visible) {
//       this.dialogueContainer.setAlpha(0).setScale(0.95);
//       this.scene.tweens.add({
//         targets: this.dialogueContainer,
//         alpha: 1,
//         scaleX: 1,
//         scaleY: 1,
//         duration: 220,
//         ease: "Back.easeOut"
//       });
//       this.scene.input.keyboard.on("keydown", this.handleKeyDown);
//       this.scene.input.on("pointerdown", this.handlePointerDown);
//       this.dialogueVisible = true;
//     } else {
//       this.scene.input.keyboard.off("keydown", this.handleKeyDown);
//       this.scene.input.off("pointerdown", this.handlePointerDown);
//       this.dialogueVisible = false;
//     }
//   }

//   // ---------------------------------------------------------
//   // PRIVATE: INPUT
//   // ---------------------------------------------------------
//   handleKeyDown(event) {
//     if (!this.dialogueVisible) return;
//     if (["Space", "Enter"].includes(event.code)) this.nextDialogue();
//   }

//   handlePointerDown() {
//     if (!this.dialogueVisible) return;
//     this.nextDialogue();
//   }
// // ----------------------
//   // FEEDBACK
//   // ----------------------
//   showFeedback(points) {
//     const msg = points > 0 ? `+${points} SDG Points! ✨` : "No points this time!";
//     const color = points > 0 ? "#22c55e" : "#ef4444";

//     const feedback = this.scene.add.text(this.scene.scale.width / 2, 100, msg, {
//       fontSize: "16px",
//       color,
//       fontStyle: "bold",
//       fontFamily: "Arial",
//     }).setOrigin(0.5).setAlpha(0);

//     this.scene.tweens.add({
//       targets: feedback,
//       y: feedback.y - 40,
//       alpha: 1,
//       duration: 400,
//       ease: "Back.easeOut"
//     });
//     this.scene.tweens.add({
//       targets: feedback,
//       y: feedback.y - 60,
//       alpha: 0,
//       duration: 400,
//       delay: 600,
//       onComplete: () => feedback.destroy()
//     });
//   }
// }



// import Phaser from "phaser";

// export default class DialogueManager {
//   constructor(scene, dialogueData, sdgPointsObj) {
//     this.scene = scene;
//     this.dialogueData = dialogueData; // JSON dialogues
//     this.sdgPointsObj = sdgPointsObj;

//     this.dialogueVisible = false;
//     this.dialogueFinished = false;
//     this.currentDialogue = null;
//     this.currentIndex = 0;

//     // Container to hold all dialogue elements
//     this.container = this.scene.add.container(0, 0).setDepth(100).setVisible(false);

//     // Background box
//     // this.bg = this.scene.add.rectangle(0, 0, 600, 150, 0x000000, 0.7);
//     // this.bg.setOrigin(0.5);
//     // this.bg.setStrokeStyle(2, 0xffffff, 0.3);
//     // this.container.add(this.bg);

//     // Character name text
//     this.charName = this.scene.add.text(-280, -50, "", {
//       font: "20px Arial",
//       fill: "#ffccff",
//       fontStyle: "bold",
//     }).setOrigin(0, 0.5);
//     this.container.add(this.charName);

//     // // Dialogue text
//     // this.text = this.scene.add.text(-280, -10, "", {
//     //   font: "18px Arial",
//     //   fill: "#ffffff",
//     //   wordWrap: { width: 560 },
//     // }).setOrigin(0, 0);
//     // this.container.add(this.text);

//     // Avatar
//     this.avatar = this.scene.add.image(-320, 20, null).setOrigin(0.5).setScale(0.5);
//     this.container.add(this.avatar);



//     // Input key for progressing dialogue
//     this.keyF = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);


//     // --- DialogueManager constructor snippet ---
//     const width = this.scene.scale.width * 0.8;
//     const height = 150;
//     const x = this.scene.scale.width / 2;
//     const y = this.scene.scale.height - height / 2 - 20;

//     // Create graphics for rounded rectangle
//     this.dialogueBox = this.scene.add.graphics();
//     this.dialogueBox.fillStyle(0x000000, 0.7);
//     this.dialogueBox.fillRoundedRect(x - width / 2, y - height / 2, width, height, 16);
//     this.dialogueBox.lineStyle(2, 0xffffff);
//     this.dialogueBox.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 16);
//     this.dialogueBox.setScrollFactor(0); // fixed to camera

//     // Add container to hold text + choices
//     this.container = this.scene.add.container(0, 0);
//     this.container.add(this.dialogueBox);

//     // Dialogue text
//     this.dialogueText = this.scene.add.text(x, y - 20, "", {
//       font: "20px Arial",
//       fill: "#ffffff",
//       wordWrap: { width: width - 20 }
//     }).setOrigin(0.5);
//     this.dialogueText.setScrollFactor(0);
//     this.container.add(this.dialogueText);

//     // Choices container
//     this.choices = [];
//     this.choicesContainer = this.scene.add.container(0, 0);
//     this.choicesContainer.setScrollFactor(0);
//     this.container.add(this.choicesContainer);








//   }

//   startDialogue(dialogueId) {
//     this.currentDialogue = this.dialogueData[dialogueId];
//     if (!this.currentDialogue) {
//       console.warn(`Dialogue ID ${dialogueId} not found`);
//       return;
//     }
//     this.currentIndex = 0;
//     this.dialogueVisible = true;
//     this.dialogueFinished = false;
//     this.container.setVisible(true);
//     this.showCurrent();
//   }

//   showCurrent() {
//     const entry = this.currentDialogue[this.currentIndex];
//     if (!entry) {
//       this.endDialogue();
//       return;
//     }

//     // Set character info
//     this.charName.setText(entry.character || "");
//     if (entry.avatar) {
//       this.avatar.setTexture(entry.avatar).setVisible(true);
//     } else {
//       this.avatar.setVisible(false);
//     }

//     // Typewriter effect
//     this.typeText(entry.text);

//     // Handle choices
//     if (entry.choices && entry.choices.length > 0) {
//       this.showChoices(entry.choices);
//     } else {
//       this.clearChoices();
//     }

//     this.scene.events.once("update", () => {
//       // Position dialogue near camera
//       const cam = this.scene.cameras.main;
//       this.container.setPosition(cam.midPoint.x, cam.height - 100);
//     });
//   }

//   typeText(fullText) {
//     if (this.typeTimer) this.typeTimer.remove();

//     this.text.setText("");
//     let i = 0;
//     this.typeTimer = this.scene.time.addEvent({
//       delay: 30,
//       repeat: fullText.length - 1,
//       callback: () => {
//         this.text.text += fullText[i];
//         i++;
//       }
//     });
//   }

//   showChoices(choices) {
//     this.clearChoices();
//     const startX = -choices.length * 70;
//     choices.forEach((choice, index) => {
//       const btn = this.scene.add.text(startX + index * 140, 0, choice.text, {
//         font: "16px Arial",
//         fill: "#ffffff",
//         backgroundColor: "#6633cc",
//         padding: { x: 10, y: 5 },
//         align: "center"
//       }).setOrigin(0.5).setInteractive({ useHandCursor: true });

//       btn.on("pointerdown", () => {
//         if (choice.sdgPoints) {
//           this.sdgPointsObj.points += choice.sdgPoints;
//         }
//         if (choice.next) {
//           this.currentIndex = choice.next;
//           this.showCurrent();
//         } else {
//           this.endDialogue();
//         }
//       });

//       this.choiceContainer.add(btn);
//       this.choiceButtons.push(btn);
//     });
//   }

//   clearChoices() {
//     this.choiceButtons.forEach(btn => btn.destroy());
//     this.choiceButtons = [];
//   }

//   nextDialogue() {
//     if (this.choiceButtons.length > 0) return; // wait for choice
//     this.currentIndex++;
//     this.showCurrent();
//   }

//   endDialogue() {
//     this.dialogueVisible = false;
//     this.dialogueFinished = true;
//     this.container.setVisible(false);
//     this.clearChoices();
//     this.scene.events.emit("dialogueEnded");
//   }

//   update() {
//     if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
//       if (this.dialogueVisible && this.choiceButtons.length === 0) {
//         this.nextDialogue();
//       }
//     }

//     // Keep dialogue container at bottom center of camera
//     const cam = this.scene.cameras.main;
//     this.container.setPosition(cam.midPoint.x, cam.height - 100);

//   }
// }


// import Phaser from "phaser";
// import { addSDGPoints } from "../../utils/sdgPoints.js";
// import { emit } from "../../utils/eventBus.js";

// export default class DialogueManager {
//   constructor(scene, dialogueData = {}, sdgPointsObj = { points: 0 }) {
//     this.scene = scene;
//     this.dialogueData = dialogueData;
//     this.sdgPointsObj = sdgPointsObj;

//     // state
//     this.currentDialogue = null;
//     this.currentIndex = 0;
//     this.dialogueVisible = false;
//     this.typeTimer = null;
//     this.choices = [];

//     // sizes & positions
//     this.panelWidth = Math.round(this.scene.scale.width * 0.84);
//     this.panelHeight = 160;
//     this.panelX = Math.round(this.scene.scale.width / 2);
//     this.panelY = Math.round(this.scene.scale.height - this.panelHeight / 2 - 20);

//     // create UI (camera-fixed)
//     this._createUI();

//     // keyboard
//     this.keyF = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
//     this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
//     this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

//     // bind update keyboard handler so we can remove later if needed
//     this._onKeyDown = this._onKeyDown.bind(this);
//     this.scene.events.on("destroy", this._destroy, this);
//   }

//   _createUI() {
//     // single container for layering; we position it each update to stay anchored
//     this.container = this.scene.add.container(0, 0).setDepth(1000);
//     this.container.setScrollFactor(0); // FIX: keep UI anchored to camera

//     // background rounded rect using graphics
//     const w = this.panelWidth, h = this.panelHeight, r = 12;
//     this.bg = this.scene.add.graphics();
//     this.bg.fillStyle(0x081029, 0.82); // dark, slightly bluish
//     this.bg.fillRoundedRect(this.panelX - w / 2, this.panelY - h / 2, w, h, r);
//     this.bg.lineStyle(2, 0xffffff, 0.08);
//     this.bg.strokeRoundedRect(this.panelX - w / 2, this.panelY - h / 2, w, h, r);
//     this.bg.setScrollFactor(0);
//     this.container.add(this.bg);

//     // speaker name (left side)
//     this.nameText = this.scene.add.text(this.panelX - w / 2 + 20, this.panelY - h / 2 + 18, "", {
//       fontFamily: "Poppins, Arial",
//       fontSize: "18px",
//       color: "#C4B5FD",
//       fontStyle: "600",
//     }).setOrigin(0, 0.5).setScrollFactor(0);
//     this.container.add(this.nameText);

//     // avatar (optional) - small circle placeholder if texture missing
//     this.avatar = this.scene.add.image(this.panelX - w / 2 + 72, this.panelY - 10, null)
//       .setDisplaySize(64, 64)
//       .setScrollFactor(0)
//       .setVisible(false)
//       .setOrigin(0.5);
//     this.container.add(this.avatar);

//     // core dialogue text (center)
//     this.dialogueText = this.scene.add.text(this.panelX, this.panelY - 10, "", {
//       fontFamily: "Poppins, Arial",
//       fontSize: "18px",
//       color: "#FFFFFF",
//       align: "center",
//       wordWrap: { width: w - 160 },
//       lineSpacing: 4
//     }).setOrigin(0.5).setScrollFactor(0);
//     this.container.add(this.dialogueText);

//     // continue indicator (triangle) - hidden until line done
//     this.continueIndicator = this.scene.add.triangle(this.panelX + w / 2 - 36, this.panelY + h / 2 - 28, 0, 0, 8, 0, 4, 8, 0xffffff)
//       .setScale(0.08)
//       .setAlpha(0.9)
//       .setVisible(false)
//       .setScrollFactor(0);
//     this.container.add(this.continueIndicator);
//     this.scene.tweens.add({
//       targets: this.continueIndicator,
//       y: this.continueIndicator.y + 6,
//       duration: 700,
//       yoyo: true,
//       repeat: -1,
//       ease: "Sine.easeInOut"
//     });

//     // choices container (we will position buttons under panel)
//     this.choicesContainer = this.scene.add.container(0, 0).setScrollFactor(0);
//     this.container.add(this.choicesContainer);

//     // hide initially
//     this.container.setVisible(false);
//   }

//   // -------- Public API --------
//   startDialogue(keyOrNode) {
//     const node = typeof keyOrNode === "string" ? this.dialogueData?.[keyOrNode] : keyOrNode;
//     if (!node || !Array.isArray(node)) {
//       console.warn("[DialogueManager] Invalid dialogue node:", keyOrNode);
//       return;
//     }

//     this.currentDialogue = node;
//     this.currentIndex = 0;
//     this.dialogueVisible = true;
//     this.container.setVisible(true);
//     // attach global key handler
//     this.scene.input.keyboard.on("keydown", this._onKeyDown);
//     this._showCurrent();
//   }

//   // -------- Internal flow --------
//   _showCurrent() {
//     if (!this.currentDialogue) return this.endDialogue();

//     const entry = this.currentDialogue[this.currentIndex];
//     if (!entry) return this.endDialogue();

//     // name & avatar
//     this.nameText.setText(entry.character || entry.speaker || "");
//     if (entry.avatar && this.scene.textures.exists(entry.avatar)) {
//       this.avatar.setTexture(entry.avatar).setVisible(true);
//     } else {
//       this.avatar.setVisible(false);
//     }

//     // hide continue and clear choices
//     this.continueIndicator.setVisible(false);
//     this._clearChoices();

//     // position container (bottom center) in case of resize / camera
//     const cam = this.scene.cameras.main;
//     this._reposition(cam);

//     // start typewriter for text
//     this._startTypewriter(entry.text || "");

//     // store pending choices to be shown once typewriter finishes
//     this._pendingChoices = Array.isArray(entry.choices) ? entry.choices : null;
//   }

//   _startTypewriter(fullText = "") {
//     if (this.typeTimer) {
//       this.typeTimer.remove(false);
//       this.typeTimer = null;
//     }
//     this.dialogueText.setText("");
//     this._isTyping = true;
//     this._typedIndex = 0;

//     // handle empty quickly
//     if (!fullText || fullText.length === 0) {
//       this._onTypeComplete();
//       return;
//     }

//     this.typeTimer = this.scene.time.addEvent({
//       delay: 22,
//       repeat: fullText.length - 1,
//       callback: () => {
//         this._typedIndex++;
//         this.dialogueText.setText(fullText.slice(0, this._typedIndex));
//         if (this._skipRequested) {
//           this.dialogueText.setText(fullText);
//           this._skipRequested = false;
//           this._onTypeComplete();
//         } else if (this._typedIndex >= fullText.length) {
//           this._onTypeComplete();
//         }
//       }
//     });
//   }

//   _onTypeComplete() {
//     if (this.typeTimer) {
//       this.typeTimer.remove(false);
//       this.typeTimer = null;
//     }
//     this._isTyping = false;
//     this.continueIndicator.setVisible(true);

//     if (this._pendingChoices) {
//       this._createChoices(this._pendingChoices);
//       this._pendingChoices = null;
//     } else {
//       // if last line auto-close after short delay (optional)
//       // if (this.currentIndex === this.currentDialogue.length - 1) {
//       //   this.scene.time.delayedCall(800, () => this.endDialogue());
//       // }
//     }
//   }

//   _createChoices(choices = []) {
//     this._clearChoices();
//     if (!choices || choices.length === 0) return;

//     const total = choices.length;
//     const gap = 12;
//     const btnW = Math.min(260, Math.round((this.panelWidth - 120) / Math.max(1, total)));
//     const startX = this.panelX - ((total - 1) * (btnW + gap)) / 2;

//     choices.forEach((choice, idx) => {
//       const cx = startX + idx * (btnW + gap);
//       const cy = this.panelY + this.panelHeight / 2 - 32;

//       // button background as rounded graphics for better visuals
//       const g = this.scene.add.graphics();
//       g.fillStyle(0x4f46e5, 1);
//       g.fillRoundedRect(cx - btnW / 2, cy - 18, btnW, 36, 8);
//       g.lineStyle(1, 0xffffff, 0.06);
//       g.strokeRoundedRect(cx - btnW / 2, cy - 18, btnW, 36, 8);
//       g.setScrollFactor(0);

//       const txt = this.scene.add.text(cx, cy, choice.text, {
//         fontFamily: "Poppins, Arial",
//         fontSize: "15px",
//         color: "#ffffff",
//         align: "center",
//         wordWrap: { width: btnW - 20 }
//       }).setOrigin(0.5).setScrollFactor(0);

//       // interactive area (invisible)
//       const hit = this.scene.add.rectangle(cx, cy, btnW, 36, 0x000000, 0)
//         .setOrigin(0.5).setInteractive({ useHandCursor: true }).setScrollFactor(0);

//       const onSelect = () => {
//         // apply points if present
//         const pts = choice.points || choice.sdgPoints || 0;
//         if (pts) {
//           this.sdgPointsObj.points += pts;
//           addSDGPoints(pts);
//           emit("updateSDGPoints", this.sdgPointsObj.points);
//         }

//         // choose next
//         if (choice.next) {
//           // allow next as key string or numeric index
//           if (typeof choice.next === "string") {
//             // find dialogue by key
//             // startDialogue will reset index; avoid nested calls if next == current
//             this.startDialogue(choice.next);
//             return;
//           } else if (typeof choice.next === "number") {
//             this.currentIndex = choice.next;
//             this._showCurrent();
//             return;
//           }
//         }

//         // default: advance or end
//         this.endDialogue();
//       };

//       hit.on("pointerdown", onSelect);

//       // hover feedback
//       hit.on("pointerover", () => {
//         g.clear();
//         g.fillStyle(0x6d28d9, 1);
//         g.fillRoundedRect(cx - btnW / 2, cy - 18, btnW, 36, 8);
//         g.lineStyle(1, 0xffffff, 0.08);
//         g.strokeRoundedRect(cx - btnW / 2, cy - 18, btnW, 36, 8);
//         txt.setStyle({ color: "#fff" });
//       });
//       hit.on("pointerout", () => {
//         g.clear();
//         g.fillStyle(0x4f46e5, 1);
//         g.fillRoundedRect(cx - btnW / 2, cy - 18, btnW, 36, 8);
//         g.lineStyle(1, 0xffffff, 0.06);
//         g.strokeRoundedRect(cx - btnW / 2, cy - 18, btnW, 36, 8);
//         txt.setStyle({ color: "#ffffff" });
//       });

//       // add to container list for cleanup
//       this.choicesContainer.add([g, txt, hit]);
//       this.choices.push({ g, txt, hit });
//     });
//   }

//   _clearChoices() {
//     if (!this.choices || this.choices.length === 0) return;
//     this.choices.forEach(({ g, txt, hit }) => {
//       hit.removeAllListeners();
//       hit.destroy();
//       txt.destroy();
//       g.destroy();
//     });
//     this.choices = [];
//     this.choicesContainer.removeAll(true);
//   }

//   // keyboard handler
//   _onKeyDown(event) {
//     if (!this.dialogueVisible) return;

//     // Skip typewriter or advance
//     if (event.code === "Space" || event.code === "Enter" || event.key.toLowerCase() === "f") {
//       if (this._isTyping) {
//         // skip typewriter
//         this._skipRequested = true;
//       } else {
//         // if choices visible, ignore - user must pick
//         if (this.choices.length === 0) {
//           this.currentIndex++;
//           if (this.currentIndex < this.currentDialogue.length) {
//             this._showCurrent();
//           } else {
//             this.endDialogue();
//           }
//         }
//       }
//     }

//     // Q/E quick pick (first two choices)
//     if (event.key.toLowerCase() === "q") {
//       if (this.choices.length >= 1) {
//         this.choices[0].hit.emit("pointerdown");
//       }
//     } else if (event.key.toLowerCase() === "e") {
//       if (this.choices.length >= 2) {
//         this.choices[1].hit.emit("pointerdown");
//       }
//     }
//   }

//   // reposition UI relative to camera (called on show & update)
//   _reposition(cam) {
//     // cam.midPoint is a Point; cam.height is viewport height.
//     const px = cam.midPoint.x;
//     const py = cam.height - this.panelHeight / 2 - 20;
//     // move underlying graphics by clearing/re-drawing or translate container
//     // We used absolute graphics positions; for simplicity, move container to 0,0 and keep bg drawn at absolute coordinates.
//     // So just ensure texts/buttons stay positioned relative to screen:
//     // Update text and choice positions:
//     this.nameText.setPosition(this.panelX - this.panelWidth / 2 + 20, py - this.panelHeight / 2 + 18);
//     this.dialogueText.setPosition(this.panelX, py - 10);
//     this.continueIndicator.setPosition(this.panelX + this.panelWidth / 2 - 36, py + this.panelHeight / 2 - 28);
//     // choices are created with absolute positions; if screen resized you'd recreate choices on demand.
//   }

//   endDialogue() {
//     this.dialogueVisible = false;
//     this.container.setVisible(false);
//     this._clearChoices();

//     // cleanup keyboard handler
//     this.scene.input.keyboard.off("keydown", this._onKeyDown);
//     this.scene.events.emit("dialogueEnded");
//   }

//   update() {
//     // ensure bottom anchored (in case camera / size changed)
//     if (!this.dialogueVisible) return;
//     const cam = this.scene.cameras.main;
//     // keep dialogue panel drawn at screen bottom: we redraw bg each update to match any resizes
//     // (cheap because it's small) — if performance matters, optimize.
//     this.bg.clear();
//     this.bg.fillStyle(0x081029, 0.82);
//     this.bg.fillRoundedRect(this.panelX - this.panelWidth / 2, this.panelY - this.panelHeight / 2, this.panelWidth, this.panelHeight, 12);
//     this.bg.lineStyle(2, 0xffffff, 0.08);
//     this.bg.strokeRoundedRect(this.panelX - this.panelWidth / 2, this.panelY - this.panelHeight / 2, this.panelWidth, this.panelHeight, 12);

//     // keep UI elements in place
//     this._reposition(cam);
//   }

//   // safe destroy
//   _destroy() {
//     // remove timers/events and destroy objects
//     if (this.typeTimer) this.typeTimer.remove(false);
//     this._clearChoices();
//     this.scene.input.keyboard.off("keydown", this._onKeyDown);
//     try { this.container.destroy(true); } catch (e) {}
//     try { this.bg.destroy(); } catch (e) {}
//   }
// }




import Phaser from "phaser";
import { addSDGPoints } from "../../utils/sdgPoints.js";
import { emit } from "../../utils/eventBus.js";

export default class DialogueManager {
  constructor(scene, dialogueData = {}, sdgPointsObj = { points: 0 }) {
    this.scene = scene;
    this.dialogueData = dialogueData;
    this.sdgPointsObj = sdgPointsObj;

    // --- State ---
    this.currentDialogue = null;
    this.currentIndex = 0;
    this.dialogueVisible = false;
    this.typeTimer = null;
    this.choices = [];
    this._isTyping = false;
    this._skipRequested = false;

    // --- UI Configuration ---
    this.panelWidth = Math.round(this.scene.scale.width * 0.9);
    this.panelHeight = 100;
    this.panelX = Math.round(this.scene.scale.width / 2);
    this.panelY = this.scene.scale.height - (this.panelHeight / 2) - 90;

    // --- Create UI Elements ---
    this._createUI();

    // --- Input Handling ---
    this._onKeyDown = this._onKeyDown.bind(this);
    this.scene.events.on("destroy", this._destroy, this);

    // --- Initialize Keyboard Input ---
    this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  }

  _createUI() {
    // A single container to hold all UI elements. We only need to position this once.
    this.container = this.scene.add.container(this.panelX, this.panelY)
      .setDepth(1000)
      .setScrollFactor(0) // Anchors the UI to the camera
      .setVisible(false);

    // --- Dialogue Panel Background ---
    const bg = this.scene.add.graphics();
    // Positioned relative to the container's origin (0,0)
    bg.fillStyle(0x1A1A1A, 0.9); // Dark charcoal, high opacity
    bg.fillRoundedRect(-this.panelWidth / 2, -this.panelHeight / 2, this.panelWidth, this.panelHeight, 16);
    this.container.add(bg);

    // --- Speaker Name ---
    this.nameText = this.scene.add.text(-this.panelWidth / 2 + 30, -this.panelHeight / 2 + 25, "", {
      fontFamily: 'Arial, sans-serif',
      fontSize: "20px",
      color: "#E5E7EB", // Light gray
      fontStyle: "bold",
    }).setOrigin(0, 0.5);
    this.container.add(this.nameText);

    // --- Dialogue Text ---
    this.dialogueText = this.scene.add.text(0, 10, "", {
      fontFamily: 'Arial, sans-serif',
      fontSize: "18px",
      color: "#FFFFFF",
      align: "center",
      wordWrap: { width: this.panelWidth - 60 },
      lineSpacing: 6,
    }).setOrigin(0.5);
    this.container.add(this.dialogueText);

    // --- Continue Indicator (simple blinking line) ---
    this.continueIndicator = this.scene.add.graphics()
      .fillStyle(0xFFFFFF, 0.8)
      .fillRect(this.panelWidth / 2 - 35, this.panelHeight / 2 - 30, 15, 4)
      .setVisible(false);
    this.container.add(this.continueIndicator);

    this.scene.tweens.add({
      targets: this.continueIndicator,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  startDialogue(keyOrNode) {
    const node = typeof keyOrNode === "string" ? this.dialogueData?.[keyOrNode] : keyOrNode;
    if (!node || !Array.isArray(node)) {
      console.warn(`[DialogueManager] Dialogue node not found: ${keyOrNode}`);
      return;
    }

    this.currentDialogue = node;
    this.currentIndex = 0;
    this.dialogueVisible = true;
    this.container.setVisible(true);

    // Attach global key handler
    this.scene.input.keyboard.on("keydown", this._onKeyDown);
    this._showCurrent();
  }

  _showCurrent() {
    const entry = this.currentDialogue?.[this.currentIndex];
    if (!entry) {
      return this.endDialogue();
    }

    this.nameText.setText(entry.character || "Abang");
    this.continueIndicator.setVisible(false);
    this._clearChoices();

    this._startTypewriter(entry.text || "");
    this._pendingChoices = Array.isArray(entry.choices) ? entry.choices : null;
  }

  _startTypewriter(fullText = "") {
    if (this.typeTimer) this.typeTimer.remove();

    this.dialogueText.setText("");
    this._isTyping = true;
    this._skipRequested = false;
    let charIndex = 0;

    this.typeTimer = this.scene.time.addEvent({
      delay: 30,
      repeat: fullText.length - 1,
      callback: () => {
        if (this._skipRequested) {
          this.dialogueText.setText(fullText);
          this.typeTimer.remove();
          this._onTypeComplete(fullText);
          return;
        }
        this.dialogueText.setText(this.dialogueText.text + fullText[charIndex]);
        charIndex++;
        if (charIndex === fullText.length) {
          this._onTypeComplete(fullText);
        }
      },
    });
  }

  _onTypeComplete(fullText) {
    if (this.typeTimer) this.typeTimer.remove();
    this.dialogueText.setText(fullText); // Ensure full text is displayed
    this._isTyping = false;

    if (this._pendingChoices) {
      this._createChoices(this._pendingChoices);
      this._pendingChoices = null;
    } else {
      this.continueIndicator.setVisible(true);
    }
  }

  _createChoices(choicesData = []) {
    this._clearChoices();
    this.continueIndicator.setVisible(false); // Hide "continue" when choices are shown

    // --- Layout Constants ---
    const buttonWidth = 320; // Width of a single choice button
    const buttonHeight = 50;
    const choiceGap = 50;   // Horizontal space between the two choices
    const choiceY = this.panelHeight / 2 + 60; // Vertical position, below the dialogue panel
    const indicatorRadius = 15; // The size of the Q/E circle

    // --- Key Mapping ---
    // Maps the choice index to a specific key and letter
    const keyMap = {
      0: { key: 'Q', keyCode: this.keyQ },
      1: { key: 'E', keyCode: this.keyE }
    };

    choicesData.forEach((choice, index) => {
      // This layout is designed for 2 choices (Q and E). It will ignore any others.
      if (index > 1) return;

      // --- Calculate position for each button ---
      // sign will be -1 for the first choice (left) and 1 for the second (right)
      const sign = index === 0 ? -1 : 1;
      const buttonX = sign * (buttonWidth / 2 + choiceGap / 2);

      // --- 1. Key Indicator (Circle + Text) ---
      // Position the indicator to the left of the button
      const indicatorX = buttonX - (buttonWidth / 2) - indicatorRadius - 15;

      const keyCircle = this.scene.add.graphics()
        .fillStyle(0xFFFFFF, 1) // White circle
        .fillCircle(indicatorX, choiceY, indicatorRadius);

      const keyText = this.scene.add.text(indicatorX, choiceY, keyMap[index].key, {
        fontFamily: 'Arial, sans-serif',
        fontSize: "18px",
        color: "#000000", // Black text
        fontStyle: 'bold'
      }).setOrigin(0.5);


      // --- 2. Button Background ---
      const bg = this.scene.add.graphics()
        .fillStyle(0x373737, 1) // Dark gray
        .fillRoundedRect(buttonX - buttonWidth / 2, choiceY - buttonHeight / 2, buttonWidth, buttonHeight, 12).setScrollFactor(0);;


      // --- 3. Button Text ---
      const txt = this.scene.add.text(buttonX, choiceY, choice.text, {
        fontFamily: 'Arial, sans-serif',
        fontSize: "16px",
        color: "#FFFFFF",
      }).setOrigin(0.5).setScrollFactor(0);


      // --- 4. Interactive Zone ---
      const hitArea = this.scene.add.zone(buttonX, choiceY, buttonWidth, buttonHeight)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true }).setScrollFactor(0);;


      // Add all created elements to the main container
      this.container.add([bg, txt, hitArea, keyCircle, keyText]);

      // --- Event Handlers (Mouse) ---
      hitArea.on("pointerdown", () => this._handleChoice(choice));

      hitArea.on("pointerover", () => {
        this.scene.tweens.add({ targets: [bg, txt], scale: 1.05, duration: 150, ease: 'Sine.easeInOut' });
      });

      hitArea.on("pointerout", () => {
        this.scene.tweens.add({ targets: [bg, txt], scale: 1, duration: 150, ease: 'Sine.easeInOut' });
      });

      // --- Event Handlers (Keyboard) ---
      const keyObject = keyMap[index].keyCode;
      if (keyObject) {
        // When the key is pressed, trigger the same choice handler
        keyObject.on('down', () => this._handleChoice(choice));
      }

      // Store all GameObjects so they can be easily destroyed later
      this.choices.push({ bg, txt, hitArea, keyCircle, keyText });
    });
  }

  _handleChoice(choice) {
    if (choice.points || choice.sdgPoints) {
      const pts = choice.points || choice.sdgPoints;
      addSDGPoints(pts);
      emit("updateSDGPoints", this.sdgPointsObj.points + pts);
    }

    if (choice.next) {
      this.startDialogue(choice.next);
    } else {
      this.endDialogue();
    }
  }

  // _clearChoices() {
  //   this.choices.forEach(c => {
  //     c.bg.destroy();
  //     c.txt.destroy();
  //     c.hitArea.destroy();
  //   });
  //   this.choices = [];
  // }

  _clearChoices() {
    // This part destroys the visible button elements
    this.choices.forEach(choice => {
      choice.bg.destroy();
      choice.txt.destroy();
      choice.hitArea.destroy();
      choice.keyCircle.destroy(); // Destroy the new circle
      choice.keyText.destroy();   // Destroy the new text
    });
    this.choices = [];

    // --- IMPORTANT: Remove keyboard listeners ---
    this.keyQ.removeAllListeners('down');
    this.keyE.removeAllListeners('down');
  }


  _onKeyDown(event) {
    if (!this.dialogueVisible) return;

    // Use Space or Enter to advance/skip
    if (event.code === "Space" || event.code === "Enter") {
      if (this._isTyping) {
        this._skipRequested = true; // Skip typewriter
      } else if (this.choices.length === 0) {
        // Advance to next line if there are no choices
        this.currentIndex++;
        this._showCurrent();
      }
    }
  }

  endDialogue() {
    this.dialogueVisible = false;
    this.container.setVisible(false);
    this._clearChoices();

    if (this.typeTimer) this.typeTimer.remove();

    this.scene.input.keyboard.off("keydown", this._onKeyDown);
    this.scene.events.emit("dialogueEnded", this.currentDialogue);
  }

  _destroy() {
    if (this.typeTimer) this.typeTimer.remove();
    this._clearChoices();
    if (this.container) this.container.destroy();
    this.scene.input.keyboard.off("keydown", this._onKeyDown);
  }
}