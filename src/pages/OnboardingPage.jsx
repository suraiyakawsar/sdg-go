import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../pages/PlayerContext";

function useNextPath(defaultPath = "/game") {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const next = params.get("next");
    return next || defaultPath;
}

export default function OnboardingPage() {
    const { updateProfile } = usePlayer();
    const navigate = useNavigate();
    const nextPath = useNextPath("/game");

    const [name, setName] = useState("");
    const [role, setRole] = useState("Student");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim()) {
            setError("Please enter a name to continue.");
            return;
        }

        const profile = {
            name: name.trim(),
            role,
            sdgPoints: 0,
            badges: [],
            currentChapter: 1,
        };

        updateProfile(profile);
        navigate(nextPath, { replace: true });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 text-white">
            <div className="w-full max-w-md rounded-3xl bg-gray-900/80 border border-purple-500/40 p-6 shadow-2xl">
                <h1 className="text-2xl font-bold mb-1">Set up your player profile</h1>
                <p className="text-sm text-gray-300 mb-4">
                    Before you start, tell us who&apos;s playing so we can track your SDG
                    progress and badges on this device.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <p className="text-sm text-red-400 bg-red-900/40 border border-red-600 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">
                            Display name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-xl bg-gray-800 border border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder="e.g. Aiman, Zara, Player 1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">
                            I am playing as
                        </label>
                        <select
                            className="w-full rounded-xl bg-gray-800 border border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Student">Student</option>
                            <option value="Youth">Youth</option>
                            <option value="Educator">Educator</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <p className="text-xs text-gray-400">
                        Your progress is stored locally in this browser only. You can reset
                        your profile anytime from the menu.
                    </p>

                    <button
                        type="submit"
                        className="mt-2 w-full rounded-full bg-green-500 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-green-400 transition"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}
