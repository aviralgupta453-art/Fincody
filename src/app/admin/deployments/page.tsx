"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Bot, Sparkles, Shield, ArrowLeft, FolderLock, CheckCircle2, 
  AlertTriangle, X, Loader2, GitBranch, GitPullRequest, Code, 
  Terminal, Eye, Play, History, Check, RefreshCw, Smartphone, 
  Tablet as TabletIcon, Monitor, ExternalLink, RefreshCw as RollbackIcon, Plus
} from "lucide-react";
import FincodyLogo from "@/components/FincodyLogo";

interface ReviewItem {
  id: string;
  branchName: string;
  commitMessage: string;
  author: string;
  date: string;
  status: string;
  previewUrl: string;
  diff: string;
  logs: string;
}

interface HistoryItem {
  id: string;
  commitMessage: string;
  author: string;
  date: string;
  status: string;
  environment: string;
  url: string;
}

export default function DeploymentsGateway() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Review Dashboard States
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "diff" | "logs" | "details">("preview");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [refreshing, setRefreshing] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  // New Feature Branch Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBranchName, setNewBranchName] = useState("feature/");
  const [newCommitMsg, setNewCommitMsg] = useState("");

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const isAdmin = localStorage.getItem(`fincody_is_admin_${session.user.id}`) === "true";
        if (isAdmin || session.user.email?.endsWith("@fincody.com")) {
          setAdminUser(session.user);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Fetch reviews & deployments data
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/deployments");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setHistory(data.history || []);
        if (data.reviews && data.reviews.length > 0) {
          // If no review selected yet or old one gone, select first
          setSelectedReview(prev => {
            const exists = data.reviews.find((r: any) => r.id === prev?.id);
            return exists || data.reviews[0];
          });
        } else {
          setSelectedReview(null);
        }
      }
    } catch (err) {
      console.error("Error fetching deployments data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchData();
    }
  }, [adminUser]);

  // Auth Submit handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Authenticate admin check
        localStorage.setItem(`fincody_is_admin_${data.user.id}`, "true");
        setAdminUser(data.user);
        setAuthSuccess("Authenticated successfully!");
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid administrative credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignOut = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    setReviews([]);
    setSelectedReview(null);
  };

  // Actions: Approve, Reject, Rollback, Create
  const handleApprove = async (id: string) => {
    if (!window.confirm("Approve feature? This will merge branch, push to GitHub, and trigger a Vercel Production deployment!")) return;
    setProcessingAction("approve");
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", id })
      });
      if (res.ok) {
        alert("Deployment Approved! Feature merged and pushed. Triggering Vercel production rebuild.");
        fetchData();
      } else {
        const err = await res.json();
        alert(`Approval failed: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Reject feature? This keeps the branch active but flags the change as rejected.")) return;
    setProcessingAction("reject");
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", id })
      });
      if (res.ok) {
        alert("Feature branch rejected. Marked as Rejected for further revisions.");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleRollback = async (id: string) => {
    if (!window.confirm("Are you sure you want to roll back the live production website to this deployment version?")) return;
    setProcessingAction("rollback");
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rollback", id })
      });
      if (res.ok) {
        alert("Rollback initiated. Re-pointing Vercel production alias mapping.");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newCommitMsg.trim()) return;
    setProcessingAction("create");
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_branch",
          branchName: newBranchName,
          commitMessage: newCommitMsg
        })
      });
      if (res.ok) {
        setNewBranchName("feature/");
        setNewCommitMsg("");
        setShowAddForm(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative select-none font-sans">
      {/* Background radial glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <FincodyLogo variant="desktop" />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Deployments Gateway
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/admin"
              className="px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Admin Portal
            </Link>

            {adminUser && (
              <button 
                onClick={handleAdminSignOut}
                className="px-4 py-2 text-xs font-bold text-rose-400 hover:text-white rounded-xl border border-rose-500/20 hover:bg-rose-600/10 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="h-20" />

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative">
        <AnimatePresence mode="wait">
          {!adminUser ? (
            // ================= AUTH GATE =================
            <motion.div
              key="auth-gate"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto my-12"
            >
              <form onSubmit={handleSignIn} className="glass-card rounded-3xl border border-slate-900 p-8 shadow-2xl bg-slate-900/40 backdrop-blur-2xl flex flex-col gap-5 text-center">
                <div className="w-14 h-14 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto">
                  <FolderLock className="w-7 h-7 animate-pulse" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-white">Deployments Gateway Locked</h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Verify administrative credentials to access pending previews, diff audits, and production alias triggers.
                  </p>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 text-left">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> {authError}
                  </div>
                )}

                <div className="flex flex-col gap-3.5 text-left">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Admin Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@fincody.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-blue-500 text-xs text-white placeholder-slate-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Access Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-blue-500 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Authenticate Gate
                </button>
              </form>
            </motion.div>
          ) : (
            // ================= REVIEW DASHBOARD =================
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-8"
            >
              {/* Top Banner Status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
                <div className="text-left">
                  <h2 className="text-xl font-black text-white uppercase tracking-wider">DevOps Gateway Console</h2>
                  <p className="text-xs text-slate-400 mt-1">Audit, test, and approve code deployments before staging shifts to production.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    <Plus className="w-4 h-4" /> Create Feature Branch
                  </button>
                  <button
                    onClick={fetchData}
                    disabled={refreshing}
                    className="p-2 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white cursor-pointer"
                    title="Refresh deployments list"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Create Branch Panel Form */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleCreateBranch} className="p-5 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md flex flex-col sm:flex-row items-end gap-4 text-left">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Branch Name</label>
                        <input
                          type="text"
                          value={newBranchName}
                          onChange={(e) => setNewBranchName(e.target.value)}
                          placeholder="feature/new-feature"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-900 focus:border-blue-500 text-xs text-white focus:outline-none"
                          required
                        />
                      </div>

                      <div className="flex-[2]">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Commit Message</label>
                        <input
                          type="text"
                          value={newCommitMsg}
                          onChange={(e) => setNewCommitMsg(e.target.value)}
                          placeholder="feat: describe the new feature changes..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-900 focus:border-blue-500 text-xs text-white focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={processingAction === "create"}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer shrink-0"
                      >
                        {processingAction === "create" ? "Creating..." : "Checkout & Build"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Review Item Cards */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-left">Pending Reviews ({reviews.length})</span>
                  
                  <div className="flex flex-col gap-3.5">
                    {reviews.map((item) => {
                      const isSelected = selectedReview?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedReview(item)}
                          className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col gap-3 ${
                            isSelected 
                              ? "bg-blue-500/[0.03] border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                              : "bg-slate-900/20 border-slate-900 hover:border-slate-800"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <GitBranch className="w-4 h-4 text-blue-400" />
                              <span className="font-mono text-xs font-black text-white">{item.branchName}</span>
                            </div>
                            
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              item.status === "Ready" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse"
                                : item.status === "Rejected"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 font-semibold line-clamp-2 leading-relaxed">
                            {item.commitMessage}
                          </p>

                          <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2.5 border-t border-slate-900">
                            <span>Author: <strong className="text-slate-400 font-bold">{item.author}</strong></span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      );
                    })}

                    {reviews.length === 0 && (
                      <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500 italic">
                        No pending reviews. Pull request queue is clean!
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Selected Branch Metadata, Preview & Code Diffs */}
                <div className="lg:col-span-8">
                  {selectedReview ? (
                    <div className="glass-card rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col overflow-hidden min-h-[500px]">
                      
                      {/* Sub-tab Navigation */}
                      <div className="px-4 pt-3.5 border-b border-slate-900 flex justify-between items-end bg-slate-950/20">
                        <div className="flex gap-2">
                          {[
                            { id: "preview", label: "Interactive Preview", icon: Eye },
                            { id: "diff", label: "Git Diff", icon: Code },
                            { id: "logs", label: "Build Logs", icon: Terminal },
                            { id: "details", label: "Details", icon: History }
                          ].map((t) => {
                            const isTabActive = activeTab === t.id;
                            return (
                              <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={`px-4 py-2.5 border-b-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isTabActive 
                                    ? "border-blue-500 text-white" 
                                    : "border-transparent text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                <t.icon className="w-3.5 h-3.5" /> {t.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Top corner actions */}
                        <div className="flex gap-2 pb-2">
                          <button
                            onClick={() => handleReject(selectedReview.id)}
                            disabled={processingAction !== null}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 hover:text-rose-400 text-xs font-bold cursor-pointer transition-all shrink-0"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(selectedReview.id)}
                            disabled={processingAction !== null || selectedReview.status !== "Ready"}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                              selectedReview.status === "Ready" 
                                ? "bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/10" 
                                : "bg-slate-800 text-slate-500 cursor-not-allowed"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" /> Approve Production
                          </button>
                        </div>
                      </div>

                      {/* Tab Panels */}
                      <div className="p-6 flex-1 flex flex-col">
                        
                        {/* 1. Live Interactive Preview */}
                        {activeTab === "preview" && (
                          <div className="flex-1 flex flex-col gap-4">
                            <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                              <div className="flex gap-1">
                                {[
                                  { id: "desktop", label: "Desktop", icon: Monitor },
                                  { id: "tablet", label: "Tablet (768px)", icon: TabletIcon },
                                  { id: "mobile", label: "Mobile (375px)", icon: Smartphone }
                                ].map((d) => (
                                  <button
                                    key={d.id}
                                    onClick={() => setPreviewDevice(d.id as any)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                                      previewDevice === d.id 
                                        ? "bg-slate-800 text-white" 
                                        : "text-slate-500 hover:text-slate-300"
                                    }`}
                                  >
                                    <d.icon className="w-3.5 h-3.5" /> {d.label}
                                  </button>
                                ))}
                              </div>

                              <a 
                                href={selectedReview.previewUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              >
                                Open external <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                            {/* Dynamic Live Responsive iframe */}
                            <div className="flex-1 flex items-center justify-center p-4 bg-slate-950/20 rounded-2xl border border-slate-900 min-h-[380px]">
                              <motion.div
                                animate={{
                                  width: previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "768px" : "375px",
                                  maxWidth: "100%"
                                }}
                                className="h-[400px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-900"
                              >
                                <iframe 
                                  src="/" // Loads the current site locally, allowing live interactive audit testing
                                  className="w-full h-full bg-slate-900 border-none"
                                  title="Feature Preview"
                                />
                              </motion.div>
                            </div>
                          </div>
                        )}

                        {/* 2. Code Diff Viewer */}
                        {activeTab === "diff" && (
                          <div className="flex-1 text-left font-mono text-[11px] leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto max-h-[420px]">
                            {selectedReview.diff.split("\n").map((line, idx) => {
                              const isAddition = line.startsWith("+");
                              const isDeletion = line.startsWith("-");
                              const isHeader = line.startsWith("diff") || line.startsWith("index") || line.startsWith("---") || line.startsWith("+++") || line.startsWith("@@");
                              return (
                                <div 
                                  key={idx}
                                  className={`${
                                    isAddition 
                                      ? "bg-emerald-950/30 text-emerald-400 px-1 border-l-2 border-emerald-500" 
                                      : isDeletion 
                                      ? "bg-rose-950/30 text-rose-400 px-1 border-l-2 border-rose-500"
                                      : isHeader
                                      ? "text-blue-400 font-bold"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {line}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* 3. Build Logs */}
                        {activeTab === "logs" && (
                          <div className="flex-1 text-left font-mono text-[11px] leading-relaxed bg-slate-950 p-5 rounded-xl border border-slate-900 overflow-y-auto max-h-[420px] text-slate-300">
                            {selectedReview.logs.split("\n").map((log, idx) => (
                              <div key={idx} className="py-0.5">
                                <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 4. Release History / Details */}
                        {activeTab === "details" && (
                          <div className="flex-1 flex flex-col gap-5 text-left text-xs">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-900 pb-4">
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Developer</span>
                                <span className="text-sm font-bold text-white block mt-0.5">{selectedReview.author}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Creation Date</span>
                                <span className="text-sm font-bold text-white block mt-0.5">{selectedReview.date}</span>
                              </div>
                            </div>

                            <div className="border-b border-slate-900 pb-4">
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Deployment ID</span>
                              <span className="text-xs font-mono font-bold text-blue-400 block mt-1">{selectedReview.id}</span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Staging Target URL</span>
                              <a 
                                href={selectedReview.previewUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-xs text-blue-400 hover:underline font-mono mt-1 block flex items-center gap-1.5"
                              >
                                {selectedReview.previewUrl} <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  ) : (
                    <div className="glass-card rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center p-12 text-slate-500 italic h-[450px]">
                      Select a pending review from the left sidebar to audit branch code, compile logs, and test interactive preview dimensions.
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Section: Deployment History */}
              <div className="flex flex-col gap-4 border-t border-slate-900 pt-8 mt-4">
                <div className="text-left">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Production Release History</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Choose a past stable build target to roll back aliases immediately.</p>
                </div>

                <div className="flex flex-col gap-3.5">
                  {history.map((dep) => (
                    <div 
                      key={dep.id} 
                      className="p-4 rounded-xl border border-slate-900 bg-slate-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                    >
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{dep.commitMessage}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider">
                            {dep.environment}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          <span>Revision: <strong className="text-slate-400 font-mono">{dep.id.slice(0, 8)}</strong></span>
                          <span>•</span>
                          <span>Author: <strong className="text-slate-400 font-bold">{dep.author}</strong></span>
                          <span>•</span>
                          <span>Released {dep.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a 
                          href={dep.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          Visit Url <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleRollback(dep.id)}
                          className="px-3.5 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-600/10 text-blue-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <RollbackIcon className="w-3.5 h-3.5" /> Rollback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
