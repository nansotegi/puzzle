import React, { useEffect, useMemo, useRef, useState } from "react";

// Gift Escape — single-file React app
// ✦ No external deps required. Tailwind classes used for styling.
// ✦ Drop this into a Vite/CRA project or use as the single page in a GitHub Pages site.
// ✦ Customize defaults below or pass values via URL query params, e.g.:
//    ?name=Álvaro&course=Intro%20to%20Woodcraft&date=14%20Dec%202025&location=Barcelona&link=https%3A%2F%2Fexample.com

const defaults = {
  name: "Love",
  course: "Woodcraft Workshop — Beginner",
  date: "14 Dec 2025",
  location: "Barcelona",
  link: "https://example.com/woodcraft-course",
  note:
    "Bring comfy clothes you don’t mind getting a little sawdusty. I’ll be right there with you. 💚",
};

function useQuery() {
  return useMemo(() => new URLSearchParams(window.location.search), []);
}

function useConfig() {
  const q = useQuery();
  return {
    name: q.get("name") || defaults.name,
    course: q.get("course") || defaults.course,
    date: q.get("date") || defaults.date,
    location: q.get("location") || defaults.location,
    link: q.get("link") || defaults.link,
    note: q.get("note") || defaults.note,
  };
}

const Section = ({ children, className = "" }) => (
  <section
    className={
      "mx-auto w-full max-w-4xl rounded-2xl bg-white/80 backdrop-blur p-6 md:p-8 shadow-xl border border-amber-100 " +
      className
    }
  >
    {children}
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-amber-900 text-sm">
    {children}
  </span>
);

// Simple confetti using emoji particles (no deps)
function useEmojiConfetti() {
  const [particles, setParticles] = useState([]);
  const shoot = () => {
    const now = Date.now();
    const batch = Array.from({ length: 80 }, (_, i) => ({
      id: now + ":" + i,
      x: Math.random() * 100,
      y: -5,
      r: 0,
      vy: 0.7 + Math.random() * 0.9,
      vx: -0.5 + Math.random(),
      rot: (Math.random() * 360) | 0,
      char: ["🪵", "✨", "🎉", "🪚", "🧰"][Math.floor(Math.random() * 5)],
    }));
    setParticles((p) => [...p, ...batch]);
    // Auto clean later
    setTimeout(() => setParticles([]), 4500);
  };
  return { particles, shoot };
}

function EmojiConfettiLayer({ particles }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            left: p.x + "%",
            top: p.y + "%",
            transform: `rotate(${p.rot}deg)`,
          }}
          className="absolute text-2xl transition-transform"
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}

// Lights Out 3x3 puzzle
function LightsOut({ onSolved }) {
  const [grid, setGrid] = useState([1, 0, 1, 0, 1, 0, 1, 0, 1]); // start state
  const toggle = (i) => {
    const n = [...grid];
    const idx = [i, i - 1, i + 1, i - 3, i + 3];
    idx.forEach((j) => {
      if (j >= 0 && j < 9) n[j] = n[j] ? 0 : 1;
    });
    setGrid(n);
  };
  useEffect(() => {
    if (grid.every((x) => x === 0)) onSolved?.();
  }, [grid, onSolved]);
  return (
    <div className="grid grid-cols-3 gap-2">
      {grid.map((v, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className={
            "h-16 w-16 md:h-20 md:w-20 rounded-xl border transition-all shadow-sm " +
            (v
              ? "bg-amber-300/70 border-amber-500 hover:bg-amber-400"
              : "bg-amber-50 border-amber-200 hover:bg-amber-100")
          }
          aria-label={`Tile ${i + 1}`}
        />
      ))}
    </div>
  );
}

// Puzzle 1: Pick the right tools (collect letters)
function ToolsPuzzle({ onSolved }) {
  const tools = [
    { name: "Saw", icon: "🪚", letter: "W", correct: true },
    { name: "Hammer", icon: "🔨", letter: "A", correct: false },
    { name: "Plane", icon: "🪵", letter: "O", correct: true }, // okay, not a plane emoji but close
    { name: "Ruler", icon: "📏", letter: "D", correct: true },
    { name: "Brush", icon: "🖌️", letter: "X", correct: false },
    { name: "Clamp", icon: "🗜️", letter: "Q", correct: false },
  ];
  const [picked, setPicked] = useState([]);
  const toggle = (i) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const solved = useMemo(() => {
    const letters = picked
      .filter((i) => tools[i].correct)
      .map((i) => tools[i].letter)
      .sort()
      .join("");
    const anyWrong = picked.some((i) => !tools[i].correct);
    return letters === "DOW" && !anyWrong;
  }, [picked]);

  useEffect(() => {
    if (solved) onSolved?.();
  }, [solved, onSolved]);

  return (
    <div className="space-y-4">
      <p className="text-amber-900">
        Pick <strong>exactly the tools</strong> you’d take to smooth and size a plank.
        The right ones will whisper the password.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tools.map((t, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={
              "flex items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition-all " +
              (picked.includes(i)
                ? "bg-amber-200/60 border-amber-500 scale-[1.02]"
                : "bg-white border-amber-200 hover:bg-amber-50")
            }
          >
            <span className="text-2xl" aria-hidden>
              {t.icon}
            </span>
            <div>
              <div className="font-semibold text-amber-900">{t.name}</div>
              <div className="text-xs text-amber-700/70">{picked.includes(i) ? "selected" : ""}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="text-sm text-amber-700">
        Hint: Smooth ➜ <em>plane</em>. Size ➜ <em>measure/saw</em>.
      </div>
    </div>
  );
}

// Puzzle 2: Tiny word cipher (Caesar)
function CaesarPuzzle({ onSolved }) {
  const secret = "YVCCF NFICU"; // HELLO WORLD shifted by 10
  const [answer, setAnswer] = useState("");
  const solved = answer.trim().toUpperCase() === "HELLO WORLD";

  useEffect(() => {
    if (solved) onSolved?.();
  }, [solved, onSolved]);

  return (
    <div className="space-y-4">
      <p className="text-amber-900">
        The grain rings count to <Pill>10</Pill>. Shift the message back by that many.
      </p>
      <div className="flex items-center gap-3">
        <div className="font-mono text-lg tracking-widest bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          {secret}
        </div>
        <span className="opacity-60">→</span>
        <input
          className="flex-1 rounded-xl border border-amber-300 bg-white px-3 py-2 focus:outline-none focus:ring focus:ring-amber-300"
          placeholder="Decoded text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>
      <div className="text-sm text-amber-700">Hint: Caesar cipher. Shift by −10.</div>
    </div>
  );
}

// Puzzle 3: Lights Out board to open the box
function BoxPuzzle({ onSolved }) {
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-amber-900">
        Make all tiles <em>calm</em> to open the box.
      </p>
      <LightsOut
        onSolved={() => {
          setDone(true);
          onSolved?.();
        }}
      />
      <div className="text-sm text-amber-700">Hint: Each press toggles neighbors. Aim for all pale tiles.</div>
      {done && <div className="text-emerald-700 font-medium">Click ➜ Opened!</div>}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2 py-1 text-xs font-medium border border-emerald-200">
      {children}
    </span>
  );
}

function Divider() {
  return <div className="h-px bg-amber-200 my-6" />;
}

function HeaderBar() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-gradient-to-r from-amber-50/80 to-amber-100/70 border-b border-amber-200">
      <div className="mx-auto max-w-4xl px-6 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪵</span>
          <span className="font-semibold text-amber-900">Gift Escape</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge>No spoilers</Badge>
          <Badge>Progress saved</Badge>
        </div>
      </div>
    </header>
  );
}

function FooterBar() {
  return (
    <footer className="py-10 text-center text-amber-800/70">
      Built with ❤️ and sawdust. Tip: add ?name=Your+BF here.
    </footer>
  );
}

function useProgress() {
  const [stage, setStage] = useState(() => Number(localStorage.getItem("gift.stage") || 0));
  const [hints, setHints] = useState(() => Number(localStorage.getItem("gift.hints") || 3));
  useEffect(() => localStorage.setItem("gift.stage", String(stage)), [stage]);
  useEffect(() => localStorage.setItem("gift.hints", String(hints)), [hints]);
  const reset = () => {
    localStorage.removeItem("gift.stage");
    localStorage.removeItem("gift.hints");
    setStage(0);
    setHints(3);
  };
  return { stage, setStage, hints, setHints, reset };
}

function QR({ text }) {
  // minimal QR: render an img via Google Charts fallback is not allowed (no internet). So draw a simple placeholder
  // Instead we render a stylized code block users can copy. For a real QR, replace with an <img src=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`}/>
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl border-2 border-amber-400 p-2 bg-white">
        <div className="w-40 h-40 grid grid-cols-10 grid-rows-10 gap-0.5">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className={(Math.random() > 0.5 ? "bg-amber-900" : "bg-amber-200") + " w-4 h-4"}
            />
          ))}
        </div>
      </div>
      <div className="text-xs text-amber-700">(Replace with a real QR if you want)</div>
      <a
        href={text}
        target="_blank"
        rel="noreferrer"
        className="underline text-amber-900 hover:text-amber-700"
      >
        Open link
      </a>
    </div>
  );
}

function Voucher({ cfg, onPrint }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#FFFBEB,transparent_50%),radial-gradient(circle_at_80%_30%,#FEF3C7,transparent_40%)]" />
      <Section className="mt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎟️</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-amber-900 tracking-tight">
                Woodcraft Course Voucher
              </h2>
              <div className="text-amber-800/80">For {cfg.name}</div>
            </div>
          </div>
          <button
            className="rounded-xl bg-amber-600 text-white px-4 py-2 shadow hover:bg-amber-700"
            onClick={onPrint}
          >
            Print
          </button>
        </div>
        <Divider />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-amber-900">
              <div className="text-sm uppercase tracking-wide text-amber-600">Course</div>
              <div className="text-xl font-semibold">{cfg.course}</div>
            </div>
            <div className="text-amber-900">
              <div className="text-sm uppercase tracking-wide text-amber-600">Date</div>
              <div className="text-lg">{cfg.date}</div>
            </div>
            <div className="text-amber-900">
              <div className="text-sm uppercase tracking-wide text-amber-600">Location</div>
              <div className="text-lg">{cfg.location}</div>
            </div>
            <div className="text-amber-900">
              <div className="text-sm uppercase tracking-wide text-amber-600">From</div>
              <div className="text-lg">Me — who can’t wait to build with you 🤍</div>
            </div>
            <p className="text-amber-800/80 text-sm leading-relaxed">{cfg.note}</p>
          </div>
          <div className="flex items-center justify-center">
            <QR text={cfg.link} />
          </div>
        </div>
      </Section>
    </div>
  );
}

function Intro({ cfg, onBegin }) {
  return (
    <Section>
      <div className="flex items-start gap-4">
        <span className="text-4xl">🧩</span>
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900">Hey {cfg.name}, ready for a tiny escape?</h1>
          <p className="text-amber-900/90">
            Somewhere in this page hides your present. Solve three woodsy puzzles to unlock it.
          </p>
          <ul className="text-amber-800/90 list-disc ml-6 space-y-1">
            <li>Use your brain and maybe a touch of brute force (like a hammer, but smarter).</li>
            <li>Hints are available if you need them.</li>
            <li>Your progress auto-saves.</li>
          </ul>
          <div className="flex gap-3 pt-2">
            <button onClick={onBegin} className="rounded-xl bg-amber-600 text-white px-5 py-3 shadow hover:bg-amber-700">
              Start the adventure
            </button>
            <a
              href="#howto"
              className="rounded-xl border border-amber-300 bg-white px-5 py-3 text-amber-900 hover:bg-amber-50"
            >
              How it works
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

function AppShell() {
  const cfg = useConfig();
  const { stage, setStage, hints, setHints, reset } = useProgress();
  const { particles, shoot } = useEmojiConfetti();

  useEffect(() => {
    // gentle falling animation for confetti
    const id = setInterval(() => {
      const els = document.querySelectorAll("[data-confetti]");
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        el.style.top = rect.top + 0.8 + "px";
        el.style.left = rect.left + 0.2 + "px";
      });
    }, 50);
    return () => clearInterval(id);
  }, []);

  const giveHint = () => {
    if (hints <= 0) return;
    setHints(hints - 1);
    alert(
      stage === 1
        ? "Pick: Saw, Plane, Ruler. Sort letters alphabetically."
        : stage === 2
        ? "It’s Caesar. Shift each letter back by 10."
        : stage === 3
        ? "Lights Out: Try solving rows top to bottom."
        : "No hint needed here!"
    );
  };

  const begin = () => setStage(1);
  const next = () => setStage(stage + 1);

  useEffect(() => {
    if (stage === 4) {
      shoot();
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    }
  }, [stage, shoot]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#FFFBEB_0%,#FEF3C7_100%)] text-amber-950">
      <HeaderBar />
      <main className="mx-auto max-w-5xl px-6 md:px-8 py-8 space-y-6">
        {stage === 0 && <Intro cfg={cfg} onBegin={begin} />}

        {stage > 0 && stage < 4 && (
          <Section>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">Chapter {stage} / 3</span>
                <Badge>{hints} hint{hints === 1 ? "" : "s"} left</Badge>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={giveHint}
                  className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-amber-900 hover:bg-amber-50"
                >
                  Get hint
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-amber-900 hover:bg-amber-50"
                >
                  Reset
                </button>
              </div>
            </div>
            <Divider />
            {stage === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-amber-900">Workshop Prep</h2>
                <ToolsPuzzle onSolved={next} />
              </div>
            )}
            {stage === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-amber-900">Reading the Grain</h2>
                <CaesarPuzzle onSolved={next} />
              </div>
            )}
            {stage === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-amber-900">Open the Tool Chest</h2>
                <BoxPuzzle onSolved={next} />
              </div>
            )}
          </Section>
        )}

        {stage >= 4 && (
          <>
            <Section className="text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-amber-900">You did it!</h2>
              <p className="text-amber-900/90 mt-2">
                Your reward awaits below. I hope you love it as much as I love you.
              </p>
            </Section>
            <Voucher cfg={cfg} onPrint={() => window.print()} />
          </>
        )}

        <Section id="howto" className="border-dashed">
          <h3 className="text-xl font-bold text-amber-900 mb-3">Customize & Deploy</h3>
          <ol className="list-decimal ml-6 space-y-2 text-amber-900/90">
            <li>
              <strong>Personalize:</strong> Change the <code>defaults</code> at the top of the file, or pass values in the URL.
              Example: <code>?name=Álvaro&course=Intro%20to%20Woodcraft&date=14%20Dec%202025&location=Barcelona</code>.
            </li>
            <li>
              <strong>Reveal link:</strong> Put the real booking or info URL in <code>defaults.link</code>.
            </li>
            <li>
              <strong>Build:</strong> Use Vite or CRA. For Vite, place this as <code>src/App.jsx</code>, ensure Tailwind is enabled (optional),
              or just keep the classes — it still looks fine without processing.
            </li>
            <li>
              <strong>Deploy on GitHub Pages:</strong> Turn on Pages for your repo (Settings → Pages → Deploy from branch → <code>dist</code> or <code>gh-pages</code> branch).
            </li>
            <li>
              <strong>Test:</strong> Open the live URL on mobile and desktop. Try the reset button and query params.
            </li>
          </ol>
        </Section>
      </main>
      <FooterBar />
      <EmojiConfettiLayer particles={[]} />
    </div>
  );
}

export default AppShell;
