"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card-strong mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 text-base font-bold text-white shadow-lg shadow-blue-500/25">
                I
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Ilm<span className="text-blue-400">AI</span>
              </span>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              {[
                { href: "/", label: "Home" },
                { href: "/#features", label: "Features" },
                { href: "/#pricing", label: "Pricing" },
                { href: "/pay", label: "Subscribe" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-blue-200/70 transition-all hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              {user?.email === ADMIN_EMAIL && (
                <a
                  href="/admin"
                  className="text-sm font-medium text-cyan-400 transition-all hover:text-cyan-300"
                >
                  Admin
                </a>
              )}
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-blue-200/60">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="rounded-xl border border-white/10 px-4 py-1.5 text-sm text-blue-200/70 transition-all hover:border-blue-400/30 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="btn-glow rounded-xl px-5 py-1.5 text-sm font-medium text-white"
                >
                  Sign In
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center rounded-xl p-2 text-blue-200/70 transition-all hover:bg-white/5 hover:text-white md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-2 max-w-7xl px-4 sm:px-6 lg:px-8 md:hidden"
            >
              <div className="glass-card-strong rounded-2xl p-5">
                <nav className="flex flex-col gap-1" role="navigation" aria-label="Mobile navigation">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/#features", label: "Features" },
                    { href: "/#pricing", label: "Pricing" },
                    { href: "/pay", label: "Subscribe" },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex min-h-[44px] items-center rounded-xl px-4 text-sm text-blue-200/70 transition-all hover:bg-white/5 hover:text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                  {user?.email === ADMIN_EMAIL && (
                    <a
                      href="/admin"
                      className="flex min-h-[44px] items-center rounded-xl px-4 text-sm text-cyan-400 transition-all hover:bg-white/5 hover:text-cyan-300"
                      onClick={() => setMobileOpen(false)}
                    >
                      Admin
                    </a>
                  )}
                  {user ? (
                    <button
                      onClick={() => signOut()}
                      className="flex min-h-[44px] w-full items-center rounded-xl border border-white/10 px-4 text-left text-sm text-rose-300 transition-all hover:bg-rose-500/10"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => { setShowAuth(true); setMobileOpen(false); }}
                      className="btn-glow flex min-h-[44px] w-full items-center rounded-xl px-4 text-sm font-medium text-white"
                    >
                      Sign In
                    </button>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
