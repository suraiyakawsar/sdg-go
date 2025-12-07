import { createContext, useContext, useEffect, useState } from "react";
import { loadProfile, saveProfile, resetProfile as resetStorage } from "../utils/profileStorage";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load once on app startup
    useEffect(() => {
        const saved = loadProfile();
        setProfile(saved);
        setLoading(false);
    }, []);

    function updateProfile(newProfile) {
        const saved = saveProfile(newProfile);
        setProfile(saved);
    }

    function resetProfile() {
        resetStorage();
        setProfile(null);
    }

    return (
        <PlayerContext.Provider value={{ profile, loading, updateProfile, resetProfile }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
    return ctx;
}
