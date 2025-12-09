// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Navbar() {
//     const [open, setOpen] = useState(false);
//     const ref = useRef();

//     // Close popover on outside click
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (ref.current && !ref.current.contains(event.target)) {
//                 setOpen(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [ref]);

//     return (
//         <div className="w-full fixed top-0 left-0 bg-gradient-to-r from-purple-900/70 to-indigo-800/70 backdrop-blur-md shadow-md z-50 flex justify-between items-center px-8 py-4 text-white">
//             {/* Logo */}
//             <Link to="/" className="text-2xl font-bold tracking-wide">
//                 🌍 SDG Explorer
//             </Link>

//             {/* Profile Button */}
//             <div className="relative" ref={ref}>
//                 <motion.button
//                     className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center border-2 border-white hover:scale-110 transition"
//                     onClick={() => setOpen(!open)}
//                 >
//                     <img
//                         src="assets/images/characters/lady.png"
//                         alt="profile"
//                         className="w-10 h-10 rounded-full"
//                     />
//                 </motion.button>

//                 <AnimatePresence>
//                     {open && (
//                         <motion.div
//                             className="absolute right-0 mt-3 w-56 bg-gray-900 rounded-2xl shadow-lg border border-purple-500/40 overflow-hidden"
//                             initial={{ opacity: 0, y: -10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -10 }}
//                             transition={{ type: "spring", stiffness: 300, damping: 25 }}
//                         >
//                             <div className="p-4">
//                                 <p className="font-semibold">Raya</p>
//                                 <p className="text-sm text-gray-400">Eco Explorer 🌱</p>
//                             </div>
//                             <hr className="border-gray-700" />
//                             <div className="flex flex-col">
//                                 <Link
//                                     to="/profile"
//                                     className="px-4 py-2 hover:bg-purple-700/40 transition text-left"
//                                     onClick={() => setOpen(false)}
//                                 >
//                                     Profile
//                                 </Link>
//                                 <Link
//                                     to="/badges"
//                                     className="px-4 py-2 hover:bg-purple-700/40 transition text-left"
//                                     onClick={() => setOpen(false)}
//                                 >
//                                     Badges
//                                 </Link>
//                                 <button
//                                     onClick={() => alert("Log out placeholder")}
//                                     className="px-4 py-2 hover:bg-red-600/40 transition text-left text-red-400"
//                                 >
//                                     Logout
//                                 </button>
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//         </div>
//     );
// }


// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "../pages/PlayerContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    const navigate = useNavigate();
    const { profile, resetProfile } = usePlayer();

    const displayName = profile?.name || "Guest";

    // Close popover on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    function goOrOnboard(targetPath) {
        setOpen(false);
        if (profile) {
            navigate(targetPath);
        } else {
            navigate(`/onboarding?next=${encodeURIComponent(targetPath)}`);
        }
    }

    function handleLogout() {
        resetProfile();
        setOpen(false);
        navigate("/", { replace: true });
    }

    return (
        <div className="w-full fixed top-0 left-0 bg-gradient-to-r from-purple-900/70 to-indigo-800/70 backdrop-blur-md shadow-md z-50 flex justify-between items-center px-8 py-4 text-white">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-wide">
                🌍 SDG Explorer
            </Link>

            {/* Profile Button */}
            <div className="relative" ref={ref}>
                <motion.button
                    className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center border-2 border-white hover:scale-110 transition"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <img
                        src="assets/images/characters/ladyy.png"
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                    />
                </motion.button>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            className="absolute right-0 mt-3 w-56 bg-gray-900 rounded-2xl shadow-lg border border-purple-500/40 overflow-hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="p-4">
                                <p className="font-semibold">{displayName}</p>
                                <p className="text-sm text-gray-400">
                                    {profile?.role || "Eco Explorer 🌱"}
                                </p>
                            </div>
                            <hr className="border-gray-700" />
                            <div className="flex flex-col">
                                <button
                                    onClick={() => goOrOnboard("/profile")}
                                    className="px-4 py-2 hover:bg-purple-700/40 transition text-left"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={() => goOrOnboard("/badges")}
                                    className="px-4 py-2 hover:bg-purple-700/40 transition text-left"
                                >
                                    Badges
                                </button>
                                {profile && (
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 hover:bg-red-600/40 transition text-left text-red-400"
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
