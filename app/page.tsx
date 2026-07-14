"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FeatureCard from "@/app/components/FeatureCard";
import PricingCard from "@/app/components/PricingCard";
import DownloadBanner from "@/app/components/DownloadBanner";
import ParticleField from "@/app/components/ParticleField";

const features = [
  { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>, title: "AI Chat Assistant", description: "Get instant answers to your board subject questions with our intelligent AI tutor trained on Pakistan's curriculum." },
  { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: "Snap & Solve", description: "Snap a photo of any board exam question and get an instant AI-generated solution with step-by-step explanation." },
  { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>, title: "Smart Flashcards", description: "Generate AI-powered flashcards from your notes and textbooks. Review with spaced repetition for better retention." },
  { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, title: "Board Exam Prep", description: "Past papers, model papers, and board-specific practice material for BSEK, BIEK, and other Pakistani boards." },
  { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 3-3" /></svg>, title: "Practice Tests", description: "Timed mock exams with auto-grading. Track your scores and identify weak areas with detailed analytics." },
  { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>, title: "Board News Feed", description: "Real-time updates from BSEK, BIEK, and other boards. Never miss exam schedules, results, or important announcements." },
  { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, title: "Digital Library", description: "Access 100+ free board textbooks, reference books, and study guides — all at no cost." },
  { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, title: "Analytics", description: "Track your study progress, test scores, and improvement trends with detailed visual dashboards." },
];

const pricingPlans = [
  { name: "Free", price: 0, period: "month", features: ["5 AI messages / day", "1 note / day", "1 test / day", "1 flashcard deck", "100% free board books", "Board news feed access"], cta: "Get Started Free", highlighted: false },
  { name: "Pro", price: 250, period: "month", features: ["35 AI messages / day (5 images)", "8 notes / day", "10 tests / day", "5 flashcard decks", "Free board books & news", "Priority support"], cta: "Subscribe to Pro", highlighted: true },
  { name: "Elite", price: 400, period: "month", features: ["150 AI messages / day (10 images)", "15 notes / day", "25 tests / day", "15 flashcard decks", "Free board books & news", "Premium support + early access"], cta: "Go Elite", highlighted: false },
];

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen pb-16 md:pb-0">
      <ParticleField />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative z-10 overflow-hidden pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}>
            <div className="mx-auto inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
              AI-Powered Learning for Pakistani Students
            </div>
          </motion.div>

          <div className="mx-auto mt-8 max-w-5xl overflow-hidden">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Master Your Board Exams{" "}
                <span className="text-shimmer">with AI</span>
              </motion.h1>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 md:text-xl"
          >
            IlmAI is your intelligent study companion — chat with AI, snap & solve questions, create flashcards, and ace your board exams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button onClick={() => router.push("/pay")} className="btn-luxury rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25">
              Start Learning Free
            </button>
            <a href="#features" className="rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
              Explore Features
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-14 flex flex-wrap items-center justify-center gap-6 text-center"
          >
            {[
              { label: "Active Students", value: "10K+" },
              { label: "AI Solutions", value: "50K+" },
              { label: "Board Resources", value: "100+" },
              { label: "Practice Tests", value: "5K+" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl px-6 py-4">
                <div className="text-2xl font-bold text-blue-400 md:text-3xl">{s.value}</div>
                <div className="text-xs text-slate-400 md:text-sm">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }} className="mb-14 text-center">
          <div className="mx-auto inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">Platform Features</div>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Everything You Need to <span className="text-shimmer">Excel</span></h2>
          <p className="mt-3 text-slate-400">Powerful tools designed for Pakistani board exam students</p>
        </motion.div>
        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={staggerItem} className={i >= 4 ? "md:-mt-24" : ""}>
              <FeatureCard icon={f.icon} title={f.title} description={f.description} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }} className="glass-strong overflow-hidden rounded-3xl p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="relative">
              <div className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">Our Mission</div>
              <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">Who Made IlmAI <span className="text-blue-400">&amp;</span> Why</h2>
              <p className="mt-4 leading-relaxed text-slate-400">IlmAI was built by a team of Pakistani educators and developers who experienced firsthand the challenges of board exam preparation.</p>
              <p className="mt-3 leading-relaxed text-slate-400">Our mission is to democratize quality education for every Pakistani student. Whether you&apos;re in Karachi, Lahore, or a remote village, IlmAI gives you access to AI-powered tutoring, board-specific resources, and smart study tools.</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-navy-950 bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold text-white">{String.fromCharCode(64 + i)}</div>
                  ))}
                </div>
                <span className="text-sm text-slate-500">Built for Pakistani students</span>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="flex h-64 w-64 animate-glow-pulse items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-400/5 md:h-80 md:w-80">
                <div className="text-center">
                  <div className="animate-float-slow text-6xl font-bold text-luxury md:text-7xl">I</div>
                  <p className="mt-2 text-sm text-slate-500">Intelligence for All</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }} className="mb-14 text-center">
          <div className="mx-auto inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">Pricing</div>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Simple, <span className="text-shimmer">Transparent</span> Pricing</h2>
          <p className="mt-3 text-slate-400">Start free, upgrade when you need more. No hidden fees.</p>
        </motion.div>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const }}>
              <PricingCard {...plan} onSelect={() => { if (plan.price > 0) router.push("/pay"); }} />
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
      <DownloadBanner />
    </div>
  );
}
