"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Calendar, 
  Compass, 
  FileText, 
  DollarSign, 
  Activity, 
  HelpCircle,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  TrendingDown,
  Plus,
  Trash2,
  Lock,
  Download,
  AlertTriangle,
  Upload,
  CheckCircle2,
  CreditCard,
  Building,
  LogOut,
  Send,
  Sun,
  Moon,
  Loader2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

// TypeScript Interfaces
interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface Subscription {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  status: "active" | "canceled";
  category: string;
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

interface Insurance {
  id: string;
  type: string;
  provider: string;
  premium: number;
  coverage: number;
  renewalDate: string;
}

interface DocumentFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: string;
}

export default function Dashboard() {
  // Supabase Auth State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Navigation State
  const [activeTab, setActiveTab] = useState<
    "command" | "goals" | "investments" | "subscriptions" | "insurance" | "vault" | "decisions"
  >("command");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Theme Switching State
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  // Auth Handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setUser(data.user);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess("Registration successful! Check your email inbox for the verification link.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Notifications State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "AI Alert: Redundant insurance premium found for Auto policy.", unread: true },
    { id: 2, text: "Goal Milestone: You have reached 80% of your Emergency Fund.", unread: true },
    { id: 3, text: "Upcoming Bill: Netflix renewal is due in 3 days (₹649).", unread: false }
  ]);

  // AI Chat Drawer State
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { 
      sender: "ai", 
      text: "Hello! I am your Fincody Life CFO. Ask me any question about your net worth, goals, subscriptions, or life decisions.", 
      timestamp: "18:44" 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: "1", name: "Netflix Premium", price: 649, interval: "monthly", status: "active", category: "Entertainment" },
    { id: "2", name: "Spotify Duo", price: 179, interval: "monthly", status: "active", category: "Music" },
    { id: "3", name: "AWS Cloud Sandbox", price: 2150, interval: "monthly", status: "active", category: "Development" },
    { id: "4", name: "Adobe Creative Cloud", price: 4220, interval: "monthly", status: "active", category: "Design" },
    { id: "5", name: "GitHub Copilot", price: 820, interval: "monthly", status: "active", category: "Development" },
    { id: "6", name: "ChatGPT Plus", price: 1650, interval: "monthly", status: "active", category: "AI Tools" }
  ]);

  // Goals State
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", name: "Emergency Fund", target: 450000, current: 380000, deadline: "Dec 2026" },
    { id: "2", name: "Tesla Model Y Downpayment", target: 1200000, current: 450000, deadline: "Jun 2027" },
    { id: "3", name: "Retirement Portfolio", target: 50000000, current: 845000, deadline: "Aug 2045" }
  ]);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");

  // Insurance State
  const [insurancePolicies, setInsurancePolicies] = useState<Insurance[]>([
    { id: "1", type: "Health Insurance", provider: "HDFC Ergo Optima", premium: 1450, coverage: 1500000, renewalDate: "15 Oct 2026" },
    { id: "2", type: "Term Life Insurance", provider: "Max Life Smart Secure", premium: 1800, coverage: 20000000, renewalDate: "05 Nov 2026" },
    { id: "3", type: "Auto Insurance (Sedan)", provider: "ICICI Lombard", premium: 1100, coverage: 1200000, renewalDate: "12 Aug 2026" }
  ]);
  
  // Document Vault State
  const [documents, setDocuments] = useState<DocumentFile[]>([
    { id: "1", name: "Tax_Assessment_FY25.pdf", size: "2.4 MB", uploadedAt: "May 10, 2026", type: "PDF" },
    { id: "2", name: "Health_Policy_Document.pdf", size: "4.8 MB", uploadedAt: "Jun 02, 2026", type: "PDF" },
    { id: "3", name: "Term_Insurance_Policy.pdf", size: "5.1 MB", uploadedAt: "Jun 12, 2026", type: "PDF" },
    { id: "4", name: "PAN_Card_Copy.jpeg", size: "850 KB", uploadedAt: "Jan 15, 2026", type: "Image" }
  ]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Future Simulator interactive state
  const [simSalaryRate, setSimSalaryRate] = useState(12);
  const [simSavingsRate, setSimSavingsRate] = useState(35);
  const [simMba, setSimMba] = useState(0);
  const [simHouse, setSimHouse] = useState(0);

  // Dynamic Chart Data Generator
  const getProjectionsChartData = () => {
    const data = [];
    let netWorth = 38.45; // Starting Net Worth (₹ Lakhs)
    let baseWorth = 38.45;
    
    const monthlyIncome = 2.0; // ₹2 Lakhs/mo starting
    const growth = 1.08; // 8% asset return

    for (let year = 1; year <= 15; year++) {
      // Base Case
      const baseSavings = (monthlyIncome * 12) * Math.pow(1.08, year - 1) * 0.25;
      baseWorth = (baseWorth + baseSavings) * growth;

      // Simulated Case
      const simulatedIncome = (monthlyIncome * 12) * Math.pow(1 + (simSalaryRate / 100), year - 1);
      let simulatedSavings = simulatedIncome * (simSavingsRate / 100);

      if (simMba > 0) {
        if (year === 2 || year === 3) {
          netWorth -= (simMba / 2);
          simulatedSavings = 0;
        } else if (year > 3) {
          // Bumps income post MBA
          simulatedSavings = (simulatedIncome * 1.5) * (simSavingsRate / 100);
        }
      }

      if (simHouse > 0 && year === simHouse) {
        netWorth -= 15; // ₹15L Downpayment
      }

      netWorth = (netWorth + simulatedSavings) * growth;

      data.push({
        name: `Yr ${year}`,
        "Standard": Math.round(baseWorth),
        "Fincody Projections": Math.max(-20, Math.round(netWorth))
      });
    }
    return data;
  };

  const chartData = getProjectionsChartData();

  // Investment Allocation Data
  const assetAllocationData = [
    { name: "Stocks & Mutual Funds", value: 2450000, color: "#3B82F6" },
    { name: "Cryptocurrency", value: 350000, color: "#A855F7" },
    { name: "Gold & Commodities", value: 450000, color: "#EAB308" },
    { name: "Liquid Cash/FDs", value: 595210, color: "#10B981" }
  ];

  // Subscriptions calculations
  const activeSubscriptions = subscriptions.filter(sub => sub.status === "active");
  const monthlySubscriptionSpend = activeSubscriptions.reduce((acc, curr) => acc + curr.price, 0);

  // Goal adding/updating
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName || !newGoalTarget) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: newGoalName,
      target: parseFloat(newGoalTarget),
      current: 0,
      deadline: newGoalDeadline || "No Date"
    };

    setGoals([...goals, newGoal]);
    setNewGoalName("");
    setNewGoalTarget("");
    setNewGoalDeadline("");
  };

  const handleContributeToGoal = (id: string, amount: number) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const nextVal = g.current + amount;
        return { ...g, current: nextVal > g.target ? g.target : nextVal };
      }
      return g;
    }));
  };

  // Subscription Cancellation Simulator
  const handleToggleSub = (id: string) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        const nextStatus = sub.status === "active" ? "canceled" : "active";
        return { ...sub, status: nextStatus };
      }
      return sub;
    }));

    // Trigger Notification
    const toggledSub = subscriptions.find(s => s.id === id);
    if (toggledSub) {
      const isCanceling = toggledSub.status === "active";
      const newNotif = {
        id: Date.now(),
        text: `AI Agent: ${toggledSub.name} has been ${isCanceling ? "marked for cancellation" : "reactivated"}.`,
        unread: true
      };
      setNotifications([newNotif, ...notifications]);
    }
  };

  // Document Upload Simulator
  const handleUploadDocument = () => {
    setUploadingDoc(true);
    setTimeout(() => {
      const newDoc: DocumentFile = {
        id: Date.now().toString(),
        name: `Uploaded_Policy_${Math.floor(Math.random() * 1000)}.pdf`,
        size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
        uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        type: "PDF"
      };
      setDocuments([newDoc, ...documents]);
      setUploadingDoc(false);
      
      // Auto notification
      setNotifications([
        { id: Date.now(), text: `Vault: New encrypted file ${newDoc.name} processed and stored.`, unread: true },
        ...notifications
      ]);
    }, 1500);
  };

  // AI Chat Handlers
  const handleSendChat = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    // Formulate smart responses
    setTimeout(() => {
      let replyText = "I have analyzed your request. Fincody AI model predicts a stable path. Let me know how I can adjust details.";
      const query = text.toLowerCase();
      
      if (query.includes("car") || query.includes("lakh")) {
        replyText = "Analyzing ₹15 Lakh car purchase. Based on ₹72k/mo savings, you can afford it. However, your Emergency Fund buffer drops to 1.3 months. I recommend waiting 4 months to secure your equity portfolio.";
      } else if (query.includes("mba") || query.includes("career")) {
        replyText = "Simulating a ₹30 Lakh MBA vs current Software Engineer path. Post-MBA salary is projected to rise 65%, reaching a breakeven payback in 4.3 years. It contributes a net-worth increase of +₹1.48 Crores by Year 10.";
      } else if (query.includes("netflix") || query.includes("save") || query.includes("spotify")) {
        replyText = `Your active subscriptions total ${activeSubscriptions.length} services, costing ₹${monthlySubscriptionSpend}/month. Canceling Netflix & Spotify saves ₹828/mo. If auto-invested in equity index fund, this accumulates to ₹1.9 Lakhs in 10 years and ₹28.9 Lakhs in 30 years.`;
      } else if (query.includes("net worth") || query.includes("assets")) {
        replyText = `Your current Net Worth is ₹38,45,210. Asset breakdown: Stocks (₹24.5L), Cash (₹5.9L), Gold (₹4.5L), Crypto (₹3.5L). Portfolio health score: 94/100 (Excellent).`;
      } else if (query.includes("insurance") || query.includes("vault")) {
        replyText = "I found 3 insurance policies. Note: Your ICICI Auto Insurance renewal is coming up in August. There is an overlap in premium payouts for auto. I recommend auditing redundancies.";
      }

      const aiMsg: Message = {
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handlePredefinedQuestion = (q: string) => {
    handleSendChat(q);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm font-semibold tracking-wide text-slate-400">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-x-hidden flex items-center justify-center p-6 transition-colors duration-300 relative">
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

        <div className="w-full max-w-md glass-card rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-2xl p-8 relative z-10 bg-slate-950/20 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={theme === "dark" ? "/logo_dark.png" : "/logo_light.png"} 
              alt="Fincody Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>

          <h2 className="text-2xl font-extrabold text-[var(--text-color)] tracking-tight mb-2">
            {authMode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-xs text-[var(--text-subtitle)] mb-6">
            {authMode === "signin" 
              ? "Sign in to access your AI-powered life dashboard" 
              : "Consolidate your life admin and start simulating your future"}
          </p>

          {authError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 flex items-start gap-2.5 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-start gap-2.5 text-left">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          <form onSubmit={authMode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
            <div className="text-left">
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
              />
            </div>

            <div className="text-left">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-500 block">Password</label>
                {authMode === "signin" && (
                  <button 
                    type="button"
                    onClick={() => {
                      setAuthError("Password reset is currently disabled. Please contact support.");
                    }}
                    className="text-[10px] font-bold text-blue-500 hover:text-blue-400"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              {authMode === "signin" ? "Sign In" : "Sign Up"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-[var(--border-color)] pt-6 text-xs text-[var(--text-subtitle)]">
            {authMode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthError("");
                    setAuthSuccess("");
                  }}
                  className="font-bold text-blue-500 hover:text-blue-400 cursor-pointer"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setAuthMode("signin");
                    setAuthError("");
                    setAuthSuccess("");
                  }}
                  className="font-bold text-blue-500 hover:text-blue-400 cursor-pointer"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex flex-col md:flex-row relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden h-16 glass-panel border-b border-[var(--border-color)] flex items-center justify-between px-6 z-30">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src={theme === "dark" ? "/logo_dark.png" : "/logo_light.png"} 
            alt="Fincody Logo" 
            className="h-9 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1 rounded-lg border border-[var(--border-color)] text-[var(--text-subtitle)]"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-[var(--text-subtitle)] hover:text-[var(--text-color)]"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r border-[var(--border-color)] bg-[var(--nav-bg)] backdrop-blur-xl flex flex-col justify-between py-6 px-4 shrink-0 transition-transform duration-300 md:translate-x-0 md:relative md:flex z-30 ${
        mobileSidebarOpen ? "translate-x-0 fixed inset-y-0 left-0" : "-translate-x-full fixed inset-y-0 left-0"
      }`}>
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center justify-between px-3">
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src={theme === "dark" ? "/logo_dark.png" : "/logo_light.png"} 
                alt="Fincody Logo" 
                className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-[var(--text-subtitle)] hover:text-[var(--text-color)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {[
              { id: "command", icon: Sparkles, label: "Command Center" },
              { id: "goals", icon: Compass, label: "Goal Engine" },
              { id: "investments", icon: Activity, label: "Investments" },
              { id: "subscriptions", icon: Calendar, label: "Subscriptions" },
              { id: "insurance", icon: Shield, label: "Insurance Vault" },
              { id: "vault", icon: FileText, label: "Document Vault" },
              { id: "decisions", icon: HelpCircle, label: "Decision Simulator" }
            ].map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    activeTab === link.id
                      ? "bg-blue-600/10 border-blue-500/20 text-blue-500 dark:text-blue-400"
                      : "bg-transparent border-transparent text-[var(--text-subtitle)] hover:text-[var(--text-color)] hover:bg-slate-500/5"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile section */}
        <div className="flex flex-col gap-4 border-t border-[var(--border-color)] pt-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-blue-400">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "AV"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-[var(--text-color)] truncate">
                {user?.email ? user.email.split("@")[0] : "User"}
              </p>
              <p className="text-xs text-[var(--text-subtitle)] truncate">
                {user?.email ?? "no-email@fincody.com"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-[var(--text-subtitle)] hover:text-rose-400 py-2 border border-[var(--border-color)] rounded-xl hover:bg-rose-500/5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* Workspace Top Header */}
        <header className="h-20 border-b border-[var(--border-color)] flex items-center justify-between px-6 md:px-8 shrink-0 relative bg-slate-950/5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-color)] capitalize">
              {activeTab === "command" ? "Command Center" : activeTab + " Engine"}
            </h2>
            <div className="hidden sm:flex items-center gap-1 bg-[#10b981]/10 text-emerald-500 dark:text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Connected
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/10 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-all hidden md:block"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Smart Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/5 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-all relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 shadow shadow-blue-500/50" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl shadow-2xl p-4 flex flex-col gap-3 z-50 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                      <span className="text-xs font-bold text-[var(--text-subtitle)] uppercase tracking-wider">Alert Center</span>
                      <button 
                        onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))}
                        className="text-[10px] text-blue-500 dark:text-blue-400 hover:underline font-bold"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                            n.unread ? "bg-blue-500/5 border-blue-500/10 text-[var(--text-color)] font-medium" : "bg-slate-900/10 border-[var(--border-color)] text-[var(--text-subtitle)]"
                          }`}
                        >
                          {n.text}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Health Score */}
            <div className="flex items-center gap-2 border border-[var(--border-color)] rounded-xl px-3 py-1.5 bg-slate-900/5">
              <div className="w-7 h-7 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-emerald-500">
                94
              </div>
              <span className="text-xs font-bold text-[var(--text-color)] hidden sm:inline">Score</span>
            </div>
          </div>
        </header>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            
            {/* Command Center */}
            {activeTab === "command" && (
              <motion.div
                key="command"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="flex flex-col gap-6"
              >
                {/* Micro Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Net Worth</div>
                    <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">₹38,45,210</div>
                    <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1 font-bold">
                      +14.2% <TrendingUp className="w-3.5 h-3.5" /> <span className="text-slate-500 font-semibold">this month</span>
                    </div>
                  </div>
                  
                  <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Monthly Savings</div>
                    <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">₹72,450</div>
                    <div className="text-xs text-[var(--text-subtitle)] mt-2 font-semibold">
                      36.2% <span className="text-slate-500">savings rate</span>
                    </div>
                  </div>

                  <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Active Subscriptions</div>
                    <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">₹{monthlySubscriptionSpend.toLocaleString()}</div>
                    <div className="text-xs text-rose-500 mt-2 flex items-center gap-1 font-bold">
                      -2.4% <TrendingDown className="w-3.5 h-3.5" /> <span className="text-slate-500 font-semibold">from last month</span>
                    </div>
                  </div>

                  <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Goal Contributions</div>
                    <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">₹16,75,000</div>
                    <div className="text-xs text-blue-500 mt-2 font-semibold">
                      3 goals <span className="text-slate-500 font-semibold">actively tracked</span>
                    </div>
                  </div>
                </div>

                {/* Net Worth Chart & Asset Allocation */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Chart */}
                  <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-4 text-left">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Asset Growth Over Time</span>
                        <span className="text-xs text-slate-500 block">Values in ₹ Lakhs</span>
                      </div>
                      <div className="flex gap-4 text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-[var(--text-subtitle)]"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Standard Path</span>
                        <span className="flex items-center gap-1.5 text-blue-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Fincody AI Path</span>
                      </div>
                    </div>
                    <div className="w-full h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                          <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ 
                              background: "var(--bg-color)", 
                              border: "1px solid var(--border-color)", 
                              borderRadius: "12px", 
                              color: "var(--text-color)" 
                            }} 
                          />
                          <Area type="monotone" dataKey="Standard" stroke="#475569" strokeWidth={1.5} fill="transparent" />
                          <Area type="monotone" dataKey="Fincody Projections" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#chartGrad2)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Asset Allocation Pie Chart */}
                  <div className="lg:col-span-4 glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col justify-between text-left">
                    <div className="border-b border-[var(--border-color)] pb-3">
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Asset Allocation</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">Portfolio consolidation</span>
                    </div>

                    <div className="h-44 flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetAllocationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {assetAllocationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Assets</span>
                        <span className="text-sm font-black text-[var(--text-color)]">₹38.4L</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-xs font-semibold">
                      {assetAllocationData.map((asset, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-slate-400">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                            <span>{asset.name}</span>
                          </div>
                          <span className="text-[var(--text-color)] font-mono">₹{(asset.value / 100000).toFixed(1)}L</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Advice Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] text-left flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                      <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)]">AI Advice Feed</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3 text-xs leading-relaxed">
                        <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[var(--text-color)] block mb-0.5">Asset Rebalancing Alert</span>
                          <p className="text-[var(--text-subtitle)]">Cryptocurrency has expanded to 9.1% of assets. Consider rebalancing 2.5% into liquid FDs to lock gains.</p>
                        </div>
                      </div>
                      
                      <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3 text-xs leading-relaxed">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[var(--text-color)] block mb-0.5">Overlapping Subscriptions Detected</span>
                          <p className="text-[var(--text-subtitle)]">Adobe Creative Cloud usage has dropped below 15% this quarter. Cancellation could save ₹4,220/month.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Goal Milestones */}
                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] text-left flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
                      <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)]">Goal Milestones</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab("goals")}
                        className="text-xs text-blue-500 dark:text-blue-400 hover:underline font-bold"
                      >
                        Manage Engine
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {goals.slice(0, 2).map((goal) => {
                        const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                        return (
                          <div key={goal.id} className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-[var(--text-subtitle)]">{goal.name}</span>
                              <span className="text-[var(--text-color)] font-mono">{percent}% <span className="text-slate-500 font-semibold">({goal.deadline})</span></span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Goal Engine */}
            {activeTab === "goals" && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
              >
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {goals.map((goal) => {
                    const percent = Math.round((goal.current / goal.target) * 100);
                    return (
                      <div 
                        key={goal.id}
                        className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-4 bg-slate-900/5"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-color)]">{goal.name}</h3>
                            <p className="text-xs text-[var(--text-subtitle)] mt-0.5">Target deadline: {goal.deadline}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Current / Target</span>
                            <span className="text-lg font-extrabold text-[var(--text-color)] mt-0.5 block font-mono">
                              ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex flex-col gap-1.5 mt-2">
                          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500" 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                            <span>0% Started</span>
                            <span className="text-blue-500 dark:text-blue-400">{percent}% Completed</span>
                          </div>
                        </div>

                        {/* Contribution Buttons */}
                        <div className="flex flex-wrap gap-2 mt-2 border-t border-[var(--border-color)] pt-4">
                          <button
                            onClick={() => handleContributeToGoal(goal.id, 10000)}
                            className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-slate-900/20 text-xs font-semibold text-[var(--text-subtitle)] hover:text-[var(--text-color)] hover:bg-slate-500/5 transition-all"
                          >
                            + ₹10k Contribution
                          </button>
                          <button
                            onClick={() => handleContributeToGoal(goal.id, 50000)}
                            className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-slate-900/20 text-xs font-semibold text-[var(--text-subtitle)] hover:text-[var(--text-color)] hover:bg-slate-500/5 transition-all"
                          >
                            + ₹50k Contribution
                          </button>
                          <button
                            onClick={() => handleContributeToGoal(goal.id, 100000)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow shadow-blue-500/10 hover:shadow-blue-500/20 transition-all"
                          >
                            + ₹1 Lakh Contribution
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Form to Create Goal */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-4 bg-slate-950/10">
                    <div className="border-b border-[var(--border-color)] pb-3">
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Create Goal</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">Configure new AI targets</span>
                    </div>

                    <form onSubmit={handleAddGoal} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Goal Name</label>
                        <input
                          type="text"
                          required
                          value={newGoalName}
                          onChange={(e) => setNewGoalName(e.target.value)}
                          placeholder="e.g. House downpayment"
                          className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/30 text-[var(--text-color)]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Capital (₹)</label>
                        <input
                          type="number"
                          required
                          value={newGoalTarget}
                          onChange={(e) => setNewGoalTarget(e.target.value)}
                          placeholder="e.g. 1500000"
                          className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/30 text-[var(--text-color)]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline Date</label>
                        <input
                          type="text"
                          required
                          value={newGoalDeadline}
                          onChange={(e) => setNewGoalDeadline(e.target.value)}
                          placeholder="e.g. Jun 2028"
                          className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/30 text-[var(--text-color)]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-1.5 mt-2"
                      >
                        <Plus className="w-4 h-4" /> Create Goal
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Investments */}
            {activeTab === "investments" && (
              <motion.div
                key="investments"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
              >
                <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col justify-between bg-slate-950/10">
                  <div>
                    <div className="border-b border-[var(--border-color)] pb-3">
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Asset Allocation</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">Portfolio consolidation</span>
                    </div>

                    <div className="h-64 flex items-center justify-center relative my-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetAllocationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {assetAllocationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Net Assets</span>
                        <span className="text-2xl font-black text-[var(--text-color)]">₹38.4L</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 font-semibold text-sm border-t border-[var(--border-color)] pt-4">
                    {assetAllocationData.map((asset, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5 text-slate-400">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: asset.color }} />
                          <span>{asset.name}</span>
                        </div>
                        <span className="text-[var(--text-color)] font-mono">₹{asset.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock holdings lists */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-4 bg-slate-900/5">
                    <div className="border-b border-[var(--border-color)] pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Equity Holdings</span>
                        <span className="text-xs text-slate-500 mt-0.5 block">Simulated real-time feeds</span>
                      </div>
                      <button className="px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/5 text-xs font-bold text-blue-500 dark:text-blue-400 flex items-center gap-1 transition-all">
                        <Plus className="w-3.5 h-3.5" /> Add Holding
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {[
                        { symbol: "Reliance Industries", qty: 25, price: "₹2,450", change: "+1.2%", positive: true, currentVal: "₹61,250" },
                        { symbol: "TCS", qty: 15, price: "₹3,840", change: "-0.8%", positive: false, currentVal: "₹57,600" },
                        { symbol: "HDFC Bank", qty: 80, price: "₹1,640", change: "+2.1%", positive: true, currentVal: "₹1,31,200" },
                        { symbol: "Nifty 50 Index Mutual Fund", qty: 450, price: "₹210", change: "+1.6%", positive: true, currentVal: "₹94,500" }
                      ].map((holding, idx) => (
                        <div 
                          key={idx} 
                          className="p-3.5 rounded-xl bg-slate-900/10 border border-[var(--border-color)] flex items-center justify-between hover:border-blue-500/20 transition-colors animate-pulse"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--text-color)] text-sm">{holding.symbol}</span>
                            <span className="text-xs text-slate-500 mt-0.5">{holding.qty} Shares &bull; Market Price {holding.price}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[var(--text-color)] text-sm block font-mono">{holding.currentVal}</span>
                            <span className={`text-xs font-bold mt-0.5 inline-block ${holding.positive ? "text-emerald-500" : "text-rose-500"}`}>
                              {holding.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Subscriptions */}
            {activeTab === "subscriptions" && (
              <motion.div
                key="subscriptions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="flex flex-col gap-6 text-left"
              >
                <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider font-semibold">Total Monthly Subscription Spend</span>
                    <span className="text-3xl font-black text-[var(--text-color)] font-mono">₹{monthlySubscriptionSpend.toLocaleString()} <span className="text-sm text-slate-500 font-medium">/month</span></span>
                  </div>
                  <div className="flex gap-4">
                    <div className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-slate-900/10 text-xs font-bold">
                      <span className="text-slate-500 block">Active services</span>
                      <span className="text-[var(--text-color)] font-bold mt-0.5 block">{activeSubscriptions.length} / {subscriptions.length}</span>
                    </div>
                    <div className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-slate-900/10 text-xs font-bold">
                      <span className="text-slate-500 block">AI savings found</span>
                      <span className="text-emerald-500 font-bold mt-0.5 block">₹4,220/mo projected</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-4 bg-slate-900/5">
                  <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] border-b border-[var(--border-color)] pb-3 block">Configured recurring bills</span>
                  
                  <div className="flex flex-col gap-3">
                    {subscriptions.map((sub) => (
                      <div 
                        key={sub.id} 
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          sub.status === "canceled" 
                            ? "bg-slate-950/10 border-dashed border-[var(--border-color)] opacity-50" 
                            : "bg-[#11172a]/20 border-[var(--border-color)] hover:border-blue-500/20"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-800/25 flex items-center justify-center font-bold text-xs text-slate-400">
                            {sub.name[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-bold text-sm ${sub.status === "canceled" ? "line-through text-slate-500" : "text-[var(--text-color)]"}`}>
                              {sub.name}
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5">{sub.category} &bull; Bill recurring {sub.interval}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <div className="text-right">
                            <span className="font-bold text-[var(--text-color)] text-sm block font-mono">₹{sub.price}</span>
                            <span className="text-[10px] text-slate-500 mt-0.5 block uppercase tracking-wider font-bold">{sub.interval}</span>
                          </div>

                          <button
                            onClick={() => handleToggleSub(sub.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                              sub.status === "canceled"
                                ? "bg-blue-600/10 border-blue-500/25 text-blue-500 dark:text-blue-400 hover:bg-blue-600/20"
                                : "bg-rose-500/5 border-rose-500/10 text-rose-500 hover:bg-rose-500/10"
                            }`}
                          >
                            {sub.status === "active" ? "Cancel Service" : "Re-activate"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Insurance Vault */}
            {activeTab === "insurance" && (
              <motion.div
                key="insurance"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
              >
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {insurancePolicies.map((policy) => (
                    <div 
                      key={policy.id} 
                      className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-[#11172b]/10 flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[var(--text-color)] text-sm">{policy.type}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{policy.provider}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Renewal Date</span>
                          <span className="text-xs font-bold text-amber-500 mt-0.5 block">{policy.renewalDate}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 my-1">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Coverage Sum</span>
                          <span className="text-base font-extrabold text-[var(--text-color)] mt-0.5 block font-mono">₹{(policy.coverage / 100000).toFixed(1)} Lakhs</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Premium</span>
                          <span className="text-base font-extrabold text-[var(--text-color)] mt-0.5 block font-mono">₹{policy.premium} <span className="text-[10px] text-slate-500 font-semibold">/month</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-950/10 flex flex-col gap-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] border-b border-[var(--border-color)] pb-3 block">AI Vault Audit</span>
                    
                    <div className="flex flex-col gap-3 text-xs leading-relaxed">
                      <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[var(--text-color)] block mb-0.5">Auto Policy Redundancy</span>
                          <p className="text-[var(--text-subtitle)]">Your ICICI Auto Policy duplicates emergency roadside recovery features. Eliminating this saves ₹400/mo.</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[var(--text-color)] block mb-0.5">Critical Health Buffer Met</span>
                          <p className="text-[var(--text-subtitle)]">Health insurance cover of ₹15L matches optimal threshold recommendations.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Document Vault */}
            {activeTab === "vault" && (
              <motion.div
                key="vault"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
              >
                <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-900/5 flex flex-col gap-4">
                  <div className="border-b border-[var(--border-color)] pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Secure Storage</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">256-bit AES end-to-end encrypted files</span>
                    </div>
                    <button
                      onClick={handleUploadDocument}
                      disabled={uploadingDoc}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-xs font-bold text-white shadow shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-1.5"
                    >
                      {uploadingDoc ? <>Uploading...</> : <><Upload className="w-3.5 h-3.5" /> Upload File</>}
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="p-3.5 rounded-xl bg-slate-900/10 border border-[var(--border-color)] flex items-center justify-between hover:border-blue-500/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800/10 flex items-center justify-center text-xs font-black text-slate-500">
                            {doc.type}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--text-color)] text-sm flex items-center gap-1.5">
                              {doc.name} <Lock className="w-3 h-3 text-emerald-500" />
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5">Uploaded {doc.uploadedAt} &bull; {doc.size}</span>
                          </div>
                        </div>

                        <button className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-slate-500/5 text-slate-400 hover:text-[var(--text-color)] transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-950/10 flex flex-col gap-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] border-b border-[var(--border-color)] pb-3 block">Vault Integrity</span>
                    
                    <div className="flex flex-col gap-3 text-xs leading-relaxed font-semibold">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Storage Used</span>
                        <span className="text-[var(--text-color)] font-mono font-bold">13.1 MB / 5.0 GB</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Status</span>
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sealed & Safe
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Signature Certificate</span>
                        <span className="text-slate-400 font-mono">SOC2_TYPE_II</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Decisions Simulator */}
            {activeTab === "decisions" && (
              <motion.div
                key="decisions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
              >
                {/* Inputs */}
                <div className="lg:col-span-5 glass-card border border-[var(--border-color)] rounded-2xl p-6 md:p-8 flex flex-col gap-6 justify-between bg-slate-950/10">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4">
                      <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)]">Variables Panel</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-[var(--text-subtitle)]">Salary Growth Rate</span>
                        <span className="text-blue-500 dark:text-blue-400 font-mono font-bold">{simSalaryRate}% <span className="text-xs text-slate-500 font-semibold">/year</span></span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="25"
                        value={simSalaryRate}
                        onChange={(e) => setSimSalaryRate(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-[var(--text-subtitle)]">Monthly Savings Rate</span>
                        <span className="text-blue-500 dark:text-blue-400 font-mono font-bold">{simSavingsRate}% <span className="text-xs text-slate-500 font-semibold">of income</span></span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="70"
                        step="5"
                        value={simSavingsRate}
                        onChange={(e) => setSimSavingsRate(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[var(--text-subtitle)] mb-1">Degree Cost</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "None", value: 0 },
                          { label: "₹20 Lakhs", value: 20 },
                          { label: "₹40 Lakhs", value: 40 }
                        ].map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setSimMba(item.value)}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                              simMba === item.value 
                                ? "bg-blue-600/10 border-blue-500/40 text-blue-500 dark:text-blue-400" 
                                : "bg-[#11172a]/30 border-[var(--border-color)] text-[var(--text-subtitle)] hover:text-[var(--text-color)]"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[var(--text-subtitle)] mb-1">Home Purchase Year</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Never", value: 0 },
                          { label: "Year 5", value: 5 },
                          { label: "Year 10", value: 10 },
                          { label: "Year 15", value: 15 }
                        ].map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setSimHouse(item.value)}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                              simHouse === item.value 
                                ? "bg-blue-600/10 border-blue-500/40 text-blue-500 dark:text-blue-400" 
                                : "bg-[#11172a]/30 border-[var(--border-color)] text-[var(--text-subtitle)] hover:text-[var(--text-color)]"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projections Chart */}
                <div className="lg:col-span-7 glass-card border border-[var(--border-color)] rounded-2xl p-6 md:p-8 flex flex-col gap-6 justify-between bg-slate-950/10">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">15-Year Scenario Forecast</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">Estimated values in ₹ Lakhs</span>
                    </div>
                    <div className="flex gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1 text-[var(--text-subtitle)]"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Standard</span>
                      <span className="flex items-center gap-1 text-blue-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Simulated</span>
                    </div>
                  </div>

                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="simGradDashboard" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            background: "var(--bg-color)", 
                            border: "1px solid var(--border-color)", 
                            borderRadius: "12px", 
                            color: "var(--text-color)" 
                          }} 
                        />
                        <Area type="monotone" dataKey="Standard" stroke="#475569" strokeWidth={1.5} fill="transparent" />
                        <Area type="monotone" dataKey="Fincody Projections" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#simGradDashboard)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Floating AI Chat Assistant Drawer */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setAiChatOpen(!aiChatOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
        >
          {aiChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 animate-pulse" />}
        </button>

        <AnimatePresence>
          {aiChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-[380px] sm:w-[420px] h-[550px] rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden text-left"
            >
              {/* AI Chat Header */}
              <div className="h-16 border-b border-[var(--border-color)] flex items-center justify-between px-5 bg-slate-950/40 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text-color)] text-sm block">Fincody Life AI</span>
                    <span className="text-[10px] text-emerald-500 font-bold block flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Co-Pilot
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setAiChatOpen(false)}
                  className="p-1 text-slate-400 hover:text-[var(--text-color)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                      msg.sender === "user" ? "bg-slate-800 text-slate-300" : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white"
                    }`}>
                      {msg.sender === "user" ? "U" : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user" 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : "bg-slate-900/60 border border-[var(--border-color)] text-[var(--text-color)] rounded-tl-none"
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[9px] text-slate-500 font-semibold px-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900/60 border border-[var(--border-color)]">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Pre-canned prompts */}
              <div className="px-4 py-2 border-t border-[var(--border-color)] flex gap-2 overflow-x-auto shrink-0 bg-slate-950/10">
                {[
                  "Can I afford ₹15L car?",
                  "Should I pursue an MBA?",
                  "Cancel Netflix savings?"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePredefinedQuestion(q)}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-slate-900/30 hover:bg-slate-900/50 text-[10px] font-bold text-slate-400 hover:text-[var(--text-color)] transition-all shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input box */}
              <div className="p-4 border-t border-[var(--border-color)] flex gap-2 shrink-0 bg-slate-950/20">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatInput)}
                  placeholder="Ask Fincody AI..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/30 border border-[var(--border-color)] text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500/30 transition-all text-[var(--text-color)]"
                />
                <button
                  onClick={() => handleSendChat(chatInput)}
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 transition-all shadow shadow-blue-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
