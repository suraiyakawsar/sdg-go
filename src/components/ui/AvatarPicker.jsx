import { useState, useMemo } from "react";
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
import { LazyMotion, domAnimation, m } from "framer-motion";

// Available avatar styles
const STYLES = [
    { name: "Adventurer", style: adventurer },
    { name: "Neutral", style: adventurerNeutral },
    { name: "Avataaars", style: avataaars },
    { name: "Robots", style: bottts },
    { name: "Emoji", style: funEmoji },
    { name: "Lorelei", style: lorelei },
    { name: "Notionists", style: notionists },
    { name: "Open Peeps", style: openPeeps },
    { name: "Personas", style: personas },
    { name: "Pixel Art", style: pixelArt },
];

export default function AvatarPicker({ initialSeed = "player", onSelect, onCancel }) {
    const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);
    const [seed, setSeed] = useState(initialSeed);

    // Generate avatar SVG (memoized for performance)
    const avatarUri = useMemo(() => {
        const avatar = createAvatar(STYLES[selectedStyleIndex].style, {
            seed: seed,
            size: 128,
        });
        return avatar.toDataUri();
    }, [selectedStyleIndex, seed]);

    // Generate 6 preview options with different seeds
    const previewOptions = useMemo(() => {
        return Array.from({ length: 6 }, (_, i) => {
            const previewSeed = `${seed}-option-${i}`;
            const avatar = createAvatar(STYLES[selectedStyleIndex].style, {
                seed: previewSeed,
                size: 64,
            });
            return {
                seed: previewSeed,
                uri: avatar.toDataUri(),
            };
        });
    }, [selectedStyleIndex, seed]);

    // Randomize seed
    const randomize = () => {
        setSeed(`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    };

    // Confirm selection
    const handleConfirm = () => {
        onSelect?.({
            styleName: STYLES[selectedStyleIndex].name,
            styleIndex: selectedStyleIndex,
            seed: seed,
            uri: avatarUri,
        });
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="flex flex-col items-center gap-5 p-6 max-w-md mx-auto">
                {/* Main Avatar Preview */}
                <m.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                >
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-400/50 shadow-[0_0_40px_rgba(52,211,153,0.35)] bg-black/40">
                        <img
                            src={avatarUri}
                            alt="Selected avatar"
                            className="w-full h-full object-cover"
                            draggable={false}
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-black flex items-center justify-center text-xs">
                        ✓
                    </div>
                </m.div>

                {/* Style Selector */}
                <div className="w-full">
                    <div className="text-xs text-white/55 uppercase tracking-wider mb-2 text-center">
                        Avatar Style
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {STYLES.map((s, i) => (
                            <m.button
                                key={s.name}
                                type="button"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedStyleIndex(i)}
                                className={[
                                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition",
                                    i === selectedStyleIndex
                                        ? "bg-emerald-500 text-white shadow-[0_4px_15px_rgba(52,211,153,0.4)]"
                                        : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/10",
                                ].join(" ")}
                            >
                                {s.name}
                            </m.button>
                        ))}
                    </div>
                </div>

                {/* Preview Options Grid */}
                <div className="w-full">
                    <div className="text-xs text-white/55 uppercase tracking-wider mb-2 text-center">
                        Pick a Variation
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {previewOptions.map((option, i) => (
                            <m.button
                                key={i}
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSeed(option.seed)}
                                className={[
                                    "aspect-square rounded-xl overflow-hidden border-2 transition bg-black/40",
                                    seed === option.seed
                                        ? "border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                                        : "border-white/10 hover:border-white/30",
                                ].join(" ")}
                            >
                                <img
                                    src={option.uri}
                                    alt={`Option ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                />
                            </m.button>
                        ))}
                    </div>
                </div>

                {/* Randomize Button */}
                <m.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={randomize}
                    className="px-5 py-2. 5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-200 hover:bg-purple-500/30 transition text-sm font-semibold flex items-center gap-2"
                >
                    <span>🎲</span> Shuffle All
                </m.button>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full mt-2">
                    {onCancel && (
                        <m.button
                            type="button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition font-semibold"
                        >
                            Cancel
                        </m.button>
                    )}
                    <m.button
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-lime-500/15 border border-emerald-400/30 text-white font-semibold shadow-[0_12px_35px_-20px_rgba(16,185,129,0.6)] hover:from-emerald-500/40 transition"
                    >
                        ✓ Use This Avatar
                    </m.button>
                </div>
            </div>
        </LazyMotion>
    );
}