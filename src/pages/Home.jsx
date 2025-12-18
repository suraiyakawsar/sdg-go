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
import { FiPlay, FiUser, FiAward } from "react-icons/fi";
const getSdgIconSrc = (id) =>
  `assets/E SDG Icons WEB/E-WEB-Goal-${String(id).padStart(2, "01")}.png`;

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
    hook: "Poverty isn’t just ‘no money’—it’s access to basics like food, safety, and opportunities.",
    action: "Micro-action: donate essentials, support a food bank, or share verified aid resources.",
    mission:
      "Mini-mission: help an NPC find legit support (scholarship, aid, community resources) and avoid scams.",
    choice:
      "Choice moment: ignore someone struggling vs. connect them to real help (points + empathy badge).",
  },
  2: {
    hook: "Hunger is often about affordability and access—not just a lack of food.",
    action:
      "Micro-action: reduce food waste—take what you’ll finish; store leftovers properly.",
    mission:
      "Mini-mission: ‘Save the Cafeteria’—make choices that cut waste and help redistribute extra food safely.",
    choice:
      "Choice moment: toss extra food vs. pack/share responsibly (points + ‘No Waste’).",
  },
  3: {
    hook: "Good health includes mental wellbeing, sleep, prevention, and healthy routines.",
    action:
      "Micro-action: 20–30 min walk, hydrate, and check in on a friend who seems stressed.",
    mission:
      "Mini-mission: guide an NPC toward healthier coping strategies and support options.",
    choice:
      "Choice moment: give risky advice vs. recommend safe steps/support (points + ‘Wellbeing’).",
  },
  4: {
    hook: "Quality education is access + support + learning that actually sticks—not only grades.",
    action:
      "Micro-action: join/start a study group, tutor a junior, or share notes fairly.",
    mission:
      "Mini-mission: ‘Peer Tutor’—help an NPC understand a concept through clear, step-by-step explanations.",
    choice:
      "Choice moment: gatekeep notes vs. help others learn (points + ‘Mentor’).",
  },
  5: {
    hook: "Equality shows up in everyday behaviour—respect, safety, and fair opportunity.",
    action:
      "Micro-action: call out sexist jokes respectfully and support fair roles in team projects.",
    mission:
      "Mini-mission: mediate a group conflict where someone is dismissed or excluded unfairly.",
    choice:
      "Choice moment: stay silent vs. speak up constructively (points + ‘Ally’).",
  },
  6: {
    hook: "Clean water means responsible use and preventing pollution—every drop counts.",
    action:
      "Micro-action: shorter showers, turn taps off fully, and report leaks when you see them.",
    mission:
      "Mini-mission: locate “waste points” in a dorm/campus scene and trigger fixes/reporting.",
    choice:
      "Choice moment: ignore a leaking tap vs. report it (points + ‘Water Saver’).",
  },
  7: {
    hook: "Affordable and clean energy means using less and choosing smarter options.",
    action:
      "Micro-action: switch off lights, unplug idle chargers, and use energy-saving settings.",
    mission:
      "Mini-mission: ‘Power Audit’—spot unnecessary energy waste around campus and resolve it.",
    choice:
      "Choice moment: convenience vs. energy-conscious choice (points + ‘Power Smart’).",
  },
  8: {
    hook: "Decent work means fair pay, safe conditions, and respect—especially for juniors.",
    action:
      "Micro-action: learn basic worker rights; support ethical brands and fair internships.",
    mission:
      "Mini-mission: advise an NPC about a sketchy internship/job offer and safer alternatives.",
    choice:
      "Choice moment: accept exploitation vs. push back/choose better (points + ‘Fair Work’).",
  },
  9: {
    hook: "Innovation isn’t only big tech—it's better solutions for real problems.",
    action:
      "Micro-action: prototype simple solutions (UI mockups, awareness campaigns, small tools).",
    mission:
      "Mini-mission: propose a small “campus improvement” feature that solves a sustainability issue.",
    choice:
      "Choice moment: copy trends vs. design for real needs (points + ‘Innovator’).",
  },
  10: {
    hook: "Reduced inequality means removing barriers—bias, disability access, and unequal opportunity.",
    action:
      "Micro-action: practice inclusive teamwork and design accessible interfaces (contrast, labels, keyboard).",
    mission:
      "Mini-mission: improve a fictional campus portal’s accessibility and inclusivity.",
    choice:
      "Choice moment: ‘looks cool’ vs. ‘works for everyone’ (points + ‘Inclusive Designer’).",
  },
  11: {
    hook: "Sustainable cities mean safe spaces, good transport, clean public areas, and community care.",
    action:
      "Micro-action: use public transport/carpool; keep shared spaces clean; report hazards.",
    mission:
      "Mini-mission: plan a safer route and resolve a community issue (trash, lighting, signage).",
    choice:
      "Choice moment: take a harmful shortcut vs. pick the responsible option (points + ‘Civic Care’).",
  },
  12: {
    hook: "Responsible consumption is buying less, buying better, and reusing more.",
    action:
      "Micro-action: bring bottle/bag, thrift, repair before replacing, avoid single-use items.",
    mission:
      "Mini-mission: ‘Fix-it Quest’—choose repair/reuse options instead of buying new.",
    choice:
      "Choice moment: impulse buy vs. sustainable alternative (points + ‘Mindful Buyer’).",
  },
  13: {
    hook: "Climate action is daily habits + community impact—small changes scale.",
    action:
      "Micro-action: reduce energy waste, avoid unnecessary rides, support low-waste events.",
    mission:
      "Mini-mission: help organise a low-waste campus activity and persuade NPCs to join.",
    choice:
      "Choice moment: high-emission convenience vs. lower-impact plan (points + ‘Climate Hero’).",
  },
  14: {
    hook: "Life below water is threatened by plastic, pollution, and careless waste systems.",
    action:
      "Micro-action: avoid single-use plastics; join cleanups; dispose of waste properly.",
    mission:
      "Mini-mission: identify litter sources and improve disposal habits in a coastal-themed scene.",
    choice:
      "Choice moment: ignore trash vs. act now (points + ‘Ocean Guardian’).",
  },
  15: {
    hook: "Life on land is biodiversity—healthy ecosystems need protection and smart choices.",
    action:
      "Micro-action: plant native greenery, protect habitats, avoid illegal wildlife trade.",
    mission:
      "Mini-mission: restore a green corner by choosing native plants and correct care steps.",
    choice:
      "Choice moment: aesthetic-only vs. biodiversity-friendly pick (points + ‘Nature Keeper’).",
  },
  16: {
    hook: "Peace & justice includes fairness, safety, accountability, and healthy conflict resolution.",
    action:
      "Micro-action: de-escalate conflicts, report harassment, reject corruption and bullying.",
    mission:
      "Mini-mission: navigate a conflict dialogue using calm, evidence-based choices.",
    choice:
      "Choice moment: escalate drama vs. resolve responsibly (points + ‘Peace Builder’).",
  },
  17: {
    hook: "Partnerships make progress real—collaboration beats solo effort.",
    action:
      "Micro-action: join a club/volunteer project; collaborate across groups and skills.",
    mission:
      "Mini-mission: recruit NPCs and coordinate roles to complete a sustainability activity.",
    choice:
      "Choice moment: do everything alone vs. coordinate + delegate (points + ‘Team Catalyst’).",
  },
};

// ---- NEW: subtle color accent helper (very light, not laggy)
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
  Icon, // 👈 pass Fi icon component here
  tone = "emerald",
  onClick,
  reduceMotion,
  rightMeta,
}) {
  const toneBar = {
    emerald: "from-emerald-400/70 via-emerald-300/30 to-cyan-300/60",
    purple: "from-purple-400/70 via-fuchsia-300/25 to-cyan-300/55",
    indigo: "from-indigo-400/70 via-cyan-300/25 to-purple-300/55",
  };

  const iconTint = {
    emerald: "text-emerald-200",
    purple: "text-fuchsia-200",
    indigo: "text-cyan-200",
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
      {/* HUD accent line */}
      <span
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          `bg-gradient-to-r ${toneBar[tone] || toneBar.emerald}`,
        ].join(" ")}
      />

      <div className="flex items-center gap-4">
        {/* Icon chip (same vibe as your game sidebar) */}
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

          {/* tiny HUD bar */}
          <div className="mt-3 h-2 bg-gray-800/80 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${toneBar[tone] || toneBar.emerald}`} style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    </m.button>
  );
}



export default function Home() {
  const [selectedSDG, setSelectedSDG] = useState(null);
  const [query, setQuery] = useState("");
  const [lastRoute, setLastRoute] = useState("");
  const exploreRef = useRef(null);

  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { profile } = usePlayer();

  function goOrOnboard(targetPath) {
    if (profile) navigate(targetPath);
    else navigate(`/onboarding?next=${encodeURIComponent(targetPath)}`);
  }

  function scrollToExplore() {
    exploreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sdgExplorer:lastRoute") || "";
      setLastRoute(saved);
    } catch {
      setLastRoute("");
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sdgs;
    return sdgs.filter(
      (g) => g.name.toLowerCase().includes(q) || String(g.id).includes(q)
    );
  }, [query]);

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
      <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 ">

        <Navbar />

        {/* Ambient background (match GameLayout colors) */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* soft ambient glow like GameLayout */}
          <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400/10 via-purple-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />

          {/* subtle grid (optional) */}
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:48px_48px]" />

          {/* depth + readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
        </div>




        {/* HERO / HUB */}
        <div className="max-w-7xl mx-auto pt-28 pb-8 px-6 lg:px-10">
          <m.div {...pageEnter} className="space-y-6">
            {/* NEW: gradient chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 relative overflow-hidden">
              <span className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(60%_100%_at_10%_0%,rgba(168,85,247,0.30),transparent_55%),radial-gradient(60%_100%_at_90%_0%,rgba(34,211,238,0.22),transparent_55%)]" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.45)]" />
              <span className="relative">Interactive story • SDG points • Badges</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  SDG Explorer{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-emerald-300 to-cyan-300">
                    Hub
                  </span>
                </h1>
                <p className="text-white/70 text-lg leading-relaxed max-w-2xl mt-3">
                  Start fast. Make choices. Earn points. Then explore any SDG when you’re curious.
                </p>
              </div>

              {/* NEW: slightly more colorful button */}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <ActionCard
                reduceMotion={reduceMotion}
                tone="emerald"
                Icon={FiPlay}
                title={lastRoute ? "Continue" : "Start Game"}
                desc={lastRoute ? "Resume from where you left off." : "Jump into the story and earn SDG points."}
                rightMeta="Story Mode"
                onClick={() => goOrOnboard(lastRoute || "/game")}
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
                desc="See what you’ve unlocked and what’s next."
                rightMeta="Achievements"
                onClick={() => goOrOnboard("/badges")}
              />
            </div>

            {/* HOW IT WORKS (add a top accent line for color) */}
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

        {/* EXPLORE SECTION */}
        <div ref={exploreRef} className="max-w-7xl mx-auto pb-14 px-6 lg:px-10">
          <m.div
            {...pageEnter}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* NEW: subtle internal tint */}
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(60%_80%_at_10%_0%,rgba(168,85,247,0.18),transparent_60%),radial-gradient(60%_80%_at_90%_0%,rgba(34,211,238,0.14),transparent_60%)]" />

            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <div className="font-semibold text-white/90">Explore the SDGs</div>
                <div className="text-xs text-white/55 mt-1">Tap any goal to see real actions + in-game missions.</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-white/55">{filtered.length} shown</div>
                <m.button
                  type="button"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setQuery("")}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 hover:text-white transition"
                >
                  Reset
                </m.button>
              </div>
            </div>

            <div className="relative mb-4">
              <label className="sr-only" htmlFor="sdg-search">
                Search SDGs
              </label>
              <input
                id="sdg-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search goals (e.g. 4, climate, water)…"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-purple-300/40 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* SDG Grid (more colorful hover) */}
            <div className="relative grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {filtered.map((goal) => (
                <m.button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedSDG(goal)}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={[
                    "group relative rounded-2xl p-3",
                    "border border-white/10",
                    "bg-black/60 backdrop-blur-md",
                    "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.95)]",
                    "transition outline-none focus:ring-2 focus:ring-purple-500/30 overflow-hidden",
                    "hover:bg-black/55 hover:border-white/15",
                  ].join(" ")}

                  aria-label={`Open details for SDG ${goal.id}: ${goal.name}`}
                >
                  {/* Bottom glow ONLY (more saturated) */}
                  <span
                    className="pointer-events-none absolute inset-x-1 bottom-0 h-[3px] opacity-0 group-hover:opacity-100 transition"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${goal.color}, transparent)`,
                      boxShadow: `
      0 0 10px ${goal.color},
      0 0 22px ${goal.color}CC,
      0 0 46px ${goal.color}99
    `,
                      filter: "saturate(1.6)",
                    }}
                  />


                  <div className="flex items-center justify-between relative">
                    <div className="text-xs text- font-medium">SDG</div>
                    <div className="text-xs text-white/55 font-semibold">{goal.id}</div>
                  </div>

                  <div className="mt-3 flex flex-col items-center gap-2 relative">
                    {/* SDG IMAGE ICON */}
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden bg-black/40 border border-white/10 mb-1">
                        <img
                          src={getSdgIconSrc(goal.id)}
                          alt={`SDG ${goal.id} icon`}
                          className="w-full h-full object-contain p-1"
                          draggable={false}
                        />
                      </div>

                      {/* keep your existing glow behaviour */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition"
                        style={{ boxShadow: `0 0 26px ${goal.color}55` }}
                      />
                    </div>

                    <div className="text-[11px] text-center font-semibold text-white/90 leading-snug line-clamp-2">
                      {goal.name}
                    </div>
                  </div>

                  {/* keep your existing radial wash */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(70%_70%_at_50%_0%,rgba(168,85,247,0.16),transparent_65%)]" />

                </m.button>
              ))}
            </div>
          </m.div>
        </div>

        {/* Modal (add a color header strip + sdg-tinted highlight) */}
        <AnimatePresence>
          {selectedSDG && (
            <m.div
              className="fixed inset-0 z-50 flex items-center justify-center px-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-modal="true"
              role="dialog"
            >
              <m.button
                type="button"
                className="absolute inset-0 bg-black/70"
                onClick={() => setSelectedSDG(null)}
                aria-label="Close SDG modal"
              />

              {(() => {
                const info = sdgPreview[selectedSDG.id];
                return (
                  <m.div
                    className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0B1024]/95 backdrop-blur-xl p-6 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.95)] overflow-hidden"
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
                    exit={{ scale: 0.98, opacity: 0, transition: { duration: 0.15 } }}
                  >
                    {/* NEW: colorful top strip */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500/70 via-emerald-400/50 to-cyan-400/60" />
                    {/* NEW: sdg color wash */}
                    <div
                      className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-25"
                      style={{ backgroundColor: selectedSDG.color }}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-xs text-white/50 font-semibold mb-1">
                          SDG {selectedSDG.id}
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight">
                          {selectedSDG.name}
                        </h2>
                      </div>

                      <div className="w-10 h-10 rounded-2xl shrink-0 overflow-hidden bg-black/40 border border-white/10">
                        <img
                          src={getSdgIconSrc(selectedSDG.id)}
                          alt={`SDG ${selectedSDG.id} icon`}
                          className="w-full h-full object-contain p-1.5"
                          draggable={false}
                        />
                      </div>
                    </div>

                    <p className="relative text-white/70 leading-relaxed mt-3">{info?.hook}</p>

                    <div className="relative mt-5 space-y-3">
                      {[
                        { t: "What you can do", v: info?.action },
                        { t: "In-game mini-mission", v: info?.mission },
                        { t: "Choice moment", v: info?.choice },
                      ].map((card) => (
                        <div
                          key={card.t}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="text-sm font-semibold text-white/90">{card.t}</div>
                          <div className="text-sm text-white/70 mt-1">{card.v}</div>
                        </div>
                      ))}
                    </div>

                    <div className="relative mt-6 flex gap-3">
                      <m.button
                        type="button"
                        whileHover={reduceMotion ? undefined : { y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSDG(null)}
                        className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 hover:text-white transition"
                      >
                        Close (Esc)
                      </m.button>

                      <m.button
                        type="button"
                        whileHover={reduceMotion ? undefined : { y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => goOrOnboard("/game")}
                        className="flex-1 rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/28 to-lime-500/12 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_-20px_rgba(16,185,129,0.6)]"
                      >
                        Jump into Game
                      </m.button>
                    </div>
                  </m.div>
                );
              })()}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
