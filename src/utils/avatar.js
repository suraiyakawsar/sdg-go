import { createAvatar } from "@dicebear/core";
import {
    adventurer,
    adventurerNeutral,
    avataaars,
    bottts,
    funEmoji,
    lorelei,
    notionists,
    openPeeps,
    personas,
    pixelArt,
} from "@dicebear/collection";

// Must match the order in AvatarPicker. jsx
const STYLES = [
    adventurer,
    adventurerNeutral,
    avataaars,
    bottts,
    funEmoji,
    lorelei,
    notionists,
    openPeeps,
    personas,
    pixelArt,
];

/**
 * Generate avatar URI from saved config
 * @param {Object} avatarConfig - { styleIndex, seed }
 * @param {number} size - Avatar size in pixels
 * @returns {string} Data URI of the avatar SVG
 */
export function getAvatarUri(avatarConfig, size = 128) {
    if (!avatarConfig?.seed) {
        // Return default if no config
        return null;
    }

    const styleIndex = avatarConfig.styleIndex ?? 0;
    const style = STYLES[styleIndex] ?? STYLES[0];

    const avatar = createAvatar(style, {
        seed: avatarConfig.seed,
        size,
    });

    return avatar.toDataUri();
}