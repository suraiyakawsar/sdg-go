// src/utils/eventBus.js

// Map(event -> Set(callback)) avoids duplicates and makes off() reliable.
const listeners = new Map();

function on(event, callback) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(callback);

  // return unsubscribe (handy in React)
  return () => off(event, callback);
}

function off(event, callback) {
  const set = listeners.get(event);
  if (!set) return;
  set.delete(callback);
  if (set.size === 0) listeners.delete(event);
}

function emit(event, data) {
  const set = listeners.get(event);
  if (!set) return;

  // copy protects against listeners removing themselves mid-emit
  [...set].forEach((cb) => {
    try {
      cb(data);
    } catch (err) {
      console.error(`[eventBus] listener error for "${event}"`, err);
    }
  });
}

function clear() {
  listeners.clear();
}

// Keep your old API working
function subscribe(event, callback) {
  return on(event, callback);
}

// // keep your export (you had this in eventBus for some reason)
// export const chapter1Scenes = [
//   { id: "scene1", dialogueId: "intro", background: "bg" },
//   { id: "scene2", dialogueId: "classroom", background: "classroomBg" },
//   { id: "scene3", dialogueId: "cafeteria", background: "cafeteriaBg" },
// ];

export { on, off, emit, clear, subscribe };
export default { on, off, emit, clear, subscribe };

