"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, X, Sparkles, ArrowUpRight, Zap, Cable, Bot, ChevronLeft, ChevronRight, BarChart3, CalendarCheck, DollarSign, ClipboardList, BedDouble } from "lucide-react";

// ─── InView Hook ─────────────────────────────────────────────────────────────

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── PMS Data ────────────────────────────────────────────────────────────────

const PMS_LIST = [
  { slug: "guesty", name: "Guesty", desc: "Short-term rental management", logo: "/logos/pms/guesty.png", accent: "#2D8C6E", type: "str" as const },
  { slug: "mews", name: "Mews", desc: "Cloud hospitality platform", logo: "/logos/pms/mews.png", accent: "#1A1A2E", type: "hotel" as const },
  { slug: "hostaway", name: "Hostaway", desc: "Vacation rental software", logo: "/logos/pms/hostaway.png", accent: "#FF6B35", type: "str" as const },
  { slug: "track", name: "Track", desc: "Hospitality PMS", logo: "/logos/pms/track.png", accent: "#1B3A5C", type: "hotel" as const },
  { slug: "cloudbeds", name: "Cloudbeds", desc: "Hotel management suite", logo: "/logos/pms/cloudbeds.png", accent: "#00A4E4", type: "hotel" as const },
  { slug: "apaleo", name: "Apaleo", desc: "Cloud-native open PMS", logo: "/logos/pms/apaleo.png", accent: "#6C63FF", type: "hotel" as const },
  { slug: "opera", name: "Opera Cloud", desc: "Enterprise hotel PMS (OHIP)", logo: "/logos/pms/oracle.png", accent: "#C74634", type: "hotel" as const },
  { slug: "streamline", name: "Streamline", desc: "Vacation rental software", logo: "/logos/pms/streamline.png", accent: "#2B7A78", type: "str" as const },
];

// ─── MCP Prompt Cards ────────────────────────────────────────────────────────

const MCP_PROMPTS = [
  {
    category: "Analytics",
    icon: BarChart3,
    prompt: "What was my occupancy rate last month and which properties underperformed?",
    pms: ["guesty", "hostaway", "mews", "apaleo", "cloudbeds"],
    endpoints: ["GET /reservations", "GET /listings"],
  },
  {
    category: "Operations",
    icon: CalendarCheck,
    prompt: "Show me all check-ins arriving today and flag any with special requests",
    pms: ["guesty", "mews", "hostaway", "track", "cloudbeds", "apaleo", "opera"],
    endpoints: ["GET /reservations", "GET /guests"],
  },
  {
    category: "Revenue",
    icon: DollarSign,
    prompt: "Compare my average nightly rate this quarter vs. last quarter across all units",
    pms: ["guesty", "hostaway", "streamline", "cloudbeds"],
    endpoints: ["GET /reservations", "GET /financials"],
  },
  {
    category: "Operations",
    icon: ClipboardList,
    prompt: "Which rooms need housekeeping attention today and what's the priority order?",
    pms: ["mews", "track", "cloudbeds", "opera"],
    endpoints: ["GET /housekeeping", "GET /rooms"],
  },
  {
    category: "Inventory",
    icon: BedDouble,
    prompt: "Show me all vacant units for next weekend and their current nightly rates",
    pms: ["guesty", "hostaway", "streamline", "apaleo", "cloudbeds"],
    endpoints: ["GET /listings", "GET /calendar"],
  },
  {
    category: "Analytics",
    icon: BarChart3,
    prompt: "Which guests are repeat bookers and how much total revenue has each generated?",
    pms: ["guesty", "mews", "hostaway", "apaleo", "opera"],
    endpoints: ["GET /guests", "GET /reservations"],
  },
];

// ─── Conduit Logo ────────────────────────────────────────────────────────────

function ConduitLogo({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 450 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M167.322 98.45H151.778V26.95H185.664C203.85 26.95 217.062 40.32 217.062 58.81V98.45H201.518V58.66C201.518 48.55 194.368 40.94 184.42 40.94C174.628 40.94 167.322 48.55 167.322 58.66V98.45Z" fill={color}/>
      <path d="M105.719 100H105.408C84.424 100 67.637 83.52 67.637 62.7C67.637 41.87 84.424 25.39 105.408 25.39H105.719C126.858 25.39 143.49 41.87 143.49 62.7C143.49 83.52 126.858 100 105.719 100ZM105.408 84.46H105.719C117.688 84.46 127.325 74.51 127.325 62.7C127.325 50.73 117.688 40.93 105.719 40.93H105.408C93.439 40.93 83.802 50.57 83.802 62.7C83.802 74.66 93.439 84.46 105.408 84.46Z" fill={color}/>
      <path d="M37.967 100C16.827 100 0.04 83.37 0.04 62.7C0.04 42.02 16.672 25.39 37.811 25.39C47.759 25.39 57.241 29.28 64.236 36.27L53.51 47.15C49.314 42.8 43.718 40.62 37.811 40.62C25.843 40.62 16.205 50.42 16.205 62.7C16.205 74.82 25.998 84.77 37.967 84.77C43.873 84.77 49.469 82.44 53.51 78.24L64.236 89.12C57.241 95.96 47.915 100 37.967 100Z" fill={color}/>
      <path d="M410.012 97.93H425.555V53.78C425.555 46.48 430.996 41.04 438.301 41.04H449.959V26.42H438.301C430.996 26.42 425.555 20.98 425.555 13.68V0H410.012V13.68V53.78V97.93Z" fill={color}/>
      <path d="M383.381 16.07H399.391V0H383.381V16.07Z" fill={color}/>
      <path d="M383.381 98.44H399.391V26.94H383.381V98.44Z" fill={color}/>
      <path d="M372.759 98.45H339.029C320.843 98.45 307.476 84.77 307.476 66.27V26.95H323.019V66.74C323.019 76.69 330.325 84.15 340.117 84.15C350.065 84.15 357.216 76.69 357.216 66.74V26.95H372.759V98.45Z" fill={color}/>
      <path fillRule="evenodd" clipRule="evenodd" d="M281.311 0V26.94H261.104C241.364 26.94 225.354 42.95 225.354 62.69C225.354 82.43 241.364 98.44 261.104 98.44H296.855V0H281.311ZM281.777 62.69C281.777 73.88 272.762 83.21 261.57 83.21C250.534 83.21 241.519 73.88 241.519 62.69C241.519 51.35 250.534 42.18 261.57 42.18C272.762 42.18 281.777 51.35 281.777 62.69Z" fill={color}/>
    </svg>
  );
}

// ─── Lead Modal ──────────────────────────────────────────────────────────────

function LeadModal({ pms, onClose }: { pms: typeof PMS_LIST[0]; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try { await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, pms: pms.slug }) }); } catch {}
    router.push(`/guides/${pms.slug}?utm_source=pms_claude_guides&utm_medium=referral&utm_campaign=pms_claude_guides&utm_content=${pms.slug}_guide`);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 anim-scale-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--ct-neutral-400)] hover:text-[var(--ct-neutral-700)] transition"><X className="w-5 h-5" /></button>
        <div className="flex items-center gap-3 mb-6">
          <Image src={pms.logo} alt={pms.name} width={44} height={44} className="rounded-xl" unoptimized />
          <div>
            <h3 className="font-medium text-[var(--ct-neutral-900)] text-base">Connect {pms.name} to Claude</h3>
            <p className="text-xs text-[var(--ct-neutral-500)]">Free step-by-step guide</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input required value={form.firstName} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="First name" className="border border-[var(--ct-neutral-300)] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)] focus:border-transparent transition" />
            <input required value={form.lastName} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Last name" className="border border-[var(--ct-neutral-300)] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)] focus:border-transparent transition" />
          </div>
          <input required type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Work email" className="w-full border border-[var(--ct-neutral-300)] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)] focus:border-transparent transition" />
          <button type="submit" disabled={submitting} className="w-full bg-[var(--ct-neutral-800)] text-white font-medium py-3 rounded-xl hover:bg-[var(--ct-neutral-700)] transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
            {submitting ? "Loading..." : <><span>Get the Guide</span><ArrowRight className="w-4 h-4" /></>}
          </button>
          <p className="text-[10px] text-[var(--ct-neutral-400)] text-center">No spam, ever. Just the guide.</p>
        </form>
      </div>
    </div>
  );
}

// ─── Request Modal ───────────────────────────────────────────────────────────

function RequestModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", pmsName: "" });
  const [done, setDone] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, pms: form.pmsName }) }); } catch {}
    setDone(true);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 anim-scale-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--ct-neutral-400)] hover:text-[var(--ct-neutral-700)]"><X className="w-5 h-5" /></button>
        {done ? (
          <div className="text-center py-6"><Sparkles className="w-8 h-8 text-[var(--ct-blue-700)] mx-auto mb-3" /><h3 className="font-medium text-[var(--ct-neutral-900)]">Request received!</h3><p className="text-sm text-[var(--ct-neutral-500)] mt-1">We&apos;ll notify you when it&apos;s ready.</p></div>
        ) : (
          <><h3 className="font-medium text-[var(--ct-neutral-900)] mb-1">Request a PMS Guide</h3><p className="text-sm text-[var(--ct-neutral-500)] mb-5">Tell us what PMS you use and we&apos;ll build a guide for it.</p>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input required value={form.firstName} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="First name" className="border border-[var(--ct-neutral-300)] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)]" />
              <input required value={form.lastName} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Last name" className="border border-[var(--ct-neutral-300)] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)]" />
            </div>
            <input required type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Work email" className="w-full border border-[var(--ct-neutral-300)] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)]" />
            <input required value={form.pmsName} onChange={(e) => setForm(f => ({ ...f, pmsName: e.target.value }))} placeholder="Your PMS (e.g., RMS Cloud, Protel)" className="w-full border border-[var(--ct-neutral-300)] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)]" />
            <button type="submit" className="w-full bg-[var(--ct-neutral-800)] text-white font-medium py-3 rounded-xl hover:bg-[var(--ct-neutral-700)] transition flex items-center justify-center gap-2 text-sm">Request Guide <ArrowRight className="w-4 h-4" /></button>
          </form></>
        )}
      </div>
    </div>
  );
}

// ─── MCP Prompt Carousel ─────────────────────────────────────────────────────

function useWindowWidth() {
  const [width, setWidth] = useState(1024);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

function PromptCarousel() {
  const [index, setIndex] = useState(0);
  const width = useWindowWidth();
  const visibleCount = width < 640 ? 1 : width < 1024 ? 2 : 3;
  const maxIndex = Math.max(0, MCP_PROMPTS.length - visibleCount);

  // Reset index if it exceeds new maxIndex on resize
  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [maxIndex, index]);

  const pmsNameMap: Record<string, string> = {};
  PMS_LIST.forEach(p => { pmsNameMap[p.slug] = p.name; });

  const gap = 16;
  const slideWidth = 100 / visibleCount;
  const offset = index * (slideWidth + (gap * (visibleCount - 1)) / visibleCount / visibleCount);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * (100 / visibleCount + gap / (visibleCount * 3))}%)` }}
        >
          {MCP_PROMPTS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="shrink-0 bg-white border border-[var(--ct-neutral-200)] rounded-xl p-5 hover:shadow-lg hover:border-[var(--ct-neutral-300)] transition-all duration-200"
                style={{ width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 16 / visibleCount}px)` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[var(--ct-blue-50)] border border-[var(--ct-blue-200)] flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[var(--ct-blue-700)]" />
                  </div>
                  <span className="text-[10px] font-medium text-[var(--ct-neutral-400)] uppercase tracking-wider">{card.category}</span>
                </div>
                <p className="text-sm font-medium text-[var(--ct-neutral-800)] leading-snug mb-4">&ldquo;{card.prompt}&rdquo;</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {card.pms.slice(0, 4).map(slug => (
                    <span key={slug} className="text-[10px] font-medium bg-[var(--ct-neutral-100)] text-[var(--ct-neutral-600)] px-2 py-0.5 rounded-full">
                      {pmsNameMap[slug]}
                    </span>
                  ))}
                  {card.pms.length > 4 && (
                    <span className="text-[10px] font-medium bg-[var(--ct-neutral-100)] text-[var(--ct-neutral-400)] px-2 py-0.5 rounded-full">
                      +{card.pms.length - 4}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.endpoints.map(ep => (
                    <code key={ep} className="text-[9px] font-mono bg-[var(--ct-neutral-900)] text-[var(--ct-neutral-300)] px-2 py-0.5 rounded">
                      {ep}
                    </code>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            className="w-8 h-8 rounded-full border border-[var(--ct-neutral-200)] flex items-center justify-center hover:bg-[var(--ct-neutral-100)] transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--ct-neutral-600)]" />
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-[var(--ct-neutral-800)]" : "bg-[var(--ct-neutral-300)]"}`} />
            ))}
          </div>
          <button
            onClick={() => setIndex(Math.min(maxIndex, index + 1))}
            disabled={index >= maxIndex}
            className="w-8 h-8 rounded-full border border-[var(--ct-neutral-200)] flex items-center justify-center hover:bg-[var(--ct-neutral-100)] transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-[var(--ct-neutral-600)]" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [selectedPms, setSelectedPms] = useState<typeof PMS_LIST[0] | null>(null);
  const [showRequest, setShowRequest] = useState(false);
  const hero = useInView();
  const steps = useInView();
  const grid = useInView();
  const mcp = useInView();
  const coming = useInView();

  // Determine if the last-clicked PMS was hotel or STR for footer messaging
  const lastPmsType = selectedPms?.type;

  return (
    <div className="min-h-screen">
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[var(--ct-neutral-200)]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium text-[var(--ct-neutral-400)] uppercase tracking-widest">powered by</span>
            <ConduitLogo className="h-[18px] text-[var(--ct-neutral-900)]" />
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.conduit.ai?utm_source=pms_claude_guides&utm_medium=referral&utm_campaign=pms_claude_guides&utm_content=nav_link" className="text-xs text-[var(--ct-neutral-500)] hover:text-[var(--ct-neutral-900)] transition hidden sm:flex items-center gap-1">
              conduit.ai <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#guides" className="bg-[var(--ct-neutral-800)] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[var(--ct-neutral-700)] transition">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section ref={hero.ref} className="pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className={`text-[clamp(2.2rem,5.5vw,3.8rem)] font-medium text-[var(--ct-neutral-900)] tracking-[-0.03em] leading-[1.2] ${hero.visible ? "anim-fade-up" : "opacity-0"}`}>
            Connect your PMS<br />
            <span className="inline-flex items-center gap-[0.12em]">
              to
              <Image src="/logos/claude-spark.png" alt="" width={80} height={80} className="inline-block h-[0.75em] w-[0.75em] object-contain mx-[0.05em] -mt-[0.02em]" unoptimized />
              <span style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400, letterSpacing: "-0.02em" }}>Claude</span>
            </span>
          </h1>

          <p className={`text-[15px] text-[var(--ct-neutral-500)] mt-5 max-w-lg mx-auto leading-relaxed ${hero.visible ? "anim-fade-up delay-2" : "opacity-0"}`}>
            Free, copy-paste MCP server guides for every major property management system. Go from zero to AI-powered operations in under 30 minutes.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 justify-center mt-8 ${hero.visible ? "anim-fade-up delay-3" : "opacity-0"}`}>
            <a href="#guides" className="bg-[var(--ct-neutral-800)] text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-[var(--ct-neutral-700)] transition inline-flex items-center justify-center gap-2 shadow-sm">
              Browse Guides <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Logo marquee */}
          <div className={`mt-14 overflow-hidden ${hero.visible ? "anim-fade-up delay-4" : "opacity-0"}`}>
            <p className="text-[10px] text-[var(--ct-neutral-400)] uppercase tracking-widest mb-4">Guides available for</p>
            <div className="flex anim-marquee">
              {[...PMS_LIST, ...PMS_LIST].map((pms, i) => (
                <div key={i} className="flex items-center gap-2.5 mx-5 shrink-0">
                  <Image src={pms.logo} alt={pms.name} width={28} height={28} className="rounded-md" unoptimized />
                  <span className="text-sm font-medium text-[var(--ct-neutral-500)] whitespace-nowrap">{pms.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section ref={steps.ref} className="py-16 md:py-20 bg-white border-y border-[var(--ct-neutral-200)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Zap, label: "01", title: "Install Claude", desc: "Download Claude Desktop or Claude Code CLI. Two minutes, tops." },
              { icon: Cable, label: "02", title: "Build the MCP", desc: "Copy-paste our server code for your PMS. Every line provided." },
              { icon: Bot, label: "03", title: "Start using AI", desc: "Claude becomes your copilot for reservations, guests, and ops." },
            ].map((s, i) => (
              <div key={i} className={`${steps.visible ? "anim-fade-up" : "opacity-0"}`} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[var(--ct-blue-50)] border border-[var(--ct-blue-200)] flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-[var(--ct-blue-700)]" />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--ct-neutral-400)]">{s.label}</span>
                </div>
                <h3 className="font-medium text-[var(--ct-neutral-900)] mb-1.5">{s.title}</h3>
                <p className="text-sm text-[var(--ct-neutral-500)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PMS Grid ────────────────────────────────────────────────── */}
      <section id="guides" ref={grid.ref} className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className={`mb-12 ${grid.visible ? "anim-fade-up" : "opacity-0"}`}>
            <h2 className="text-2xl md:text-3xl font-medium text-[var(--ct-neutral-900)] tracking-tight">Choose your PMS</h2>
            <p className="text-sm text-[var(--ct-neutral-500)] mt-2">Each guide includes working MCP server code, API auth setup, and Claude Desktop config.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PMS_LIST.map((pms, i) => (
              <button
                key={pms.slug}
                onClick={() => setSelectedPms(pms)}
                className={`group relative bg-white border border-[var(--ct-neutral-200)] rounded-xl p-5 text-left hover:border-[var(--ct-neutral-400)] hover:shadow-lg transition-all duration-200 ${grid.visible ? "anim-fade-up" : "opacity-0"}`}
                style={{ animationDelay: `${0.08 + i * 0.06}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Image src={pms.logo} alt={pms.name} width={44} height={44} className="rounded-xl shadow-sm border border-[var(--ct-neutral-100)]" unoptimized />
                  <ArrowRight className="w-4 h-4 text-[var(--ct-neutral-300)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-medium text-[var(--ct-neutral-900)] text-[15px]">{pms.name}</h3>
                <p className="text-xs text-[var(--ct-neutral-500)] mt-0.5 leading-relaxed">{pms.desc}</p>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: `linear-gradient(135deg, ${pms.accent}08, transparent 60%)` }} />
              </button>
            ))}
          </div>

          {/* Request — inline under grid */}
          <div className={`mt-6 bg-white border border-[var(--ct-neutral-200)] rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${grid.visible ? "anim-fade-up delay-6" : "opacity-0"}`}>
            <div>
              <h3 className="font-medium text-[var(--ct-neutral-900)]">Don&apos;t see your PMS?</h3>
              <p className="text-sm text-[var(--ct-neutral-500)] mt-0.5">Request a guide and we&apos;ll build it for you.</p>
            </div>
            <button onClick={() => setShowRequest(true)} className="bg-[var(--ct-neutral-800)] text-white font-medium px-5 py-2.5 rounded-xl hover:bg-[var(--ct-neutral-700)] transition text-sm flex items-center gap-2 shrink-0">
              Request a Guide <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── What is MCP? ────────────────────────────────────────────── */}
      <section ref={mcp.ref} className="py-16 md:py-24 bg-white border-y border-[var(--ct-neutral-200)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className={`mb-10 ${mcp.visible ? "anim-fade-up" : "opacity-0"}`}>
            <p className="text-[10px] font-medium text-[var(--ct-blue-700)] uppercase tracking-widest mb-2">What is MCP?</p>
            <h2 className="text-2xl md:text-3xl font-medium text-[var(--ct-neutral-900)] tracking-tight">
              Your PMS, inside Claude
            </h2>
            <p className="text-sm text-[var(--ct-neutral-500)] mt-2 max-w-xl leading-relaxed">
              MCP (Model Context Protocol) lets Claude talk directly to your property management system. No dashboards, no exports — just ask questions in plain English and get real answers from your live data.
            </p>
          </div>

          <div className={`${mcp.visible ? "anim-fade-up delay-2" : "opacity-0"}`}>
            <PromptCarousel />
          </div>
        </div>
      </section>

      {/* ── Coming Soon ─────────────────────────────────────────────── */}
      <section ref={coming.ref} className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className={`bg-[var(--ct-neutral-900)] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 ${coming.visible ? "anim-fade-up" : "opacity-0"}`}>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-[var(--ct-blue-700)] text-white rounded-full px-3 py-1 mb-4">
                <Sparkles className="w-3 h-3" />
                <span className="text-[11px] font-medium">Coming Soon</span>
              </div>
              <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight">Conduit MCP Server</h3>
              <p className="text-sm text-white/50 mt-2 leading-relaxed max-w-md">
                Skip the build entirely. Conduit&apos;s official MCP server connects your PMS to Claude with zero code — plug and play.
              </p>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center anim-float">
              <ConduitLogo className="h-5" color="white" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--ct-neutral-200)] bg-[var(--ct-neutral-900)]">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              <p className="text-lg md:text-xl font-medium text-white leading-snug">
                {lastPmsType === "str"
                  ? "Wonder what AI could do for your short-term rental?"
                  : "Wonder what AI could do for your hotel?"
                }
              </p>
              <p className="text-sm text-white/40 mt-2 max-w-md leading-relaxed">
                Conduit automates guest messaging, operations, and upsells across every major PMS. See how it works for your properties.
              </p>
            </div>
            <a
              href="https://forms.default.com/824113?utm_source=pms_claude_guides&utm_medium=referral&utm_campaign=pms_claude_guides&utm_content=landing_footer_demo"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-white text-[var(--ct-neutral-900)] font-medium px-6 py-3 rounded-xl text-sm hover:bg-[var(--ct-neutral-200)] transition inline-flex items-center gap-2"
            >
              See a Live Demo <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
            <ConduitLogo className="h-[14px]" color="rgba(255,255,255,0.3)" />
            <span className="text-xs text-white/20">{new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      {selectedPms && <LeadModal pms={selectedPms} onClose={() => setSelectedPms(null)} />}
      {showRequest && <RequestModal onClose={() => setShowRequest(false)} />}
    </div>
  );
}
