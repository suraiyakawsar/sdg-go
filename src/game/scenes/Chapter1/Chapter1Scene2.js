// import Phaser from "phaser";
// import DialogueManager from "../objects/DialogueManager";
// import { SceneManager } from "../../utils/sceneManager";
// import { emit, on } from "../../utils/eventBus";
// import { getPoints } from "../../utils/sdgPoints";
// import TooltipManager from "../objects/TooltipManager";
// import NPCIndicator from "../objects/NPCIndicator";
// import InteractionPanel from "../objects/InteractionPanel";

// export default class Chapter1Scene2 extends Phaser.Scene {
//     constructor() {
//         super("Chapter1Scene2");

//         this._currentScaleFactor = 1;
//         this.classroom = {
//             topY: 780,
//             bottomY: 1077,
//             leftTopX: 500,
//             rightTopX: 1230,
//             leftBottomX: 200,
//             rightBottomX: 1600,
//         };
//     }

//     init(data) {
//         this.sdgPointsObj = { points: data?.sdgPoints || getPoints() || 0 };

//         // Door unlock objective
//         this.objectiveStep = 1;
//         this.objectiveCompleted = false;

//         // Easter eggs
//         this.posterFound = new Set();
//         this.posterGoal = 2;
//     }

//     preload() {
//         this.load.json("chapter1Data", "data/dialogues/chapters/chapter1_script.json");
//         this.load.pack("assets-pack", "assets/assets-pack.json");
//     }

//     create() {
//         this._createUILayer();
//         this._createCameraAndBackground();
//         this._createPlayer();
//         this._createNPCs();
//         this._createDialogueAndUI();
//         this._createPosters();
//         this._createInput();
//         this._createDoorExit();
//         this._startIntroDialogue();

//         // Objectives
//         emit("updateObjective", {
//             slot: "primary",
//             collected: 0,
//             goal: 1,
//             description: "Talk to the teacher to continue.",
//             complete: false,
//         });

//         emit("updateObjective", {
//             slot: "secondary",
//             preview: false,
//             active: true,
//             collected: 0,
//             goal: this.posterGoal,
//             description: "Optional: Find and click hidden classroom posters.",
//         });

//         // Unlock door ONLY when teacher dialogue triggers JSON unlock event
//         on("sceneExitUnlocked", (payload) => {
//             const { sceneId, exitFlag } = payload || {};
//             if (sceneId !== "classroom") return;

//             if (
//                 exitFlag === "chapter1_scene2_exit_unlocked" &&
//                 this.objectiveStep === 1 &&
//                 !this.objectiveCompleted
//             ) {
//                 this.objectiveCompleted = true;

//                 emit("updateObjective", {
//                     slot: "primary",
//                     delta: 1,
//                     complete: true,
//                 });

//                 this._unlockDoorGlow();
//             }
//         });
//     }

//     // =========================
//     // UI / CAMERA / BG
//     // =========================
//     _createUILayer() {
//         this.uiLayer = this.add.container(0, 0).setScrollFactor(0).setDepth(50000);
//     }

//     _createCameraAndBackground() {
//         this.cameras.main.setBackgroundColor("#000000");
//         this.cameras.main.fadeIn(500, 0, 0, 0);

//         this.bg = this.add
//             .image(0, 0, "bgClassroom")
//             .setOrigin(0)
//             .setDepth(-10)
//             .setDisplaySize(this.scale.width, this.scale.height);

//         this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
//         this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
//     }

//     // =========================
//     // PLAYER
//     // =========================
//     _createPlayer() {
//         this.ladyPlayer = this.physics.add
//             .sprite(1400, 900, "ladyy", "frame1.png")
//             .setCollideWorldBounds(true)
//             .setDepth(10000)
//             .setOrigin(0.5, 1);

//         this.playerShadow = this.add
//             .ellipse(this.ladyPlayer.x, this.ladyPlayer.y + 10, 40, 15, 0x000000, 0.2)
//             .setDepth(1);

//         this.anims.create({
//             key: "walk",
//             frames: this.anims.generateFrameNames("ladyy", {
//                 start: 1,
//                 end: 6,
//                 prefix: "frame",
//                 suffix: ".png",
//             }),
//             frameRate: 10,
//             repeat: -1,
//         });

//         this.anims.create({
//             key: "idle",
//             frames: [{ key: "ladyy", frame: "frame1.png" }],
//             frameRate: 20,
//         });

//         // keep movement feeling tight
//         this.ladyPlayer.body.setSize(28, 18, true);
//         this.ladyPlayer.body.setOffset(18, 46);
//     }

//     // =========================
//     // NPCs
//     // =========================
//     _createNPCs() {
//         this.npcteacher = this.add
//             .image(950, 630, "teacher")
//             .setScale(0.3)
//             .setInteractive({ useHandCursor: true });

//         this.bench1 = this.add
//             .image(684, 835, "brandon_npc")
//             .setScale(0.19)
//             .setInteractive({ useHandCursor: true });

//         this.bench2 = this.add
//             .image(1210, 825, "crystal_npc")
//             .setScale(1.35)
//             .setInteractive({ useHandCursor: true });

//         this.bench3 = this.add
//             .image(740, 725, "elvis_npc")
//             .setScale(1.3)
//             .setInteractive({ useHandCursor: true });

//         this.bench4 = this.add
//             .image(1120, 735, "zahir_npc")
//             .setScale(1.4)
//             .setInteractive({ useHandCursor: true });

//         // Dialogue node ids
//         this.npcteacher.dialogueId = "c_intro_prof";
//         this.bench1.dialogueId = "c_bench_1";
//         this.bench2.dialogueId = "c_bench_2";
//         this.bench3.dialogueId = "c_bench_3";
//         this.bench4.dialogueId = "c_bench_4";

//         // Indicators
//         this.indTeacher = new NPCIndicator(this, this.npcteacher);
//         this.indB1 = new NPCIndicator(this, this.bench1);
//         this.indB2 = new NPCIndicator(this, this.bench2);
//         this.indB3 = new NPCIndicator(this, this.bench3);
//         this.indB4 = new NPCIndicator(this, this.bench4);
//     }

//     // =========================
//     // Dialogue / Tooltip / Panel
//     // =========================
//     _createDialogueAndUI() {
//         const chapterData = this.cache.json.get("chapter1Data");
//         const classroomScene = chapterData?.scenes?.find((s) => s.id === "classroom");

//         if (!classroomScene) {
//             console.error("[Chapter1Scene2] classroom scene not found in chapter1Data.json", chapterData);
//         }

//         this.dialogueManager = new DialogueManager(this, classroomScene || {}, this.sdgPointsObj, this.uiLayer);

//         this.tooltipManager = new TooltipManager(this, this.uiLayer);
//         this.interactionPanel = new InteractionPanel(this, this.uiLayer);

//         const bindTooltip = (obj) => {
//             if (!obj) return;
//             obj.on("pointerdown", () => {
//                 this.tooltipManager.show(obj.x, obj.y - obj.displayHeight / 2, obj);
//             });
//         };

//         bindTooltip(this.npcteacher);
//         bindTooltip(this.bench1);
//         bindTooltip(this.bench2);
//         bindTooltip(this.bench3);
//         bindTooltip(this.bench4);
//     }

//     // TooltipManager expects scene.startDialogue(nodeId)
//     startDialogue(startNodeId) {
//         if (!this.dialogueManager) {
//             console.warn("[Chapter1Scene2] DialogueManager not ready");
//             return;
//         }

//         // If TooltipManager passes an NPC object, use its dialogueId
//         if (startNodeId && typeof startNodeId === "object") {
//             const node = startNodeId.dialogueId || startNodeId.nodeId || startNodeId.startNodeId;
//             this.dialogueManager.startDialogue(node);
//             return;
//         }

//         // If TooltipManager passes a string nodeId, use it directly
//         if (typeof startNodeId === "string" && startNodeId.trim().length > 0) {
//             this.dialogueManager.startDialogue(startNodeId);
//             return;
//         }

//         // Fallback: use JSON scene startNodeId
//         this.dialogueManager.startDialogue();
//     }


//     _startIntroDialogue() {
//         if (!this.dialogueManager) return;
//         this.time.delayedCall(400, () => this.dialogueManager.startDialogue());
//     }

//     // =========================
//     // Posters (Easter eggs)
//     // =========================
//     _createPosters() {
//         this.posters = [
//             { id: "poster_sdg4", x: 420, y: 420, w: 140, h: 180, reward: 5 },
//             { id: "poster_sdg13", x: 1180, y: 430, w: 140, h: 180, reward: 5 },
//         ];

//         this.posters.forEach((p) => {
//             const z = this.add
//                 .zone(p.x, p.y, p.w, p.h)
//                 .setOrigin(0.5)
//                 .setInteractive({ useHandCursor: true });

//             z.on("pointerdown", () => this._handlePosterClick(p));
//         });
//     }

//     _handlePosterClick(p) {
//         if (this.posterFound.has(p.id)) return;

//         this.posterFound.add(p.id);

//         emit("updateSDGPoints", p.reward);
//         emit("badgeEarned", `Found a poster! (+${p.reward})`);

//         emit("updateObjective", { slot: "secondary", delta: 1 });

//         if (this.posterFound.size >= this.posterGoal) {
//             emit("badgeEarned", "Poster Hunter 🏅");
//             emit("updateObjective", { slot: "secondary", complete: true });
//         }
//     }

//     // =========================
//     // Door Exit
//     // =========================
//     _createDoorExit() {
//         const DOOR_X = 317;
//         const DOOR_Y = 588;
//         const DOOR_W = 120;
//         const DOOR_H = 220;

//         this.door = this.add.image(DOOR_X, DOOR_Y, "bgClassroomDoor").setInteractive({ useHandCursor: true });

//         this.exitZone = this.add.zone(DOOR_X, DOOR_Y, DOOR_W, DOOR_H);
//         this.physics.world.enable(this.exitZone);
//         this.exitZone.body.setAllowGravity(false);
//         // NOTE: don't call setImmovable on Zone bodies (can differ by version)

//         this.playerInExitZone = false;

//         this.door.on("pointerdown", () => {
//             if (this.playerInExitZone) this.goToNextScene();
//             else console.log("Too far from the door.");
//         });
//     }

//     _unlockDoorGlow() {
//         if (this.doorUnlocked || !this.door) return;
//         this.doorUnlocked = true;

//         this.door.setTint(0x88ffcc);
//         this.tweens.add({
//             targets: this.door,
//             alpha: { from: 0.6, to: 1 },
//             duration: 800,
//             yoyo: true,
//             repeat: 1,
//             ease: "Sine.easeInOut",
//         });
//     }

//     // =========================
//     // Input
//     // =========================
//     _createInput() {
//         this.keys = this.input.keyboard.addKeys({
//             up: Phaser.Input.Keyboard.KeyCodes.W,
//             down: Phaser.Input.Keyboard.KeyCodes.S,
//             left: Phaser.Input.Keyboard.KeyCodes.A,
//             right: Phaser.Input.Keyboard.KeyCodes.D,
//         });
//     }

//     // =========================
//     // Update loop
//     // =========================
//     update(time, delta) {
//         this._updateNPCIndicators();
//         this._updateMovement(delta);
//         this._updateDepthScale();
//         this._updateWorldDepths();
//         this._updateShadow();
//         this._updateExitZoneOverlap();
//     }

//     _updateNPCIndicators() {
//         const check = (obj, indicator) => {
//             if (!obj || !indicator) return;
//             const d = Phaser.Math.Distance.Between(this.ladyPlayer.x, this.ladyPlayer.y, obj.x, obj.y);
//             d < 150 ? indicator.show() : indicator.hide();
//             indicator.update();
//         };

//         check(this.npcteacher, this.indTeacher);
//         check(this.bench1, this.indB1);
//         check(this.bench2, this.indB2);
//         check(this.bench3, this.indB3);
//         check(this.bench4, this.indB4);
//     }

//     _updateMovement(delta) {
//         const speed = 150;
//         let vx = 0;
//         let vy = 0;

//         if (this.keys.left.isDown) vx = -speed;
//         else if (this.keys.right.isDown) vx = speed;

//         if (this.keys.up.isDown) vy = -speed;
//         else if (this.keys.down.isDown) vy = speed;

//         // clamp movement to classroom trapezoid without teleporting
//         const { topY, bottomY, leftTopX, rightTopX, leftBottomX, rightBottomX } = this.classroom;
//         const dt = (delta ?? 16) / 1000;

//         const nextY = this.ladyPlayer.y + vy * dt;
//         if ((nextY < topY && vy < 0) || (nextY > bottomY && vy > 0)) vy = 0;

//         const depthRange = bottomY - topY;
//         let t = ((this.ladyPlayer.y + vy * dt) - topY) / depthRange;
//         t = Phaser.Math.Clamp(t, 0, 1);

//         const minX = Phaser.Math.Linear(leftTopX, leftBottomX, t);
//         const maxX = Phaser.Math.Linear(rightTopX, rightBottomX, t);

//         const nextX = this.ladyPlayer.x + vx * dt;
//         if ((nextX < minX && vx < 0) || (nextX > maxX && vx > 0)) vx = 0;

//         this.ladyPlayer.setVelocity(vx, vy);

//         if (vx !== 0 || vy !== 0) {
//             this.ladyPlayer.anims.play("walk", true);
//             this.ladyPlayer.setFlipX(vx > 0);
//         } else {
//             this.ladyPlayer.anims.play("idle", true);
//         }
//     }

//     _updateDepthScale() {
//         const { topY, bottomY } = this.classroom;
//         const t = Phaser.Math.Clamp((this.ladyPlayer.y - topY) / (bottomY - topY), 0, 1);

//         const scaleFar = 0.7;
//         const scaleNear = 1.4;
//         const s = Phaser.Math.Linear(scaleFar, scaleNear, t);

//         this.ladyPlayer.setScale(s);
//         this._currentScaleFactor = s;
//     }

//     _updateWorldDepths() {
//         const setBaseDepth = (obj) => {
//             if (!obj) return;
//             const baseY = obj.y + obj.displayHeight * (1 - (obj.originY ?? 0.5));
//             obj.setDepth(Math.floor(baseY));
//         };

//         // player depth by feet
//         this.ladyPlayer.setDepth(Math.floor(this.ladyPlayer.y));

//         setBaseDepth(this.npcteacher);
//         setBaseDepth(this.bench1);
//         setBaseDepth(this.bench2);
//         setBaseDepth(this.bench3);
//         setBaseDepth(this.bench4);

//         // keep UI always on top
//         this.uiLayer?.setDepth(50000);
//     }

//     _updateShadow() {
//         const s = this._currentScaleFactor ?? 1;
//         this.playerShadow.x = this.ladyPlayer.x;
//         this.playerShadow.y = this.ladyPlayer.y + 10;
//         this.playerShadow.setDepth(this.ladyPlayer.depth - 1);
//         this.playerShadow.scaleX = s;
//         this.playerShadow.scaleY = s * 0.4;
//     }

//     _updateExitZoneOverlap() {
//         this.playerInExitZone = false;
//         if (!this.exitZone) return;

//         this.physics.world.overlap(this.ladyPlayer, this.exitZone, () => {
//             this.playerInExitZone = true;
//         });
//     }

//     goToNextScene() {
//         this.cameras.main.fadeOut(600);
//         this.cameras.main.once("camerafadeoutcomplete", () => {
//             SceneManager.nextScene(this, getPoints());
//         });
//     }
// }


import BaseStoryScene from "../BaseStoryScene";
import { emit } from "../../../utils/eventBus";

export default class Chapter1Scene2 extends BaseStoryScene {
    constructor() {
        super("Chapter1Scene2", {
            // JSON hookup
            sceneId: "classroom",
            jsonKey: "chapter1Data",
            jsonPath: "data/dialogues/chapters/chapter1_script.json",

            // scene basics
            backgroundKey: "bgClassroom",
            startNodeId: "c_intro_prof",
            exitUnlockedFlag: "chapter1_scene2_exit_unlocked",

            // per-scene walk area
            walkArea: {
                topY: 780,
                bottomY: 1077,
                leftTopX: 500,
                rightTopX: 1230,
                leftBottomX: 200,
                rightBottomX: 1600,
            },

            // door (same logic everywhere)
            door: { x: 317, y: 588, w: 120, h: 220, texture: "bgClassroomDoor" },

            // NPC list (BaseStoryScene will create + tooltip + indicator automatically)
            npcs: [
                { name: "teacher", texture: "teacher", x: 950, y: 630, scale: 0.3, dialogueId: "c_intro_prof" },
                { name: "bench1", texture: "brandon_npc", x: 684, y: 835, scale: 0.19, dialogueId: "c_bench_1" },
                { name: "bench2", texture: "crystal_npc", x: 1210, y: 825, scale: 1.35, dialogueId: "c_bench_2" },
                { name: "bench3", texture: "elvis_npc", x: 740, y: 725, scale: 1.3, dialogueId: "c_bench_3" },
                { name: "bench4", texture: "zahir_npc", x: 1120, y: 735, scale: 1.4, dialogueId: "c_bench_4" },
            ],
        });

        // local state just for posters
        this.posterFound = new Set();
        this.posterGoal = 2;
    }

    create() {
        super.create();
        emit("updateChapterScene", { title: "Classroom · Chapter 1" });
    }

    // Runs after base create()
    _customCreate() {
        // objectives for this scene
        emit("updateObjective", {
            slot: "primary",
            collected: 0,
            goal: 1,
            description: "Talk to the teacher to continue.",
            complete: false,
        });

        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.posterGoal,
            description: "Optional: Find and click hidden classroom posters.",
        });

        this._createPosters();
    }

    // -------------------------
    // Posters (scene-specific)
    // -------------------------
    _createPosters() {
        const posters = [
            { id: "poster_sdg4", x: 420, y: 420, w: 140, h: 180, reward: 5 },
            { id: "poster_sdg13", x: 1180, y: 430, w: 140, h: 180, reward: 5 },
        ];

        posters.forEach((p) => {
            const z = this.add
                .zone(p.x, p.y, p.w, p.h)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            z.on("pointerdown", () => this._handlePosterClick(p));
        });
    }

    _handlePosterClick(p) {
        if (this.posterFound.has(p.id)) return;
        this.posterFound.add(p.id);

        emit("updateSDGPoints", p.reward);
        emit("badgeEarned", `Found a poster! (+${p.reward})`);
        emit("updateObjective", { slot: "secondary", delta: 1 });

        if (this.posterFound.size >= this.posterGoal) {
            emit("badgeEarned", "Poster Hunter 🏅");
            emit("updateObjective", { slot: "secondary", complete: true });
        }
    }
}
