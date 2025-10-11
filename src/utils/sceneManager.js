// src/utils/sceneManager.js
export const SceneManager = {
    scenes: ["Chapter1Scene", "Chapter2Scene", "Chapter3Scene"], // add as you go
    currentIndex: 0,

    nextScene(scene, sdgPoints = 0) {
        this.currentIndex++;
        if (this.currentIndex < this.scenes.length) {
            scene.scene.start(this.scenes[this.currentIndex], { sdgPoints });
        } else {
            console.log("🎉 Game finished!");
            // Optionally: go to end scene or main menu
            scene.scene.start("EndScene", { sdgPoints });
        }
    },

    reset() {
        this.currentIndex = 0;
    }
};
