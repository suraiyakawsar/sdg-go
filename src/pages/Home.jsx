
// src/pages/Home.jsx
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { usePlayer } from "../pages/PlayerContext";
import { FiPlay, FiUser, FiAward, FiRotateCcw } from "react-icons/fi";
import Footer from "../components/ui/Footer";

const getSdgIconSrc = (id) =>
  `assets/sdgIcons/E-WEB-Goal-${String(id).padStart(2, "01")}.png`;

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

const sdgPreview = {
  1: {
    hook: "Poverty isn't just 'no money'—it's access to basics like food, safety, and opportunities.",
    action: "Micro-action: donate essentials, support a food bank, or share verified aid resources.",
    mission:
      "Mini-mission: help an NPC find legit support (scholarship, aid, community resources) and avoid scams.",
    choice:
      "Choice moment: ignore someone struggling vs. connect them to real help (points + empathy badge).",
  },
  2: {
    hook: "Hunger is often about affordability and access—not just a lack of food.",
    action:
      "Micro-action:  reduce food waste—take what you'll finish; store leftovers properly.",
    mission:
      "Mini-mission: 'Save the Cafeteria'—make choices that cut waste and help redistribute extra food safely.",
    choice:
      "Choice moment: toss extra food vs. pack/share responsibly (points + 'No Waste').",
  },
  3: {
    hook: "Good health includes mental wellbeing, sleep, prevention, and healthy routines.",
    action:
      "Micro-action:  20–30 min walk, hydrate, and check in on a friend who seems stressed.",
    mission:
      "Mini-mission: guide an NPC toward healthier coping strategies and support options.",
    choice:
      "Choice moment: give risky advice vs. recommend safe steps/support (points + 'Wellbeing').",
  },
  4: {
    hook: "Quality education is access + support + learning that actually sticks—not only grades.",
    action:
      "Micro-action: join/start a study group, tutor a junior, or share notes fairly.",
    mission:
      "Mini-mission: 'Peer Tutor'—help an NPC understand a concept through clear, step-by-step explanations.",
    choice:
      "Choice moment: gatekeep notes vs. help others learn (points + 'Mentor').",
  },
  5: {
    hook: "Equality shows up in everyday behaviour—respect, safety, and fair opportunity.",
    action:
      "Micro-action: call out sexist jokes respectfully and support fair roles in team projects.",
    mission:
      "Mini-mission: mediate a group conflict where someone is dismissed or excluded unfairly.",
    choice:
      "Choice moment: stay silent vs. speak up constructively (points + 'Ally').",
  },
  6: {
    hook: "Clean water means responsible use and preventing pollution—every drop counts.",
    action:
      "Micro-action: shorter showers, turn taps off fully, and report leaks when you see them.",
    mission:
      "Mini-mission: locate 'waste points' in a dorm/campus scene and trigger fixes/reporting.",
    choice:
      "Choice moment: ignore a leaking tap vs. report it (points + 'Water Saver').",
  },
  7: {
    hook: "Affordable and clean energy means using less and choosing smarter options.",
    action:
      "Micro-action: switch off lights, unplug idle chargers, and use energy-saving settings.",
    mission:
      "Mini-mission: 'Power Audit'—spot unnecessary energy waste around campus and resolve it.",
    choice:
      "Choice moment: convenience vs. energy-conscious choice (points + 'Power Smart').",
  },
  8: {
    hook: "Decent work means fair pay, safe conditions, and respect—especially for juniors.",
    action:
      "Micro-action: learn basic worker rights; support ethical brands and fair internships.",
    mission:
      "Mini-mission: advise an NPC about a sketchy internship/job offer and safer alternatives.",
    choice:
      "Choice moment: accept exploitation vs. push back/choose better (points + 'Fair Work').",
  },
  9: {
    hook: "Innovation isn't only big tech—it's better solutions for real problems.",
    action:
      "Micro-action: prototype simple solutions (UI mockups, awareness campaigns, small tools).",
    mission:
      "Mini-mission: propose a small 'campus improvement' feature that solves a sustainability issue.",
    choice:
      "Choice moment: copy trends vs. design for real needs (points + 'Innovator').",
  },
  10: {
    hook: "Reduced inequality means removing barriers—bias, disability access, and unequal opportunity.",
    action:
      "Micro-action: practice inclusive teamwork and design accessible interfaces (contrast, labels, keyboard).",
    mission:
      "Mini-mission: improve a fictional campus portal's accessibility and inclusivity.",
    choice:
      "Choice moment: 'looks cool' vs. 'works for everyone' (points + 'Inclusive Designer').",
  },
  11: {
    hook: "Sustainable cities mean safe spaces, good transport, clean public areas, and community care.",
    action:
      "Micro-action: use public transport/carpool; keep shared spaces clean; report hazards.",
    mission:
      "Mini-mission: plan a safer route and resolve a community issue (trash, lighting, signage).",
    choice:
      "Choice moment: take a harmful shortcut vs. pick the responsible option (points + 'Civic Care').",
  },
  12: {
    hook: "Responsible consumption is buying less, buying better, and reusing more.",
    action:
      "Micro-action: bring bottle/bag, thrift, repair before replacing, avoid single-use items.",
    mission:
      "Mini-mission: 'Fix-it Quest'—choose repair/reuse options instead of buying new.",
    choice:
      "Choice moment: impulse buy vs. sustainable alternative (points + 'Mindful Buyer').",
  },
  13: {
    hook: "Climate action is daily habits + community impact—small changes scale.",
    action:
      "Micro-action: reduce energy waste, avoid unnecessary rides, support low-waste events.",
    mission:
      "Mini-mission: help organise a low-waste campus activity and persuade NPCs to join.",
    choice:
      "Choice moment: high-emission convenience vs. lower-impact plan (points + 'Climate Hero').",
  },
  14: {
    hook: "Life below water is threatened by plastic, pollution, and careless waste systems.",
    action:
      "Micro-action: avoid single-use plastics; join cleanups; dispose of waste properly.",
    mission:
      "Mini-mission: identify litter sources and improve disposal habits in a coastal-themed scene.",
    choice:
      "Choice moment: ignore trash vs. act now (points + 'Ocean Guardian').",
  },
  15: {
    hook: "Life on land is biodiversity—healthy ecosystems need protection and smart choices.",
    action:
      "Micro-action: plant native greenery, protect habitats, avoid illegal wildlife trade.",
    mission:
      "Mini-mission: restore a green corner by choosing native plants and correct care steps.",
    choice:
      "Choice moment: aesthetic-only vs. biodiversity-friendly pick (points + 'Nature Keeper').",
  },
  16: {
    hook: "Peace & justice includes fairness, safety, accountability, and healthy conflict resolution.",
    action:
      "Micro-action: de-escalate conflicts, report harassment, reject corruption and bullying.",
    mission:
      "Mini-mission: navigate a conflict dialogue using calm, evidence-based choices.",
    choice:
      "Choice moment: escalate drama vs. resolve responsibly (points + 'Peace Builder').",
  },
  17: {
    hook: "Partnerships make progress real—collaboration beats solo effort.",
    action:
      "Micro-action: join a club/volunteer project; collaborate across groups and skills.",
    mission:
      "Mini-mission: recruit NPCs and coordinate roles to complete a sustainability activity.",
    choice:
      "Choice moment: do everything alone vs. coordinate + delegate (points + 'Team Catalyst').",
  },
};

function AccentWash({ className }) {
  return (
    <div
      className={[
        "pointer-events-none absolute rounded-full blur-2xl opacity-30",
        className,
      ].join(" ")}
    />
  );
}

function GlowBlob({ className }) {
  return (
    <div
      className={[
        "pointer-events-none absolute rounded-full blur-2xl opacity-20",
        className,
      ].join(" ")}
    />
  );
}

function ActionCard({
  title,
  desc,
  Icon,
  tone = "emerald",
  onClick,
  reduceMotion,
  rightMeta,
}) {
  const toneBar = {
    emerald: "from-emerald-400/70 via-emerald-300/30 to-cyan-300/60",
    purple: "from-purple-400/70 via-fuchsia-300/25 to-cyan-300/55",
    indigo: "from-indigo-400/70 via-cyan-300/25 to-purple-300/55",
    red: "from-red-400/70 via-red-300/25 to-pink-300/55",
  };

  const iconTint = {
    emerald: "text-emerald-200",
    purple: "text-fuchsia-200",
    indigo: "text-cyan-200",
    red: "text-red-200",
  };

  return (
    <m.button
      type="button"
      onClick={onClick}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={[
        "relative w-full text-left rounded-2xl",
        "bg-black/60 backdrop-blur-md",
        "border border-white/10",
        "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
        "px-5 py-4 transition overflow-hidden",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          `bg-gradient-to-r ${toneBar[tone] || toneBar.emerald}`,
        ].join(" ")}
      />

      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            {Icon ? (
              <Icon className={`w-6 h-6 ${iconTint[tone] || iconTint.emerald}`} />
            ) : null}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-300 uppercase tracking-wider">
              {title}
            </p>
            {rightMeta ? (
              <span className="text-[10px] text-white/45">{rightMeta}</span>
            ) : null}
          </div>

          <p className="mt-1 text-sm font-semibold text-white leading-snug">
            {desc}
          </p>

          <div className="mt-3 h-2 bg-gray-800/80 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${toneBar[tone] || toneBar.emerald}`} style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    </m.button>
  );
}


export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const impactRef = useRef(null);
  const aboutRef = useRef(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false); // ← Add state

  const [selectedSDG, setSelectedSDG] = useState(null);
  const [query, setQuery] = useState("");
  const [lastRoute, setLastRoute] = useState("/game"); // ✅ Start with default
  const exploreRef = useRef(null);

  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { profile, resetProfile } = usePlayer();
  const hasProgress = lastRoute !== "/game" || Number(localStorage.getItem("sdgPoints")) >= 1;

  function goOrOnboard(targetPath) {
    if (profile) navigate(targetPath);
    else navigate(`/onboarding? next=${encodeURIComponent(targetPath)}`);
  }

  // Scroll function
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  function scrollToExplore() {
    exploreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const handleStartOver = () => {
    setShowResetConfirm(true); // Show modal instead of window.confirm
  };


  // ✅ Save profile before clearing
  const confirmReset = () => {
    // ✅ Save profile before clearing
    const savedProfile = localStorage.getItem("sdgGoPlayerProfile");

    // ✅ Set reset flag
    sessionStorage.setItem("isResetting", "true");

    // ✅ SIMPLE: Clear everything
    localStorage.clear();

    // ✅ Restore profile
    if (savedProfile) {
      localStorage.setItem("sdgGoPlayerProfile", savedProfile);
    }

    setShowResetConfirm(false);

    // Force page reload
    setTimeout(() => {
      window.location.href = "/";
    }, 200);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  // ✅ Update lastRoute whenever component mounts or focus returns
  useEffect(() => {
    const updateLastRoute = () => {
      const saved = localStorage.getItem("sdgo:lastRoute") || "/game";
      setLastRoute(saved);
      console.log("✅ Updated lastRoute:", saved);
    };

    // Load on mount
    updateLastRoute();

    // Listen for visibility changes (when user returns to tab)
    document.addEventListener("visibilitychange", updateLastRoute);

    // Listen for window focus
    window.addEventListener("focus", updateLastRoute);

    return () => {
      document.removeEventListener("visibilitychange", updateLastRoute);
      window.removeEventListener("focus", updateLastRoute);
    };
  }, []);

  // ✅ Also listen for storage changes (if playing on another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("sdgo:lastRoute") || "/game";
      setLastRoute(saved);
      console.log("✅ Storage changed, lastRoute:", saved);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filtered = useMemo(() => {
    let results = sdgs;

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryMap = {
        poverty: [1, 2],
        people: [3, 4, 5, 9, 10],
        planet: [6, 7, 12, 13, 14, 15],
        prosperity: [8, 11],
        peace: [16, 17],
      };
      const goalIds = categoryMap[selectedCategory] || [];
      results = results.filter((g) => goalIds.includes(g.id));
    }

    // Filter by search query
    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (g) => g.name.toLowerCase().includes(q) || String(g.id).includes(q)
      );
    }

    return results;
  }, [query, selectedCategory]);

  useEffect(() => {
    if (!selectedSDG) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedSDG(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedSDG]);


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
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen text-white overflow-hidden">
        <Navbar />

        {/* Existing content */}

        {/* HERO / HUB */}
        <div className="max-w-7xl mx-auto pt-28 pb-8 px-6 lg:px-10">
          <m.div initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }} {...pageEnter} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 relative overflow-hidden">
              <span className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(60%_100%_at_10%_0%,rgba(168,85,247,0.30),transparent_55%),radial-gradient(60%_100%_at_90%_0%,rgba(34,211,238,0.22),transparent_55%)]" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.45)]" />
              <span className="relative">Interactive story • SDG points • Badges</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  SDGo!{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-emerald-300 to-cyan-300">
                    Hub
                  </span>
                </h1>
                <p className="text-white/70 text-lg leading-relaxed max-w-2xl mt-3">
                  Start fast.  Make choices. Earn points. Then explore any SDG when you're curious.
                </p>
              </div>

              <m.button
                type="button"
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToExplore}
                className="self-start lg:self-end rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 px-4 py-3 text-sm text-white/80 hover:text-white transition shadow-[0_12px_35px_-25px_rgba(168,85,247,0.45)]"
              >
                Explore SDGs ↓
              </m.button>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">


              <ActionCard
                reduceMotion={reduceMotion}
                tone="emerald"
                Icon={FiPlay}
                title={hasProgress ? "Continue" : "Start New Game"}
                desc={hasProgress
                  ? "Resume from where you left off."
                  : "Begin your SDGo! journey and earn points. "}
                rightMeta="Story Mode"
                onClick={() => goOrOnboard(lastRoute)}
              />

              <ActionCard
                reduceMotion={reduceMotion}
                tone="purple"
                Icon={FiUser}
                title={profile ? "Profile" : "Create Profile"}
                desc={profile ? "View your stats and identity." : "Quick onboarding to start tracking progress."}
                rightMeta="Player"
                onClick={() => goOrOnboard("/profile")}
              />

              <ActionCard
                reduceMotion={reduceMotion}
                tone="indigo"
                Icon={FiAward}
                title="Badges"
                desc="See what you've unlocked and what's next."
                rightMeta="Achievements"
                onClick={() => goOrOnboard("/badges")}
              />

              <ActionCard
                reduceMotion={reduceMotion}
                tone="red"
                Icon={FiRotateCcw}
                title="Start Over"
                desc={hasProgress
                  ? "Erase all progress and begin fresh."
                  : "No progress yet. Create a new profile to start. "}
                rightMeta="Reset"
                onClick={handleStartOver}
                disabled={!hasProgress} // ✅ Disable if no progress
              />
            </div>

            {/* HOW IT WORKS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-2">
              {[
                { t: "1) Explore", d: "Inspect any SDG and see what it means in real life + in-game." },
                { t: "2) Decide", d: "Dialogue choices shape outcomes and affect your SDG points." },
                { t: "3) Progress", d: "Complete chapters to unlock badges and track your journey." },
              ].map((x) => (
                <div
                  key={x.t}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_10px_30px_-25px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-purple-400/30 via-emerald-300/25 to-cyan-300/30" />
                  <div className="font-semibold text-white/90">{x.t}</div>
                  <div className="text-sm text-white/70 mt-1 leading-relaxed">{x.d}</div>
                </div>
              ))}
            </div>
          </m.div>
        </div>

        {/* Statistics Section */}
        <div id="stats" ref={statsRef} className="max-w-7xl mx-auto py-20 px-6 lg:px-10">
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
                By The Numbers
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Project Impact & Scope
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                A comprehensive educational experience built with modern web technologies
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🎮",
                  label: "Interactive Chapters",
                  value: "4",
                  suffix: "/+",
                  color: "from-emerald-500/20 to-emerald-500/5",
                  borderColor: "border-emerald-400/30",
                  accentColor: "text-emerald-400",
                  desc: "Branching storylines with real consequences"
                },
                {
                  icon: "🏆",
                  label: "Badges to Unlock",
                  value: "10",
                  suffix: "+",
                  color: "from-cyan-500/20 to-cyan-500/5",
                  borderColor: "border-cyan-400/30",
                  accentColor: "text-cyan-400",
                  desc: "Achievements across all 17 SDGs"
                },
                {
                  icon: "🌍",
                  label: "SDG Goals Covered",
                  value: "17",
                  suffix: "",
                  color: "from-purple-500/20 to-purple-500/5",
                  borderColor: "border-purple-400/30",
                  accentColor: "text-purple-400",
                  desc: "UN Sustainable Development Goals"
                },
              ].map((stat, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`relative rounded-3xl border ${stat.borderColor} bg-gradient-to-br ${stat.color} p-8 overflow-hidden group hover:border-white/40 transition`}
                >
                  {/* Decorative glow */}
                  <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition"
                    style={{
                      background: stat.accentColor.replace('text-', '').split('-')[0] === 'emerald'
                        ? 'rgb(52, 211, 153)'
                        : stat.accentColor.replace('text-', '').split('-')[0] === 'cyan'
                          ? 'rgb(34, 211, 238)'
                          : 'rgb(168, 85, 247)'
                    }}
                  />

                  {/* Top accent line */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-0 group-hover:opacity-100 transition"
                    style={{
                      background: stat.accentColor.replace('text-', '').split('-')[0] === 'emerald'
                        ? 'linear-gradient(90deg, transparent, rgb(52, 211, 153), transparent)'
                        : stat.accentColor.replace('text-', '').split('-')[0] === 'cyan'
                          ? 'linear-gradient(90deg, transparent, rgb(34, 211, 238), transparent)'
                          : 'linear-gradient(90deg, transparent, rgb(168, 85, 247), transparent)'
                    }}
                  />

                  {/* Content */}
                  <div className="relative space-y-4">
                    {/* Icon */}
                    <div className="text-5xl">{stat.icon}</div>

                    {/* Counter */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-1">
                        <m.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                          className={`text-5xl sm:text-6xl font-black ${stat.accentColor}`}
                        >
                          {stat.value}
                        </m.div>
                        {stat.suffix && (
                          <span className={`text-2xl font-bold ${stat.accentColor} mt-2`}>
                            {stat.suffix}
                          </span>
                        )}
                      </div>

                      {/* Label */}
                      <h3 className="text-lg font-bold text-white">{stat.label}</h3>

                      {/* Description */}
                      <p className="text-sm text-white/60">{stat.desc}</p>
                    </div>

                    {/* Subtle separator */}
                    <div className="pt-4 border-t border-white/10" />

                    {/* Footer stat */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 uppercase tracking-wider">Cumulative Impact</span>
                      <m.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                        className={`h-2 w-2 rounded-full ${stat.accentColor.replace('text-', 'bg-')}`}
                      />
                    </div>
                  </div>
                </m.div>
              ))}
            </div>

            {/* Bottom highlight */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
              <p className="text-sm text-white/70">
                <span className="font-semibold text-emerald-400">SDGo! </span> combines game design, storytelling, and education technology to create an engaging learning experience about global sustainability.
              </p>
            </div>
          </m.div>
        </div>

        {/* Why SDGo */} {/* Features Section */}
        <div id="features" ref={featuresRef} className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
          <m.div initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
              <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-white mb-2">Why SDG Explorer?</h2>
                  <p className="text-white/60">Gamification meets sustainability education</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: "💬", title: "Dialogue-Driven Choices", desc: "Every decision shapes your SDG impact score" },
                    { icon: "📈", title: "Progress Tracking", desc: "Watch your sustainability journey unfold" },
                    { icon: "🎨", title: "Beautiful UI/UX", desc: "Modern design that engages players" },
                    { icon: "🌱", title: "Real-World Context", desc: "Learn actual SDG challenges & solutions" },
                  ].map((feature, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 hover:bg-white/[0.08] transition">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h3 className="font-bold text-white">{feature.title}</h3>
                      <p className="text-sm text-white/60 mt-1">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </m.div>
            </div>
          </m.div>
        </div>

        {/* EXPLORE SECTION */}
        <div id="explore" ref={exploreRef} className="max-w-7xl mx-auto pt-8 px-6 lg:px-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="space-y-8"
          >
            {/* Header with Description */}
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
                Interactive Learning
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Explore the SDGs
              </h2>

              <p className="text-white/60 max-w-2xl mx-auto text-lg">
                Discover real-world sustainability challenges.  Tap any goal to see in-game missions, micro-actions, and the impact of your choices.
              </p>
            </div>

            {/* Search + Stats - Refined */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md space-y-5">
              {/* Search Input + Counter Row */}
              <div className="flex flex-col sm:flex-row items-end gap-3">
                {/* Search Input */}
                <div className="flex-1 w-full">
                  <label className="sr-only">Search SDGs</label>
                  <div className="relative">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by number, name, or keyword (e.g., climate, water)…"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">
                      🔍
                    </span>
                  </div>
                </div>

                {/* Reset Button */}
                <m.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setQuery("")}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition font-medium"
                >
                  Clear
                </m.button>

                {/* Counter */}
                <div className="w-full sm:w-auto px-5 py-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 flex items-center justify-center gap-2">
                  <span className="text-[10px] text-white/60 uppercase tracking-wider">Results: </span>
                  <span className="text-2xl font-bold text-emerald-400">{filtered.length}</span>
                  <span className="text-[10px] text-white/60">/17</span>
                </div>
              </div>

              {/* Category Filter Tags */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-white/50 font-medium">Filter by:</span>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "all", label: "All Goals", icon: "🌍" },
                    { id: "poverty", label: "Poverty & Hunger", icon: "🍞" },
                    { id: "people", label: "People", icon: "👥" },
                    { id: "planet", label: "Planet", icon: "🌱" },
                    { id: "prosperity", label: "Prosperity", icon: "💼" },
                    { id: "peace", label: "Peace", icon: "☮️" },
                  ].map((cat) => (
                    <m.button
                      key={cat.id}
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${selectedCategory === cat.id
                        ? "bg-emerald-500/30 border border-emerald-400/70 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                        : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                        }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </m.button>
                  ))}
                </div>
              </div>
            </div>

            {/* SDG Grid - Enhanced Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {filtered.map((goal, index) => (
                <m.button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedSDG(goal)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  whileHover={reduceMotion ? undefined : { y: -6, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={[
                    "group relative rounded-2xl p-4",
                    "border border-white/10",
                    "bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md",
                    "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                    "transition-all outline-none focus:ring-2 focus:ring-emerald-400/30 overflow-hidden",
                    "hover:bg-gradient-to-br hover:from-black/50 hover:to-black/70 hover:border-white/20",
                  ].join(" ")}
                  aria-label={`Open details for SDG ${goal.id}:  ${goal.name}`}
                >
                  {/* Top glow effect on hover */}
                  <div
                    className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition blur-xl rounded-2xl -z-10"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${goal.color}30, transparent 70%)`,
                    }}
                  />

                  {/* Top accent line */}
                  <span
                    className="pointer-events-none absolute inset-x-1 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${goal.color}, transparent)`,
                      boxShadow: `0 0 8px ${goal.color}, 0 0 16px ${goal.color}CC`,
                    }}
                  />

                  {/* ID & Number */}
                  <div className="relative flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-white/60">
                      SDG
                    </span>
                    <span
                      className="text-sm font-extrabold px-2 py-0.5 rounded-lg"
                      style={{
                        background: `${goal.color}20`,
                        color: goal.color,
                      }}
                    >
                      {goal.id}
                    </span>
                  </div>

                  {/* Icon with glow */}
                  <div className="relative mb-3 flex justify-center">
                    <div className="relative">
                      {/* Glow behind icon */}
                      <div
                        className="absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition"
                        style={{ backgroundColor: goal.color, filter: "blur(12px)" }}
                      />

                      {/* Icon container */}
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                        <img
                          src={getSdgIconSrc(goal.id)}
                          alt={`SDG ${goal.id} icon`}
                          className="w-full h-full object-contain p-2"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Goal Name */}
                  <div className="relative text-center space-y-2">
                    <h3 className="text-[11px] font-bold text-white/95 leading-tight line-clamp-2 h-6">
                      {goal.name}
                    </h3>

                    {/* Hover indicator */}
                    <m.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="text-[9px] text-emerald-400/0 group-hover:text-emerald-400 transition"
                    >
                      Click to explore →
                    </m.div>
                  </div>

                  {/* Bottom glow line */}
                  <span
                    className="pointer-events-none absolute inset-x-2 bottom-0 h-[3px] opacity-0 group-hover:opacity-100 transition"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${goal.color}, transparent)`,
                      boxShadow: `0 0 10px ${goal.color}, 0 0 20px ${goal.color}80`,
                    }}
                  />
                </m.button>
              ))}
            </div>

            {/* No results state */}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60 text-lg mb-4">No SDGs found matching your search.</p>
                <m.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuery("")}
                  className="px-6 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30 transition"
                >
                  Clear search
                </m.button>
              </div>
            )}

            {/* Info footer */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-sm text-white/60">
                💡 <span className="font-semibold">Tip:</span> Each SDG features interactive missions, micro-actions you can do today, and meaningful choices that impact your sustainability score.
              </p>
            </div>
          </m.div>
        </div>


        {/* SDG Details Modal - Compact */}
        <AnimatePresence>
          {selectedSDG && (
            <m.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-modal="true"
              role="dialog"
            >
              {/* Backdrop */}
              <m.button
                type="button"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedSDG(null)}
                aria-label="Close SDG modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {(() => {
                const info = sdgPreview[selectedSDG.id];
                return (
                  <m.div
                    className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl shadow-[0_40px_150px_-40px_rgba(0,0,0,0.95)] overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0, transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 } }}
                    exit={{ scale: 0.9, opacity: 0, y: 20, transition: { duration: 0.2 } }}
                  >
                    {/* Top accent bar */}
                    <div
                      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${selectedSDG.color}, transparent)`,
                      }}
                    />

                    {/* Decorative glow */}
                    <div
                      className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-20"
                      style={{ backgroundColor: selectedSDG.color }}
                    />

                    {/* Content */}
                    <div className="relative p-6">
                      {/* Close button */}
                      <m.button
                        type="button"
                        onClick={() => setSelectedSDG(null)}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition text-sm"
                        aria-label="Close"
                      >
                        ✕
                      </m.button>

                      {/* Header */}
                      <div className="flex items-start gap-3 mb-5 pr-8">
                        {/* Icon */}
                        <m.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="relative shrink-0"
                        >
                          <div
                            className="absolute inset-0 rounded-lg blur-lg opacity-40"
                            style={{ backgroundColor: selectedSDG.color }}
                          />
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center">
                            <img
                              src={getSdgIconSrc(selectedSDG.id)}
                              alt={`SDG ${selectedSDG.id}`}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        </m.div>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-md inline-block mb-1"
                            style={{
                              background: `${selectedSDG.color}25`,
                              color: selectedSDG.color,
                            }}
                          >
                            SDG {selectedSDG.id}
                          </span>
                          <h2 className="text-lg font-extrabold text-white leading-tight">
                            {selectedSDG.name}
                          </h2>
                        </div>
                      </div>

                      {/* Content cards - Compact */}
                      <div className="space-y-3 mb-6">
                        {[
                          {
                            icon: "💡",
                            title: "What it Means",
                            content: info?.hook,
                            borderColor: "border-blue-400/30",
                          },
                          {
                            icon: "🎯",
                            title: "Action",
                            content: info?.action,
                            borderColor: "border-emerald-400/30",
                          },
                          {
                            icon: "🎮",
                            title: "Mission",
                            content: info?.mission,
                            borderColor: "border-purple-400/30",
                          },
                          {
                            icon: "⚡",
                            title: "Your Choice",
                            content: info?.choice,
                            borderColor: "border-cyan-400/30",
                          },
                        ].map((card, idx) => (
                          <m.div
                            key={idx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className={`rounded-lg border ${card.borderColor} bg-white/[0.03] p-3 backdrop-blur-sm`}
                          >
                            <div className="flex gap-2.5">
                              <span className="text-base shrink-0 mt-0.5">{card.icon}</span>
                              <div className="min-w-0">
                                <h3 className="text-xs font-bold text-white/90 mb-0.5">{card.title}</h3>
                                <p className="text-xs text-white/70 leading-snug">{card.content}</p>
                              </div>
                            </div>
                          </m.div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <m.button
                          type="button"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedSDG(null)}
                          className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition font-semibold text-xs"
                        >
                          Close
                        </m.button>

                        <m.button
                          type="button"
                          whileHover={{ y: -1, boxShadow: "0 12px 35px rgba(52,211,153,0.25)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedSDG(null);
                            goOrOnboard("/game");
                          }}
                          className="flex-1 px-4 py-2.5 rounded-lg border border-emerald-400/40 bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 text-emerald-200 hover:text-emerald-100 transition font-semibold text-xs shadow-[0_8px_25px_-12px_rgba(52,211,153,0.3)]"
                        >
                          Play Now →
                        </m.button>
                      </div>
                    </div>
                  </m.div>
                );
              })()}
            </m.div>
          )}
        </AnimatePresence>

        {/* ✅ CUSTOM RESET MODAL */}
        <AnimatePresence>
          {showResetConfirm && (
            <m.div
              className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <m.div
                className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1024]/95 backdrop-blur-xl p-8 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.95)]"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500/70 via-orange-400/50 to-red-400/60" />

                <div className="text-center">
                  <div className="text-5xl mb-4">🔄</div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Start Over? </h2>
                  <p className="text-white/70 leading-relaxed">
                    This will erase all your progress, badges, and game data. Your profile will be saved, but everything else resets.
                  </p>
                  <p className="text-red-300 font-semibold mt-4">This cannot be undone! </p>
                </div>

                <div className="mt-8 flex gap-3">
                  <m.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={cancelReset}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 hover:text-white transition"
                  >
                    Cancel
                  </m.button>

                  <m.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmReset}
                    className="flex-1 rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-500/28 to-orange-500/12 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_-20px_rgba(239,68,68,0.6)]"
                  >
                    Yes, Reset Everything
                  </m.button>
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>



        {/* Educational Impact */}
        <div id="impact" ref={impactRef} className="max-w-7xl mx-auto py-6 px-6 lg:px-10">
          <m.div initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-white mb-2">Educational Impact</h2>
                <p className="text-white/60">How gamification improves SDG awareness</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { emoji: "📚", title: "Learn Interactively", desc: "30+ scenarios covering all 17 SDGs" },
                  { emoji: "🎯", title: "Track Progress", desc: "Earn badges as you achieve SDG milestones" },
                  { emoji: "💡", title: "Inspire Action", desc: "Understand real-world sustainability challenges" },
                ].map((impact, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center">
                    <div className="text-4xl mb-3">{impact.emoji}</div>
                    <h3 className="font-bold text-white">{impact.title}</h3>
                    <p className="text-sm text-white/60 mt-2">{impact.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </m.div>
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 p-12 text-center overflow-hidden"
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

            <h2 className="text-3xl font-extrabold text-white mb-3">Ready to Make an Impact?</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-6">
              Join thousands learning about the UN's Sustainable Development Goals through an interactive game.
            </p>

            <m.button
              whileHover={{ y: -3, boxShadow: "0 20px 50px rgba(52,211,153,0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => goOrOnboard("/game")}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-bold shadow-[0_12px_35px_-20px_rgba(16,185,129,0.6)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.5)] transition"
            >
              Start Playing Now →
            </m.button>
          </m.div>
        </div>

        {/* About */}
        <div id="about" ref={aboutRef} className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-7 border-y border-white/10 pb-7">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8">
                <h2 className="text-2xl font-bold text-white mb-4">About This Project</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  SDGo! is a Final Year Project (FYP) that combines interactive storytelling, game design, and educational technology to raise awareness about the UN's Sustainable Development Goals (SDGs).
                </p>
                <p className="text-white/70 leading-relaxed">
                  Built with React, Phaser, and Framer Motion, this project demonstrates how gamification can enhance learning engagement while fostering a deeper understanding of global sustainability challenges.
                </p>
              </div>

              <div className="text-center py-8">
                <p className="text-white/60 text-sm mb-4">Built with modern technologies</p>
                <div className="flex justify-center gap-6 flex-wrap">
                  {["React", "Phaser", "Tailwind CSS", "Framer Motion"].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs text-white/70">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        </div>


      </div>



    </LazyMotion >
  );
}