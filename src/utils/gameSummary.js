// src/utils/gameSummary.js

// ✅ Title tiers based on SDG points and choices
const PLAYER_TITLES = [
    {
        minPoints: 150,
        minGoodChoices: 15,
        title: "SDG Champion",
        emoji: "🏆",
        description: "A true sustainability hero!  Your choices consistently prioritized the planet and people.",
        tier: "legendary",
        color: "#FFD700",
        bgGradient: "from-amber-500/30 via-yellow-500/20 to-orange-500/30",
    },
    {
        minPoints: 120,
        minGoodChoices: 12,
        title: "Eco Warrior",
        emoji: "🌿",
        description: "You fought hard for sustainability and made impactful decisions throughout your journey.",
        tier: "epic",
        color: "#34D399",
        bgGradient: "from-emerald-500/30 via-green-500/20 to-teal-500/30",
    },
    {
        minPoints: 90,
        minGoodChoices: 9,
        title: "Green Guardian",
        emoji: "🛡️",
        description: "A reliable protector of sustainable values.  You made many thoughtful choices.",
        tier: "rare",
        color: "#60A5FA",
        bgGradient: "from-blue-500/30 via-cyan-500/20 to-indigo-500/30",
    },
    {
        minPoints: 60,
        minGoodChoices: 6,
        title: "Conscious Explorer",
        emoji: "🧭",
        description: "You're learning and growing!  Some good choices, with room to improve.",
        tier: "uncommon",
        color: "#A78BFA",
        bgGradient: "from-purple-500/30 via-violet-500/20 to-fuchsia-500/30",
    },
    {
        minPoints: 30,
        minGoodChoices: 3,
        title: "Casual Observer",
        emoji: "👀",
        description: "You went through the motions, but didn't fully commit to sustainability.",
        tier: "common",
        color: "#9CA3AF",
        bgGradient: "from-gray-500/30 via-slate-500/20 to-zinc-500/30",
    },
    {
        minPoints: 0,
        minGoodChoices: 0,
        title: "Careless Wanderer",
        emoji: "🌪️",
        description: "Sustainability wasn't your priority.  The planet felt your indifference.",
        tier: "basic",
        color: "#F87171",
        bgGradient: "from-red-500/30 via-rose-500/20 to-pink-500/30",
    },
];

// ✅ Chapter-specific titles (smaller scale)
export const CHAPTER_TITLES = [
    { minPoints: 40, title: "Outstanding", emoji: "⭐", color: "#FFD700" },
    { minPoints: 30, title: "Great Job", emoji: "🎉", color: "#34D399" },
    { minPoints: 20, title: "Good Effort", emoji: "👍", color: "#60A5FA" },
    { minPoints: 10, title: "Room to Grow", emoji: "🌱", color: "#A78BFA" },
    { minPoints: 0, title: "Needs Work", emoji: "💭", color: "#9CA3AF" },
];

// ✅ Chapter info
export const CHAPTER_INFO = {
    1: { name: "Campus Life", scene: "Hallway", sdgFocus: "Quality Education" },
    2: { name: "Food Bank", scene: "Community", sdgFocus: "Zero Hunger" },
    3: { name: "Garden", scene: "Environment", sdgFocus: "Life on Land" },
    4: { name: "Pond", scene: "Reflection", sdgFocus: "Clean Water" },
};

// ✅ Get chapter-specific stats
export function getChapterStats(chapterNumber) {
    const chapterKey = `chapter${chapterNumber}`;

    const sdgPoints = Number(localStorage.getItem(`${chapterKey}_sdgPoints`)) || 0;
    const goodChoices = Number(localStorage.getItem(`${chapterKey}_goodChoices`)) || 0;
    const badChoices = Number(localStorage.getItem(`${chapterKey}_badChoices`)) || 0;
    const totalChoices = goodChoices + badChoices;

    // Get chapter title based on points
    let chapterTitle = CHAPTER_TITLES[CHAPTER_TITLES.length - 1];
    for (const tier of CHAPTER_TITLES) {
        if (sdgPoints >= tier.minPoints) {
            chapterTitle = tier;
            break;
        }
    }

    return {
        chapterNumber,
        chapterName: CHAPTER_INFO[chapterNumber]?.name || `Chapter ${chapterNumber}`,
        sdgFocus: CHAPTER_INFO[chapterNumber]?.sdgFocus || "Sustainability",
        sdgPoints,
        goodChoices,
        badChoices,
        totalChoices,
        chapterTitle,
    };
}

// ✅ Save chapter stats (call this at end of each chapter)
export function saveChapterStats(chapterNumber, stats) {
    const chapterKey = `chapter${chapterNumber}`;

    // Get current totals for this chapter's session
    const sessionPoints = Number(localStorage.getItem("sessionSDGPoints")) || 0;
    const sessionGood = Number(localStorage.getItem("sessionGoodChoices")) || 0;
    const sessionBad = Number(localStorage.getItem("sessionBadChoices")) || 0;

    // Save chapter-specific stats
    localStorage.setItem(`${chapterKey}_sdgPoints`, String(sessionPoints));
    localStorage.setItem(`${chapterKey}_goodChoices`, String(sessionGood));
    localStorage.setItem(`${chapterKey}_badChoices`, String(sessionBad));
    localStorage.setItem(`${chapterKey}_completed`, "true");

    // Reset session counters for next chapter
    localStorage.setItem("sessionSDGPoints", "0");
    localStorage.setItem("sessionGoodChoices", "0");
    localStorage.setItem("sessionBadChoices", "0");

    console.log(`✅ Chapter ${chapterNumber} stats saved: `, {
        points: sessionPoints,
        good: sessionGood,
        bad: sessionBad,
    });

    return {
        sdgPoints: sessionPoints,
        goodChoices: sessionGood,
        badChoices: sessionBad,
    };
}

// ✅ Get player title based on stats
export function getPlayerTitle(sdgPoints, goodChoices = 0, badChoices = 0) {
    const effectivePoints = sdgPoints + (goodChoices * 2) - (badChoices * 3);

    for (const tier of PLAYER_TITLES) {
        if (effectivePoints >= tier.minPoints && goodChoices >= tier.minGoodChoices) {
            return tier;
        }
    }

    return PLAYER_TITLES[PLAYER_TITLES.length - 1];
}

// ✅ Get all game stats from localStorage (for final summary)
export function getGameStats() {
    // Aggregate all chapter stats
    let totalPoints = 0;
    let totalGood = 0;
    let totalBad = 0;

    for (let i = 1; i <= 4; i++) {
        totalPoints += Number(localStorage.getItem(`chapter${i}_sdgPoints`)) || 0;
        totalGood += Number(localStorage.getItem(`chapter${i}_goodChoices`)) || 0;
        totalBad += Number(localStorage.getItem(`chapter${i}_badChoices`)) || 0;
    }


    // Count completed chapters
    let chaptersCompleted = 0;
    for (let i = 1; i <= 4; i++) {
        if (localStorage.getItem(`chapter${i}_completed`) === "true") {
            chaptersCompleted++;
        }
    }

    // Badges
    let badges = [];
    try {
        badges = JSON.parse(localStorage.getItem("collectedBadges") || "[]");
    } catch {
        badges = [];
    }

    return {
        sdgPoints: totalPoints,
        goodChoices: totalGood,
        badChoices: totalBad,
        totalChoices: totalGood + totalBad,
        chaptersCompleted,
        totalChapters: 4,
        badges: badges.length,
        playerTitle: getPlayerTitle(totalPoints, totalGood, totalBad),
        isGameComplete: chaptersCompleted >= 4,
    };
}

// ✅ Format play time
export function formatPlayTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
}

// ✅ Calculate grade
export function calculateGrade(stats) {
    const { sdgPoints, goodChoices, badChoices, chaptersCompleted, badges } = stats;

    let score = 0;
    score += Math.min(sdgPoints / 2, 40);
    score += Math.min(goodChoices * 3, 30);
    score += Math.min(chaptersCompleted * 5, 20);
    score += Math.min((badges || 0) * 2, 10);
    score -= badChoices * 2;

    score = Math.max(0, Math.min(100, score));

    if (score >= 95) return { grade: "A+", color: "#FFD700" };
    if (score >= 90) return { grade: "A", color: "#34D399" };
    if (score >= 80) return { grade: "B", color: "#60A5FA" };
    if (score >= 70) return { grade: "C", color: "#FBBF24" };
    if (score >= 60) return { grade: "D", color: "#F97316" };
    return { grade: "F", color: "#EF4444" };
}