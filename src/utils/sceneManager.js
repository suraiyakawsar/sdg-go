// src/utils/sceneManager.js
export const SceneManager = {
    scenes: ["Chapter1Scene", "Chapter1Scene2", "Chapter1Scene3", "Chapter2Scene1", "Chapter2Scene2", "Chapter2Scene3", "Chapter3Scene1", "Chapter3Scene2", "Chapter4Scene1", "Chapter4Scene3"], // add as you go
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
