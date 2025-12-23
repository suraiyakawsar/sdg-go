
import Phaser from "phaser";
import { addSDGPoints } from "../../utils/sdgPoints.js";
import { emit } from "../../utils/eventBus.js";

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
  // CONFIG & STATE
  // ============================================================
  _initConfig(dialogueScene) {
    this.sceneConfig = dialogueScene || {};
    this.nodesById = {};

    if (Array.isArray(this.sceneConfig.nodes)) {
      this.sceneConfig.nodes.forEach(n => n?.id && (this.nodesById[n.id] = n));
    } else {
      console.warn("[DialogueManager] dialogueScene.nodes should be an array.");
    }

    this.startNodeId = this.sceneConfig.startNodeId || null;

    console.log("[DialogueManager] Initialized nodes:", {
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
    this._isTyping = false;
    this._skipRequested = false;
    this.choices = [];
    this._pendingChoices = null;
  }

  // ============================================================
  // LAYOUT & UI CREATION (ELEVATED STYLE)
  // ============================================================
  _initLayout() {
    const { width, height } = this.scene.scale;

    // Panel Dimensions
    this.panelWidth = Math.round(width * 0.85);
    this.panelHeight = 140;
    this.panelX = Math.round(width / 2);
    this.panelY = height - this.panelHeight / 2 - 60;

    // Theme Colors
    this.theme = {
      primary: 0x1a1a1a,      // Dark background
      accent: 0x80Ef80,       // Cyan/Neon accent
      text: '#ffffff',
      textDim: '#aaaaaa',
      border: 0x80Ef80
    };
  }

  _createUI() {
    this.container = this.scene.add.container(this.panelX, this.panelY)
      .setScrollFactor(0)
      .setVisible(false);

    if (this.uiLayer) this.uiLayer.add(this.container);

    // --- 1. The Main Panel (Glass Style) ---
    const bg = this.scene.add.graphics();
    bg.fillStyle(this.theme.primary, 0.85);
    bg.fillRoundedRect(-this.panelWidth / 2, -this.panelHeight / 2, this.panelWidth, this.panelHeight, 16);

    // Subtle border/stroke
    bg.lineStyle(2, this.theme.border, 0.3);
    bg.strokeRoundedRect(-this.panelWidth / 2, -this.panelHeight / 2, this.panelWidth, this.panelHeight, 16);
    this.container.add(bg);

    // --- 2. Speaker Name Badge ---
    const nameBgWidth = 200;
    const nameBgHeight = 40;
    const nameX = -this.panelWidth / 2 + 20;
    const nameY = -this.panelHeight / 2; // Sitting on the top edge

    const nameBadge = this.scene.add.graphics();
    nameBadge.fillStyle(this.theme.accent, 1);
    nameBadge.fillRoundedRect(nameX, nameY - (nameBgHeight / 2), nameBgWidth, nameBgHeight, 8);
    this.container.add(nameBadge);

    this.nameText = this.scene.add.text(nameX + 15, nameY, "", {
      fontFamily: "'Roboto', 'Segoe UI', Arial, sans-serif",
      fontSize: "18px",
      fontStyle: "bold",
      color: "#000000",
    }).setOrigin(0, 0.5);
    this.container.add(this.nameText);

    // --- 3. Dialogue Text ---
    this.dialogueText = this.scene.add.text(0, 15, "", {
      fontFamily: "'Roboto', 'Segoe UI', Arial, sans-serif",
      fontSize: "26px",
      color: "#ffffff",
      align: "center",
      lineSpacing: 8,
      wordWrap: { width: this.panelWidth - 80 },
    }).setOrigin(0.5);

    this.dialogueText.setShadow(2, 2, 'rgba(0,0,0,0.8)', 2);
    this.container.add(this.dialogueText);

    // --- 4. Continue Indicator ---
    this.continueIndicator = this.scene.add.text(this.panelWidth / 2 - 30, this.panelHeight / 2 - 30, "▼", {
      fontSize: "20px",
      color: this.theme.accent
    }).setAlpha(0).setOrigin(0.5);

    this.container.add(this.continueIndicator);

    // Pulse animation
    this.scene.tweens.add({
      targets: this.continueIndicator,
      y: this.continueIndicator.y + 6,
      alpha: { from: 0.5, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  _createChoices(choicesData = []) {
    this._clearChoices();
    this.continueIndicator.setVisible(false);

    if (!choicesData.length) return;

    const maxChoices = 3;
    const visibleChoices = choicesData.slice(0, maxChoices);

    // Position choices above the panel
    const y = -this.panelHeight / 2 - 50;
    const horizontalGap = 20;

    const keyMap = [
      { key: "Q", keyCode: this.keyQ },
      { key: "E", keyCode: this.keyE },
      { key: "R", keyCode: this.keyR }
    ];

    // First pass: Calculate sizes
    const temp = visibleChoices.map(choice => {
      const txt = this.scene.add.text(0, 0, choice.text, {
        fontFamily: "'Roboto', 'Segoe UI', Arial, sans-serif",
        fontSize: "25px",
        color: "#ffffff",
        fontStyle: "bold"
      }).setOrigin(0.5).setScrollFactor(0);

      const bounds = txt.getBounds();
      const width = bounds.width + 80; // Extra padding for Key Icon
      const height = 50;
      return { choice, txt, width, height };
    });

    let startX = - (temp.reduce((sum, t) => sum + t.width, 0) + horizontalGap * (temp.length - 1)) / 2;

    temp.forEach((entry, index) => {
      const { choice, txt, width, height } = entry;
      const xCenter = startX + width / 2;

      // Group for the button
      const btnContainer = this.scene.add.container(xCenter, y);

      // 1. Button Background
      const bg = this.scene.add.graphics();
      const drawBtn = (color, alpha, borderAlpha) => {
        bg.clear();
        bg.fillStyle(0x000000, alpha);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, 12);
        bg.lineStyle(2, color, borderAlpha);
        bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);
      };

      drawBtn(0xffffff, 0.7, 0.2); // Default state
      btnContainer.add(bg);

      // 2. The Hotkey Badge
      const keyX = -width / 2 + 25;
      const keyBg = this.scene.add.graphics();
      keyBg.fillStyle(this.theme.accent, 1);
      keyBg.fillCircle(keyX, 0, 14);
      btnContainer.add(keyBg);

      const keyText = this.scene.add.text(keyX, 0, keyMap[index].key, {
        fontSize: "16px",
        color: "#000000",
        fontStyle: "bold"
      }).setOrigin(0.5);
      btnContainer.add(keyText);

      // 3. The Choice Text
      txt.setPosition(15, 0);
      btnContainer.add(txt);

      // 4. Interaction Area
      const hitArea = this.scene.add.zone(0, 0, width, height)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5);
      btnContainer.add(hitArea);


      // --- Interactions: Juicy/Bouncy ---
      const onHover = () => {
        // Stop any running tweens to prevent conflict
        this.scene.tweens.killTweensOf(btnContainer);

        // Pop up and wiggle slightly
        this.scene.tweens.add({
          targets: btnContainer,
          scale: 1.1,
          // angle: Phaser.Math.Between(-3, 3), // Slight random tilt
          duration: 200,
          ease: 'Back.easeOut'
        });

        // High contrast change
        drawBtn(this.theme.accent, 1, 2);
        txt.setColor("#ffffff");
      };

      const onOut = () => {
        this.scene.tweens.add({
          targets: btnContainer,
          scale: 1,
          angle: 0, // Reset tilt
          duration: 200,
          ease: 'Power2'
        });
        drawBtn(0xffffff, 0.5, 0);
        txt.setColor("#cccccc");
      };

      const onSelect = () => {
        // Squish effect on click
        this.scene.tweens.add({
          targets: btnContainer,
          scaleX: 1.2,
          scaleY: 0.8,
          duration: 50,
          yoyo: true,
          onComplete: () => {
            // Reset scale before moving on
            btnContainer.setScale(1);
            this._handleChoice(choice);
          }
        });
      };

      hitArea.on("pointerover", onHover)
        .on("pointerout", onOut)
        .on("pointerdown", onSelect);

      keyMap[index].keyCode.on("down", () => {
        onHover();
        this.scene.time.delayedCall(100, onSelect);
      });

      this.container.add(btnContainer);

      // Store reference
      this.choices.push({ btnContainer, keyCode: keyMap[index].keyCode });

      startX += width + horizontalGap;
    });
  }

  // ============================================================
  // FIXED _clearChoices METHOD
  // ============================================================
  _clearChoices() {
    this.choices.forEach(c => {
      this.choices.forEach(c => c.btnContainer?.destroy());
      this.choices.forEach(c => c.keyCode?.removeAllListeners("down"));
      this.choices = [];
    });
  }

  // ============================================================
  // INPUT
  // ============================================================
  _setupInput() {
    this._onKeyDown = this._onKeyDown.bind(this);
    this.scene.events.on("destroy", this._destroy, this);

    const { KeyCodes } = Phaser.Input.Keyboard;
    this.keyQ = this.scene.input.keyboard.addKey(KeyCodes.Q);
    this.keyE = this.scene.input.keyboard.addKey(KeyCodes.E);
    this.keyR = this.scene.input.keyboard.addKey(KeyCodes.R);
  }

  _onKeyDown(event) {
    if (!this.dialogueVisible) return;

    if (event.code === "Space" || event.code === "Enter") {
      if (this._isTyping) {
        this._skipRequested = true;
      } else if (!this.choices.length) {
        this._advanceFromCurrentNode();
      }

      // --- NEW: Inspectable trigger ---
      if (event.code === "KeyE") {
        // Emit an event to let the scene handle what is being inspected
        emit("inspectTriggered");
      }
    }
  }

  startInspectDialogue(inspectId) {
    if (!inspectId) return console.warn("[DialogueManager] No inspectDialogueId provided.");

    const node = this._getNode(inspectId); // ✅ use _getNode to find by node id
    if (!node) return console.warn("[DialogueManager] Inspect node not found:", inspectId);

    this.currentNodeId = node.id;
    this.currentNode = node;
    this.dialogueVisible = true;

    this.container.setVisible(true);
    this.container.setScale(0).setAlpha(0);
    this.scene.tweens.add({ targets: this.container, scale: 1, alpha: 1, duration: 300, ease: "Back.easeOut" });

    this._showCurrentNode();

    console.log("[DialogueManager] Showing inspect node:", inspectId, node);
  }

  // ============================================================
  // DIALOGUE CONTROL
  // ============================================================
  startDialogue(nodeId) {
    const id = nodeId || this.startNodeId;
    if (!id) return console.warn("[DialogueManager] No start node id.");

    const node = this._getNode(id);
    if (!node) return console.warn("[DialogueManager] Node not found:", id);

    this.currentNodeId = id;
    this.currentNode = node;
    this.dialogueVisible = true;

    this.container.setVisible(true);
    this.container.setScale(0).setAlpha(0);
    this.scene.tweens.add({ targets: this.container, scale: 1, alpha: 1, duration: 300, ease: "Back.easeOut" });

    this.scene.input.keyboard.on("keydown", this._onKeyDown);
    this._showCurrentNode();
  }

  _showCurrentNode() {
    const node = this._getNode(this.currentNodeId);
    if (!node) return this.endDialogue();

    this.currentNode = node;
    this._pendingChoices = Array.isArray(node.choices) ? node.choices : null;
    this.nameText.setText(this._getDisplayName(node.speaker));

    this.continueIndicator.setVisible(false);
    this._clearChoices();
    this._startTypewriter(node.text || "");


  }

  _advanceFromCurrentNode() {
    const node = this.currentNode;
    if (!node) return this.endDialogue();

    this._handleNodeComplete(node);

    if (node.autoNext) {
      const nextNode = this._getNode(node.autoNext);
      if (nextNode) {
        this.currentNodeId = node.autoNext;
        this.currentNode = nextNode;
        this._pendingChoices = Array.isArray(nextNode.choices) ? nextNode.choices : null;
        this._showCurrentNode();
        return;
      }
      console.warn("[DialogueManager] autoNext node not found:", node.autoNext);
    }

    this.endDialogue();
  }

  endDialogue() {
    this.dialogueVisible = false;

    this.scene.tweens.add({
      targets: this.container,
      scale: 0.9,
      alpha: 0,
      duration: 200,
      onComplete: () => this.container.setVisible(false)
    });

    this._clearChoices();
    if (this.typeTimer) this.typeTimer.remove();
    this.scene.input.keyboard.off("keydown", this._onKeyDown);

    this.scene.events.emit("dialogueEnded", { sceneId: this.sceneConfig.id, lastNodeId: this.currentNodeId });
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
    if (!fullText.length) return this._onTypeComplete("");

    this.typeTimer = this.scene.time.addEvent({
      delay: 25,
      repeat: fullText.length - 1,
      callback: () => {
        if (this._skipRequested) {
          this.dialogueText.setText(fullText);
          this.typeTimer.remove();
          this._onTypeComplete(fullText);
          return;
        }

        const char = fullText[i];
        this.dialogueText.setText(this.dialogueText.text + char);
        i++;

        if (i === fullText.length) this._onTypeComplete(fullText);
      }
    });
  }

  _onTypeComplete(fullText) {
    if (this.typeTimer) this.typeTimer.remove();
    this.dialogueText.setText(fullText);
    this._isTyping = false;

    if (this._pendingChoices?.length > 0) this._createChoices(this._pendingChoices);
    else this.continueIndicator.setVisible(true);
  }

  // ============================================================
  // CHOICE HANDLER & HELPERS
  // ============================================================
  _handleChoice(choice) {
    if (!choice) return;

    if (typeof choice.sdgDelta === "number") {
      addSDGPoints(choice.sdgDelta);
      emit("updateSDGPoints", (this.sdgPointsObj.points || 0) + choice.sdgDelta);
    }

    if (Array.isArray(choice.setFlags)) this._applyFlags(choice.setFlags);

    if (choice.nextNodeId) {
      const nextNode = this._getNode(choice.nextNodeId);
      if (nextNode) {
        this.currentNodeId = choice.nextNodeId;
        this.currentNode = nextNode;
        this._pendingChoices = null;
        this._showCurrentNode();
        return;
      }
    }

    this._runNodeCompletion(this.currentNode);
    this.endDialogue();
  }

  _handleNodeComplete(node) {
    const oc = node?.onComplete;
    if (!oc) return;
    if (Array.isArray(oc.setFlags)) this._applyFlags(oc.setFlags);
    if (oc.unlockExit) emit("sceneExitUnlocked", { sceneId: this.sceneConfig?.id, exitFlag: this.sceneConfig?.exitUnlockedFlag });
  }

  _runNodeCompletion(node) { this._handleNodeComplete(node); }

  _applyFlags(flags) {
    if (!Array.isArray(flags)) return;
    flags.forEach(f => this.scene.registry.set(f, true));
    emit("flagsUpdated", flags);
  }

  _getDisplayName(speaker) {
    const map = { friend: "Friend", friendA: "FRIEND A", friendB: "FRIEND B", professor: "Professor" };

    // UPDATED: If no speaker is provided, or explicitly "narrator", return "Narrator"
    if (!speaker || speaker === "narrator") return "Narrator";
    if (speaker === "system") return "Next Objective";

    return map[speaker] || speaker;
  }

  _getNode(nodeId) { return this.nodesById[nodeId] || null; }

  _destroy() {
    if (this.typeTimer) this.typeTimer.remove();
    this._clearChoices();
    this.container?.destroy();
    this.scene.input.keyboard.off("keydown", this._onKeyDown);
  }
}