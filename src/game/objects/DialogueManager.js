import Phaser from "phaser";
import { addSDGPoints } from "../../utils/sdgPoints.js";
import { emit } from "../../utils/eventBus.js";

export default class DialogueManager {
  constructor(scene, dialogueData = {}, sdgPointsObj = { points: 0 }, uiLayer) {
    this.scene = scene;
    this.dialogueData = dialogueData;
    this.sdgPointsObj = sdgPointsObj;
    this.uiLayer = uiLayer;

    // State
    this.currentDialogue = null;
    this.currentIndex = 0;
    this.dialogueVisible = false;
    this.typeTimer = null;
    this.choices = [];
    this._isTyping = false;
    this._skipRequested = false;

    // UI layout
    this.panelWidth = Math.round(scene.scale.width * 0.9);
    this.panelHeight = 100;
    this.panelX = Math.round(scene.scale.width / 2);
    this.panelY = scene.scale.height - (this.panelHeight / 2) - 90;

    this._createUI();

    this._onKeyDown = this._onKeyDown.bind(this);
    this.scene.events.on("destroy", this._destroy, this);

    this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  // ============================================================
  // UI CREATION
  // ============================================================
  _createUI() {
    this.container = this.scene.add.container(this.panelX, this.panelY)
      .setScrollFactor(0)
      .setVisible(false);

    if (this.uiLayer) this.uiLayer.add(this.container);

    // Panel BG
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x1A1A1A, 0.9);
    bg.fillRoundedRect(-this.panelWidth / 2, -this.panelHeight / 2, this.panelWidth, this.panelHeight, 16);
    bg.setScrollFactor(0);
    this.container.add(bg);

    // Name
    this.nameText = this.scene.add.text(
      -this.panelWidth / 2 + 30,
      -this.panelHeight / 2 + 25,
      "",
      {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#E5E7EB",
        fontStyle: "bold"
      }
    ).setOrigin(0, 0.5).setScrollFactor(0);
    this.container.add(this.nameText);

    // Dialogue text
    this.dialogueText = this.scene.add.text(
      0,
      10,
      "",
      {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#FFFFFF",
        align: "center",
        wordWrap: { width: this.panelWidth - 60 }
      }
    ).setOrigin(0.5).setScrollFactor(0);
    this.container.add(this.dialogueText);

    // Continue indicator
    this.continueIndicator = this.scene.add.graphics()
      .fillStyle(0xFFFFFF, 0.8)
      .fillRect(this.panelWidth / 2 - 35, this.panelHeight / 2 - 30, 15, 4)
      .setVisible(false)
      .setScrollFactor(0);
    this.container.add(this.continueIndicator);

    this.scene.tweens.add({
      targets: this.continueIndicator,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  // ============================================================
  // START DIALOGUE
  // ============================================================
  startDialogue(keyOrNode) {
    const node = typeof keyOrNode === "string"
      ? this.dialogueData?.[keyOrNode]
      : keyOrNode;

    if (!node || !Array.isArray(node)) {
      console.warn("Dialogue node not found:", keyOrNode);
      return;
    }

    this.currentDialogue = node;
    this.currentIndex = 0;
    this.dialogueVisible = true;
    this.container.setVisible(true).setScrollFactor(0);

    this.scene.input.keyboard.on("keydown", this._onKeyDown);
    this._showCurrent();
  }

  _showCurrent() {
    const entry = this.currentDialogue?.[this.currentIndex];
    if (!entry) return this.endDialogue();

    this.nameText.setText(entry.character || "Abang");
    this.continueIndicator.setVisible(false);

    this._clearChoices();
    this._startTypewriter(entry.text || "");

    this._pendingChoices = Array.isArray(entry.choices)
      ? entry.choices
      : null;
  }

  // ============================================================
  // TYPEWRITER
  // ============================================================
  _startTypewriter(fullText = "") {
    if (this.typeTimer) this.typeTimer.remove();

    this.dialogueText.setText("");
    this._isTyping = true;
    this._skipRequested = false;

    let i = 0;

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
        this.dialogueText.setText(this.dialogueText.text + fullText[i]);
        i++;

        if (i === fullText.length) this._onTypeComplete(fullText);
      }
    });
  }

  _onTypeComplete(fullText) {
    if (this.typeTimer) this.typeTimer.remove();
    this.dialogueText.setText(fullText);
    this._isTyping = false;

    if (this._pendingChoices)
      this._createChoices(this._pendingChoices);
    else
      this.continueIndicator.setVisible(true);
  }

  // ============================================================
  // CHOICES
  // ============================================================
  _createChoices(choicesData = []) {
    this._clearChoices();
    this.continueIndicator.setVisible(false);

    const buttonWidth = 320;
    const buttonHeight = 50;
    const gap = 50;
    const y = this.panelHeight / 2 + 60;

    const keyMap = {
      0: { key: "Q", keyCode: this.keyQ },
      1: { key: "E", keyCode: this.keyE }
    };

    choicesData.forEach((choice, index) => {
      if (index > 1) return;

      const sign = index === 0 ? -1 : 1;
      const x = sign * (buttonWidth / 2 + gap / 2);
      const circleX = x - buttonWidth / 2 - 30;

      // Key circle
      const keyCircle = this.scene.add.graphics()
        .fillStyle(0xffffff, 1)
        .fillCircle(circleX, y, 15)
        .setScrollFactor(0);

      const keyText = this.scene.add.text(circleX, y, keyMap[index].key, {
        fontSize: "18px",
        color: "#000",
        fontStyle: "bold"
      }).setOrigin(0.5).setScrollFactor(0);

      // Button bg
      const bg = this.scene.add.graphics()
        .fillStyle(0x373737, 1)
        .fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 12)
        .setScrollFactor(0);

      const txt = this.scene.add.text(x, y, choice.text, {
        fontSize: "16px",
        color: "#fff"
      }).setOrigin(0.5).setScrollFactor(0);

      const hitArea = this.scene.add.zone(x, y, buttonWidth, buttonHeight)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0);

      this.container.add([bg, txt, hitArea, keyCircle, keyText]);

      hitArea.on("pointerdown", () => this._handleChoice(choice));

      keyMap[index].keyCode.on("down", () => this._handleChoice(choice));

      this.choices.push({ bg, txt, hitArea, keyCircle, keyText });
    });
  }

  // ============================================================
  // MISC
  // ============================================================
  _handleChoice(choice) {
    if (choice.points || choice.sdgPoints) {
      const pts = choice.points || choice.sdgPoints;
      addSDGPoints(pts);
      emit("updateSDGPoints", this.sdgPointsObj.points + pts);
    }

    if (choice.next) this.startDialogue(choice.next);
    else this.endDialogue();
  }

  _clearChoices() {
    this.choices.forEach(c => {
      c.bg.destroy();
      c.txt.destroy();
      c.hitArea.destroy();
      c.keyCircle.destroy();
      c.keyText.destroy();
    });
    this.choices = [];

    this.keyQ.removeAllListeners("down");
    this.keyE.removeAllListeners("down");
  }

  _onKeyDown(event) {
    if (!this.dialogueVisible) return;

    if (event.code === "Space" || event.code === "Enter") {
      if (this._isTyping) this._skipRequested = true;
      else if (this.choices.length === 0) {
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
