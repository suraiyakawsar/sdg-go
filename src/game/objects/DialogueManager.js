import Phaser from "phaser";
import { addSDGPoints } from "../../utils/sdgPoints.js";
import { emit } from "../../utils/eventBus.js";

export default class DialogueManager {
  constructor(scene, dialogueScene = {}, sdgPointsObj = { points: 0 }, uiLayer) {
    this.scene = scene;
    this.sceneConfig = dialogueScene || {};
    this.sdgPointsObj = sdgPointsObj;
    this.uiLayer = uiLayer;

    // --- Graph-style nodes: { id → node }
    this.nodesById = {};
    if (Array.isArray(this.sceneConfig.nodes)) {
      this.sceneConfig.nodes.forEach(n => {
        if (n && n.id) this.nodesById[n.id] = n;
      });
    } else {
      console.warn("[DialogueManager] Expected dialogueScene.nodes to be an array.");
    }

    this.startNodeId = this.sceneConfig.startNodeId || null;

    // State
    this.currentNodeId = null;
    this.currentNode = null;
    this.dialogueVisible = false;
    this.typeTimer = null;
    this.choices = [];
    this._isTyping = false;
    this._skipRequested = false;
    this._pendingChoices = null;

    // UI layout
    this.panelWidth = Math.round(scene.scale.width * 0.9);
    this.panelHeight = 100;
    this.panelX = Math.round(scene.scale.width / 2);
    this.panelY = scene.scale.height - (this.panelHeight / 2) - 70;

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
    bg.fillRoundedRect(
      -this.panelWidth / 2,
      -this.panelHeight / 2,
      this.panelWidth,
      this.panelHeight,
      16
    );
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
  // HELPERS
  // ============================================================
  _getDisplayName(speaker) {
    if (!speaker) return "";
    if (speaker === "system" || speaker === "narrator") return "";
    const map = {
      friend: "Friend",
      friendA: "Friend A",
      friendB: "Friend B",
      professor: "Professor"
    };
    return map[speaker] || speaker;
  }

  _getNode(nodeId) {
    return this.nodesById[nodeId] || null;
  }

  // ============================================================
  // START DIALOGUE (graph-style)
  // ============================================================
  /**
   * startDialogue(nodeId?)
   * - If nodeId is provided, starts from that node.
   * - Else, uses the scene's startNodeId (e.g. "h_intro_narration").
   */
  startDialogue(nodeId) {
    const id = nodeId || this.startNodeId;

    if (!id) {
      console.warn("[DialogueManager] No start node id.");
      return;
    }

    const node = this._getNode(id);
    if (!node) {
      console.warn("[DialogueManager] Node not found:", id);
      return;
    }

    this.currentNodeId = id;
    this.currentNode = node;
    this.dialogueVisible = true;

    this.container.setVisible(true).setScrollFactor(0);
    this.scene.input.keyboard.on("keydown", this._onKeyDown);

    this._showCurrentNode();
  }

  _showCurrentNode() {
    const node = this._getNode(this.currentNodeId);
    if (!node) {
      this.endDialogue();
      return;
    }

    this.currentNode = node;
    this._pendingChoices = Array.isArray(node.choices) ? node.choices : null;

    const displayName = this._getDisplayName(node.speaker);
    this.nameText.setText(displayName);

    this.continueIndicator.setVisible(false);
    this._clearChoices();
    this._startTypewriter(node.text || "");
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

    if (!fullText.length) {
      this._onTypeComplete("");
      return;
    }

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

    if (this._pendingChoices && this._pendingChoices.length > 0) {
      this._createChoices(this._pendingChoices);
    } else {
      this.continueIndicator.setVisible(true);
    }
  }

  // ============================================================
  // CHOICES (Q / E)
  // ============================================================
  _createChoices(choicesData = []) {
    this._clearChoices();
    this.continueIndicator.setVisible(false);

    const buttonWidth = 320;
    const buttonHeight = 50;
    const gap = 80;
    const y = this.panelHeight / 2 + 35;

    const keyMap = {
      0: { key: "Q", keyCode: this.keyQ },
      1: { key: "E", keyCode: this.keyE }
    };

    choicesData.forEach((choice, index) => {
      if (index > 1) return; // you only support 2 choices (Q/E) now

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
        .fillRoundedRect(
          x - buttonWidth / 2,
          y - buttonHeight / 2,
          buttonWidth,
          buttonHeight,
          12
        )
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

  _handleChoice(choice) {
    // SDG points from JSON: choice.sdgDelta
    if (typeof choice.sdgDelta === "number") {
      const delta = choice.sdgDelta;
      addSDGPoints(delta);
      emit("updateSDGPoints", (this.sdgPointsObj.points || 0) + delta);
    }

    // Flags from JSON: choice.setFlags
    if (Array.isArray(choice.setFlags) && choice.setFlags.length > 0) {
      emit("flagsSet", {
        flags: choice.setFlags,
        sceneId: this.sceneConfig.id
      });
    }

    // Go to the next node if defined
    if (choice.nextNodeId) {
      const nextNode = this._getNode(choice.nextNodeId);
      if (nextNode) {
        this.currentNodeId = choice.nextNodeId;
        this.currentNode = nextNode;
        this._pendingChoices = null;
        this._showCurrentNode();
        return;
      } else {
        console.warn("[DialogueManager] choice.nextNodeId not found:", choice.nextNodeId);
      }
    }

    // If no nextNodeId, we consider that a dead-end → end dialogue
    this._runNodeCompletion(this.currentNode);
    this.endDialogue();
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

  // ============================================================
  // NODE COMPLETION / ADVANCE
  // ============================================================
  _runNodeCompletion(node) {
    if (!node || !node.onComplete) return;

    const oc = node.onComplete;

    if (Array.isArray(oc.setFlags) && oc.setFlags.length > 0) {
      emit("flagsSet", {
        flags: oc.setFlags,
        sceneId: this.sceneConfig.id
      });
    }

    if (oc.unlockExit) {
      emit("sceneExitUnlocked", {
        sceneId: this.sceneConfig.id,
        exitFlag: this.sceneConfig.exitUnlockedFlag
      });
    }
  }

  _advanceFromCurrentNode() {
    const node = this.currentNode;
    if (!node) {
      this.endDialogue();
      return;
    }

    // Run any onComplete handler
    this._runNodeCompletion(node);

    // If node defines autoNext, jump there
    if (node.autoNext) {
      const nextNode = this._getNode(node.autoNext);
      if (nextNode) {
        this.currentNodeId = node.autoNext;
        this.currentNode = nextNode;
        this._pendingChoices = Array.isArray(nextNode.choices) ? nextNode.choices : null;
        this._showCurrentNode();
        return;
      } else {
        console.warn("[DialogueManager] autoNext node not found:", node.autoNext);
      }
    }

    // No autoNext → this is the end of this dialogue chain
    this.endDialogue();
  }

  // ============================================================
  // INPUT HANDLER
  // ============================================================
  _onKeyDown(event) {
    if (!this.dialogueVisible) return;

    if (event.code === "Space" || event.code === "Enter") {
      if (this._isTyping) {
        this._skipRequested = true;
      } else if (this.choices.length === 0) {
        // No choices → advance along autoNext / end
        this._advanceFromCurrentNode();
      }
    }
  }

  // ============================================================
  // END / DESTROY
  // ============================================================
  endDialogue() {
    this.dialogueVisible = false;
    this.container.setVisible(false);
    this._clearChoices();
    if (this.typeTimer) this.typeTimer.remove();
    this.scene.input.keyboard.off("keydown", this._onKeyDown);

    // Notify scene (Chapter1Scene already listens to this)
    this.scene.events.emit("dialogueEnded", {
      sceneId: this.sceneConfig.id,
      lastNodeId: this.currentNodeId
    });
  }

  _destroy() {
    if (this.typeTimer) this.typeTimer.remove();
    this._clearChoices();
    if (this.container) this.container.destroy();
    this.scene.input.keyboard.off("keydown", this._onKeyDown);
  }
}
