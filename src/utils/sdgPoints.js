import { emit } from "./eventBus";

let sdgPoints = 0;

export function getPoints() {
  return sdgPoints;
}

export function addSDGPoints(amount) {
  sdgPoints += amount;
  if (sdgPoints < 0) sdgPoints = 0;

  // Emit for your SDGBar in React
  emit("updateSDGPoints", sdgPoints);

  return sdgPoints;
}

export function resetPoints() {
  sdgPoints = 0;
  emit("updateSDGPoints", sdgPoints);
}
