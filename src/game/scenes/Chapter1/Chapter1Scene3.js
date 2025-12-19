// import Phaser from "phaser";
// import DialogueManager from "../objects/DialogueManager";
// import { SceneManager } from "../../utils/sceneManager";
// import { emit, on, off } from "../../utils/eventBus";
// import { getPoints } from "../../utils/sdgPoints";
// import TooltipManager from "../objects/TooltipManager";
// import NPCIndicator from "../objects/NPCIndicator";
// import InteractionPanel from "../objects/InteractionPanel";

// export default class Chapter1Scene3 extends Phaser.Scene {
//   constructor() {
//     super("Chapter1Scene3");

//     this._currentScaleFactor = 1;

//     // ✅ Update these numbers to match your cafeteria walk area
//     this.cafeteria = {
//       topY: 760,
//       bottomY: 1080,
//       leftTopX: 520,
//       rightTopX: 1250,
//       leftBottomX: 220,
//       rightBottomX: 1650,
//     };
//   }

//   init(data) {
//     this.sdgPointsObj = { points: data?.sdgPoints || getPoints() || 0 };

//     this.objectiveCompleted = false;
//     this.doorUnlocked = false;

//     // for cleanup
//     this._onExitUnlocked = null;
//   }

//   preload() {
//     // ✅ Your script file (same as earlier scenes)
//     this.load.json("chapter1Data", "data/dialogues/chapters/chapter1_script.json");

//     // ✅ Your assets pack must contain:
//     // bgCafeteria, bgCafeteriaDoor, ladyy atlas/frames, NPC sprites
//     this.load.pack("assets-pack", "assets/assets-pack.json");
//   }

//   create() {
//     this._createDebug();
//     this._createUILayer();
//     this._createCameraAndBackground();
//     this._createPlayer();
//     this._createNPCsAndProps();
//     this._createDialogueAndUI();
//     this._createInput();
//     this._createDoorExit();
//     this._startIntroDialogue();

//     // ✅ UI objectives
//     emit("updateObjective", {
//       slot: "primary",
//       collected: 0,
//       goal: 1,
//       description: "Talk to the cafeteria staff to continue.",
//       complete: false,
//     });

//     emit("updateObjective", {
//       slot: "secondary",
//       active: true,
//       collected: 0,
//       goal: 2,
//       description: "Optional: Explore the cafeteria & interact with 2 people.",
//     });

//     // ✅ Door unlock listener (make sure your JSON cafeteria scene emits unlockExit)
//     this._onExitUnlocked = (payload) => {
//       const { sceneId, exitFlag } = payload || {};
//       if (sceneId !== "cafeteria") return;
//       if (exitFlag !== "chapter1_scene3_exit_unlocked") return;

//       if (!this.objectiveCompleted) {
//         this.objectiveCompleted = true;

//         emit("updateObjective", {
//           slot: "primary",
//           delta: 1,
//           complete: true,
//         });

//         this._unlockDoorGlow();
//       }
//     };

//     on("sceneExitUnlocked", this._onExitUnlocked);
//   }

//   shutdown() {
//     // Phaser calls this when scene stops (safe cleanup)
//     if (this._onExitUnlocked) off("sceneExitUnlocked", this._onExitUnlocked);
//   }

//   // ============================================================
//   // CORE HELPERS
//   // ============================================================
//   _createUILayer() {
//     this.uiLayer = this.add.container(0, 0).setScrollFactor(0).setDepth(50000);
//   }

//   _createCameraAndBackground() {
//     this.cameras.main.setBackgroundColor("#000000");
//     this.cameras.main.fadeIn(700, 0, 0, 0);

//     this.bg = this.add.image(0, 0, "bgCafeteria")
//       .setOrigin(0)
//       .setScrollFactor(1)
//       .setDepth(-10)
//       .setDisplaySize(this.scale.width, this.scale.height);

//     this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
//     this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
//   }

//   _createPlayer() {
//     this.ladyPlayer = this.physics.add.sprite(1400, 950, "ladyy", "frame1.png")
//       .setCollideWorldBounds(true)
//       .setDepth(10000)
//       .setOrigin(0.5, 1);

//     // ✅ tighter body (feet collider)
//     this.ladyPlayer.body.setSize(28, 18, true);
//     this.ladyPlayer.body.setOffset(18, 46);

//     this.playerShadow = this.add.ellipse(this.ladyPlayer.x, this.ladyPlayer.y + 10, 40, 15, 0x000000, 0.2)
//       .setDepth(4);

//     this.anims.create({
//       key: "walk",
//       frames: this.anims.generateFrameNames("ladyy", { start: 1, end: 6, prefix: "frame", suffix: ".png" }),
//       frameRate: 10,
//       repeat: -1,
//     });

//     this.anims.create({
//       key: "idle",
//       frames: [{ key: "ladyy", frame: "frame1.png" }],
//       frameRate: 20,
//     });
//   }

//   _createNPCsAndProps() {
//     // ✅ Replace keys & positions with YOUR cafeteria NPCs
//     // Example set:
//     this.npcStaff = this.add.image(980, 620, "cafeteria_staff")
//       .setInteractive({ useHandCursor: true })
//       .setDepth(10)
//       .setScale(1);

//     this.npcFriend1 = this.add.image(720, 820, "cafeteria_friend1")
//       .setInteractive({ useHandCursor: true })
//       .setDepth(10)
//       .setScale(1);

//     this.npcFriend2 = this.add.image(1180, 860, "cafeteria_friend2")
//       .setInteractive({ useHandCursor: true })
//       .setDepth(10)
//       .setScale(1);

//     // ✅ Dialogue nodes (must exist in your JSON cafeteria scene)
//     this.npcStaff.dialogueId = "caf_intro_staff";
//     this.npcFriend1.dialogueId = "caf_friend_1";
//     this.npcFriend2.dialogueId = "caf_friend_2";

//     // Indicators
//     this.indStaff = new NPCIndicator(this, this.npcStaff);
//     this.indF1 = new NPCIndicator(this, this.npcFriend1);
//     this.indF2 = new NPCIndicator(this, this.npcFriend2);
//   }

//   _createDialogueAndUI() {
//     const chapterData = this.cache.json.get("chapter1Data");

//     // ✅ Find cafeteria scene in JSON
//     const cafeteriaScene = chapterData?.scenes?.find((s) => s.id === "cafeteria");
//     if (!cafeteriaScene) console.error("[Chapter1Scene3] cafeteria scene not found.", chapterData);

//     this.dialogueManager = new DialogueManager(
//       this,
//       cafeteriaScene || {},
//       this.sdgPointsObj,
//       this.uiLayer
//     );

//     this.tooltipManager = new TooltipManager(this, this.uiLayer);
//     this.interactionPanel = new InteractionPanel(this, this.uiLayer);

//     const bindTooltip = (obj) => {
//       if (!obj) return;
//       if (!obj.input) obj.setInteractive({ useHandCursor: true });

//       obj.on("pointerdown", () => {
//         this.tooltipManager.show(obj.x, obj.y - obj.displayHeight / 2, obj);
//       });
//     };

//     bindTooltip(this.npcStaff);
//     bindTooltip(this.npcFriend1);
//     bindTooltip(this.npcFriend2);
//   }

//   _createInput() {
//     this.keys = this.input.keyboard.addKeys({
//       up: Phaser.Input.Keyboard.KeyCodes.W,
//       down: Phaser.Input.Keyboard.KeyCodes.S,
//       left: Phaser.Input.Keyboard.KeyCodes.A,
//       right: Phaser.Input.Keyboard.KeyCodes.D,
//     });
//   }

//   _createDoorExit() {
//     // ✅ Replace with your cafeteria door art key + placement
//     const DOOR_X = 300;
//     const DOOR_Y = 580;
//     const DOOR_W = 120;
//     const DOOR_H = 240;

//     this.door = this.add.image(DOOR_X, DOOR_Y, "bgCafeteriaDoor")
//       .setInteractive({ useHandCursor: true })
//       .setDepth(10);

//     // Exit zone
//     this.exitZone = this.add.zone(DOOR_X, DOOR_Y, DOOR_W, DOOR_H);
//     this.physics.add.existing(this.exitZone, true); // ✅ static body

//     this.playerInExitZone = false;

//     this.door.on("pointerdown", () => {
//       if (!this.doorUnlocked) return console.log("Door is locked (finish the staff dialogue).");
//       if (!this.playerInExitZone) return console.log("Too far from the door.");

//       this.goToNextScene();
//     });
//   }

//   _unlockDoorGlow() {
//     if (!this.door || this.doorUnlocked) return;
//     this.doorUnlocked = true;

//     this.door.setTint(0x88ffcc);
//     this.tweens.add({
//       targets: this.door,
//       alpha: { from: 0.6, to: 1 },
//       duration: 650,
//       yoyo: true,
//       repeat: 2,
//       ease: "Sine.easeInOut",
//     });
//   }

//   _startIntroDialogue() {
//     if (!this.dialogueManager) return;
//     this.time.delayedCall(350, () => this.dialogueManager.startDialogue());
//   }

//   // ✅ IMPORTANT: TooltipManager calls this.scene.startDialogue(...)
//   startDialogue(startNodeId) {
//     if (!this.dialogueManager) return;
//     this.dialogueManager.startDialogue(startNodeId);
//   }

//   goToNextScene() {
//     this.cameras.main.fadeOut(600);
//     this.cameras.main.once("camerafadeoutcomplete", () => {
//       SceneManager.nextScene(this, getPoints());
//     });
//   }

//   // ============================================================
//   // UPDATE LOOP
//   // ============================================================
//   update(time, delta) {
//     this._updateNPCIndicators();
//     this._updateMovement(delta);
//     this._updateDepthScale();
//     this._updateWorldDepths();
//     this._updateShadow();
//     this._updateExitZoneOverlap();
//   }

//   _updateNPCIndicators() {
//     const check = (obj, indicator) => {
//       if (!obj || !indicator) return;
//       const d = Phaser.Math.Distance.Between(this.ladyPlayer.x, this.ladyPlayer.y, obj.x, obj.y);
//       d < 150 ? indicator.show() : indicator.hide();
//       indicator.update();
//     };
//     check(this.npcStaff, this.indStaff);
//     check(this.npcFriend1, this.indF1);
//     check(this.npcFriend2, this.indF2);
//   }

//   _updateMovement(delta = 16) {
//     const speed = 150;
//     let vx = 0, vy = 0;

//     if (this.keys.left.isDown) vx = -speed;
//     else if (this.keys.right.isDown) vx = speed;

//     if (this.keys.up.isDown) vy = -speed;
//     else if (this.keys.down.isDown) vy = speed;

//     // ✅ Soft clamp to cafeteria trapezoid (no teleport)
//     const { topY, bottomY, leftTopX, rightTopX, leftBottomX, rightBottomX } = this.cafeteria;
//     const dt = delta / 1000;

//     const nextY = this.ladyPlayer.y + vy * dt;
//     if ((nextY < topY && vy < 0) || (nextY > bottomY && vy > 0)) vy = 0;

//     const depthRange = bottomY - topY;
//     let t = ((this.ladyPlayer.y + vy * dt) - topY) / depthRange;
//     t = Phaser.Math.Clamp(t, 0, 1);

//     const minX = Phaser.Math.Linear(leftTopX, leftBottomX, t);
//     const maxX = Phaser.Math.Linear(rightTopX, rightBottomX, t);

//     const nextX = this.ladyPlayer.x + vx * dt;
//     if ((nextX < minX && vx < 0) || (nextX > maxX && vx > 0)) vx = 0;

//     this.ladyPlayer.setVelocity(vx, vy);

//     if (vx !== 0 || vy !== 0) {
//       this.ladyPlayer.anims.play("walk", true);
//       this.ladyPlayer.setFlipX(vx > 0);
//     } else {
//       this.ladyPlayer.anims.play("idle", true);
//     }
//   }

//   _updateDepthScale() {
//     const { topY, bottomY } = this.cafeteria;
//     const t = Phaser.Math.Clamp((this.ladyPlayer.y - topY) / (bottomY - topY), 0, 1);

//     const scaleFar = 0.7;
//     const scaleNear = 1.4;
//     this._currentScaleFactor = Phaser.Math.Linear(scaleFar, scaleNear, t);

//     this.ladyPlayer.setScale(this._currentScaleFactor);
//   }

//   _updateWorldDepths() {
//     // player depth = feet y
//     this.ladyPlayer.setDepth(Math.floor(this.ladyPlayer.y));

//     const setBaseDepth = (obj) => {
//       if (!obj) return;
//       const baseY = obj.y + obj.displayHeight * (1 - (obj.originY ?? 0.5));
//       obj.setDepth(Math.floor(baseY));
//     };

//     setBaseDepth(this.npcStaff);
//     setBaseDepth(this.npcFriend1);
//     setBaseDepth(this.npcFriend2);
//     setBaseDepth(this.door);
//   }

//   _updateShadow() {
//     const s = this._currentScaleFactor ?? 1;
//     this.playerShadow.x = this.ladyPlayer.x;
//     this.playerShadow.y = this.ladyPlayer.y + 10;
//     this.playerShadow.setDepth(this.ladyPlayer.depth - 1);
//     this.playerShadow.scaleX = s;
//     this.playerShadow.scaleY = s * 0.4;
//   }

//   _updateExitZoneOverlap() {
//     this.playerInExitZone = false;
//     if (!this.exitZone) return;

//     this.physics.world.overlap(this.ladyPlayer, this.exitZone, () => {
//       this.playerInExitZone = true;
//     });
//   }

//   // ============================================================
//   // DEBUG
//   // ============================================================
//   _createDebug() {
//     // comment this out if you don't want any debug
//     this.debugGraphics = this.add.graphics().setDepth(9998).setScrollFactor(1);
//     this._drawCafeteriaPolygon();
//   }

//   _drawCafeteriaPolygon() {
//     if (!this.debugGraphics) return;
//     const g = this.debugGraphics;
//     const { topY, bottomY, leftTopX, rightTopX, leftBottomX, rightBottomX } = this.cafeteria;

//     g.clear();
//     g.lineStyle(2, 0x00ff00, 1);
//     g.strokePoints(
//       [
//         new Phaser.Geom.Point(leftTopX, topY),
//         new Phaser.Geom.Point(rightTopX, topY),
//         new Phaser.Geom.Point(rightBottomX, bottomY),
//         new Phaser.Geom.Point(leftBottomX, bottomY),
//       ],
//       true
//     );
//   }
// }



import BaseStoryScene from "../BaseStoryScene";
import { emit } from "../../../utils/eventBus";


export default class Chapter1Scene3 extends BaseStoryScene {
  constructor() {
    super("Chapter1Scene3", {
      sceneId: "cafeteria",
      jsonKey: "chapter1Data",
      jsonPath: "data/dialogues/chapters/chapter1_script.json",

      backgroundKey: "bgCafeteria",
      startNodeId: "f_intro_friends",
      exitUnlockedFlag: "chapter1_scene3_exit_unlocked",

      // PER SCENE
      walkArea: {
        zones: [
          { xMin: 300, xMax: 600, yMin: 700, yMax: 1000 }, // Hallway
          { xMin: 50, xMax: 1920, yMin: 990, yMax: 1080 } // Floor
        ],
        // Required only for character scaling math
        topY: 700,
        bottomY: 1080
      },


      // perfect scaling values found via tracker:
      scaleFar: 0.80,
      scaleNear: 1.55,
      // Add this if you use Option 1:
      scaleTopOffset: 20,

      door: { x: 200, y: 493, w: 120, h: 220, texture: "bgCafeteriaDoor" },

      npcs: [
        { name: "friendA", texture: "friendA", x: 820, y: 820, scale: 1.0, dialogueId: "f_intro_friends" },
        { name: "friendB", texture: "friendB", x: 980, y: 830, scale: 1.0, dialogueId: "f_intro_friends" }
      ],

      primaryObjective: {
        slot: "primary",
        collected: 0,
        goal: 1,
        description: "Talk to your friends in the cafeteria.",
        complete: false
      }
    });
  }


  create() {
    super.create();
    emit("updateChapterScene", { title: "Cafeteria · Chapter 1" });
  }

  // Optional extras (posters etc.)
  _customCreate() {
    // this._createPosters(); // your per-scene easter eggs live here
  }
}
