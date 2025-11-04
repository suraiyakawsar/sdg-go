// import Phaser from "phaser";
// import { addSDGPoints } from "../../utils/sdgPoints.js";
// import { emit } from "../../utils/eventBus";

// export default class DialogueManager {
//   constructor(scene, dialogueData = {}, sdgPointsObj = { points: 0 }) {
//     this.scene = scene;
//     this.dialogueScript = dialogueData;
//     this.sdgPointsObj = sdgPointsObj;

//     // --- UI / Layout params (responsive to scene.scale) ---
//     this.gameWidth = () => this.scene.scale.width || 1140;
//     this.gameHeight = () => this.scene.scale.height || 540;
//     this.dialogueIndex = 0;
//     this.currentDialogue = null;
//     this.currentDialogueKey = null;

//     // State
//     this.dialogueVisible = false;
//     this.dialogueFinished = false;
//     this.choiceButtons = []; // array of {bg, text}
//     this.isTyping = false;
//     this.currentText = "";
//     this.typewriterSpeed = 30; // ms per char
//     this.typewriterEvent = null;
//     this.typewriterSkipRequested = false;

//     // target (where the bubble should sit) — default near top-center
//     this.targetPosition = { x: Math.round(this.gameWidth() / 2), y: 150 };

//     // create UI
//     this._createBaseUI();

//     // input handlers (added/removed when showing/hiding UI)
//     this._onKeyDown = this._onKeyDown.bind(this);
//     this._onPointerDown = this._onPointerDown.bind(this);
//   }

//   // ------------ UI Construction ------------
//   _createBaseUI() {
//     // Parent container
//     this.dialogueContainer = this.scene.add.container(0, 0).setDepth(10000).setVisible(false).setAlpha(0);
//     this.dialogueContainer.setScrollFactor(0);

//     // Panel sizes relative to screen
//     const panelW = Math.round(Math.min(1000, this.gameWidth() * 0.9));
//     const panelH = 180;

//     // Background (9-slice if available, fallback to rectangle)
//     if (this.scene.add.nineslice && this.scene.textures.exists("ui_dialogue_box")) {
//       this.dialogueBubble = this.scene.add.nineslice(0, 0, panelW, panelH, "ui_dialogue_box", 16, 16, 16, 16);
//       this.dialogueBubble.setOrigin(0.5);
//     } else {
//       this.dialogueBubble = this.scene.add
//         .rectangle(0, 0, panelW, panelH, 0x000000, 0.75)
//         .setOrigin(0.5);
//     }
//     // border tint for a subtle purple outline if possible
//     if (this.dialogueBubble.setStrokeStyle) this.dialogueBubble.setStrokeStyle(2, 0x5b21b6);

//     // Portrait placeholder (created as image or circle later)
//     this.avatarContainer = this.scene.add.container(-panelW / 2 + 90, 0);

//     // Name + text
//     this.nameText = this.scene.add.text(-panelW / 2 + 170, -panelH / 2 + 18, "", {
//       fontFamily: "Arial",
//       fontSize: "20px",
//       color: "#C4B5FD",
//       fontStyle: "bold",
//     }).setOrigin(0, 0.5);

//     this.dialogueText = this.scene.add.text(-panelW / 2 + 170, -panelH / 2 + 44, "", {
//       fontFamily: "pixelFont" in document ? "pixelFont" : "Arial",
//       fontSize: "18px",
//       color: "#FFFFFF",
//       wordWrap: { width: panelW - 260 },
//       lineSpacing: 6,
//       align: "left",
//     }).setOrigin(0, 0);

//     // Continue indicator (small arrow or triangle)
//     if (this.scene.textures.exists("ui_arrow_down")) {
//       this.continueIndicator = this.scene.add.image(panelW / 2 - 28, panelH / 2 - 20, "ui_arrow_down").setScale(0.09).setAlpha(0.85).setVisible(false);
//     } else {
//       // fallback small triangle using graphics
//       const tri = this.scene.add.triangle(panelW / 2 - 28, panelH / 2 - 20, 0, 0, 8, 0, 4, 8, 0xffffff);
//       tri.setVisible(false);
//       this.continueIndicator = tri;
//     }

//     // Choice container (so clearing is easy)
//     this.choicesContainer = this.scene.add.container(0, panelH / 2 + 34);

//     // Add to parent container
//     this.dialogueContainer.add([this.dialogueBubble, this.avatarContainer, this.nameText, this.dialogueText, this.continueIndicator, this.choicesContainer]);

//     // Idle tween for continue indicator
//     if (this.continueIndicator) {
//       this.scene.tweens.add({
//         targets: this.continueIndicator,
//         y: this.continueIndicator.y + 6,
//         duration: 600,
//         ease: "Sine.easeInOut",
//         yoyo: true,
//         repeat: -1,
//       });
//     }
//   }

//   // safe avatar setter (key can be texture key or null)
//   _setAvatar(avatarKey, displaySize = 96) {
//     // clear previous avatar children
//     this.avatarContainer.removeAll(true);

//     if (avatarKey && this.scene.textures.exists(avatarKey)) {
//       const img = this.scene.add.image(0, 0, avatarKey).setDisplaySize(displaySize, displaySize).setOrigin(0.5);
//       // circular mask fallback: just use size; depending on texture shape, you might add a mask here
//       this.avatarContainer.add(img);
//     } else {
//       // fallback: colored circle
//       const circle = this.scene.add.circle(0, 0, displaySize / 2, 0x7b2cbf);
//       this.avatarContainer.add(circle);
//     }
//   }

//   // ------------ Dialogue control / flow ------------
//   // key can be a key to dialogueScript OR a direct node (object)
//   startDialogue(keyOrNode, playerX, playerY) {
//     // if user passes a key referencing dialogueScript
//     if (typeof keyOrNode === "string") {
//       const node = this.dialogueScript?.[keyOrNode];
//       if (!node) {
//         console.warn("[DialogueManager] startDialogue: no dialogue found for key", keyOrNode);
//         return;
//       }
//       this.currentDialogueKey = keyOrNode;
//       this.currentDialogue = node;
//     } else if (typeof keyOrNode === "object" && keyOrNode !== null) {
//       // direct node (for NPC dynamic dialogues)
//       this.currentDialogueKey = null;
//       this.currentDialogue = keyOrNode;
//     } else {
//       console.warn("[DialogueManager] startDialogue invalid argument:", keyOrNode);
//       return;
//     }

//     this.dialogueIndex = 0;
//     this.dialogueFinished = false;

//     // position
//     if (playerX !== undefined && playerY !== undefined) {
//       this.setTargetPosition(playerX, playerY);
//     } else {
//       this.targetPosition.x = Math.round(this.gameWidth() / 2);
//       this.targetPosition.y = 150;
//       this.updateContainerPosition();
//     }

//     this.showUI(true);
//     this.showCurrentLine();
//   }

//   // for NPC-styled single node dialog
//   startDialogueFromNPC(node, npcX, npcY) {
//     this.startDialogue(node, npcX, npcY);
//   }

//   showCurrentLine() {
//     if (!this.currentDialogue) return this.endDialogue();

//     const line = this.currentDialogue[this.dialogueIndex];
//     if (!line) return this.endDialogue();

//     // set name & avatar (allow optional fields)
//     this.nameText.setText(line.character || line.speaker || "");
//     if (line.avatarKey) this._setAvatar(line.avatarKey);
//     else this._setAvatar(line.avatar || null);

//     // position content
//     this.updateContainerPosition();

//     // reset choices & indicator
//     this.clearChoices();
//     this.continueIndicator.setVisible(false);

//     // start typewriter
//     this._startTypewriter(line.text || "");

//     // if choices exist, schedule them after text finished OR create immediately if no typing
//     if (Array.isArray(line.choices) && line.choices.length > 0) {
//       // create after typing completes; the typewriter will call _onLineComplete
//       this._pendingChoices = line.choices;
//     } else {
//       this._pendingChoices = null;
//       // if last line and no choices, auto-end after a small delay
//       if (this.dialogueIndex === (this.currentDialogue.length - 1) && !line.choices) {
//         // end after a short pause once typing completes (handled in _onLineComplete)
//       }
//     }
//   }

//   // ------------ Typewriter ------------
//   _startTypewriter(fullText) {
//     // cancel previous event
//     if (this.typewriterEvent) {
//       this.typewriterEvent.remove(false);
//       this.typewriterEvent = null;
//     }
//     this.isTyping = true;
//     this.currentText = "";
//     this.dialogueText.setText("");
//     this.typewriterSkipRequested = false;

//     let i = 0;
//     this.typewriterEvent = this.scene.time.addEvent({
//       delay: this.typewriterSpeed,
//       callback: () => {
//         // safety: if no text or index overflow, finalize
//         if (i >= fullText.length) {
//           this._onLineComplete();
//           return;
//         }
//         this.currentText += fullText[i];
//         this.dialogueText.setText(this.currentText);
//         i++;
//         // if skip requested, flush immediately
//         if (this.typewriterSkipRequested) {
//           this.dialogueText.setText(fullText);
//           this._onLineComplete();
//         }
//       },
//       callbackScope: this,
//       loop: true,
//     });
//   }

//   _onLineComplete() {
//     // cleanup timer
//     if (this.typewriterEvent) {
//       this.typewriterEvent.remove(false);
//       this.typewriterEvent = null;
//     }
//     this.isTyping = false;
//     this.continueIndicator.setVisible(true);

//     // if choices were pending, create them now
//     if (this._pendingChoices) {
//       this.createChoices(this._pendingChoices);
//       this._pendingChoices = null;
//       return;
//     }

//     // if this is the last line and no choices, auto-end with a delay
//     const line = this.currentDialogue[this.dialogueIndex];
//     if (!line?.choices && this.dialogueIndex === (this.currentDialogue.length - 1)) {
//       this.scene.time.delayedCall(600, () => this.endDialogue());
//     }
//   }

//   // Skip current typing and reveal full text (trigger choices if any)
//   skipTypewriter() {
//     if (!this.isTyping) return;
//     this.typewriterSkipRequested = true;
//   }

//   // Advance to next line (or skip typing)
//   nextDialogue() {
//     if (this.isTyping) {
//       this.skipTypewriter();
//       return;
//     }

//     const line = this.currentDialogue?.[this.dialogueIndex];
//     if (line?.choices) {
//       // if choices visible, do nothing — they handle progression
//       return;
//     }

//     // move to next
//     this.dialogueIndex++;
//     if (this.dialogueIndex < this.currentDialogue.length) {
//       this.showCurrentLine();
//     } else {
//       this.endDialogue();
//     }
//   }

//   // ------------ Choices (consistent layout) ------------
//   createChoices(choices = []) {
//     this.clearChoices();
//     if (!Array.isArray(choices) || choices.length === 0) return;

//     // layout vars
//     const maxPerRow = 3;
//     const buttonW = Math.min(220, Math.round(this.gameWidth() * 0.18));
//     const buttonH = 40;
//     const spacing = 16;

//     // split rows
//     const rows = [];
//     for (let i = 0; i < choices.length; i += maxPerRow) rows.push(choices.slice(i, i + maxPerRow));

//     rows.forEach((rowChoices, rowIndex) => {
//       const rowContainer = this.scene.add.container(0, rowIndex * (buttonH + 12));
//       // compute startX to center row
//       const totalWidth = rowChoices.length * (buttonW + spacing) - spacing;
//       const startX = -Math.round(totalWidth / 2);

//       rowChoices.forEach((choice, idx) => {
//         const x = startX + idx * (buttonW + spacing);
//         // background (9-slice fallback to rounded rectangle)
//         let bg;
//         if (this.scene.add.nineslice && this.scene.textures.exists("ui_button")) {
//           bg = this.scene.add.nineslice(x + buttonW / 2, 0, buttonW, buttonH, "ui_button", 8, 8, 8, 8);
//         } else {
//           bg = this.scene.add.rectangle(x + buttonW / 2, 0, buttonW, buttonH, 0x3c6eff, 0.95).setOrigin(0.5);
//         }
//         bg.setInteractive({ useHandCursor: true });
//         // text
//         const txt = this.scene.add.text(x + buttonW / 2, 0, choice.text, {
//           fontFamily: "pixelFont" in document ? "pixelFont" : "Arial",
//           fontSize: "14px",
//           color: "#ffffff",
//           align: "center",
//           wordWrap: { width: buttonW - 10 }
//         }).setOrigin(0.5);

//         // hover visuals
//         bg.on("pointerover", () => {
//           if (bg.setFillStyle) bg.setFillStyle(0x5a8cff, 0.98);
//           else if (bg.setTint) bg.setTint(0x5a8cff);
//         });
//         bg.on("pointerout", () => {
//           if (bg.setFillStyle) bg.setFillStyle(0x3c6eff, 0.95);
//           else if (bg.clearTint) bg.clearTint();
//         });

//         const onChoose = () => {
//           // local handlers should be safe
//           this._onChoiceSelected(choice);
//         };
//         bg.on("pointerdown", onChoose);
//         txt.setInteractive({ useHandCursor: true }).on("pointerdown", onChoose);

//         rowContainer.add([bg, txt]);
//         this.choiceButtons.push({ bg, txt });
//       });

//       this.choicesContainer.add(rowContainer);
//     });
//   }

//   _onChoiceSelected(choice) {
//     // destroy choices & animate
//     this.clearChoices();
//     this._animateChoiceSelection();

//     // points
//     const points = choice.points || choice.sdgPoints || 0;
//     if (points) this.applySDGPoints(points);

//     // proceed after a short delay
//     this.scene.time.delayedCall(200, () => {
//       const next = choice.next;
//       if (!next || next === "close" || next === "end") {
//         this.endDialogue();
//         return;
//       }
//       if (next === "nextChapter") {
//         if (this.scene.nextZone) {
//           this.scene.nextZone.setVisible(true);
//           this.scene.nextZoneVisible = true;
//         }
//         this.endDialogue();
//         return;
//       }
//       // treat next as a key into dialogueScript
//       this.startDialogue(next);
//     });
//   }

//   // ------------ Visual feedback ------------
//   _animateChoiceSelection() {
//     this.scene.tweens.add({
//       targets: [this.dialogueBubble, this.dialogueText],
//       scaleX: 1.06,
//       scaleY: 1.06,
//       duration: 140,
//       ease: "Power2",
//       yoyo: true,
//     });
//   }

//   showFeedback(points) {
//     const message = points > 0 ? `+${points} SDG Points! ✨` : "Maybe next time!";
//     const color = points > 0 ? "#2ecc71" : "#e74c3c";
//     const feedback = this.scene.add.text(this.targetPosition.x, this.targetPosition.y - 80, message, {
//       fontSize: "16px",
//       color,
//       fontStyle: "bold",
//       fontFamily: "Arial",
//     }).setOrigin(0.5).setScrollFactor(0).setAlpha(0);

//     this.scene.tweens.add({
//       targets: feedback,
//       y: feedback.y - 30,
//       alpha: 1,
//       duration: 400,
//       ease: "Back.easeOut",
//     });
//     this.scene.tweens.add({
//       targets: feedback,
//       y: feedback.y - 50,
//       alpha: 0,
//       duration: 400,
//       delay: 600,
//       onComplete: () => feedback.destroy(),
//     });
//   }

//   applySDGPoints(points) {
//     this.sdgPointsObj.points += points;
//     const total = addSDGPoints(points);
//     emit("updateSDGPoints", total);
//   }

//   // ------------ Utility & cleanup ------------
//   clearChoices() {
//     if (this.choiceButtons.length === 0 && this.choicesContainer.list.length === 0) return;
//     // destroy each element inside choicesContainer
//     this.choicesContainer.removeAll(true);
//     this.choiceButtons.forEach(({ bg, txt }) => {
//       if (bg && bg.destroy) bg.destroy();
//       if (txt && txt.destroy) txt.destroy();
//     });
//     this.choiceButtons = [];
//   }

//   showUI(visible) {
//     this.dialogueContainer.setVisible(visible);
//     if (visible) {
//       this.dialogueContainer.setAlpha(0).setScale(0.96);
//       this.scene.tweens.add({
//         targets: this.dialogueContainer,
//         alpha: 1,
//         scaleX: 1,
//         scaleY: 1,
//         duration: 220,
//         ease: "Back.easeOut",
//       });
//       // enable input handlers
//       this.scene.input.keyboard.on("keydown", this._onKeyDown);
//       this.scene.input.on("pointerdown", this._onPointerDown);
//       this.dialogueVisible = true;
//     } else {
//       // remove handlers
//       this.scene.input.keyboard.off("keydown", this._onKeyDown);
//       this.scene.input.off("pointerdown", this._onPointerDown);
//       this.dialogueVisible = false;
//     }
//   }

//   endDialogue() {
//     // stop any typing
//     if (this.typewriterEvent) {
//       this.typewriterEvent.remove(false);
//       this.typewriterEvent = null;
//     }
//     // hide UI with tween
//     this.scene.tweens.add({
//       targets: this.dialogueContainer,
//       alpha: 0,
//       scaleX: 0.9,
//       scaleY: 0.9,
//       duration: 240,
//       ease: "Power2",
//       onComplete: () => {
//         this.dialogueContainer.setVisible(false);
//         this.clearChoices();
//         this.dialogueFinished = true;
//         this.dialogueVisible = false;
//         // remove handlers (in case)
//         try {
//           this.scene.input.keyboard.off("keydown", this._onKeyDown);
//           this.scene.input.off("pointerdown", this._onPointerDown);
//         } catch (e) {}
//         // emit event
//         if (this.scene && this.scene.events) this.scene.events.emit("dialogueEnded", { key: this.currentDialogueKey });
//       },
//     });
//   }

//   updateContainerPosition() {
//     // center on target pos and keep bubble inside screen horizontally
//     const pw = Math.round(Math.min(1000, this.gameWidth() * 0.9));
//     const ph = 180;
//     const clampX = Phaser.Math.Clamp(this.targetPosition.x, Math.round(pw / 2) + 8, Math.round(this.gameWidth() - pw / 2) - 8);
//     const clampY = Phaser.Math.Clamp(this.targetPosition.y, Math.round(ph / 2) + 8, Math.round(this.gameHeight() - ph / 2) - 8);

//     this.dialogueContainer.setPosition(clampX, clampY);

//     // update bubble dimensions if needed
//     if (this.dialogueBubble.setSize) {
//       // only if nineslice supports resizing; keep origin 0.5
//     }

//     // reposition things inside the container relative to bubble size:
//     // avatarContainer already placed relative to bubble center during create
//     // continue indicator placed relative to bubble size
//   }

//   setTargetPosition(entityX, entityY) {
//     // place bubble a bit above entity
//     const offsetY = 110;
//     let bx = Math.round(entityX);
//     let by = Math.round(entityY - offsetY);
//     // clamp to viewport
//     bx = Phaser.Math.Clamp(bx, 60, this.gameWidth() - 60);
//     by = Phaser.Math.Clamp(by, 60, this.gameHeight() - 60);
//     this.targetPosition.x = bx;
//     this.targetPosition.y = by;
//     this.updateContainerPosition();
//   }

//   // Input handlers
//   _onKeyDown(event) {
//     if (!this.dialogueVisible) return;
//     const code = event.code;
//     if (code === "Space" || code === "Enter") {
//       // advance or skip
//       this.nextDialogue();
//     } else if (code === "Escape") {
//       this.endDialogue();
//     }
//   }

//   _onPointerDown(pointer) {
//     if (!this.dialogueVisible) return;
//     // ignore clicks on interactive children (they have their own handlers)
//     const hit = this.scene.input.manager.hitTest(pointer, this.scene.children.list, this.scene.cameras.main);
//     // hitTest returns array of game objects under pointer; if any are interactive, skip
//     if (hit && hit.length > 0) {
//       // if click is on UI background or container itself (non-interactive) we treat it as advance
//       const interactiveFound = hit.some(go => go.input && go.input.enabled && go.input.draggable !== true);
//       if (interactiveFound) return; // let the child's handler run
//     }
//     // otherwise, advance (skip if typing)
//     if (this.isTyping) this.skipTypewriter();
//     else this.nextDialogue();
//   }

//   // call every frame from scene.update if you want to follow player
//   update(playerX, playerY) {
//     if (this.dialogueVisible && playerX !== undefined && playerY !== undefined) {
//       this.setTargetPosition(playerX, playerY);
//     }
//   }

//   // destroy everything
//   destroy() {
//     try {
//       this.clearChoices();
//       if (this.dialogueContainer) this.dialogueContainer.destroy(true);
//     } catch (e) {}
//   }
// }



















// // src/game/objects/DialogueManager.js
// import Phaser from "phaser";
// import { addSDGPoints } from "../../utils/sdgPoints.js";
// import { emit } from "../../utils/eventBus.js";

// export default class DialogueManager {
//   constructor(scene, dialogueData = {}, sdgPointsObj = { points: 0 }) {
//     this.scene = scene;
//     this.dialogueScript = dialogueData;
//     this.sdgPointsObj = sdgPointsObj;

//     // Layout
//     this.gameWidth = () => this.scene.scale.width || 1140;
//     this.gameHeight = () => this.scene.scale.height || 540;

//     // State
//     this.dialogueIndex = 0;
//     this.currentDialogue = null;
//     this.currentDialogueKey = null;
//     this.dialogueVisible = false;
//     this.dialogueFinished = false;
//     this.choiceButtons = [];
//     this.isTyping = false;
//     this.currentText = "";
//     this.typewriterSpeed = 30;
//     this.typewriterEvent = null;
//     this.typewriterSkipRequested = false;
//     this._pendingChoices = null;

//     // Default dialogue bubble target
//     this.targetPosition = { x: Math.round(this.gameWidth() / 2), y: 150 };

//     // Create base UI
//     this._createBaseUI();

//     // Input bindings
//     this._onKeyDown = this._onKeyDown.bind(this);
//     this._onPointerDown = this._onPointerDown.bind(this);
//   }

//   // ----------------- UI CREATION -----------------
//   _createBaseUI() {
//     this.dialogueContainer = this.scene.add.container(0, 0)
//       .setDepth(10000)
//       .setVisible(false)
//       .setAlpha(0)
//       .setScrollFactor(0);

//     const panelW = Math.min(1000, this.gameWidth() * 0.9);
//     const panelH = 180;

//     // Background
//     this.dialogueBubble = this.scene.add.nineslice
//       ? this.scene.add.nineslice(0, 0, panelW, panelH, "ui_dialogue_box", 16, 16, 16, 16)
//       : this.scene.add.rectangle(0, 0, panelW, panelH, 0x000000, 0.75);

//     this.dialogueBubble.setOrigin(0.5);
//     if (this.dialogueBubble.setStrokeStyle) this.dialogueBubble.setStrokeStyle(2, 0x5b21b6);

//     // Avatar, name, text
//     this.avatarContainer = this.scene.add.container(-panelW / 2 + 90, 0);
//     this.nameText = this.scene.add.text(-panelW / 2 + 170, -panelH / 2 + 18, "", {
//       fontFamily: "Arial",
//       fontSize: "20px",
//       color: "#C4B5FD",
//       fontStyle: "bold"
//     }).setOrigin(0, 0.5);

//     this.dialogueText = this.scene.add.text(-panelW / 2 + 170, -panelH / 2 + 44, "", {
//       fontFamily: "pixelFont" in document ? "pixelFont" : "Arial",
//       fontSize: "18px",
//       color: "#FFFFFF",
//       wordWrap: { width: panelW - 260 },
//       lineSpacing: 6
//     }).setOrigin(0, 0);

//     // Continue arrow
//     this.continueIndicator = this.scene.textures.exists("ui_arrow_down")
//       ? this.scene.add.image(panelW / 2 - 28, panelH / 2 - 20, "ui_arrow_down").setScale(0.09).setAlpha(0.85)
//       : this.scene.add.triangle(panelW / 2 - 28, panelH / 2 - 20, 0, 0, 8, 0, 4, 8, 0xffffff);

//     this.continueIndicator.setVisible(false);
//     this.choicesContainer = this.scene.add.container(0, panelH / 2 + 34);

//     this.dialogueContainer.add([
//       this.dialogueBubble,
//       this.avatarContainer,
//       this.nameText,
//       this.dialogueText,
//       this.continueIndicator,
//       this.choicesContainer
//     ]);

//     // Idle bounce
//     this.scene.tweens.add({
//       targets: this.continueIndicator,
//       y: this.continueIndicator.y + 6,
//       duration: 600,
//       ease: "Sine.easeInOut",
//       yoyo: true,
//       repeat: -1
//     });
//   }

//   _setAvatar(avatarKey, displaySize = 96) {
//     this.avatarContainer.removeAll(true);
//     if (avatarKey && this.scene.textures.exists(avatarKey)) {
//       const img = this.scene.add.image(0, 0, avatarKey)
//         .setDisplaySize(displaySize, displaySize)
//         .setOrigin(0.5);
//       this.avatarContainer.add(img);
//     } else {
//       this.avatarContainer.add(this.scene.add.circle(0, 0, displaySize / 2, 0x7b2cbf));
//     }
//   }

//   updateContainerPosition() {
//     this.dialogueContainer.setPosition(this.targetPosition.x, this.targetPosition.y);
//   }

//   setTargetPosition(x, y) {
//     this.targetPosition.x = x;
//     this.targetPosition.y = y - 80;
//     this.updateContainerPosition();
//   }

//   // ----------------- FLOW -----------------
//   startDialogue(keyOrNode, playerX, playerY) {
//     const node = typeof keyOrNode === "string"
//       ? this.dialogueScript?.[keyOrNode]
//       : keyOrNode;

//     if (!node) {
//       console.warn("[DialogueManager] Invalid dialogue key or node:", keyOrNode);
//       return;
//     }

//     this.currentDialogue = node;
//     this.dialogueIndex = 0;
//     this.dialogueFinished = false;

//     if (playerX !== undefined && playerY !== undefined)
//       this.setTargetPosition(playerX, playerY);
//     else
//       this.updateContainerPosition();

//     this.showUI(true);
//     this.showCurrentLine();
//   }

//   startDialogueFromNPC(node, npcX, npcY) {
//     this.startDialogue(node, npcX, npcY);
//   }

//   showCurrentLine() {
//     if (!this.currentDialogue) return this.endDialogue();

//     const line = this.currentDialogue[this.dialogueIndex];
//     if (!line) return this.endDialogue();

//     this.nameText.setText(line.character || line.speaker || "");
//     this._setAvatar(line.avatarKey || line.avatar || null);
//     this.updateContainerPosition();
//     this.clearChoices();
//     this.continueIndicator.setVisible(false);

//     this._startTypewriter(line.text || "");
//     this._pendingChoices = Array.isArray(line.choices) ? line.choices : null;
//   }

//   // ----------------- TYPEWRITER -----------------
//   _startTypewriter(fullText) {
//     if (this.typewriterEvent) this.typewriterEvent.remove(false);

//     this.isTyping = true;
//     this.currentText = "";
//     this.dialogueText.setText("");
//     this.typewriterSkipRequested = false;

//     let i = 0;
//     this.typewriterEvent = this.scene.time.addEvent({
//       delay: this.typewriterSpeed,
//       callback: () => {
//         if (i >= fullText.length) return this._onLineComplete();
//         this.currentText += fullText[i];
//         this.dialogueText.setText(this.currentText);
//         i++;
//         if (this.typewriterSkipRequested) {
//           this.dialogueText.setText(fullText);
//           this._onLineComplete();
//         }
//       },
//       callbackScope: this,
//       loop: true,
//     });
//   }

//   _onLineComplete() {
//     if (this.typewriterEvent) this.typewriterEvent.remove(false);
//     this.isTyping = false;
//     this.continueIndicator.setVisible(true);

//     if (this._pendingChoices) {
//       this.createChoices(this._pendingChoices);
//       this._pendingChoices = null;
//     } else if (this.dialogueIndex === this.currentDialogue.length - 1) {
//       this.scene.time.delayedCall(600, () => this.endDialogue());
//     }
//   }

//   skipTypewriter() {
//     if (this.isTyping) this.typewriterSkipRequested = true;
//   }

//   nextDialogue() {
//     if (this.isTyping) return this.skipTypewriter();
//     const line = this.currentDialogue[this.dialogueIndex];
//     if (line?.choices) return;

//     this.dialogueIndex++;
//     if (this.dialogueIndex < this.currentDialogue.length) this.showCurrentLine();
//     else this.endDialogue();
//   }

//   // ----------------- CHOICES -----------------
//   createChoices(choices = []) {
//     this.clearChoices();
//     if (!choices.length) return;

//     const buttonW = Math.min(220, Math.round(this.gameWidth() * 0.18));
//     const buttonH = 40;
//     const spacing = 16;
//     const maxPerRow = 3;

//     const rows = [];
//     for (let i = 0; i < choices.length; i += maxPerRow)
//       rows.push(choices.slice(i, i + maxPerRow));

//     rows.forEach((rowChoices, rowIndex) => {
//       const rowContainer = this.scene.add.container(0, rowIndex * (buttonH + 12));
//       const totalWidth = rowChoices.length * (buttonW + spacing) - spacing;
//       const startX = -Math.round(totalWidth / 2);

//       rowChoices.forEach((choice, idx) => {
//         const x = startX + idx * (buttonW + spacing);
//         const bg = this.scene.add.rectangle(x + buttonW / 2, 0, buttonW, buttonH, 0x3c6eff, 0.95)
//           .setOrigin(0.5)
//           .setInteractive({ useHandCursor: true });

//         const txt = this.scene.add.text(x + buttonW / 2, 0, choice.text, {
//           fontFamily: "Arial",
//           fontSize: "14px",
//           color: "#ffffff",
//           align: "center",
//           wordWrap: { width: buttonW - 10 }
//         }).setOrigin(0.5);

//         bg.on("pointerover", () => bg.setFillStyle(0x5a8cff, 0.98));
//         bg.on("pointerout", () => bg.setFillStyle(0x3c6eff, 0.95));
//         const onChoose = () => this._onChoiceSelected(choice);

//         bg.on("pointerdown", onChoose);
//         txt.setInteractive({ useHandCursor: true }).on("pointerdown", onChoose);

//         rowContainer.add([bg, txt]);
//         this.choiceButtons.push({ bg, txt });
//       });

//       this.choicesContainer.add(rowContainer);
//     });
//   }

//   _onChoiceSelected(choice) {
//     this.clearChoices();
//     this._animateChoiceSelection();

//     const points = choice.points || choice.sdgPoints || 0;
//     if (points) this.applySDGPoints(points);

//     this.scene.time.delayedCall(200, () => {
//       const next = choice.next;
//       if (!next || next === "close" || next === "end") return this.endDialogue();
//       if (next === "nextChapter") {
//         if (this.scene.nextZone) this.scene.nextZone.setVisible(true);
//         return this.endDialogue();
//       }
//       this.startDialogue(next);
//     });
//   }

//   // ----------------- VISUALS -----------------
//   _animateChoiceSelection() {
//     this.scene.tweens.add({
//       targets: [this.dialogueBubble, this.dialogueText],
//       scaleX: 1.06,
//       scaleY: 1.06,
//       duration: 140,
//       ease: "Power2",
//       yoyo: true,
//     });
//   }

//   showFeedback(points) {
//     const message = points > 0 ? `+${points} SDG Points! ✨` : "Maybe next time!";
//     const color = points > 0 ? "#2ecc71" : "#e74c3c";

//     const feedback = this.scene.add.text(
//       this.targetPosition.x, this.targetPosition.y - 80,
//       message, { fontSize: "16px", color, fontStyle: "bold", fontFamily: "Arial" }
//     ).setOrigin(0.5).setScrollFactor(0).setAlpha(0);

//     this.scene.tweens.add({
//       targets: feedback,
//       y: feedback.y - 30,
//       alpha: 1,
//       duration: 400,
//       ease: "Back.easeOut",
//     });
//     this.scene.tweens.add({
//       targets: feedback,
//       y: feedback.y - 50,
//       alpha: 0,
//       duration: 400,
//       delay: 600,
//       onComplete: () => feedback.destroy(),
//     });
//   }

//   applySDGPoints(points) {
//     this.sdgPointsObj.points += points;
//     const total = addSDGPoints(points);
//     emit("updateSDGPoints", total);
//     this.showFeedback(points);
//   }

//   // ----------------- CLEANUP -----------------
//   clearChoices() {
//     this.choicesContainer.removeAll(true);
//     this.choiceButtons.forEach(({ bg, txt }) => {
//       bg?.destroy?.();
//       txt?.destroy?.();
//     });
//     this.choiceButtons = [];
//   }

//   showUI(visible) {
//     this.dialogueContainer.setVisible(visible);
//     if (visible) {
//       this.dialogueContainer.setAlpha(0).setScale(0.96);
//       this.scene.tweens.add({
//         targets: this.dialogueContainer,
//         alpha: 1, scaleX: 1, scaleY: 1,
//         duration: 220,
//         ease: "Back.easeOut",
//       });
//       this.scene.input.keyboard.on("keydown", this._onKeyDown);
//       this.scene.input.on("pointerdown", this._onPointerDown);
//       this.dialogueVisible = true;
//     } else {
//       this.scene.input.keyboard.off("keydown", this._onKeyDown);
//       this.scene.input.off("pointerdown", this._onPointerDown);
//       this.dialogueVisible = false;
//     }
//   }

//   endDialogue() {
//     if (this.typewriterEvent) this.typewriterEvent.remove(false);
//     this.clearChoices();
//     this.showUI(false);
//     this.dialogueFinished = true;
//     emit("dialogueEnded", this.currentDialogueKey || "custom");
//   }

//   // ----------------- INPUT -----------------
//   _onKeyDown(event) {
//     if (!this.dialogueVisible) return;
//     if (["SPACE", "ENTER"].includes(event.code)) this.nextDialogue();
//   }

//   _onPointerDown() {
//     if (!this.dialogueVisible) return;
//     this.nextDialogue();
//   }
// }



// src/game/objects/DialogueManager.js
import Phaser from "phaser";
import { addSDGPoints } from "../../utils/sdgPoints.js";
import { emit } from "../../utils/eventBus.js";

/**
 * DialogueManager handles displaying dialogue boxes, typewriter text,
 * player choices, and SDG point integration.
 * Integrates smoothly with React via eventBus emit() calls.
 */
export default class DialogueManager {
  constructor(scene, dialogueData = {}, sdgPointsObj = { points: 0 }) {
    this.scene = scene;
    this.dialogueScript = dialogueData;
    this.sdgPointsObj = sdgPointsObj;

    // Dynamic layout getters
    this.gameWidth = () => this.scene.scale.width || 1140;
    this.gameHeight = () => this.scene.scale.height || 540;

    // --- Dialogue state ---
    this.dialogueIndex = 0;
    this.currentDialogue = null;
    this.currentDialogueKey = null;
    this.dialogueVisible = false;
    this.dialogueFinished = false;
    this.choiceButtons = [];
    this.isTyping = false;
    this.currentText = "";
    this.typewriterSpeed = 30;
    this.typewriterEvent = null;
    this.typewriterSkipRequested = false;
    this._pendingChoices = null;

    // Target position for dialogue box (defaults to screen center-top)
    this.targetPosition = { x: Math.round(this.gameWidth() / 2), y: 150 };

    // --- Setup UI ---
    this._createBaseUI();

    // --- Input listeners ---
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
  }

  // ---------------------------------------------------------
  // UI CREATION & LAYOUT
  // ---------------------------------------------------------
  _createBaseUI() {
    this.dialogueContainer = this.scene.add.container(0, 0)
      .setDepth(10000)
      .setVisible(false)
      .setAlpha(0)
      .setScrollFactor(0);

    const panelW = Math.min(1000, this.gameWidth() * 0.9);
    const panelH = 180;

    // Background panel with fallback if no nineslice
    this.dialogueBubble = this.scene.add.nineslice
      ? this.scene.add.nineslice(0, 0, panelW, panelH, "ui_dialogue_box", 16, 16, 16, 16)
      : this.scene.add.rectangle(0, 0, panelW, panelH, 0x1a1a1a, 0.85);

    this.dialogueBubble.setOrigin(0.5);
    if (this.dialogueBubble.setStrokeStyle)
      this.dialogueBubble.setStrokeStyle(2, 0x6d28d9); // soft purple border

    // Avatar (character portrait)
    this.avatarContainer = this.scene.add.container(-panelW / 2 + 80, 0);

    // Speaker name text
    this.nameText = this.scene.add.text(-panelW / 2 + 160, -panelH / 2 + 18, "", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#C4B5FD",
      fontStyle: "bold"
    }).setOrigin(0, 0.5);

    // Dialogue text body
    this.dialogueText = this.scene.add.text(-panelW / 2 + 160, -panelH / 2 + 44, "", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#FFFFFF",
      wordWrap: { width: panelW - 240 },
      lineSpacing: 6
    }).setOrigin(0, 0);

    // Continue arrow or fallback icon
    this.continueIndicator = this.scene.textures.exists("ui_arrow_down")
      ? this.scene.add.image(panelW / 2 - 28, panelH / 2 - 20, "ui_arrow_down")
        .setScale(0.09).setAlpha(0.85)
      : this.scene.add.triangle(panelW / 2 - 28, panelH / 2 - 20, 0, 0, 8, 0, 4, 8, 0xffffff);

    this.continueIndicator.setVisible(false);

    // Choice buttons container
    this.choicesContainer = this.scene.add.container(0, panelH / 2 + 34);

    // Add all UI parts to the main container
    this.dialogueContainer.add([
      this.dialogueBubble,
      this.avatarContainer,
      this.nameText,
      this.dialogueText,
      this.continueIndicator,
      this.choicesContainer
    ]);

    // Add idle bounce to continue arrow
    this.scene.tweens.add({
      targets: this.continueIndicator,
      y: this.continueIndicator.y + 6,
      duration: 600,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  }

  /** Load or update character avatar */
  _setAvatar(avatarKey, size = 90) {
    this.avatarContainer.removeAll(true);
    if (avatarKey && this.scene.textures.exists(avatarKey)) {
      const img = this.scene.add.image(0, 0, avatarKey)
        .setDisplaySize(size, size)
        .setOrigin(0.5)
        .setAlpha(0.95);
      this.avatarContainer.add(img);
    } else {
      // fallback circle
      this.avatarContainer.add(this.scene.add.circle(0, 0, size / 2, 0x7b2cbf));
    }
  }

  updateContainerPosition() {
    this.dialogueContainer.setPosition(this.targetPosition.x, this.targetPosition.y);
  }

  setTargetPosition(x, y) {
    this.targetPosition.x = x;
    this.targetPosition.y = y - 80;
    this.updateContainerPosition();
  }

  // ---------------------------------------------------------
  // DIALOGUE FLOW
  // ---------------------------------------------------------
  startDialogue(keyOrNode, playerX, playerY) {
    const node = typeof keyOrNode === "string"
      ? this.dialogueScript?.[keyOrNode]
      : keyOrNode;
    if (!node) return console.warn("[DialogueManager] Invalid key:", keyOrNode);

    this.currentDialogue = node;
    this.dialogueIndex = 0;
    this.dialogueFinished = false;

    if (playerX !== undefined && playerY !== undefined)
      this.setTargetPosition(playerX, playerY);
    else
      this.updateContainerPosition();

    this.showUI(true);
    this.showCurrentLine();
  }

  showCurrentLine() {
    if (!this.currentDialogue) return this.endDialogue();

    const line = this.currentDialogue[this.dialogueIndex];
    if (!line) return this.endDialogue();

    this.nameText.setText(line.character || line.speaker || "");
    this._setAvatar(line.avatarKey || line.avatar || null);
    this.clearChoices();
    this.continueIndicator.setVisible(false);

    this._startTypewriter(line.text || "");
    this._pendingChoices = Array.isArray(line.choices) ? line.choices : null;
  }

  // ---------------------------------------------------------
  // TYPEWRITER EFFECT
  // ---------------------------------------------------------
  _startTypewriter(fullText) {
    if (this.typewriterEvent) this.typewriterEvent.remove(false);

    this.isTyping = true;
    this.currentText = "";
    this.dialogueText.setText("");
    this.typewriterSkipRequested = false;

    let i = 0;
    this.typewriterEvent = this.scene.time.addEvent({
      delay: this.typewriterSpeed,
      callback: () => {
        if (i >= fullText.length) return this._onLineComplete();
        this.currentText += fullText[i];
        this.dialogueText.setText(this.currentText);
        i++;
        if (this.typewriterSkipRequested) {
          this.dialogueText.setText(fullText);
          this._onLineComplete();
        }
      },
      loop: true
    });
  }

  _onLineComplete() {
    if (this.typewriterEvent) this.typewriterEvent.remove(false);
    this.isTyping = false;
    this.continueIndicator.setVisible(true);

    if (this._pendingChoices) {
      this.createChoices(this._pendingChoices);
      this._pendingChoices = null;
    } else if (this.dialogueIndex === this.currentDialogue.length - 1) {
      this.scene.time.delayedCall(600, () => this.endDialogue());
    }
  }

  skipTypewriter() {
    if (this.isTyping) this.typewriterSkipRequested = true;
  }

  nextDialogue() {
    if (this.isTyping) return this.skipTypewriter();
    const line = this.currentDialogue[this.dialogueIndex];
    if (line?.choices) return;

    this.dialogueIndex++;
    if (this.dialogueIndex < this.currentDialogue.length) this.showCurrentLine();
    else this.endDialogue();
  }

  // ---------------------------------------------------------
  // CHOICES
  // ---------------------------------------------------------
  createChoices(choices = []) {
    this.clearChoices();
    if (!choices.length) return;

    const buttonW = Math.min(220, Math.round(this.gameWidth() * 0.18));
    const buttonH = 44;
    const spacing = 16;
    const maxPerRow = 3;

    const rows = [];
    for (let i = 0; i < choices.length; i += maxPerRow)
      rows.push(choices.slice(i, i + maxPerRow));

    rows.forEach((rowChoices, rowIndex) => {
      const rowContainer = this.scene.add.container(0, rowIndex * (buttonH + 12));
      const totalWidth = rowChoices.length * (buttonW + spacing) - spacing;
      const startX = -Math.round(totalWidth / 2);

      rowChoices.forEach((choice, idx) => {
        const x = startX + idx * (buttonW + spacing);

        const bg = this.scene.add.rectangle(x + buttonW / 2, 0, buttonW, buttonH, 0x2563eb, 0.95)
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true });

        const txt = this.scene.add.text(x + buttonW / 2, 0, choice.text, {
          fontFamily: "Arial",
          fontSize: "14px",
          color: "#FFFFFF",
          align: "center",
          wordWrap: { width: buttonW - 10 }
        }).setOrigin(0.5);

        bg.on("pointerover", () => bg.setFillStyle(0x3b82f6, 0.98));
        bg.on("pointerout", () => bg.setFillStyle(0x2563eb, 0.95));

        const onChoose = () => this._onChoiceSelected(choice);
        bg.on("pointerdown", onChoose);
        txt.setInteractive({ useHandCursor: true }).on("pointerdown", onChoose);

        rowContainer.add([bg, txt]);
        this.choiceButtons.push({ bg, txt });
      });

      this.choicesContainer.add(rowContainer);
    });
  }

  _onChoiceSelected(choice) {
    this.clearChoices();
    this._animateChoiceSelection();

    const points = choice.points || choice.sdgPoints || 0;
    if (points) this.applySDGPoints(points);

    this.scene.time.delayedCall(200, () => {
      const next = choice.next;
      if (!next || next === "close" || next === "end") return this.endDialogue();
      if (next === "nextChapter") {
        if (this.scene.nextZone) this.scene.nextZone.setVisible(true);
        return this.endDialogue();
      }
      this.startDialogue(next);
    });
  }

  // ---------------------------------------------------------
  // VISUAL FEEDBACK
  // ---------------------------------------------------------
  _animateChoiceSelection() {
    this.scene.tweens.add({
      targets: [this.dialogueBubble, this.dialogueText],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 120,
      ease: "Power2",
      yoyo: true
    });
  }

  showFeedback(points) {
    const message = points > 0 ? `+${points} SDG Points! ✨` : "No points this time!";
    const color = points > 0 ? "#22c55e" : "#ef4444";

    const feedback = this.scene.add.text(
      this.targetPosition.x, this.targetPosition.y - 80,
      message, { fontSize: "16px", color, fontStyle: "bold", fontFamily: "Arial" }
    ).setOrigin(0.5).setScrollFactor(0).setAlpha(0);

    this.scene.tweens.add({
      targets: feedback,
      y: feedback.y - 40,
      alpha: 1,
      duration: 400,
      ease: "Back.easeOut"
    });
    this.scene.tweens.add({
      targets: feedback,
      y: feedback.y - 60,
      alpha: 0,
      duration: 400,
      delay: 600,
      onComplete: () => feedback.destroy()
    });
  }

  applySDGPoints(points) {
    this.sdgPointsObj.points += points;
    const total = addSDGPoints(points);
    emit("updateSDGPoints", total); // triggers SDGBar update in React
    this.showFeedback(points);
  }

  // ---------------------------------------------------------
  // CLEANUP
  // ---------------------------------------------------------
  clearChoices() {
    this.choicesContainer.removeAll(true);
    this.choiceButtons.forEach(({ bg, txt }) => {
      bg?.destroy?.();
      txt?.destroy?.();
    });
    this.choiceButtons = [];
  }

  showUI(visible) {
    this.dialogueContainer.setVisible(visible);
    if (visible) {
      this.dialogueContainer.setAlpha(0).setScale(0.95);
      this.scene.tweens.add({
        targets: this.dialogueContainer,
        alpha: 1, scaleX: 1, scaleY: 1,
        duration: 220,
        ease: "Back.easeOut"
      });
      this.scene.input.keyboard.on("keydown", this._onKeyDown);
      this.scene.input.on("pointerdown", this._onPointerDown);
      this.dialogueVisible = true;
    } else {
      this.scene.input.keyboard.off("keydown", this._onKeyDown);
      this.scene.input.off("pointerdown", this._onPointerDown);
      this.dialogueVisible = false;
    }
  }

  endDialogue() {
    if (this.typewriterEvent) this.typewriterEvent.remove(false);
    this.clearChoices();
    this.showUI(false);
    this.dialogueFinished = true;
// Inside DialogueManager.js endDialogue()
this.scene.events.emit("dialogueEnded", this.currentDialogueKey || "custom");
  }

  // ---------------------------------------------------------
  // INPUT HANDLERS
  // ---------------------------------------------------------
  _onKeyDown(event) {
    if (!this.dialogueVisible) return;
    if (["Space", "Enter"].includes(event.code)) this.nextDialogue();
  }

  _onPointerDown() {
    if (!this.dialogueVisible) return;
    this.nextDialogue();
  }
}
