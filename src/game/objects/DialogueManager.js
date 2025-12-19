import Phaser from "phaser";
import { addSDGPoints } from "../../utils/sdgPoints.js";
import { emit } from "../../utils/eventBus.js";
import { BiFont } from "react-icons/bi";

export default class DialogueManager {
  constructor(scene, dialogueScene = {}, sdgPointsObj = { points: 0 }, uiLayer) {
    this.scene = scene;
    this.sdgPointsObj = sdgPointsObj;
    this.uiLayer = uiLayer;

    this._initConfig(dialogueScene);
    this._initState();
    this._initLayout();
    this._createUI();
    this._setupInput();
  }

  // ============================================================
  // INIT HELPERS
  // ============================================================
  _initConfig(dialogueScene) {
    this.sceneConfig = dialogueScene || {};

    // --- Graph-style nodes: { id → node }
    this.nodesById = {};
    if (Array.isArray(this.sceneConfig.nodes)) {
      this.sceneConfig.nodes.forEach((n) => {
        if (n && n.id) this.nodesById[n.id] = n;
      });
    } else {
      console.warn("[DialogueManager] Expected dialogueScene.nodes to be an array.");
    }

    this.startNodeId = this.sceneConfig.startNodeId || null;

    // Debug so you SEE what nodes exist for this scene
    console.log("[DialogueManager] Config init:", {
      sceneId: this.sceneConfig.id,
      startNodeId: this.startNodeId,
      nodeIds: Object.keys(this.nodesById)
    });
  }

  _initState() {
    this.currentNodeId = null;
    this.currentNode = null;
    this.dialogueVisible = false;
    this.typeTimer = null;
    this.choices = [];
    this._isTyping = false;
    this._skipRequested = false;
    this._pendingChoices = null;
  }

  _initLayout() {
    this.panelWidth = Math.round(this.scene.scale.width * 0.9);
    this.panelHeight = 100;
    this.panelX = Math.round(this.scene.scale.width / 2);
    this.panelY = this.scene.scale.height - this.panelHeight / 2 - 100;
  }

  _setupInput() {
    this._onKeyDown = this._onKeyDown.bind(this);
    this.scene.events.on("destroy", this._destroy, this);

    this.keyQ = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Q
    );
    this.keyE = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );
    this.keyR = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    );
  }

  // ============================================================
  // UI CREATION
  // ============================================================
  _createUI() {
    this.container = this.scene.add
      .container(this.panelX, this.panelY)
      .setScrollFactor(0)
      .setVisible(false);

    if (this.uiLayer) this.uiLayer.add(this.container);

    // Panel BG
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x1a1a1a, 0.9);
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
    this.nameText = this.scene.add
      .text(
        -this.panelWidth / 2 + 30,
        -this.panelHeight / 2 + 25,
        "",
        {
          fontFamily: "Arial",
          fontSize: "20px",
          color: "#e5e7eb",
          fontStyle: "bold",
        }
      )
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
    this.container.add(this.nameText);

    // Dialogue text
    this.dialogueText = this.scene.add
      .text(0, 10, "", {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.panelWidth - 60 }
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.container.add(this.dialogueText);

    // Continue indicator
    this.continueIndicator = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 0.8)
      .fillRect(
        this.panelWidth / 2 - 35,
        this.panelHeight / 2 - 30,
        15,
        4
      )
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
      friendA: "FRIEND A",
      friendB: "FRIEND B",
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
    this._pendingChoices = Array.isArray(node.choices)
      ? node.choices
      : null;

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


  _createChoices(choicesData = []) {
    this._clearChoices();
    this.continueIndicator.setVisible(false);

    if (!choicesData.length) return;

    // Allow up to 3 visible choices
    const maxChoices = 3;
    const visibleChoices = choicesData.slice(0, maxChoices);
    const choiceCount = visibleChoices.length;

    const paddingX = 24;      // inside button padding
    const paddingY = 10;
    const horizontalGap = 50; // space between buttons
    const y = this.panelHeight / 2 + 40; // under the dialogue panel

    // How much horizontal space we can use in total
    const keyGap = 20; // 👈 tweak this
    const totalGap = horizontalGap * (choiceCount - 1);
    const availableWidth = this.panelWidth - 80 - totalGap; // 40px padding left+right
    const perButtonMaxWidth = availableWidth / choiceCount;

    // 1) First pass: create texts + measure widths/heights
    const temp = [];

    visibleChoices.forEach((choice) => {
      const txt = this.scene.add.text(0, 0, choice.text, {
        fontSize: "28px",
        color: "#ffffff",
        wordWrap: { width: perButtonMaxWidth - paddingX * 2 }
      })
        .setOrigin(0.5)
        .setScrollFactor(0);

      const bounds = txt.getBounds();
      const width = Math.min(bounds.width + paddingX * 2, perButtonMaxWidth);
      const height = bounds.height + paddingY * 2;

      temp.push({ choice, txt, width, height });
    });

    // Total width of all buttons + gaps so we can center the whole row
    const totalButtonsWidth = temp.reduce((sum, t) => sum + t.width, 0);
    const totalWidthWithGaps = totalButtonsWidth + totalGap;
    let startX = -totalWidthWithGaps / 2;

    const keyMap = [
      { key: "Q", keyCode: this.keyQ },
      { key: "E", keyCode: this.keyE },
      { key: "R", keyCode: this.keyR }
    ];

    // 2) Second pass: place buttons in a row
    temp.forEach((entry, index) => {
      const { choice, txt, width, height } = entry;
      const xCenter = startX + width / 2;

      // Position text
      txt.setPosition(xCenter, y);

      // Button bg
      const bg = this.scene.add.graphics()
        .fillStyle(0x373737, 1)
        .fillRoundedRect(
          xCenter - width / 2,
          y - height / 2,
          width,
          height,
          12
        )
        .setScrollFactor(0);

      // Click area
      const hitArea = this.scene.add.zone(xCenter, y, width, height)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0);

      // Key circle to the left of the button
      const circleX = xCenter - width / 2 - keyGap;
      const keyCfg = keyMap[index]; // Q / E / R

      const keyCircle = this.scene.add.graphics()
        .fillStyle(0xffffff, 1)
        .fillCircle(circleX, y, 15)
        .setScrollFactor(0);

      const keyText = this.scene.add.text(circleX, y, keyCfg.key, {
        fontSize: "18px",
        color: "#000",
        fontStyle: "bold"
      })
        .setOrigin(0.5)
        .setScrollFactor(0);

      // Add everything to the panel container
      this.container.add([bg, txt, hitArea, keyCircle, keyText]);

      // Events
      hitArea.on("pointerdown", () => this._handleChoice(choice));
      keyCfg.keyCode.on("down", () => this._handleChoice(choice));

      this.choices.push({ bg, txt, hitArea, keyCircle, keyText });

      // Advance X for the next button
      startX += width + horizontalGap;
    });
  }




  _handleChoice(choice) {
    if (typeof choice.sdgDelta === "number") {
      const delta = choice.sdgDelta;
      addSDGPoints(delta);
      emit(
        "updateSDGPoints",
        (this.sdgPointsObj.points || 0) + delta
      );
    }

    if (Array.isArray(choice.setFlags) && choice.setFlags.length > 0) {
      emit("flagsSet", {
        flags: choice.setFlags,
        sceneId: this.sceneConfig.id
      });
    }

    if (choice.nextNodeId) {
      const nextNode = this._getNode(choice.nextNodeId);
      if (nextNode) {
        this.currentNodeId = choice.nextNodeId;
        this.currentNode = nextNode;
        this._pendingChoices = null;
        this._showCurrentNode();
        return;
      } else {
        console.warn(
          "[DialogueManager] choice.nextNodeId not found:",
          choice.nextNodeId
        );
      }
    }

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

    if (this.keyQ) this.keyQ.removeAllListeners("down");
    if (this.keyE) this.keyE.removeAllListeners("down");
    if (this.keyR) this.keyR.removeAllListeners("down");
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

    this._runNodeCompletion(node);

    if (node.autoNext) {
      const nextNode = this._getNode(node.autoNext);
      if (nextNode) {
        this.currentNodeId = node.autoNext;
        this.currentNode = nextNode;
        this._pendingChoices = Array.isArray(nextNode.choices)
          ? nextNode.choices
          : null;
        this._showCurrentNode();
        return;
      } else {
        console.warn(
          "[DialogueManager] autoNext node not found:",
          node.autoNext
        );
      }
    }

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














  // helper
  _applyFlags(flags) {
    if (!Array.isArray(flags) || flags.length === 0) return;

    // If you have a real Flags store, call it here instead.
    // For now: use registry so it persists within the game session.
    flags.forEach((f) => this.scene.registry.set(f, true));

    emit("flagsUpdated", flags);
  }

  // inside your CHOICE handler (where you already do sdgDelta + nextNodeId)
  handleChoice(choice) {
    if (!choice) return;

    // sdg points
    if (typeof choice.sdgDelta === "number") {
      emit("updateSDGPoints", choice.sdgDelta);
    }

    // ✅ choice flags (you use this in f_choice_join_yes)
    if (Array.isArray(choice.setFlags)) {
      this._applyFlags(choice.setFlags);
    }

    // go next
    if (choice.nextNodeId) {
      this.startDialogue(choice.nextNodeId);
    } else {
      this.endDialogue?.();
    }
  }

  // inside your NODE COMPLETE logic (when node finishes & no autoNext / end)
  _handleNodeComplete(node) {
    const oc = node?.onComplete;
    if (!oc) return;

    // ✅ node flags
    if (Array.isArray(oc.setFlags)) {
      this._applyFlags(oc.setFlags);
    }

    // ✅ unlock exit
    if (oc.unlockExit) {
      emit("sceneExitUnlocked", {
        sceneId: this.sceneConfig?.id,                 // "cafeteria"
        exitFlag: this.sceneConfig?.exitUnlockedFlag,  // "chapter1_scene3_exit_unlocked"
      });
    }
  }

}
