// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Game from "./pages/Game";
import BadgePage from "./components/BadgePage";
import Profile from "./components/Profile";
import OnboardingPage from "./pages/OnboardingPage";
import { usePlayer } from "./pages/PlayerContext";
import Footer from "./components/ui/Footer";

export default function App() {
  const location = useLocation();

  // Scroll to top ONLY on route change, not on every interaction
  useEffect(() => {
    // Don't scroll if we're on the game page
    if (location.pathname !== "/game") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);


  const { loading } = usePlayer();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
      </div>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/badges" element={<BadgePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>


      <Footer />
    </div>
  );
}
