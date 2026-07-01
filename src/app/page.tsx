"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  ArrowRight, 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Calendar, 
  Compass, 
  Activity, 
  HelpCircle,
  Briefcase,
  GraduationCap,
  Home as HomeIcon,
  PiggyBank,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Clock,
  BookOpen,
  Zap,
  AlertTriangle
,
  Volume2,
  VolumeX
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import FincodyLogo from "@/components/FincodyLogo";
import CurrencyRibbon from "@/components/CurrencyRibbon";
import RollingNumber from "@/components/RollingNumber";

// Features data
const FEATURES = [
  {
    icon: Bot,
    title: "AI Financial Command Center",
    desc: "A unified cockpit tracking every account, subscription, and asset with real-time optimization suggestions.",
    color: "from-blue-500/20 to-indigo-500/20",
    border: "group-hover:border-blue-500/30"
  },
  {
    icon: Compass,
    title: "Goal Planning Engine",
    desc: "Map your long-term milestones. Our AI creates weekly micro-budgets to ensure you hit them.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "group-hover:border-emerald-500/30"
  },
  {
    icon: TrendingUp,
    title: "Future Simulator",
    desc: "Run multi-variable scenarios (MBA, real estate purchase, career pivot) to see 30-year net worth impact.",
    color: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/30"
  },
  {
    icon: Shield,
    title: "Insurance Vault",
    desc: "AI audits your coverage across health, life, and auto to highlight gaps and eliminate redundant premium costs.",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "group-hover:border-cyan-500/30"
  },
  {
    icon: Activity,
    title: "Investment Tracker",
    desc: "Consolidated portfolio tracking with AI rebalancing suggestions and automated tax-loss harvesting alerts.",
    color: "from-rose-500/20 to-orange-500/20",
    border: "group-hover:border-rose-500/30"
  },
  {
    icon: Calendar,
    title: "Subscription Monitor",
    desc: "Never pay for forgotten trials again. One-click cancellation and usage-based alert notifications.",
    color: "from-amber-500/20 to-yellow-500/20",
    border: "group-hover:border-amber-500/30"
  },
  {
    icon: HelpCircle,
    title: "Life Decision Assistant",
    desc: "Quantify major life changes. Compare renting vs. buying, job offers, or moving abroad with statistical confidence.",
    color: "from-indigo-500/20 to-violet-500/20",
    border: "group-hover:border-indigo-500/30"
  }
];

// AI Demo Questions & Structured Responses
const AI_DEMO_DATA = [
  {
    question: "Can I afford a ₹15 lakh car?",
    loadingTime: 1200,
    response: {
      analysis: "Based on your current monthly savings of ₹75,000 and liquid reserves of ₹6,00,000, purchasing a ₹15 Lakh car with a ₹5L downpayment and ₹10L loan over 5 years (at 9.5% interest) is classified as:",
      status: "Affordable but Tight",
      statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      metrics: [
        { label: "New Monthly EMI", value: "₹21,002", detail: "28.0% of your savings rate" },
        { label: "Total Interest Paid", value: "₹2.60 Lakhs", detail: "Over 60 months duration" },
        { label: "Emergency Fund Buffer", value: "1.3 Months", detail: "Down from 8 months buffer" },
        { label: "Affordability Score", value: "72/100", detail: "Optimal score is >80" }
      ],
      verdict: "Approved, but we recommend delaying the purchase by 4 months. This will allow your liquid emergency buffer to rebuild to 4 months of essential living expenses, protecting your investment portfolio."
    }
  },
  {
    question: "Should I pursue an MBA or stay in my career?",
    loadingTime: 1400,
    response: {
      analysis: "Simulating a 2-year top-tier MBA (cost: ₹30 Lakhs tuition, ₹24 Lakhs opportunity cost in lost salary) vs. staying in your current Software Engineering track with 10% annual salary growth:",
      status: "Highly Advised (Long-term ROI)",
      statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      metrics: [
        { label: "MBA Breakeven Period", value: "4.3 Years", detail: "Post-graduation payback" },
        { label: "Career Opportunity Cost", value: "₹54.0 Lakhs", detail: "Tuition + lost salary" },
        { label: "10-Year Net Worth Delta", value: "+₹1.48 Crores", detail: "With post-MBA growth trajectory" },
        { label: "Internal Rate of Return", value: "21.6% IRR", detail: "Outperforms index investments" }
      ],
      verdict: "The simulation strongly recommends the MBA. The upfront cost is fully compensated by Year 5 due to an estimated 65% immediate base salary increase upon graduation and accelerated promotion velocity."
    }
  },
  {
    question: "How much will I save if I cancel Netflix & Spotify?",
    loadingTime: 900,
    response: {
      analysis: "Canceling Netflix Premium (₹649/mo) and Spotify Duo (₹179/mo) yields a recurring monthly savings of ₹828. If you route this exact amount automatically into a diversified Index Fund yielding 12% annually:",
      status: "Micro-Optimization Alert",
      statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      metrics: [
        { label: "Monthly Cash Savings", value: "₹828", detail: "₹9,936 saved annually" },
        { label: "10-Year Future Value", value: "₹1,90,470", detail: "With compound growth" },
        { label: "30-Year Future Value", value: "₹28.97 Lakhs", detail: "The power of time" },
        { label: "Total Invested Capital", value: "₹2.98 Lakhs", detail: "Interest earned: ₹25.99L" }
      ],
      verdict: "While a minor savings in absolute terms, setting up this automation builds critical wealth habits. The compounding effect turns ₹828/month into a major future downpayment over 30 years."
    }
  }
];


const LIVE_NEWS_DATA = [
  {
    id: "news-1",
    country: "India",
    category: "Markets",
    headline: "Sensex reaches historic milestone, crosses 90,000 mark amid record inflows",
    summary: "Domestic equities surged on strong institutional buy-side support and robust GDP projections. Private banking and solar energy sectors led the market rally.",
    source: "Bloomberg Quint",
    timestamp: "Just now",
    breaking: true,
    impact: "Bullish",
    severity: "High Impact",
    confidence: 96,
    affected: [
      { symbol: "^BSESN", name: "SENSEX", change: 1.15 },
      { symbol: "RELIANCE.NS", name: "Reliance Industries", change: 2.34 },
      { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd", change: 1.85 }
    ],
    whyItMatters: "Crossing 90,000 indicates absolute retail investor strength and rising global asset allocations to Indian equities.",
    whoIsAffected: "Retail investors, domestic mutual funds, and foreign institutional portfolios.",
    shortTerm: "Equities will likely see minor profit booking but remain highly liquid.",
    longTerm: "Signals a structural transition of the Indian economy to higher valuation multiple brackets.",
    opportunities: "Accumulate banking blue chips and high-growth energy providers.",
    risks: "Slight short-term valuation stretch; potential global headwinds."
  },
  {
    id: "news-2",
    country: "USA",
    category: "Stocks",
    headline: "Apple beats Q3 earnings expectations with double-digit growth in services",
    summary: "Tech giant posts record Q3 revenues, powered by high service margins and strong international device upgrades. Cash flow conversion reaches all-time high.",
    source: "Wall Street Journal",
    timestamp: "3 mins ago",
    breaking: true,
    impact: "Bullish",
    severity: "High Impact",
    confidence: 94,
    affected: [
      { symbol: "AAPL", name: "Apple Inc.", change: 4.82 },
      { symbol: "COMPQ", name: "Nasdaq", change: 1.25 }
    ],
    whyItMatters: "Apple's service expansion offsets traditional hardware cyclicality, raising its premium recurring revenue valuation.",
    whoIsAffected: "Mega-cap tech holders, passive index funds, and global supply chain suppliers.",
    shortTerm: "Shares are expected to open up 4% to 5% with strong volume support.",
    longTerm: "Secures Apple's position as the primary high-end consumer wallet holder.",
    opportunities: "Excellent baseline addition for defensive growth investors.",
    risks: "Supply chain chip delivery bottlenecks in partner semiconductor sites."
  },
  {
    id: "news-3",
    country: "Global",
    category: "Economy",
    headline: "US Inflation drops to 2.4%, raising expectations of an upcoming Fed rate cut",
    summary: "Consumer Price Index registers lower-than-anticipated core inflation, signaling interest rate relief. Yield curves flatten across 10-year US Treasuries.",
    source: "Financial Times",
    timestamp: "12 mins ago",
    breaking: false,
    impact: "Bullish",
    severity: "High Impact",
    confidence: 88,
    affected: [
      { symbol: "SPX", name: "S&P 500", change: 0.85 },
      { symbol: "TNX", name: "US 10Y Yield", change: -3.42 }
    ],
    whyItMatters: "Lower inflation provides the Federal Reserve the necessary room to decrease cost of funds, supporting risk assets globally.",
    whoIsAffected: "Global borrowers, emerging market equities, and corporate debt holders.",
    shortTerm: "Bond yields decrease, causing money to flow back into high-growth equity sectors.",
    longTerm: "Decreases refinancing costs, strengthening corporate balance sheets over 24 months.",
    opportunities: "Long-duration bonds and high-dividend growth sectors.",
    risks: "Potential lag in employment rates if cut is delayed."
  },
  {
    id: "news-4",
    country: "Europe",
    category: "Banking",
    headline: "European Central Bank announces surprise 25bps repo rate cut to stimulate growth",
    summary: "ECB cuts borrowing rates for the second time this quarter to counteract manufacturing slumps in Germany and boost consumer demand.",
    source: "Reuters",
    timestamp: "32 mins ago",
    breaking: false,
    impact: "Bullish",
    severity: "Medium Impact",
    confidence: 91,
    affected: [
      { symbol: "^FCHI", name: "CAC 40", change: 0.64 },
      { symbol: "^GDAXI", name: "DAX Index", change: 0.72 }
    ],
    whyItMatters: "First major rate cycle decoupling from the Federal Reserve, aiming to shield the EU bloc from credit crunches.",
    whoIsAffected: "EU commercial banks, export manufacturers, and real estate developers.",
    shortTerm: "Euro weakens slightly against USD, supporting export-oriented corporations.",
    longTerm: "Provides liquidity cushion, mitigating banking defaults in industrial hubs.",
    opportunities: "EU blue-chip industrial and luxury exporters.",
    risks: "Slight threat of import inflation if Euro drops significantly."
  },
  {
    id: "news-5",
    country: "Japan",
    category: "Policy",
    headline: "Bank of Japan increases interest rates to defend Yen against currency depreciation",
    summary: "In a landmark policy shift, the BOJ raised baseline yields to 0.25%, ending decades of negative carry trade patterns and currency defense campaigns.",
    source: "Nikkei Asia",
    timestamp: "1 hour ago",
    breaking: true,
    impact: "Bearish",
    severity: "High Impact",
    confidence: 95,
    affected: [
      { symbol: "^N225", name: "NIKKEI 225", change: -2.14 },
      { symbol: "USDJPY", name: "USD/JPY", change: -1.82 }
    ],
    whyItMatters: "Unwinding of the global Yen carry trade causes temporary liquidity reshuffles across international hedge funds.",
    whoIsAffected: "Carry traders, global tech equities, and Japanese exporting giants.",
    shortTerm: "Initial sell-off in Nikkei; Yen gains strength.",
    longTerm: "Restores normal capital cost structures within Japan; attracts local savers.",
    opportunities: "Japanese domestic retail banks and domestic real estate companies.",
    risks: "Short-term leverage margin calls across global asset markets."
  },
  {
    id: "news-6",
    country: "Asia",
    category: "Technology",
    headline: "TSMC reports 40% surge in advanced AI silicon packaging demand",
    summary: "The semiconductor giant reports packaging pipelines are fully booked through 2027, driven by cloud hyperscaler chip packaging demand.",
    source: "TechCrunch",
    timestamp: "2 hours ago",
    breaking: false,
    impact: "Bullish",
    severity: "Medium Impact",
    confidence: 92,
    affected: [
      { symbol: "TSM", name: "TSMC Ltd", change: 3.12 },
      { symbol: "NVDA", name: "NVIDIA Corp", change: 2.85 }
    ],
    whyItMatters: "Confirms AI infrastructure spending continues at institutional scale with no immediate signs of capital deceleration.",
    whoIsAffected: "Semiconductor supply chains, AI design houses, and cloud computing providers.",
    shortTerm: "Attracts buy-volume back into AI equipment and lithography suppliers.",
    longTerm: "Enables mass scale cloud deployments of autonomous systems and agents.",
    opportunities: "Equipment builders (ASML) and silicon packaging suppliers.",
    risks: "High geographical concentration of silicon fabrication facilities."
  }
];
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [demoState, setDemoState] = useState<"idle" | "typing" | "showing">("showing");
  const [typedText, setTypedText] = useState(AI_DEMO_DATA[0].question);
  
  // Theme Switching State
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  // Fincody Live Feed States
  const [selectedCountry, setSelectedCountry] = useState("Global");
  const [selectedCategory, setSelectedCategory] = useState("Markets");
  const [activeArticle, setActiveArticle] = useState<any>(null);
  const [countdownString, setCountdownString] = useState("02:14:45");
  const [expandedMattersId, setExpandedMattersId] = useState<string | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [liveStocks, setLiveStocks] = useState([
    { name: "SENSEX", price: 90140.25, change: 1.15, up: true },
    { name: "NIFTY 50", price: 27325.80, change: 1.08, up: true },
    { name: "NASDAQ", price: 19845.50, change: -0.42, up: false },
    { name: "BTC-USD", price: 96420.00, change: 5.42, up: true }
  ]);

  useEffect(() => {
    const stockInterval = setInterval(() => {
      setLiveStocks((prev) => 
        prev.map((s) => {
          const delta = (Math.random() - 0.48) * (s.price * 0.0005);
          const newPrice = s.price + delta;
          const pct = ((delta / s.price) * 100);
          return {
            ...s,
            price: newPrice,
            change: s.change + pct,
            up: delta >= 0
          };
        })
      );
    }, 4000);
    return () => clearInterval(stockInterval);
  }, []);



  // Countdown timer simulation for economic calendar
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = 24 - now.getHours() - 1;
      const minutes = 60 - now.getMinutes() - 1;
      const seconds = 60 - now.getSeconds();
      setCountdownString(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews = LIVE_NEWS_DATA.filter((item) => {
    const countryMatch = selectedCountry === "Global" || item.country === selectedCountry;
    const categoryMatch = selectedCategory === "Markets" || item.category === selectedCategory;
    return countryMatch && categoryMatch;
  });



  // Supabase Client state
  const [user, setUser] = useState<any>(null);
  const [tempName, setTempName] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
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

  const [editName, setEditName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    // Sync theme with HTML class
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchUser();

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fincody_user_name");
      setTempName(saved);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const name = session.user.user_metadata?.full_name;
        if (name) {
          localStorage.setItem("fincody_user_name", name);
          setTempName(name);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");
    
    if (!user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("fincody_user_name", editName);
        setTempName(editName);
      }
      setProfileSuccess("Name updated locally! Please verify your email to sync.");
      setTimeout(() => {
        setProfileSuccess("");
        setShowProfileModal(false);
      }, 2000);
      setIsSavingProfile(false);
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: editName }
    });

    if (error) {
      setProfileError(error.message);
    } else {
      setProfileSuccess("Profile updated successfully!");
      if (typeof window !== "undefined") {
        localStorage.setItem("fincody_user_name", editName);
        setTempName(editName);
      }
      setUser(data.user);
      setTimeout(() => {
        setProfileSuccess("");
        setShowProfileModal(false);
      }, 1500);
    }
    setIsSavingProfile(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("fincody_user_name");
      setTempName(null);
    }
    setUser(null);
  };

  // Future Simulator interactive state
  const [salaryIncrease, setSalaryIncrease] = useState(12); // %
  const [savingsRate, setSavingsRate] = useState(35); // %
  const [mbaCost, setMbaCost] = useState(0); // ₹ Lakhs (0 = no MBA)
  const [homePurchaseYear, setHomePurchaseYear] = useState(0); // Year (0 = no house)

  const handleDemoQuestionClick = async (index: number) => {
    if (demoState === "typing") return;
    setActiveQuestion(index);
    setDemoState("typing");
    setTypedText("");
    
    const targetText = AI_DEMO_DATA[index].question;
    for (let i = 0; i <= targetText.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setTypedText(targetText.slice(0, i));
    }
    
    await new Promise((resolve) => setTimeout(resolve, AI_DEMO_DATA[index].loadingTime));
    setDemoState("showing");
  };

  // Generate Future Projections Chart Data
  const generateChartData = () => {
    const data = [];
    let baseWorth = 10; // Initial Net Worth (₹ Lakhs)
    let simulatedWorth = 10;
    
    const annualSavingsAmount = 6; // Base savings ₹6L/year (₹50k/mo)
    const baseGrowth = 1.08; // 8% net asset yield
    
    for (let year = 1; year <= 30; year++) {
      // Base Case (8% salary increase, 25% savings rate)
      const baseSavings = annualSavingsAmount * Math.pow(1.08, year - 1) * 0.25;
      baseWorth = (baseWorth + baseSavings) * baseGrowth;

      // Simulated Case
      const currentSalaryMultiplier = Math.pow(1 + (salaryIncrease / 100), year - 1);
      let yearSavings = annualSavingsAmount * currentSalaryMultiplier * (savingsRate / 100);
      
      // Apply MBA impact: Year 2 and 3 have 0 savings, cost deducted. Post Year 3 salary gets +50% bump.
      if (mbaCost > 0) {
        if (year === 2) {
          simulatedWorth -= (mbaCost / 2);
          yearSavings = 0;
        } else if (year === 3) {
          simulatedWorth -= (mbaCost / 2);
          yearSavings = 0;
        } else if (year > 3) {
          yearSavings = annualSavingsAmount * currentSalaryMultiplier * 1.5 * (savingsRate / 100);
        }
      }

      // Apply Home Purchase impact: Year chosen has downpayment deducted
      if (homePurchaseYear > 0 && year === homePurchaseYear) {
        simulatedWorth -= 15; // ₹15 Lakh downpayment
      }

      simulatedWorth = (simulatedWorth + yearSavings) * baseGrowth;

      // Avoid negative net worth displays
      const finalSim = simulatedWorth < -20 ? -20 : simulatedWorth;

      data.push({
        name: `Yr ${year}`,
        "Standard": Math.round(baseWorth),
        "Fincody Projections": Math.round(finalSim)
      });
    }
    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] overflow-x-hidden relative selection:bg-blue-500/30 selection:text-white transition-colors duration-300">
      

      
      {/* Background Ambient Orbs (respecting light/dark opacity) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-500/5 blur-[120px] pointer-events-none transition-all duration-300" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 light:bg-indigo-500/5 blur-[130px] pointer-events-none transition-all duration-300" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 light:bg-emerald-500/2 blur-[120px] pointer-events-none transition-all duration-300" />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-[var(--border-color)] backdrop-blur-md">
        <div className="max-w-none w-[97%] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <FincodyLogo variant="desktop" />
            </Link>

            {/* Circular Profile Avatar (Always Visible) */}
            <button
              onClick={() => {
                if (user) {
                  setEditName(user.user_metadata?.full_name ?? "");
                  setShowProfileModal(true);
                } else {
                  window.location.href = "/dashboard";
                }
              }}
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center transition-all shadow-md shadow-blue-500/20 hover:scale-105 cursor-pointer border border-blue-400/20"
              title={user ? "View & Edit Profile" : "Sign In"}
            >
              {user ? (
                user.user_metadata?.full_name 
                  ? user.user_metadata.full_name.slice(0, 1).toUpperCase() 
                  : (user.email ? user.email.slice(0, 1).toUpperCase() : "U")
              ) : (
                <User className="w-4.5 h-4.5 text-white" />
              )}
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-subtitle)]">
            <Link href="/" className="text-white font-extrabold transition-colors">Home</Link>
            <Link href="/live" className="hover:text-[var(--text-color)] transition-colors">FinCody Live</Link>
            <a href="#features" className="hover:text-[var(--text-color)] transition-colors">Features</a>
            <a href="#demo" className="hover:text-[var(--text-color)] transition-colors">AI Demo</a>
            <a href="#simulator" className="hover:text-[var(--text-color)] transition-colors">Simulator</a>
            <a href="#pricing" className="hover:text-[var(--text-color)] transition-colors">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/10 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-colors"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-sm font-medium text-[var(--text-subtitle)] hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-colors border border-[var(--border-color)] px-4 py-2 rounded-xl hover:bg-slate-500/10 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-subtitle)]"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>
      <div className="h-20" /> {/* Spacer for fixed header */}
      <CurrencyRibbon />

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-[var(--bg-color)] border-b border-[var(--border-color)] p-6 flex flex-col gap-6 z-40 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col gap-4 text-base font-medium text-[var(--text-subtitle)]">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-white font-extrabold">Home</Link>
              <Link href="/live" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--text-color)]">FinCody Live</Link>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--text-color)]">Features</a>
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--text-color)]">AI Demo</a>
              <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--text-color)]">Simulator</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--text-color)]">Pricing</a>
            </div>
            <hr className="border-[var(--border-color)]" />
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <Link 
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/25"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-3 rounded-xl border border-[var(--border-color)] text-sm font-semibold hover:bg-rose-500/5 hover:text-rose-400 text-rose-500 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/25"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-24 pb-20 px-6 max-w-none w-[97%] mx-auto text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-semibold text-blue-400 tracking-wide uppercase shadow-inner">
              <Sparkles className="w-3.5 h-3.5" /> Introducing Next-Gen Life AI
            </div>

            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-2xl bg-gradient-to-b from-[var(--text-color)] via-[var(--text-color)] to-slate-400 bg-clip-text text-transparent leading-[1.1] pt-2">
              Your Entire Life.<br /> Organized.
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-subtitle)] max-w-xl leading-relaxed">
              An AI Operating System for your finances, goals, decisions, and future. Track assets, run simulations, and navigate major life turns with absolute clarity.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full">
              <Link 
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {user ? "Go to Dashboard" : "Enter Dashboard"} <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/5 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                Launch Demo
              </a>
            </div>
          </motion.div>

          {/* Right Column: Premium Compact Breaking News Widget */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 w-full glass-card p-6 border border-blue-500/10 bg-slate-950/30 rounded-2xl flex flex-col gap-4 text-left relative overflow-hidden"
          >
            <div className="flex justify-between items-center border-b border-blue-500/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  Breaking Market Events
                </h3>
              </div>
              <Link 
                href="/live" 
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                Go Live <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Stocks Status Row */}
            <div className="grid grid-cols-2 gap-2 text-left">
              {liveStocks.map((stock) => (
                <div key={stock.name} className="p-2.5 rounded-xl border border-blue-500/5 bg-slate-900/10 flex flex-col gap-0.5 relative overflow-hidden">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{stock.name}</span>
                  <div className="flex justify-between items-baseline gap-1 mt-0.5">
                    <span className="text-xs font-mono font-bold text-white">
                      {stock.name === "BTC-USD" ? `$${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : stock.name === "SENSEX" || stock.name === "NIFTY 50" ? `${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${stock.price.toFixed(2)}`}
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${stock.up ? "text-emerald-500" : "text-rose-500"}`}>
                      {stock.up ? "▲" : "▼"} {stock.change >= 0 ? `+${stock.change.toFixed(2)}%` : `${stock.change.toFixed(2)}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Vertical Marquee for World News */}
            <div className="relative h-[220px] overflow-hidden border border-blue-500/5 bg-slate-950/20 rounded-xl">
              <style>{`
                @keyframes marquee-vertical {
                  0% { transform: translateY(0%); }
                  100% { transform: translateY(-50%); }
                }
                .animate-marquee-vertical {
                  animation: marquee-vertical 25s linear infinite;
                }
              `}</style>
              
              <div className="animate-marquee-vertical hover:[animation-play-state:paused] flex flex-col gap-3 py-3 cursor-pointer">
                {[...LIVE_NEWS_DATA, ...LIVE_NEWS_DATA].map((news, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => window.location.href = '/live'}
                    className="mx-3 p-3.5 rounded-xl border border-blue-500/5 bg-slate-900/10 hover:bg-slate-900/30 transition-all flex flex-col gap-2 relative overflow-hidden"
                  >
                    {news.breaking && (
                      <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-red-600 animate-pulse" />
                    )}
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                      <span>{news.source}</span>
                      <span className={news.impact === "Bearish" ? "text-rose-400" : "text-emerald-400"}>{news.impact}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-normal line-clamp-1">
                      {news.headline}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {news.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer inside widget */}
            <div className="flex justify-between items-center border-t border-blue-500/5 pt-3 mt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !isPlayingVoice;
                    setIsPlayingVoice(next);
                    if (next) {
                      try {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance("Tata Consultancy files listing Tata Group neuromorphic cloud. US CPI index drops core inflation expectations. Indian Sensex hits historic milestone crosses 90000.");
                        utterance.onend = () => setIsPlayingVoice(false);
                        window.speechSynthesis.speak(utterance);
                      } catch (e) {}
                    } else {
                      try { window.speechSynthesis.cancel(); } catch (e) {}
                    }
                  }}
                  className="p-2 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors cursor-pointer"
                  title="Play 60s summary audio recap"
                >
                  {isPlayingVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                {isPlayingVoice && (
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider animate-pulse">Speaking summary...</span>
                )}
              </div>
              <Link
                href="/live"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5"
              >
                Full Live Command
              </Link>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Interactive AI Demo Section */}
      <section id="demo" className="py-20 px-6 border-t border-[var(--border-color)] bg-slate-950/10 relative">
        <div className="max-w-none w-[97%] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Instant AI Life Command
            </h2>
            <p className="text-[var(--text-subtitle)] text-lg">
              Click a scenario prompt below or head to the dashboard to formulate custom financial queries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Prompts list */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {AI_DEMO_DATA.map((demo, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDemoQuestionClick(idx)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group ${
                    activeQuestion === idx 
                      ? "bg-blue-600/10 border-blue-500/30 text-[var(--accent-color)] shadow-lg shadow-blue-500/5" 
                      : "bg-slate-900/10 border-[var(--border-color)] text-[var(--text-subtitle)] hover:text-[var(--text-color)] hover:bg-slate-500/5"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold group-hover:text-slate-400 transition-colors">
                      Scenario {idx + 1}
                    </span>
                    <span className="font-semibold text-sm">{demo.question}</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                    activeQuestion === idx ? "text-blue-400 translate-x-1" : "text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5"
                  }`} />
                </button>
              ))}
            </div>

            {/* Simulated Terminal Window */}
            <div className="lg:col-span-8 glass-card border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl relative bg-slate-950/20">
              <div className="h-12 border-b border-[var(--border-color)] flex items-center justify-between px-5 bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">Fincody Life Decision Engine v1.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600/40" />
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col gap-6">
                {/* User Input */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold flex-shrink-0 text-slate-300">
                    U
                  </div>
                  <div className="flex-1 bg-slate-900/50 border border-[var(--border-color)] px-4 py-3 rounded-xl text-[var(--text-color)] font-mono text-sm leading-relaxed min-h-[46px] text-left">
                    {typedText}
                    {demoState === "typing" && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-blue-400 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* AI Response */}
                <AnimatePresence mode="wait">
                  {demoState === "typing" ? (
                    <motion.div 
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 text-[var(--text-subtitle)] font-mono text-sm mt-4 pl-12"
                    >
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      </div>
                      <span>Simulating future scenario variables...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex gap-4 items-start border-t border-[var(--border-color)] pt-6"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 flex flex-col gap-5 text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="text-sm font-bold text-[var(--text-subtitle)]">Fincody Co-Pilot</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${AI_DEMO_DATA[activeQuestion].response.statusColor}`}>
                            {AI_DEMO_DATA[activeQuestion].response.status}
                          </span>
                        </div>

                        <p className="text-[var(--text-color)] text-sm md:text-base leading-relaxed">
                          {AI_DEMO_DATA[activeQuestion].response.analysis}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {AI_DEMO_DATA[activeQuestion].response.metrics.map((metric, mIdx) => (
                            <div key={mIdx} className="p-4 rounded-xl bg-slate-900/40 border border-[var(--border-color)] flex flex-col">
                              <span className="text-xs text-slate-500 font-bold tracking-wider uppercase">{metric.label}</span>
                              <span className="text-xl font-bold mt-1 text-[var(--text-color)] font-mono">{metric.value}</span>
                              <span className="text-xs text-[var(--text-subtitle)] mt-1 font-semibold">{metric.detail}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs flex items-start gap-3">
                          <span className="p-1 rounded bg-blue-500/10 text-blue-500 dark:text-blue-400 font-bold inline-block mt-0.5">Advice</span>
                          <span className="leading-relaxed text-[var(--text-subtitle)]">{AI_DEMO_DATA[activeQuestion].response.verdict}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-none w-[97%] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Everything you need. Integrated.
          </h2>
          <p className="text-[var(--text-subtitle)] text-lg leading-relaxed">
            Consolidate your life admin details in one secure vault. Leverage an AI partner designed to forecast and navigate life changes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="group p-6 rounded-2xl glass-card border border-[var(--border-color)] bg-slate-900/5 hover:bg-slate-900/10 transition-all duration-300 flex flex-col gap-4 text-left glass-card-hover"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-[var(--text-color)] group-hover:text-blue-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--text-subtitle)] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Future Simulator Section */}
      <section id="simulator" className="py-20 px-6 border-t border-[var(--border-color)] bg-slate-950/10 relative">
        <div className="max-w-none w-[97%] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Quantify Your Tomorrow
            </h2>
            <p className="text-[var(--text-subtitle)] text-lg">
              Simulate high-impact life choices and instantly project your cumulative net worth over the next 30 years.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Control Panel */}
            <div className="lg:col-span-5 glass-card border border-[var(--border-color)] rounded-2xl p-6 md:p-8 flex flex-col gap-6 text-left justify-between bg-slate-950/10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4">
                  <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)]">Variables Panel</span>
                </div>

                {/* Variable 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-[var(--text-subtitle)] flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Salary Growth Rate</span>
                    <span className="text-blue-500 dark:text-blue-400 font-mono font-bold">{salaryIncrease}% <span className="text-xs text-slate-500 font-semibold">/year</span></span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="25"
                    step="1"
                    value={salaryIncrease}
                    onChange={(e) => setSalaryIncrease(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>3% (Slow)</span>
                    <span>25% (Hyper)</span>
                  </div>
                </div>

                {/* Variable 2 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-[var(--text-subtitle)] flex items-center gap-1.5"><PiggyBank className="w-4 h-4" /> Monthly Savings Rate</span>
                    <span className="text-blue-500 dark:text-blue-400 font-mono font-bold">{savingsRate}% <span className="text-xs text-slate-500 font-semibold">of income</span></span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    step="5"
                    value={savingsRate}
                    onChange={(e) => setSavingsRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>10% (Basic)</span>
                    <span>70% (FIRE)</span>
                  </div>
                </div>

                {/* Variable 3 */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--text-subtitle)] flex items-center gap-1.5 mb-1">
                    <GraduationCap className="w-4 h-4" /> Higher Education Costs
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "None", value: 0 },
                      { label: "₹20 Lakhs", value: 20 },
                      { label: "₹40 Lakhs", value: 40 }
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setMbaCost(item.value)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                          mbaCost === item.value 
                            ? "bg-blue-600/10 border-blue-500/40 text-blue-500 dark:text-blue-400" 
                            : "bg-[#11172a]/30 border-[var(--border-color)] text-[var(--text-subtitle)] hover:text-[var(--text-color)]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variable 4 */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--text-subtitle)] flex items-center gap-1.5 mb-1">
                    <HomeIcon className="w-4 h-4" /> Home Purchase Year
                  </label>
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
                        onClick={() => setHomePurchaseYear(item.value)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                          homePurchaseYear === item.value 
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

            {/* Projection Chart */}
            <div className="lg:col-span-7 glass-card border border-[var(--border-color)] rounded-2xl p-6 md:p-8 flex flex-col gap-6 text-left justify-between bg-slate-950/10">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <div>
                  <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-color)] block">30-Year Wealth Forecast</span>
                  <span className="text-xs text-slate-500 mt-0.5 block">Estimated values in ₹ Lakhs</span>
                </div>
                <div className="flex gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-[var(--text-subtitle)]"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Standard</span>
                  <span className="flex items-center gap-1 text-blue-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Custom Pivot</span>
                </div>
              </div>

              <div className="w-full h-72 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="simGradLanding" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="Fincody Projections" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#simGradLanding)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 gap-3 mt-4">
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Wealth Difference</span>
                  <span className="text-xl font-black text-emerald-500 mt-0.5 block">
                    +₹{(chartData[29]["Fincody Projections"] - chartData[29]["Standard"]).toLocaleString("en-IN")} Lakhs
                  </span>
                </div>
                <Link 
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-1.5"
                >
                  Save Scenario <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 max-w-none w-[97%] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Loved by builders and thinkers
          </h2>
          <p className="text-[var(--text-subtitle)] text-lg leading-relaxed">
            Here is what early adopters are saying about managing their life using Fincody.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Before Fincody, I had five spreadsheets and missed my subscription renewals constantly. Having a unified view that simulated my career jump was eye-opening.",
              author: "Nikhil Sharma",
              title: "Product Engineer, Razorpay",
              avatar: "NS"
            },
            {
              quote: "The Life Decision Assistant alone saved me ₹3 Lakhs when looking at MBA financing alternatives. It's like having a top CFO in your pocket at all times.",
              author: "Ananya Iyer",
              title: "Strategy Lead, McKinsey",
              avatar: "AI"
            },
            {
              quote: "Fincody is the Notion for my finances. Beautiful, dark, and blazingly fast. The automated subscription canceling feels like magic.",
              author: "Vikram Malhotra",
              title: "Co-Founder, Hypertech",
              avatar: "VM"
            }
          ].map((test, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-card border border-[var(--border-color)] bg-slate-900/5 flex flex-col justify-between text-left">
              <p className="text-[var(--text-color)] italic leading-relaxed text-sm md:text-base">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-3 mt-6 border-t border-[var(--border-color)] pt-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-blue-400">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-color)] text-sm">{test.author}</h4>
                  <p className="text-xs text-slate-500">{test.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 border-t border-[var(--border-color)] bg-slate-950/10 relative">
        <div className="max-w-none w-[97%] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Transparent, premium plans
            </h2>
            <p className="text-[var(--text-subtitle)] text-lg">
              Start free. Upgrade as your asset portfolio complexity grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-6 md:p-8 rounded-2xl glass-card border border-[var(--border-color)] bg-slate-900/5 flex flex-col justify-between text-left relative">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-color)]">Free</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Core life dashboard</p>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-[var(--text-color)]">
                    <RollingNumber value={0} />
                  </span>
                  <span className="text-sm text-slate-500 font-medium">/month</span>
                </div>
                <hr className="border-[var(--border-color)]" />
                <ul className="flex flex-col gap-3 text-sm text-[var(--text-subtitle)] mt-2 font-semibold">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic Account Consolidation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Goal Tracker (Up to 3 goals)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standard Subscription Audit</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Manual Data Sync</li>
                </ul>
              </div>
              <Link 
                href="/dashboard"
                className="w-full text-center py-3 rounded-xl border border-[var(--border-color)] text-sm font-semibold hover:bg-slate-500/5 transition-colors mt-8 block"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-6 md:p-8 rounded-2xl glass-card border border-blue-500/30 bg-blue-500/[0.03] flex flex-col justify-between text-left relative shadow-lg shadow-blue-500/5">
              <div className="absolute top-0 right-6 transform -translate-y-1/2 px-3 py-1 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-wider text-white">
                Most Popular
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-color)]">Pro</h3>
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5 font-bold">Unlimited automated optimizations</p>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-[var(--text-color)]">
                    <RollingNumber value={499} />
                  </span>
                  <span className="text-sm text-slate-500 font-medium">/month</span>
                </div>
                <hr className="border-[var(--border-color)]" />
                <ul className="flex flex-col gap-3 text-sm text-[var(--text-subtitle)] mt-2 font-semibold">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated Bank & Portfolio Syncs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Future Sandbox Projections</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Financial Command Center Insights</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> One-click Subscription Cancellations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated Insurance Vault Review</li>
                </ul>
              </div>
              <Link 
                href="/dashboard"
                className="w-full text-center py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all mt-8 block"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Elite Tier */}
            <div className="p-6 md:p-8 rounded-2xl glass-card border border-[var(--border-color)] bg-slate-900/5 flex flex-col justify-between text-left relative">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-color)]">Elite</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Advanced advisory services</p>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-[var(--text-color)]">
                    <RollingNumber value={1999} />
                  </span>
                  <span className="text-sm text-slate-500 font-medium">/month</span>
                </div>
                <hr className="border-[var(--border-color)]" />
                <ul className="flex flex-col gap-3 text-sm text-[var(--text-subtitle)] mt-2 font-semibold">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hybrid AI + Human Advisor Consensus</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom Legal & Tax Optimizations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Encrypted Vault Hardware Key Sync</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority Support Hotline</li>
                </ul>
              </div>
              <Link 
                href="/dashboard"
                className="w-full text-center py-3 rounded-xl border border-[var(--border-color)] text-sm font-semibold hover:bg-slate-500/5 transition-colors mt-8 block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-10 pb-6 px-6 border-t border-[var(--border-color)] bg-slate-950/20 text-slate-500 text-sm">
        <div className="max-w-none w-[97%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-4 text-left">
            <Link href="/" className="flex items-center gap-2">
              <FincodyLogo variant="desktop" />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed mt-2 max-w-xs">
              Fincody is an AI-powered Life Operating System that organizes assets, scenarios, insurance policies, and subscription tracking.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-left">
            <h4 className="font-bold text-[var(--text-color)] text-xs uppercase tracking-wider">Product</h4>
            <a href="#features" className="hover:text-[var(--text-color)] transition-colors">Features</a>
            <a href="#demo" className="hover:text-[var(--text-color)] transition-colors">AI Engine</a>
            <a href="#simulator" className="hover:text-[var(--text-color)] transition-colors">Simulator</a>
            <a href="#pricing" className="hover:text-[var(--text-color)] transition-colors">Pricing</a>
          </div>
          <div className="flex flex-col gap-3 text-left">
            <h4 className="font-bold text-[var(--text-color)] text-xs uppercase tracking-wider">Resources</h4>
            <a href="#" className="hover:text-[var(--text-color)] transition-colors">Documentation</a>
            <a href="#" className="hover:text-[var(--text-color)] transition-colors">API Reference</a>
            <Link href="/admin" className="hover:text-[var(--text-color)] transition-colors font-semibold text-blue-400">Admin Sign Up</Link>
            <a href="#" className="hover:text-[var(--text-color)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--text-color)] transition-colors">Terms of Service</a>
          </div>
          <div className="flex flex-col gap-3 text-left">
            <h4 className="font-bold text-[var(--text-color)] text-xs uppercase tracking-wider">Security</h4>
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="w-4.5 h-4.5 text-emerald-400" />
              <span className="text-xs font-semibold">256-bit AES Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 mt-1">
              <Shield className="w-4.5 h-4.5 text-emerald-400" />
              <span className="text-xs font-semibold">SOC2 Type II Certified</span>
            </div>
          </div>
        </div>
        <div className="max-w-none w-[97%] mx-auto flex justify-center items-center border-t border-[var(--border-color)] pt-6">
          <span>&copy; {new Date().getFullYear()} Fincody Inc. All rights reserved.</span>
        </div>
      </footer>

      {/* Profile Details & Edit Modal */}
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
              Your Profile
            </h3>
            <p className="text-[10px] text-slate-400 mb-4 truncate max-w-full">
              {user?.email ?? "no-email@fincody.com"}
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
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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

                {user && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-2 rounded-xl border border-[var(--border-color)] text-[10px] font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Log Out
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
