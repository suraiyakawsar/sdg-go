// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import Navbar from "../components/Navbar";

// const sdgs = [
//   { id: 1, name: "No Poverty", color: "#E5243B" },
//   { id: 2, name: "Zero Hunger", color: "#DDA63A" },
//   { id: 3, name: "Good Health", color: "#4C9F38" },
//   { id: 4, name: "Quality Education", color: "#C5192D" },
//   { id: 5, name: "Gender Equality", color: "#FF3A21" },
//   { id: 6, name: "Clean Water", color: "#26BDE2" },
//   { id: 7, name: "Affordable Energy", color: "#FCC30B" },
//   { id: 8, name: "Decent Work", color: "#A21942" },
//   { id: 9, name: "Industry & Innovation", color: "#FD6925" },
//   { id: 10, name: "Reduced Inequality", color: "#DD1367" },
//   { id: 11, name: "Sustainable Cities", color: "#FD9D24" },
//   { id: 12, name: "Responsible Consumption", color: "#BF8B2E" },
//   { id: 13, name: "Climate Action", color: "#3F7E44" },
//   { id: 14, name: "Life Below Water", color: "#0A97D9" },
//   { id: 15, name: "Life on Land", color: "#56C02B" },
//   { id: 16, name: "Peace & Justice", color: "#00689D" },
//   { id: 17, name: "Partnerships", color: "#19486A" },
// ];

// export default function Home() {
//   const [selectedSDG, setSelectedSDG] = useState(null);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 text-white overflow-hidden">
//       <Navbar />

//       <div className="max-w-7xl mx-auto pt-28 pb-10 px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//         {/* LEFT SIDE */}
//         <div className="space-y-6">
//           <motion.h1
//             className="text-5xl font-extrabold"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             🌍 Welcome to SDG Explorer
//           </motion.h1>

//           <p className="text-gray-300 text-lg leading-relaxed">
//             Embark on an interactive adventure to learn, explore, and take
//             action towards the <span className="text-yellow-400 font-semibold">17 Sustainable Development Goals</span>.
//             Earn badges, track your progress, and become an Eco Explorer!
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 pt-6">
//             <Link
//               to="/profile"
//               className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold text-white shadow-md shadow-purple-600/40 transition"
//             >
//               View Profile
//             </Link>
//             <Link
//               to="/badges"
//               className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full font-semibold text-white shadow-md shadow-indigo-600/40 transition"
//             >
//               View Badges
//             </Link>
//             <Link
//               to="/game"
//               className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full font-semibold text-white shadow-md shadow-green-600/40 transition"
//             >
//               Start Game
//             </Link>
//           </div>
//         </div>

//         {/* RIGHT SIDE - SDG Gallery */}
//         <div className="grid grid-cols-3 sm:grid-cols-4 gap-5">
//           {sdgs.map((goal) => (
//             <motion.div
//               key={goal.id}
//               className="relative bg-gray-800/60 rounded-2xl p-4 cursor-pointer flex flex-col items-center justify-center shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition"
//               whileHover={{ scale: 1.1 }}
//               onClick={() => setSelectedSDG(goal)}
//             >
//               <motion.div
//                 className="w-16 h-16 rounded-full mb-3"
//                 style={{ backgroundColor: goal.color }}
//                 whileHover={{ rotate: 10 }}
//               ></motion.div>
//               <p className="text-sm text-center font-semibold">{goal.name}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Popup Modal */}
//       <AnimatePresence>
//         {selectedSDG && (
//           <motion.div
//             className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-gray-900 rounded-3xl p-8 text-white max-w-md mx-6 shadow-2xl border border-purple-500/40 relative"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//             >
//               <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//                 <span
//                   className="inline-block w-6 h-6 rounded-full"
//                   style={{ backgroundColor: selectedSDG.color }}
//                 ></span>
//                 {selectedSDG.name}
//               </h2>
//               <p className="text-gray-300 mb-6">
//                 Fun fact about {selectedSDG.name}! 🌟  
//                 (Placeholder description — this will later explain how players
//                 can contribute to this SDG in-game.)
//               </p>
//               <button
//                 onClick={() => setSelectedSDG(null)}
//                 className="bg-purple-700 hover:bg-purple-800 w-full py-2 rounded-full font-semibold"
//               >
//                 Close
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


// src/pages/Home.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { usePlayer } from "../pages/PlayerContext";

const sdgs = [
  { id: 1, name: "No Poverty", color: "#E5243B" },
  { id: 2, name: "Zero Hunger", color: "#DDA63A" },
  { id: 3, name: "Good Health", color: "#4C9F38" },
  { id: 4, name: "Quality Education", color: "#C5192D" },
  { id: 5, name: "Gender Equality", color: "#FF3A21" },
  { id: 6, name: "Clean Water", color: "#26BDE2" },
  { id: 7, name: "Affordable Energy", color: "#FCC30B" },
  { id: 8, name: "Decent Work", color: "#A21942" },
  { id: 9, name: "Industry & Innovation", color: "#FD6925" },
  { id: 10, name: "Reduced Inequality", color: "#DD1367" },
  { id: 11, name: "Sustainable Cities", color: "#FD9D24" },
  { id: 12, name: "Responsible Consumption", color: "#BF8B2E" },
  { id: 13, name: "Climate Action", color: "#3F7E44" },
  { id: 14, name: "Life Below Water", color: "#0A97D9" },
  { id: 15, name: "Life on Land", color: "#56C02B" },
  { id: 16, name: "Peace & Justice", color: "#00689D" },
  { id: 17, name: "Partnerships", color: "#19486A" },
];

export default function Home() {
  const [selectedSDG, setSelectedSDG] = useState(null);
  const navigate = useNavigate();
  const { profile } = usePlayer();

  function goOrOnboard(targetPath) {
    if (profile) {
      navigate(targetPath);
    } else {
      navigate(`/onboarding?next=${encodeURIComponent(targetPath)}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 text-white overflow-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-28 pb-10 px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <motion.h1
            className="text-5xl font-extrabold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🌍 Welcome to SDG Explorer
          </motion.h1>

          <p className="text-gray-300 text-lg leading-relaxed">
            Embark on an interactive adventure to learn, explore, and take
            action towards the{" "}
            <span className="text-yellow-400 font-semibold">
              17 Sustainable Development Goals
            </span>
            . Earn badges, track your progress, and become an Eco Explorer!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => goOrOnboard("/profile")}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold text-white shadow-md shadow-purple-600/40 transition"
            >
              View Profile
            </button>
            <button
              onClick={() => goOrOnboard("/badges")}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full font-semibold text-white shadow-md shadow-indigo-600/40 transition"
            >
              View Badges
            </button>
            <button
              onClick={() => goOrOnboard("/game")}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full font-semibold text-white shadow-md shadow-green-600/40 transition"
            >
              Start Game
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - SDG Gallery */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-5">
          {sdgs.map((goal) => (
            <motion.div
              key={goal.id}
              className="relative bg-gray-800/60 rounded-2xl p-4 cursor-pointer flex flex-col items-center justify-center shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition"
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedSDG(goal)}
            >
              <motion.div
                className="w-16 h-16 rounded-full mb-3"
                style={{ backgroundColor: goal.color }}
                whileHover={{ rotate: 10 }}
              ></motion.div>
              <p className="text-sm text-center font-semibold">{goal.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedSDG && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-3xl p-8 text-white max-w-md mx-6 shadow-2xl border border-purple-500/40 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span
                  className="inline-block w-6 h-6 rounded-full"
                  style={{ backgroundColor: selectedSDG.color }}
                ></span>
                {selectedSDG.name}
              </h2>
              <p className="text-gray-300 mb-6">
                Fun fact about {selectedSDG.name}! 🌟{" "}
                (Placeholder description — this will later explain how players
                can contribute to this SDG in-game.)
              </p>
              <button
                onClick={() => setSelectedSDG(null)}
                className="bg-purple-700 hover:bg-purple-800 w-full py-2 rounded-full font-semibold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
