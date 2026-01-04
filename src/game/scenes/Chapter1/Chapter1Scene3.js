import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";
import { saveChapterStats } from "../../../utils/gameSummary";


export default class Chapter1Scene3 extends BaseStoryScene {
  constructor() {
    super("Chapter1Scene3", {
      sceneId: "cafeteria",
      jsonKey: "chapter1Data",
      jsonPath: "data/dialogues/chapters/chapter1_script.json",

      backgroundKey: "bgCafeteria",
      startNodeId: "f_intro_friends",
      exitUnlockedFlag: "chapter1_scene3_exit_unlocked",

      walkArea: {
        zones: [
          { xMin: 300, xMax: 600, yMin: 650, yMax: 1000 },
          { xMin: 50, xMax: 1920, yMin: 990, yMax: 1080 }
        ],
        topY: 700,
        bottomY: 1080
      },

      scaleFar: 0.8,
      scaleNear: 1.55,
      scaleTopOffset: 20,

      door: { x: 200, y: 490, w: 120, h: 220, texture: "bgCafeteriaDoor" },

      npcs: [
        {
          name: "friends",
          texture: "buddies",
          x: 882,
          y: 670,
          scale: 0.45,
          dialogueId: "f_intro_friends",
          inspectDialogueId: "inspect_friends"
        },
        {
          name: "alice",
          texture: "npcgirlflip",
          x: 95,
          y: 575,
          scale: 0.23,
          dialogueId: "alice_npc",
          inspectDialogueId: "inspect_alice"
        }
      ]
    });

    // objectives
    this.objectiveStep = 1;         // 1 = talk, 2 = posters
    this.objectiveCompleted = false;

    // local state just for posters
    this.posterFound = 0;
    this.posterGoal = 3;
    this._chapterCompleted = false; // ✅ Add flag

    // bind storage route
  }

  create() {
    super.create();

    // ✅ Store current scene (NO SPACE in key)
    localStorage.setItem("sdgo:lastRoute", "/game");
    localStorage.setItem("currentChapter", 1);
    localStorage.setItem("currentScene", "Chapter1Scene3");

    // ✅ Store scene before unload
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("currentScene", "Chapter1Scene3");
    });

    emit("updateChapterScene", { title: "Cafeteria · Chapter 1" });

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
      description: "Talk to your friends in the cafeteria.",
      complete: false,
    });

    // Secondary: trash (preview only until step 2)
    emit("updateObjective", {
      slot: "secondary",
      preview: true,
      active: false,
      collected: 0,
      goal: this.posterGoal,
      description: "Optional: Collect all the posters in the cafeteria.",
    });

    this._createPosters();
    this._createBag();
    // Door starts locked until JSON unlock event fires
    this.doorUnlocked = false;

    // Listen once for JSON unlock flag
    this._onSceneExitUnlocked = (payload) => {
      const { sceneId, exitFlag } = payload || {};
      if (sceneId !== "cafeteria") return;
      if (exitFlag !== "chapter1_scene3_exit_unlocked") return;

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

    emit("badgeEarned", "Food Bank Unlocked! 🔓");

    // unlock door visuals + logic (BaseStoryScene has the glow helper)
    this.doorUnlocked = true;
    this._unlockDoorGlow?.();

    // Step 2: posters becomes active
    this.objectiveStep = 2;
    this.objectiveCompleted = false;
    this.posterCollected = 0;

    emit("updateObjective", {
      slot: "secondary",
      active: true,
      preview: false,
      collected: 0,
      goal: this.posterGoal,
      description: "Optional: Collect all the posters in the cafeteria.",
    });
  }

  // --------------------------------
  // Posters
  // --------------------------------
  _createPosters() {
    this.poster1 = this.add.image(630, 400, "cafeteriaPoster1").setInteractive({ useHandCursor: true });
    this.poster2 = this.add.image(820, 400, "cafeteriaPoster2").setInteractive({ useHandCursor: true });
    this.poster3 = this.add.image(1008, 400, "cafeteriaPoster3").setInteractive({ useHandCursor: true });
    // this.bag = this.add.image(975, 870, "bag").setInteractive({ useHandCursor: true }).setScale(0.5);


    this.poster1.on("pointerdown", () => this._handlePosterClick(this.poster1));
    this.poster2.on("pointerdown", () => this._handlePosterClick(this.poster2));
    this.poster3.on("pointerdown", () => this._handlePosterClick(this.poster3));
    // this.bag.on("pointerdown", () => this._handlePosterClick(this.bag));
  }

  _handlePosterClick(posterItem) {
    if (!posterItem?.scene) return;

    // poster only active in step 2
    if (this.objectiveStep !== 2) return;

    const points = 3;
    addSDGPoints(points);
    emit("badgeEarned", `Found a poster! (+${posterItem.reward})`);

    // small floating text
    const msg = this.add.text(posterItem.x, posterItem.y - 40, `+${points}`, {
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

    posterItem.destroy();


    this.posterCollected += 1;

    emit("updateObjective", {
      slot: "secondary",
      delta: 1,
    });

    if (!this.objectiveCompleted && this.posterCollected >= this.posterGoal) {
      this.objectiveCompleted = true;
      emit("badgeEarned", "Poster Hunter 2! 🏅");
      emit("updateObjective", { slot: "secondary", complete: true });
    }
  }


  // --------------------------------------------------
  // Easter egg
  // --------------------------------------------------
  _createBag() {
    this.bag = this.add
      .image(975, 870, "bag")
      .setInteractive({ useHandCursor: true })
      .setScale(0.5);

    const buddies = this.npcs?.find(npc => npc.name === "friends");
    if (buddies?.sprite) {
      this.bag.setDepth(buddies.sprite.depth + 1);
    } else {
      this.bag.setDepth(this.bag.y + 50);
    }

    this.bag.once("pointerdown", () => {
      emit("badgeEarned", { name: "Curious Cat", icon: "😼", subtitle: "Why are you touching other people's bag?" });
    });
  }


  // --------------------------------
  // Door click override: locked until unlocked
  // --------------------------------
  // _onDoorClicked() {
  //   if (!this.doorUnlocked) {
  //     console.log("Door locked. Talk to your friends first.");
  //     return;
  //   }

  //   if (this.playerInExitZone) {
  //     this._onChapterComplete(); // ✅ Show summary instead of going directly
  //   } else {
  //     console.log("Too far from the door.");
  //   }
  // }

  _onDoorClicked() {
    console.log("🚪 Door clicked!");
    console.log("  - doorUnlocked:", this.doorUnlocked);
    console.log("  - playerInExitZone:", this.playerInExitZone);

    if (!this.doorUnlocked) {
      console.log("❌ Door locked.  Talk to your friends first.");
      return;
    }

    // ✅ TEMPORARY FIX: Skip the exit zone check for now
    // if (this.playerInExitZone) {
    this._onChapterComplete();
    // } else {
    //     console.log("Too far from the door.");
    // }
  }

  // ✅ Chapter complete handler
  _onChapterComplete() {
    // Prevent double-triggering
    if (this._chapterCompleted) {
      console.log("⚠️ Chapter already completed, skipping.. .");
      return;
    }
    this._chapterCompleted = true;

    console.log("🎉 Chapter 1 Complete!  Showing summary.. .");

    // Mark chapter as complete
    localStorage.setItem("chapter1_completed", "true");
    emit("updateChapterProgress");

    // Freeze the player
    this.input.enabled = false;
    if (this.ladyPlayer) {
      this.ladyPlayer.setVelocity(0, 0);
      this.ladyPlayer.body.enable = false;
      this.ladyPlayer.anims?.play("idle", true);
    }

    // ✅ Emit immediately - don't wait
    console.log("📤 Emitting ui:showChapterSummary for chapter 1.. .");
    emit("ui:showChapterSummary", { chapter: 1 });
  }


}
