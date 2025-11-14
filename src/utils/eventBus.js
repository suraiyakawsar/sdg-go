const listeners = {};

function on(event, callback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
}

function off(event, callback) {
  if (!listeners[event]) return;
  listeners[event] = listeners[event].filter((cb) => cb !== callback);
}

function emit(event, data) {
  if (!listeners[event]) return;
  listeners[event].forEach((cb) => cb(data));
}

function clear() {
  Object.keys(listeners).forEach((event) => delete listeners[event]);
}


function subscribe(event, callback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
  return () => { // unsubscribe function
    listeners[event] = listeners[event].filter(fn => fn !== callback);
  };
}
export const chapter1Scenes = [
  { id: "scene1", dialogueId: "intro", background: "bg" },
  { id: "scene2", dialogueId: "classroom", background: "classroomBg" },
  { id: "scene3", dialogueId: "cafeteria", background: "cafeteriaBg" }
];
export { on, off, emit, clear, subscribe };
export default { on, off, emit, clear, subscribe };

