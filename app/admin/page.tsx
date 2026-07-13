"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { db, ADMIN_EMAIL } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getCountFromServer,
  Unsubscribe,
  DocumentData,
} from "firebase/firestore";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar";

interface PaymentRequest extends DocumentData {
  id: string;
  accountHolderName: string;
  selectedPlan: string;
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
  uid: string;
  email: string;
  status: string;
}

interface Metrics {
  users: number;
  scannedSolutions: number;
  flashcardDecks: number;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    users: 0,
    scannedSolutions: 0,
    flashcardDecks: 0,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setAuthorized(user?.email === ADMIN_EMAIL);
    }
  }, [user, loading]);

  useEffect(() => {
    if (!authorized) return;
    const q = query(
      collection(db, "payment_requests"),
      where("status", "==", "pending")
    );
    const unsub: Unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data: PaymentRequest[] = [];
        snap.forEach((d) => {
          data.push({ id: d.id, ...d.data() } as PaymentRequest);
        });
        setRequests(data);
      },
      (err) => {
        console.error("Error fetching payment requests:", err);
      }
    );
    return () => unsub();
  }, [authorized]);

  const fetchMetrics = useCallback(async () => {
    if (!authorized) return;
    try {
      const [usersSnap, solutionsSnap, decksSnap] = await Promise.all([
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "scanned_solutions")),
        getCountFromServer(collection(db, "flashcard_decks")),
      ]);
      setMetrics({
        users: usersSnap.data().count,
        scannedSolutions: solutionsSnap.data().count,
        flashcardDecks: decksSnap.data().count,
      });
    } catch (err) {
      console.error("Error fetching metrics:", err);
    }
  }, [authorized]);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const handleApprove = async (req: PaymentRequest) => {
    setActionLoading(req.id);
    try {
      await updateDoc(doc(db, "payment_requests", req.id), {
        status: "approved",
      });
      await updateDoc(doc(db, "users", req.uid), {
        subscriptionTier: req.selectedPlan,
      });
      toast.success(`Approved ${req.selectedPlan} for ${req.email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (req: PaymentRequest) => {
    setActionLoading(req.id);
    try {
      await updateDoc(doc(db, "payment_requests", req.id), {
        status: "rejected",
      });
      toast.success(`Rejected request from ${req.email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
        <p className="animate-pulse text-sm text-blue-200/50">Loading...</p>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="relative min-h-screen">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10">
              <svg className="h-10 w-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">403 — Access Denied</h1>
            <p className="mt-2 text-blue-200/50">This area is restricted to authorized administrators only.</p>
            <a href="/" className="btn-glow mt-6 inline-block rounded-xl px-6 py-2.5 text-sm font-medium text-white">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl">Admin Hub</h1>
          <p className="text-blue-200/50">Manage payment requests and monitor platform growth</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-blue-950/40 backdrop-blur-xl">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Payment Requests</h2>
                <p className="text-sm text-blue-200/50">
                  {requests.length} pending
                  {requests.length === 1 ? " request" : " requests"}
                </p>
              </div>
              {requests.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-blue-200/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-3 text-sm text-blue-200/30">No pending payment requests</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-xs uppercase text-blue-200/40">
                      <tr>
                        <th className="px-6 py-3 font-medium">User</th>
                        <th className="px-6 py-3 font-medium">Plan</th>
                        <th className="px-6 py-3 font-medium">TID</th>
                        <th className="px-6 py-3 font-medium">Method</th>
                        <th className="px-6 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {requests.map((req) => (
                        <tr key={req.id} className="transition-colors hover:bg-blue-950/40">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{req.email}</div>
                            <div className="text-xs text-blue-200/40">{req.accountHolderName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              req.selectedPlan === "Elite"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-blue-500/10 text-blue-400"
                            }`}>
                              {req.selectedPlan}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-blue-200/60">{req.transactionId}</td>
                          <td className="px-6 py-4">
                            <span className="inline-block rounded-full border border-white/10 bg-blue-950/30 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-200/60">
                              {req.paymentMethod || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(req)}
                                disabled={actionLoading === req.id}
                                className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-50"
                              >
                                {actionLoading === req.id ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleReject(req)}
                                disabled={actionLoading === req.id}
                                className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 transition-all hover:bg-rose-500/20 disabled:opacity-50"
                              >
                                {actionLoading === req.id ? "..." : "Reject"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-white/10 bg-blue-950/40 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white">Live Metrics</h2>
              <p className="mb-5 text-sm text-blue-200/50">Platform growth overview</p>
              <div className="space-y-4">
                {[
                  { label: "Registered Users", value: metrics.users, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "blue" },
                  { label: "AI Solutions Generated", value: metrics.scannedSolutions, icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z", color: "cyan" },
                  { label: "Flashcard Decks", value: metrics.flashcardDecks, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "indigo" },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-blue-950/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        m.color === "blue" ? "bg-blue-500/10" : m.color === "cyan" ? "bg-cyan-500/10" : "bg-indigo-500/10"
                      }`}>
                        <svg className={`h-5 w-5 ${
                          m.color === "blue" ? "text-blue-400" : m.color === "cyan" ? "text-cyan-400" : "text-indigo-400"
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={m.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{m.value.toLocaleString()}</p>
                        <p className="text-xs text-blue-200/40">{m.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
