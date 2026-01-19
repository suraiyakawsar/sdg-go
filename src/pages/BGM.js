let bgm = null;
let pendingVolume = 0.3;

export function playBGM(scene) {
    scene.sound.context.resume();

    if (!bgm) {
        bgm = scene.sound.add("sdgoMusic", {
            loop: true,
            volume: pendingVolume
        });
        bgm.play();
    }
}

export function setBGMVolume(v) {
    pendingVolume = v;
    if (bgm) bgm.setVolume(v);
}
