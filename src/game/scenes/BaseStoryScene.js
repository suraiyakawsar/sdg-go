import Phaser from "phaser";
import DialogueManager from "../objects/DialogueManager";
import { SceneManager } from "../../utils/sceneManager";
import { emit, on, off } from "../../utils/eventBus";
import { getPoints } from "../../utils/sdgPoints";
import TooltipManager from "../objects/TooltipManager";
import NPCIndicator from "../objects/NPCIndicator";
// import InteractionPanel from "../objects/InteractionPanel";
import HowToPlayScene from "./HowToPlayScene";
export default class BaseStoryScene extends Phaser.Scene {
    constructor(key, config = {}) {
        super(key);
        this.CONFIG = config;

        this._currentScaleFactor = 1;
        this._bus = [];
        this.playerInExitZone = false;
        // this.doorUnlocked = true;
        this.doorUnlocked = false;

        this._howToHandler = null;

        this.walkArea = config.walkArea ? structuredClone(config.walkArea) : null;

        this.currentInteractable = null;

    }

    // -------------------------
    // LIFECYCLE
    // -------------------------
    init(data) {
        this.sdgPointsObj = { points: data?.sdgPoints || getPoints() || 0 };
        this._customInit?.(data); // optional hook per scene
    }

    preload() {
        const c = this.CONFIG;
        if (c.jsonKey && c.jsonPath) this.load.json(c.jsonKey, c.jsonPath);
        this.load.pack("assets-pack", "assets/assets-pack.json");
        this._customPreload?.();
    }

    create() {
        this._createUILayer();
        this._createCoordinateDebug(); // Add this
        this._createCameraAndBackground();
        this._createPlayer();
        this._createInput();
        this._createDoorExit();
        this._createDialogueAndUI();
        this._createNPCs();
        this._bindExitUnlockEvent();
        this._startIntroDialogue();

        // optional hook for per-scene extras (posters, props, etc.)
        this._customCreate?.();

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this._cleanup());

        this._registerGlobalUIListeners();

        // this._debugWalkArea();

        // this._createDebugGraphics();

        // Dialogue ended listener for NPC objectives
        this.events.on("dialogueEnded", ({ lastNodeId }) => {
            const npc = this.npcs?.find(n => n.dialogueId === lastNodeId);
            if (npc && this.onNPCDialogueComplete) {
                this.onNPCDialogueComplete(npc.name);
            }
        });

    }

    _createCoordinateDebug() {
        // We add this to the uiLayer so it's always on top and ignore's camera zoom/player scale
        this.debugCoords = this.add.text(20, 20, 'X: 0, Y: 0', {
            fontSize: '20px',
            fontStyle: 'bold',
            fill: '#00ff00', // Bright green is easier to see
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });

        // Add to the container you defined in _createUILayer
        if (this.uiLayer) {
            this.uiLayer.add(this.debugCoords);
        }
    }

    _updateCoordinateDebug() {
        if (!this.debugCoords || !this.ladyPlayer) return;

        // Get the player's world position
        const px = Math.floor(this.ladyPlayer.x);
        const py = Math.floor(this.ladyPlayer.y);

        this.debugCoords.setText(`PLAYER POS - X: ${px}, Y: ${py}`);
    }


    _debugWalkArea() {
        const a = this.CONFIG.walkArea;
        if (!a) return;
        const g = this.add.graphics().setDepth(100000).lineStyle(3, 0x00ffff, 1).fillStyle(0x00ffff, 0.2);

        if (a.zones) {
            a.zones.forEach(z => g.strokeRect(z.xMin, z.yMin, z.xMax - z.xMin, z.yMax - z.yMin).fillRect(z.xMin, z.yMin, z.xMax - z.xMin, z.yMax - z.yMin));
        }
        if (a.topY !== undefined && a.leftTopX !== undefined) {
            g.beginPath().moveTo(a.leftTopX, a.topY).lineTo(a.rightTopX, a.topY).lineTo(a.rightBottomX, a.bottomY).lineTo(a.leftBottomX, a.bottomY).closePath().strokePath().fillPath();
        }
    }

    _registerGlobalUIListeners() {
        // Avoid double-binding if create runs again
        if (this._howToHandler) return;

        this._howToHandler = () => {
            // Pause THIS current scene and show overlay
            const currentKey = this.scene.key;

            // If overlay already open, don't relaunch
            if (this.scene.isActive("HowToPlayScene")) {
                // optional: bring it to top
                this.scene.bringToTop("HowToPlayScene");
                return;
            }

            if (this.scene.isActive(currentKey)) {
                this.scene.pause(currentKey);
            }


            this.scene.launch("HowToPlayScene", {
                returnSceneKey: currentKey,
                isBoot: false,
            });

            // Optional: tell React to highlight sidebar state
            emit("ui:setSidebarActive", { id: "howto" });
        };

        on("openHowToPlay", this._howToHandler);

        // CLEANUP so you don’t leak listeners when scenes change
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            off("openHowToPlay", this._howToHandler);
            this._howToHandler = null;
        });

        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            off("openHowToPlay", this._howToHandler);
            this._howToHandler = null;
        });
    }

    update(time, delta) {
        this._updateMovement(delta);
        this._updateDepthScale();
        this._updateShadow();
        this._updateWorldDepths();
        this._updateNPCIndicators();
        this._updateExitZoneOverlap();
        this._customUpdate?.(time, delta); // optional hook
        this._updateDebugWalkArea();

        this._updateCoordinateDebug(); // Add this
    }

    _cleanup() {
        this._bus.forEach(([evt, fn]) => off(evt, fn));
        this._bus = [];
    }

    // -------------------------
    // REQUIRED for TooltipManager
    // -------------------------
    startDialogue(startNodeId) {
        if (!this.dialogueManager) return;

        if (startNodeId && typeof startNodeId === "object") {
            const node = startNodeId.dialogueId || startNodeId.nodeId || startNodeId.startNodeId;
            this.dialogueManager.startDialogue(node || this.CONFIG.startNodeId);
            return;
        }

        if (typeof startNodeId === "string" && startNodeId.trim().length > 0) {
            this.dialogueManager.startDialogue(startNodeId);
            return;
        }

        this.dialogueManager.startDialogue(this.CONFIG.startNodeId);
    }

    showNPCInfo(npc) {
        if (!npc) return;

        // OPTION A: If NPC has a dedicated inspect node
        if (npc.inspectDialogueId) {
            this.dialogueManager.startDialogue(npc.inspectDialogueId); // Pass the ID directly
            return;
        }

        // OPTION B: Fallback generic inspect text
        this.dialogueManager.startDialogue("friend_busy");

        if (!npc?.inspectDialogueId) return;
        this.dialogueManager.startInspectDialogue(npc.inspectDialogueId);
    }

    // -------------------------
    // SHARED BUILDERS
    // -------------------------
    _createUILayer() {
        this.uiLayer = this.add.container(0, 0).setScrollFactor(0).setDepth(50000);
    }

    _createCameraAndBackground() {
        this.cameras.main.setBackgroundColor("#000000");
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const bgKey = this.CONFIG.backgroundKey;
        this.bg = this.add.image(0, 0, bgKey)
            .setOrigin(0)
            .setDepth(-10)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.physics.world.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
        this.cameras.main.setBounds(0, 0, this.bg.displayWidth, this.bg.displayHeight);
    }

    _createPlayer() {
        // same everywhere
        const p = this.CONFIG.player || { x: 1400, y: 1000, key: "ladyy", frame: "frame1.png" };

        this.ladyPlayer = this.physics.add.sprite(p.x, p.y, p.key, p.frame)
            .setBounce(0.2)
            .setCollideWorldBounds(true)
            .setOrigin(0.5, 1)
            .setDepth(10000);

        // feet-only body
        this.ladyPlayer.body.setSize(28, 18, true);
        this.ladyPlayer.body.setOffset(18, 46);

        this.playerShadow = this.add.ellipse(this.ladyPlayer.x, this.ladyPlayer.y + 50, 40, 15, 0x000000, 0.2)
            .setDepth(4);

        // animations (quick safe checks)
        if (!this.anims.exists("walk")) {
            this.anims.create({
                key: "walk",
                frames: this.anims.generateFrameNames(p.key, { start: 1, end: 6, prefix: "frame", suffix: ".png" }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!this.anims.exists("idle")) {
            this.anims.create({ key: "idle", frames: [{ key: p.key, frame: p.frame }], frameRate: 20 });
        }
    }

    _createInput() {
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
    }

    _createDoorExit() {
        const d = this.CONFIG.door;
        if (!d) return;

        this.door = this.add.image(d.x, d.y, d.texture)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        this.exitZone = this.add.zone(d.x, d.y, d.w, d.h);
        this.physics.world.enable(this.exitZone);
        this.exitZone.body.setAllowGravity(false);
        this.exitZone.body.setImmovable(true);

        this.door.on("pointerdown", () => {
            if (typeof this._onDoorClicked === "function") return this._onDoorClicked();
            if (this.playerInExitZone) this.goToNextScene();
        });

    }

    _unlockDoorGlow() {
        if (this.doorUnlocked) return;
        this.doorUnlocked = true;

        if (this.door) {
            this.door.setTint(0x88ffcc);
            this.tweens.add({
                targets: this.door,
                alpha: { from: 0.6, to: 1 },
                duration: 800,
                yoyo: true,
                repeat: 1,
                ease: "Sine.easeInOut"
            });
        }
    }

    goToNextScene() {
        this.cameras.main.fadeOut(400);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            SceneManager.nextScene(this, getPoints());
        });
    }

    _createDialogueAndUI() {
        const c = this.CONFIG;
        // const data = c.jsonKey ? this.cache.json.get(c.jsonKey) : null;
        const data = this.cache.json.get(this.CONFIG.jsonKey);

        // const sceneData = data?.scenes?.find(s => s.id === c.sceneId);
        const sceneData = data?.scenes?.find(s => s.id === this.CONFIG.sceneId);


        this.dialogueManager = new DialogueManager(this, sceneData || {}, this.sdgPointsObj, this.uiLayer);
        this.tooltipManager = new TooltipManager(this, this.uiLayer);
        // this.interactionPanel = new InteractionPanel(this, this.uiLayer);
    }

    _createNPCs() {
        this.npcs = [];
        const list = this.CONFIG.npcs || [];

        const bindTooltip = (obj) => {
            obj.setInteractive({ useHandCursor: true });
            obj.on("pointerdown", () => {
                this.currentInteractable = obj;

                this.tooltipManager.show(

                    obj.x,
                    obj.y - obj.displayHeight / 2,
                    obj
                );
            });



        };

        // list.forEach(cfg => {
        //     const npc = this.add.image(cfg.x, cfg.y, cfg.texture)
        //         .setScale(cfg.scale ?? 1)
        //         .setDepth(10);

        //     npc.dialogueId = cfg.dialogueId;
        //     npc.name = cfg.name;
        //     npc.tooltipConfig = cfg.tooltip || null;

        //     npc._indicator = new NPCIndicator(this, npc);
        //     bindTooltip(npc);

        //     this.npcs.push(npc);
        // });
        list.forEach(obj => {
            const npc = this.add.image(obj.x, obj.y, obj.texture)
                .setScale(obj.scale ?? 1)
                .setDepth(10);

            npc.dialogueId = obj.dialogueId;
            npc.name = obj.name;
            npc.tooltipConfig = obj.tooltip || null;
            npc.inspectDialogueId = obj.inspectDialogueId;

            npc._indicator = new NPCIndicator(this, npc);
            bindTooltip(npc);

            this.npcs.push(npc);

            console.log("NPC being created:", obj.name, obj.inspectDialogueId); // ✅ inside loop
        });


    }

    _bindExitUnlockEvent() {
        const c = this.CONFIG;
        if (!c.exitUnlockedFlag || !c.sceneId) return;

        const handler = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== c.sceneId) return;
            if (exitFlag !== c.exitUnlockedFlag) return;

            // mark objective if you want
            if (c.primaryObjective) {
                emit("updateObjective", { slot: "primary", delta: 1, complete: true });
            }
            this._unlockDoorGlow();
        };

        on("sceneExitUnlocked", handler);
        this._bus.push(["sceneExitUnlocked", handler]);
    }

    _startIntroDialogue() {
        this.time.delayedCall(250, () => {
            if (this.dialogueManager) this.dialogueManager.startDialogue(this.CONFIG.startNodeId);
        });
    }

    // -------------------------
    // UPDATE HELPERS
    // -------------------------
    _updateNPCIndicators() {
        if (!this.npcs?.length) return;
        this.npcs.forEach(npc => {
            const d = Phaser.Math.Distance.Between(this.ladyPlayer.x, this.ladyPlayer.y, npc.x, npc.y);
            d < 150 ? npc._indicator.show() : npc._indicator.hide();
            npc._indicator.update();
        });
    }


    _updateMovement(delta) {
        const speed = this.CONFIG.playerSpeed ?? 150;
        const dt = delta / 1000;

        let vx = 0, vy = 0;
        if (this.keys.left.isDown) vx = -speed;
        else if (this.keys.right.isDown) vx = speed;
        if (this.keys.up.isDown) vy = -speed;
        else if (this.keys.down.isDown) vy = speed;

        if (vx === 0 && vy === 0) {
            this.ladyPlayer.setVelocity(0, 0);
            this.ladyPlayer.anims.play("idle", true);
            return;
        }

        // Predict next position
        const nextX = this.ladyPlayer.x + vx * dt;
        const nextY = this.ladyPlayer.y + vy * dt;

        // Check if the next full step is valid
        const canMoveX = this._isPositionWalkable(nextX, this.ladyPlayer.y);
        const canMoveY = this._isPositionWalkable(this.ladyPlayer.x, nextY);

        // If moving both ways is blocked, we check if the player is ALREADY out of bounds
        if (!canMoveX && !canMoveY && !this._isPositionWalkable(this.ladyPlayer.x, this.ladyPlayer.y)) {
            // EMERGENCY: Player is out of bounds. Find the center of the room and nudge them.
            this._nudgePlayerToSafety();
            return;
        }

        this.ladyPlayer.setVelocity(canMoveX ? vx : 0, canMoveY ? vy : 0);

        // Animation logic
        if (vx !== 0 || vy !== 0) {
            this.ladyPlayer.anims.play("walk", true);
            if (vx !== 0) this.ladyPlayer.setFlipX(vx > 0);
        } else {
            this.ladyPlayer.anims.play("idle", true);
        }
    }

    // Add this helper to prevent the "Stuck" state
    _nudgePlayerToSafety() {
        const a = this.CONFIG.walkArea;
        // Aim for the middle of the floor/trapezoid
        const targetX = a.leftTopX ?? 800;
        const targetY = a.bottomY ?? 900;

        const angle = Phaser.Math.Angle.Between(this.ladyPlayer.x, this.ladyPlayer.y, targetX, targetY);
        this.ladyPlayer.setVelocity(Math.cos(angle) * 100, Math.sin(angle) * 100);
    }

    // THE LOGIC GATE: Decides which math to use based on CONFIG structure
    _isPositionWalkable(x, y) {
        const a = this.walkArea;
        if (!a) return true;

        // --- Check 1: Zones (L-shapes, boxes) ---
        let inZone = false;
        if (a.zones && a.zones.length > 0) {
            inZone = a.zones.some(z =>
                x >= z.xMin && x <= z.xMax && y >= z.yMin && y <= z.yMax
            );
        }

        // --- Check 2: Trapezoid (Perspective path) ---
        let inTrapezoid = false;
        if (a.topY !== undefined && a.leftTopX !== undefined) {
            if (y >= a.topY && y <= a.bottomY) {
                const t = (y - a.topY) / (a.bottomY - a.topY);
                const minX = Phaser.Math.Linear(a.leftTopX, a.leftBottomX, t);
                const maxX = Phaser.Math.Linear(a.rightTopX, a.rightBottomX, t);
                inTrapezoid = (x >= minX && x <= maxX);
            }
        }

        // If there is NO trapezoid and NO zones defined, default to walkable
        const hasZones = Array.isArray(a.zones) && a.zones.length > 0;
        const hasTrapezoid = a.topY !== undefined;

        if (!hasZones && !hasTrapezoid) return true;


        // THE MAGIC: Return true if the player is in ANY of the valid shapes
        return inZone || inTrapezoid;
    }

    _createDebugGraphics() {
        this._walkDebug = this.add.graphics().setDepth(100000);
    }

    _updateDebugWalkArea() {
        const a = this.walkArea;
        if (!a || !this._walkDebug) return;

        const g = this._walkDebug;
        g.clear().lineStyle(2, 0x00ffff).fillStyle(0x00ffff, 0.2);

        if (a.zones) {
            a.zones.forEach(z => {
                g.strokeRect(z.xMin, z.yMin, z.xMax - z.xMin, z.yMax - z.yMin);
                g.fillRect(z.xMin, z.yMin, z.xMax - z.xMin, z.yMax - z.yMin);
            });
        }

        if (a.topY !== undefined) {
            g.beginPath()
                .moveTo(a.leftTopX, a.topY)
                .lineTo(a.rightTopX, a.topY)
                .lineTo(a.rightBottomX, a.bottomY)
                .lineTo(a.leftBottomX, a.bottomY)
                .closePath()
                .strokePath()
                .fillPath();
        }
    }


    // _updateDepthScale() {
    //     const a = this.CONFIG.walkArea;
    //     if (!a) return;

    //     const top = a.topY;
    //     const bottom = a.bottomY;

    //     let t = (this.ladyPlayer.y - top) / (bottom - top);
    //     t = Phaser.Math.Clamp(t, 0, 1);

    //     const sFar = this.CONFIG.scaleFar ?? 0.8;
    //     const sNear = this.CONFIG.scaleNear ?? 1.2;
    //     const finalScale = Phaser.Math.Linear(sFar, sNear, t);

    //     this.ladyPlayer.setScale(finalScale);

    //     // UNCOMMENT THIS LINE TO DEBUG IN BROWSER CONSOLE:
    //     // console.log(`Y: ${Math.round(this.ladyPlayer.y)} | T: ${t.toFixed(2)} | Scale: ${finalScale.toFixed(2)}`);
    // }

    _updateDepthScale() {
        const a = this.CONFIG.walkArea;
        if (!a) return;

        const sFar = this.CONFIG.scaleFar ?? 0.8;
        const sNear = this.CONFIG.scaleNear ?? 1.2;

        // ADD AN OFFSET: If she gets small too fast, increase topOffset (e.g., 50)
        // If she stays too big, decrease it (e.g., -50)
        const topOffset = this.CONFIG.scaleTopOffset ?? 0;

        let t = (this.ladyPlayer.y - (a.topY + topOffset)) / (a.bottomY - (a.topY + topOffset));
        t = Phaser.Math.Clamp(t, 0, 1);

        const finalScale = Phaser.Math.Linear(sFar, sNear, t);
        this.ladyPlayer.setScale(finalScale);
        this._currentScaleFactor = finalScale;
    }


    _updateWorldDepths() {
        this.ladyPlayer.setDepth(Math.floor(this.ladyPlayer.y));
        this.npcs?.forEach(obj => {
            const baseY = obj.y + obj.displayHeight * (1 - (obj.originY ?? 0.5));
            obj.setDepth(Math.floor(baseY));
        });
        this.uiLayer?.setDepth(50000);
    }

    _updateShadow() {
        const s = this._currentScaleFactor ?? 1;
        this.playerShadow.x = this.ladyPlayer.x;
        this.playerShadow.y = this.ladyPlayer.y + 10;
        this.playerShadow.setDepth(this.ladyPlayer.depth - 1);
        this.playerShadow.scaleX = s;
        this.playerShadow.scaleY = s * 0.4;
    }

    _updateExitZoneOverlap() {
        if (!this.exitZone) return;

        this.physics.world.overlap(this.ladyPlayer, this.exitZone, () => {
            this.playerInExitZone = true;
        });
    }
}
