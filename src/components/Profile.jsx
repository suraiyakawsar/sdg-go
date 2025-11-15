import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { SDGProgress } from "./ui/SDGProgress";

export default function Profile() {
    const dummyStats = {
        username: "Raya",
        title: "Eco Explorer",
        sdgPoints: 240,
        badges: 8,
        chapters: 3,
        xp: 65,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 pt-20 text-white">
            <div className="max-w-6xl mx-auto py-10 px-6">

                {/* Back to Home Button */}

                <div className="flex justify-between items-center mb-10">

                    <h1 className="text-4xl font-bold">🏅 Your Profile</h1>
                    <Link
                        to="/"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-all shadow-lg shadow-green-500/30"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-10">

                    {/* LEFT PANEL */}
                    <motion.div
                        className="flex-1 flex flex-col items-center md:items-start space-y-6"
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-green-400 animate-pulse"
                                style={{ filter: "blur(2px)" }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                            ></motion.div>
                            <img
                                src="assets/images/characters/lady.png"
                                alt="Avatar"
                                className="relative z-10 w-40 h-40 rounded-full border-4 border-green-400 shadow-xl"
                            />
                        </div>

                        {/* Name + Title */}
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold">{dummyStats.username}</h1>
                            <p className="text-green-400">{dummyStats.title}</p>
                        </div>

                        {/* XP Bar */}
                        <div className="w-64 md:w-80">
                            <p className="text-sm mb-1 text-gray-300">XP Progress</p>
                            <SDGProgress value={dummyStats.xp} />
                            <p className="text-xs mt-1 text-gray-400">{dummyStats.xp}%</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-4">
                            <Button className="bg-green-600 hover:bg-green-700">
                                Edit Profile
                            </Button>
                            <Link to="/badges">
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                    View Badges
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* RIGHT PANEL */}
                    <motion.div
                        className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6"
                        initial={{ x: 80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Stat Cards */}
                        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 transition transform">
                            <CardHeader>
                                <CardTitle className="text-green-400">SDG Points</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold">{dummyStats.sdgPoints}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 transition transform">
                            <CardHeader>
                                <CardTitle className="text-yellow-400">Badges Earned</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold">{dummyStats.badges}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 transition transform">
                            <CardHeader>
                                <CardTitle className="text-blue-400">Chapters Completed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold">{dummyStats.chapters}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
