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

export { on, off, emit, clear };
export default { on, off, emit, clear };
