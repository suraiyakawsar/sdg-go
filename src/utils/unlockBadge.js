// src/utils/unlockBadge.js

import { BADGES } from "../utils/badges";
import { emit } from "./eventBus";

/**
 * Unlocks a badge by key, saves to localStorage, and triggers popup + re-render
 * @param {string} badgeKey - Key from BADGES array
 */
export function unlockBadge(badgeKey) {
    // Check if already unlocked
    const savedKeys = JSON.parse(localStorage.getItem("collectedBadges") || "[]");

    if (savedKeys.includes(badgeKey)) {
        console.log(`Badge "${badgeKey}" already unlocked. `);
        return;
    }

    // Find badge data
    const badgeData = BADGES.find(b => b.key === badgeKey);
    if (!badgeData) {
        console.warn(`Badge key "${badgeKey}" not found in BADGES registry.`);
        return;
    }

    // Save to localStorage
    savedKeys.push(badgeKey);
    localStorage.setItem("collectedBadges", JSON.stringify(savedKeys));
    console.log(`✅ Badge saved to localStorage: ${badgeKey}`, savedKeys);

    // Trigger popup event with badge data
    emit("badgeEarned", {
        name: badgeData.name,
        icon: "🏆", // Use emoji for now (simpler)
        subtitle: badgeData.desc,
    });

    console.log(`✅ Badge unlocked: ${badgeData.name}`);

    // Trigger storage event manually for same-tab updates
    window.dispatchEvent(new Event("storage"));
}