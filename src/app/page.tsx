"use client";

import React, { useState, useEffect, useRef } from "react";
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
  VolumeX,
  Bell
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
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("fincody-theme") || "dark";
      setTheme(savedTheme as any);
    }
  }, []);

  // Fincody Live Feed States
  const [selectedCountry, setSelectedCountry] = useState("Global");
  const [selectedCategory, setSelectedCategory] = useState("Markets");
  const [activeArticle, setActiveArticle] = useState<any>(null);
  const [countdownString, setCountdownString] = useState("02:14:45");
  const [homeNews, setHomeNews] = useState(LIVE_NEWS_DATA);

  useEffect(() => {
    const fetchHomeNews = async () => {
      try {
        const res = await fetch("/api/news?category=markets");
        if (res.ok) {
          const data = await res.json();
          setHomeNews(data);
        }
      } catch (err) {
        console.error("Error fetching home news:", err);
      }
    };
    fetchHomeNews();
  }, []);
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

      // Fluctuate live snapshot metrics in sync with market updates to feel alive!
      setSnapshotNetWorth((prev) => {
        const pct = (Math.random() - 0.47) * 0.0002;
        return Math.round(prev * (1 + pct));
      });
      setSnapshotPortfolio((prev) => {
        const pct = (Math.random() - 0.47) * 0.0003;
        return Math.round(prev * (1 + pct));
      });
      setSnapshotTodayGain((prev) => {
        const pct = (Math.random() - 0.47) * 0.003;
        return parseFloat((prev * (1 + pct)).toFixed(2));
      });
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

  const filteredNews = homeNews.filter((item) => {
    const countryMatch = selectedCountry === "Global" || item.country === selectedCountry;
    const categoryMatch = selectedCategory === "Markets" || item.category === selectedCategory;
    return countryMatch && categoryMatch;
  });



  // Supabase Client state
  const [user, setUser] = useState<any>(null);
  
  // Custom Redesigned Hero state parameters
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snapshotNetWorth, setSnapshotNetWorth] = useState(3845210);
  const [snapshotTodayGain, setSnapshotTodayGain] = useState(8245.50);
  const [snapshotHealthScore, setSnapshotHealthScore] = useState(84);
  const [snapshotSavings, setSnapshotSavings] = useState(75000);
  const [snapshotPortfolio, setSnapshotPortfolio] = useState(1245000);

  // Sync snapshot metrics from local storage
  useEffect(() => {
    const loadSnapshotData = () => {
      try {
        const userId = user?.id;
        const prefix = userId ? `fincody_user_${userId}_` : "";
        
        const nw = localStorage.getItem(`${prefix}netWorth`);
        if (nw) setSnapshotNetWorth(parseFloat(nw));
        
        const hs = localStorage.getItem(`${prefix}healthScore`);
        if (hs) setSnapshotHealthScore(parseInt(hs));
        
        const ms = localStorage.getItem(`${prefix}monthlySavings`);
        if (ms) setSnapshotSavings(parseFloat(ms));

        const portStr = localStorage.getItem(`${prefix}portfolio`);
        if (portStr) {
          const port = JSON.parse(portStr);
          if (Array.isArray(port) && port.length > 0) {
            const totalCost = port.reduce((acc, item) => acc + (item.qty * (item.avgBuyPrice || 100)), 0);
            setSnapshotPortfolio(totalCost > 0 ? totalCost : 1245000);
          }
        }
      } catch (e) {
        console.error("Error loading snapshot data:", e);
      }
    };
    if (user !== undefined && user !== null) {
      loadSnapshotData();
    }
  }, [user]);

  // Canvas Neural Network Particle simulation hook
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    interface HeroParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const particles: HeroParticle[] = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 0.5
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles and connection paths
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148, 163, 184, 0.2)";
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 125) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.18 * (1 - dist / 125)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);
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
    if (typeof window !== "undefined") {
      localStorage.setItem("fincody-theme", theme);
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
          <Link href="/" className="flex items-center gap-2 group">
            <FincodyLogo variant="desktop" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-subtitle)]">
            <Link href="/" className="text-white font-extrabold transition-colors">Home</Link>
            <Link href="/live" className="hover:text-[var(--text-color)] transition-colors">FinCody Live</Link>
            <Link href="/#snapshot" className="hover:text-[var(--text-color)] transition-colors">Live Snapshot</Link>
            <a href="#demo" className="hover:text-[var(--text-color)] transition-colors">AI Demo</a>
            <a href="#pricing" className="hover:text-[var(--text-color)] transition-colors">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            
            {/* Alert Center Icon */}
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/10 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-all flex items-center justify-center relative"
              aria-label="Alert Center"
              title="Alert Center"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/10 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Circular Profile Avatar (Always Visible in Header) */}
            <button
              onClick={() => {
                if (user) {
                  setEditName(user.user_metadata?.full_name ?? "");
                } else {
                  setEditName("");
                }
                setShowProfileModal(true);
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

            {/* Enter Dashboard Button */}
            <Link 
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 cursor-pointer"
            >
              Enter Dashboard
            </Link>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-subtitle)] flex items-center justify-center relative"
              aria-label="Alert Center"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </Link>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-subtitle)]"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Circular Profile Avatar on mobile header next to menu */}
            <button
              onClick={() => {
                if (user) {
                  setEditName(user.user_metadata?.full_name ?? "");
                } else {
                  setEditName("");
                }
                setShowProfileModal(true);
              }}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center transition-all shadow-md shadow-blue-500/20 hover:scale-105 cursor-pointer border border-blue-400/20"
              title={user ? "View & Edit Profile" : "Sign In"}
            >
              {user ? (
                user.user_metadata?.full_name 
                  ? user.user_metadata.full_name.slice(0, 1).toUpperCase() 
                  : (user.email ? user.email.slice(0, 1).toUpperCase() : "U")
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
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
      <div className="h-16" /> {/* Spacer for fixed header */}
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
              <Link href="/#snapshot" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--text-color)]">Live Snapshot</Link>
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--text-color)]">AI Demo</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--text-color)]">Pricing</a>
            </div>
            <hr className="border-[var(--border-color)]" />
            <div className="flex flex-col gap-3">
              {user ? (
                <>
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

      {/* Custom Redesigned styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes breath {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.25)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.45)); }
        }
        @keyframes rotate-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotate-counter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .ai-core-container {
          position: relative;
          width: 320px;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ai-core-sphere {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.8) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(15, 23, 42, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: inset 0 4px 10px rgba(255, 255, 255, 0.3), inset 0 -4px 10px rgba(0, 0, 0, 0.8);
          animation: breath 6s ease-in-out infinite;
          position: relative;
          z-index: 10;
        }
        .ai-core-sphere::before {
          content: "";
          position: absolute;
          inset: 4px;
          border-radius: 50%;
          background: radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
          filter: blur(2px);
          pointer-events: none;
        }
        .ai-ring-outer {
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          border: 1px dashed rgba(59, 130, 246, 0.3);
          animation: rotate-clockwise 25s linear infinite;
        }
        .ai-ring-inner {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 1px dotted rgba(168, 85, 247, 0.4);
          animation: rotate-counter 15s linear infinite;
        }
        .orbit-container {
          position: absolute;
          width: 280px;
          height: 280px;
          animation: orbit 45s linear infinite;
        }
        .orbit-container:hover {
          animation-play-state: paused;
        }
        .orbit-item {
          position: absolute;
          width: 48px;
          height: 48px;
          left: 50%;
          top: 50%;
          margin-left: -24px;
          margin-top: -24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: orbit-reverse 45s linear infinite;
        }
        .orbit-container:hover .orbit-item {
          animation-play-state: paused;
        }
        .orbit-item:hover {
          transform: scale(1.22);
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(59, 130, 246, 0.45);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
        .orbit-item:nth-child(1) { transform: rotate(0deg) translate(130px) rotate(0deg); }
        .orbit-item:nth-child(2) { transform: rotate(40deg) translate(130px) rotate(-40deg); }
        .orbit-item:nth-child(3) { transform: rotate(80deg) translate(130px) rotate(-80deg); }
        .orbit-item:nth-child(4) { transform: rotate(120deg) translate(130px) rotate(-120deg); }
        .orbit-item:nth-child(5) { transform: rotate(160deg) translate(130px) rotate(-160deg); }
        .orbit-item:nth-child(6) { transform: rotate(200deg) translate(130px) rotate(-200deg); }
        .orbit-item:nth-child(7) { transform: rotate(240deg) translate(130px) rotate(-240deg); }
        .orbit-item:nth-child(8) { transform: rotate(280deg) translate(130px) rotate(-280deg); }
        .orbit-item:nth-child(9) { transform: rotate(320deg) translate(130px) rotate(-320deg); }
      `}} />

      {/* Redesigned Premium Hero Section */}
      <section className="relative pt-6 pb-12 mt-2 px-6 max-w-none w-[97%] mx-auto text-left min-h-[550px] flex items-start justify-center overflow-hidden rounded-3xl border border-blue-500/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950">
        {/* Canvas Neural Background */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30"
        />
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ================= LEFT COLUMN (40% copy + live snapshot) ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start gap-6"
          >
            {/* Premium Animated Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-blue-500/20 bg-blue-600/5 text-blue-400 text-xs font-bold tracking-wide uppercase shadow-lg shadow-blue-500/5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>✨ AI Powered Financial Operating System</span>
            </div>

            {/* Powerful Headline */}
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1] pt-2">
              Your Complete Financial Life.<br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                One Intelligent Dashboard.
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base text-[var(--text-subtitle)] max-w-md leading-relaxed font-semibold">
              An AI Operating System for your finances, goals, decisions, and future. Track assets, run simulations, and navigate major life turns with absolute clarity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full">
              <Link 
                href="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-xs text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 border border-blue-400/20 cursor-pointer"
              >
                {user ? "Go to Dashboard" : "Enter Dashboard"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Live Snapshot section below Launch Demo */}
            <div id="snapshot" className="w-full flex flex-col gap-4 mt-6 border-t border-slate-900/60 pt-6 scroll-mt-24">
              <div className="border-l-2 border-blue-500/20 pl-4 mb-3 text-left">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block">Live Snapshot</span>
                <span className="text-xs text-slate-400 font-bold block mt-0.5">Real-time status updates</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* Net Worth Card (Large & Creative) */}
                <div className="group relative p-5 rounded-2xl border border-slate-900/80 bg-slate-950/40 backdrop-blur-md flex flex-col gap-2 hover:border-blue-500/20 hover:bg-slate-900/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block text-left">Net Worth</span>
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <span className="text-3xl font-black text-white font-mono leading-none tracking-tight block text-left group-hover:text-emerald-400 transition-colors">
                    <RollingNumber value={snapshotNetWorth} />
                  </span>
                  <div className="w-full h-10 mt-2 opacity-80">
                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0 25 Q15 20, 30 12 T60 18 T90 2 T100 5" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                      <path d="M0 25 Q15 20, 30 12 T60 18 T90 2 T100 5 L100 30 L0 30 Z" fill="url(#snapshotNetWorthGrad)" opacity="0.1" />
                      <defs>
                        <linearGradient id="snapshotNetWorthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Portfolio Card (Large & Creative) */}
                <div className="group relative p-5 rounded-2xl border border-slate-900/80 bg-slate-950/40 backdrop-blur-md flex flex-col gap-2 hover:border-blue-500/20 hover:bg-slate-900/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block text-left">Portfolio Valuation</span>
                    <span className="text-[9px] text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">▲ +1.17%</span>
                  </div>
                  <span className="text-3xl font-black text-white font-mono leading-none tracking-tight block text-left group-hover:text-blue-400 transition-colors">
                    <RollingNumber value={snapshotPortfolio} />
                  </span>
                  <div className="w-full h-10 mt-2 opacity-80">
                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0 22 Q20 10, 40 25 T80 5 T100 2" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                      <path d="M0 22 Q20 10, 40 25 T80 5 T100 2 L100 30 L0 30 Z" fill="url(#snapshotPortfolioGrad)" opacity="0.1" />
                      <defs>
                        <linearGradient id="snapshotPortfolioGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Health Score Card (Large & Creative) */}
                <div className="group relative p-5 rounded-2xl border border-slate-900/80 bg-slate-950/40 backdrop-blur-md flex flex-col justify-between gap-3 hover:border-blue-500/20 hover:bg-slate-900/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block text-left">Financial Health Score</span>
                    <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">Excellent</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-3xl font-black text-white font-mono leading-none tracking-tight block text-left">
                      {snapshotHealthScore}%
                    </span>
                    <div className="w-10 h-10 relative flex items-center justify-center">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle cx="20" cy="20" r="15" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" fill="transparent" />
                        <circle cx="20" cy="20" r="15" stroke="#3b82f6" strokeWidth="2.5" fill="transparent" strokeDasharray={2 * Math.PI * 15} strokeDashoffset={2 * Math.PI * 15 * (1 - snapshotHealthScore / 100)} className="transition-all duration-1000" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Monthly Savings Card (Large & Creative) */}
                <div className="group relative p-5 rounded-2xl border border-slate-900/80 bg-slate-950/40 backdrop-blur-md flex flex-col justify-between gap-3 hover:border-blue-500/20 hover:bg-slate-900/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block text-left">Monthly Savings Goal</span>
                    <span className="text-[9px] text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">87% Achieved</span>
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    <span className="text-3xl font-black text-white font-mono leading-none tracking-tight block text-left">
                      <RollingNumber value={snapshotSavings} />
                    </span>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden mt-1">
                      <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: "87%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
                    </motion.div>

          {/* ================= RIGHT COLUMN (25% news & tickers) ================= */}
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
                      {stock.name === "BTC-USD" ? "$" + stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : stock.name === "SENSEX" || stock.name === "NIFTY 50" ? stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "$" + stock.price.toFixed(2)}
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${stock.up ? "text-emerald-500" : "text-rose-500"}`}>
                      {stock.up ? "▲" : "▼"} {stock.change >= 0 ? "+" + stock.change.toFixed(2) + "%" : stock.change.toFixed(2) + "%"}
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
                {[...homeNews, ...homeNews].map((news, idx) => (
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
                        const textToSpeak = homeNews.slice(0, 3).map(n => n.headline).join(". ");
                        const utterance = new SpeechSynthesisUtterance(textToSpeak || "Indian Sensex hits historic milestone. US inflation drops. apple beats earnings.");
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

      {/* Testimonials 
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
                : (user?.email ? user.email.slice(0, 1).toUpperCase() : (tempName ? tempName.slice(0, 1).toUpperCase() : "U"))}
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
