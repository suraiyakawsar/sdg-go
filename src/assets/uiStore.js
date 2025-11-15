import { create } from "zustand";

export const uiStore = create((set) => ({
    sdgPoints: 0,
    objectives: { collected: 0, goal: 2 },

    // Actions
    setSdgPoints: (value) => set({ sdgPoints: value }),
    setObjectives: (obj) => set({ objectives: obj }),
}));
import { create } from "zustand";

export const useUIStore = create((set) => ({
    sdgPoints: 0,
    objectives: { collected: 0, goal: 2 },

    // Actions
    setSdgPoints: (value) => set({ sdgPoints: value }),
    setObjectives: (obj) => set({ objectives: obj }),
}));
