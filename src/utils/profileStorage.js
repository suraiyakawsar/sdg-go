// src/utils/profileStorage.js
const STORAGE_KEY = "sdgGoPlayerProfile";

export function loadProfile() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (err) {
        console.error("Failed to load profile", err);
        return null;
    }
}

export function saveProfile(profile) {
    try {
        const withMeta = {
            ...profile,
            updatedAt: new Date().toISOString(),
            createdAt: profile.createdAt || new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(withMeta));
        return withMeta;
    } catch (err) {
        console.error("Failed to save profile", err);
        return profile;
    }
}

export function resetProfile() {
    localStorage.removeItem(STORAGE_KEY);
}
