"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AuthModal from "@/app/components/AuthModal";
import ParticleField from "@/app/components/ParticleField";

const plans = [
  { id: "Pro", name: "Pro", price: 250, features: ["35 AI messages/day (5 images)", "8 notes/day", "10 tests/day", "5 flashcard decks", "Free board books & news"] },
  { id: "Elite", name: "Elite", price: 400, features: ["150 AI messages/day (10 images)", "15 notes/day", "25 tests/day", "15 flashcard decks", "Free board books & news"] },
];

function getDateRange() {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() - 3);
  return { min: minDate.toISOString().split("T")[0], max: today.toISOString().split("T")[0] };
}

export default function PayPage() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountName, setAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [tidError, setTidError] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { min: minDate, max: maxDate } = getDateRange();

  useEffect(() => { if (!loading && !user) setShowAuth(true); }, [loading, user]);

  const validateTid = (val: string) => {
    const digits = val.replace(/\D/g, "");
    setTransactionId(digits);
    setTidError(digits.length > 0 && digits.length !== 12 ? "TID must be exactly 12 digits" : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    if (!paymentMethod) { toast.error("Please select a payment method"); return; }
    if (transactionId.length !== 12) { toast.error("TID must be exactly 12 digits"); return; }
    if (!paymentDate) { toast.error("Please select the payment date"); return; }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        accountHolderName: accountName, paymentMethod, selectedPlan,
        transactionId, paymentDate, uid: user.uid, email: user.email,
        status: "pending", createdAt: serverTimestamp(),
      };
      if (paymentMethod === "jazzcash" || paymentMethod === "easypaisa") payload.phoneNumber = phoneNumber;
      else if (paymentMethod === "bank") payload.bankAccountNumber = bankAccountNumber;
      await addDoc(collection(db, "payment_requests"), payload);
      setSuccess(true);
      toast.success("Payment request submitted!");
    } catch (err: any) {
      toast.error(err.message || "Submission failed.");
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
      <p className="animate-pulse text-sm text-slate-400">Loading...</p>
    </div>
  );

  if (success) return (
    <div className="relative min-h-screen">
      <ParticleField />
      <Navbar />
      <div className="relative z-10 mx-auto flex max-w-lg items-center justify-center px-4 pt-32">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="glass-strong w-full rounded-3xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-bold text-white">Payment Request Submitted!</h2>
          <p className="mt-2 text-sm text-slate-400">Your {selectedPlan} subscription is being reviewed. We&apos;ll notify you once approved.</p>
          <a href="/" className="btn-luxury mt-6 inline-block rounded-xl px-6 py-2.5 text-sm font-medium text-white">Back to Home</a>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <ParticleField />
      <Navbar />
      {showAuth && !user && <AuthModal onClose={() => setShowAuth(false)} />}

      <div className="relative z-10 mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }} className="mb-8 text-center">
          <div className="mx-auto inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">Subscription</div>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Upgrade Your <span className="text-shimmer">Learning</span></h1>
          <p className="mt-1 text-slate-400">Choose a plan and complete your payment</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }} className="mb-6 grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-xl border p-5 text-left transition-all duration-300 ${selectedPlan === plan.id ? "border-blue-500/30 glass-strong" : "border-white/10 glass"}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">{plan.name}</h3>
                {selectedPlan === plan.id && <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500"><svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
              </div>
              <div className="mt-1 text-xl font-bold text-white">Rs. {plan.price}<span className="text-sm font-normal text-slate-400">/month</span></div>
              <ul className="mt-3 space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
          className="glass rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10">
              <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Send payment to JazzCash <span className="font-mono text-blue-400">03092792622</span> — Account Name: <span className="text-blue-400">IRAM</span></p>
              <p className="mt-1 text-xs text-slate-500">After sending, fill the form below with the exact 12-digit TID from your receipt.</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-6 glass-strong rounded-2xl p-6">
          <h3 className="mb-5 font-semibold text-white">Payment Verification</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-slate-300">Payment Method</label>
                  <select required value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                    className="glass-select min-h-[44px] w-full rounded-xl px-3 text-sm">
                    <option value="">Select method</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="bank">Bank Account</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-slate-300">Account Holder Name</label>
                  <input type="text" required value={accountName} onChange={(e) => setAccountName(e.target.value)}
                    className="glass-input min-h-[44px] w-full rounded-xl px-3 text-sm" placeholder="Full name on account" />
                </div>
                {(paymentMethod === "jazzcash" || paymentMethod === "easypaisa") && (
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm text-slate-300">Phone Number</label>
                    <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                      className="glass-input min-h-[44px] w-full rounded-xl px-3 text-sm" placeholder="03XX-XXXXXXX" />
                  </div>
                )}
                {paymentMethod === "bank" && (
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm text-slate-300">Bank Account Number</label>
                    <input type="text" required value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="glass-input min-h-[44px] w-full rounded-xl px-3 text-sm" placeholder="Account number" />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Plan</label>
                  <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}
                    className="glass-select min-h-[44px] w-full rounded-xl px-3 text-sm">
                    <option value="Pro">Pro - Rs. 250/month</option>
                    <option value="Elite">Elite - Rs. 400/month</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Transaction ID (TID)</label>
                  <input type="text" required value={transactionId} onChange={(e) => validateTid(e.target.value)} maxLength={12}
                    className={`glass-input min-h-[44px] w-full rounded-xl px-3 text-sm ${tidError ? "!border-rose-500/40" : ""}`}
                    placeholder="12-digit TID" />
                  {tidError && <p className="mt-1 text-xs text-rose-400">{tidError}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Payment Date</label>
                  <input type="date" required value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} min={minDate} max={maxDate}
                    className="glass-input min-h-[44px] w-full rounded-xl px-3 text-sm [color-scheme:dark]" />
                  <p className="mt-1 text-xs text-slate-500">Last 3 days only</p>
                </div>
              </div>
              <button type="submit" disabled={submitting || !user || !!tidError}
                className="btn-luxury mt-2 min-h-[44px] w-full rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit Payment Request"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
