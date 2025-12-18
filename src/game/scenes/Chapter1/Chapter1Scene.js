// import Phaser from "phaser";
// import Player from "../objects/Player";
// import DialogueManager from "../objects/DialogueManager";
// import { SceneManager } from "../../utils/sceneManager";
// import { emit, on } from "../../utils/eventBus";
// import { addSDGPoints, getPoints } from "../../utils/sdgPoints";
// import TooltipManager from "../objects/TooltipManager";
// import NPCIndicator from "../objects/NPCIndicator";
// import InteractionPanel from "../objects/InteractionPanel";

// export default class Chapter1Scene extends Phaser.Scene {
//     constructor() {
//         super("Chapter1Scene");
//         this._currentScaleFactor = 1; // default
//         this.hallway = {
//             topY: 740, //okk
//             bottomY: 1077, //okk
//             leftTopX: 720, //ok, needs to avoid door
//             rightTopX: 1130, //ok, needs to avoid locker
//             leftBottomX: 490, //ok, needs to avoid npc pinky
//             rightBottomX: 1600
//         };
//         localStorage.setItem("sdgExplorer:lastRoute", "/game");
//         // or "/game?chapter=1&scene=2" if you support deep links

//     }

//     init(data) {
//         this.sdgPointsObj = { points: data?.sdgPoints || getPoints() || 0 };
//         // Objective tracking
//         this.trashCollected = 0;
//         this.trashGoal = 2;
//         this.objectiveCompleted = false;
//         this.objectiveStep = 1;      // 1 = NPC/door, 2 = trash
//         this.activeConversation = null; // "npcgirl", "npcboy", "noticeboard", etc.

//     }

//     preload() {
//         // this.load.atlas(
//         //     "ladyy",
//         //     "assets/images/characters/ladyy.png",
//         //     "assets/images/characters/spritesheet.json"
//         // );

//         // NEW JSON (your final chapter script)
//         this.load.json("chapter1Data", "data/dialogues/chapters/chapter1_script.json");

//         this.load.pack("assets-pack", "assets/assets-pack.json");
//     }

//     create() {
//         // this._createDebug();
//         this._createUILayer();
//         this._createCameraAndBackground();
//         this._createPlayer();
//         this._createNPCsAndProps();
//         this._createDialogueAndUI();
//         this._createTrashObjective();
//         this._createInput();
//         // this._createNextZone();
//         this._createDoorExit();
//         this._startIntroDialogue();    // 👈 new helper, see below

//         // ✅ PRIMARY: talk to friend, unlock next area
//         emit("updateObjective", {
//             slot: "primary",
//             collected: 0,
//             goal: 1,
//             description: "Talk to your friend and unlock the next area.",
//             complete: false,
//         });

//         // ✅ SECONDARY PREVIEW: trash (locked until primary done)
//         emit("updateObjective", {
//             slot: "secondary",
//             preview: true,
//             active: false,
//             collected: 0,
//             goal: 2,
//             description: "Collect 2 pieces of trash around the hallway.",
//         });


//         // 🔗 OLD: you can keep this, but it clearly isn't firing for npcgirl
//         // on("dialogueEnded", () => this._handleDialogueEnded());

//         // 🔗 Listen for the specific system line that changes the objective
//         // 🔗 Listen for DialogueManager's unlock event from JSON onComplete
//         // on("sceneExitUnlocked", (payload) => {
//         this._onSceneExitUnlocked = (payload) => {
//             const { sceneId, exitFlag } = payload || {};

//             console.log("[Chapter1Scene] sceneExitUnlocked:", sceneId, exitFlag);

//             // This matches your JSON for the hallway scene
//             if (
//                 sceneId === "hallway" &&
//                 exitFlag === "chapter1_scene1_exit_unlocked" &&
//                 this.objectiveStep === 1 &&
//                 !this.objectiveCompleted
//             ) {
//                 console.log("[Chapter1Scene] Completing Objective 1 + unlocking door from sceneExitUnlocked.");

//                 this._handleNPCObjectiveComplete(); // updates RightSidebar, sets Step 2 (trash)
//                 this._unlockDoorGlow();             // door tint + glow
//             }
//         }

//         on("sceneExitUnlocked", this._onSceneExitUnlocked);

//         this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
//             // only if your eventBus supports off()
//             if (typeof off === "function") off("sceneExitUnlocked", this._onSceneExitUnlocked);
//         });
//     }

//     _startIntroDialogue() {
//         if (!this.dialogueManager) {
//             console.warn("[Scene] dialogueManager not ready, cannot start intro dialogue.");
//             return;
//         }

//         // If you want to use the JSON's startNodeId:
//         this.time.delayedCall(400, () => {
//             this.dialogueManager.startDialogue();
//         });

//         // OR if you want a specific node:
//         // this.dialogueManager.startDialogue("h_intro_narration");  // hallway
//         // this.dialogueManager.startDialogue("c_intro_prof");       // classroom
//     }
//     _createDebug() {
//         // Create graphics in create()
//         this.debugGraphics = this.add.graphics()
//             .setDepth(9998)
//             .setScrollFactor(1);  // follows world;

//         this._drawHallwayPolygon();

//         // this.debugGraphics.lineStyle(2, 0xff0000, 1); // red border, thickness 2

//         // const { topY, bottomY, leftTopX, rightTopX, leftBottomX, rightBottomX } = this.hallway;

//         // this.debugGraphics.fillStyle(0x00ff00, 0.2); // green, semi-transparent
//         // this.debugGraphics.fillPoints([
//         //     new Phaser.Geom.Point(leftTopX, topY),
//         //     new Phaser.Geom.Point(rightTopX, topY),
//         //     new Phaser.Geom.Point(rightBottomX, bottomY),
//         //     new Phaser.Geom.Point(leftBottomX, bottomY)
//         // ], true);

//         // // // // this.debugGraphics.fillCircle(this.player.x, this.player.y, 5);
//         // this.debugGraphics.setDepth(10); // adjust as needed

//         // After creating ladyPlayer
//         this.playerDebug = this.add.graphics()
//             .setDepth(9999)
//             .setScrollFactor(1); // world space



//     }

//     _createUILayer() {

//         // ==============================
//         // UI LAYER — FIXED TO SCREEN
//         // ==============================
//         this.uiLayer = this.add.container(0, 0)
//             .setScrollFactor(0)
//             .setDepth(9999);
//     }

//     _createCameraAndBackground() {
//         // ==============================
//         // CAMERA + BG + PLAYER
//         // ==============================
//         this.cameras.main.setBackgroundColor("#000000");
//         this.cameras.main.fadeIn(1000, 0, 0, 0);

//         this.bg = this.add.image(0, 0, "bgHallway")
//             .setOrigin(0)
//             .setScrollFactor(1)
//             .setDepth(-10)
//             .setDisplaySize(this.scale.width, this.scale.height);

//         this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
//         this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
//     }

//     _createPlayer() {
//         this.ladyPlayer = this.physics.add.sprite(1400, 900, "ladyy", "frame1.png")
//             .setBounce(0.2)
//             .setCollideWorldBounds(true)
//             .setDepth(1000)
//             .setOrigin(0.5, 1);   // 👈 pivot now at the feet

//         this.playerShadow = this.add.ellipse(
//             this.ladyPlayer.x,
//             this.ladyPlayer.y + 50,
//             40,
//             15,
//             0x000000,
//             0.2
//         ).setDepth(4);

//         this.anims.create({
//             key: "walk",
//             frames: this.anims.generateFrameNames("ladyy", {
//                 start: 1,
//                 end: 6,
//                 prefix: "frame",
//                 suffix: ".png"
//             }),
//             frameRate: 10,
//             repeat: -1
//         });

//         this.anims.create({
//             key: "idle",
//             frames: [{ key: "ladyy", frame: "frame1.png" }],
//             frameRate: 20
//         });
//     }

//     _createNPCsAndProps() {
//         // ==============================
//         // NPC (FRIEND IN HALLWAY)
//         // ==============================
//         this.npcboy = this.add.image(480, 762, "npcboy")
//             .setScale(0.4)
//             .setInteractive({ useHandCursor: true })
//             .setDepth(10);

//         this.npcgirl = this.add.image(1700, 740, "npcgirl")
//             .setScale(0.3)
//             .setInteractive({ useHandCursor: true })
//             .setDepth(10);


//         // IMPORTANT: tie this NPC to the hallway dialogue
//         // We’ll start from "h_intro_narration" (your JSON's startNodeId)
//         this.npcboy.dialogueId = "h_intro_narration";
//         this.npcgirl.dialogueId = "h_friends_start";


//         this.npcIndicator = new NPCIndicator(this, this.npcboy);
//         this.npcIndicator2 = new NPCIndicator(this, this.npcgirl);

//         // ==============================
//         // NOTICE BOARD PROP
//         // ==============================
//         this.noticeBoard = this.add.image(330, 355, "noticeboard") // 👈 pick your x,y
//             .setScale(1.0)
//             .setInteractive({ useHandCursor: true })
//             .setDepth(9); // a bit behind NPCs if you want

//         // This id MUST match a node id in your JSON later.
//         this.noticeBoard.dialogueId = "h_noticeboard";
//     }

//     _createDialogueAndUI() {
//         // ==============================
//         // DIALOGUE / TOOLTIP / PANEL
//         // ==============================
//         const chapterData = this.cache.json.get("chapter1Data");
//         console.log("[Chapter1Scene] chapterData:", chapterData);

//         // Pull out the "hallway" scene from your JSON
//         const hallwayScene = chapterData?.scenes?.find(s => s.id === "hallway");

//         if (!hallwayScene) {
//             console.error("[Chapter1Scene] hallway scene not found in chapter1Data.json", chapterData);
//         }

//         // We pass ONLY the hallway scene to DialogueManager
//         // so this scene is focused on that part of the story.
//         this.dialogueManager = new DialogueManager(
//             this,
//             hallwayScene || {},      // fail-safe so it doesn't explode if undefined
//             this.sdgPointsObj,
//             this.uiLayer
//         );

//         this.tooltipManager = new TooltipManager(this, this.uiLayer);
//         this.interactionPanel = new InteractionPanel(this, this.uiLayer);

//         // NPC click → show tooltip (then your TooltipManager can call startDialogue)
//         this.npcboy.on("pointerdown", () => {
//             this.activeConversation = "npcboy";   // 👈 add this
//             this.tooltipManager.show(
//                 this.npcboy.x,
//                 this.npcboy.y - this.npcboy.displayHeight / 2,
//                 this.npcboy
//             );
//         });
//         this.npcgirl.on("pointerdown", () => {
//             this.activeConversation = "npcgirl";  // 👈 add this
//             this.tooltipManager.show(
//                 this.npcgirl.x,
//                 this.npcgirl.y - this.npcgirl.displayHeight / 2,
//                 this.npcgirl
//             );
//         });
//         // NOTICE BOARD click → show tooltip
//         this.noticeBoard.on("pointerdown", () => {
//             this.tooltipManager.show(
//                 this.noticeBoard.x,
//                 this.noticeBoard.y - this.noticeBoard.displayHeight / 2,
//                 this.noticeBoard
//             );
//         });
//     }

//     // _handleNPCObjectiveComplete() {
//     //     // Only if we are actually on step 1 and not already done
//     //     if (this.objectiveStep !== 1 || this.objectiveCompleted) return;

//     //     this.objectiveCompleted = true;

//     //     // ✅ Mark Objective 1 as done in the RightSidebar (0/1 -> 1/1)
//     //     emit("updateObjective", 1);

//     //     // Optional reward for finishing the convo + unlocking door
//     //     emit("updateSDGPoints", 10);
//     //     emit("badgeEarned", "Hallway Unlocked! 🔓");

//     //     // 👉 Move to Objective 2: trash
//     //     this.objectiveStep = 2;
//     //     this.objectiveCompleted = false;
//     //     this.trashCollected = 0;
//     //     this.trashGoal = 2;

//     //     // Set the new objective in the RightSidebar
//     //     emit("updateObjective", {
//     //         collected: 0,
//     //         goal: this.trashGoal,
//     //         description: "Collect 2 pieces of trash around the hallway.",
//     //     });
//     // }

//     _handleNPCObjectiveComplete() {
//         if (this.objectiveStep !== 1 || this.objectiveCompleted) return;

//         this.objectiveCompleted = true;

//         // ✅ Mark primary as done (1/1, complete)
//         emit("updateObjective", {
//             slot: "primary",
//             delta: 1,      // move 0/1 → 1/1
//             complete: true
//         });

//         // Optional reward
//         emit("updateSDGPoints", 10);
//         emit("badgeEarned", "Hallway Unlocked! 🔓");

//         // 👉 Move to Step 2: trash
//         this.objectiveStep = 2;
//         this.objectiveCompleted = false;
//         this.trashCollected = 0;
//         this.trashGoal = 2;

//         // 🔓 Promote secondary: from 'preview' to active
//         emit("updateObjective", {
//             slot: "secondary",
//             active: true,
//             preview: false,
//             collected: 0,
//             goal: this.trashGoal,
//             description: "Collect 2 pieces of trash around the hallway.",
//         });
//     }


//     // _createTrashObjective() {
//     //     // ==============================
//     //     // TRASH OBJECTIVE (UNCHANGED)
//     //     // ==============================
//     //     this.trash1 = this.add.image(900, 900, "trash1")
//     //         .setInteractive()
//     //         .setScale(0.3);

//     //     this.trash2 = this.add.image(900, 800, "trash2")
//     //         .setInteractive()
//     //         .setScale(0.2);

//     //     this.trash1.on("pointerdown", () => this.handleTrashClick(this.trash1));
//     //     this.trash2.on("pointerdown", () => this.handleTrashClick(this.trash2));

//     //     emit("updateObjective", {
//     //         collected: this.trashCollected,
//     //         goal: this.trashGoal
//     //     });
//     // }

//     _createTrashObjective() {
//         // ==============================
//         // TRASH OBJECTIVE
//         // ==============================
//         this.trash1 = this.add.image(900, 900, "trash1")
//             .setInteractive()
//             .setScale(0.3);

//         this.trash2 = this.add.image(900, 800, "trash2")
//             .setInteractive()
//             .setScale(0.2);

//         this.trash1.on("pointerdown", () => this.handleTrashClick(this.trash1));
//         this.trash2.on("pointerdown", () => this.handleTrashClick(this.trash2));

//         // ❌ REMOVE this, it was overwriting Objective 1:
//         // emit("updateObjective", {
//         //     collected: this.trashCollected,
//         //     goal: this.trashGoal
//         // });
//     }


//     _createInput() {
//         // ==============================
//         // INPUT
//         // ==============================
//         this.keys = this.input.keyboard.addKeys({
//             up: Phaser.Input.Keyboard.KeyCodes.W,
//             down: Phaser.Input.Keyboard.KeyCodes.S,
//             left: Phaser.Input.Keyboard.KeyCodes.A,
//             right: Phaser.Input.Keyboard.KeyCodes.D,
//         });
//     }

//     // _createNextZone() {
//     //     // ==============================
//     //     // NEXT ZONE (EXIT TO CLASSROOM)
//     //     // ==============================

//     //     // Door zone settings (tweak these to line up with your door)
//     //     const DOOR_X = 600;      // center X of the door in world space
//     //     const DOOR_Y = 580;      // center Y of the door in world space
//     //     const DOOR_WIDTH = 70;  // width of the door zone
//     //     const DOOR_HEIGHT = 380; // height of the door zone

//     //     this.nextZone = this.add.zone(DOOR_X, DOOR_Y, DOOR_WIDTH, DOOR_HEIGHT);
//     //     // this.nextZone = this.add
//     //     //     .zone(1000, 700)
//     //     //     .setSize(200, 150);  // width 200, height 150
//     //     this.physics.world.enable(this.nextZone);
//     //     this.nextZone.body.setAllowGravity(false);
//     //     this.nextZone.body.setImmovable(true);
//     //     // this.nextZone.setVisible(false);
//     //     this.nextZoneVisible = false;
//     //     this.playerInNextZone = false; // 👈 NEW

//     //     // Debug red box for the zone
//     //     this.nextZoneDebug = this.add.graphics()
//     //         .setDepth(9998);

//     //     this.nextZoneDebug.lineStyle(2, 0xff0000, 1);
//     //     this.nextZoneDebug.strokeRect(
//     //         DOOR_X - DOOR_WIDTH / 2,
//     //         DOOR_Y - DOOR_HEIGHT / 2,
//     //         DOOR_WIDTH,
//     //         DOOR_HEIGHT
//     //     );


//     //     const zoneIndicator = this.add.graphics()
//     //         .fillStyle(0x00ff00, 0.3)
//     //         .fillRect(this.nextZone.x - 450, this.nextZone.y - 250, 100, 100)
//     //         .setVisible(true); // hide until unlocked

//     //     // Make the indicator clickable
//     //     zoneIndicator.setInteractive(
//     //         new Phaser.Geom.Rectangle(this.nextZone.x - 50, this.nextZone.y - 50, 100, 100),
//     //         Phaser.Geom.Rectangle.Contains
//     //     ).on("pointerdown", () => {
//     //         // Only go to next scene if:
//     //         // - zone is unlocked
//     //         // - player is physically in the zone
//     //         if (this.nextZoneVisible && this.playerInNextZone) {
//     //             this.goToNextScene();
//     //         }
//     //     });


//     //     this.zoneIndicator = zoneIndicator;

//     //     // Optional pulsing tween (just for visual feedback)
//     //     this.tweens.add({
//     //         targets: this.nextZone,
//     //         alpha: { from: 0.3, to: 0.7 },
//     //         duration: 1000,
//     //         yoyo: true,
//     //         repeat: -1
//     //     });

//     //     // When dialogue ends, unlock + show the clickable zone
//     //     this.events.on("dialogueEnded", () => {
//     //         this.nextZoneVisible = true;
//     //         this.nextZone.setVisible(true);
//     //         this.zoneIndicator.setVisible(true); // 👈 show the clickable highlight
//     //     });
//     // }

//     _createDoorExit() {
//         // 1) Door visual
//         const DOOR_X = 610;
//         const DOOR_Y = 587;
//         const DOOR_WIDTH = 120;
//         const DOOR_HEIGHT = 220;

//         this.door = this.add.image(DOOR_X, DOOR_Y, "classroomDoor")
//             .setInteractive({ useHandCursor: true })
//             .setDepth(10);

//         // 🚫 Door starts locked
//         this.doorUnlocked = false;
//         this.doorGlowTween = null;

//         // 2) Physics zone around door (exit area)
//         this.exitZone = this.add.zone(DOOR_X, DOOR_Y, DOOR_WIDTH, DOOR_HEIGHT);
//         this.physics.world.enable(this.exitZone);
//         this.exitZone.body.setAllowGravity(false);
//         this.exitZone.body.setImmovable(true);

//         // 3) Debug box so you SEE the invisible zone
//         // this.exitZoneDebug = this.add.graphics().setDepth(9998);
//         // this.exitZoneDebug.lineStyle(2, 0xff0000, 1);
//         // this.exitZoneDebug.strokeRect(
//         //     DOOR_X - DOOR_WIDTH / 2,
//         //     DOOR_Y - DOOR_HEIGHT / 2,
//         //     DOOR_WIDTH,
//         //     DOOR_HEIGHT
//         // );


//         // 4) Flag to know if player is inside the zone
//         this.playerInExitZone = false;

//         // 5) Door click → only go next if player is inside zone
//         this.door.on("pointerdown", () => {
//             if (!this.doorUnlocked) {
//                 console.log("The door is locked. Talk to your friend first.");
//                 return;
//             }

//             if (this.playerInExitZone) {
//                 this.goToNextScene();
//             } else {
//                 console.log("Too far from the door.");
//             }
//         });

//     }

//     _unlockDoorGlow() {
//         if (this.doorUnlocked || !this.door) return;

//         this.doorUnlocked = true;

//         // Visual feedback
//         this.door.setTint(0x88ffcc);

//         this.doorGlowTween = this.tweens.add({
//             targets: this.door,
//             alpha: { from: 0.6, to: 1 },
//             duration: 800,
//             yoyo: true,
//             repeat: 1,
//             ease: "Sine.easeInOut",
//         });
//         console.log("[Door] unlocked =", this.doorUnlocked);

//     }

//     _drawHallwayPolygon() {
//         const g = this.debugGraphics;
//         const { topY, bottomY, leftTopX, rightTopX, leftBottomX, rightBottomX } = this.hallway;

//         g.clear();

//         // Hallway polygon outline (green)
//         g.lineStyle(2, 0x00ff00, 1);
//         g.strokePoints(
//             [
//                 new Phaser.Geom.Point(leftTopX, topY),
//                 new Phaser.Geom.Point(rightTopX, topY),
//                 new Phaser.Geom.Point(rightBottomX, bottomY),
//                 new Phaser.Geom.Point(leftBottomX, bottomY)
//             ],
//             true
//         );

//         // Top and bottom lines (optional, for clarity)
//         g.lineStyle(1, 0x00ffff, 0.6);
//         g.strokeLineShape(new Phaser.Geom.Line(leftTopX, topY, rightTopX, topY));
//         g.strokeLineShape(new Phaser.Geom.Line(leftBottomX, bottomY, rightBottomX, bottomY));
//     }


//     goToNextScene() {
//         this.nextZoneVisible = false;

//         // ✅ Tell React UI that Chapter 1 is completed; put this in scene 3. Cafeteria
//         emit("updateChapterProgress", 1);

//         this.cameras.main.fadeOut(800);
//         this.cameras.main.once("camerafadeoutcomplete", () => {
//             SceneManager.nextScene(this, getPoints());
//         });
//     }

//     // _handleDialogueEnded() {
//     //     console.log("[Chapter1Scene] dialogueEnded fired. step:", this.objectiveStep, "activeConversation:", this.activeConversation);


//     //     if (
//     //         this.objectiveStep === 1 &&
//     //         !this.objectiveCompleted &&
//     //         this.activeConversation === "npcgirl"
//     //     ) {
//     //         console.log("[Chapter1Scene] Completing NPC objective for npcgirl.");
//     //         this._handleNPCObjectiveComplete();
//     //         this._unlockDoorGlow();
//     //     }

//     //     this.activeConversation = null;
//     // }
//     _handleDialogueEnded(payload) {
//         const { sceneId, lastNodeId } = payload || {};

//         console.log(
//             "[Chapter1Scene] dialogueEnded fired.",
//             "sceneId:", sceneId,
//             "lastNodeId:", lastNodeId,
//             "step:", this.objectiveStep,
//             "activeConversation:", this.activeConversation
//         );

//         // Only react when:
//         // - we’re in the hallway scene from JSON
//         // - we just finished the h_objective_update node
//         // - we’re still on Objective Step 1
//         if (
//             sceneId === "hallway" &&
//             lastNodeId === "h_objective_update" &&
//             this.objectiveStep === 1 &&
//             !this.objectiveCompleted
//         ) {
//             console.log("[Chapter1Scene] Completing NPC objective after hallway dialogue.");

//             // In case activeConversation got lost, we can force it:
//             this.activeConversation = "npcgirl";

//             this._handleNPCObjectiveComplete();
//             this._unlockDoorGlow();
//         }

//         // Reset so next convo starts clean
//         this.activeConversation = null;
//     }


//     showNPCInfo(npcboy) {
//         console.log(`${npcboy.name} is a villager from the forest.`);
//     }

//     // UPDATED: default start node now matches your hallway JSON
//     startDialogue(startNodeId = "h_intro_narration") {
//         if (!this.dialogueManager) {
//             console.warn("DialogueManager not initialized!");
//             return;
//         }

//         console.log(`Starting dialogue from node: ${startNodeId}`);
//         // Assumes your DialogueManager now treats the argument as a nodeId
//         this.dialogueManager.startDialogue(startNodeId);
//     }

//     handleTrashClick(trashItem) {
//         if (!trashItem.scene) return;

//         // Ignore trash until Objective 2 is active
//         if (this.objectiveStep !== 2) {
//             console.log("Trash collection is not active yet.");
//             return;
//         }

//         const points = 3; // points per trash

//         // 1) Update your core SDG system
//         addSDGPoints(points);

//         // 2) Also push it to the React sidebar (RightSidebar listens to this)
//         emit("updateSDGPoints", points);

//         // 3) Floating +points text in the scene
//         const msg = this.add.text(trashItem.x, trashItem.y - 40, `+${points} SDG Points!`, {
//             font: "16px Arial",
//             fill: "#0f0",
//         }).setOrigin(0.5);

//         this.tweens.add({
//             targets: msg,
//             y: msg.y - 50,
//             alpha: 0,
//             duration: 1000,
//             ease: "Power2",
//             onComplete: () => msg.destroy()
//         });

//         trashItem.destroy();

//         // 4) Update local count + objective bar (SECONDARY)
//         this.trashCollected++;
//         emit("updateObjective", {
//             slot: "secondary",
//             delta: 1,
//         });

//         // 5) Check if trash objective (Step 2) is done
//         if (!this.objectiveCompleted &&
//             this.objectiveStep === 2 &&
//             this.trashCollected >= this.trashGoal) {

//             this.objectiveCompleted = true;

//             // Badge for finishing trash objective
//             emit("badgeEarned", "Eco Warrior! 🏅");


//             // If you want a Step 3 later:
//             // this.objectiveStep = 3;
//             // emit("updateObjective", {
//             //   collected: 0,
//             //   goal: 1,
//             //   description: "Go to the classroom door to continue.",
//             // });
//         }
//     }

//     update(time, delta) {
//         this._updateNPCIndicators();
//         this._updateMovement();
//         this._updateDepthScaleAndClamp();
//         this._updateShadow();
//         // this._updateNextZoneOverlap();
//         this._updateExitZoneOverlap();  // 👈 just one clean call
//     }

//     _updateNPCIndicators() {
//         // ============================================================
//         // NPC INDICATOR(S)
//         // ============================================================
//         if (this.npcboy && this.npcIndicator) {
//             const d1 = Phaser.Math.Distance.Between(
//                 this.ladyPlayer.x, this.ladyPlayer.y,
//                 this.npcboy.x, this.npcboy.y
//             );

//             if (d1 < 150) this.npcIndicator.show();
//             else this.npcIndicator.hide();

//             this.npcIndicator.update();
//         }

//         if (this.npcgirl && this.npcIndicator2) {
//             const d1 = Phaser.Math.Distance.Between(
//                 this.ladyPlayer.x, this.ladyPlayer.y,
//                 this.npcgirl.x, this.npcgirl.y
//             );

//             if (d1 < 150) this.npcIndicator2.show();
//             else this.npcIndicator2.hide();

//             this.npcIndicator2.update();
//         }
//         // If you have npcgirl / npcIndicator2, you can copy the block above.
//     }

//     _updateMovement() {
//         // ============================================================
//         // MOVEMENT
//         // ============================================================
//         const playerSpeed = 150;
//         let velocityX = 0;
//         let velocityY = 0;

//         if (this.keys.left.isDown) velocityX = -playerSpeed;
//         else if (this.keys.right.isDown) velocityX = playerSpeed;

//         if (this.keys.up.isDown) velocityY = -playerSpeed;
//         else if (this.keys.down.isDown) velocityY = playerSpeed;

//         this.ladyPlayer.setVelocity(velocityX, velocityY);

//         // Animations
//         if (velocityX !== 0 || velocityY !== 0) {
//             this.ladyPlayer.anims.play("walk", true);
//             this.ladyPlayer.setFlipX(velocityX > 0);
//         } else {
//             this.ladyPlayer.anims.play("idle", true);
//         }
//     }

//     _updateDepthScaleAndClamp() {
//         // ============================================================
//         // DEPTH, SCALE, HALLWAY CLAMP
//         // ============================================================
//         const {
//             topY,
//             bottomY,
//             leftTopX,
//             rightTopX,
//             leftBottomX,
//             rightBottomX
//         } = this.hallway;

//         const depthRange = bottomY - topY;

//         // Clamp Y first so it's always inside the path
//         this.ladyPlayer.y = Phaser.Math.Clamp(this.ladyPlayer.y, topY, bottomY);

//         // 0 at top, 1 at bottom, based on FEET (origin 0.5,1)
//         let t = (this.ladyPlayer.y - topY) / depthRange;
//         t = Phaser.Math.Clamp(t, 0, 1);

//         // === SCALE (this is the part you care about) ===
//         const scaleFar = 0.7;  // at topY (740)
//         const scaleNear = 1.4;  // at bottomY (1077)
//         const scaleFactor = Phaser.Math.Linear(scaleFar, scaleNear, t);

//         this.ladyPlayer.setScale(scaleFactor);

//         // 👇 stash it on "this" so other methods can use it
//         this._currentScaleFactor = scaleFactor;

//         // // === HALLWAY X CLAMP (trapezoid) ===
//         const minX = Phaser.Math.Linear(leftTopX, leftBottomX, t);
//         const maxX = Phaser.Math.Linear(rightTopX, rightBottomX, t);
//         this.ladyPlayer.x = Phaser.Math.Clamp(this.ladyPlayer.x, minX, maxX);
//     }

//     _updateShadow() {
//         const scale = this._currentScaleFactor ?? 1; // fallback to 1 if not set
//         // ============================================================
//         // SHADOW
//         // ============================================================
//         this.playerShadow.x = this.ladyPlayer.x;
//         this.playerShadow.y = this.ladyPlayer.y + 10;  // just under feet
//         this.playerShadow.setDepth(this.ladyPlayer.depth - 1);

//         this.playerShadow.scaleX = scale;
//         this.playerShadow.scaleY = scale * 0.4;
//     }

//     // _updateNextZoneOverlap() {
//     //     // ============================================================
//     //     // NEXT ZONE OVERLAP
//     //     // ============================================================

//     //     // Track if player is inside the zone, but DON'T auto-transition
//     //     this.playerInNextZone = false;

//     //     if (this.nextZoneVisible) {
//     //         this.physics.world.overlap(
//     //             this.ladyPlayer,
//     //             this.nextZone,
//     //             () => {
//     //                 this.playerInNextZone = true;
//     //             },
//     //             null,
//     //             this
//     //         );
//     //     }

//     // }
//     _updateExitZoneOverlap() {
//         this.playerInExitZone = false;

//         if (!this.exitZone) return;

//         this.physics.world.overlap(
//             this.ladyPlayer,
//             this.exitZone,
//             () => {
//                 this.playerInExitZone = true;
//             },
//             null,
//             this,
//         );
//     }
// }
import BaseStoryScene from "../BaseStoryScene";
import { emit, on /*, off*/ } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";

export default class Chapter1Scene extends BaseStoryScene {
    constructor() {
        super("Chapter1Scene", {
            sceneId: "hallway",
            jsonKey: "chapter1Data",
            jsonPath: "data/dialogues/chapters/chapter1_script.json",

            backgroundKey: "bgHallway",
            startNodeId: "h_intro_narration",
            exitUnlockedFlag: "chapter1_scene1_exit_unlocked",

            walkArea: {
                topY: 740,
                bottomY: 1077,
                leftTopX: 720,
                rightTopX: 1130,
                leftBottomX: 490,
                rightBottomX: 1600,
            },

            door: { x: 610, y: 587, w: 120, h: 220, texture: "classroomDoor" },

            npcs: [
                { name: "npcboy", texture: "npcboy", x: 480, y: 762, scale: 0.4, dialogueId: "h_intro_narration" },
                { name: "npcgirl", texture: "npcgirl", x: 1700, y: 740, scale: 0.3, dialogueId: "h_friends_start" },
                { name: "noticeBoard", texture: "noticeboard", x: 330, y: 355, scale: 1.0, dialogueId: "h_noticeboard" },
            ],
        });

        // objectives
        this.objectiveStep = 1;         // 1 = talk, 2 = trash
        this.objectiveCompleted = false;

        this.trashCollected = 0;
        this.trashGoal = 2;

        // bind storage route
        localStorage.setItem("sdgExplorer:lastRoute", "/game");
    }

    create() {
        super.create();
        emit("updateChapterScene", { title: "Hallway · Chapter 1" });

    }

    // --------------------------------
    // Called after BaseStoryScene.create()
    // --------------------------------
    _customCreate() {
        // Primary: talk to friend
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            description: "Talk to your friend and unlock the next area.",
            complete: false,
        });

        // Secondary: trash (preview only until step 2)
        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.trashGoal,
            description: "Optional: Collect 2 pieces of trash around the hallway.",
        });

        this._createTrash();

        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "hallway") return;
            if (exitFlag !== "chapter1_scene1_exit_unlocked") return;

            if (this.objectiveStep === 1 && !this.objectiveCompleted) {
                this._completeStep1AndUnlock();
            }
        };

        on("sceneExitUnlocked", this._onSceneExitUnlocked);

        // Cleanup (only if your bus supports off())
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            // if (typeof off === "function") off("sceneExitUnlocked", this._onSceneExitUnlocked);
        });
    }

    // --------------------------------
    // Step 1 -> Step 2 transition
    // --------------------------------
    _completeStep1AndUnlock() {
        this.objectiveCompleted = true;

        emit("updateObjective", {
            slot: "primary",
            delta: 1,
            complete: true,
        });

        emit("updateSDGPoints", 10);
        emit("badgeEarned", "Hallway Unlocked! 🔓");

        // unlock door visuals + logic (BaseStoryScene has the glow helper)
        this.doorUnlocked = true;
        this._unlockDoorGlow?.();

        // Step 2: trash becomes active
        this.objectiveStep = 2;
        this.objectiveCompleted = false;
        this.trashCollected = 0;

        emit("updateObjective", {
            slot: "secondary",
            active: true,
            preview: false,
            collected: 0,
            goal: this.trashGoal,
            description: "Collect 2 pieces of trash around the hallway.",
        });
    }

    // --------------------------------
    // Trash
    // --------------------------------
    _createTrash() {
        this.trash1 = this.add.image(900, 900, "trash1").setInteractive({ useHandCursor: true }).setScale(0.3);
        this.trash2 = this.add.image(900, 800, "trash2").setInteractive({ useHandCursor: true }).setScale(0.2);

        this.trash1.on("pointerdown", () => this._handleTrashClick(this.trash1));
        this.trash2.on("pointerdown", () => this._handleTrashClick(this.trash2));
    }

    _handleTrashClick(trashItem) {
        if (!trashItem?.scene) return;

        // trash only active in step 2
        if (this.objectiveStep !== 2) return;

        const points = 3;
        addSDGPoints(points);
        emit("updateSDGPoints", points);

        // small floating text
        const msg = this.add.text(trashItem.x, trashItem.y - 40, `+${points}`, {
            font: "16px Arial",
            fill: "#0f0",
        }).setOrigin(0.5);

        this.tweens.add({
            targets: msg,
            y: msg.y - 40,
            alpha: 0,
            duration: 700,
            onComplete: () => msg.destroy(),
        });

        trashItem.destroy();

        this.trashCollected += 1;

        emit("updateObjective", {
            slot: "secondary",
            delta: 1,
        });

        if (!this.objectiveCompleted && this.trashCollected >= this.trashGoal) {
            this.objectiveCompleted = true;
            emit("badgeEarned", "Eco Warrior! 🏅");
            emit("updateObjective", { slot: "secondary", complete: true });
        }
    }

    // --------------------------------
    // Door click override: locked until unlocked
    // --------------------------------
    _onDoorClicked() {
        if (!this.doorUnlocked) {
            console.log("Door locked. Talk to your friend first.");
            return;
        }

        if (this.playerInExitZone) this.goToNextScene();
        else console.log("Too far from the door.");
    }
}
