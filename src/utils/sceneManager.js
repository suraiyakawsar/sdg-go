// src/utils/sceneManager.js
export const SceneManager = {
    scenes: [
        "Chapter1Scene",
        "Chapter1Scene2",
        "Chapter1Scene3",
        "Chapter2Scene1",
        "Chapter2Scene2",
        "Chapter2Scene3",
        "Chapter3Scene1",
        "Chapter3Scene2",
        "Chapter4Scene1",
        "Chapter4Scene2", // ✅ Add if missing
    ],
    currentIndex: 0,

    // ✅ NEW: Set currentIndex based on current scene name
    setCurrentScene(sceneName) {
        const index = this.scenes.indexOf(sceneName);
        if (index !== -1) {
            this.currentIndex = index;
            console.log(`📍 SceneManager set to: ${sceneName} (index ${index})`);
        } else {
            console.warn(`⚠️ Scene not found: ${sceneName}`);
        }
    },

    nextScene(scene, sdgPoints = 0) {
        // ✅ FIRST:  Sync currentIndex with actual current scene
        this.setCurrentScene(scene.scene.key);

        // Then increment to next
        this.currentIndex++;

        if (this.currentIndex < this.scenes.length) {
            const nextSceneName = this.scenes[this.currentIndex];
            console.log(`🎮 Going from ${scene.scene.key} → ${nextSceneName}`);
            scene.scene.start(nextSceneName, { sdgPoints });
        } else {
            console.log("🎉 Game finished!");
            scene.scene.start("EndScene", { sdgPoints });
        }
    },

    reset() {
        this.currentIndex = 0;
    }
};