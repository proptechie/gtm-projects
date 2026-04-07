"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, X, Terminal, Plug, MessageSquare, ChevronLeft, ChevronRight, Sparkles, ArrowUpRight } from "lucide-react";

// ─── InView Animation Hook ───────────────────────────────────────────────────

function useInViewAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, isInView };
}

// ─── PMS Data ────────────────────────────────────────────────────────────────

const PMS_LIST = [
  { slug: "guesty", name: "Guesty", desc: "Short-term rental management", color: "#0066FF", logo: "G" },
  { slug: "mews", name: "Mews", desc: "Cloud hospitality platform", color: "#00C2A8", logo: "M" },
  { slug: "hostaway", name: "Hostaway", desc: "Vacation rental software", color: "#FF6B35", logo: "H" },
  { slug: "track", name: "Track", desc: "Hospitality PMS", color: "#1B3A5C", logo: "T" },
  { slug: "cloudbeds", name: "Cloudbeds", desc: "Hotel management suite", color: "#00A4E4", logo: "C" },
  { slug: "apaleo", name: "Apaleo", desc: "Cloud-native open PMS", color: "#6C63FF", logo: "A" },
  { slug: "opera", name: "Opera Cloud", desc: "Enterprise hotel PMS", color: "#C74634", logo: "O" },
  { slug: "muse", name: "Maestro", desc: "Independent hotel PMS", color: "#8B5CF6", logo: "M" },
];

// ─── Conduit Wordmark ────────────────────────────────────────────────────────

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

// ─── Lead Capture Modal ──────────────────────────────────────────────────────

function LeadModal({ pms, onClose }: { pms: typeof PMS_LIST[0]; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pms: pms.slug, source: "pms-claude-landing" }),
      });
    } catch {}
    router.push(`/guides/${pms.slug}?utm_source=pms-landing&utm_medium=modal&utm_campaign=pms-claude-guide&utm_content=${pms.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><X className="w-5 h-5" /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: pms.color }}>{pms.logo}</div>
          <div>
            <h3 className="font-medium text-[var(--dark)] text-lg">Connect {pms.name} to Claude</h3>
            <p className="text-sm text-[var(--dark-muted)]">Get the free step-by-step guide</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="First name" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent" />
            <input required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Last name" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent" />
          </div>
          <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Work email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent" />
          <button type="submit" disabled={submitting} className="w-full bg-[var(--dark)] text-white font-medium py-3.5 rounded-xl hover:bg-[var(--dark-mid)] transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
            {submitting ? "Loading..." : <><span>Get the Guide</span><ArrowRight className="w-4 h-4" /></>}
          </button>
          <p className="text-[10px] text-gray-400 text-center">No spam. Just the guide.</p>
        </form>
      </div>
    </div>
  );
}

// ─── Request Modal ───────────────────────────────────────────────────────────

function RequestModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", pmsName: "" });
  const [submitted, setSubmitted] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, pms: `request:${form.pmsName}`, source: "pms-request" }) }); } catch {}
    setSubmitted(true);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        {submitted ? (
          <div className="text-center py-6"><Sparkles className="w-8 h-8 text-[var(--accent)] mx-auto mb-3" /><h3 className="font-medium text-lg text-[var(--dark)]">Request received!</h3><p className="text-sm text-[var(--dark-muted)] mt-1">We&apos;ll notify you when the guide is ready.</p></div>
        ) : (
          <>
            <h3 className="font-medium text-lg text-[var(--dark)] mb-1">Request a PMS Guide</h3>
            <p className="text-sm text-[var(--dark-muted)] mb-5">Don&apos;t see your PMS? Tell us what you use.</p>
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="First name" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                <input required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Last name" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
              </div>
              <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Work email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
              <input required value={form.pmsName} onChange={(e) => setForm((f) => ({ ...f, pmsName: e.target.value }))} placeholder="Your PMS (e.g., RMS Cloud, Protel)" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
              <button type="submit" className="w-full bg-[var(--dark)] text-white font-medium py-3.5 rounded-xl hover:bg-[var(--dark-mid)] transition flex items-center justify-center gap-2 text-sm">Request Guide <ArrowRight className="w-4 h-4" /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Testimonial Carousel ────────────────────────────────────────────────────

const TESTIMONIALS = [
  { quote: "We connected Guesty to Claude in 20 minutes. Now our team uses AI for every guest interaction.", name: "Alex Rivera", role: "Ops Manager", company: "Coastal Stays" },
  { quote: "The MCP guide was dead simple. Copy, paste, done. Our front desk runs on Claude now.", name: "Maria Chen", role: "GM", company: "Urban Suites" },
  { quote: "Apaleo + Claude changed how we think about hotel operations. Conduit made it possible.", name: "James Park", role: "CTO", company: "Park Hotels" },
  { quote: "We went from zero AI to fully automated guest messaging in one afternoon.", name: "Sarah Kim", role: "Revenue Manager", company: "Beachfront Rentals" },
  { quote: "The Opera Cloud guide saved us weeks of integration work. Incredible resource.", name: "David Liu", role: "VP Technology", company: "Azure Hospitality" },
];

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % TESTIMONIALS.length), 4000);
  }, []);
  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);
  const go = (dir: number) => { setCurrent((c) => (c + dir + TESTIMONIALS.length) % TESTIMONIALS.length); startTimer(); };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="transition-transform duration-500 ease-out flex" style={{ transform: `translateX(-${current * 100}%)` }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="min-w-full px-4">
              <blockquote className="text-xl md:text-2xl font-medium text-[var(--dark)] leading-relaxed text-center max-w-2xl mx-auto">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 text-center">
                <p className="font-medium text-sm text-[var(--dark)]">{t.name}</p>
                <p className="text-xs text-[var(--dark-muted)]">{t.role}, {t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-8">
        <button onClick={() => go(-1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-[var(--dark)] w-6" : "bg-gray-300"}`} />)}
        </div>
        <button onClick={() => go(1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PMSClaudeLanding() {
  const [selectedPms, setSelectedPms] = useState<typeof PMS_LIST[0] | null>(null);
  const [showRequest, setShowRequest] = useState(false);

  const heroRef = useInViewAnimation();
  const stepsRef = useInViewAnimation();
  const gridRef = useInViewAnimation();
  const socialRef = useInViewAnimation();
  const comingRef = useInViewAnimation();
  const requestRef = useInViewAnimation();
  const ctaRef = useInViewAnimation();

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO (Dark) ─────────────────────────────────────────────── */}
      <section className="relative bg-[var(--dark)] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-network.jpg" alt="" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--dark)]/80 via-[var(--dark)]/60 to-[var(--dark)]" />
        </div>

        {/* Nav */}
        <nav className="relative z-10 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <ConduitLogo className="h-5 md:h-6" color="white" />
          <a href="https://conduit.ai?utm_source=pms-landing&utm_medium=nav&utm_campaign=pms-claude-guide" className="text-xs text-white/60 hover:text-white transition flex items-center gap-1">
            conduit.ai <ArrowUpRight className="w-3 h-3" />
          </a>
        </nav>

        {/* Hero Content */}
        <div ref={heroRef.ref} className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 text-center">
          <div className={`${heroRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
              <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs font-medium text-white/80">Free Setup Guides</span>
            </div>
          </div>

          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05] ${heroRef.isInView ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            Connect your PMS<br />to <span className="text-[var(--accent)]">Claude</span>
          </h1>

          <p className={`text-base md:text-lg text-white/60 mt-6 max-w-xl mx-auto leading-relaxed ${heroRef.isInView ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
            Build an MCP server for your property management system. Start using AI for reservations, guest messaging, and operations — in under 30 minutes.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 justify-center mt-10 ${heroRef.isInView ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
            <a href="#guides" className="bg-white text-[var(--dark)] px-7 py-3.5 rounded-full font-medium text-sm hover:bg-white/90 transition flex items-center justify-center gap-2 shadow-lg">
              View Guides <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://conduit.ai?utm_source=pms-landing&utm_medium=hero-cta&utm_campaign=pms-claude-guide" className="border border-white/20 text-white px-7 py-3.5 rounded-full font-medium text-sm hover:bg-white/10 transition backdrop-blur-sm text-center">
              Learn about Conduit
            </a>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-gray-100">
        <div ref={stepsRef.ref} className="max-w-4xl mx-auto px-6">
          <div className={`text-center mb-16 ${stepsRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-xs font-medium text-[var(--accent)] uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-medium text-[var(--dark)] tracking-tight">Three steps to AI-powered hospitality</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Terminal, title: "Install Claude", desc: "Download Claude Desktop or the Claude Code CLI. Takes 2 minutes.", num: "01" },
              { icon: Plug, title: "Build the MCP", desc: "Follow our copy-paste guide for your specific PMS. Every line of code provided.", num: "02" },
              { icon: MessageSquare, title: "Start using AI", desc: "Manage reservations, guest comms, and operations with Claude as your copilot.", num: "03" },
            ].map((step, i) => (
              <div key={i} className={`${stepsRef.isInView ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${0.1 + i * 0.15}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-[var(--accent)]">{step.num}</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--dark)] flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-medium text-lg text-[var(--dark)] mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--dark-muted)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PMS MARQUEE ─────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50 overflow-hidden">
        <div className="flex animate-marquee no-scrollbar">
          {[...PMS_LIST, ...PMS_LIST, ...PMS_LIST].map((pms, i) => (
            <div key={i} className="flex items-center gap-2 mx-6 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: pms.color }}>{pms.logo}</div>
              <span className="text-sm font-medium text-[var(--dark-muted)] whitespace-nowrap">{pms.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PMS GRID ────────────────────────────────────────────────── */}
      <section id="guides" className="py-20 md:py-28">
        <div ref={gridRef.ref} className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-14 ${gridRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-xs font-medium text-[var(--accent)] uppercase tracking-widest mb-3">Choose your PMS</p>
            <h2 className="text-3xl md:text-4xl font-medium text-[var(--dark)] tracking-tight">Pick your system, get your guide</h2>
            <p className="text-sm text-[var(--dark-muted)] mt-3 max-w-md mx-auto">Each guide includes working MCP server code, API auth setup, and Claude Desktop configuration — all copy-paste ready.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PMS_LIST.map((pms, i) => (
              <button
                key={pms.slug}
                onClick={() => setSelectedPms(pms)}
                className={`group relative bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-gray-400 hover:shadow-xl transition-all duration-300 ${gridRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: pms.color }}>
                  {pms.logo}
                </div>
                <h3 className="font-medium text-[var(--dark)] text-base">{pms.name}</h3>
                <p className="text-xs text-[var(--dark-muted)] mt-1">{pms.desc}</p>
                <ArrowRight className="w-4 h-4 text-gray-300 absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div ref={socialRef.ref} className="max-w-4xl mx-auto px-6">
          <div className={`${socialRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* ─── COMING SOON: CONDUIT MCP ────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div ref={comingRef.ref} className="max-w-4xl mx-auto px-6">
          <div className={`relative overflow-hidden rounded-3xl bg-[var(--dark)] text-white p-10 md:p-16 ${comingRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="absolute inset-0">
              <Image src="/hero-nodes.jpg" alt="" fill className="object-cover opacity-30" />
            </div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-[var(--accent)] text-white rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Coming Soon</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight">Conduit MCP Server</h3>
              <p className="text-sm text-white/60 mt-3 max-w-md mx-auto leading-relaxed">
                Skip the build entirely. Conduit&apos;s official MCP server will connect your PMS to Claude with zero code — plug and play.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REQUEST A PMS ────────────────────────────────────────────── */}
      <section className="pb-20">
        <div ref={requestRef.ref} className="max-w-4xl mx-auto px-6">
          <div className={`bg-white border border-gray-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4 ${requestRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div>
              <h3 className="font-medium text-[var(--dark)] text-lg">Don&apos;t see your PMS?</h3>
              <p className="text-sm text-[var(--dark-muted)] mt-1">Request a guide and we&apos;ll build it for you.</p>
            </div>
            <button onClick={() => setShowRequest(true)} className="bg-[var(--dark)] text-white font-medium px-6 py-3 rounded-full hover:bg-[var(--dark-mid)] transition text-sm flex items-center gap-2 shrink-0">
              Request a Guide <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────────────────── */}
      <section className="relative bg-[var(--dark)] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-lobby.jpg" alt="" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--dark)] via-[var(--dark)]/80 to-transparent" />
        </div>
        <div ref={ctaRef.ref} className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className={`max-w-xl ${ctaRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight">
              The future of hospitality<br />runs on AI
            </h2>
            <p className="text-sm text-white/50 mt-4 leading-relaxed max-w-md">
              Conduit helps hotel and rental operators automate guest communications, operations, and revenue management with AI that actually understands hospitality.
            </p>
            <div className="flex gap-3 mt-8">
              <a href="https://conduit.ai?utm_source=pms-landing&utm_medium=cta-banner&utm_campaign=pms-claude-guide" className="bg-white text-[var(--dark)] px-7 py-3.5 rounded-full font-medium text-sm hover:bg-white/90 transition flex items-center gap-2">
                Explore Conduit <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-[var(--dark)] text-white/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <ConduitLogo className="h-4" color="rgba(255,255,255,0.3)" />
          <p className="text-xs">Conduit AI, Inc. {new Date().getFullYear()}</p>
        </div>
      </footer>

      {/* ─── FIXED BOTTOM NAV ────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-[var(--dark)] text-white rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl border border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ConduitLogo className="h-3" color="white" />
          </div>
          <a href="#guides" className="bg-[var(--accent)] text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-[var(--accent-hover)] transition flex items-center gap-1.5">
            Get Started <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ─── MODALS ──────────────────────────────────────────────────── */}
      {selectedPms && <LeadModal pms={selectedPms} onClose={() => setSelectedPms(null)} />}
      {showRequest && <RequestModal onClose={() => setShowRequest(false)} />}
    </div>
  );
}
