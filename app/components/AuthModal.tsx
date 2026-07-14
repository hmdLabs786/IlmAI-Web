"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const { resetPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
      onClose();
    } catch (err: any) {
      const msg =
        err.code === "auth/user-not-found" ? "No account found with this email"
        : err.code === "auth/wrong-password" ? "Incorrect password"
        : err.code === "auth/invalid-credential" ? "Invalid email or password"
        : err.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
      setResetMode(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="glass-strong mx-4 w-full max-w-md rounded-3xl p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {resetMode ? "Reset Password" : "Welcome Back"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {resetMode ? "Enter your email to reset" : "Sign in to your account"}
              </p>
            </div>
            <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition-all duration-300 hover:bg-white/5 hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={resetMode ? handleReset : handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="glass-input min-h-[44px] w-full rounded-xl px-4 text-sm" placeholder="you@example.com" />
            </div>
            {!resetMode && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="glass-input min-h-[44px] w-full rounded-xl px-4 text-sm" placeholder="••••••••" />
              </div>
            )}
            <button type="submit" disabled={submitting}
              className="btn-luxury min-h-[44px] w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50">
              {submitting ? "Please wait..." : resetMode ? "Send Reset Email" : "Sign In"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-400">
            {resetMode ? (
              <button onClick={() => setResetMode(false)} className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                Back to sign in
              </button>
            ) : (
              <button onClick={() => setResetMode(true)} className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
