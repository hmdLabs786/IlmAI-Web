"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        toast.success("Welcome back!");
        onClose();
      } else if (mode === "signup") {
        await signUp(email, password, name);
        toast.success("Account created!");
        onClose();
      } else {
        await resetPassword(email);
        toast.success("Password reset email sent!");
        setMode("login");
      }
    } catch (err: any) {
      const msg =
        err.code === "auth/user-not-found" ? "No account found with this email"
        : err.code === "auth/wrong-password" ? "Incorrect password"
        : err.code === "auth/email-already-in-use" ? "An account already exists with this email"
        : err.code === "auth/weak-password" ? "Password must be at least 6 characters"
        : err.code === "auth/invalid-credential" ? "Invalid email or password"
        : err.code === "auth/popup-closed-by-user" ? "Sign-in cancelled"
        : err.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success("Welcome!");
      onClose();
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error("Google sign-in failed.");
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card-strong mx-4 w-full max-w-md rounded-2xl p-7"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-blue-200/50 transition-all hover:bg-white/5 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blue-200/70">Full Name</label>
                <input
                  type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-blue-200/70">Email Address</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="you@example.com"
              />
            </div>
            {mode !== "reset" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blue-200/70">Password</label>
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="••••••••"
                />
              </div>
            )}
            <button
              type="submit" disabled={submitting}
              className="btn-glow w-full rounded-xl py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Email"}
            </button>
          </form>

          {mode !== "reset" && (
            <>
              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 border-t border-white/10" />
                <span className="text-xs text-blue-200/40">OR</span>
                <div className="flex-1 border-t border-white/10" />
              </div>
              <button
                onClick={handleGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </>
          )}

          <div className="mt-4 text-center text-sm text-blue-200/50">
            {mode === "login" ? (
              <span>Don&apos;t have an account?{" "}<button onClick={() => setMode("signup")} className="font-medium text-blue-400 hover:text-blue-300">Sign up</button></span>
            ) : mode === "signup" ? (
              <span>Already have an account?{" "}<button onClick={() => setMode("login")} className="font-medium text-blue-400 hover:text-blue-300">Sign in</button></span>
            ) : null}
            {mode !== "reset" && <div className="mt-1"><button onClick={() => setMode("reset")} className="text-xs text-blue-200/40 hover:text-blue-400">Forgot password?</button></div>}
            {mode === "reset" && <button onClick={() => setMode("login")} className="font-medium text-blue-400 hover:text-blue-300">Back to sign in</button>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
