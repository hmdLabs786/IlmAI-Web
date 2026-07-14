"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { db, ADMIN_EMAIL } from "@/lib/firebase";
import {
  collection, query, where, onSnapshot, doc, updateDoc,
  getCountFromServer, getDocs, orderBy, limit as fbLimit,
  Unsubscribe, DocumentData, Timestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import ParticleField from "@/app/components/ParticleField";

interface PaymentRequest extends DocumentData {
  id: string;
  accountHolderName: string;
  selectedPlan: string;
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
  phoneNumber?: string;
  bankAccountNumber?: string;
  uid: string;
  email: string;
  status: string;
  createdAt?: Timestamp;
}

interface UserData extends DocumentData {
  uid: string;
  email: string;
  displayName?: string;
  subscriptionTier?: string;
  createdAt?: Timestamp;
  lastLogin?: Timestamp;
}

interface Metrics {
  totalUsers: number;
  freeUsers: number;
  proUsers: number;
  eliteUsers: number;
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
  totalRevenue: number;
  scannedSolutions: number;
  flashcardDecks: number;
}

type Tab = "dashboard" | "users" | "payments";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0, freeUsers: 0, proUsers: 0, eliteUsers: 0,
    pendingPayments: 0, approvedPayments: 0, rejectedPayments: 0,
    totalRevenue: 0, scannedSolutions: 0, flashcardDecks: 0,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { if (!loading) setAuthorized(user?.email === ADMIN_EMAIL); }, [user, loading]);

  // Listen to all payment requests
  useEffect(() => {
    if (!authorized) return;
    const q = query(collection(db, "payment_requests"), orderBy("createdAt", "desc"));
    const unsub: Unsubscribe = onSnapshot(q, (snap) => {
      const data: PaymentRequest[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() } as PaymentRequest));
      setPayments(data);
    }, (err) => console.error("Error fetching payments:", err));
    return () => unsub();
  }, [authorized]);

  // Listen to all users
  useEffect(() => {
    if (!authorized) return;
    const unsub: Unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
      const data: UserData[] = [];
      snap.forEach((d) => data.push({ uid: d.id, ...d.data() } as UserData));
      setUsers(data);
    }, (err) => console.error("Error fetching users:", err));
    return () => unsub();
  }, [authorized]);

  // Compute metrics
  const fetchMetrics = useCallback(async () => {
    if (!authorized) return;
    try {
      const [usersSnap, solutionsSnap, decksSnap, pendingSnap, approvedSnap, rejectedSnap] = await Promise.all([
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "scanned_solutions")),
        getCountFromServer(collection(db, "flashcard_decks")),
        getCountFromServer(query(collection(db, "payment_requests"), where("status", "==", "pending"))),
        getCountFromServer(query(collection(db, "payment_requests"), where("status", "==", "approved"))),
        getCountFromServer(query(collection(db, "payment_requests"), where("status", "==", "rejected"))),
      ]);
      setMetrics({
        totalUsers: usersSnap.data().count,
        freeUsers: users.filter((u) => !u.subscriptionTier || u.subscriptionTier === "Free").length,
        proUsers: users.filter((u) => u.subscriptionTier === "Pro").length,
        eliteUsers: users.filter((u) => u.subscriptionTier === "Elite").length,
        pendingPayments: pendingSnap.data().count,
        approvedPayments: approvedSnap.data().count,
        rejectedPayments: rejectedSnap.data().count,
        totalRevenue: (approvedSnap.data().count * 325),
        scannedSolutions: solutionsSnap.data().count,
        flashcardDecks: decksSnap.data().count,
      });
    } catch (err) { console.error("Error fetching metrics:", err); }
  }, [authorized, users]);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const handleApprove = async (req: PaymentRequest) => {
    setActionLoading(req.id);
    try {
      await updateDoc(doc(db, "payment_requests", req.id), { status: "approved" });
      await updateDoc(doc(db, "users", req.uid), { subscriptionTier: req.selectedPlan });
      toast.success(`Approved ${req.selectedPlan} for ${req.email}`);
    } catch (err: any) { toast.error(err.message || "Failed to approve"); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (req: PaymentRequest) => {
    setActionLoading(req.id);
    try {
      await updateDoc(doc(db, "payment_requests", req.id), { status: "rejected" });
      toast.success(`Rejected request from ${req.email}`);
    } catch (err: any) { toast.error(err.message || "Failed to reject"); }
    finally { setActionLoading(null); }
  };

  const filteredPayments = payments.filter((p) => paymentFilter === "all" || p.status === paymentFilter);
  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.email?.toLowerCase().includes(q) || u.displayName?.toLowerCase().includes(q);
  });

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Users", count: users.length },
    { id: "payments", label: "Payments", count: metrics.pendingPayments },
  ];

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
      <p className="animate-pulse text-sm text-slate-400">Loading...</p>
    </div>
  );

  if (authorized === false) return (
    <div className="relative min-h-screen">
      <ParticleField />
      <Navbar />
      <div className="relative z-10 flex min-h-[80vh] items-center justify-center px-4">
        <div className="glass-strong w-full max-w-md rounded-3xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10">
            <svg className="h-10 w-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-white">403 — Access Denied</h1>
          <p className="mt-2 text-sm text-slate-400">This area is restricted to authorized administrators only.</p>
          <a href="/" className="btn-luxury mt-6 inline-block rounded-xl px-6 py-2.5 text-sm font-medium text-white">Back to Home</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-16 md:pb-0">
      <ParticleField />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">Administration</div>
            <h1 className="mt-3 text-2xl font-bold text-white md:text-3xl">Admin <span className="text-shimmer">Hub</span></h1>
          </div>
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  tab === t.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "glass text-slate-300 hover:text-white"
                }`}>
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span className="ml-1.5 rounded-full bg-blue-500/20 px-1.5 py-0.5 text-xs text-blue-300">{t.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Dashboard ── */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Users", value: metrics.totalUsers, color: "blue", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
                { label: "Pro Users", value: metrics.proUsers, color: "blue", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                { label: "Elite Users", value: metrics.eliteUsers, color: "blue", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
                { label: "Est. Revenue", value: `Rs. ${metrics.totalRevenue.toLocaleString()}`, color: "blue", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              ].map((m, i) => (
                <div key={i} className="glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={m.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{typeof m.value === "number" ? m.value.toLocaleString() : m.value}</p>
                      <p className="text-xs text-slate-400">{m.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Solutions Generated", value: metrics.scannedSolutions },
                { label: "Flashcard Decks", value: metrics.flashcardDecks },
                { label: "Pending Payments", value: metrics.pendingPayments },
                { label: "Approved Payments", value: metrics.approvedPayments },
              ].map((m, i) => (
                <div key={i} className="glass rounded-2xl p-4">
                  <p className="text-xl font-bold text-white">{m.value.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Subscription breakdown */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-4 text-sm font-semibold text-white">Subscription Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: "Free", count: metrics.freeUsers, total: metrics.totalUsers, color: "bg-slate-500" },
                  { label: "Pro", count: metrics.proUsers, total: metrics.totalUsers, color: "bg-blue-500" },
                  { label: "Elite", count: metrics.eliteUsers, total: metrics.totalUsers, color: "bg-blue-400" },
                ].map((t) => (
                  <div key={t.label}>
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span>{t.label}</span>
                      <span>{t.count} ({t.total > 0 ? Math.round((t.count / t.total) * 100) : 0}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-navy-800">
                      <div className={`${t.color} h-full rounded-full transition-all duration-700`} style={{ width: `${t.total > 0 ? (t.count / t.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {tab === "users" && (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input min-h-[44px] w-full rounded-xl px-4 text-sm" placeholder="Search users by name or email..." />
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">All Users ({filteredUsers.length})</h2>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-sm text-slate-500">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/5 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">User</th>
                        <th className="px-6 py-3 font-medium">Plan</th>
                        <th className="px-6 py-3 font-medium">Joined</th>
                        <th className="px-6 py-3 font-medium">UID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map((u) => (
                        <tr key={u.uid} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{u.displayName || "—"}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`pill ${!u.subscriptionTier || u.subscriptionTier === "Free" ? "bg-slate-500/10 text-slate-400" : u.subscriptionTier === "Pro" ? "pill-pending" : "bg-blue-400/10 text-blue-300"}`}>
                              {u.subscriptionTier || "Free"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-600">{u.uid.slice(0, 12)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Payments ── */}
        {tab === "payments" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {["pending", "approved", "rejected", "all"].map((f) => (
                <button key={f} onClick={() => setPaymentFilter(f)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-all duration-300 ${
                    paymentFilter === f ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "glass text-slate-300 hover:text-white"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Payment Requests ({filteredPayments.length})</h2>
              </div>
              {filteredPayments.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-sm text-slate-500">No payment requests</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/5 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">User</th>
                        <th className="px-6 py-3 font-medium">Plan</th>
                        <th className="px-6 py-3 font-medium">TID</th>
                        <th className="px-6 py-3 font-medium">Method</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        {paymentFilter === "pending" && <th className="px-6 py-3 font-medium">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredPayments.map((req) => (
                        <tr key={req.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{req.email}</div>
                            <div className="text-xs text-slate-500">{req.accountHolderName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`pill ${req.selectedPlan === "Elite" ? "bg-blue-400/10 text-blue-300" : "pill-pending"}`}>{req.selectedPlan}</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-400">{req.transactionId}</td>
                          <td className="px-6 py-4">
                            <span className="pill bg-white/5 text-slate-400 capitalize">{req.paymentMethod || "N/A"}</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">{req.paymentDate}</td>
                          <td className="px-6 py-4">
                            <span className={`pill ${req.status === "pending" ? "pill-pending" : req.status === "approved" ? "pill-approved" : "pill-rejected"}`}>{req.status}</span>
                          </td>
                          {paymentFilter === "pending" && (
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => handleApprove(req)} disabled={actionLoading === req.id}
                                  className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all duration-300 hover:bg-emerald-500/20 disabled:opacity-50">
                                  {actionLoading === req.id ? "..." : "Approve"}
                                </button>
                                <button onClick={() => handleReject(req)} disabled={actionLoading === req.id}
                                  className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 transition-all duration-300 hover:bg-rose-500/20 disabled:opacity-50">
                                  {actionLoading === req.id ? "..." : "Reject"}
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
