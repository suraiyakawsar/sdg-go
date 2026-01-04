import { emit } from "./eventBus";

const STORAGE_KEY = "sdgPoints";
let sdgPoints = Number(localStorage.getItem(STORAGE_KEY)) || 0;
/**
 * Get current total SDG points
 * @returns {number} Total points earned across all chapters
 */
export function getPoints() {
  return sdgPoints;
}
/**
 * Add or subtract SDG points
 * Updates both memory and localStorage
 * @param {number} amount - Points to add (can be negative)
 * @returns {number} New total points
 */
export function addSDGPoints(amount) {
  sdgPoints += amount;
  if (sdgPoints < 0) sdgPoints = 0;

  // ✅ Save to persistent storage
  localStorage.setItem(STORAGE_KEY, sdgPoints);
  // ✅ Emit delta(not total) to UI
  emit("updateSDGPoints", amount);

  console.log(`📊 SDG Points Updated: +${amount} → Total: ${sdgPoints}`);
  return sdgPoints;
}

/**
 * Reset all SDG points
 */
export function resetPoints() {
  sdgPoints = 0;
  localStorage.setItem(STORAGE_KEY, "0");
  emit("updateSDGPoints", 0);
}