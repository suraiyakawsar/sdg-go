// import BaseStoryScene from "../BaseStoryScene";
// import { emit, on /*, off*/ } from "../../../utils/eventBus";

// export default class Chapter2Scene1 extends BaseStoryScene {
//     constructor() {
//         super("Chapter2Scene1", {
//             // ✅ MUST match your JSON scene id for Chapter 2 Scene 1
//             // change this once you add the chapter2_script.json
//             sceneId: "chapter2_scene1",

//             // ✅ change these to your real Chapter 2 json file/key
//             jsonKey: "chapter2Data",
//             jsonPath: "data/dialogues/chapters/chapter2_script.json",

//             // ✅ change these to your real scene assets + node ids
//             backgroundKey: "bgFoodBank",      // <-- replace if different
//             startNodeId: "ch2_s1_intro",      // <-- replace with your first node id
//             exitUnlockedFlag: "chapter2_scene1_exit_unlocked",

//             // ✅ walk polygon — replace with your new scene’s values
//             // walkArea: {
//             //     topY: 900,
//             //     bottomY: 1077,
//             //     leftTopX: 400,
//             //     rightTopX: 1300,
//             //     leftBottomX: 200,
//             //     rightBottomX: 1600,
//             // },

//             walkArea: {
//                 zones: [

//                     // { xMin: 400, xMax: 1300, yMin: 700, yMax: 1000 }, // Main area

//                     { xMin: 600, xMax: 1580, yMin: 950, yMax: 1090 }, // Main area
//                     // { xMin: 400, xMax: 1600, yMin: 960, yMax: 1200 } // Floor
//                 ],
//                 // Required only for character scaling math
//                 topY: 850,
//                 bottomY: 1080,

//                 leftBottomX: 200,
//                 leftTopX: 500,

//                 rightTopX: 700,
//                 rightBottomX: 600,

//                 scaleFar: 1.5,  // Increase this if she is too small at the back
//                 scaleNear: 0.5,  // Decrease this if she is too big at the front
//                 playerSpeed: 200
//             },


//             // perfect scaling values found via tracker:
//             scaleFar: 1,
//             scaleNear: 1.4,
//             // Add this if you use Option 1:
//             scaleTopOffset: 20,


//             // ✅ door (swap texture/x/y to match your artwork)
//             door: {
//                 x: 300,
//                 y: 600,
//                 w: 120,
//                 h: 220,
//                 texture: "doorFoodBank", // <-- replace (or reuse a generic door)
//             },

//             // ✅ NPCs: replace with your actual Chapter 2 Scene 1 NPCs
//             npcs: [
//                 {
//                     name: "Owen, Food Bank Organizer",
//                     texture: "owenOrganizer",   // <-- replace
//                     x: 900,
//                     y: 650,
//                     scale: 0.35,
//                     dialogueId: "ch2_s1_staff", // <-- replace
//                 }
//                 // {
//                 //     name: "friendA",
//                 //     texture: "npc_friendA", // <-- replace
//                 //     x: 700,
//                 //     y: 780,
//                 //     scale: 0.35,
//                 //     dialogueId: "ch2_s1_friendA", // <-- replace
//                 // },
//                 // {
//                 //     name: "friendB",
//                 //     texture: "npc_friendB", // <-- replace
//                 //     x: 1100,
//                 //     y: 780,
//                 //     scale: 0.35,
//                 //     dialogueId: "ch2_s1_friendB", // <-- replace
//                 // },
//             ],
//         });

//         // objective state (optional for this scene)
//         this.objectiveCompleted = false;
//     }


//     create() {
//         super.create();
//         emit("updateChapterScene", { title: "Food Bank · Chapter 2" });
//     }

//     // --------------------------------
//     // called after BaseStoryScene.create()
//     // --------------------------------
//     _customCreate() {
//         // Example objective (edit or delete)
//         emit("updateObjective", {
//             slot: "primary",
//             collected: 0,
//             goal: 1,
//             description: "Help at the food bank (talk to staff).",
//             complete: false,
//         });

//         // Listen for JSON unlock event
//         this._onSceneExitUnlocked = (payload) => {
//             const { sceneId, exitFlag } = payload || {};
//             if (sceneId !== this._story?.sceneId) return;
//             if (exitFlag !== this._story?.exitUnlockedFlag) return;

//             if (!this.objectiveCompleted) {
//                 this.objectiveCompleted = true;

//                 emit("updateObjective", {
//                     slot: "primary",
//                     delta: 1,
//                     complete: true,
//                 });

//                 // unlock door (BaseStoryScene glow helper)
//                 this.doorUnlocked = true;
//                 this._unlockDoorGlow?.();
//             }
//         };

//         on("sceneExitUnlocked", this._onSceneExitUnlocked);

//         this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
//             // if (typeof off === "function") off("sceneExitUnlocked", this._onSceneExitUnlocked);
//         });

//         // start intro dialogue (optional; remove if you want “click NPC to start” only)
//         this.time.delayedCall(350, () => this.startDialogue());
//     }

//     // --------------------------------
//     // door click override
//     // --------------------------------
//     _onDoorClicked() {
//         if (!this.doorUnlocked) {
//             console.log("Door locked. Finish the scene first.");
//             return;
//         }

//         if (this.playerInExitZone) this.goToNextScene();
//         else console.log("Too far from the door.");
//     }
// }












// import BaseStoryScene from "../BaseStoryScene";
// import { emit, on, off } from "../../../utils/eventBus";
// import { addSDGPoints } from "../../../utils/sdgPoints";

// export default class Chapter2Scene1 extends BaseStoryScene {
//     constructor() {
//         super("Chapter2Scene1", {
//             sceneId: "chapter2_scene1",
//             jsonKey: "chapter2Data",
//             jsonPath: "data/dialogues/chapters/chapter2_script.json",
//             backgroundKey: "bgFoodBank",
//             startNodeId: "ch2_s1_intro",
//             exitUnlockedFlag: "chapter2_scene1_exit_unlocked",

//             walkArea: {
//                 zones: [
//                     { xMin: 600, xMax: 1580, yMin: 950, yMax: 1090 },
//                 ],
//                 topY: 850,
//                 bottomY: 1080,
//                 leftBottomX: 200,
//                 leftTopX: 500,
//                 rightTopX: 700,
//                 rightBottomX: 600,
//                 scaleFar: 1.5,
//                 scaleNear: 0.5,
//                 playerSpeed: 200
//             },

//             scaleFar: 1,
//             scaleNear: 1.4,
//             scaleTopOffset: 20,

//             door: { x: 300, y: 600, w: 120, h: 220, texture: "doorFoodBank" },

//             npcs: [
//                 {
//                     name: "owenOrganizer",
//                     texture: "owenOrganizer",
//                     x: 900,
//                     y: 650,
//                     scale: 0.5,
//                     dialogueId: "ch2_s1_staff",
//                 }
//             ],
//         });

//         // Objective tracking
//         this.talkedToOwen = false;
//         this.posterCollected = 0;
//         this.posterGoal = 2;
//         this.objectiveCompleted = false;
//     }

//     create() {
//         super.create();
//         emit("updateChapterScene", { title: "Food Bank · Chapter 2" });
//     }

//     _customCreate() {
//         // Primary objective
//         emit("updateObjective", {
//             slot: "primary",
//             collected: 0,
//             goal: 1,
//             description: "Help at the food bank (talk to Owen).",
//             complete: false,
//         });

//         // Secondary objective (hidden initially)
//         emit("updateObjective", {
//             slot: "secondary",
//             preview: true,
//             active: false,
//             collected: 0,
//             goal: this.posterGoal,
//             description: "Optional: Find hidden food bank posters.",
//         });

//         // Posters
//         this._createPosters();

//         // Listen for scene exit unlock
//         this._onSceneExitUnlocked = (payload) => {
//             const { sceneId, exitFlag } = payload || {};
//             if (sceneId !== this._story?.sceneId || exitFlag !== this._story?.exitUnlockedFlag) return;

//             // Safety: unlock door if needed
//             if (!this.doorUnlocked && this.talkedToOwen) {
//                 this.doorUnlocked = true;
//                 this._unlockDoorGlow?.();
//             }
//         };
//         on("sceneExitUnlocked", this._onSceneExitUnlocked);

//         this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
//             // Cleanup
//         });

//         // Optional: start intro dialogue automatically
//         this.time.delayedCall(350, () => this.startDialogue());



//         // --- FIX START: Listen for dialogue completion ---
//         this._handleDialogueEnd = (npcName) => {
//             console.log("Dialogue ended for:", npcName); // Debugging log
//             this.onNPCDialogueComplete(npcName);
//         };

//         // Note: Verify if your system uses "dialogueComplete", "dialogueEnded", or "npcDialogueEnd"
//         on("dialogueComplete", this._handleDialogueEnd);
//         // --- FIX END ---

//         // ... (existing posters code) ...

//         this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
//             // Cleanup listeners to prevent memory leaks/double firing
//             off("sceneExitUnlocked", this._onSceneExitUnlocked);
//             off("dialogueComplete", this._handleDialogueEnd);
//         });

//         this.time.delayedCall(350, () => this.startDialogue());
//     }

//     // NPC dialogue completion
//     onNPCDialogueComplete(npcName) {
//         // Added logging to check for ID Mismatches
//         console.log(`Checking objective: Got '${npcName}', Expected 'owenOrganizer'`);

//         // Check against "owenOrganizer" OR the dialogue ID "ch2_s1_staff" just in case
//         if (npcName === "owenOrganizer" && !this.talkedToOwen) {
//             this.talkedToOwen = true;
//             this.objectiveCompleted = true;

//             emit("updateObjective", { slot: "primary", delta: 1, complete: true });
//             emit("badgeEarned", "Helping Hand 🏅");

//             // Activate posters
//             emit("updateObjective", { slot: "secondary", active: true, preview: false });

//             // Unlock door
//             this.doorUnlocked = true;
//             this._unlockDoorGlow?.();
//         }
//     }


//     // Posters logic
//     _createPosters() {
//         this.poster1 = this.add.image(500, 500, "poster_sdg4").setInteractive({ useHandCursor: true });
//         this.poster2 = this.add.image(1200, 450, "poster_sdg13").setInteractive({ useHandCursor: true });

//         [this.poster1, this.poster2].forEach((poster) => {
//             poster.on("pointerdown", () => this._handlePosterClick(poster));
//         });
//     }

//     _handlePosterClick(posterItem) {
//         if (!posterItem?.scene) return;

//         const points = 3;
//         addSDGPoints(points);
//         emit("updateSDGPoints", points);
//         emit("badgeEarned", `Found a poster! (+${points})`);

//         // Floating text
//         const msg = this.add.text(posterItem.x, posterItem.y - 40, `+${points}`, {
//             font: "16px Arial",
//             fill: "#0f0",
//         }).setOrigin(0.5);

//         this.tweens.add({
//             targets: msg,
//             y: msg.y - 40,
//             alpha: 0,
//             duration: 700,
//             onComplete: () => msg.destroy(),
//         });

//         posterItem.destroy();
//         this.posterCollected += 1;
//         emit("updateObjective", { slot: "secondary", delta: 1 });

//         if (this.posterCollected >= this.posterGoal) {
//             emit("badgeEarned", "Poster Hunter 🏅");
//             emit("updateObjective", { slot: "secondary", complete: true });
//         }
//     }

//     _onDoorClicked() {
//         if (!this.doorUnlocked) {
//             console.log("Door locked. Talk to Owen first.");
//             return;
//         }
//         if (this.playerInExitZone) this.goToNextScene();
//     }
// }





import BaseStoryScene from "../BaseStoryScene";
import { emit, on, off } from "../../../utils/eventBus";
import { addSDGPoints } from "../../../utils/sdgPoints";

export default class Chapter2Scene1 extends BaseStoryScene {
    constructor() {
        super("Chapter2Scene1", {
            sceneId: "foodbank",
            jsonKey: "chapter2Data",
            jsonPath: "data/dialogues/chapters/chapter2_script.json",

            backgroundKey: "bgFoodBank",
            startNodeId: "ch2_s1_intro",
            exitUnlockedFlag: "chapter2_scene1_exit_unlocked",



            walkArea: {
                zones: [
                    { xMin: 600, xMax: 1580, yMin: 950, yMax: 1090 },
                ],
                topY: 850,
                bottomY: 1080,
                leftBottomX: 200,
                leftTopX: 500,
                rightTopX: 700,
                rightBottomX: 600,
                scaleFar: 1.5,
                scaleNear: 0.5,
                playerSpeed: 200
            },

            scaleFar: 1,
            scaleNear: 1.4,
            scaleTopOffset: 20,

            door: { x: 272, y: 609, w: 120, h: 220, texture: "doorFoodBank" },


            npcs: [
                {
                    name: "owenOrganizer",
                    texture: "owenOrganizer",
                    x: 1008,
                    y: 664,
                    scale: 0.7,
                    dialogueId: "ch2_s1_staff",
                }
            ],
        });

        // objectives
        this.objectiveStep = 1;         // 1 = talk, 2 = poster
        this.objectiveCompleted = false;

        this.posterCollected = 0;
        this.posterGoal = 2;

        // bind storage route
        localStorage.setItem("sdgExplorer:lastRoute", "/game");
    }

    create() {
        super.create();
        emit("updateChapterScene", { title: "Food Bank · Chapter 2" });

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

        // Secondary: poster (preview only until step 2)
        emit("updateObjective", {
            slot: "secondary",
            preview: true,
            active: false,
            collected: 0,
            goal: this.posterGoal,
            description: "Optional: Collect all the posters.",
        });

        this._createPosters();

        // Door starts locked until JSON unlock event fires
        this.doorUnlocked = false;

        // Listen once for JSON unlock flag
        this._onSceneExitUnlocked = (payload) => {
            const { sceneId, exitFlag } = payload || {};
            if (sceneId !== "foodbank") return;
            if (exitFlag !== "chapter2_scene1_exit_unlocked") return;

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
            description: "Collect all the posters.",
        });
    }

    // --------------------------------
    // Posters
    // --------------------------------
    _createPosters() {
        this.poster1 = this.add.image(900, 900, "poster1").setInteractive({ useHandCursor: true }).setScale(0.3);
        this.poster2 = this.add.image(900, 800, "poster2").setInteractive({ useHandCursor: true }).setScale(0.2);

        this.poster1.on("pointerdown", () => this._handlePosterClick(this.poster1));
        this.poster2.on("pointerdown", () => this._handlePosterClick(this.poster2));
    }

    _handlePosterClick(posterItem) {
        if (!posterItem?.scene) return;
        // poster only active in step 2
        if (this.objectiveStep !== 2) return;

        const points = 3;
        addSDGPoints(points);
        emit("updateSDGPoints", points);

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
