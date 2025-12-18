// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import BadgePage from "./components/BadgePage";
// import Profile from "./components/Profile";
// import Game from "./pages/Game";


// export default function App() {
//   return (
//     <Router>
//       {/* <Navbar /> */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/badges" element={<BadgePage />} />
//         <Route path="/game" element={<Game />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/onboarding" element={<OnboardingPage />} />

//       </Routes>
//     </Router>
//   );
// }


// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Game from "./pages/Game";
// import BadgePage from "./components/BadgePage";
// import Profile from "./components/Profile";
// import OnboardingPage from "./pages/OnboardingPage"; // ✅ add this
// import { usePlayer } from "./pages/PlayerContext"; // ✅ use context

// export default function App() {
//   const { loading } = usePlayer();

//   if (loading) {
//     // while we check localStorage for an existing player profile
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//         Loading…
//       </div>
//     );
//   }

//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/badges" element={<BadgePage />} />
//       <Route path="/game" element={<Game />} />
//       <Route path="/profile" element={<Profile />} />
//       <Route path="/onboarding" element={<OnboardingPage />} /> {/* ✅ */}
//     </Routes>
//   );
// }



// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Game from "./pages/Game";
import BadgePage from "./components/BadgePage";
import Profile from "./components/Profile";
import OnboardingPage from "./pages/OnboardingPage";
import { usePlayer } from "./pages/PlayerContext";

export default function App() {
  const { loading } = usePlayer();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading…
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/badges" element={<BadgePage />} />
      <Route path="/game" element={<Game />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
    </Routes>
  );
}
