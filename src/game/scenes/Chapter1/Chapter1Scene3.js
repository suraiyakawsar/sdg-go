// // import BaseStoryScene from "../BaseStoryScene";
// // import { emit, on, off } from "../../../utils/eventBus";

// // export default class Chapter1Scene3 extends BaseStoryScene {
// //   constructor() {
// //     super("Chapter1Scene3", {
// //       sceneId: "cafeteria",
// //       jsonKey: "chapter1Data",
// //       jsonPath: "data/dialogues/chapters/chapter1_script.json",

// //       backgroundKey: "bgCafeteria",
// //       startNodeId: "f_intro_friends",
// //       exitUnlockedFlag: "chapter1_scene3_exit_unlocked",

// //       walkArea: {
// //         zones: [
// //           { xMin: 300, xMax: 600, yMin: 650, yMax: 1000 },
// //           { xMin: 50, xMax: 1920, yMin: 990, yMax: 1080 },
// //           // { xMin: 50, xMax: 920, yMin: 200, yMax: 108 }
// //         ],
// //         topY: 700,
// //         bottomY: 1080
// //       },

// //       scaleFar: 0.8,
// //       scaleNear: 1.55,
// //       scaleTopOffset: 20,

// //       door: { x: 200, y: 490, w: 120, h: 220, texture: "bgCafeteriaDoor" },

// //       npcs: [
// //         {
// //           name: "friends",
// //           texture: "buddies",
// //           x: 887,
// //           y: 670,
// //           scale: 0.45,
// //           dialogueId: "f_intro_friends",
// //           inspectDialogueId: "friend_looking_posters"
// //         },
// //         {
// //           name: "alice",
// //           texture: "npcgirlflip",
// //           x: 95,
// //           y: 575,
// //           scale: 0.23,
// //           inspectDialogueId: "friend_looking_posters",
// //           dialogueId: "f_talk_alice"
// //         }
// //       ]
// //     });

// //     // simple state flags
// //     this.talkedToFriends = false;
// //     this.talkedToAlice = false;
// //     this.doorUnlocked = false;

// //     // objectives
// //     this.objectiveStep = 1;         // 1 = talk, 2 = trash
// //     this.objectiveCompleted = false;

// //     // bind storage route
// //     localStorage.setItem("sdgExplorer:lastRoute", "/game");
// //   }

// //   create() {
// //     super.create();

// //     emit("updateChapterScene", {
// //       title: "Cafeteria · Chapter 1"
// //     });
// //   }

// //   _customCreate() {
// //     // Primary objective
// //     emit("updateObjective", {
// //       slot: "primary",
// //       collected: 0,
// //       goal: 1,
// //       description: "Talk to your friends in the cafeteria.",
// //       complete: false
// //     });

// //     // Secondary objective (hidden until needed)
// //     emit("updateObjective", {
// //       slot: "secondary",
// //       preview: true,
// //       active: false,
// //       collected: 0,
// //       goal: 1,
// //       description: "Optional: Find out what Alice is still doing around."
// //     });

// //     // Easter egg only
// //     this._createBag();

// //     // Door starts locked
// //     this.doorUnlocked = false;

// //     // // Listen once for JSON unlock flag
// //     // this._onSceneExitUnlocked = (payload) => {
// //     //   const { sceneId, exitFlag } = payload || {};
// //     //   if (sceneId !== "cafeteria") return;
// //     //   if (exitFlag !== "chapter1_scene3_exit_unlocked") return;

// //     //   if (this.objectiveStep === 1 && !this.objectiveCompleted) {
// //     //     this._completeStep1AndUnlock();
// //     //   }
// //     // };

// //     this._onSceneExitUnlocked = ({ sceneId, exitFlag }) => {
// //       if (sceneId !== "cafeteria") return;
// //       if (exitFlag !== "chapter1_scene3_exit_unlocked") return;

// //       if (!this.talkedToFriends) {
// //         this._completeStep1AndUnlock();
// //       }
// //     };


// //     // if (this.objectiveStep === 2 && !this.talkedToAlice) {
// //     //   this.onNPCDialogueComplete("alice");
// //     // };

// //     on("sceneExitUnlocked", this._onSceneExitUnlocked);


// //     // this._onDialogueEnded = ({ lastNodeId }) => {

// //     //   if (lastNodeId === "f_intro_friends" && !this.talkedToFriends) {
// //     //     console.log("Completing TOMAR BONDHU objective");
// //     //     this.talkedToFriends = true;
// //     //   }

// //     //   if (lastNodeId === "f_talk_alice" && !this.talkedToAlice) {
// //     //     console.log("Completing Alice objective");
// //     //     this.talkedToAlice = true;
// //     //     this._completeAliceObjective();

// //     //   }
// //     // };

// //     // on("dialogueEnded", this._onDialogueEnded);


// //     // on("dialogueEnded", (payload) => {
// //     //   console.log("TOH EIJEH, Dialogue ended payload:", payload);
// //     // });



// //     // Cleanup (only if your bus supports off())
// //     this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
// //       // if (typeof off === "function") off("sceneExitUnlocked", this._onSceneExitUnlocked);
// //     });
// //   }

// //   _completeAliceObjective() {
// //     console.log("Completing Alice objective");

// //     this.talkedToAlice = true;

// //     emit("updateObjective", {
// //       slot: "secondary",
// //       delta: 1,
// //       collected: 1,
// //       goal: 1,
// //       complete: true
// //     });

// //     emit("badgeEarned", "Curious Mind 🧠");

// //     // // unlock door visuals + logic (BaseStoryScene has the glow helper)
// //     // this.doorUnlocked = true;
// //     // this._unlockDoorGlow?.();
// //     this._checkDoorUnlock();
// //   }


// //   // --------------------------------
// //   // Step 1 -> Step 2 transition
// //   // --------------------------------
// //   _completeStep1AndUnlock() {
// //     this.objectiveCompleted = true;
// //     this.talkedToFriends = true;

// //     emit("updateObjective", {
// //       slot: "primary",
// //       delta: 1,
// //       complete: true,
// //     });

// //     emit("updateSDGPoints", 10);
// //     // emit("badgeEarned", "Food Bank Unlocked! 🔓");

// //     // // unlock door visuals + logic (BaseStoryScene has the glow helper)
// //     // this.doorUnlocked = true;
// //     // this._unlockDoorGlow?.();

// //     // Step 2: secondary becomes active
// //     this.objectiveStep = 2;
// //     // this.talkedToAlice = false;
// //     // this.objectiveCompleted = false;

// //     emit("updateObjective", {
// //       slot: "secondary",
// //       active: true,
// //       preview: false,
// //       collected: 0,
// //       goal: 1,
// //       description: "Find out what Alice is still doing around.",
// //     });

// //   }
// //   // --------------------------------------------------
// //   // NPC dialogue completion hook
// //   // --------------------------------------------------
// //   // onNPCDialogueComplete(npcName) {
// //   //   // if (npcName === "friends" && !this.talkedToFriends) {
// //   //   //   this.talkedToFriends = true;

// //   //   //   // emit("updateObjective", {
// //   //   //   //   slot: "primary",
// //   //   //   //   delta: 1,
// //   //   //   //   complete: true
// //   //   //   // });

// //   //   //   // emit("updateObjective", {
// //   //   //   //   slot: "secondary",
// //   //   //   //   active: true,
// //   //   //   //   preview: false,
// //   //   //   // });
// //   //   // }

// //   //   if (npcName === "alice" && !this.talkedToAlice) {
// //   //     this.talkedToAlice = true;

// //   //     emit("updateObjective", {
// //   //       slot: "secondary",
// //   //       delta: 1,
// //   //       complete: true,
// //   //       collected: 1,
// //   //       goal: 1
// //   //     });

// //   //     emit("badgeEarned", "Curious Mind 🧠");
// //   //   }

// //   //   this._checkDoorUnlock();
// //   // }

// //   // Add this method to your class
// //   onNPCDialogueComplete(npcName) {
// //     console.log(`KAAJ KOREH NA KENO`);
// //     // Primary objective
// //     if (npcName === "friends" && !this.talkedToFriends) {
// //       console.log("Completing TOMAR BONDHU objective");
// //       this.talkedToFriends = true;
// //       emit("updateObjective", { slot: "primary", delta: 1, complete: true });
// //     }

// //     // Secondary objective
// //     if (npcName === "alice" && !this.talkedToAlice) {
// //       console.log("Completing Alice objective");
// //       this.talkedToAlice = true;
// //       this._completeAliceObjective(); // whatever you already had
// //       emit("updateObjective", { slot: "secondary", delta: 1, complete: true });
// //     }

// //     // Add more NPCs/objectives here if needed
// //   }

// //   // --------------------------------------------------
// //   // Door logic
// //   // --------------------------------------------------
// //   _checkDoorUnlock() {
// //     if (this.talkedToFriends && this.talkedToAlice && !this.doorUnlocked) {
// //       this.doorUnlocked = true;
// //       this._unlockDoorGlow?.();
// //       emit("badgeEarned", "Chapter 2 Unlocked 🔓");
// //     }
// //   }

// //   _onDoorClicked() {
// //     if (!this.doorUnlocked) {
// //       console.log("Door locked. Talk to everyone first.");
// //       return;
// //     }

// //     if (this.playerInExitZone) {
// //       this.goToNextScene();
// //     }
// //   }

// //   // --------------------------------------------------
// //   // Easter egg (bag)
// //   // --------------------------------------------------
// //   _createBag() {
// //     this.bag = this.add
// //       .image(975, 870, "bag")
// //       .setInteractive({ useHandCursor: true })
// //       .setScale(0.5);

// //     // 🔑 Find buddies NPC depth and sit just above it
// //     const buddies = this.npcs?.find(npc => npc.name === "friends");
// //     if (buddies?.sprite) {
// //       this.bag.setDepth(buddies.sprite.depth + 1);
// //     } else {
// //       // fallback (safe)
// //       this.bag.setDepth(this.bag.y + 50);
// //     }

// //     this.bag.on("pointerdown", () => {
// //       emit("badgeEarned", "Curious Cat 😼");
// //     });

// //   }
// // }



// import BaseStoryScene from "../BaseStoryScene";
// import { emit, on, off } from "../../../utils/eventBus";

// export default class Chapter1Scene3 extends BaseStoryScene {
//   constructor() {
//     super("Chapter1Scene3", {
//       sceneId: "cafeteria",
//       jsonKey: "chapter1Data",
//       jsonPath: "data/dialogues/chapters/chapter1_script.json",

//       backgroundKey: "bgCafeteria",
//       startNodeId: "f_intro_friends",
//       exitUnlockedFlag: "chapter1_scene3_exit_unlocked",

//       walkArea: {
//         zones: [
//           { xMin: 300, xMax: 600, yMin: 650, yMax: 1000 },
//           { xMin: 50, xMax: 1920, yMin: 990, yMax: 1080 }
//         ],
//         topY: 700,
//         bottomY: 1080
//       },

//       scaleFar: 0.8,
//       scaleNear: 1.55,
//       scaleTopOffset: 20,

//       door: { x: 200, y: 490, w: 120, h: 220, texture: "bgCafeteriaDoor" },

//       npcs: [
//         {
//           name: "friends",
//           texture: "buddies",
//           x: 887,
//           y: 670,
//           scale: 0.45,
//           dialogueId: "f_intro_friends",
//           inspectDialogueId: "friend_looking_posters"
//         },
//         {
//           name: "alice",
//           texture: "npcgirlflip",
//           x: 95,
//           y: 575,
//           scale: 0.23,
//           dialogueId: "f_talk_alice",
//           inspectDialogueId: "friend_looking_posters"
//         }
//       ]
//     });

//     // REQUIRED objectives
//     this.talkedToFriends = false;
//     this.talkedToAlice = false;

//     this.doorUnlocked = false;

//     localStorage.setItem("sdgExplorer:lastRoute", "/game");
//   }

//   create() {
//     super.create();

//     emit("updateChapterScene", {
//       title: "Cafeteria · Chapter 1"
//     });
//   }

//   // --------------------------------------------------
//   // Custom setup
//   // --------------------------------------------------
//   _customCreate() {
//     // PRIMARY objective
//     emit("updateObjective", {
//       slot: "primary",
//       collected: 0,
//       goal: 1,
//       description: "Talk to your friends in the cafeteria.",
//       complete: false
//     });

//     // SECONDARY objective (MANDATORY)
//     emit("updateObjective", {
//       slot: "secondary",
//       collected: 0,
//       goal: 1,
//       description: "Talk to Alice before leaving.",
//       complete: false
//     });

//     this._createBag();
//     this.doorUnlocked = false;

//     // ---- Dialogue completion wiring ----
//     this._onDialogueEnded = ({ lastNodeId }) => {
//       switch (lastNodeId) {
//         case "f_intro_friends":
//           this._handleFriendsComplete();
//           break;
//         case "f_talk_alice":
//           this._handleAliceComplete();
//           break;
//       }
//     };

//     on("dialogueEnded", this._onDialogueEnded);

//     this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
//       off("dialogueEnded", this._onDialogueEnded);
//     });
//   }

//   // --------------------------------------------------
//   // Objective handlers
//   // --------------------------------------------------
//   _handleFriendsComplete() {
//     if (this.talkedToFriends) return;

//     this.talkedToFriends = true;

//     emit("updateObjective", {
//       slot: "primary",
//       delta: 1,
//       complete: true
//     });

//     emit("updateSDGPoints", 10);

//     this._checkDoorUnlock();
//   }

//   _handleAliceComplete() {
//     if (this.talkedToAlice) return;

//     this.talkedToAlice = true;

//     emit("updateObjective", {
//       slot: "secondary",
//       delta: 1,
//       complete: true
//     });

//     emit("badgeEarned", "Curious Mind 🧠");

//     this._checkDoorUnlock();
//   }

//   // --------------------------------------------------
//   // Door logic
//   // --------------------------------------------------
//   _checkDoorUnlock() {
//     if (this.talkedToFriends && this.talkedToAlice && !this.doorUnlocked) {
//       this.doorUnlocked = true;
//       this._unlockDoorGlow?.();
//       emit("badgeEarned", "Chapter 2 Unlocked 🔓");
//     }
//   }

//   _onDoorClicked() {
//     if (!this.doorUnlocked) {
//       console.log("Door locked. Talk to everyone first.");
//       return;
//     }

//     if (this.playerInExitZone) {
//       this.goToNextScene();
//     }
//   }

//   // --------------------------------------------------
//   // Easter egg
//   // --------------------------------------------------
//   _createBag() {
//     this.bag = this.add
//       .image(975, 870, "bag")
//       .setInteractive({ useHandCursor: true })
//       .setScale(0.5);

//     const buddies = this.npcs?.find(npc => npc.name === "friends");
//     if (buddies?.sprite) {
//       this.bag.setDepth(buddies.sprite.depth + 1);
//     } else {
//       this.bag.setDepth(this.bag.y + 50);
//     }

//     this.bag.on("pointerdown", () => {
//       emit("badgeEarned", "Curious Cat 😼");
//     });
//   }
// }


import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";

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
          inspectDialogueId: "friend_looking_posters"
        },
        {
          name: "alice",
          texture: "npcgirlflip",
          x: 95,
          y: 575,
          scale: 0.23,
          dialogueId: "f_talk_alice",
          inspectDialogueId: "friend_looking_posters"
        }
      ]
    });

    // objectives
    this.objectiveStep = 1;         // 1 = talk, 2 = posters
    this.objectiveCompleted = false;

    // local state just for posters
    this.posterFound = 0;
    this.posterGoal = 2;

    // bind storage route
    localStorage.setItem("sdgExplorer:lastRoute", "/game");
  }

  create() {
    super.create();
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
      description: "Optional: Find all the posters in the cafeteria.",
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

    emit("updateSDGPoints", 10);
    emit("badgeEarned", "Food Bank Unlocked! 🔓");

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
      goal: this.posterGoal,
      description: "Optional: Find all the posters in the cafeteria.",
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
    emit("updateSDGPoints", points);
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


    this.trashCollected += 1;

    emit("updateObjective", {
      slot: "secondary",
      delta: 1,
    });

    if (!this.objectiveCompleted && this.trashCollected >= this.trashGoal) {
      this.objectiveCompleted = true;
      emit("badgeEarned", "Poster Hunter 2! 🏅");
      emit("updateObjective", { slot: "secondary", complete: true });
    }
  }

  // --------------------------------
  // Door click override: locked until unlocked
  // --------------------------------
  _onDoorClicked() {
    if (!this.doorUnlocked) {
      console.log("Door locked. Talk to your friends first.");
      return;
    }

    if (this.playerInExitZone) this.goToNextScene();
    else console.log("Too far from the door.");
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
}
