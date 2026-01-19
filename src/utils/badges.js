// src/data/badges.js

import {
    FiAward,
    FiStar,
    FiTarget,
    FiHeart,
    FiBookOpen,
    FiTool,
    FiCompass,
    FiCheckCircle,
    FiDroplet,
    FiCpu,
} from "react-icons/fi";

/**
 * Central badge registry — 10 badges for the game
 * Reference this in BadgePage, unlockBadge, and all scenes
 */
export const BADGES = [
    {
        key: "first-awareness",
        name: "First Awareness",
        color: "#23C96F",
        Icon: FiAward,
        desc: "Get introduced to the SDGs.",
        unlockHint: "Talk to a certain someone in Chapter 1.",
    },
    {
        key: "eco-warrior",
        name: "Eco Warrior",
        color: "#23C96F",
        Icon: FiAward,
        desc: "Collected all trash in the hallway.",
        unlockHint: "Pick up all trash in Chapter 1.",
    },
    {
        key: "fast-learner",
        name: "Fast Learner",
        color: "#4B70E2",
        Icon: FiBookOpen,
        desc: "Completed the tutorial quickly.",
        unlockHint: "Finish tutorial without hints.",
    },
    {
        key: "kind-heart",
        name: "Kind Heart",
        color: "#FB7185",
        Icon: FiHeart,
        desc: "Showed empathy to a struggling NPC.",
        unlockHint: "Choose an empathetic dialogue option.",
    },
    {
        key: "objective-hunter",
        name: "Objective Hunter",
        color: "#F59E0B",
        Icon: FiTarget,
        desc: "Completed all objectives in a scene.",
        unlockHint: "Finish every active objective.",
    },
    {
        key: "explorer",
        name: "Explorer",
        color: "#60A5FA",
        Icon: FiCompass,
        desc: "Found a hidden hotspot.",
        unlockHint: "Interact with secret areas.",
    },
    {
        key: "fixer",
        name: "Fixer",
        color: "#22D3EE",
        Icon: FiTool,
        desc: "Solved 3 different problems.",
        unlockHint: "Repair, resolve, or report issues across chapters.",
    },
    {
        key: "eco-ace",
        name: "Eco Ace",
        color: "#FBBF24",
        Icon: FiStar,
        desc: "Finished a chapter flawlessly.",
        unlockHint: "Complete a scene with zero negative choices.",
    },
    {
        key: "collector",
        name: "Collector",
        color: "#E879F9",
        Icon: FiCheckCircle,
        desc: "Unlocked 7+ badges.",
        unlockHint: "Collect most of the available badges.",
    },
    {
        key: "water-saver",
        name: "Water Saver",
        color: "#26BDE2",
        Icon: FiDroplet,
        desc: "Reported a water waste issue.",
        unlockHint: "Find and report the water leak.",
    },
    {
        key: "innovator",
        name: "Innovator",
        color: "#FD6925",
        Icon: FiCpu,
        desc: "Proposed a practical solution.",
        unlockHint: "Suggest an innovation in dialogue.",
    },
];