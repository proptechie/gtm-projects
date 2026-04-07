"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, X, Sparkles, Terminal, Plug, MessageSquare } from "lucide-react";

// ─── PMS Data ────────────────────────────────────────────────────────────────

const PMS_LIST = [
  { slug: "guesty", name: "Guesty", desc: "Short-term rental management", color: "#0066FF", logo: "G" },
  { slug: "mews", name: "Mews", desc: "Cloud hospitality platform", color: "#00C2A8", logo: "M" },
  { slug: "hostaway", name: "Hostaway", desc: "Vacation rental software", color: "#FF6B35", logo: "H" },
  { slug: "track", name: "Track", desc: "Hospitality PMS", color: "#1B3A5C", logo: "T" },
  { slug: "cloudbeds", name: "Cloudbeds", desc: "Hotel management suite", color: "#00A4E4", logo: "C" },
  { slug: "apaleo", name: "Apaleo", desc: "Cloud-native open PMS", color: "#6C63FF", logo: "A" },
  { slug: "opera", name: "Oracle Opera Cloud", desc: "Enterprise hotel PMS (OHIP)", color: "#C74634", logo: "O" },
  { slug: "muse", name: "Maestro", desc: "Independent hotel PMS", color: "#8B5CF6", logo: "M" },
];

// ─── Conduit Wordmark ────────────────────────────────────────────────────────

function ConduitLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 450 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M167.322 98.4499H151.778V26.9487H185.664C203.85 26.9487 217.062 40.3163 217.062 58.8134V98.4499H201.518V58.6579C201.518 48.5545 194.368 40.9381 184.42 40.9381C174.628 40.9381 167.322 48.5545 167.322 58.6579V98.4499Z" fill="currentColor"/>
      <path d="M105.719 100H105.408C84.4239 100 67.6367 83.5237 67.6367 62.6951C67.6367 41.8665 84.4239 25.3901 105.408 25.3901H105.719C126.858 25.3901 143.49 41.8665 143.49 62.6951C143.49 83.5237 126.858 100 105.719 100ZM105.408 84.4563H105.719C117.688 84.4563 127.325 74.5083 127.325 62.6951C127.325 50.7264 117.688 40.9339 105.719 40.9339H105.408C93.4393 40.9339 83.8022 50.571 83.8022 62.6951C83.8022 74.6638 93.4393 84.4563 105.408 84.4563Z" fill="currentColor"/>
      <path d="M37.9667 100C16.8273 100 0.0400391 83.3682 0.0400391 62.6951C0.0400391 42.0219 16.6718 25.3901 37.8113 25.3901C47.7593 25.3901 57.241 29.2761 64.2356 36.2708L53.5105 47.1514C49.3137 42.7991 43.7179 40.623 37.8113 40.623C25.8426 40.623 16.2055 50.4155 16.2055 62.6951C16.2055 74.8192 25.9981 84.7672 37.9667 84.7672C43.8734 84.7672 49.4691 82.4356 53.5105 78.2388L64.2356 89.1194C57.241 95.9587 47.9147 100 37.9667 100Z" fill="currentColor"/>
      <path d="M410.012 97.9255H425.555V53.7813C425.555 46.4757 430.996 41.0354 438.301 41.0354H449.959V26.4243H438.301C430.996 26.4243 425.555 20.984 425.555 13.6785V0H410.012V13.6785V53.7813V97.9255Z" fill="currentColor"/>
      <path d="M383.381 16.0699H399.391V0H383.381V16.0699Z" fill="currentColor"/>
      <path d="M383.381 98.4446H399.391V26.9435H383.381V98.4446Z" fill="currentColor"/>
      <path d="M372.759 98.4499H339.029C320.843 98.4499 307.476 84.7714 307.476 66.2744V26.9487H323.019V66.7407C323.019 76.6887 330.325 84.1496 340.117 84.1496C350.065 84.1496 357.216 76.6887 357.216 66.7407V26.9487H372.759V98.4499Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M281.311 0V26.9425H261.104C241.364 26.9425 225.354 42.9525 225.354 62.693C225.354 82.4336 241.364 98.4436 261.104 98.4436H296.855V0H281.311ZM281.777 62.693C281.777 73.8845 272.762 83.2108 261.57 83.2108C250.534 83.2108 241.519 73.8845 241.519 62.693C241.519 51.3461 250.534 42.1753 261.57 42.1753C272.762 42.1753 281.777 51.3461 281.777 62.693Z" fill="currentColor"/>
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
    } catch { /* proceed anyway */ }
    router.push(`/guides/${pms.slug}?utm_source=pms-landing&utm_medium=modal&utm_campaign=pms-claude-guide&utm_content=${pms.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--ct-neutral-400)] hover:text-[var(--ct-neutral-700)] transition">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: pms.color }}
          >
            {pms.logo}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--ct-neutral-900)]">Connect {pms.name} to Claude</h3>
            <p className="text-sm text-[var(--ct-neutral-500)]">Get the free step-by-step guide</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--ct-neutral-600)] mb-1">First name</label>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="w-full border border-[var(--ct-neutral-300)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)] focus:border-transparent"
                placeholder="Cole"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ct-neutral-600)] mb-1">Last name</label>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full border border-[var(--ct-neutral-300)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)] focus:border-transparent"
                placeholder="Rubin"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--ct-neutral-600)] mb-1">Work email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-[var(--ct-neutral-300)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)] focus:border-transparent"
              placeholder="cole@conduit.ai"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[var(--ct-neutral-800)] text-white font-medium py-2.5 rounded-md hover:bg-[var(--ct-neutral-700)] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? "Loading..." : (
              <>Get the Guide <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
          <p className="text-[10px] text-[var(--ct-neutral-400)] text-center">No spam. Just the guide + optional setup help.</p>
        </form>
      </div>
    </div>
  );
}

// ─── Request PMS Modal ───────────────────────────────────────────────────────

function RequestModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", pmsName: "" });
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pms: `request:${form.pmsName}`, source: "pms-request" }),
      });
    } catch {}
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--ct-neutral-400)] hover:text-[var(--ct-neutral-700)]">
          <X className="w-5 h-5" />
        </button>
        {submitted ? (
          <div className="text-center py-4">
            <Sparkles className="w-8 h-8 text-[var(--ct-blue-700)] mx-auto mb-2" />
            <h3 className="font-semibold text-[var(--ct-neutral-900)]">Request received!</h3>
            <p className="text-sm text-[var(--ct-neutral-500)] mt-1">We&apos;ll notify you when the guide is ready.</p>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-[var(--ct-neutral-900)] mb-1">Request a PMS Guide</h3>
            <p className="text-sm text-[var(--ct-neutral-500)] mb-4">Don&apos;t see your PMS? Tell us what you use.</p>
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="First name" className="border border-[var(--ct-neutral-300)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)]" />
                <input required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Last name" className="border border-[var(--ct-neutral-300)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)]" />
              </div>
              <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Work email" className="w-full border border-[var(--ct-neutral-300)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)]" />
              <input required value={form.pmsName} onChange={(e) => setForm((f) => ({ ...f, pmsName: e.target.value }))} placeholder="Your PMS name (e.g., RMS Cloud)" className="w-full border border-[var(--ct-neutral-300)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ct-blue-700)]" />
              <button type="submit" className="w-full bg-[var(--ct-neutral-800)] text-white font-medium py-2.5 rounded-md hover:bg-[var(--ct-neutral-700)] transition flex items-center justify-center gap-2">
                Request Guide <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────────

export default function PMSClaudeLanding() {
  const [selectedPms, setSelectedPms] = useState<typeof PMS_LIST[0] | null>(null);
  const [showRequest, setShowRequest] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page-body)]">
      {/* Nav */}
      <nav className="border-b border-[var(--ct-neutral-200)] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <ConduitLogo className="h-6 text-[var(--ct-neutral-900)]" />
          <a
            href="https://conduit.ai?utm_source=pms-landing&utm_medium=nav&utm_campaign=pms-claude-guide"
            className="text-sm font-medium text-[var(--ct-neutral-600)] hover:text-[var(--ct-neutral-900)] transition"
          >
            conduit.ai
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-[var(--ct-blue-50)] border border-[var(--ct-blue-300)] rounded-full px-3 py-1 mb-6">
            <Terminal className="w-3.5 h-3.5 text-[var(--ct-blue-700)]" />
            <span className="text-xs font-medium text-[var(--ct-blue-700)]">Free Setup Guides</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--ct-neutral-900)] tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Connect your PMS to{" "}
            <span className="text-[var(--ct-blue-700)]">Claude</span>
          </h1>
          <p className="text-lg text-[var(--ct-neutral-500)] mt-4 max-w-xl mx-auto leading-relaxed">
            Build an MCP server for your property management system and start using AI for reservations, guest messaging, and operations — in under 30 minutes.
          </p>
        </div>

        {/* How it works */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "150ms", opacity: 0 }}>
          {[
            { icon: Terminal, title: "Install Claude", desc: "Download Claude Desktop or Claude Code CLI" },
            { icon: Plug, title: "Build the MCP", desc: "Follow our copy-paste guide for your PMS" },
            { icon: MessageSquare, title: "Start using AI", desc: "Manage reservations, guests, and ops with Claude" },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[var(--ct-neutral-100)] flex items-center justify-center">
                <step.icon className="w-5 h-5 text-[var(--ct-neutral-600)]" />
              </div>
              <h3 className="font-medium text-sm text-[var(--ct-neutral-900)]">{step.title}</h3>
              <p className="text-xs text-[var(--ct-neutral-500)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-sm font-medium text-[var(--ct-neutral-500)] uppercase tracking-wider mb-6 text-center">Choose your PMS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PMS_LIST.map((pms, i) => (
            <button
              key={pms.slug}
              onClick={() => setSelectedPms(pms)}
              className={`group relative bg-white border border-[var(--ct-neutral-200)] rounded-xl p-5 text-left hover:border-[var(--ct-neutral-400)] hover:shadow-md transition-all animate-fade-up delay-${i + 1}`}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-3"
                style={{ backgroundColor: pms.color }}
              >
                {pms.logo}
              </div>
              <h3 className="font-semibold text-[var(--ct-neutral-900)] text-sm">{pms.name}</h3>
              <p className="text-xs text-[var(--ct-neutral-500)] mt-0.5">{pms.desc}</p>
              <ArrowRight className="w-4 h-4 text-[var(--ct-neutral-400)] absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition" />
            </button>
          ))}
        </div>
      </section>

      {/* Coming Soon — Conduit MCP */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-br from-[var(--ct-blue-50)] to-[var(--ct-neutral-100)] border border-[var(--ct-blue-300)] rounded-xl p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--ct-blue-700)] text-white rounded-full px-3 py-1 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Coming Soon</span>
          </div>
          <h3 className="text-xl font-semibold text-[var(--ct-neutral-900)]">Conduit MCP Server</h3>
          <p className="text-sm text-[var(--ct-neutral-500)] mt-2 max-w-md mx-auto">
            Skip the build. Conduit&apos;s official MCP server will connect your PMS to Claude with zero code — plug and play.
          </p>
        </div>
      </section>

      {/* Request a PMS */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-white border border-[var(--ct-neutral-200)] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-[var(--ct-neutral-900)]">Don&apos;t see your PMS?</h3>
            <p className="text-sm text-[var(--ct-neutral-500)]">Request a guide and we&apos;ll build it.</p>
          </div>
          <button
            onClick={() => setShowRequest(true)}
            className="bg-[var(--ct-neutral-800)] text-white font-medium px-5 py-2.5 rounded-md hover:bg-[var(--ct-neutral-700)] transition text-sm flex items-center gap-2 shrink-0"
          >
            Request a Guide <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--ct-neutral-200)] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <ConduitLogo className="h-5 text-[var(--ct-neutral-400)]" />
          <p className="text-xs text-[var(--ct-neutral-400)]">Conduit AI, Inc. {new Date().getFullYear()}</p>
        </div>
      </footer>

      {/* Modals */}
      {selectedPms && <LeadModal pms={selectedPms} onClose={() => setSelectedPms(null)} />}
      {showRequest && <RequestModal onClose={() => setShowRequest(false)} />}
    </div>
  );
}
