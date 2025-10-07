import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Navbar */}
            <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
                <div className="text-2xl font-bold text-green-600">🌏SDG Go!</div>
                <nav className="space-x-6 hidden md:block">
                    <a href="#how-to-play" className="hover:text-green-500 font-medium">How to Play</a>
                    <a href="#about" className="hover:text-green-500 font-medium">About</a>
                    <Link to="/game" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
                        Start Game
                    </Link>
                </nav>
            </header>

            {/* Hero Banner */}
            <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-20 py-16 bg-gradient-to-br from-green-100 to-white">
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold text-green-700 mb-6">
                        Embark on a Sustainable Adventure
                    </h1>
                    <p className="text-gray-700 text-lg md:text-xl mb-6">
                        Explore, interact, and make real-world impact choices based on the 17 Sustainable Development Goals.
                    </p>
                    <Link to="/game" className="inline-block bg-green-600 text-white px-6 py-3 rounded-full text-lg visited:text-white hover:bg-green-700 transition">
                        Start Your Journey
                    </Link>
                </div>
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <img src="\assets\hero-image.png" alt="Hero" className="w-full max-w-md mx-auto" />
                </div>
            </section>

            {/* How to Play Section */}
            <section id="how-to-play" className="py-16 bg-white text-center px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-12">How to Play</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">1. Move Around</h3>
                        <p className="text-gray-600">Use WASD keys to explore the environment and find interactive objects.</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">2. Make Choices</h3>
                        <p className="text-gray-600">Click on people or objects to trigger dialogues. Your choices affect your SDG score!</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">3. Progress & Learn</h3>
                        <p className="text-gray-600">Unlock new levels and discover how everyday actions impact the world.</p>
                    </div>
                </div>
            </section>

            {/* About or Footer Section */}
            <footer id="about" className="bg-green-50 py-10 text-center text-sm text-gray-600">
                <p>Made with 💙 by Raya | A Multimedia Tech FYP Project</p>
            </footer>
        </div>
    );
}
