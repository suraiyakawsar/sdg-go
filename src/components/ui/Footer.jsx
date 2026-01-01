import { motion as m } from "framer-motion";
import { FiGithub, FiMail } from "react-icons/fi";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const pageEnter = {
        initial: { opacity: 0, y: 16, filter: "blur(4px)" },
        animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.55 },
        },
    };

    return (
        <footer className="relative pt-7 pb-8 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <m.div {...pageEnter}>
                    {/* Main content container */}
                    <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] overflow-hidden mb-8">
                        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-purple-400/30 via-emerald-300/25 to-cyan-300/30" />

                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Brand Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🌍</span>
                                    <div>
                                        <h3 className="font-extrabold text-white tracking-tight leading-tight">
                                            SDGo!
                                        </h3>
                                        <p className="text-[10px] uppercase tracking-wider text-emerald-400/80">
                                            Educational Hub
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Learn about the UN's Sustainable Development Goals through interactive storytelling and meaningful choices.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                                    Explore
                                </h4>
                                <ul className="space-y-2.5">
                                    {[
                                        { label: "Home", href: "/" },
                                        { label: "Game", href: "/" },
                                        { label: "Badges", href: "/badges" },
                                        { label: "Profile", href: "/profile" },
                                    ].map((link) => (
                                        <li key={link.label}>
                                            <m.a
                                                href={link.href}
                                                className="text-white/70 hover:text-emerald-400 text-sm transition"
                                                whileHover={{ x: 3 }}
                                            >
                                                {link.label}
                                            </m.a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Connect */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
                                    Connect
                                </h4>
                                <div className="space-y-3">
                                    <m.a
                                        href="https://github.com/suraiyakawsar/sdg-go"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-white/70 hover:text-emerald-400 text-sm transition"
                                        whileHover={{ x: 3 }}
                                    >
                                        <FiGithub size={16} />
                                        GitHub
                                    </m.a>
                                    <m.a
                                        href="mailto:contact@example.com"
                                        className="flex items-center gap-2 text-white/70 hover:text-emerald-400 text-sm transition"
                                        whileHover={{ x: 3 }}
                                    >
                                        <FiMail size={16} />
                                        Email
                                    </m.a>
                                    <div className="text-white/70 text-sm">
                                        <p className="text-[11px] text-white/50 mt-2">
                                            Built with passion for education & sustainability.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom section */}
                    <div className="space-y-4 text-center">
                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Copyright */}
                        <div className="space-y-2">
                            <p className="text-xs text-white/60">
                                © {currentYear} <span className="font-semibold text-white">Suraiya Kawsar</span> • All rights reserved
                            </p>
                            <p className="text-[11px] text-white/40">
                                Icons sourced from UN Global Compact
                            </p>
                        </div>

                        {/* Bottom Links */}
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            {[
                                { label: "Privacy Policy", href: "#" },
                                { label: "Terms", href: "#" },
                                { label: "Contact", href: "#" },
                            ].map((link, i) => (
                                <div key={link.label} className="flex items-center gap-4">
                                    <m.a
                                        href={link.href}
                                        className="text-[11px] text-white/50 hover:text-white/70 transition"
                                        whileHover={{ color: "#34D399" }}
                                    >
                                        {link.label}
                                    </m.a>
                                    {i < 2 && <span className="text-white/20 text-[10px]">•</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </m.div>
            </div>
        </footer>
    );
}