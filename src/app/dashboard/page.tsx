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
  Loader2,
  Play,
  Eye,
  EyeOff,
  Percent,
  Coins,
  User,
  ChevronRight,
  Edit2,
  RotateCcw,
  Info
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
import FincodyLogo from "@/components/FincodyLogo";
import CurrencyRibbon from "@/components/CurrencyRibbon";
import RollingNumber from "@/components/RollingNumber";
import { useCurrency, SUPPORTED_CURRENCIES } from "@/context/CurrencyContext";

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
  interval: string;
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
  // Global Currency Context
  const { activeCurrency, setActiveCurrency, format, convert } = useCurrency();

  // Supabase Auth State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("fincody_remember_email");
      if (savedEmail) {
        setAuthEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  // Navigation State
  const [activeTab, setActiveTab] = useState<
    "command" | "goals" | "investments" | "subscriptions" | "insurance" | "vault" | "decisions"
  >("command");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [hoveredLegend, setHoveredLegend] = useState<"standard" | "fincody" | null>(null);
  const [refreshingAdvice, setRefreshingAdvice] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync Status State
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error" | "guest">("guest");

  // Theme Switching State
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("fincody-theme") || "dark";
      setTheme(savedTheme as any);
    }
  }, []);


  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch fresh metadata from database server to enable cross-device updates
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        setUser(freshUser ?? session.user);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    };
    checkSession();

    if (typeof window !== "undefined") {
      setHasAiMemory(!!localStorage.getItem("fincody_ai_memory"));
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Fetch fresh user details
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        setUser(freshUser ?? session.user);
      } else {
        setUser(null);
      }
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
    if (typeof window !== "undefined") {
      localStorage.setItem("fincody-theme", theme);
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
      if (rememberMe) {
        localStorage.setItem("fincody_remember_email", authEmail);
      } else {
        localStorage.removeItem("fincody_remember_email");
      }
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
      options: {
        data: {
          full_name: authName,
        }
      }
    });
    if (error) {
      setAuthError(error.message);
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem("fincody_user_name", authName);
      }
      setAuthSuccess("Account created successfully! Redirecting to home page...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
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
  // Fincody AI Command Center states
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const [welcomeTitleIndex, setWelcomeTitleIndex] = useState(0);
  const [hasAiMemory, setHasAiMemory] = useState(false);
  const [multistageThinking, setMultistageThinking] = useState("");
  const [dragHover, setDragHover] = useState(false);
  const [scanAnimation, setScanAnimation] = useState(false);

  const welcomeTitles = [
    "Your Personal AI Finance Coach",
    "Investment Analyst",
    "Budget Planner",
    "Wealth Advisor",
    "Tax Assistant",
    "Financial Decision Engine"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeTitleIndex(prev => (prev + 1) % welcomeTitles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);


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
  // Goal edit, custom contribution, and undo history states
  const [goalHistory, setGoalHistory] = useState<Goal[][]>([]);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editGoalName, setEditGoalName] = useState("");
  const [editGoalTarget, setEditGoalTarget] = useState("");
  const [editGoalDeadline, setEditGoalDeadline] = useState("");
  const [customContributions, setCustomContributions] = useState<Record<string, string>>({});
  // Profile edit modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileEditName, setProfileEditName] = useState(user?.user_metadata?.full_name ?? "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileEditName) return;
    setIsSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profileEditName }
      });
      if (error) throw error;
      setProfileSuccess("Profile updated successfully!");
      setNotifications(prev => [
        { id: Date.now(), text: "Profile: Name updated successfully.", unread: true },
        ...prev
      ]);
      setTimeout(() => {
        setProfileSuccess("");
        setShowProfileModal(false);
      }, 1000);
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Premium Financial Alert Center interfaces and states
  interface FinancialNotification {
    id: string;
    category: "Bills" | "Investments" | "Subscriptions" | "Insurance" | "Loans" | "Taxes" | "Income" | "Portfolio" | "Markets";
    priority: "Critical" | "High" | "Medium" | "Low";
    title: string;
    description: string;
    scheduledTime: string;
    timeRemaining: string;
    timeRemainingSecs: number;
    status: "unread" | "read" | "completed";
    section: "Critical" | "Today" | "Upcoming" | "Completed";
    timeGroup: "Today" | "Tomorrow" | "This Week" | "Next Month" | "Completed";
    logo?: string;
  }

  const [financialNotificationsOpen, setFinancialNotificationsOpen] = useState(false);
  const [selectedNotifFilter, setSelectedNotifFilter] = useState<string | null>(null);
  const [notifSearchQuery, setNotifSearchQuery] = useState("");
  const [collapsedNotifGroups, setCollapsedNotifGroups] = useState<Record<string, boolean>>({});

  const [financialNotifications, setFinancialNotifications] = useState<FinancialNotification[]>([
    {
      id: "notif-1",
      category: "Bills",
      priority: "Critical",
      title: "Credit Card Bill Due Tomorrow",
      description: "HDFC Bank Regalia card outstanding payment of ₹45,210 is due to avoid interest charges.",
      scheduledTime: "Tomorrow • 10:00 AM",
      timeRemaining: "Due in 18 Hours",
      timeRemainingSecs: 18 * 3600,
      status: "unread",
      section: "Critical",
      timeGroup: "Tomorrow",
      logo: "HDFC Bank"
    },
    {
      id: "notif-2",
      category: "Subscriptions",
      priority: "Medium",
      title: "Netflix Renewal Today",
      description: "Premium monthly renewal of ₹649 will auto-debit from your primary credit card.",
      scheduledTime: "Today • 8:00 PM",
      timeRemaining: "Due in 2 Hours",
      timeRemainingSecs: 2 * 3600,
      status: "unread",
      section: "Today",
      timeGroup: "Today",
      logo: "Netflix"
    },
    {
      id: "notif-3",
      category: "Loans",
      priority: "High",
      title: "Home Loan EMI Due in 3 Days",
      description: "ICICI Home Loan EMI debit of ₹32,500 scheduled on auto-pay.",
      scheduledTime: "3 Days Remaining",
      timeRemaining: "3 Days Remaining",
      timeRemainingSecs: 3 * 24 * 3600,
      status: "unread",
      section: "Upcoming",
      timeGroup: "This Week",
      logo: "ICICI"
    },
    {
      id: "notif-4",
      category: "Taxes",
      priority: "Critical",
      title: "Income Tax Filing Deadline",
      description: "FY 2025-26 final income tax submission deadline. Submit all asset disclosures.",
      scheduledTime: "July 31 • 11:59 PM",
      timeRemaining: "12 Days Remaining",
      timeRemainingSecs: 12 * 24 * 3600,
      status: "unread",
      section: "Critical",
      timeGroup: "Next Month",
      logo: "IT Dept"
    },
    {
      id: "notif-5",
      category: "Investments",
      priority: "Low",
      title: "SIP Scheduled Tomorrow",
      description: "SIP contribution of ₹10,000 for Parag Parikh Flexi Cap Fund will be triggered.",
      scheduledTime: "Tomorrow • 9:00 AM",
      timeRemaining: "Due in 15 Hours",
      timeRemainingSecs: 15 * 3600,
      status: "unread",
      section: "Upcoming",
      timeGroup: "Tomorrow",
      logo: "Zerodha"
    },
    {
      id: "notif-6",
      category: "Markets",
      priority: "Medium",
      title: "Market Closing in 20 Minutes",
      description: "NSE/BSE equities markets entering standard post-close sessions in 20 minutes.",
      scheduledTime: "Today • 3:10 PM",
      timeRemaining: "20 Minutes Remaining",
      timeRemainingSecs: 20 * 60,
      status: "unread",
      section: "Today",
      timeGroup: "Today",
      logo: "NSE"
    },
    {
      id: "notif-7",
      category: "Income",
      priority: "Low",
      title: "Salary Credited",
      description: "Monthly baseline corporate salary payout of ₹1,85,000 credited to savings account.",
      scheduledTime: "Completed • Yesterday",
      timeRemaining: "Processed",
      timeRemainingSecs: -1,
      status: "completed",
      section: "Completed",
      timeGroup: "Completed",
      logo: "Fincody Corp"
    }
  ]);

  const toggleNotifGroup = (group: string) => {
    setCollapsedNotifGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleMarkReadNotif = (id: string) => {
    setFinancialNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status: "read" } : n))
    );
  };

  const handleSnoozeNotif = (id: string) => {
    setFinancialNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, timeRemaining: "Snoozed for 1 hour", scheduledTime: "Snoozed" } : n))
    );
  };

  const handleDismissNotif = (id: string) => {
    setFinancialNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleCompleteNotif = (id: string) => {
    setFinancialNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status: "completed", section: "Completed", timeGroup: "Completed", timeRemaining: "Processed" } : n))
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Bills": return CreditCard;
      case "Investments": return TrendingUp;
      case "Subscriptions": return Coins;
      case "Insurance": return Shield;
      case "Loans": return Building;
      case "Taxes": return FileText;
      case "Income": return DollarSign;
      case "Portfolio": return Activity;
      case "Markets": return Compass;
      default: return Bell;
    }
  };

  // Real-time ticking alert countdown timer (optimized to tick ONLY when Alert Center drawer is open)
  useEffect(() => {
    if (!financialNotificationsOpen) return;
    const countdownTimer = setInterval(() => {
      setFinancialNotifications((prev) => 
        prev.map((n) => {
          if (n.status === "completed" || n.timeRemainingSecs <= 0) return n;
          const nextSecs = n.timeRemainingSecs - 1;
          
          let nextTimeStr = "";
          if (nextSecs >= 86400) {
            const days = Math.floor(nextSecs / 86400);
            nextTimeStr = days + " Day" + (days > 1 ? "s" : "") + " Remaining";
          } else if (nextSecs >= 3600) {
            const hours = Math.floor(nextSecs / 3600);
            nextTimeStr = "Due in " + hours + " Hour" + (hours > 1 ? "s" : "");
          } else if (nextSecs >= 60) {
            const mins = Math.floor(nextSecs / 60);
            nextTimeStr = mins + " Minute" + (mins > 1 ? "s" : "") + " Remaining";
          } else {
            nextTimeStr = "Due in " + nextSecs + " Second" + (nextSecs > 1 ? "s" : "");
          }

          return {
            ...n,
            timeRemainingSecs: nextSecs,
            timeRemaining: nextTimeStr
          };
        })
      );
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, [financialNotificationsOpen]);

  // Simulate live alerts
  useEffect(() => {
    const dividendTimeout = setTimeout(() => {
      const newNotif: FinancialNotification = {
        id: "live-notif-1",
        category: "Investments",
        priority: "Low",
        title: "TCS Dividend Credited",
        description: "Dividend payout of ₹1,200 for 40 shares of Tata Consultancy Services credited directly.",
        scheduledTime: "Today • 4:30 PM",
        timeRemaining: "Just Credited",
        timeRemainingSecs: 0,
        status: "unread",
        section: "Today",
        timeGroup: "Today",
        logo: "Zerodha"
      };
      setFinancialNotifications((prev) => [newNotif, ...prev]);
    }, 15000);

    const rbiTimeout = setTimeout(() => {
      const newNotif: FinancialNotification = {
        id: "live-notif-2",
        category: "Markets",
        priority: "High",
        title: "RBI Policy Announcement Today",
        description: "Reserve Bank of India retains interest rates at 6.5%, highlighting focus on inflation target margins.",
        scheduledTime: "Today • 5:10 PM",
        timeRemaining: "Just Announced",
        timeRemainingSecs: 0,
        status: "unread",
        section: "Today",
        timeGroup: "Today",
        logo: "RBI"
      };
      setFinancialNotifications((prev) => [newNotif, ...prev]);
    }, 35000);

    return () => {
      clearTimeout(dividendTimeout);
      clearTimeout(rbiTimeout);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = showProfileModal ? "hidden" : "unset";
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [showProfileModal]);

  // Subscription editing & creation states
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editSubName, setEditSubName] = useState("");
  const [editSubPrice, setEditSubPrice] = useState("");
  const [editSubInterval, setEditSubInterval] = useState("monthly");

  const [newSubName, setNewSubName] = useState("");
  const [newSubPrice, setNewSubPrice] = useState("");
  const [newSubInterval, setNewSubInterval] = useState("monthly");
  const [newSubCategory, setNewSubCategory] = useState("Entertainment");

  const handleStartEditSub = (sub: Subscription) => {
    setEditingSubId(sub.id);
    setEditSubName(sub.name);
    setEditSubPrice(sub.price.toString());
    setEditSubInterval(sub.interval);
  };

  const handleSaveEditSub = (id: string) => {
    if (!editSubName || !editSubPrice) return;
    const updated = subscriptions.map(s => {
      if (s.id === id) {
        return {
          ...s,
          name: editSubName,
          price: parseFloat(editSubPrice),
          interval: editSubInterval
        };
      }
      return s;
    });
    setSubscriptions(updated);
    persistData("subscriptions", updated);
    setEditingSubId(null);

    setNotifications(prev => [
      { id: Date.now(), text: `Subscription Engine: "${editSubName}" has been updated successfully.`, unread: true },
      ...prev
    ]);
  };

  const handleCancelEditSub = () => {
    setEditingSubId(null);
  };

  const handleDeleteSub = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      const updated = subscriptions.filter(s => s.id !== id);
      setSubscriptions(updated);
      persistData("subscriptions", updated);
      setNotifications(prev => [
        { id: Date.now(), text: "Subscription Engine: Recurring bill deleted.", unread: true },
        ...prev
      ]);
    }
  };

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubPrice) return;

    const newSub: Subscription = {
      id: Date.now().toString(),
      name: newSubName,
      price: parseFloat(newSubPrice),
      interval: newSubInterval,
      status: "active",
      category: newSubCategory
    };

    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    persistData("subscriptions", updated);

    setNewSubName("");
    setNewSubPrice("");
    setNewSubInterval("monthly");
    setNewSubCategory("Entertainment");

    setNotifications(prev => [
      { id: Date.now(), text: `Subscription Engine: "${newSubName}" has been added as a recurring bill.`, unread: true },
      ...prev
    ]);
  };


  const recordGoalHistory = () => {
    setGoalHistory((prev) => [...prev, goals]);
  };

  const handleUndoGoalAction = () => {
    if (goalHistory.length === 0) return;
    const previousState = goalHistory[goalHistory.length - 1];
    setGoals(previousState);
    persistData("goals", previousState);
    setGoalHistory((prev) => prev.slice(0, prev.length - 1));
    setNotifications(prev => [
      { id: Date.now(), text: "Goal Engine: Last action successfully undone.", unread: true },
      ...prev
    ]);
  };

  const handleStartEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditGoalName(goal.name);
    setEditGoalTarget(goal.target.toString());
    setEditGoalDeadline(goal.deadline);
  };

  const handleSaveEditGoal = (id: string) => {
    if (!editGoalName || !editGoalTarget) return;
    recordGoalHistory();

    const dateObj = new Date(editGoalDeadline);
    const formattedDeadline = isNaN(dateObj.getTime()) 
      ? (editGoalDeadline || "No Date") 
      : dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    const updatedGoals = goals.map(g => {
      if (g.id === id) {
        return {
          ...g,
          name: editGoalName,
          target: parseFloat(editGoalTarget),
          deadline: formattedDeadline
        };
      }
      return g;
    });

    setGoals(updatedGoals);
    persistData("goals", updatedGoals);
    setEditingGoalId(null);

    setNotifications(prev => [
      { id: Date.now(), text: `Goal Engine: Goal "${editGoalName}" details updated successfully.`, unread: true },
      ...prev
    ]);
  };

  const handleCancelEditGoal = () => {
    setEditingGoalId(null);
  };

  const handleCustomContribute = (id: string) => {
    const amountStr = customContributions[id];
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    recordGoalHistory();
    handleContributeToGoalDirectly(id, amount);

    // Clear input
    setCustomContributions(prev => ({ ...prev, [id]: "" }));
  };

  const handleContributeToGoalDirectly = (id: string, amount: number) => {
    const updatedGoals = goals.map(g => {
      if (g.id === id) {
        const nextVal = g.current + amount;
        return { ...g, current: nextVal > g.target ? g.target : nextVal };
      }
      return g;
    });
    setGoals(updatedGoals);
    persistData("goals", updatedGoals);
  };


  // Insurance State
  const [insurancePolicies, setInsurancePolicies] = useState<Insurance[]>([
    { id: "1", type: "Health Insurance", provider: "HDFC Ergo Optima", premium: 1450, coverage: 1500000, renewalDate: "15 Oct 2026" },
    { id: "2", type: "Term Life Insurance", provider: "Max Life Smart Secure", premium: 1800, coverage: 20000000, renewalDate: "05 Nov 2026" },
    { id: "3", type: "Auto Insurance (Sedan)", provider: "ICICI Lombard", premium: 1100, coverage: 1200000, renewalDate: "12 Aug 2026" }
  ]);
  
  // Document Vault State

  // Insurance Edit States
  const [editingInsuranceId, setEditingInsuranceId] = useState<string | null>(null);
  const [editInsType, setEditInsType] = useState("");
  const [editInsProvider, setEditInsProvider] = useState("");
  const [editInsPremium, setEditInsPremium] = useState("");
  const [editInsCoverage, setEditInsCoverage] = useState("");
  const [editInsRenewalDate, setEditInsRenewalDate] = useState("");

  // Insurance Add States
  const [addInsType, setAddInsType] = useState("Health Insurance");
  const [addInsProvider, setAddInsProvider] = useState("");
  const [addInsPremium, setAddInsPremium] = useState("");
  const [addInsCoverage, setAddInsCoverage] = useState("");
  const [addInsRenewalDate, setAddInsRenewalDate] = useState("");

  const handleStartEditInsurance = (policy: Insurance) => {
    setEditingInsuranceId(policy.id);
    setEditInsType(policy.type);
    setEditInsProvider(policy.provider);
    setEditInsPremium(policy.premium.toString());
    setEditInsCoverage(policy.coverage.toString());
    setEditInsRenewalDate(policy.renewalDate);
  };

  const handleSaveEditInsurance = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editInsProvider || !editInsPremium || !editInsCoverage) return;
    const updated = insurancePolicies.map(p => {
      if (p.id === id) {
        return {
          ...p,
          type: editInsType,
          provider: editInsProvider,
          premium: parseFloat(editInsPremium),
          coverage: parseFloat(editInsCoverage),
          renewalDate: editInsRenewalDate
        };
      }
      return p;
    });
    setInsurancePolicies(updated);
    persistData("insurancePolicies", updated);
    setEditingInsuranceId(null);
  };

  const handleAddInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addInsProvider || !addInsPremium || !addInsCoverage) return;
    const newPolicy: Insurance = {
      id: "ins-" + Date.now(),
      type: addInsType,
      provider: addInsProvider,
      premium: parseFloat(addInsPremium),
      coverage: parseFloat(addInsCoverage),
      renewalDate: addInsRenewalDate || new Date().toISOString().split("T")[0]
    };
    const updated = [...insurancePolicies, newPolicy];
    setInsurancePolicies(updated);
    persistData("insurancePolicies", updated);
    setAddInsProvider("");
    setAddInsPremium("");
    setAddInsCoverage("");
    setAddInsRenewalDate("");
  };

  const handleRemoveInsurance = (id: string) => {
    if (window.confirm("Are you sure you want to remove this insurance policy?")) {
      const updated = insurancePolicies.filter(p => p.id !== id);
      setInsurancePolicies(updated);
      persistData("insurancePolicies", updated);
    }
  };

  const [documents, setDocuments] = useState<DocumentFile[]>([
    { id: "1", name: "Tax_Assessment_FY25.pdf", size: "2.4 MB", uploadedAt: "May 10, 2026", type: "PDF" },
    { id: "2", name: "Health_Policy_Document.pdf", size: "4.8 MB", uploadedAt: "Jun 02, 2026", type: "PDF" },
    { id: "3", name: "Term_Insurance_Policy.pdf", size: "5.1 MB", uploadedAt: "Jun 12, 2026", type: "PDF" },
    { id: "4", name: "PAN_Card_Copy.jpeg", size: "850 KB", uploadedAt: "Jan 15, 2026", type: "Image" }
  ]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [netWorth, setNetWorth] = useState(3845210);
  const [monthlySavings, setMonthlySavings] = useState(72450);
  const [healthScore, setHealthScore] = useState(94);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Manual Entry States
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [manualSalary, setManualSalary] = useState("185000");
  const [manualEMI, setManualEMI] = useState("");
  const [manualOtherExpenses, setManualOtherExpenses] = useState("45000");
  const [manualNetWorth, setManualNetWorth] = useState("1200000");
  const [manualSubscriptionName, setManualSubscriptionName] = useState("");
  const [manualSubscriptionPrice, setManualSubscriptionPrice] = useState("");
  const [calculationStartDate, setCalculationStartDate] = useState("2026-06-01");
  const [startYear, setStartYear] = useState(2026);
  const [endYear, setEndYear] = useState(2040);

  // Live Portfolio Tracker States
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [stockSearchResults, setStockSearchResults] = useState<any[]>([]);
  const [stockSearchLoading, setStockSearchLoading] = useState(false);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState("");
  const [selectedStockHistory, setSelectedStockHistory] = useState<any[] | null>(null);
  const [selectedStockHistoryRange, setSelectedStockHistoryRange] = useState("1M");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [priceUpdateStatus, setPriceUpdateStatus] = useState<Record<string, "up" | "down" | null>>({});

  // AI Portfolio Builder States
  const [aiGoalPrompt, setAiGoalPrompt] = useState("");
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<any | null>(null);
  const [savedPortfolios, setSavedPortfolios] = useState<any[]>([]);
  const [activePortfolioName, setActivePortfolioName] = useState("Custom Portfolio");
  const [showSavePortfolioModal, setShowSavePortfolioModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [syncErrorMessage, setSyncErrorMessage] = useState<string>("");
  // Investment Engine Enhancements States
  const [selectedInvestmentSubTab, setSelectedInvestmentSubTab] = useState<"equities" | "fixed_income" | "retirement" | "metals">("equities");
  const [ignoredRecs, setIgnoredRecs] = useState<string[]>([]);
  const [replacingRecStock, setReplacingRecStock] = useState<any | null>(null);

  const [fixedDeposits, setFixedDeposits] = useState<any[]>([
    { id: "fd-1", bank: "HDFC Bank Ltd", principal: 500000, rate: 7.25, startDate: "2025-06-15", tenureYears: 2 }
  ]);
  const [ppfData, setPpfData] = useState<any>({
    balance: 450000,
    annualContribution: 150000,
    startYear: 2024
  });
  const [npsData, setNpsData] = useState<any>({
    corpus: 300000,
    employerMonthly: 10000,
    personalMonthly: 5000,
    allocationE: 60, // Equity
    allocationC: 25, // Corporate Bonds
    allocationG: 15  // Gov Securities
  });
  const [goldHoldings, setGoldHoldings] = useState<any[]>([
    { id: "gold-1", type: "Physical Gold", grams: 10, buyPricePerGram: 6800 },
    { id: "gold-2", type: "Gold ETF", units: 50, buyPricePerUnit: 120 }
  ]);
  const [etfHoldings, setEtfHoldings] = useState<any[]>([
    { id: "etf-1", symbol: "NIFTYBEES", name: "Nippon India Nifty 50 ETF", units: 300, avgPrice: 232 },
    { id: "etf-2", symbol: "MON100", name: "Motilal Oswal Nasdaq 100 ETF", units: 100, avgPrice: 145 }
  ]);
  const [bondHoldings, setBondHoldings] = useState<any[]>([
    { id: "bond-1", type: "Government Bonds", faceValue: 200000, couponRate: 6.8, startDate: "2024-05-10", maturityDate: "2030-05-10" },
    { id: "bond-2", type: "Corporate Bonds", faceValue: 100000, couponRate: 8.5, startDate: "2024-08-15", maturityDate: "2029-08-15" }
  ]);
  const [spotGoldPrice, setSpotGoldPrice] = useState(7250); // Live mock spot price in INR/gram

  // Investment Forms States
  const [addFdBank, setAddFdBank] = useState("");
  const [addFdPrincipal, setAddFdPrincipal] = useState("");
  const [addFdRate, setAddFdRate] = useState("");
  const [addFdStartDate, setAddFdStartDate] = useState("");
  const [addFdTenureYears, setAddFdTenureYears] = useState("");

  const [addBondType, setAddBondType] = useState("Government Bonds");
  const [addBondFaceValue, setAddBondFaceValue] = useState("");
  const [addBondCouponRate, setAddBondCouponRate] = useState("");
  const [addBondStartDate, setAddBondStartDate] = useState("");
  const [addBondMaturityDate, setAddBondMaturityDate] = useState("");

  const [addGoldType, setAddGoldType] = useState("Physical Gold");
  const [addGoldGrams, setAddGoldGrams] = useState("");
  const [addGoldBuyPrice, setAddGoldBuyPrice] = useState("");

  const [addEtfSymbol, setAddEtfSymbol] = useState("");
  const [addEtfUnits, setAddEtfUnits] = useState("");
  const [addEtfAvgPrice, setAddEtfAvgPrice] = useState("");


  // Persistence States & Helper
  const persistData = (key: string, data: any) => {
    const prefix = user ? `fincody_user_${user.id}_` : "fincody_guest_";
    try {
      localStorage.setItem(`${prefix}${key}`, typeof data === "string" ? data : JSON.stringify(data));
    } catch (e) {
      console.error("Error saving persisted state:", e);
    }
  };

  useEffect(() => {
    if (!user) {
      // Load guest data from LocalStorage
      const prefix = "fincody_guest_";
      try {
        const savedGoals = localStorage.getItem(`${prefix}goals`);
        if (savedGoals) setGoals(JSON.parse(savedGoals));

        const savedSubs = localStorage.getItem(`${prefix}subscriptions`);
        if (savedSubs) setSubscriptions(JSON.parse(savedSubs));

        const savedInsurance = localStorage.getItem(`${prefix}insurancePolicies`);
        if (savedInsurance) setInsurancePolicies(JSON.parse(savedInsurance));

        const savedDocs = localStorage.getItem(`${prefix}documents`);
        if (savedDocs) setDocuments(JSON.parse(savedDocs));

        const savedNetWorth = localStorage.getItem(`${prefix}netWorth`);
        if (savedNetWorth) setNetWorth(parseFloat(savedNetWorth));

        const savedSavings = localStorage.getItem(`${prefix}monthlySavings`);
        if (savedSavings) setMonthlySavings(parseFloat(savedSavings));

        const savedScore = localStorage.getItem(`${prefix}healthScore`);
        if (savedScore) setHealthScore(parseInt(savedScore));

        const savedStartYear = localStorage.getItem(`${prefix}startYear`);
        if (savedStartYear) setStartYear(parseInt(savedStartYear));

        const savedEndYear = localStorage.getItem(`${prefix}endYear`);
        if (savedEndYear) setEndYear(parseInt(savedEndYear));

        const savedCalcStart = localStorage.getItem(`${prefix}calculationStartDate`);
        if (savedCalcStart) setCalculationStartDate(savedCalcStart);

        const savedManualSalary = localStorage.getItem(`${prefix}manualSalary`);
        if (savedManualSalary) setManualSalary(savedManualSalary);

        const savedManualEMI = localStorage.getItem(`${prefix}manualEMI`);
        if (savedManualEMI) setManualEMI(savedManualEMI);

        const savedManualOtherExpenses = localStorage.getItem(`${prefix}manualOtherExpenses`);
        if (savedManualOtherExpenses) setManualOtherExpenses(savedManualOtherExpenses);

        const savedPortfolio = localStorage.getItem(`${prefix}portfolio`);
        if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));

        const savedSavedPortfolios = localStorage.getItem(`${prefix}savedPortfolios`);
        if (savedSavedPortfolios) setSavedPortfolios(JSON.parse(savedSavedPortfolios));

        const savedActivePortName = localStorage.getItem(`${prefix}activePortfolioName`);
        if (savedActivePortName) setActivePortfolioName(savedActivePortName);

        const savedAiRec = localStorage.getItem(`${prefix}aiRecommendation`);
        if (savedAiRec) setAiRecommendation(JSON.parse(savedAiRec));

        // Load new asset classes
        const savedFDs = localStorage.getItem(`${prefix}fixedDeposits`);
        if (savedFDs) setFixedDeposits(JSON.parse(savedFDs));

        const savedPPF = localStorage.getItem(`${prefix}ppfData`);
        if (savedPPF) setPpfData(JSON.parse(savedPPF));

        const savedNPS = localStorage.getItem(`${prefix}npsData`);
        if (savedNPS) setNpsData(JSON.parse(savedNPS));

        const savedGold = localStorage.getItem(`${prefix}goldHoldings`);
        if (savedGold) setGoldHoldings(JSON.parse(savedGold));

        const savedETFs = localStorage.getItem(`${prefix}etfHoldings`);
        if (savedETFs) setEtfHoldings(JSON.parse(savedETFs));

        const savedBonds = localStorage.getItem(`${prefix}bondHoldings`);
        if (savedBonds) setBondHoldings(JSON.parse(savedBonds));
      } catch (e) {
        console.error("Error loading guest persisted state:", e);
      }
      setSyncStatus("guest");
      return;
    }

    // Authenticated User Hydration
    // 1. Try to load from Supabase Cloud User Metadata
    const cloudDataStr = user.user_metadata?.fincody_dashboard_data;
    if (cloudDataStr) {
      try {
        const data = JSON.parse(cloudDataStr);
        if (data.goals) setGoals(data.goals);
        if (data.subscriptions) setSubscriptions(data.subscriptions);
        if (data.insurancePolicies) setInsurancePolicies(data.insurancePolicies);
        if (data.documents) setDocuments(data.documents);
        if (data.netWorth !== undefined) setNetWorth(data.netWorth);
        if (data.monthlySavings !== undefined) setMonthlySavings(data.monthlySavings);
        if (data.healthScore !== undefined) setHealthScore(data.healthScore);
        if (data.startYear !== undefined) setStartYear(data.startYear);
        if (data.endYear !== undefined) setEndYear(data.endYear);
        if (data.calculationStartDate) setCalculationStartDate(data.calculationStartDate);
        if (data.manualSalary !== undefined) setManualSalary(data.manualSalary);
        if (data.manualEMI !== undefined) setManualEMI(data.manualEMI);
        if (data.manualOtherExpenses !== undefined) setManualOtherExpenses(data.manualOtherExpenses);
        if (data.portfolio) setPortfolio(data.portfolio);
        if (data.savedPortfolios) setSavedPortfolios(data.savedPortfolios);
        if (data.activePortfolioName !== undefined) setActivePortfolioName(data.activePortfolioName);
        if (data.aiRecommendation !== undefined) setAiRecommendation(data.aiRecommendation);

        // Hydrate new asset classes from cloud
        if (data.fixedDeposits) setFixedDeposits(data.fixedDeposits);
        if (data.ppfData) setPpfData(data.ppfData);
        if (data.npsData) setNpsData(data.npsData);
        if (data.goldHoldings) setGoldHoldings(data.goldHoldings);
        if (data.etfHoldings) setEtfHoldings(data.etfHoldings);
        if (data.bondHoldings) setBondHoldings(data.bondHoldings);

        setSyncStatus("synced");
        console.log("Hydrated Fincody dashboard from Cloud Vault.");
        return;
      } catch (e) {
        console.error("Failed to parse cloud dashboard data:", e);
      }
    }

    // 2. Local Storage Fallback if metadata is not populated yet
    const prefix = `fincody_user_${user.id}_`;
    try {
      const savedGoals = localStorage.getItem(`${prefix}goals`);
      if (savedGoals) setGoals(JSON.parse(savedGoals));

      const savedSubs = localStorage.getItem(`${prefix}subscriptions`);
      if (savedSubs) setSubscriptions(JSON.parse(savedSubs));

      const savedInsurance = localStorage.getItem(`${prefix}insurancePolicies`);
      if (savedInsurance) setInsurancePolicies(JSON.parse(savedInsurance));

      const savedDocs = localStorage.getItem(`${prefix}documents`);
      if (savedDocs) setDocuments(JSON.parse(savedDocs));

      const savedNetWorth = localStorage.getItem(`${prefix}netWorth`);
      if (savedNetWorth) setNetWorth(parseFloat(savedNetWorth));

      const savedSavings = localStorage.getItem(`${prefix}monthlySavings`);
      if (savedSavings) setMonthlySavings(parseFloat(savedSavings));

      const savedScore = localStorage.getItem(`${prefix}healthScore`);
      if (savedScore) setHealthScore(parseInt(savedScore));

      const savedStartYear = localStorage.getItem(`${prefix}startYear`);
      if (savedStartYear) setStartYear(parseInt(savedStartYear));

      const savedEndYear = localStorage.getItem(`${prefix}endYear`);
      if (savedEndYear) setEndYear(parseInt(savedEndYear));

      const savedCalcStart = localStorage.getItem(`${prefix}calculationStartDate`);
      if (savedCalcStart) setCalculationStartDate(savedCalcStart);

      const savedManualSalary = localStorage.getItem(`${prefix}manualSalary`);
      if (savedManualSalary) setManualSalary(savedManualSalary);

      const savedManualEMI = localStorage.getItem(`${prefix}manualEMI`);
      if (savedManualEMI) setManualEMI(savedManualEMI);

      const savedManualOtherExpenses = localStorage.getItem(`${prefix}manualOtherExpenses`);
      if (savedManualOtherExpenses) setManualOtherExpenses(savedManualOtherExpenses);

      const savedPortfolio = localStorage.getItem(`${prefix}portfolio`);
      if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));

      const savedSavedPortfolios = localStorage.getItem(`${prefix}savedPortfolios`);
      if (savedSavedPortfolios) setSavedPortfolios(JSON.parse(savedSavedPortfolios));

      const savedActivePortName = localStorage.getItem(`${prefix}activePortfolioName`);
      if (savedActivePortName) setActivePortfolioName(savedActivePortName);

      const savedAiRec = localStorage.getItem(`${prefix}aiRecommendation`);
      if (savedAiRec) setAiRecommendation(JSON.parse(savedAiRec));

      // Hydrate new asset classes
      const savedFDs = localStorage.getItem(`${prefix}fixedDeposits`);
      if (savedFDs) setFixedDeposits(JSON.parse(savedFDs));

      const savedPPF = localStorage.getItem(`${prefix}ppfData`);
      if (savedPPF) setPpfData(JSON.parse(savedPPF));

      const savedNPS = localStorage.getItem(`${prefix}npsData`);
      if (savedNPS) setNpsData(JSON.parse(savedNPS));

      const savedGold = localStorage.getItem(`${prefix}goldHoldings`);
      if (savedGold) setGoldHoldings(JSON.parse(savedGold));

      const savedETFs = localStorage.getItem(`${prefix}etfHoldings`);
      if (savedETFs) setEtfHoldings(JSON.parse(savedETFs));

      const savedBonds = localStorage.getItem(`${prefix}bondHoldings`);
      if (savedBonds) setBondHoldings(JSON.parse(savedBonds));
    } catch (e) {
      console.error("Error loading persisted state fallback:", e);
    }
    setSyncStatus("synced");
  }, [user]);

  // Live spot gold price update hook (queries live GC=F Futures & USDINR=X Exchange Rate)
  useEffect(() => {
    const fetchLiveGoldPrice = async () => {
      try {
        const goldRes = await fetch("/api/stock?action=quote&symbol=GC%3DF");
        const exRes = await fetch("/api/stock?action=quote&symbol=USDINR%3DX");
        
        if (goldRes.ok && exRes.ok) {
          const goldData = await goldRes.ok ? await goldRes.json() : null;
          const exData = await exRes.ok ? await exRes.json() : null;
          if (goldData && goldData.price && exData && exData.price) {
            const goldUSDPerGram = goldData.price / 31.1034768;
            const goldINRPerGram = goldUSDPerGram * exData.price;
            setSpotGoldPrice(parseFloat(goldINRPerGram.toFixed(2)));
          }
        }
      } catch (err) {
        console.error("Error fetching live gold price:", err);
      }
    };

    fetchLiveGoldPrice();
    const intervalId = setInterval(fetchLiveGoldPrice, 30000); // Poll every 30s
    return () => clearInterval(intervalId);
  }, []);

  // Debounced Autosave Sync to Supabase User Metadata
  useEffect(() => {
    if (!user) return;

    // We only want to trigger the sync after the initial load completes
    // A delay of 2500ms debounces continuous user edits (like typing networth/names)
    const delayDebounceFn = setTimeout(async () => {
      setSyncStatus("syncing");

      const dashboardDataObj = {
        goals,
        subscriptions,
        insurancePolicies,
        documents,
        netWorth,
        monthlySavings,
        healthScore,
        startYear,
        endYear,
        calculationStartDate,
        manualSalary,
        manualEMI,
        manualOtherExpenses,
        portfolio,
        savedPortfolios,
        activePortfolioName,
        aiRecommendation,
        fixedDeposits,
        ppfData,
        npsData,
        goldHoldings,
        etfHoldings,
        bondHoldings
      };

      const { error } = await supabase.auth.updateUser({
        data: {
          fincody_dashboard_data: JSON.stringify(dashboardDataObj)
        }
      });

      if (error) {
        console.error("Failed to sync dashboard to Supabase Cloud:", error);
        setSyncStatus("error");
        setSyncErrorMessage(error.message || "Unknown error");
      } else {
        setSyncErrorMessage("");
        setSyncStatus("synced");
      }
    }, 2500);

    return () => clearTimeout(delayDebounceFn);
  }, [
    user,
    goals,
    subscriptions,
    insurancePolicies,
    documents,
    netWorth,
    monthlySavings,
    healthScore,
    startYear,
    endYear,
    calculationStartDate,
    manualSalary,
    manualEMI,
    manualOtherExpenses,
    portfolio,
    savedPortfolios,
    activePortfolioName,
    aiRecommendation,
    fixedDeposits,
    ppfData,
    npsData,
    goldHoldings,
    etfHoldings,
    bondHoldings
  ]);

  // Future Simulator interactive state
  const [simSalaryRate, setSimSalaryRate] = useState(12);
  const [simSavingsRate, setSimSavingsRate] = useState(35);
  const [simMba, setSimMba] = useState(0);
  const [simHouse, setSimHouse] = useState(0);

  // Dynamic Chart Data Generator
  const getProjectionsChartData = () => {
    const data = [];
    let netWorthVal = netWorth / 100000; // Dynamic Starting Net Worth (₹ Lakhs)
    let baseWorth = netWorth / 100000;
    
    const monthlyIncome = (manualSalary ? parseFloat(manualSalary) : 200000) / 100000; // Dynamic Salary in Lakhs
    const growth = 1.08; // 8% asset return
    const totalYears = Math.max(1, endYear - startYear + 1);

    for (let i = 0; i < totalYears; i++) {
      const yearLabel = startYear + i;

      // Base Case
      const baseSavings = (monthlyIncome * 12) * Math.pow(1.08, i) * 0.25;
      baseWorth = (baseWorth + baseSavings) * growth;

      // Simulated Case
      const simulatedIncome = (monthlyIncome * 12) * Math.pow(1 + (simSalaryRate / 100), i);
      let simulatedSavings = simulatedIncome * (simSavingsRate / 100);

      if (simMba > 0) {
        if (i === 1 || i === 2) {
          netWorthVal -= (simMba / 2);
          simulatedSavings = 0;
        } else if (i > 2) {
          // Bumps income post MBA
          simulatedSavings = (simulatedIncome * 1.5) * (simSavingsRate / 100);
        }
      }

      if (simHouse > 0 && i === simHouse) {
        netWorthVal -= 15; // ₹15L Downpayment
      }

      netWorthVal = (netWorthVal + simulatedSavings) * growth;

      data.push({
        name: `${yearLabel}`,
        "Standard": Math.round(baseWorth),
        "Fincody Projections": Math.max(-20, Math.round(netWorthVal))
      });
    }
    return data;
  };

  const chartData = getProjectionsChartData();

  // Dynamic Investment Allocation Data
  const getDynamicAssetAllocation = () => {
    if (portfolio.length === 0) {
      return [
        { name: "Stocks & Mutual Funds", value: 2450000, color: "#3B82F6" },
        { name: "Cryptocurrency", value: 350000, color: "#A855F7" },
        { name: "Gold & Commodities", value: 450000, color: "#EAB308" },
        { name: "Liquid Cash/FDs", value: 595210, color: "#10B981" }
      ];
    }
    
    return portfolio.map((item, idx) => {
      const price = quotes[item.symbol]?.price || 0;
      return {
        name: item.symbol,
        value: item.qty * price || 1,
        color: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#ef4444"][idx % 6]
      };
    });
  };

  const assetAllocationData = getDynamicAssetAllocation();

  // Subscriptions calculations
  const activeSubscriptions = subscriptions.filter(sub => sub.status === "active");
  const monthlySubscriptionSpend = activeSubscriptions.reduce((acc, curr) => acc + curr.price, 0);

  // Goal adding/updating
  const handleAddGoal = (e: React.FormEvent) => {
    recordGoalHistory();
    recordGoalHistory();
    recordGoalHistory();
    e.preventDefault();
    if (!newGoalName || !newGoalTarget) return;

    const dateObj = new Date(newGoalDeadline);
    const formattedDeadline = isNaN(dateObj.getTime()) 
      ? (newGoalDeadline || "No Date") 
      : dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: newGoalName,
      target: parseFloat(newGoalTarget),
      current: 0,
      deadline: formattedDeadline
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    persistData("goals", updatedGoals);

    setNewGoalName("");
    setNewGoalTarget("");
    setNewGoalDeadline("");
  };

  const handleContributeToGoal = (id: string, amount: number) => {
    recordGoalHistory();
    recordGoalHistory();
    recordGoalHistory();
    const updatedGoals = goals.map(g => {
      if (g.id === id) {
        const nextVal = g.current + amount;
        return { ...g, current: nextVal > g.target ? g.target : nextVal };
      }
      return g;
    });
    setGoals(updatedGoals);
    persistData("goals", updatedGoals);
  };

  // Subscription Cancellation Simulator
  const handleToggleSub = (id: string) => {
    const updatedSubs = subscriptions.map(sub => {
      if (sub.id === id) {
        const nextStatus: "active" | "canceled" = sub.status === "active" ? "canceled" : "active";
        return { ...sub, status: nextStatus };
      }
      return sub;
    });
    setSubscriptions(updatedSubs);
    persistData("subscriptions", updatedSubs);

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

  // Document Upload Uploader
  const handleUploadDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    setTimeout(() => {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      const newDoc: DocumentFile = {
        id: Date.now().toString(),
        name: file.name,
        size: `${sizeInMB} MB`,
        uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        type: file.name.split('.').pop()?.toUpperCase() || "PDF"
      };
      
      setDocuments(prev => {
        const updated = [newDoc, ...prev];
        persistData("documents", updated);
        return updated;
      });
      setUploadingDoc(false);

      // Trigger Notification
      setNotifications(prev => [
        { id: Date.now(), text: `Vault: New encrypted file "${newDoc.name}" processed and stored.`, unread: true },
        ...prev
      ]);
    }, 1200);
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document from your secure vault?")) {
      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      persistData("documents", updated);
      setNotifications(prev => [
        { id: Date.now(), text: "Vault: Document has been permanently deleted from storage.", unread: true },
        ...prev
      ]);
    }
  };

  const handleDeleteGoal = (id: string) => {
    recordGoalHistory();
    recordGoalHistory();
    recordGoalHistory();
    if (window.confirm("Are you sure you want to delete this goal?")) {
      const updated = goals.filter(g => g.id !== id);
      setGoals(updated);
      persistData("goals", updated);
      setNotifications(prev => [
        { id: Date.now(), text: "Goal Engine: Target goal deleted successfully.", unread: true },
        ...prev
      ]);
    }
  };

  const handleBeginAnalysis = () => {
    if (documents.length === 0) return;
    setIsAnalyzing(true);

    setNotifications(prev => [
      { id: Date.now() + 1, text: "AI Scanner: Commencing multi-document audit...", unread: true },
      ...prev
    ]);

    setTimeout(() => {
      // 1. Boost Net Worth by ₹2,67,640 (simulate finding unclaimed capital/tax return)
      const newNetWorth = netWorth + 267640;
      setNetWorth(newNetWorth);
      persistData("netWorth", newNetWorth);

      // 2. Boost Monthly Savings by ₹11,650 (consolidated optimizations)
      const newSavings = monthlySavings + 11650;
      setMonthlySavings(newSavings);
      persistData("monthlySavings", newSavings);

      // 3. Set health score to 98
      setHealthScore(98);
      persistData("healthScore", 98);

      // 4. Auto contribute ₹50,000 to Emergency Fund goal
      const updatedGoals = goals.map(g => {
        if (g.name === "Emergency Fund") {
          const nextVal = g.current + 50000;
          return { ...g, current: nextVal > g.target ? g.target : nextVal };
        }
        return g;
      });
      setGoals(updatedGoals);
      persistData("goals", updatedGoals);

      // 5. Canceled redundant subscriptions (auto-cancel Adobe CC if active)
      const updatedSubs = subscriptions.map(sub => {
        if (sub.name === "Adobe Creative Cloud") {
          return { ...sub, status: "canceled" as "active" | "canceled" };
        }
        return sub;
      });
      setSubscriptions(updatedSubs);
      persistData("subscriptions", updatedSubs);

      setIsAnalyzing(false);

      // Add success notifications
      setNotifications(prev => [
        { id: Date.now() + 2, text: "AI Scanner: Discovered ₹2,67,640 under-reported equity assets in Tax_Assessment_FY25.pdf. Consolidated successfully.", unread: true },
        { id: Date.now() + 3, text: "AI Scanner: Auto-canceled Adobe Creative Cloud subscription, saving ₹4,220/month.", unread: true },
        { id: Date.now() + 4, text: "AI Scanner: Overall Financial Health Score adjusted to 98/100.", unread: true },
        ...prev
      ]);
    }, 2500);
  };

  const handleManualEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedLog: string[] = [];

    const salaryVal = parseFloat(manualSalary) || 0;
    const emiVal = parseFloat(manualEMI) || 0;
    const otherExpVal = parseFloat(manualOtherExpenses) || 0;
    const netWorthVal = parseFloat(manualNetWorth);

    // Compute monthly subscription spend
    const activeSubs = subscriptions.filter(sub => sub.status === "active");
    const subSpend = activeSubs.reduce((acc, curr) => acc + curr.price, 0);

    // Calculate dynamic savings
    let calculatedSavings = monthlySavings;
    if (manualSalary) {
      calculatedSavings = Math.max(0, salaryVal - emiVal - otherExpVal - subSpend);
      setMonthlySavings(calculatedSavings);
      persistData("monthlySavings", calculatedSavings);
      updatedLog.push(`Savings calculated to ₹${calculatedSavings.toLocaleString()}`);

      // Calculate dynamic health score
      const savingsRate = calculatedSavings / (salaryVal || 1);
      const emiRate = emiVal / (salaryVal || 1);
      const computedHealth = Math.max(20, Math.min(100, Math.round(85 + savingsRate * 30 - emiRate * 25)));
      setHealthScore(computedHealth);
      persistData("healthScore", computedHealth);
      updatedLog.push(`Health Score recalculated to ${computedHealth}`);
    }

    // Update Net Worth if entered
    if (manualNetWorth && !isNaN(netWorthVal)) {
      setNetWorth(netWorthVal);
      persistData("netWorth", netWorthVal);
      updatedLog.push(`Net Worth set to ₹${netWorthVal.toLocaleString()}`);
    }

    // Add new subscription if filled
    let nextSubs = subscriptions;
    if (manualSubscriptionName && manualSubscriptionPrice) {
      const priceVal = parseFloat(manualSubscriptionPrice);
      if (!isNaN(priceVal)) {
        const newSub: Subscription = {
          id: Date.now().toString(),
          name: manualSubscriptionName,
          price: priceVal,
          interval: "monthly",
          status: "active",
          category: "Manual Entry"
        };
        nextSubs = [...subscriptions, newSub];
        setSubscriptions(nextSubs);
        persistData("subscriptions", nextSubs);
        updatedLog.push(`Added subscription ${manualSubscriptionName} (₹${priceVal})`);
      }
    }

    // Calculation start date log
    if (calculationStartDate) {
      persistData("calculationStartDate", calculationStartDate);
      updatedLog.push(`Calculation start date set to ${calculationStartDate}`);
    }

    // Edit or append manual entry sheet without duplicating it
    setDocuments(prev => {
      const exists = prev.some(d => d.type === "MANUAL");
      let updated;
      if (exists) {
        // Update uploaded timestamp on the existing manual sheet rather than creating a new one
        updated = prev.map(d => d.type === "MANUAL" ? {
          ...d,
          uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
        } : d);
      } else {
        const newDoc: DocumentFile = {
          id: Date.now().toString(),
          name: `Manual_Entry_Sheet_${new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }).replace(" ", "_")}.pdf`,
          size: "18 KB",
          uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          type: "MANUAL"
        };
        updated = [newDoc, ...prev];
      }
      persistData("documents", updated);
      return updated;
    });

    // Notify
    if (updatedLog.length > 0) {
      setNotifications(prev => [
        { id: Date.now(), text: `Manual Entry: ${updatedLog.join(", ")}.`, unread: true },
        ...prev
      ]);
    }

    // Clear inputs and close modal
    setManualEMI("");
    setManualSubscriptionName("");
    setManualSubscriptionPrice("");
    setShowManualEntryModal(false);
  };

  // ==================== AI PORTFOLIO BUILDER HANDLERS ====================
  const handleGeneratePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiGoalPrompt.trim()) return;

    setIsGeneratingPortfolio(true);
    setAiRecommendation(null);

    // Extract capital
    let totalCapital = 100000;
    const numberMatches = aiGoalPrompt.replace(/[,]/g, "").match(/\d+/g);
    if (numberMatches && numberMatches.length > 0) {
      const val = parseInt(numberMatches[0]);
      if (val > 1000) totalCapital = val;
    }

    // Default portfolio setup
    let rec: any = {
      totalCapital,
      risk: "Medium",
      diversification: 85,
      rationale: "Standard balanced allocation focusing on global and domestic market leaders.",
      stocks: [
        { symbol: "AAPL", name: "Apple Inc.", allocation: 25, sector: "Technology", rationale: "Stable consumer moat and hardware product cycles." },
        { symbol: "MSFT", name: "Microsoft Corporation", allocation: 25, sector: "Technology", rationale: "Enterprise subscription models and Azure cloud growth." },
        { symbol: "RELIANCE.NS", name: "Reliance Industries Ltd", allocation: 25, sector: "Energy", rationale: "Bedrock private conglomerate in Indian oil and telecom." },
        { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd", allocation: 25, sector: "Finance", rationale: "Dominant lender capturing retail consumer expansion." }
      ]
    };

    const promptLower = aiGoalPrompt.toLowerCase();
    if (promptLower.includes("growth") || promptLower.includes("aggressive") || promptLower.includes("high-growth") || promptLower.includes("equity")) {
      rec = {
        totalCapital,
        risk: "High",
        diversification: 75,
        rationale: "Aggressive beta configuration focused on GPU hardware acceleration, EV networks, and digital infrastructure.",
        stocks: [
          { symbol: "NVDA", name: "NVIDIA Corporation", allocation: 35, sector: "Technology", rationale: "Standard GPU provider for global machine learning networks." },
          { symbol: "TSLA", name: "Tesla Inc", allocation: 25, sector: "Automotive", rationale: "Pioneer in electric transport, gigafactories, and robotic batteries." },
          { symbol: "AAPL", name: "Apple Inc.", allocation: 20, sector: "Technology", rationale: "Massive consumer ecosystems with premium premium pricing power." },
          { symbol: "RELIANCE.NS", name: "Reliance Industries Ltd", allocation: 20, sector: "Energy", rationale: "Leading digital networks (Jio) and emerging solar projects." }
        ]
      };
    } else if (promptLower.includes("low") || promptLower.includes("safe") || promptLower.includes("conservative") || promptLower.includes("retirement")) {
      rec = {
        totalCapital,
        risk: "Low",
        diversification: 92,
        rationale: "Defensive configuration with solid balance sheets and high cash resilience for downside shielding.",
        stocks: [
          { symbol: "MSFT", name: "Microsoft Corporation", allocation: 30, sector: "Technology", rationale: "Pristine balance sheet and low enterprise churn rates." },
          { symbol: "TCS.NS", name: "Tata Consultancy Services Ltd", allocation: 25, sector: "Technology Services", rationale: "Indian service giant with high return on capital and steady dividend yields." },
          { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd", allocation: 25, sector: "Finance", rationale: "Low cost of funds and strong asset quality ratios." },
          { symbol: "JNJ", name: "Johnson & Johnson", allocation: 20, sector: "Healthcare", rationale: "Consistent healthcare provider with multi-decade dividend increases." }
        ]
      };
    } else if (promptLower.includes("dividend") || promptLower.includes("income") || promptLower.includes("yield")) {
      rec = {
        totalCapital,
        risk: "Low-Medium",
        diversification: 88,
        rationale: "Optimized yield distribution focusing on consumer staples and premier financial compounders.",
        stocks: [
          { symbol: "RELIANCE.NS", name: "Reliance Industries Ltd", allocation: 30, sector: "Energy", rationale: "High refinery margins powering retail growth payouts." },
          { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd", allocation: 30, sector: "Finance", rationale: "Compounding financial asset with steady capital return history." },
          { symbol: "KO", name: "The Coca-Cola Company", allocation: 20, sector: "Consumer Staples", rationale: "Unmatched worldwide distribution network and beverage pricing control." },
          { symbol: "JNJ", name: "Johnson & Johnson", allocation: 20, sector: "Healthcare", rationale: "Pristine capital buffer shielding shareholders during downturns." }
        ]
      };
    }

    // Wait to simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2200));

    // Fetch quote prices for all selected stocks
    const tempQuotes: Record<string, any> = {};
    await Promise.all(rec.stocks.map(async (st: any) => {
      try {
        const res = await fetch(`/api/stock?action=quote&symbol=${encodeURIComponent(st.symbol)}`);
        if (res.ok) {
          const data = await res.json();
          tempQuotes[st.symbol] = data;
        }
      } catch (e) {
        console.error("Quote fetch error in AI generator:", e);
      }
    }));

    setQuotes(prev => ({ ...prev, ...tempQuotes }));

    // Calculate recommended targets in metadata
    rec.stocks = rec.stocks.map((st: any) => {
      const livePrice = tempQuotes[st.symbol]?.price || 100;
      const allocatedCap = totalCapital * (st.allocation / 100);
      const qty = Math.max(1, Math.round(allocatedCap / livePrice));
      return {
        ...st,
        qty,
        avgBuyPrice: livePrice
      };
    });

    setAiRecommendation(rec);
    persistData("aiRecommendation", rec);

    setIsGeneratingPortfolio(false);
    setNotifications(prev => [
      { id: Date.now(), text: `AI Advisor: Generated portfolio containing ${rec.stocks.length} assets based on target goal.`, unread: true },
      ...prev
    ]);
  };

  const handleRebalancePortfolio = () => {
    if (portfolio.length === 0) return;
    const totalValue = portfolio.reduce((acc, item) => acc + (item.qty * (quotes[item.symbol]?.price || 0)), 0);
    if (totalValue === 0) return;

    const targetPercent = 100 / portfolio.length;
    const nextPortfolio = portfolio.map(item => {
      const price = quotes[item.symbol]?.price || 1;
      const targetAllocationValue = totalValue * (targetPercent / 100);
      const suggestedQty = Math.max(1, Math.round(targetAllocationValue / price));
      return {
        ...item,
        qty: suggestedQty
      };
    });

    setPortfolio(nextPortfolio);
    persistData("portfolio", nextPortfolio);

    setNotifications(prev => [
      { id: Date.now(), text: `AI Co-Pilot: Suggested allocations rebalanced to equal distributions (${targetPercent.toFixed(1)}% each) based on live rates.`, unread: true },
      ...prev
    ]);
  };

  
  // Timezone and Market Hours checker
  const getExchangeMarketState = (symbol: string) => {
    let timezone = "EDT";
    let exchange = "US";
    if (symbol.endsWith(".NS") || symbol.endsWith(".BO")) {
      timezone = "IST";
      exchange = "IN";
    } else if (symbol.endsWith(".L")) {
      timezone = "BST";
      exchange = "UK";
    } else if (symbol.endsWith(".T")) {
      timezone = "JST";
      exchange = "JP";
    }

    const now = new Date();
    let localHour = now.getHours();
    let localMinute = now.getMinutes();

    let tzString = "America/New_York";
    if (exchange === "IN") tzString = "Asia/Kolkata";
    else if (exchange === "UK") tzString = "Europe/London";
    else if (exchange === "JP") tzString = "Asia/Tokyo";

    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tzString,
        hour: "numeric",
        minute: "numeric",
        hour12: false
      });
      const parts = formatter.format(now).split(":");
      localHour = parseInt(parts[0]);
      localMinute = parseInt(parts[1]);
    } catch (e) {
      // Fallback
    }

    const ampm = localHour >= 12 ? "PM" : "AM";
    const displayHour = localHour % 12 === 0 ? 12 : localHour % 12;
    const displayMinute = String(localMinute).padStart(2, "0");
    const localTimeStr = `${displayHour}:${displayMinute} ${ampm} ${timezone}`;

    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    let marketState = "Market Closed";
    if (isWeekend) {
      marketState = "Market Closed";
    } else {
      if (exchange === "IN") {
        const timeDecimal = localHour + localMinute / 60;
        if (timeDecimal >= 9.25 && timeDecimal <= 15.5) {
          marketState = "Market Open";
        } else {
          marketState = "Market Closed";
        }
      } else if (exchange === "UK") {
        const timeDecimal = localHour + localMinute / 60;
        if (timeDecimal >= 8.0 && timeDecimal <= 16.5) {
          marketState = "Market Open";
        } else {
          marketState = "Market Closed";
        }
      } else if (exchange === "JP") {
        const timeDecimal = localHour + localMinute / 60;
        if (timeDecimal >= 9.0 && timeDecimal <= 15.0) {
          marketState = "Market Open";
        } else {
          marketState = "Market Closed";
        }
      } else {
        const timeDecimal = localHour + localMinute / 60;
        if (timeDecimal >= 9.5 && timeDecimal <= 16.0) {
          marketState = "Market Open";
        } else if (timeDecimal >= 4.0 && timeDecimal < 9.5) {
          marketState = "Pre-Market";
        } else if (timeDecimal > 16.0 && timeDecimal <= 20.0) {
          marketState = "After Hours";
        } else {
          marketState = "Market Closed";
        }
      }
    }

    return { localTimeStr, marketState };
  };

  const handleAddRecToPortfolio = (st: any) => {
    const livePrice = quotes[st.symbol]?.price || st.avgBuyPrice || 100;
    const qty = st.qty || 1;
    const alreadyExists = portfolio.find(p => p.symbol === st.symbol);
    let updated: any[];
    if (alreadyExists) {
      updated = portfolio.map(p => p.symbol === st.symbol ? { ...p, qty: p.qty + qty } : p);
    } else {
      updated = [
        ...portfolio,
        {
          symbol: st.symbol,
          name: st.name,
          qty,
          avgBuyPrice: livePrice,
          logo: `https://logo.clearbit.com/${st.symbol.split(".")[0].toLowerCase()}.com`
        }
      ];
    }
    setPortfolio(updated);
    persistData("portfolio", updated);

    setNotifications(prev => [
      { id: Date.now(), text: `Added ${qty} shares of ${st.symbol} to your portfolio.`, unread: true },
      ...prev
    ]);
  };

  const handleReplaceHolding = (recStock: any, targetSymbol: string) => {
    let updated = portfolio.filter(p => p.symbol !== targetSymbol);
    const livePrice = quotes[recStock.symbol]?.price || recStock.avgBuyPrice || 100;
    const qty = recStock.qty || 1;
    
    updated = [
      ...updated,
      {
        symbol: recStock.symbol,
        name: recStock.name,
        qty,
        avgBuyPrice: livePrice,
        logo: `https://logo.clearbit.com/${recStock.symbol.split(".")[0].toLowerCase()}.com`
      }
    ];

    setPortfolio(updated);
    persistData("portfolio", updated);
    setReplacingRecStock(null);

    setNotifications(prev => [
      { id: Date.now(), text: `Replaced ${targetSymbol} with ${qty} shares of ${recStock.symbol} in your portfolio.`, unread: true },
      ...prev
    ]);
  };

const handleSaveCurrentPortfolio = (name: string) => {
    if (!name.trim()) return;
    const newPort = {
      id: Date.now().toString(),
      name,
      portfolio: [...portfolio],
      aiRecommendation: aiRecommendation ? { ...aiRecommendation } : null
    };
    const updatedList = [newPort, ...savedPortfolios.filter(p => p.name !== name)];
    setSavedPortfolios(updatedList);
    persistData("savedPortfolios", updatedList);
    setActivePortfolioName(name);
    persistData("activePortfolioName", name);
    setShowSavePortfolioModal(false);
    setNewPortfolioName("");
  };

  const handleLoadSavedPortfolio = (saved: any) => {
    setPortfolio(saved.portfolio);
    persistData("portfolio", saved.portfolio);
    setAiRecommendation(saved.aiRecommendation);
    persistData("aiRecommendation", saved.aiRecommendation);
    setActivePortfolioName(saved.name);
    persistData("activePortfolioName", saved.name);
  };

  const handleDeleteSavedPortfolio = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = savedPortfolios.filter(p => p.id !== id);
    setSavedPortfolios(updatedList);
    persistData("savedPortfolios", updatedList);
  };

  // ==================== LIVE PORTFOLIO TRACKER HANDLERS ====================
  const handleStockSearch = async (query: string) => {
    setStockSearchQuery(query);
    if (!query || query.trim().length === 0) {
      setStockSearchResults([]);
      return;
    }
    setStockSearchLoading(true);
    try {
      const res = await fetch(`/api/stock?action=search&query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setStockSearchResults(data || []);
      }
    } catch (err) {
      console.error("Error searching stocks:", err);
    } finally {
      setStockSearchLoading(false);
    }
  };

  const fetchQuote = async (symbol: string) => {
    try {
      const res = await fetch(`/api/stock?action=quote&symbol=${encodeURIComponent(symbol)}`);
      if (!res.ok) return;
      const data = await res.json();
      
      setQuotes(prev => {
        const prevQuote = prev[symbol];
        if (prevQuote && prevQuote.price !== data.price) {
          const status = data.price > prevQuote.price ? "up" : "down";
          setPriceUpdateStatus(prevStatus => ({ ...prevStatus, [symbol]: status }));
          
          setTimeout(() => {
            setPriceUpdateStatus(prevStatus => ({ ...prevStatus, [symbol]: null }));
          }, 1500);
        }
        return { ...prev, [symbol]: data };
      });
    } catch (err) {
      console.error(`Error fetching quote for ${symbol}:`, err);
    }
  };

  const handleAddStock = async (stock: any) => {
    if (portfolio.some(s => s.symbol === stock.symbol)) {
      setStockSearchQuery("");
      setStockSearchResults([]);
      return;
    }

    const newHolding = {
      symbol: stock.symbol,
      name: stock.name,
      qty: 1,
      avgBuyPrice: 0,
      logo: stock.logo || ""
    };

    const updatedPortfolio = [...portfolio, newHolding];
    setPortfolio(updatedPortfolio);
    persistData("portfolio", updatedPortfolio);

    // Initial fetch of quote
    await fetchQuote(stock.symbol);

    setStockSearchQuery("");
    setStockSearchResults([]);
  };

  const handleRemoveStock = (symbol: string) => {
    if (window.confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
      const updatedPortfolio = portfolio.filter(s => s.symbol !== symbol);
      setPortfolio(updatedPortfolio);
      persistData("portfolio", updatedPortfolio);

      setQuotes(prev => {
        const nextQuotes = { ...prev };
        delete nextQuotes[symbol];
        return nextQuotes;
      });
    }
  };

  const handleUpdateHolding = (symbol: string, qty: number, avgBuyPrice: number) => {
    const updatedPortfolio = portfolio.map(s => {
      if (s.symbol === symbol) {
        return { ...s, qty, avgBuyPrice };
      }
      return s;
    });
    setPortfolio(updatedPortfolio);
    persistData("portfolio", updatedPortfolio);
  };

  const handleOpenChart = async (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setSelectedStockHistory(null);
    setHistoryLoading(true);
    setIsChartModalOpen(true);
    await fetchChartHistory(symbol, "1M");
  };

  const fetchChartHistory = async (symbol: string, range: string) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/stock?action=history&symbol=${encodeURIComponent(symbol)}&range=${range}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedStockHistory(data || []);
        setSelectedStockHistoryRange(range);
      }
    } catch (err) {
      console.error(`Error fetching history for ${symbol}:`, err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Poll all quotes when portfolio symbols change
  useEffect(() => {
    if (portfolio.length === 0) return;
    
    const fetchAll = () => {
      portfolio.forEach(item => fetchQuote(item.symbol));
    };

    fetchAll();
    const intervalId = setInterval(fetchAll, 20000); // Poll every 20s

    return () => clearInterval(intervalId);
  }, [portfolio.map(p => p.symbol).join(",")]);

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

    // Dynamic Multistage Thinking Pipeline
    const stages = [
      "Understanding your finances...",
      "Analyzing investments...",
      "Checking market conditions...",
      "Building recommendation..."
    ];

    let currentStageIdx = 0;
    setMultistageThinking(stages[0]);

    const interval = setInterval(() => {
      currentStageIdx++;
      if (currentStageIdx < stages.length) {
        setMultistageThinking(stages[currentStageIdx]);
      } else {
        clearInterval(interval);
      }
    }, 600);

    // Formulate context-aware response after thinking completes
    setTimeout(() => {
      setMultistageThinking("");
      
      let replyText = "";
      const query = text.toLowerCase().trim();

      // Dashboard context extraction
      const totalSipInvestments = portfolio.reduce((acc, item) => acc + (parseFloat(item.qty || 0) * parseFloat(quotes[item.symbol]?.price || item.avgBuyPrice || 0)), 0);
      const fdCount = fixedDeposits.length;
      
      const netWorthFormatted = calculatedNetWorth.toLocaleString("en-IN", { style: "currency", currency: activeCurrency.code, maximumFractionDigits: 0 });
      const savingsFormatted = calculatedMonthlySavings.toLocaleString("en-IN", { style: "currency", currency: activeCurrency.code, maximumFractionDigits: 0 });
      const subSpendFormatted = monthlySubscriptionSpend.toLocaleString("en-IN", { style: "currency", currency: activeCurrency.code, maximumFractionDigits: 0 });
      const activeSubsCount = subscriptions.filter(s => s.status === "active").length;
      const goalsCount = goals.length;
      const totalGoalTarget = goals.reduce((acc, curr) => acc + curr.target, 0).toLocaleString("en-IN", { style: "currency", currency: activeCurrency.code, maximumFractionDigits: 0 });
      const totalGoalCurrent = goals.reduce((acc, curr) => acc + curr.current, 0).toLocaleString("en-IN", { style: "currency", currency: activeCurrency.code, maximumFractionDigits: 0 });

      if (query.includes("hello") || query.includes("hi ") || query.includes("hey") || query.includes("greet")) {
        replyText = `Hello! I am Jarvis, your Fincody AI Financial Co-pilot. I analyze your live Net Worth (${netWorthFormatted}), Monthly Savings (${savingsFormatted}), and active subscriptions in real-time. Ask me anything about your investments, goals, or financial strategy!`;
      } else if (query.includes("how does") && (query.includes("app") || query.includes("work") || query.includes("use") || query.includes("fincody"))) {
        replyText = `Fincody is an AI-powered financial operating system. Here&apos;s what you can do:
1. **Wealth Engine**: Monitor your live Net Worth (${netWorthFormatted}), Fixed Deposits, Gold, NPS, and Equities.
2. **Goal Engine**: Simulate SIPs toward targets like Emergency Funds and Retirement.
3. **Audit Subscriptions**: Automatically detect and cancel overlapping subscriptions (current spend: ${subSpendFormatted}/mo).
4. **Secure Vault**: Upload tax, insurance, or asset documents for neural scanner optimization.`;
      } else if (query.includes("inflation") || query.includes("interest rate") || query.includes("repo") || query.includes("rbi")) {
        replyText = `Inflation erodes the purchasing power of your cash. With your current Net Worth at ${netWorthFormatted}, keeping money in low-yield savings accounts loses value. Fincody recommends allocating surplus monthly savings (${savingsFormatted}/mo) into bank Fixed Deposits (earning dynamic rates) or equity indexes to beat inflation.`;
      } else if (query.includes("mutual fund") || query.includes("sip") || query.includes("invest") || query.includes("index")) {
        replyText = `Passive mutual funds (like Nifty 50 Index ETFs) are the most efficient way to build long-term wealth. Auto-investing even a small portion of your monthly savings (${savingsFormatted}/mo) via a systematic investment plan (SIP) leverages rupee cost averaging. You are currently tracking ${goalsCount} active goal engines!`;
      } else if (query.includes("crypto") || query.includes("bitcoin") || query.includes("btc") || query.includes("ethereum")) {
        replyText = `Cryptocurrencies are highly volatile speculative assets. While they offer high potential yields, Fincody AI suggests allocating no more than 3% to 5% of your total Net Worth (${netWorthFormatted}) to crypto to protect your financial solvency.`;
      } else if (query.includes("loan") || query.includes("debt") || query.includes("credit card") || query.includes("emi")) {
        replyText = `Paying off high-interest debt is equivalent to earning a guaranteed tax-free return. Before expanding your investment portfolio, Fincody recommends clearing credit card debt and keeping credit utilization below 30% to secure your Fincody health score!`;
      } else if (query.includes("compound") || query.includes("rule of 72") || query.includes("interest")) {
        replyText = `Compounding is the 8th wonder of the world. Under the Rule of 72, dividing 72 by your expected interest rate gives the number of years to double your money. E.g., at 8% return, your wealth doubles in 9 years. Jarvis is simulating this compounding model across your goals!`;
      } else if (query.includes("security") || query.includes("safe") || query.includes("encryption") || query.includes("soc2") || query.includes("private")) {
        replyText = `Fincody uses 256-bit AES end-to-end encryption for your secure vault. All document scanning runs client-side using neural parsers. Your financial data is protected by SOC2 Type II compliance controls.`;
      } else if (query.includes("car") || query.includes("lakh")) {
        replyText = `Analyzing a ₹15 Lakh car purchase. Based on your current Monthly Savings of ${savingsFormatted} and Net Worth of ${netWorthFormatted}, you have the baseline capacity. However, your emergency cushion would dip. I suggest keeping your index fund SIP running and deferring the purchase for 3 months to avoid equity dilution. [SIMULATION: CAR]`;
      } else if (query.includes("mba") || query.includes("career") || query.includes("study")) {
        replyText = `Simulating a ₹30 Lakh MBA compared to your current savings. Projected post-graduation salary raise is estimated to increase your compound savings by 65%. Your Net Worth is projected to rise by +₹1.48 Crores by Year 10. [SIMULATION: MBA]`;
      } else if (query.includes("subscription") || query.includes("netflix") || query.includes("save") || query.includes("spotify") || query.includes("expense")) {
        const expensiveSub = [...subscriptions].filter(s => s.status === "active").sort((a, b) => b.price - a.price)[0];
        replyText = `Your active subscriptions total ${activeSubsCount} services, costing ${subSpendFormatted}/month. The most expensive is ${expensiveSub ? expensiveSub.name : "Adobe"} at ${expensiveSub ? format(expensiveSub.price) : "₹4,220"}/month. Canceling it saves ${expensiveSub ? format(expensiveSub.price) : "₹4,220"}/mo, which grows to over ₹2 Lakhs in 10 years if auto-invested in equities.`;
      } else if (query.includes("net worth") || query.includes("assets") || query.includes("wealth")) {
        replyText = `Your current live Net Worth is **${netWorthFormatted}**. Active assets breakdown: Stocks & ETFs (${format(totalSipInvestments + etfsTotalValue)}), Fixed Deposits (${fdCount} accounts, totaling ${format(fdsTotalValue)}), PPF balance (${format(ppfTotalValue)}), and NPS corpus (${format(npsData.corpus)}). We recommend maintaining a 20% liquid cushion.`;
      } else if (query.includes("insurance") || query.includes("vault")) {
        replyText = "I found active policies in your secure vault. Alert: Your ICICI Auto Insurance renewal is coming up in August. There is a redundant coverage overlap in premium payouts. I suggest adjusting deductibles under your Fincody Insurance Engine.";
      } else if (query.includes("portfolio") || query.includes("stock") || query.includes("rebalance")) {
        const bestPerfSymbol = portfolio.length > 0 ? portfolio[0].symbol : "NIFTYBEES";
        replyText = `Your stock portfolio has an active valuation of ${format(totalSipInvestments + etfsTotalValue)}. The top holding is ${bestPerfSymbol}. I recommend rebalancing 15% of your equities into Fixed Deposits (earning ${format(fdsTotalValue)} accrued interest) to lock in gains and mitigate volatility.`;
      } else if (query.includes("tax") || query.includes("nps") || query.includes("ppf") || query.includes("80c")) {
        replyText = `You can save up to ₹23,000 in taxes under Sec 80C by fully utilizing your NPS annual co-pay (currently at ${format(npsData.personalMonthly)}/month) and maximizing your PPF contribution limit (currently ${format(ppfData.balance)} total corpus).`;
      } else if (query.includes("gold") || query.includes("metal")) {
        replyText = `You have gold holdings with live valuation of ${format(goldTotalValue)}. Spot gold rate is currently ${format(spotGoldPrice)}/gram. Maintaining a 5-10% portfolio allocation in gold is recommended as a safe-haven hedge.`;
      } else if (query.includes("goal") || query.includes("emergency") || query.includes("retirement")) {
        replyText = `You are tracking ${goalsCount} financial goals (Total Target: ${totalGoalTarget}, Accumulated: ${totalGoalCurrent}). Your progress is at ${((goals.reduce((acc, c) => acc + c.target, 0) / (goals.reduce((acc, c) => acc + c.target, 0) || 1)) * 100).toFixed(0)}%. I suggest setting a monthly SIP of ${format(5000)} toward your emergency fund.`;
      } else {
        replyText = `I have analyzed your query about "${text}". To optimize your live Net Worth of ${netWorthFormatted}, Fincody AI suggests allocating surplus cash (${savingsFormatted}/mo) into rebalanced Fixed Deposits or Index Fund SIPs to maximize passive compounding yields.`;
      }

      // Escape single quotes for JSX representation safety
      replyText = replyText.replace(/&apos;/g, "'");

      // Escape single quotes for JSX representation safety
      replyText = replyText.replace(/&apos;/g, "'");

      const aiMsg: Message = {
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      };
      
      setChatMessages(prev => {
        const nextMsgs = [...prev, aiMsg];
        // Save chat memory
        localStorage.setItem("fincody_ai_memory", JSON.stringify(nextMsgs.slice(-4)));
        return nextMsgs;
      });

      setIsTyping(false);

      // Web Speech API Voice synthesis
      if (voiceMode) {
        try {
          window.speechSynthesis.cancel();
          // Remove simulation tags from spoken voice text
          const spokenText = replyText.replace(/\[SIMULATION:[^\]]*\]/g, "");
          const utterance = new SpeechSynthesisUtterance(spokenText);
          utterance.onstart = () => setVoiceSpeaking(true);
          utterance.onend = () => setVoiceSpeaking(false);
          window.speechSynthesis.speak(utterance);
        } catch (e) {}
      }
    }, 2400);
  };

  
  const handleDocumentUpload = (file: File) => {
    setScanAnimation(true);
    setTimeout(() => {
      setScanAnimation(false);
      const docName = file.name;
      const docType = file.name.split('.').pop()?.toUpperCase() || "PDF";
      
      const newDoc = {
        id: "doc-" + Date.now(),
        name: docName,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        type: docType
      };

      setDocuments(prev => {
        const updated = [newDoc, ...prev];
        persistData("documents", updated);
        return updated;
      });

      // Add a summary reply inside the chat
      const summaryText = `📄 Document Scanned: **${docName}**
      
Key Insights:
• Verified salary/deposit flows and premium receipts.
• Identified a direct savings opportunity of ₹3,400 by adjusting tax slab projections.
• Verified zero policy lapses.

Red Flags:
• Overlapping coverage identified under auto parameters.

Savings Recommendation:
• Swap to digital tax shield configuration (potential +₹23,000 yearly savings).`;

      setChatMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: summaryText,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
        }
      ]);

      // If voice mode is active, read the summary back using the Web Speech API
      if (voiceMode) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("Document scanned successfully. I found a direct savings opportunity of 3400 rupees by adjusting your tax projections.");
          utterance.onstart = () => setVoiceSpeaking(true);
          utterance.onend = () => setVoiceSpeaking(false);
          window.speechSynthesis.speak(utterance);
        } catch (e) {}
      }

    }, 2000);
  };

  // Interactive projections simulation widget
  const SimulationWidget = ({ type }: { type: string }) => {
    // Slider values
    const [sipAmt, setSipAmt] = useState(type === "MBA" ? 10000 : 5000);
    const [sipYears, setSipYears] = useState(15);
    
    // Calculate dynamic projections
    const monthlyRate = 0.12 / 12; // 12% annual rate
    const totalMonths = sipYears * 12;
    let futureVal = 0;
    for (let i = 1; i <= totalMonths; i++) {
      futureVal += sipAmt * Math.pow(1 + monthlyRate, totalMonths - i);
    }
    const principal = sipAmt * totalMonths;
    const wealthGain = futureVal - principal;

    const chartData = [];
    for (let y = 1; y <= sipYears; y++) {
      let yBal = 0;
      const yMonths = y * 12;
      for (let m = 1; m <= yMonths; m++) {
        yBal += sipAmt * Math.pow(1 + monthlyRate, yMonths - m);
      }
      chartData.push({
        year: `Yr ${y}`,
        Principal: Math.round(sipAmt * yMonths),
        Wealth: Math.round(yBal)
      });
    }

    return (
      <div className="p-4 rounded-xl border border-blue-500/10 bg-slate-950/40 mt-3 flex flex-col gap-3.5">
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">📊 Fincody Wealth Simulator</span>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>${type === "MBA" ? "Monthly Savings Allocation" : "Monthly SIP Increment"}</span>
            <span className="text-white font-mono">₹${sipAmt.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="25000"
            step="1000"
            value={sipAmt}
            onChange={(e) => setSipAmt(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>Simulation Tenure</span>
            <span className="text-white font-mono">${sipYears} Years</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            value={sipYears}
            onChange={(e) => setSipYears(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="h-28 w-full min-w-0 mt-1">
          <ResponsiveContainer width="99%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="year" stroke="#475569" fontSize={8} tickLine={false} />
              <YAxis stroke="#475569" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 100000 ? (val/100000).toFixed(1) + 'L' : val} />
              <Tooltip contentStyle={{ fontSize: 9, background: "#0f172a", border: "1px solid #1e293b", color: "#f8fafc" }} />
              <Area type="monotone" dataKey="Wealth" stroke="#3b82f6" fillOpacity={0.06} strokeWidth={1.5} fill="#3b82f6" />
              <Area type="monotone" dataKey="Principal" stroke="#64748b" fillOpacity={0.02} strokeWidth={1} fill="#64748b" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-[10px] border-t border-blue-500/10 pt-2.5">
          <div>
            <span className="text-slate-500 font-semibold block">Total Invested</span>
            <span className="font-bold text-white font-mono">₹${Math.round(principal).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Projected Wealth</span>
            <span className="font-bold text-emerald-500 font-mono">₹${Math.round(futureVal).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
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

          {authSuccess ? (
            <div className="py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-5 shadow-lg shadow-emerald-500/10 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-[var(--text-color)] tracking-tight mb-2 animate-pulse">
                Account Created!
              </h2>
              <p className="text-sm text-[var(--text-subtitle)] leading-relaxed mb-6">
                Your Fincody profile has been successfully registered. 
                <span className="block mt-2 font-semibold text-emerald-400">Please verify your email via the confirmation link sent to your inbox to log in.</span>
              </p>
              <button
                onClick={() => {
                  setAuthSuccess("");
                  setAuthMode("signin");
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Go to Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
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

              <form onSubmit={authMode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
                {authMode === "signup" && (
                  <div className="text-left">
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
                    />
                  </div>
                )}

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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl pl-4 pr-11 py-3 text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors p-1"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {authMode === "signin" && (
                  <div className="flex items-center justify-between mt-2 px-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-[var(--text-color)] transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-[var(--border-color)] bg-[var(--nav-bg)] text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="text-[11px] font-semibold">Remember email address</span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer mt-6"
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
            </>
          )}
        </div>
      </div>
    );
  }

  // Dynamically calculated financial metrics incorporating all assets & entries (safely protected from NaN values)
  const equitiesVal = (portfolio || []).reduce((acc: number, curr: any) => acc + (parseFloat(curr.qty || 0) * parseFloat(quotes[curr.symbol]?.price || curr.avgBuyPrice || 0)), 0);
  const fdsTotalValue = (fixedDeposits || []).reduce((acc: number, curr: any) => {
    const start = new Date(curr.startDate || new Date());
    const yearsElapsed = Math.max(0, (new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
    const rate = parseFloat(curr.rate || curr.interestRate || 0);
    const principal = parseFloat(curr.principal || 0);
    const interest = principal * (rate / 100) * yearsElapsed;
    return acc + principal + (isNaN(interest) ? 0 : interest);
  }, 0);
  const ppfTotalValue = parseFloat(ppfData?.balance || 0);
  const npsTotalValue = parseFloat(npsData?.corpus || 0);
  const goldTotalValue = (goldHoldings || []).reduce((acc: number, curr: any) => {
    const livePrice = spotGoldPrice || 7420;
    const grams = parseFloat(curr.grams || 0);
    return acc + (grams * livePrice);
  }, 0);
  const etfsTotalValue = (etfHoldings || []).reduce((acc: number, curr: any) => acc + (parseFloat(curr.units || 0) * parseFloat(quotes[curr.symbol]?.price || curr.avgPrice || 0)), 0);
  const bondsTotalValue = (bondHoldings || []).reduce((acc: number, curr: any) => {
    const start = new Date(curr.startDate || new Date());
    const yearsElapsed = Math.max(0, (new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
    const couponRate = parseFloat(curr.couponRate || 0);
    const faceValue = parseFloat(curr.faceValue || 0);
    const interest = faceValue * (couponRate / 100) * yearsElapsed;
    return acc + faceValue + (isNaN(interest) ? 0 : interest);
  }, 0);

  const totalInvestmentValue = equitiesVal + fdsTotalValue + ppfTotalValue + npsTotalValue + goldTotalValue + etfsTotalValue + bondsTotalValue;
  const baselineCash = parseFloat(manualNetWorth) || 1200000;
  const calculatedNetWorth = baselineCash + totalInvestmentValue;

  const salaryVal = parseFloat(manualSalary) || 185000;
  const emiVal = parseFloat(manualEMI) || 28000;
  const otherExpVal = parseFloat(manualOtherExpenses) || 45000;
  const calculatedMonthlySavings = Math.max(0, salaryVal - emiVal - otherExpVal - monthlySubscriptionSpend);
  
  const calculatedGoalContributions = goals.reduce((acc: number, curr: any) => acc + curr.current, 0);

  // Dynamic Financial Health Score calculations based on live vault indicators
  const savingsRateRatio = salaryVal > 0 ? (calculatedMonthlySavings / salaryVal) : 0;
  const healthSavingsScore = Math.min(40, Math.round(savingsRateRatio * 100 * 1.3));
  const healthEmergencyGoal = (goals || []).find(g => g.name.toLowerCase().includes("emergency"));
  const healthEmergencyRatio = healthEmergencyGoal ? (healthEmergencyGoal.current / healthEmergencyGoal.target) : 0.85;
  const healthEmergencyScore = Math.min(30, Math.round(healthEmergencyRatio * 30));
  const activeSubsCount = (subscriptions || []).filter(s => s.status === "active").length;
  const healthSubScore = Math.max(10, 30 - (activeSubsCount * 3.5));
  const dynamicCalculatedHealthScore = Math.min(99, Math.max(35, Math.round(healthSavingsScore + healthEmergencyScore + healthSubScore)));

  // Helper to format Y-Axis compactly
  const formatYAxisTick = (val: number) => {
    const valueInINR = val * 100000;
    const converted = convert(valueInINR);
    if (activeCurrency.code === "INR") {
      if (converted >= 10000000) {
        return `${activeCurrency.symbol}${(converted / 10000000).toFixed(1)}Cr`;
      }
      return `${activeCurrency.symbol}${(converted / 100000).toFixed(0)}L`;
    } else {
      if (converted >= 1000000) {
        return `${activeCurrency.symbol}${(converted / 1000000).toFixed(1)}M`;
      }
      if (converted >= 1000) {
        return `${activeCurrency.symbol}${(converted / 1000).toFixed(0)}K`;
      }
      return `${activeCurrency.symbol}${converted.toFixed(0)}`;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] flex flex-col md:flex-row relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden h-16 glass-panel border-b border-[var(--border-color)] flex items-center justify-between px-6 z-30">
        <Link href="/" className="flex items-center gap-2">
          <FincodyLogo variant="mobile" />
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
              <FincodyLogo variant="compact" />
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
              {user?.user_metadata?.full_name 
                ? user.user_metadata.full_name.slice(0, 2).toUpperCase() 
                : (user?.email ? user.email.slice(0, 2).toUpperCase() : "AV")}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-[var(--text-color)] truncate">
                {user?.user_metadata?.full_name ?? (user?.email ? user.email.split("@")[0] : "User")}
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
            {syncStatus === "syncing" && (
              <div className="hidden sm:flex items-center gap-1 bg-blue-500/10 text-blue-500 dark:text-blue-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Saving to Cloud...
              </div>
            )}
            {syncStatus === "synced" && (
              <div className="hidden sm:flex items-center gap-1 bg-[#10b981]/10 text-emerald-500 dark:text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Cloud Synced
              </div>
            )}
            {syncStatus === "error" && (
              <div className="hidden sm:flex items-center gap-1 bg-rose-500/10 text-rose-500 dark:text-rose-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-rose-500/20" title={syncErrorMessage}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" /> Sync Error: {syncErrorMessage}
              </div>
            )}
            {syncStatus === "guest" && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-500/10 text-slate-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-slate-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Guest Mode (Local)
              </div>
            )}
            
            {/* Currency Ribbon in the topmost header row next to sync indicators */}
            <div className="ml-2 scale-95 origin-left">
              <CurrencyRibbon variant="compact" />
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

            {/* Circular Profile Avatar (Always Visible in Header) */}
            <button
              onClick={() => {
                setProfileEditName(user?.user_metadata?.full_name ?? "");
                setShowProfileModal(true);
              }}
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center transition-all shadow-md shadow-blue-500/20 hover:scale-105 cursor-pointer border border-blue-400/20"
              title="View & Edit Profile"
            >
              {user?.user_metadata?.full_name 
                ? user.user_metadata.full_name.slice(0, 1).toUpperCase() 
                : (user?.email ? user.email.slice(0, 1).toUpperCase() : "U")}
            </button>

            {/* Smart Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => setFinancialNotificationsOpen(true)}
                className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/5 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-all relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {financialNotifications.some(n => n.status === "unread") && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow shadow-red-500/50 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {financialNotificationsOpen && (
                  <>
                    {/* Backdrop Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setFinancialNotificationsOpen(false)}
                      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[99998]"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 220 }}
                      className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-slate-950/90 border-l border-blue-500/15 backdrop-blur-xl shadow-2xl p-6 overflow-y-auto z-[99999] text-left flex flex-col justify-between"
                    >
                      <div className="flex flex-col gap-5">
                        
                        {/* Header Title & Summary */}
                        <div className="flex justify-between items-center border-b border-blue-500/10 pb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                              <Bell className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h3 className="text-sm font-black text-white uppercase tracking-wider">Alert Center</h3>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Real-time Financial Events</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setFinancialNotificationsOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Top Summary Bar */}
                        <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-slate-900/30 border border-blue-500/5 text-[10px] font-bold">
                          <div className="py-1">
                            <span className="text-slate-500 block uppercase text-[8px] tracking-wider">Critical</span>
                            <span className="text-red-400 font-mono mt-0.5 block text-xs">{financialNotifications.filter(n => n.priority === "Critical" && n.status !== "completed").length} pending</span>
                          </div>
                          <div className="py-1 border-x border-blue-500/5">
                            <span className="text-slate-500 block uppercase text-[8px] tracking-wider">Upcoming</span>
                            <span className="text-blue-400 font-mono mt-0.5 block text-xs">{financialNotifications.filter(n => n.section === "Upcoming" && n.status !== "completed").length} pending</span>
                          </div>
                          <div className="py-1">
                            <span className="text-slate-500 block uppercase text-[8px] tracking-wider">Completed</span>
                            <span className="text-emerald-400 font-mono mt-0.5 block text-xs">{financialNotifications.filter(n => n.status === "completed").length} processed</span>
                          </div>
                        </div>

                        {/* Filters Category Chips */}
                        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
                          {["All", "Bills", "Investments", "Subscriptions", "Insurance", "Loans", "Taxes", "Income", "Portfolio", "Markets"].map((cat) => {
                            const isSelected = selectedNotifFilter === cat || (cat === "All" && !selectedNotifFilter);
                            return (
                              <button
                                key={cat}
                                onClick={() => setSelectedNotifFilter(cat === "All" ? null : cat)}
                                className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                                  isSelected 
                                    ? "bg-blue-600 border-blue-500 text-white shadow shadow-blue-500/10" 
                                    : "bg-slate-900/40 border-blue-500/5 text-slate-400 hover:text-slate-200"
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                          <input
                            type="text"
                            value={notifSearchQuery}
                            onChange={(e) => setNotifSearchQuery(e.target.value)}
                            placeholder="Search alerts, bills, or dates..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/40 border border-blue-500/5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                          />
                          {notifSearchQuery && (
                            <button onClick={() => setNotifSearchQuery("")} className="absolute right-3 top-2.5 text-slate-500 hover:text-white">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Notifications Lists */}
                        <div className="flex-1 overflow-y-auto max-h-[58vh] scrollbar-none flex flex-col gap-4">
                          {(() => {
                            // Filter logic
                            const filtered = financialNotifications.filter(n => {
                              const matchCat = !selectedNotifFilter || n.category === selectedNotifFilter;
                              const matchSearch = !notifSearchQuery || n.title.toLowerCase().includes(notifSearchQuery.toLowerCase()) || n.description.toLowerCase().includes(notifSearchQuery.toLowerCase());
                              return matchCat && matchSearch;
                            });

                            if (filtered.length === 0) {
                              return (
                                <div className="flex flex-col items-center justify-center text-center py-12 text-slate-500">
                                  <span className="text-4xl animate-bounce mb-3">🎉</span>
                                  <span className="text-sm font-black text-white uppercase tracking-wider block">You're all caught up!</span>
                                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-normal">
                                    No financial alerts at the moment. Everything looks up to date.
                                  </p>
                                </div>
                              );
                            }

                            // Grouping logic
                            const groups: Record<string, FinancialNotification[]> = {
                              "Today": [],
                              "Tomorrow": [],
                              "This Week": [],
                              "Next Month": [],
                              "Completed": []
                            };

                            filtered.forEach(n => {
                              if (n.status === "completed") {
                                groups["Completed"].push(n);
                              } else {
                                groups[n.timeGroup].push(n);
                              }
                            });

                            return Object.keys(groups).map(grp => {
                              const list = groups[grp];
                              if (list.length === 0) return null;
                              const isCollapsed = collapsedNotifGroups[grp];

                              return (
                                <div key={grp} className="flex flex-col gap-2">
                                  <button
                                    onClick={() => toggleNotifGroup(grp)}
                                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-blue-500/5 pb-1 cursor-pointer"
                                  >
                                    <span>{grp} ({list.length})</span>
                                    {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  </button>

                                  {!isCollapsed && (
                                    <div className="flex flex-col gap-2.5">
                                      {list.map(n => {
                                        const CatIcon = getCategoryIcon(n.category);
                                        const isUnread = n.status === "unread";
                                        const priorityColor = n.priority === "Critical" 
                                          ? "border-l-4 border-l-red-500" 
                                          : n.priority === "High" 
                                            ? "border-l-4 border-l-orange-500"
                                            : n.priority === "Medium"
                                              ? "border-l-4 border-l-yellow-500"
                                              : "border-l-4 border-l-emerald-500";

                                        return (
                                          <div
                                            key={n.id}
                                            className={`p-3.5 rounded-xl border bg-slate-900/10 hover:bg-slate-900/30 transition-all flex flex-col gap-3 relative overflow-hidden group ${priorityColor} ${
                                              isUnread ? "border-blue-500/25 bg-blue-500/[0.02]" : "border-blue-500/5"
                                            }`}
                                          >
                                            <div className="flex justify-between items-start gap-3">
                                              <div className="flex gap-2.5 items-start">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800/40 flex items-center justify-center text-slate-400 mt-0.5">
                                                  <CatIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                  <h4 className="text-xs font-black text-white leading-snug">
                                                    {n.title}
                                                  </h4>
                                                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-semibold">
                                                    {n.description}
                                                  </p>
                                                </div>
                                              </div>

                                              {n.logo && (
                                                <span className="text-[8px] font-black uppercase text-slate-500 bg-slate-900 border border-blue-500/5 px-1.5 py-0.5 rounded shrink-0">
                                                  {n.logo}
                                                </span>
                                              )}
                                            </div>

                                            {/* Time Display */}
                                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                                              <span>📅 {n.scheduledTime}</span>
                                              <span className={n.priority === "Critical" ? "text-red-400" : "text-blue-400"}>
                                                ⏳ {n.timeRemaining}
                                              </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-1.5 justify-end border-t border-blue-500/5 pt-2">
                                              {isUnread && (
                                                <button
                                                  onClick={() => handleMarkReadNotif(n.id)}
                                                  className="px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-wider cursor-pointer"
                                                >
                                                  Mark Read
                                                </button>
                                              )}
                                              {n.status !== "completed" && (
                                                <>
                                                  <button
                                                    onClick={() => handleSnoozeNotif(n.id)}
                                                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-wider cursor-pointer"
                                                  >
                                                    Snooze
                                                  </button>
                                                  <button
                                                    onClick={() => handleCompleteNotif(n.id)}
                                                    className="px-2.5 py-1 rounded bg-emerald-600/15 hover:bg-emerald-600 text-[9px] font-black text-emerald-400 hover:text-white uppercase tracking-wider cursor-pointer"
                                                  >
                                                    Mark Paid
                                                  </button>
                                                </>
                                              )}
                                              <button
                                                onClick={() => handleDismissNotif(n.id)}
                                                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[9px] font-black text-rose-400 uppercase tracking-wider cursor-pointer"
                                              >
                                                Dismiss
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>

                      </div>

                      {/* Footer Info */}
                      <div className="border-t border-blue-500/10 pt-4 text-center text-[10px] text-slate-500">
                        Never miss an important event. Real-time updates active.
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Health Score Page Opener */}
            <button
              onClick={() => setShowScoreModal(true)}
              className="flex items-center gap-2 border border-blue-500/20 rounded-xl px-3 py-1.5 bg-slate-900/5 hover:bg-slate-500/5 hover:border-blue-500/40 transition-all cursor-pointer shadow-md shadow-blue-500/5 group"
              title="View Financial Health Insights"
            >
              <div className="w-7 h-7 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-emerald-500 group-hover:scale-105 transition-transform">
                {dynamicCalculatedHealthScore}
              </div>
              <span className="text-xs font-bold text-[var(--text-color)] hidden sm:inline">Score</span>
            </button>
          </div>
        </header>



        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 font-sans">
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
                {/* Micro Widgets with inside-card flipping overlay tooltips to prevent overlap */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Net Worth Widget */}
                  <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden group/card min-h-[125px]">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                        Net Worth
                        <button 
                          onClick={() => setActiveTooltip("netWorth")}
                          className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Live</span>
                    </div>
                    
                    <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">
                      <RollingNumber value={calculatedNetWorth} />
                    </div>
                    <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1.5 font-bold flex-wrap">
                      +14.2% <TrendingUp className="w-3.5 h-3.5" /> 
                      <span className="text-slate-500 font-semibold">
                        As of {(() => {
                          try {
                            const date = new Date(calculationStartDate);
                            if (isNaN(date.getTime())) return calculationStartDate;
                            return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                          } catch (e) {
                            return calculationStartDate;
                          }
                        })()}
                      </span>
                    </div>

                    <AnimatePresence>
                      {activeTooltip === "netWorth" && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-50 p-4 rounded-2xl border border-blue-500/20 bg-slate-950/95 backdrop-blur flex flex-col justify-between text-[11px]"
                        >
                          <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
                            <span className="font-bold text-white uppercase tracking-wider text-[9px]">Net Worth Crux</span>
                            <button onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800">✕</button>
                          </div>
                          <p className="text-slate-300 leading-normal my-1">
                            Sum of cash (${format(baselineCash)}) and active assets (${format(totalInvestmentValue)}: Equities, Gold, FDs, NPS, PPF, Bonds).
                          </p>
                          <div className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider border-t border-slate-900 pt-1">
                            Calculated since: ${calculationStartDate}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Monthly Savings Widget */}
                  <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden group/card min-h-[125px]">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                        Monthly Savings
                        <button 
                          onClick={() => setActiveTooltip("monthlySavings")}
                          className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">
                      <RollingNumber value={calculatedMonthlySavings} />
                    </div>
                    <div className="text-xs text-[var(--text-subtitle)] mt-2 font-semibold">
                      ${((calculatedMonthlySavings / (salaryVal || 1)) * 100).toFixed(1)}% <span className="text-slate-500">savings rate</span>
                    </div>

                    <AnimatePresence>
                      {activeTooltip === "monthlySavings" && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-50 p-4 rounded-2xl border border-blue-500/20 bg-slate-950/95 backdrop-blur flex flex-col justify-between text-[11px]"
                        >
                          <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
                            <span className="font-bold text-white uppercase tracking-wider text-[9px]">Savings Formula</span>
                            <button onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800">✕</button>
                          </div>
                          <p className="text-slate-300 leading-normal my-1">
                            Formula: <strong>Salary - EMIs - Other Expenses - Subscriptions</strong>.<br />
                            Surplus wealth compounded in rebalanced assets.
                          </p>
                          <div className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider border-t border-slate-900 pt-1">
                            Calculating starting: ${calculationStartDate}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Active Subscriptions Widget */}
                  <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden group/card min-h-[125px]">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                        Subscription Spend
                        <button 
                          onClick={() => setActiveTooltip("subscriptions")}
                          className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">
                      <RollingNumber value={monthlySubscriptionSpend} />
                    </div>
                    <div className="text-xs text-rose-500 mt-2 flex items-center gap-1 font-bold">
                      -2.4% <TrendingDown className="w-3.5 h-3.5" /> <span className="text-slate-500 font-semibold">from last month</span>
                    </div>

                    <AnimatePresence>
                      {activeTooltip === "subscriptions" && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-50 p-4 rounded-2xl border border-blue-500/20 bg-slate-950/95 backdrop-blur flex flex-col justify-between text-[11px]"
                        >
                          <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
                            <span className="font-bold text-white uppercase tracking-wider text-[9px]">Subscription Spend</span>
                            <button onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800">✕</button>
                          </div>
                          <p className="text-slate-300 leading-normal my-1">
                            Total rolling spend across all active digital assets. Canceling unused seats recovers monthly liquid margins.
                          </p>
                          <div className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider border-t border-slate-900 pt-1">
                            Calculated dynamically on rolling basis
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Goal Contributions Widget */}
                  <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden group/card min-h-[125px]">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                        Goal Contributions
                        <button 
                          onClick={() => setActiveTooltip("goals")}
                          className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">
                      <RollingNumber value={calculatedGoalContributions} />
                    </div>
                    <div className="text-xs text-blue-500 mt-2 font-semibold">
                      {goals.length} goals <span className="text-slate-500 font-semibold">actively tracked</span>
                    </div>

                    <AnimatePresence>
                      {activeTooltip === "goals" && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-50 p-4 rounded-2xl border border-blue-500/20 bg-slate-950/95 backdrop-blur flex flex-col justify-between text-[11px]"
                        >
                          <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
                            <span className="font-bold text-white uppercase tracking-wider text-[9px]">Goal Balance</span>
                            <button onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800">✕</button>
                          </div>
                          <p className="text-slate-300 leading-normal my-1">
                            Accumulated value across all retirement, car, and emergency engine goals. Shows progress against targets.
                          </p>
                          <div className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider border-t border-slate-900 pt-1">
                            Refreshed since initial goal creation dates
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Net Worth Chart & Asset Allocation */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Chart */}
                  <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Asset Growth Over Time</span>
                        <span className="text-xs text-slate-500 block">Values in {activeCurrency.code}</span>
                      </div>

                      {/* Start Year / End Year Selectors */}
                      <div className="flex items-center gap-2 bg-slate-900/40 p-1.5 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-color)]">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">From:</span>
                          <input 
                            type="number"
                            min="2020"
                            max="2100"
                            value={startYear}
                            onChange={(e) => {
                              const val = Math.max(2020, parseInt(e.target.value) || 2026);
                              setStartYear(val);
                              persistData("startYear", val);
                            }}
                            className="w-14 bg-transparent text-center focus:outline-none text-blue-500"
                          />
                        </div>
                        <div className="w-px h-3 bg-slate-800" />
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">To:</span>
                          <input 
                            type="number"
                            min="2020"
                            max="2100"
                            value={endYear}
                            onChange={(e) => {
                              const val = Math.max(startYear, parseInt(e.target.value) || 2040);
                              setEndYear(val);
                              persistData("endYear", val);
                            }}
                            className="w-14 bg-transparent text-center focus:outline-none text-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 text-xs font-semibold relative">
                        <span 
                          onMouseEnter={() => setHoveredLegend("standard")}
                          onMouseLeave={() => setHoveredLegend(null)}
                          className="flex items-center gap-1.5 text-[var(--text-subtitle)] cursor-help relative animate-pulse"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> 
                          Standard Path
                        </span>
                        
                        <span 
                          onMouseEnter={() => setHoveredLegend("fincody")}
                          onMouseLeave={() => setHoveredLegend(null)}
                          className="flex items-center gap-1.5 text-blue-500 cursor-help relative animate-pulse"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 
                          Fincody AI Path
                        </span>

                        <AnimatePresence>
                          {hoveredLegend === "standard" && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute z-50 bottom-[120%] left-0 max-w-xs p-3 rounded-lg border border-slate-800 bg-slate-950/95 text-[10px] text-slate-300 shadow-xl backdrop-blur-md"
                            >
                              <strong>Standard Path:</strong> Projections representing baseline compound savings with basic market indices, unoptimized subscriptions bleed, and standard insurance payouts.
                            </motion.div>
                          )}
                          {hoveredLegend === "fincody" && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute z-50 bottom-[120%] right-0 max-w-xs p-3 rounded-lg border border-blue-500/20 bg-slate-950/95 text-[10px] text-slate-300 shadow-xl backdrop-blur-md"
                            >
                              <strong>Fincody AI Path:</strong> Optimizations utilizing auto-rebalanced portfolios, subscription cleanup savings, and audited premium adjustments compounded over 15 years.
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="w-full min-w-0 h-72">
                      <ResponsiveContainer width="99%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                          <YAxis 
                             stroke="#475569" 
                             fontSize={11} 
                             tickLine={false} 
                             axisLine={false} 
                             width={60}
                             tickFormatter={formatYAxisTick} 
                           />
                           <Tooltip 
                             contentStyle={{ 
                               background: "var(--bg-color)", 
                               border: "1px solid var(--border-color)", 
                               borderRadius: "12px", 
                               color: "var(--text-color)" 
                             }} 
                             formatter={(value) => [format(Number(value) * 100000), "Value"]}
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

                    <div className="h-44 w-full min-w-0 flex items-center justify-center relative">
                      <ResponsiveContainer width="99%" height="100%">
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
                        <span className="text-sm font-black text-[var(--text-color)]">
                           <RollingNumber value={3845210} />
                         </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-xs font-semibold">
                      {assetAllocationData.map((asset, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-slate-400">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                            <span>{asset.name}</span>
                          </div>
                          <span className="text-[var(--text-color)] font-mono">
                             <RollingNumber value={asset.value} />
                           </span>
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

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dynamic Recommendations</span>
                      <button 
                        onClick={() => {
                          setRefreshingAdvice(true);
                          setTimeout(() => setRefreshingAdvice(false), 900);
                        }}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-bold border border-blue-500/20 px-2 py-0.5 rounded hover:bg-blue-500/5 transition-all cursor-pointer flex items-center gap-1"
                      >
                        {refreshingAdvice ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" /> Recalculating...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3 h-3" /> Refresh Feed
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 min-h-[140px] justify-center">
                      {refreshingAdvice ? (
                        <div className="flex flex-col items-center gap-2 py-8 text-slate-500 text-xs">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                          <span>Fincody life engines scanning transactions...</span>
                        </div>
                      ) : (
                        <>
                          {/* 1. Subscription Check */}
                          {(() => {
                            const expensiveSub = [...subscriptions]
                              .filter(s => s.status === "active")
                              .sort((a, b) => b.price - a.price)[0];
                            if (expensiveSub) {
                              return (
                                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3 text-xs leading-relaxed">
                                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold text-[var(--text-color)] block mb-0.5">Overlapping Subscriptions Detected</span>
                                    <p className="text-[var(--text-subtitle)]">
                                      {expensiveSub.name} usage has fallen this quarter. Auto-cancellation could save you {format(expensiveSub.price)}/month.
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}

                          {/* 2. Goal Cushion Check */}
                          {(() => {
                            const emergencyGoal = goals.find(g => g.name.toLowerCase().includes("emergency"));
                            if (emergencyGoal && emergencyGoal.current < emergencyGoal.target) {
                              const gap = emergencyGoal.target - emergencyGoal.current;
                              return (
                                <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3 text-xs leading-relaxed">
                                  <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold text-[var(--text-color)] block mb-0.5">Emergency Fund Rebalancing Alert</span>
                                    <p className="text-[var(--text-subtitle)]">
                                      Your Emergency Fund is short of safety targets by {format(gap)}. We recommend allocating {format(8000)}/month from cash surpluses.
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}

                          {/* 3. Asset Allocation Alert */}
                          {totalInvestmentValue > 0 && (
                            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3 text-xs leading-relaxed">
                              <Coins className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-[var(--text-color)] block mb-0.5">Asset Rebalancing Strategy</span>
                                <p className="text-[var(--text-subtitle)]">
                                  Equities comprise {((equitiesVal / (totalInvestmentValue || 1)) * 100).toFixed(0)}% of your active holdings. Allocate a portion into FDs to hedge current market volatility.
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
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
                      {goals.map((goal) => {
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
                  {/* Floating Undo notification bar */}
                  {goalHistory.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                        <span>Goal parameters updated. Did you make a mistake?</span>
                      </div>
                      <button
                        onClick={handleUndoGoalAction}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow shadow-blue-500/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Undo last change
                      </button>
                    </motion.div>
                  )}

                  {goals.map((goal) => {
                    const percent = Math.round((goal.current / goal.target) * 100);
                    return (
                      <div 
                        key={goal.id}
                        className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-4 bg-slate-900/5"
                      >
                        {editingGoalId === goal.id ? (
                          // EDITING MODE
                          <div className="flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Goal Name</label>
                              <input
                                type="text"
                                value={editGoalName}
                                onChange={(e) => setEditGoalName(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-sm text-[var(--text-color)] focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Target Amount</label>
                                <input
                                  type="number"
                                  value={editGoalTarget}
                                  onChange={(e) => setEditGoalTarget(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-sm text-[var(--text-color)] focus:outline-none focus:border-blue-500 font-mono"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Deadline Date</label>
                                <input
                                  type="text"
                                  value={editGoalDeadline}
                                  onChange={(e) => setEditGoalDeadline(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-sm text-[var(--text-color)] focus:outline-none focus:border-blue-500"
                                  placeholder="e.g. Dec 2028"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end mt-2">
                              <button
                                onClick={handleCancelEditGoal}
                                className="px-3.5 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-[var(--text-subtitle)] hover:bg-slate-500/5 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEditGoal(goal.id)}
                                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow shadow-blue-500/10 transition-colors cursor-pointer"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          // VIEWING MODE
                          <>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h3 className="text-lg font-bold text-[var(--text-color)]">{goal.name}</h3>
                                  <button
                                    onClick={() => handleStartEditGoal(goal)}
                                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
                                    title="Edit Goal"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGoal(goal.id)}
                                    className="text-rose-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                                    title="Delete Goal"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-xs text-[var(--text-subtitle)] mt-0.5">Target deadline: {goal.deadline}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Current / Target</span>
                                <span className="text-lg font-extrabold text-[var(--text-color)] mt-0.5 block font-mono">
                                  <RollingNumber value={goal.current} /> / <RollingNumber value={goal.target} />
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
                            <div className="flex flex-wrap gap-2 mt-2 border-t border-[var(--border-color)] pt-4 items-center">
                              <button
                                onClick={() => handleContributeToGoal(goal.id, 10000)}
                                className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-slate-900/20 text-xs font-semibold text-[var(--text-subtitle)] hover:text-[var(--text-color)] hover:bg-slate-500/5 transition-all cursor-pointer"
                              >
                                + {format(10000)} Contribution
                              </button>
                              <button
                                onClick={() => handleContributeToGoal(goal.id, 50000)}
                                className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-slate-900/20 text-xs font-semibold text-[var(--text-subtitle)] hover:text-[var(--text-color)] hover:bg-slate-500/5 transition-all cursor-pointer"
                              >
                                + {format(50000)} Contribution
                              </button>
                              <button
                                onClick={() => handleContributeToGoal(goal.id, 100000)}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer"
                              >
                                + {format(100000)} Contribution
                              </button>

                              {/* Custom Contribution Field */}
                              <div className="flex items-center gap-2 border border-[var(--border-color)] bg-slate-900/40 rounded-xl px-3 py-1 bg-slate-950/20 ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Custom</span>
                                <input
                                  type="number"
                                  value={customContributions[goal.id] || ""}
                                  onChange={(e) => setCustomContributions(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                  placeholder="Enter amount"
                                  className="w-24 bg-transparent text-xs font-mono font-bold text-[var(--text-color)] focus:outline-none placeholder-slate-600 text-right"
                                />
                                <button
                                  onClick={() => handleCustomContribute(goal.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </>
                        )}
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
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Capital ({activeCurrency.symbol})</label>
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
                          type="date"
                          required
                          value={newGoalDeadline}
                          onChange={(e) => setNewGoalDeadline(e.target.value)}
                          className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500/30 text-[var(--text-color)] [color-scheme:dark] light:[color-scheme:light]"
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
                        {activeTab === "investments" && (() => {
              // 1. Equities Total Value
              const equitiesVal = portfolio.reduce((acc, item) => acc + (item.qty * (quotes[item.symbol]?.price || item.avgBuyPrice || 100)), 0);
              const equitiesCost = portfolio.reduce((acc, item) => acc + (item.qty * item.avgBuyPrice), 0);
              const equitiesProfit = equitiesVal - equitiesCost;
              const equitiesTodayChange = portfolio.reduce((acc, item) => {
                const quote = quotes[item.symbol];
                if (!quote) return acc;
                return acc + (item.qty * quote.change);
              }, 0);

              // 2. FDs calculations
              const now = new Date();
              const fdsCalculated = fixedDeposits.map(fd => {
                const start = new Date(fd.startDate);
                const maturity = new Date(start);
                maturity.setFullYear(maturity.getFullYear() + fd.tenureYears);
                
                const daysTotal = Math.max(1, Math.round((maturity.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                const daysElapsed = Math.max(0, Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                const daysRemaining = Math.max(0, Math.round((maturity.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                
                // quarterly compounding
                const expectedMaturityAmount = Math.round(fd.principal * Math.pow(1 + (fd.rate / 400), 4 * fd.tenureYears));
                
                // current value based on elapsed fraction
                const elapsedTenureInYears = (Math.min(daysElapsed, daysTotal) / 365);
                const currentValue = Math.round(fd.principal * Math.pow(1 + (fd.rate / 400), 4 * elapsedTenureInYears));
                const interestEarned = currentValue - fd.principal;

                // AI Insights
                let insight = "Standard banking rate. Stable yield profile.";
                if (fd.rate > 7.0) insight = "Premium yield rate. Outperforming average sovereign benchmarks.";
                else if (fd.rate < 6.0) insight = "Sub-optimal rate. Consider corporate debt swaps for +1.5% yield.";

                return {
                  ...fd,
                  maturityDate: maturity.toISOString().split("T")[0],
                  daysRemaining,
                  expectedMaturityAmount,
                  currentValue,
                  interestEarned,
                  progressPercent: Math.min(100, Math.round((daysElapsed / daysTotal) * 100)),
                  insight
                };
              });

              const fdsTotalValue = fdsCalculated.reduce((acc, fd) => acc + fd.currentValue, 0);
              const fdsTotalInterest = fdsCalculated.reduce((acc, fd) => acc + fd.interestEarned, 0);

              // 3. PPF calculations
              const ppfTotalValue = ppfData.balance;

              // 4. NPS calculations
              const npsTotalValue = npsData.corpus;

              // 5. Gold calculations
              const goldCalculated = goldHoldings.map(g => {
                const livePrice = g.type === "Physical Gold" ? spotGoldPrice : (quotes["GOLDSHARE"]?.price || g.buyPricePerGram || 120);
                const currentValue = g.type === "Physical Gold" ? g.grams * livePrice : g.units * livePrice;
                const cost = g.type === "Physical Gold" ? g.grams * g.buyPricePerGram : g.units * g.buyPricePerUnit;
                const profit = currentValue - cost;
                const profitPct = cost > 0 ? (profit / cost) * 100 : 0;
                return { ...g, currentValue, cost, profit, profitPct };
              });
              const goldTotalValue = goldCalculated.reduce((acc, g) => acc + g.currentValue, 0);
              const goldTotalCost = goldCalculated.reduce((acc, g) => acc + g.cost, 0);
              const goldTotalProfit = goldTotalValue - goldTotalCost;

              // 6. ETFs calculations
              const etfsCalculated = etfHoldings.map(etf => {
                const livePrice = quotes[etf.symbol]?.price || etf.avgPrice;
                const currentValue = etf.units * livePrice;
                const cost = etf.units * etf.avgPrice;
                const profit = currentValue - cost;
                const profitPct = cost > 0 ? (profit / cost) * 100 : 0;
                const change = quotes[etf.symbol]?.change || 0;
                const todayChange = etf.units * change;
                return { ...etf, currentValue, cost, profit, profitPct, todayChange };
              });
              const etfsTotalValue = etfsCalculated.reduce((acc, etf) => acc + etf.currentValue, 0);
              const etfsTotalCost = etfsCalculated.reduce((acc, etf) => acc + etf.cost, 0);
              const etfsTotalProfit = etfsTotalValue - etfsTotalCost;
              const etfsTodayChange = etfsCalculated.reduce((acc, etf) => acc + etf.todayChange, 0);

              // 7. Bonds calculations
              const bondsCalculated = bondHoldings.map(b => {
                const start = new Date(b.startDate);
                const yearsElapsed = Math.max(0, (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
                const interestEarned = Math.round(b.faceValue * (b.couponRate / 100) * yearsElapsed);
                const currentValue = b.faceValue + interestEarned;
                return { ...b, currentValue, interestEarned };
              });
              const bondsTotalValue = bondsCalculated.reduce((acc, b) => acc + b.currentValue, 0);
              const bondsTotalInterest = bondsCalculated.reduce((acc, b) => acc + b.interestEarned, 0);

              // Aggregated Totals
              const totalInvestmentValue = equitiesVal + fdsTotalValue + ppfTotalValue + npsTotalValue + goldTotalValue + etfsTotalValue + bondsTotalValue;
              const totalCost = equitiesCost + fixedDeposits.reduce((acc, fd) => acc + fd.principal, 0) + ppfTotalValue + npsTotalValue + goldTotalCost + etfsTotalCost + bondHoldings.reduce((acc, b) => acc + b.faceValue, 0);
              const overallGainLoss = totalInvestmentValue - totalCost;
              const todayGainLoss = equitiesTodayChange + etfsTodayChange;

              // Best / Worst Performers
              const allPerformanceItems: { symbolOrName: string; pct: number }[] = [];
              portfolio.forEach(item => {
                const cost = item.qty * item.avgBuyPrice;
                const val = item.qty * (quotes[item.symbol]?.price || item.avgBuyPrice);
                const pct = cost > 0 ? ((val - cost) / cost) * 100 : 0;
                allPerformanceItems.push({ symbolOrName: item.symbol, pct });
              });
              etfsCalculated.forEach(item => {
                allPerformanceItems.push({ symbolOrName: item.symbol, pct: item.profitPct });
              });
              goldCalculated.forEach(item => {
                allPerformanceItems.push({ symbolOrName: item.type, pct: item.profitPct });
              });

              const sortedPerf = [...allPerformanceItems].sort((a, b) => b.pct - a.pct);
              const bestPerformer = sortedPerf[0] || { symbolOrName: "None", pct: 0 };
              const worstPerformer = sortedPerf[sortedPerf.length - 1] || { symbolOrName: "None", pct: 0 };

              const totalHoldingsCount = portfolio.length + fixedDeposits.length + (ppfTotalValue > 0 ? 1 : 0) + (npsTotalValue > 0 ? 1 : 0) + goldHoldings.length + etfHoldings.length + bondHoldings.length;

              // Unified Asset Allocation Data
              const consolidatedAllocationData = [
                { name: "Stocks", value: equitiesVal, color: "#3b82f6" },
                { name: "ETFs", value: etfsTotalValue, color: "#8b5cf6" },
                { name: "Fixed Deposits", value: fdsTotalValue, color: "#10b981" },
                { name: "PPF", value: ppfTotalValue, color: "#ec4899" },
                { name: "NPS", value: npsTotalValue, color: "#f59e0b" },
                { name: "Gold", value: goldTotalValue, color: "#eab308" },
                { name: "Bonds", value: bondsTotalValue, color: "#06b6d4" }
              ].filter(item => item.value > 0);

              // Form Submissions
              const handleAddFD = (e: React.FormEvent) => {
                e.preventDefault();
                if (!addFdBank || !addFdPrincipal || !addFdRate || !addFdStartDate || !addFdTenureYears) return;
                const newFD = {
                  id: "fd-" + Date.now(),
                  bank: addFdBank,
                  principal: parseFloat(addFdPrincipal),
                  rate: parseFloat(addFdRate),
                  startDate: addFdStartDate,
                  tenureYears: parseFloat(addFdTenureYears)
                };
                const updated = [...fixedDeposits, newFD];
                setFixedDeposits(updated);
                persistData("fixedDeposits", updated);
                setAddFdBank("");
                setAddFdPrincipal("");
                setAddFdRate("");
                setAddFdStartDate("");
                setAddFdTenureYears("");
              };

              const handleRemoveFD = (id: string) => {
                const updated = fixedDeposits.filter(fd => fd.id !== id);
                setFixedDeposits(updated);
                persistData("fixedDeposits", updated);
              };

              const handleAddBond = (e: React.FormEvent) => {
                e.preventDefault();
                if (!addBondFaceValue || !addBondCouponRate || !addBondStartDate || !addBondMaturityDate) return;
                const newBond = {
                  id: "bond-" + Date.now(),
                  type: addBondType,
                  faceValue: parseFloat(addBondFaceValue),
                  couponRate: parseFloat(addBondCouponRate),
                  startDate: addBondStartDate,
                  maturityDate: addBondMaturityDate
                };
                const updated = [...bondHoldings, newBond];
                setBondHoldings(updated);
                persistData("bondHoldings", updated);
                setAddBondFaceValue("");
                setAddBondCouponRate("");
                setAddBondStartDate("");
                setAddBondMaturityDate("");
              };

              const handleRemoveBond = (id: string) => {
                const updated = bondHoldings.filter(b => b.id !== id);
                setBondHoldings(updated);
                persistData("bondHoldings", updated);
              };

              const handleAddGold = (e: React.FormEvent) => {
                e.preventDefault();
                if (!addGoldGrams || !addGoldBuyPrice) return;
                const newGold = {
                  id: "gold-" + Date.now(),
                  type: addGoldType,
                  grams: parseFloat(addGoldGrams),
                  units: addGoldType === "Gold ETF" ? Math.round(parseFloat(addGoldGrams)) : 0,
                  buyPricePerGram: addGoldType === "Physical Gold" ? parseFloat(addGoldBuyPrice) : 0,
                  buyPricePerUnit: addGoldType === "Gold ETF" ? parseFloat(addGoldBuyPrice) : 0
                };
                const updated = [...goldHoldings, newGold];
                setGoldHoldings(updated);
                persistData("goldHoldings", updated);
                setAddGoldGrams("");
                setAddGoldBuyPrice("");
              };

              const handleRemoveGold = (id: string) => {
                const updated = goldHoldings.filter(g => g.id !== id);
                setGoldHoldings(updated);
                persistData("goldHoldings", updated);
              };

              const handleAddETF = (e: React.FormEvent) => {
                e.preventDefault();
                if (!addEtfSymbol || !addEtfUnits || !addEtfAvgPrice) return;
                const newETF = {
                  id: "etf-" + Date.now(),
                  symbol: addEtfSymbol.toUpperCase(),
                  name: addEtfSymbol.toUpperCase() + " Index Fund",
                  units: parseFloat(addEtfUnits),
                  avgPrice: parseFloat(addEtfAvgPrice)
                };
                const updated = [...etfHoldings, newETF];
                setEtfHoldings(updated);
                persistData("etfHoldings", updated);
                setAddEtfSymbol("");
                setAddEtfUnits("");
                setAddEtfAvgPrice("");
              };

              const handleRemoveETF = (id: string) => {
                const updated = etfHoldings.filter(etf => etf.id !== id);
                setEtfHoldings(updated);
                persistData("etfHoldings", updated);
              };

              return (
                <motion.div
                  key="investments"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="flex flex-col gap-6 text-left"
                >
                  {/* 1. Investment Summary Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Value</div>
                      <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">
                        <RollingNumber value={totalInvestmentValue} decimals={2} />
                      </div>
                      <div className="text-xs text-slate-500 mt-2 font-semibold">
                        Pool count: <span className="text-[var(--text-color)] font-bold">{totalHoldingsCount} active</span>
                      </div>
                    </div>
                    
                    <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Overall Return</div>
                      <div className={`text-3xl font-black mt-1 font-mono ${overallGainLoss >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                        {overallGainLoss >= 0 ? "+" : ""}<RollingNumber value={overallGainLoss} decimals={2} />
                      </div>
                      <div className={`text-xs mt-2 font-bold flex items-center gap-1 ${todayGainLoss >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                        {todayGainLoss >= 0 ? "▲" : "▼"} {todayGainLoss >= 0 ? "+" : ""}<RollingNumber value={todayGainLoss} decimals={2} /> <span className="text-slate-500 font-semibold">today</span>
                      </div>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Interest Earned</div>
                      <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">
                        <RollingNumber value={fdsTotalInterest + bondsTotalInterest} />
                      </div>
                      <div className="text-xs text-emerald-500 mt-2 font-bold">
                        Est. Dividends: <span className="text-slate-500 font-semibold">{format(Math.round(equitiesVal * 0.012))}</span>
                      </div>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Performer Audit</div>
                      <div className="text-lg font-black mt-1.5 text-emerald-500 truncate" title={bestPerformer.symbolOrName}>
                        ▲ {bestPerformer.symbolOrName} ({bestPerformer.pct >= 0 ? "+" : ""}{bestPerformer.pct.toFixed(1)}%)
                      </div>
                      <div className="text-[10px] text-rose-500 mt-1 font-bold truncate" title={worstPerformer.symbolOrName}>
                        ▼ {worstPerformer.symbolOrName} ({worstPerformer.pct >= 0 ? "+" : ""}{worstPerformer.pct.toFixed(1)}%)
                      </div>
                    </div>
                  </div>

                  {/* 2. Sub-tab Navigation Dropdown (Below the Performer statistics) */}
                  <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-2 flex-wrap">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Asset Class Portfolio:</span>
                    <select
                      value={selectedInvestmentSubTab}
                      onChange={(e) => setSelectedInvestmentSubTab(e.target.value as any)}
                      className="bg-slate-900 border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs font-black text-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-[220px]"
                    >
                      <option value="equities">📈 Equities & ETFs</option>
                      <option value="fixed_income">💼 Fixed Income (FDs & Bonds)</option>
                      <option value="retirement">🛡️ Retirement Pools (NPS & PPF)</option>
                      <option value="metals">🪙 Precious Metals (Gold)</option>
                    </select>
                  </div>

                  {/* 3. Main Dashboard Grid Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Sub-Tab Content Area (lg:col-span-8) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                      
                      {/* SUBTAB 1: Equities & ETFs */}
                      {selectedInvestmentSubTab === "equities" && (
                        <div className="flex flex-col gap-6">
                          {/* AI Portfolio Builder Panel */}
                          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-gradient-to-tr from-blue-600/[0.02] to-indigo-500/[0.02] flex flex-col gap-5 relative overflow-hidden">
                            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4">
                              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                              <h3 className="text-sm font-black text-white uppercase tracking-wider">AI Recommendation Assistant</h3>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Configure target capital to analyze diversified models. Recommended stocks will generate below for your manual approval.
                            </p>

                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleGeneratePortfolio(e);
                              }}
                              className="flex gap-2"
                            >
                              <input
                                type="text"
                                value={aiGoalPrompt}
                                onChange={(e) => setAiGoalPrompt(e.target.value)}
                                placeholder='e.g., "I have 2,00,000 for high-growth tech stocks"'
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <button
                                type="submit"
                                disabled={isGeneratingPortfolio}
                                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow shadow-blue-500/10 cursor-pointer disabled:opacity-55"
                              >
                                {isGeneratingPortfolio ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
                              </button>
                            </form>

                            {/* Preset tags */}
                            <div className="flex flex-wrap gap-2 mt-1">
                              {[
                                "High-growth aggressive portfolio",
                                "Conservative dividend income",
                                "Technology sector focus"
                              ].map((p, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setAiGoalPrompt(p)}
                                  className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-slate-900/20 hover:bg-slate-900/40 text-[10px] text-slate-400 hover:text-white transition-all cursor-pointer"
                                >
                                  {p}
                                </button>
                              ))}
                            </div>

                            {/* Recommendation Cards */}
                            {aiRecommendation && (
                              <div className="border-t border-[var(--border-color)] pt-5 mt-2 flex flex-col gap-6">
                                {/* Risk & Info strip */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-slate-950/20">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">AI Risk Target</span>
                                    <span className="text-xs font-black text-white block mt-1.5">{aiRecommendation.risk} Profiling</span>
                                  </div>
                                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-slate-950/20">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Diversification</span>
                                    <span className="text-xs font-black text-emerald-500 block mt-1.5">{aiRecommendation.diversification}/100 Score</span>
                                  </div>
                                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-slate-950/20">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Expected Yield</span>
                                    <span className="text-xs font-black text-blue-400 block mt-1.5">{aiRecommendation.risk === "High" ? "18% CAGR" : "12% CAGR"}</span>
                                  </div>
                                </div>

                                <div className="text-xs text-slate-400 p-3.5 rounded-xl border border-blue-500/10 bg-blue-600/[0.01]">
                                  <span className="font-extrabold text-blue-400 block mb-1">Co-Pilot Rationale:</span>
                                  {aiRecommendation.rationale}
                                </div>

                                {/* Your Portfolio vs AI Suggestions Comparative Analytics */}
                                <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-slate-950/20 flex flex-col gap-4">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Portfolio vs AI Suggestions</span>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Sector Allocations */}
                                    <div className="flex flex-col gap-2">
                                      <span className="text-[9px] font-bold text-slate-500 uppercase">Sector Exposure Check</span>
                                      {(() => {
                                        // User sectors
                                        const userSects: Record<string, number> = {};
                                        portfolio.forEach(s => {
                                          userSects[s.sector || "Technology"] = (userSects[s.sector || "Technology"] || 0) + (s.qty * (quotes[s.symbol]?.price || s.avgBuyPrice || 100));
                                        });
                                        const userTotal = Object.values(userSects).reduce((a, b) => a + b, 0);

                                        // Rec sectors
                                        const recSects: Record<string, number> = {};
                                        aiRecommendation.stocks.forEach((s: any) => {
                                          recSects[s.sector] = (recSects[s.sector] || 0) + s.allocation;
                                        });

                                        const missingSectors = Object.keys(recSects).filter(s => !userSects[s] || userTotal === 0);
                                        const overweightSectors = Object.keys(userSects).filter(s => {
                                          if (userTotal === 0) return false;
                                          const pct = (userSects[s] / userTotal) * 100;
                                          return pct > (recSects[s] || 0) + 15;
                                        });
                                        const underweightSectors = Object.keys(recSects).filter(s => {
                                          const userPct = userTotal > 0 ? (userSects[s] / userTotal) * 100 : 0;
                                          return userPct < recSects[s] - 10;
                                        });

                                        return (
                                          <div className="flex flex-col gap-2.5 mt-1">
                                            <div>
                                              <span className="text-[9px] text-slate-500 font-bold block mb-1">Missing Sectors</span>
                                              <div className="flex flex-wrap gap-1">
                                                {missingSectors.length > 0 ? missingSectors.map(s => (
                                                  <span key={s} className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{s}</span>
                                                )) : <span className="text-[10px] text-slate-500 italic">None</span>}
                                              </div>
                                            </div>
                                            <div>
                                              <span className="text-[9px] text-slate-500 font-bold block mb-1">Overweight Sectors</span>
                                              <div className="flex flex-wrap gap-1">
                                                {overweightSectors.length > 0 ? overweightSectors.map(s => (
                                                  <span key={s} className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">{s}</span>
                                                )) : <span className="text-[10px] text-slate-500 italic">None</span>}
                                              </div>
                                            </div>
                                            <div>
                                              <span className="text-[9px] text-slate-500 font-bold block mb-1">Underweight Sectors</span>
                                              <div className="flex flex-wrap gap-1">
                                                {underweightSectors.length > 0 ? underweightSectors.map(s => (
                                                  <span key={s} className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{s}</span>
                                                )) : <span className="text-[10px] text-slate-500 italic">None</span>}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>

                                    {/* Score cards */}
                                    <div className="flex flex-col gap-3.5">
                                      <span className="text-[9px] font-bold text-slate-500 uppercase">Impact Indicators</span>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-[var(--border-color)]">
                                          <span className="text-[9px] text-slate-500 font-bold block">Expected Return Impact</span>
                                          <span className="text-xs font-black text-emerald-500 block mt-1">+4.25% Annualized</span>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-[var(--border-color)]">
                                          <span className="text-[9px] text-slate-500 font-bold block">Beta Risk Reduction</span>
                                          <span className="text-xs font-black text-blue-400 block mt-1">-18.4% Variance</span>
                                        </div>
                                      </div>
                                      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-[var(--border-color)] text-[10px] text-slate-400 leading-relaxed font-semibold">
                                        ⚖️ <strong>Diversification Gap</strong>: Your portfolio score is ~45/100. Adopting the recommendations increases exposure to {aiRecommendation.diversification}/100.
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Suggested Tickers Cards */}
                                <div className="flex flex-col gap-3">
                                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Asset Proposals</span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {aiRecommendation.stocks
                                      .filter((s: any) => !ignoredRecs.includes(s.symbol))
                                      .map((st: any) => (
                                        <div key={st.symbol} className="p-4 rounded-xl border border-[var(--border-color)] bg-slate-900/30 flex flex-col justify-between gap-3 group relative">
                                          <div>
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <span className="font-extrabold text-white text-xs block font-mono">{st.symbol}</span>
                                                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{st.name}</span>
                                              </div>
                                              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/10">{st.allocation}%</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-2 font-medium leading-relaxed">
                                              {st.rationale}
                                            </p>
                                          </div>

                                          {/* Target Details */}
                                          <div className="border-t border-[var(--border-color)] pt-2 flex justify-between items-center text-[10px] font-bold">
                                            <span className="text-slate-500">Target Shares:</span>
                                            <span className="text-white font-mono">{st.qty} units</span>
                                          </div>

                                          {/* Action Buttons */}
                                          <div className="grid grid-cols-3 gap-1.5 border-t border-[var(--border-color)] pt-3">
                                            <button
                                              onClick={() => handleAddRecToPortfolio(st)}
                                              className="py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-[9px] font-black text-white text-center cursor-pointer transition-colors"
                                            >
                                              ➕ Add
                                            </button>
                                            <button
                                              onClick={() => setReplacingRecStock(st)}
                                              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-[var(--border-color)] text-[9px] font-bold text-slate-300 text-center cursor-pointer transition-colors"
                                            >
                                              🔄 Swap
                                            </button>
                                            <button
                                              onClick={() => setIgnoredRecs(prev => [...prev, st.symbol])}
                                              className="py-1.5 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-[9px] font-bold text-rose-400 text-center cursor-pointer transition-colors"
                                            >
                                              ❌ Ignore
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Inline Swap Selection Modals */}
                            {replacingRecStock && (
                              <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                                <div className="glass-card max-w-sm w-full p-6 rounded-2xl border border-[var(--border-color)] bg-slate-900 flex flex-col gap-4 text-left">
                                  <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-wider">Swap Existing Asset</h4>
                                    <p className="text-[11px] text-slate-400 mt-1">
                                      Select which holding in your current portfolio to replace with <strong>{replacingRecStock.symbol}</strong>.
                                    </p>
                                  </div>
                                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                    {portfolio.map(p => (
                                      <div
                                        key={p.symbol}
                                        onClick={() => handleReplaceHolding(replacingRecStock, p.symbol)}
                                        className="p-3 rounded-xl border border-[var(--border-color)] bg-slate-950/20 hover:bg-blue-600/10 hover:border-blue-500/30 cursor-pointer flex justify-between items-center transition-all"
                                      >
                                        <div className="flex flex-col">
                                          <span className="text-xs font-extrabold text-white font-mono">{p.symbol}</span>
                                          <span className="text-[9px] text-slate-500 font-bold">{p.name}</span>
                                        </div>
                                        <span className="text-xs font-mono font-black text-white">{p.qty} shares</span>
                                      </div>
                                    ))}
                                    {portfolio.length === 0 && (
                                      <span className="text-xs text-slate-500 italic text-center py-4">No holdings to swap out.</span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setReplacingRecStock(null)}
                                    className="w-full py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Smart Stock Tracker Autocomplete Search */}
                          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-5 bg-slate-900/5">
                            <div className="border-b border-[var(--border-color)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Live Equities Monitor</span>
                                <span className="text-xs text-slate-500 mt-0.5 block">Search, audit, and track active equities</span>
                              </div>
                              {portfolio.length > 0 && (
                                <button
                                  onClick={handleRebalancePortfolio}
                                  className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/5 text-[11px] font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                                >
                                  Rebalance Allocations
                                </button>
                              )}
                            </div>

                            <div className="relative w-full">
                              <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                  type="text"
                                  value={stockSearchQuery}
                                  onChange={(e) => handleStockSearch(e.target.value)}
                                  placeholder="Search stocks (e.g. AAPL, RELIANCE, TCS)..."
                                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-900/50 border border-[var(--border-color)] text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500/30 text-[var(--text-color)] transition-all font-semibold"
                                />
                                {stockSearchLoading && (
                                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
                                )}
                              </div>

                              <AnimatePresence>
                                {stockSearchResults.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute left-0 right-0 top-[110%] z-[9999] glass-card rounded-2xl border border-[var(--border-color)] bg-slate-900/95 shadow-2xl p-2 max-h-60 overflow-y-auto text-left"
                                  >
                                    {stockSearchResults.map((stock) => (
                                      <div
                                        key={stock.symbol}
                                        onClick={() => handleAddStock(stock)}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 cursor-pointer transition-all border border-transparent hover:border-[var(--border-color)]"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-[var(--border-color)] flex items-center justify-center font-bold text-white text-[10px] font-mono">
                                            {stock.symbol.substring(0, 3)}
                                          </div>
                                          <div>
                                            <span className="font-extrabold text-xs text-white block font-mono">{stock.symbol}</span>
                                            <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{stock.name}</span>
                                          </div>
                                        </div>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 -rotate-90" />
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Stock Holdings List Grid */}
                            <div className="flex flex-col gap-4 mt-2">
                              {portfolio.map((item) => {
                                const quote = quotes[item.symbol];
                                const currentPrice = quote?.price || item.avgBuyPrice || 100;
                                const cost = item.qty * item.avgBuyPrice;
                                const currentValue = item.qty * currentPrice;
                                const totalReturn = currentValue - cost;

                                // Exchange specific info
                                const { localTimeStr, marketState } = getExchangeMarketState(item.symbol);
                                
                                const flashStatus = priceUpdateStatus[item.symbol];
                                const flashClass = flashStatus === "up" 
                                  ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                                  : flashStatus === "down"
                                  ? "bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                                  : "bg-slate-900/20 border-[var(--border-color)]";

                                return (
                                  <motion.div
                                    key={item.symbol}
                                    layoutId={`holdings-${item.symbol}`}
                                    className={`p-4 rounded-xl border transition-all flex flex-col gap-3 group ${flashClass}`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-[var(--border-color)] flex items-center justify-center font-mono text-[9px] font-black text-slate-300">
                                          {item.symbol.substring(0, 4)}
                                        </div>
                                        <div className="text-left">
                                          <span className="font-black text-xs text-white block font-mono">{item.symbol}</span>
                                          <span className="text-[9px] text-slate-500 font-extrabold block mt-0.5">{item.name}</span>
                                        </div>
                                      </div>

                                      <div className="text-right">
                                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black block">Price / Value</span>
                                        <span className="font-mono text-xs font-extrabold text-white mt-1 block">
                                          <RollingNumber value={currentPrice} decimals={2} /> / <RollingNumber value={currentValue} decimals={2} />
                                        </span>
                                      </div>
                                    </div>

                                    {/* Localized Exchange details */}
                                    <div className="border-t border-[var(--border-color)] pt-2.5 flex justify-between items-center text-[10px]">
                                      <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${marketState.includes("Open") ? "bg-emerald-500 animate-pulse" : marketState.includes("Pre") ? "bg-amber-500 animate-pulse" : "bg-slate-500"}`} />
                                        <span className="text-slate-400 font-bold">{marketState}</span>
                                        <span className="text-slate-500">• Local Time: {localTimeStr}</span>
                                      </div>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveStock(item.symbol);
                                        }}
                                        className="text-rose-500 hover:text-rose-400 font-bold p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[9px]"
                                      >
                                        Remove Ticker
                                      </button>
                                    </div>

                                    {/* Form Inputs (Stop Propagation to prevent triggering chart modal) */}
                                    <div 
                                      onClick={(e) => e.stopPropagation()} 
                                      className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--border-color)] items-end"
                                    >
                                      <div className="flex flex-col gap-1 text-left">
                                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black">Shares</span>
                                        <input
                                          type="number"
                                          min="1"
                                          value={item.qty}
                                          onChange={(e) => handleUpdateHolding(item.symbol, parseInt(e.target.value) || 1, item.avgBuyPrice)}
                                          className="w-full bg-slate-950/40 border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none focus:border-blue-500/30"
                                        />
                                      </div>

                                      <div className="flex flex-col gap-1 text-left">
                                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black">Avg Cost ({activeCurrency.symbol})</span>
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.avgBuyPrice}
                                          onChange={(e) => handleUpdateHolding(item.symbol, item.qty, parseFloat(e.target.value) || 0)}
                                          className="w-full bg-slate-950/40 border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono text-left focus:outline-none focus:border-blue-500/30"
                                        />
                                      </div>

                                      <div className="flex flex-col text-right">
                                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black">Total Returns</span>
                                        <span className={`text-xs font-mono font-bold mt-1.5 ${totalReturn >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                          {totalReturn >= 0 ? "+" : ""}<RollingNumber value={totalReturn} decimals={2} />
                                        </span>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}

                              {portfolio.length === 0 && (
                                <div className="text-center py-8 text-xs text-slate-500 italic">
                                  No stocks added yet. Search symbols in tracker above.
                                </div>
                              )}
                            </div>
                          </div>

                          {/* ETF Holdings Segment */}
                          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-900/5 flex flex-col gap-4">
                            <div className="border-b border-[var(--border-color)] pb-3">
                              <span className="text-sm font-bold uppercase tracking-wider text-white block">ETF Holdings</span>
                              <span className="text-xs text-slate-500 mt-0.5 block">Audit index exchange-traded pools</span>
                            </div>

                            {/* ETF List */}
                            <div className="flex flex-col gap-3">
                              {etfsCalculated.map(etf => (
                                <div key={etf.id} className="p-3.5 rounded-xl border border-[var(--border-color)] bg-slate-900/20 flex justify-between items-center text-xs">
                                  <div className="text-left">
                                    <span className="font-extrabold text-white block font-mono">{etf.symbol}</span>
                                    <span className="text-[9px] text-slate-500 font-bold mt-0.5 block">{etf.name}</span>
                                  </div>
                                  <div className="text-center font-mono">
                                    <span className="text-[10px] text-slate-500 block">Units / Price</span>
                                    <span className="text-white font-bold block mt-0.5">{etf.units} @ <RollingNumber value={etf.avgPrice} decimals={2} /></span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-slate-500 block">Valuation / Return</span>
                                    <span className="text-white font-bold block font-mono"><RollingNumber value={etf.currentValue} decimals={2} /></span>
                                    <span className={`text-[9px] font-bold block mt-0.5 ${etf.profit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                      {etf.profit >= 0 ? "+" : ""}{etf.profitPct.toFixed(1)}%
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveETF(etf.id)}
                                    className="text-rose-500 hover:text-rose-400 font-bold ml-2 p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}

                              {etfHoldings.length === 0 && (
                                <span className="text-xs text-slate-500 italic text-center py-4">No ETF holdings.</span>
                              )}
                            </div>

                            {/* Add ETF form */}
                            <form onSubmit={handleAddETF} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--border-color)]">
                              <input
                                type="text"
                                value={addEtfSymbol}
                                onChange={(e) => setAddEtfSymbol(e.target.value)}
                                placeholder="Symbol (e.g. SPY)"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="number"
                                value={addEtfUnits}
                                onChange={(e) => setAddEtfUnits(e.target.value)}
                                placeholder="Units"
                                min="1"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="number"
                                value={addEtfAvgPrice}
                                onChange={(e) => setAddEtfAvgPrice(e.target.value)}
                                placeholder="Avg Cost"
                                min="0.01"
                                step="any"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <button
                                type="submit"
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add ETF
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                      {/* SUBTAB 2: Fixed Income */}
                      {selectedInvestmentSubTab === "fixed_income" && (
                        <div className="flex flex-col gap-6">
                          
                          {/* Fixed Deposits list */}
                          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-900/5 flex flex-col gap-4">
                            <div className="border-b border-[var(--border-color)] pb-3">
                              <span className="text-sm font-bold uppercase tracking-wider text-white block">Fixed Deposits (FD)</span>
                              <span className="text-xs text-slate-500 mt-0.5 block">Audit safe bank deposits and countdown maturities</span>
                            </div>

                            <div className="flex flex-col gap-4">
                              {fdsCalculated.map(fd => (
                                <div key={fd.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-slate-900/30 flex flex-col gap-3">
                                  <div className="flex justify-between items-start">
                                    <div className="text-left">
                                      <span className="font-extrabold text-white text-xs block">{fd.bank}</span>
                                      <span className="text-[9px] text-slate-500 font-bold mt-0.5 block">Rate: {fd.rate}% • Matures: {fd.maturityDate}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[10px] text-slate-500 block font-semibold">FD Principal / Value</span>
                                      <span className="text-xs font-bold text-white font-mono block">
                                        <RollingNumber value={fd.principal} /> / <RollingNumber value={fd.currentValue} />
                                      </span>
                                    </div>
                                  </div>

                                  {/* Progress bar */}
                                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${fd.progressPercent}%` }} />
                                  </div>

                                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1 border-t border-[var(--border-color)]/30">
                                    <span>⌛ {fd.daysRemaining} days remaining until maturity</span>
                                    <span className="text-emerald-500 font-mono">+{format(fd.interestEarned)} earned</span>
                                    <button
                                      onClick={() => handleRemoveFD(fd.id)}
                                      className="text-rose-500 hover:text-rose-400 font-bold"
                                    >
                                      Remove
                                    </button>
                                  </div>

                                  <div className="text-[9px] text-slate-500 leading-normal italic px-2 py-1 rounded bg-slate-950/20 border border-[var(--border-color)]/30">
                                    💡 <strong>AI Insight</strong>: {fd.insight}
                                  </div>
                                </div>
                              ))}

                              {fixedDeposits.length === 0 && (
                                <span className="text-xs text-slate-500 italic text-center py-4">No Fixed Deposits tracking.</span>
                              )}
                            </div>

                            {/* Add FD form */}
                            <form onSubmit={handleAddFD} className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-3 border-t border-[var(--border-color)]">
                              <input
                                type="text"
                                value={addFdBank}
                                onChange={(e) => setAddFdBank(e.target.value)}
                                placeholder="Bank (e.g. HDFC)"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="number"
                                value={addFdPrincipal}
                                onChange={(e) => setAddFdPrincipal(e.target.value)}
                                placeholder="Principal"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="number"
                                value={addFdRate}
                                onChange={(e) => setAddFdRate(e.target.value)}
                                placeholder="Rate (%)"
                                step="any"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="date"
                                value={addFdStartDate}
                                onChange={(e) => setAddFdStartDate(e.target.value)}
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-[10px] focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="number"
                                value={addFdTenureYears}
                                onChange={(e) => setAddFdTenureYears(e.target.value)}
                                placeholder="Tenure (Y)"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <button
                                type="submit"
                                className="sm:col-span-5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" /> Track Fixed Deposit
                              </button>
                            </form>
                          </div>

                          {/* Bonds tracking */}
                          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-900/5 flex flex-col gap-4">
                            <div className="border-b border-[var(--border-color)] pb-3">
                              <span className="text-sm font-bold uppercase tracking-wider text-white block">Government & Corporate Bonds</span>
                              <span className="text-xs text-slate-500 mt-0.5 block">Audit debt face values and coupon yields</span>
                            </div>

                            <div className="flex flex-col gap-3">
                              {bondsCalculated.map(b => (
                                <div key={b.id} className="p-3.5 rounded-xl border border-[var(--border-color)] bg-slate-900/30 flex justify-between items-center text-xs">
                                  <div className="text-left">
                                    <span className="font-extrabold text-white block">{b.type}</span>
                                    <span className="text-[9px] text-slate-500 font-bold mt-0.5 block">Coupon: {b.couponRate}% • Matures: {b.maturityDate}</span>
                                  </div>
                                  <div className="text-center font-mono">
                                    <span className="text-[10px] text-slate-500 block">Face Value</span>
                                    <span className="text-white font-bold block mt-0.5"><RollingNumber value={b.faceValue} /></span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-slate-500 block">Current Value</span>
                                    <span className="text-white font-bold block font-mono"><RollingNumber value={b.currentValue} /></span>
                                    <span className="text-[9px] font-bold text-emerald-500 block mt-0.5">+{format(b.interestEarned)} accrued</span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveBond(b.id)}
                                    className="text-rose-500 hover:text-rose-400 font-bold ml-2 p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}

                              {bondHoldings.length === 0 && (
                                <span className="text-xs text-slate-500 italic text-center py-4">No Bond holdings tracked.</span>
                              )}
                            </div>

                            {/* Add Bond form */}
                            <form onSubmit={handleAddBond} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--border-color)]">
                              <select
                                value={addBondType}
                                onChange={(e) => setAddBondType(e.target.value)}
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              >
                                <option value="Government Bonds">Government Bonds</option>
                                <option value="Corporate Bonds">Corporate Bonds</option>
                              </select>
                              <input
                                type="number"
                                value={addBondFaceValue}
                                onChange={(e) => setAddBondFaceValue(e.target.value)}
                                placeholder="Face Value"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="number"
                                value={addBondCouponRate}
                                onChange={(e) => setAddBondCouponRate(e.target.value)}
                                placeholder="Coupon (%)"
                                step="any"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="date"
                                value={addBondStartDate}
                                onChange={(e) => setAddBondStartDate(e.target.value)}
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-[10px] focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="date"
                                value={addBondMaturityDate}
                                onChange={(e) => setAddBondMaturityDate(e.target.value)}
                                required
                                className="sm:col-span-4 px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-[10px] focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <button
                                type="submit"
                                className="sm:col-span-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" /> Track Bond
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                      {/* SUBTAB 3: Retirement Pools */}
                      {selectedInvestmentSubTab === "retirement" && (
                        <div className="flex flex-col gap-6">
                          
                          {/* PPF Section */}
                          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-900/5 flex flex-col gap-4">
                            <div className="border-b border-[var(--border-color)] pb-3 flex justify-between items-center">
                              <div>
                                <span className="text-sm font-bold uppercase tracking-wider text-white block">Public Provident Fund (PPF)</span>
                                <span className="text-xs text-slate-500 mt-0.5 block">Standard compounding target (7.1% CAGR interest)</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 block">Balance</span>
                                <span className="text-base font-black text-white font-mono"><RollingNumber value={ppfData.balance} /></span>
                              </div>
                            </div>

                            {/* PPF projections chart */}
                            <div className="h-44 w-full min-w-0 my-1">
                              <ResponsiveContainer width="99%" height="100%">
                                <AreaChart data={(() => {
                                  const data = [];
                                  let currentBal = ppfData.balance;
                                  const annualDep = ppfData.annualContribution;
                                  const rate = 0.071;
                                  for (let year = 0; year <= 15; year++) {
                                    data.push({
                                      year: `Year ${year}`,
                                      PPF: Math.round(currentBal)
                                    });
                                    currentBal = (currentBal + annualDep) * (1 + rate);
                                  }
                                  return data;
                                })()}>
                                  <XAxis dataKey="year" stroke="#475569" fontSize={8} tickLine={false} />
                                  <YAxis stroke="#475569" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(val) => format(val, true)} />
                                  <Tooltip contentStyle={{ fontSize: 9, background: "#0f172a", border: "1px solid #1e293b", color: "#f8fafc" }} formatter={(value) => [format(Number(value)), "PPF Balance"]} />
                                  <Area type="monotone" dataKey="PPF" stroke="#ec4899" fillOpacity={0.06} strokeWidth={1.5} fill="#ec4899" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Form to update PPF */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--border-color)]/30 pt-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Current PPF Balance</label>
                                <input
                                  type="number"
                                  value={ppfData.balance}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const updated = { ...ppfData, balance: val };
                                    setPpfData(updated);
                                    persistData("ppfData", updated);
                                  }}
                                  className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white font-mono"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Annual Contribution Limit</label>
                                <input
                                  type="number"
                                  value={ppfData.annualContribution}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const updated = { ...ppfData, annualContribution: val };
                                    setPpfData(updated);
                                    persistData("ppfData", updated);
                                  }}
                                  className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* NPS Section */}
                          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-900/5 flex flex-col gap-4">
                            <div className="border-b border-[var(--border-color)] pb-3 flex justify-between items-center">
                              <div>
                                <span className="text-sm font-bold uppercase tracking-wider text-white block">National Pension System (NPS)</span>
                                <span className="text-xs text-slate-500 mt-0.5 block">Retirement corpus compounding calculator</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 block">Current Corpus</span>
                                <span className="text-base font-black text-white font-mono"><RollingNumber value={npsData.corpus} /></span>
                              </div>
                            </div>

                            {/* NPS Projections details */}
                            {(() => {
                              // compound monthly deposits at 10.5% CAGR until age 60 (assume current age 30, so 30 years)
                              const yearsToRetire = 30;
                              const monthlyRate = 0.105 / 12;
                              const months = yearsToRetire * 12;
                              const monthlyDeposit = npsData.employerMonthly + npsData.personalMonthly;
                              
                              let projectedCorpus = npsData.corpus * Math.pow(1 + monthlyRate, months);
                              for (let m = 1; m <= months; m++) {
                                projectedCorpus += monthlyDeposit * Math.pow(1 + monthlyRate, months - m);
                              }

                              return (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
                                  <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-slate-900/40 text-center">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Years Compounding</span>
                                    <span className="text-sm font-bold text-white block mt-1">30 Years (Age 60 Target)</span>
                                  </div>
                                  <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-slate-900/40 text-center">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Monthly Saving</span>
                                    <span className="text-sm font-bold text-emerald-500 block mt-1"><RollingNumber value={monthlyDeposit} /></span>
                                  </div>
                                  <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-slate-900/40 text-center">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Projected Retirement Corpus</span>
                                    <span className="text-sm font-black text-blue-400 block mt-1"><RollingNumber value={Math.round(projectedCorpus)} /></span>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Allocation split */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-slate-950/20 text-xs text-slate-400">
                              <span className="font-bold">NPS Asset Allocation Split:</span>
                              <div className="flex gap-4">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> Equity (E): {npsData.allocationE}%</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500" /> Corp Bonds (C): {npsData.allocationC}%</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Government (G): {npsData.allocationG}%</span>
                              </div>
                            </div>

                            {/* Inputs form */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--border-color)]/30">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-slate-500 font-bold uppercase">Employer Co-Pay</label>
                                <input
                                  type="number"
                                  value={npsData.employerMonthly}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const updated = { ...npsData, employerMonthly: val };
                                    setNpsData(updated);
                                    persistData("npsData", updated);
                                  }}
                                  className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white font-mono"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-slate-500 font-bold uppercase">Personal Co-Pay</label>
                                <input
                                  type="number"
                                  value={npsData.personalMonthly}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const updated = { ...npsData, personalMonthly: val };
                                    setNpsData(updated);
                                    persistData("npsData", updated);
                                  }}
                                  className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white font-mono"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-slate-500 font-bold uppercase">Corpus Balance</label>
                                <input
                                  type="number"
                                  value={npsData.corpus}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const updated = { ...npsData, corpus: val };
                                    setNpsData(updated);
                                    persistData("npsData", updated);
                                  }}
                                  className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUBTAB 4: Precious Metals */}
                      {selectedInvestmentSubTab === "metals" && (
                        <div className="flex flex-col gap-6">
                          
                          {/* Gold Holdings Card */}
                          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-900/5 flex flex-col gap-4">
                            <div className="border-b border-[var(--border-color)] pb-3 flex justify-between items-center">
                              <div>
                                <span className="text-sm font-bold uppercase tracking-wider text-white block">Precious Metals & Gold Vault</span>
                                <span className="text-xs text-slate-500 mt-0.5 block">Track digital gold, gold ETFs, and physical assets</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 block">Spot Gold Price</span>
                                <span className="text-base font-black text-amber-500 font-mono">
                                  {format(spotGoldPrice)} <span className="text-[9px] text-slate-500">/gram</span>
                                </span>
                              </div>
                            </div>

                            {/* Gold holdings lists */}
                            <div className="flex flex-col gap-3">
                              {goldCalculated.map(g => (
                                <div key={g.id} className="p-3.5 rounded-xl border border-[var(--border-color)] bg-slate-900/30 flex justify-between items-center text-xs">
                                  <div className="text-left">
                                    <span className="font-extrabold text-white block">{g.type}</span>
                                    <span className="text-[9px] text-slate-500 font-bold mt-0.5 block">
                                      {g.type === "Physical Gold" ? `${g.grams} grams` : `${g.units} units`}
                                    </span>
                                  </div>
                                  <div className="text-center font-mono">
                                    <span className="text-[10px] text-slate-500 block">Buy Price</span>
                                    <span className="text-white font-bold block mt-0.5">
                                      {g.type === "Physical Gold" ? format(g.buyPricePerGram) : format(g.buyPricePerUnit)}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-slate-500 block">Current Valuation</span>
                                    <span className="text-white font-bold block font-mono"><RollingNumber value={g.currentValue} /></span>
                                    <span className={`text-[9px] font-bold block mt-0.5 ${g.profit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                      {g.profit >= 0 ? "+" : ""}{g.profitPct.toFixed(1)}% Return
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveGold(g.id)}
                                    className="text-rose-500 hover:text-rose-400 font-bold ml-2 p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}

                              {goldHoldings.length === 0 && (
                                <span className="text-xs text-slate-500 italic text-center py-4">No metals portfolio tracking.</span>
                              )}
                            </div>

                            {/* Add gold form */}
                            <form onSubmit={handleAddGold} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--border-color)]">
                              <select
                                value={addGoldType}
                                onChange={(e) => setAddGoldType(e.target.value)}
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              >
                                <option value="Physical Gold">Physical Gold (grams)</option>
                                <option value="Digital Gold">Digital Gold (grams)</option>
                                <option value="Gold ETF">Gold ETF (units)</option>
                              </select>
                              <input
                                type="number"
                                value={addGoldGrams}
                                onChange={(e) => setAddGoldGrams(e.target.value)}
                                placeholder={addGoldType === "Gold ETF" ? "Units" : "Grams"}
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <input
                                type="number"
                                value={addGoldBuyPrice}
                                onChange={(e) => setAddGoldBuyPrice(e.target.value)}
                                placeholder="Buy Price"
                                required
                                className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white"
                              />
                              <button
                                type="submit"
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" /> Track Gold
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6">
                      
                      {/* Consolidated Asset Allocation Pie Chart */}
                      <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-950/10 flex flex-col justify-between">
                        <div>
                          <div className="border-b border-[var(--border-color)] pb-3">
                            <span className="text-sm font-bold uppercase tracking-wider text-white block">Asset Allocation</span>
                            <span className="text-xs text-slate-500 mt-0.5 block">Unified portfolio distribution</span>
                          </div>

                          <div className="h-56 w-full min-w-0 flex items-center justify-center relative my-4">
                            {consolidatedAllocationData.length > 0 ? (
                              <>
                                <ResponsiveContainer width="99%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={consolidatedAllocationData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={3}
                                      dataKey="value"
                                    >
                                      {consolidatedAllocationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Pie>
                                  </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center justify-center">
                                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Value</span>
                                  <span className="text-base font-black text-white font-mono">
                                    <RollingNumber value={totalInvestmentValue} />
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-slate-500 italic">No assets tracked yet.</span>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 mt-2">
                            {consolidatedAllocationData.map((entry, index) => {
                              const pct = totalInvestmentValue > 0 ? (entry.value / totalInvestmentValue) * 100 : 0;
                              return (
                                <div key={index} className="flex justify-between items-center text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-slate-400 font-bold">{entry.name}</span>
                                  </div>
                                  <span className="text-white font-bold font-mono">
                                    <RollingNumber value={entry.value} /> ({pct.toFixed(1)}%)
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Upcoming Investment Events Widget Card */}
                      <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-950/10 flex flex-col gap-4">
                        <div className="border-b border-[var(--border-color)] pb-3">
                          <span className="text-sm font-bold uppercase tracking-wider text-white block">Upcoming Milestones</span>
                          <span className="text-xs text-slate-500 mt-0.5 block">Accrual dates and maturity deadlines</span>
                        </div>

                        <div className="flex flex-col gap-3">
                          
                          {/* Loop over FDs */}
                          {fdsCalculated.slice(0, 2).map(fd => (
                            <div key={fd.id} className="p-3 rounded-xl border border-[var(--border-color)] bg-slate-900/40 text-xs">
                              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black block">FD Maturity Deadline</span>
                              <span className="font-extrabold text-white block mt-0.5">{fd.bank} Deposit</span>
                              <span className="text-xs text-blue-400 block mt-1 font-semibold">⏰ Maturing in {fd.daysRemaining} days</span>
                            </div>
                          ))}

                          {/* Loop over bonds */}
                          {bondHoldings.slice(0, 1).map(b => (
                            <div key={b.id} className="p-3 rounded-xl border border-[var(--border-color)] bg-slate-900/40 text-xs">
                              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black block">Accrued Coupon Date</span>
                              <span className="font-extrabold text-white block mt-0.5">{b.type} Interest</span>
                              <span className="text-xs text-indigo-400 block mt-1 font-semibold">📅 Coupon interest due</span>
                            </div>
                          ))}

                          {/* PPF cap reminder */}
                          {ppfTotalValue > 0 && (
                            <div className="p-3 rounded-xl border border-[var(--border-color)] bg-slate-900/40 text-xs">
                              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black block">PPF Account Lock</span>
                              <span className="font-extrabold text-white block mt-0.5">Annual PPF Deposit Cap</span>
                              <span className="text-xs text-rose-400 block mt-1 font-semibold">⚠️ Deposit {format(ppfData.annualContribution)} before March 31</span>
                            </div>
                          )}

                          {/* NPS cap reminder */}
                          {npsTotalValue > 0 && (
                            <div className="p-3 rounded-xl border border-[var(--border-color)] bg-slate-900/40 text-xs">
                              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black block">NPS Tax Shield Reminder</span>
                              <span className="font-extrabold text-white block mt-0.5">NPS Monthly Contribution</span>
                              <span className="text-xs text-amber-500 block mt-1 font-semibold">💡 Personal co-pay is active</span>
                            </div>
                          )}

                          {/* Mock IPO announcements */}
                          <div className="p-3 rounded-xl border border-[var(--border-color)] bg-slate-900/40 text-xs">
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black block">Hot Upcoming IPO Releases</span>
                            <div className="flex flex-col gap-1.5 mt-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300 font-bold">Hyundai India IPO</span>
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Sept 2026</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300 font-bold">Swiggy Delivery IPO</span>
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Oct 2026</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>

                </motion.div>
              );
            })()}

            {/* Subscriptions */}
            {activeTab === "subscriptions" && (
              <motion.div
                key="subscriptions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
              >
                {/* Left Column: Subscriptions List */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950/10">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider font-semibold">Total Monthly Subscription Spend</span>
                      <span className="text-3xl font-black text-[var(--text-color)] font-mono"><RollingNumber value={monthlySubscriptionSpend} /> <span className="text-sm text-slate-500 font-medium">/month</span></span>
                    </div>
                    <div className="flex gap-4">
                      <div className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-slate-900/10 text-xs font-bold">
                        <span className="text-slate-500 block">Active services</span>
                        <span className="text-[var(--text-color)] font-bold mt-0.5 block">{activeSubscriptions.length} / {subscriptions.length}</span>
                      </div>
                      <div className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-slate-900/10 text-xs font-bold">
                        <span className="text-slate-500 block">AI savings found</span>
                        <span className="text-emerald-500 font-bold mt-0.5 block"><RollingNumber value={4220} />/mo projected</span>
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
                          {editingSubId === sub.id ? (
                            // EDITING SUBSCRIPTION
                            <div className="w-full flex flex-col gap-3">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Service Name</label>
                                  <input
                                    type="text"
                                    value={editSubName}
                                    onChange={(e) => setEditSubName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Recurring Cost</label>
                                  <input
                                    type="number"
                                    value={editSubPrice}
                                    onChange={(e) => setEditSubPrice(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Billing Interval</label>
                                  <select
                                    value={editSubInterval}
                                    onChange={(e) => setEditSubInterval(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 cursor-pointer"
                                  >
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Annually</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end mt-1">
                                <button
                                  onClick={handleCancelEditSub}
                                  className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-subtitle)] hover:bg-slate-500/5 transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEditSub(sub.id)}
                                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white shadow shadow-blue-500/10 transition-colors cursor-pointer"
                                >
                                  Save Bill
                                </button>
                              </div>
                            </div>
                          ) : (
                            // VIEWING SUBSCRIPTION
                            <>
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

                              <div className="flex items-center justify-between sm:justify-end gap-3.5">
                                <div className="text-right mr-2">
                                  <span className="font-bold text-[var(--text-color)] text-sm block font-mono"><RollingNumber value={sub.price} /></span>
                                  <span className="text-[10px] text-slate-500 mt-0.5 block uppercase tracking-wider font-bold">{sub.interval}</span>
                                </div>

                                <button
                                  onClick={() => handleStartEditSub(sub)}
                                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-500/10 transition-all cursor-pointer"
                                  title="Edit bill"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteSub(sub.id)}
                                  className="text-rose-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-all cursor-pointer mr-2"
                                  title="Delete subscription"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleToggleSub(sub.id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                    sub.status === "canceled"
                                      ? "bg-blue-600/10 border-blue-500/25 text-blue-500 dark:text-blue-400 hover:bg-blue-600/20"
                                      : "bg-rose-500/5 border-rose-500/10 text-rose-500 hover:bg-rose-500/10"
                                  }`}
                                >
                                  {sub.status === "active" ? "Cancel" : "Activate"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Add Subscription Form */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-4 bg-slate-950/10">
                    <div className="border-b border-[var(--border-color)] pb-3">
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Add Subscription</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">Configure new recurring bills</span>
                    </div>

                    <form onSubmit={handleAddSubscription} className="flex flex-col gap-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Service Name</label>
                        <input
                          type="text"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          placeholder="e.g. YouTube Premium"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 placeholder-slate-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Billing Cost</label>
                        <input
                          type="number"
                          value={newSubPrice}
                          onChange={(e) => setNewSubPrice(e.target.value)}
                          placeholder="e.g. 129"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 placeholder-slate-600 font-mono"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Billing Cycle</label>
                          <select
                            value={newSubInterval}
                            onChange={(e) => setNewSubInterval(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Annually</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Category</label>
                          <select
                            value={newSubCategory}
                            onChange={(e) => setNewSubCategory(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="Entertainment">Entertainment</option>
                            <option value="Music">Music</option>
                            <option value="Development">Development</option>
                            <option value="Design">Design</option>
                            <option value="AI Tools">AI Tools</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                      >
                        <Plus className="w-4 h-4" /> Add Service
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Insurance Vault */}
            {activeTab === "insurance" && (() => {
              // Real-Time Audit Calculations
              const lifePolicies = insurancePolicies.filter(p => p.type.toLowerCase().includes("life"));
              const totalLifeCover = lifePolicies.reduce((acc, p) => acc + p.coverage, 0);
              const monthlySalaryVal = manualSalary ? parseFloat(manualSalary) : 200000;
              const targetLifeCover = monthlySalaryVal * 12 * 10; // 10x Annual Salary

              const healthPolicies = insurancePolicies.filter(p => p.type.toLowerCase().includes("health") || p.type.toLowerCase().includes("medical"));
              const totalHealthCover = healthPolicies.reduce((acc, p) => acc + p.coverage, 0);

              const totalPremiums = insurancePolicies.reduce((acc, p) => acc + p.premium, 0);
              const premiumPercent = monthlySalaryVal > 0 ? (totalPremiums / monthlySalaryVal) * 100 : 0;

              // Calculate overall AI audit score
              let score = 30;
              if (totalLifeCover >= targetLifeCover) score += 35;
              else if (totalLifeCover > 0) score += 15;
              if (totalHealthCover >= 1000000) score += 35;
              else if (totalHealthCover > 0) score += 15;
              if (premiumPercent > 8) score -= 15;
              const finalScore = Math.max(10, Math.min(100, score));

              return (
                <motion.div
                  key="insurance"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
                >
                  {/* Left Column: Active Policies list */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
                      <div>
                        <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Insurance Cover Vault</span>
                        <span className="text-xs text-slate-500 mt-0.5 block">Audit and edit active security policies</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {insurancePolicies.map((policy) => {
                        const isEditing = editingInsuranceId === policy.id;
                        return (
                          <div 
                            key={policy.id} 
                            className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-[#11172b]/5 flex flex-col gap-4 relative"
                          >
                            {isEditing ? (
                              <form onSubmit={(e) => handleSaveEditInsurance(e, policy.id)} className="flex flex-col gap-3.5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Policy Type</label>
                                    <select
                                      value={editInsType}
                                      onChange={(e) => setEditInsType(e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-white focus:outline-none focus:border-blue-500"
                                    >
                                      <option value="Health Insurance">Health Insurance</option>
                                      <option value="Term Life Insurance">Term Life Insurance</option>
                                      <option value="Auto Insurance">Auto Insurance</option>
                                      <option value="Home Insurance">Home Insurance</option>
                                      <option value="Critical Illness Insurance">Critical Illness Insurance</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Provider Name</label>
                                    <input
                                      type="text"
                                      value={editInsProvider}
                                      onChange={(e) => setEditInsProvider(e.target.value)}
                                      placeholder="e.g. HDFC Ergo"
                                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-white focus:outline-none focus:border-blue-500"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Coverage Sum</label>
                                    <input
                                      type="number"
                                      value={editInsCoverage}
                                      onChange={(e) => setEditInsCoverage(e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Monthly Premium</label>
                                    <input
                                      type="number"
                                      value={editInsPremium}
                                      onChange={(e) => setEditInsPremium(e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Renewal Date</label>
                                    <input
                                      type="text"
                                      value={editInsRenewalDate}
                                      onChange={(e) => setEditInsRenewalDate(e.target.value)}
                                      placeholder="e.g. 15 Oct 2026"
                                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-white focus:outline-none focus:border-blue-500"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="flex gap-2 justify-end mt-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingInsuranceId(null)}
                                    className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer"
                                  >
                                    Save Policy
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-3">
                                  <div className="flex items-center gap-3 text-left">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                      <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-[var(--text-color)] text-sm">{policy.type}</h3>
                                      <p className="text-xs text-slate-500 mt-0.5">{policy.provider}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleStartEditInsurance(policy)}
                                      className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-500/10 transition-all cursor-pointer"
                                      title="Edit policy details"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleRemoveInsurance(policy.id)}
                                      className="text-rose-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-all cursor-pointer"
                                      title="Delete policy"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 my-1">
                                  <div>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Coverage Sum</span>
                                    <span className="text-base font-extrabold text-[var(--text-color)] mt-0.5 block font-mono">
                                      <RollingNumber value={policy.coverage} />
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Premium</span>
                                    <span className="text-base font-extrabold text-[var(--text-color)] mt-0.5 block font-mono">
                                      <RollingNumber value={policy.premium} /> <span className="text-[10px] text-slate-500 font-semibold">/month</span>
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Renewal Date</span>
                                    <span className="text-xs font-bold text-amber-500 mt-1 block">{policy.renewalDate}</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}

                      {insurancePolicies.length === 0 && (
                        <div className="text-center py-8 text-xs text-slate-500 italic">
                          No active insurance policies. Add a policy in the form on the right.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Add Form & AI Vault Audit */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Add Policy Card */}
                    <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-950/10 flex flex-col gap-4">
                      <div className="border-b border-[var(--border-color)] pb-3">
                        <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">Add Policy</span>
                        <span className="text-xs text-slate-500 mt-0.5 block">Manually register new insurance policy</span>
                      </div>

                      <form onSubmit={handleAddInsurance} className="flex flex-col gap-3.5 text-left">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Policy Type</label>
                          <select
                            value={addInsType}
                            onChange={(e) => setAddInsType(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="Health Insurance">Health Insurance</option>
                            <option value="Term Life Insurance">Term Life Insurance</option>
                            <option value="Auto Insurance">Auto Insurance</option>
                            <option value="Home Insurance">Home Insurance</option>
                            <option value="Critical Illness Insurance">Critical Illness Insurance</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Provider Name</label>
                          <input
                            type="text"
                            value={addInsProvider}
                            onChange={(e) => setAddInsProvider(e.target.value)}
                            placeholder="e.g. HDFC Ergo"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 placeholder-slate-600"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Coverage Sum</label>
                            <input
                              type="number"
                              value={addInsCoverage}
                              onChange={(e) => setAddInsCoverage(e.target.value)}
                              placeholder="e.g. 1000000"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 placeholder-slate-600 font-mono"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Premium</label>
                            <input
                              type="number"
                              value={addInsPremium}
                              onChange={(e) => setAddInsPremium(e.target.value)}
                              placeholder="e.g. 1500"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 placeholder-slate-600 font-mono"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Renewal Date</label>
                          <input
                            type="text"
                            value={addInsRenewalDate}
                            onChange={(e) => setAddInsRenewalDate(e.target.value)}
                            placeholder="e.g. 15 Oct 2026"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-color)] text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 placeholder-slate-600"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                        >
                          <Plus className="w-4 h-4" /> Add Policy
                        </button>
                      </form>
                    </div>

                    {/* AI Vault Audit Card */}
                    <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-950/10 flex flex-col gap-4">
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] border-b border-[var(--border-color)] pb-3 block">AI Vault Audit</span>

                      {/* Dynamic Audit Score Meter */}
                      <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-4 mb-1">
                        <div className="w-14 h-14 rounded-full border-[3px] border-blue-500/20 flex items-center justify-center relative">
                          {/* Radial border overlay for score representation */}
                          <div 
                            className="absolute inset-0 rounded-full border-[3px] border-blue-500" 
                            style={{ clipPath: `polygon(0 0, 100% 0, 100% ${finalScore}%, 0 ${finalScore}%)` }}
                          />
                          <span className="text-sm font-black text-white font-mono">{finalScore}%</span>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Protection Index</span>
                          <span className="text-xs font-black text-white block mt-0.5">
                            {finalScore >= 80 ? "Optimal Protection" : finalScore >= 50 ? "Moderate Protection" : "Critical Exposure"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 text-xs leading-relaxed text-left">
                        {/* 1. Life cover audit checks */}
                        {totalLifeCover === 0 ? (
                          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[var(--text-color)] block mb-0.5">No Life Insurance Cover</span>
                              <p className="text-[var(--text-subtitle)]">Your family represents ₹0 safety buffer. Recommended target: ₹{format(targetLifeCover)} (10x annual income).</p>
                            </div>
                          </div>
                        ) : totalLifeCover < targetLifeCover ? (
                          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[var(--text-color)] block mb-0.5">Under-insured Life Cover</span>
                              <p className="text-[var(--text-subtitle)]">Current life cover of ₹{format(totalLifeCover)} is below the 10x safety target of ₹{format(targetLifeCover)}.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[var(--text-color)] block mb-0.5">Optimal Life Cover Buffer</span>
                              <p className="text-[var(--text-subtitle)]">Life insurance cover of ₹{format(totalLifeCover)} matches the 10x multiplier benchmark.</p>
                            </div>
                          </div>
                        )}

                        {/* 2. Health cover audit checks */}
                        {totalHealthCover === 0 ? (
                          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[var(--text-color)] block mb-0.5">No Health Cover detected</span>
                              <p className="text-[var(--text-subtitle)]">You are exposed to direct medical outlays. Recommended medical buffer: ₹10L.</p>
                            </div>
                          </div>
                        ) : totalHealthCover < 1000000 ? (
                          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[var(--text-color)] block mb-0.5">Sub-optimal Health Shield</span>
                              <p className="text-[var(--text-subtitle)]">Medical cover of ₹{format(totalHealthCover)} is below recommended ₹10L critical care threshold.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[var(--text-color)] block mb-0.5">Optimal Medical Shield</span>
                              <p className="text-[var(--text-subtitle)]">Health cover of ₹{format(totalHealthCover)} matches safety standards for critical care.</p>
                            </div>
                          </div>
                        )}

                        {/* 3. Premium cashflow drag */}
                        {premiumPercent > 8 ? (
                          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[var(--text-color)] block mb-0.5">High Premium Cash Flow Drag</span>
                              <p className="text-[var(--text-subtitle)]">Premiums consume {premiumPercent.toFixed(1)}% of monthly salary. Recommended limit is under 5%.</p>
                            </div>
                          </div>
                        ) : premiumPercent > 0 ? (
                          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[var(--text-color)] block mb-0.5">Premium Flow Shielded</span>
                              <p className="text-[var(--text-subtitle)]">Premiums take up a healthy {premiumPercent.toFixed(1)}% of your monthly cash flow.</p>
                            </div>
                          </div>
                        ) : null}

                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
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
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
                      />
                      <button
                        onClick={handleUploadDocument}
                        disabled={uploadingDoc}
                        className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/5 text-xs font-bold text-[var(--text-color)] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {uploadingDoc ? <>Uploading...</> : <><Upload className="w-3.5 h-3.5" /> Upload File</>}
                      </button>
                      <button
                        onClick={() => setShowManualEntryModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" /> Manual Entry
                      </button>
                    </div>
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

                        <div className="flex items-center gap-2">
                          {/* Edit Pencil Button to make manual entry sheet editable once document is uploaded */}
                          <button 
                            onClick={() => {
                              setShowManualEntryModal(true);
                            }}
                            className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-slate-500/5 text-blue-500 transition-all cursor-pointer"
                            title="Edit Extracted Manual Sheet"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {doc.type !== "MANUAL" && (
                            <button className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-slate-500/5 text-slate-400 hover:text-[var(--text-color)] transition-all">
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 rounded-lg border border-rose-500/10 hover:border-rose-500/30 hover:bg-rose-500/10 text-rose-500 transition-all cursor-pointer"
                            title="Delete Document"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Begin AI Analysis */}
                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-blue-600/[0.02] flex flex-col gap-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-blue-500 border-b border-[var(--border-color)] pb-3 block flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5" /> AI Engine Analysis
                    </span>
                    <p className="text-xs text-[var(--text-subtitle)] leading-relaxed">
                      Trigger Fincody's neural scanner to read uploaded tax policies, salary payslips, and investments to automatically sync and update your entire financial profile.
                    </p>
                    <button
                      onClick={handleBeginAnalysis}
                      disabled={isAnalyzing || documents.length === 0}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-xs font-bold text-white shadow shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin animate-duration-1000" /> Analyzing files...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Begin AI Analysis
                        </>
                      )}
                    </button>
                    {documents.length === 0 && (
                      <span className="text-[10px] text-amber-500 font-bold text-center block">
                        Upload at least one document to start analysis
                      </span>
                    )}
                  </div>

                  <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-950/10 flex flex-col gap-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] border-b border-[var(--border-color)] pb-3 block">Vault Integrity</span>
                    
                    <div className="flex flex-col gap-3 text-xs leading-relaxed font-semibold">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Calculation Start Date</span>
                        <span className="text-[var(--text-color)] font-mono font-bold">{calculationStartDate}</span>
                      </div>
                      {/* Storage size calculated dynamically from real uploaded documents */}
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Storage Used</span>
                        <span className="text-[var(--text-color)] font-mono font-bold">
                          {(() => {
                            const totalMB = (documents || []).reduce((acc, doc) => {
                              const match = doc.size.match(/([0-9.]+)\s*(MB|KB|B)/i);
                              if (match) {
                                const val = parseFloat(match[1]);
                                const unit = match[2].toUpperCase();
                                if (unit === "MB") return acc + val;
                                if (unit === "KB") return acc + (val / 1024);
                                return acc + (val / (1024 * 1024));
                              }
                              return acc;
                            }, 0);
                            return totalMB.toFixed(2);
                          })()} MB / 5.0 GB
                        </span>
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
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Last Scanned Date</span>
                        <span className="text-[var(--text-color)] font-mono font-bold">
                          {documents.length > 0 ? documents[0].uploadedAt : "No scans performed"}
                        </span>
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
                          { label: `${format(2000000)}`, value: 20 },
                          { label: `${format(4000000)}`, value: 40 }
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
                      <span className="text-xs text-slate-500 mt-0.5 block">Projections in {activeCurrency.code}</span>
                    </div>
                    <div className="flex gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1 text-[var(--text-subtitle)]"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Standard</span>
                      <span className="flex items-center gap-1 text-blue-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Simulated</span>
                    </div>
                  </div>

                  <div className="w-full min-w-0 h-80">
                    <ResponsiveContainer width="99%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="simGradDashboard" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => format(val * 100000, true)} />
                        <Tooltip 
                          contentStyle={{ 
                            background: "var(--bg-color)", 
                            border: "1px solid var(--border-color)", 
                            borderRadius: "12px", 
                            color: "var(--text-color)" 
                          }} 
                          formatter={(value) => [format(Number(value) * 100000), "Value"]}
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
      </div>

      <AnimatePresence>
        {aiChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[320px] sm:w-[420px] h-[580px] rounded-2xl border border-blue-500/20 bg-slate-950/90 backdrop-blur-2xl shadow-[0_0_35px_rgba(59,130,246,0.25)] flex flex-col justify-between overflow-hidden text-left z-50"
              onDragOver={(e) => {
                e.preventDefault();
                setDragHover(true);
              }}
              onDragLeave={() => setDragHover(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragHover(false);
                const file = e.dataTransfer.files[0];
                if (file) handleDocumentUpload(file);
              }}
            >
              {/* Animated Glowing AI Orb Header */}
              <div className="h-20 border-b border-blue-500/10 flex items-center justify-between px-5 bg-slate-950/70 shrink-0 relative overflow-hidden">
                {/* Neural particles background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
                
                <div className="flex items-center gap-3 relative z-10">
                  {/* Dynamic Glowing AI Orb Avatar */}
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md animate-pulse" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      className="absolute inset-0 rounded-full border border-dashed border-blue-500/40"
                    />
                    <motion.div
                      animate={
                        isTyping || multistageThinking
                          ? { scale: [1, 1.15, 1], rotate: [0, 180, 360] }
                          : voiceSpeaking
                          ? { scale: [1, 1.25, 0.95, 1.15, 1] }
                          : { scale: [1, 1.05, 1] }
                      }
                      transition={
                        isTyping || multistageThinking
                          ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                          : voiceSpeaking
                          ? { repeat: Infinity, duration: 1, ease: "easeInOut" }
                          : { repeat: Infinity, duration: 4, ease: "easeInOut" }
                      }
                      className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 shadow-[0_0_12px_rgba(59,130,246,0.5)] flex items-center justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]" />
                      <Sparkles className="w-3.5 h-3.5 text-white/90" />
                    </motion.div>
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block tracking-wide flex items-center gap-1.5">
                      FINCODY AI <span className="text-[8px] bg-blue-500/20 border border-blue-500/30 text-blue-400 font-extrabold px-1 py-0.5 rounded uppercase">Jarvis v2.0</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold block flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Command Center
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 relative z-10">
                  {/* Voice mode status indicator */}
                  {voiceMode && (
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded font-black mr-2 animate-pulse">
                      Voice Active
                    </span>
                  )}
                  <button 
                    onClick={() => setAiChatOpen(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages and Welcome Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">
                
                {/* Drag and drop overlay */}
                {dragHover && (
                  <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 border-2 border-dashed border-blue-500/50 m-2 rounded-xl z-[999]">
                    <Upload className="w-10 h-10 text-blue-400 animate-bounce" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Drop statements here for AI scan</span>
                  </div>
                )}

                {/* Welcome Experience */}
                {chatMessages.length === 1 && (
                  <div className="py-6 text-center flex flex-col gap-4 border-b border-blue-500/5 bg-blue-600/[0.01] rounded-2xl p-4">
                    {/* Chatbot Memory Prompt */}
                    {hasAiMemory && (
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 text-left font-bold flex justify-between items-center mb-1 animate-in fade-in duration-300">
                        <span>🧠 Jarvis Memory: You asked about retirement last week.</span>
                        <button
                          onClick={() => handleSendChat("Continue my retirement plan simulation")}
                          className="px-2 py-0.5 rounded bg-indigo-600 text-white font-extrabold cursor-pointer"
                        >
                          Continue
                        </button>
                      </div>
                    )}

                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-dashed border-blue-500/20"
                      />
                      <motion.div
                        animate={
                          isTyping || multistageThinking
                            ? { scale: [1, 1.2, 1], rotate: [0, 180, 360] }
                            : voiceSpeaking
                            ? { scale: [1, 1.3, 0.9, 1.2, 1] }
                            : { scale: [1, 1.08, 1] }
                        }
                        transition={
                          isTyping || multistageThinking
                            ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                            : voiceSpeaking
                            ? { repeat: Infinity, duration: 1, ease: "easeInOut" }
                            : { repeat: Infinity, duration: 4, ease: "easeInOut" }
                        }
                        className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center"
                      >
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">👋 Welcome to FINCODY AI</h3>
                      <div className="h-6 overflow-hidden relative flex justify-center mt-1">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={welcomeTitleIndex}
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -15, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent"
                          >
                            {welcomeTitles[welcomeTitleIndex]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 max-w-[280px] mx-auto leading-relaxed">
                        Securely reads your dashboard context, active goals, assets, and liabilities to guide your financial decisions.
                      </p>
                    </div>

                    {/* Proactive suggestion cards inside welcome area */}
                    <div className="grid grid-cols-1 gap-2 text-left mt-2">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Proactive Co-Pilot Insights</span>
                      {[
                        { text: "💼 Save ₹23,000 in taxes using NPS & PPF", query: "Show me how to save ₹23,000 in taxes" },
                        { text: "📊 Switch underperforming SIP to equity index fund", query: "Which of my SIPs is underperforming?" },
                        { text: "💰 Increase monthly savings by ₹4,500", query: "Suggest how I can increase monthly savings" }
                      ].map((card, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSendChat(card.query)}
                          className="p-3 rounded-xl border border-blue-500/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-blue-500/30 cursor-pointer flex items-center justify-between transition-all"
                        >
                          <span className="text-[10px] text-slate-300 font-semibold">{card.text}</span>
                          <ArrowRight className="w-3 h-3 text-blue-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Laser scan animation when file is processed */}
                {scanAnimation && (
                  <div className="relative w-full h-24 border border-dashed border-blue-500/30 rounded-xl overflow-hidden bg-blue-600/[0.02] flex flex-col justify-center items-center gap-1.5 p-4 mt-2">
                    <motion.div
                      animate={{ y: [-10, 96, -10] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 shadow-[0_0_8px_#3b82f6]"
                    />
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Scanning document integrity & key dates...</span>
                  </div>
                )}

                {/* Chat message bubbles */}
                {chatMessages.map((msg, idx) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-3 max-w-[90%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-[10px] font-bold border ${
                        isUser 
                          ? "bg-slate-900 border-slate-800 text-slate-300" 
                          : "bg-gradient-to-tr from-blue-600 to-indigo-500 border-blue-400/30 text-white shadow-md shadow-blue-500/10"
                      }`}>
                        {isUser ? "U" : <Sparkles className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className={`p-3.5 rounded-2xl text-[11px] leading-relaxed border ${
                          isUser 
                            ? "bg-blue-600/90 border-blue-500/30 text-white rounded-tr-none" 
                            : "bg-slate-900/80 border-blue-500/10 text-slate-200 rounded-tl-none"
                        }`}>
                          {msg.text}

                          {/* Simulation Widget integration inside message bubble */}
                          {!isUser && msg.text.includes("[SIMULATION:") && (
                            <SimulationWidget type={msg.text.includes("MBA") ? "MBA" : "SIP"} />
                          )}
                        </div>
                        <span className={`text-[9px] text-slate-500 font-bold px-1.5 ${isUser ? "text-right" : "text-left"}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Dynamic AI Multistage Thinking Pipeline */}
                {isTyping && (
                  <div className="flex gap-3 max-w-[90%]">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white border border-blue-500/20 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-900/80 border border-blue-500/10 w-full">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">
                          {multistageThinking}
                        </span>
                      </div>
                      
                      {/* Pulse Loading Skeleton layout */}
                      <div className="space-y-2 mt-2">
                        <div className="h-2 bg-slate-800 rounded-full w-full animate-pulse" />
                        <div className="h-2 bg-slate-800 rounded-full w-5/6 animate-pulse" />
                        <div className="h-2 bg-slate-800 rounded-full w-2/3 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sound wave visualizer in voice mode */}
                {voiceMode && (
                  <div className="border-t border-blue-500/10 pt-4 mt-2 flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-2">Voice Wave Input</span>
                    <div className="flex justify-center items-end gap-1 h-8">
                      {[...Array(9)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={
                            voiceSpeaking
                              ? { height: [8, Math.random() * 32 + 8, 8] }
                              : { height: [8, 12, 8] }
                          }
                          transition={{
                            repeat: Infinity,
                            duration: 0.6 + i * 0.05,
                            ease: "easeInOut"
                          }}
                          className="w-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-full"
                          style={{ height: "8px" }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Chips Drawer */}
              <div className="px-4 py-2 border-t border-blue-500/10 flex gap-2 overflow-x-auto shrink-0 bg-slate-950/40 scrollbar-none">
                {[
                  { label: "📊 Analyze Portfolio", query: "Analyze my portfolio" },
                  { label: "💰 Reduce Expenses", query: "How do I reduce expenses?" },
                  { label: "📈 Better Yields", query: "Find better investment options" },
                  { label: "🎯 Retirement Plan", query: "Can I retire at 45?" }
                ].map((action, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChat(action.query)}
                    className="px-3 py-1.5 rounded-xl border border-blue-500/10 bg-slate-900/40 hover:bg-blue-600/10 hover:border-blue-500/30 text-[10px] font-bold text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Input Form Box */}
              <div className="p-4 border-t border-blue-500/10 flex gap-2 shrink-0 bg-slate-950/60 relative">
                
                {/* Voice mode toggle button */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !voiceMode;
                    setVoiceMode(next);
                    if (!next) {
                      setVoiceSpeaking(false);
                      try { window.speechSynthesis.cancel(); } catch (e) {}
                    }
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                    voiceMode 
                      ? "bg-indigo-600 border-indigo-400/30 text-white shadow shadow-indigo-500/20"
                      : "bg-slate-900/50 border-blue-500/10 text-slate-400 hover:text-white"
                  }`}
                  title="Toggle Voice Mode"
                >
                  <Activity className={`w-4 h-4 ${voiceMode ? "animate-pulse" : ""}`} />
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatInput)}
                  placeholder={voiceMode ? "Speak or type details..." : "Ask FINCODY AI..."}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/50 border border-blue-500/10 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500/30 transition-all text-white font-semibold"
                />
                <button
                  onClick={() => handleSendChat(chatInput)}
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 transition-all shadow shadow-blue-500/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Manual Entry Modal */}
      {/* Interactive, creative Financial Health Score details page modal */}
      <AnimatePresence>
        {showScoreModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-lg glass-card rounded-3xl border border-blue-500/25 p-8 shadow-2xl relative bg-slate-900/95 text-left flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowScoreModal(false)}
                className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-blue-500/10 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">Fincody Financial Health Index</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">FHI Engine Analysis</p>
                </div>
              </div>

              {/* Score Circular Glow Gauge */}
              <div className="flex flex-col items-center py-6 gap-3 rounded-2xl bg-slate-950/40 border border-blue-500/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none" />
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="54" 
                      stroke="#10b981" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 54} 
                      strokeDashoffset={2 * Math.PI * 54 * (1 - dynamicCalculatedHealthScore/100)} 
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute text-4xl font-mono font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    {dynamicCalculatedHealthScore}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    {dynamicCalculatedHealthScore >= 80 ? "Excellent Solvency" : dynamicCalculatedHealthScore >= 60 ? "Stable Standpoint" : "Action Required"}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[280px]">Computed dynamically from real-time asset balances, monthly savings rate, and subscription weight.</p>
                </div>
              </div>

              {/* Main Points of Calculations */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-1">How it is calculated</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/20 border border-slate-800/40">
                    <span className="text-slate-500 block uppercase text-[8px] font-bold tracking-wider">Savings Index (40%)</span>
                    <span className="font-bold text-white block mt-1">{"₹" + calculatedMonthlySavings.toLocaleString()} / mo</span>
                    <span className="text-[9px] text-emerald-400 font-semibold mt-0.5 block">Score: {healthSavingsScore}/40</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/20 border border-slate-800/40">
                    <span className="text-slate-500 block uppercase text-[8px] font-bold tracking-wider">Safety Net (30%)</span>
                    <span className="font-bold text-white block mt-1">{healthEmergencyGoal ? (Math.round((healthEmergencyGoal.current / healthEmergencyGoal.target)*100) + "% Done") : "No Goal Set"}</span>
                    <span className="text-[9px] text-emerald-400 font-semibold mt-0.5 block">Score: {healthEmergencyScore}/30</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/20 border border-slate-800/40">
                    <span className="text-slate-500 block uppercase text-[8px] font-bold tracking-wider">Services Load (30%)</span>
                    <span className="font-bold text-white block mt-1">{activeSubsCount} Active Services</span>
                    <span className="text-[9px] text-emerald-400 font-semibold mt-0.5 block">Score: {healthSubScore}/30</span>
                  </div>
                </div>
              </div>

              {/* Depiction Explanation */}
              <div className="flex flex-col gap-2 bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">What this depicts</span>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  This index evaluates your financial resilience. A score above **80** indicates a secure savings buffer and low service overheads, protecting you from sudden income disruption. A score below **60** highlights high subscription dependency or savings rates below 15%.
                </p>
              </div>

              {/* Personal Improvement Recommendations */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-1">Recommendations to Improve</span>
                <ul className="text-xs text-slate-300 space-y-2 font-semibold">
                  {savingsRateRatio < 0.25 && (
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{"Increase your monthly savings surplus (currently " + Math.round(savingsRateRatio*100) + "%) to at least 25% by auditing monthly subscriptions."}</span>
                    </li>
                  )}
                  {activeSubsCount > 3 && (
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{"You have " + activeSubsCount + " active subscriptions. Cancel at least 2 services inside your Subscriptions vault to reclaim liquid monthly capacity."}</span>
                    </li>
                  )}
                  {!healthEmergencyGoal && (
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>No Emergency Fund Goal detected. Create a goal of at least 3 months expenses inside your **Goal Engine** to secure your safety score.</span>
                    </li>
                  )}
                  {dynamicCalculatedHealthScore >= 80 && (
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Your score is premium! Lock in current high rates by allocating 15% of your equities into Fixed Deposits.</span>
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showManualEntryModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-card rounded-2xl border border-[var(--border-color)] p-8 shadow-2xl relative bg-slate-900/95 text-left animate-in zoom-in-95 duration-200 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-color)]">Manual Financial Entry</h3>
                <p className="text-xs text-[var(--text-subtitle)] mt-0.5">Override or link values manually</p>
              </div>
              <button
                onClick={() => setShowManualEntryModal(false)}
                className="text-[var(--text-subtitle)] hover:text-[var(--text-color)] p-1 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleManualEntrySubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary ({activeCurrency.symbol}/month)</label>
                <input
                  type="number"
                  value={manualSalary}
                  onChange={(e) => setManualSalary(e.target.value)}
                  placeholder="e.g. 200000"
                  className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/30 text-[var(--text-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cash & Bank Balance ({activeCurrency.symbol})</label>
                <input
                  type="number"
                  value={manualNetWorth}
                  onChange={(e) => setManualNetWorth(e.target.value)}
                  placeholder="e.g. 3845210"
                  className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/30 text-[var(--text-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Other Monthly Expenses ({activeCurrency.symbol})</label>
                <input
                  type="number"
                  value={manualOtherExpenses}
                  onChange={(e) => setManualOtherExpenses(e.target.value)}
                  placeholder="e.g. 45000"
                  className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/30 text-[var(--text-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calculation Start Date</label>
                <input
                  type="date"
                  value={calculationStartDate}
                  onChange={(e) => setCalculationStartDate(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500/30 text-[var(--text-color)] [color-scheme:dark] light:[color-scheme:light]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
              >
                Apply Updates
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Stock Chart Modal */}
      {isChartModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl glass-card rounded-2xl border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl relative bg-slate-900/95 text-left animate-in zoom-in-95 duration-200 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white font-mono">{selectedStockSymbol}</h3>
                  {quotes[selectedStockSymbol] && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      quotes[selectedStockSymbol].marketState === "Open" 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : "bg-slate-800 text-slate-400 border border-slate-700/50"
                    }`}>
                      {quotes[selectedStockSymbol].marketState} Market
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Interactive real-time chart • Quotes refreshed every 20s
                </p>
              </div>
              <button
                onClick={() => setIsChartModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Info Banner */}
            {quotes[selectedStockSymbol] && (() => {
              const q = quotes[selectedStockSymbol];
              const isPositive = q.change >= 0;
              return (
                <div className="flex justify-between items-end bg-slate-950/30 p-4 rounded-xl border border-[var(--border-color)]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Live Market Value</span>
                    <span className="text-3xl font-black text-white font-mono block mt-1">
                      <RollingNumber value={q.price} />
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Day Change</span>
                    <span className={`text-base font-black font-mono block mt-1 ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                      {isPositive ? "▲" : "▼"} <RollingNumber value={Math.abs(q.change)} /> ({isPositive ? "+" : ""}{q.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Timeframe Selectors */}
            <div className="flex gap-2 border-b border-[var(--border-color)] pb-3 overflow-x-auto shrink-0">
              {["1D", "1W", "1M", "6M", "1Y", "Max"].map((range) => (
                <button
                  key={range}
                  onClick={() => fetchChartHistory(selectedStockSymbol, range)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedStockHistoryRange === range
                      ? "bg-blue-600 border-blue-500 text-white shadow shadow-blue-500/20"
                      : "bg-[#11172a]/30 border-[var(--border-color)] text-slate-400 hover:text-white hover:bg-[#11172a]/50"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Chart Area */}
            <div className="w-full min-w-0 h-80 relative flex items-center justify-center bg-slate-950/15 rounded-xl border border-[var(--border-color)] p-4">
              {historyLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-xs text-slate-500">Retrieving exchange history...</span>
                </div>
              ) : selectedStockHistory && selectedStockHistory.length > 0 ? (() => {
                const firstPrice = selectedStockHistory[0].price;
                const lastPrice = selectedStockHistory[selectedStockHistory.length - 1].price;
                const isOverallPositive = lastPrice >= firstPrice;

                return (
                  <ResponsiveContainer width="99%" height="100%">
                    <AreaChart data={selectedStockHistory}>
                      <defs>
                        <linearGradient id="chartOverlayGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isOverallPositive ? "#10b981" : "#ef4444"} stopOpacity={0.25}/>
                          <stop offset="95%" stopColor={isOverallPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="time" 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10}
                      />
                      <YAxis 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        domain={["auto", "auto"]}
                        dx={-5}
                        tickFormatter={(val) => format(val, true)}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--bg-color)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "12px",
                          color: "var(--text-color)"
                        }}
                        formatter={(value) => [format(Number(value)), "Price"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke={isOverallPositive ? "#10b981" : "#ef4444"} 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#chartOverlayGrad)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                );
              })() : (
                <div className="text-xs text-slate-500">No chart data found for this range.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-[var(--border-color)] pt-4">
              <button
                onClick={() => setIsChartModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-[var(--border-color)] bg-slate-900/30 hover:bg-slate-900/60 text-xs font-bold text-white transition-all"
              >
                Close Portal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Profile Details & Edit Popover Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[290px] glass-card rounded-2xl border border-blue-500/20 p-5 shadow-2xl relative bg-slate-950/95 text-center animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => {
                setShowProfileModal(false);
                setProfileError("");
                setProfileSuccess("");
              }}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Brand Logo Identity */}
            <div className="flex justify-center mb-3">
              <FincodyLogo variant="compact" />
            </div>

            <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-3 font-black text-lg">
              {user?.user_metadata?.full_name 
                ? user.user_metadata.full_name.slice(0, 1).toUpperCase() 
                : (user?.email ? user.email.slice(0, 1).toUpperCase() : "U")}
            </div>

            <h3 className="text-sm font-black text-white mb-0.5">
              {user ? "Your Profile" : "Profile Settings"}
            </h3>
            <p className="text-[10px] text-slate-400 mb-4 truncate max-w-full">
              {user ? user.email : "no-email@fincody.com"}
            </p>

            {profileError && (
              <div className="mb-3.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-400 text-left">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="mb-3.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 text-left">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-left">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileEditName}
                  onChange={(e) => setProfileEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-slate-900 border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 placeholder-slate-600 font-semibold"
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-55"
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2 rounded-xl border border-[var(--border-color)] text-[10px] font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all uppercase tracking-wider cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
