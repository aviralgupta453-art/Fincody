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
  AlertTriangle,
  Volume2,
  VolumeX,
  Bell,
  Send,
  Upload,
  ChevronDown,
  Search,
  Loader2,
  CreditCard,
  Coins,
  Building,
  FileText,
  DollarSign
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

  // Alert Center Notifications Interfaces & States
  interface FinancialNotification {
    id: string;
    category: string;
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

  // AI Chat Copilot States
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      sender: "ai",
      text: "Hello! I am Jarvis, your Fincody AI Financial Co-pilot. Ask me anything about investments, retirement planning, savings, or tax optimization!",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [welcomeTitleIndex, setWelcomeTitleIndex] = useState(0);
  const [hasAiMemory, setHasAiMemory] = useState(false);
  const [multistageThinking, setMultistageThinking] = useState("");
  const [dragHover, setDragHover] = useState(false);
  const [scanAnimation, setScanAnimation] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);

  const welcomeTitles = [
    "Your Personal AI Finance Coach",
    "Investment Analyst",
    "Budget Planner",
    "Wealth Advisor",
    "Tax Assistant",
    "Financial Decision Engine"
  ];

  useEffect(() => {
    const wInterval = setInterval(() => {
      setWelcomeTitleIndex(prev => (prev + 1) % welcomeTitles.length);
    }, 2500);
    return () => clearInterval(wInterval);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasAiMemory(!!localStorage.getItem("fincody_ai_memory_home"));
    }
  }, []);

  const handleSendChat = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    const query = text.trim();
    const queryLower = query.toLowerCase();
    
    let steps = ["Analyzing query intent...", "Scanning finance knowledge base...", "Generating co-pilot response..."];
    for (let i = 0; i < steps.length; i++) {
      setMultistageThinking(steps[i]);
      await new Promise(r => setTimeout(r, 500));
    }

    let replyText = "";
    if (queryLower.includes("what is stock") || queryLower.includes("what is a stock") || queryLower.includes("what are stocks") || queryLower.includes("equity") || queryLower.includes("shares") || queryLower.includes("share market")) {
      replyText = "A **stock** (also known as equity or share) represents fractional ownership in a corporation. When you buy a stock, you own a tiny piece of that company's assets and earnings. Stocks are bought/sold on exchanges (like NSE, BSE, NASDAQ) and grow via price appreciation or dividends. Over long horizons, equities historically outperform inflation and fixed income, yielding average annual returns of 12-15%.";
    } 
    else if (queryLower.includes("mutual fund") || queryLower.includes("what is mutual fund") || queryLower.includes("what are mutual funds") || queryLower.includes("index fund")) {
      replyText = "A **mutual fund** is an investment vehicle that pools money from multiple investors to purchase a diversified portfolio of stocks, bonds, or other securities. Managed by professional fund managers, they offer instant diversification, lower risk, and expert management. **Index Funds** are a passive subset that mimic a market index (like Nifty 50 or S&P 500), offering ultra-low expense ratios and matching market returns.";
    } 
    else if (queryLower.includes("fixed deposit") || queryLower.includes("what is fd") || queryLower.includes("fixed deposits") || queryLower.includes("what is fixed deposit")) {
      replyText = "A **Fixed Deposit (FD)** is a safe financial instrument offered by banks where you deposit money for a fixed tenure at a guaranteed interest rate. Unlike market-linked investments (stocks/mutual funds), FDs offer 100% capital protection and fixed returns. Currently, major banks offer 6.5% to 7.8% annual interest. They are ideal for emergency funds and capital preservation.";
    }
    else if (queryLower.includes("ppf") || queryLower.includes("public provident fund")) {
      replyText = "The **Public Provident Fund (PPF)** is a government-backed, long-term tax savings scheme in India. It features a 15-year lock-in period with a current interest rate of 7.1% (compounded annually). It offers the prestigious EEE (Exempt-Exempt-Exempt) tax status: contributions, interest earned, and maturity proceeds are all 100% tax-exempt under Section 80C.";
    }
    else if (queryLower.includes("nps") || queryLower.includes("national pension system")) {
      replyText = "The **National Pension System (NPS)** is a voluntary, long-term retirement savings scheme. It is market-linked, allowing allocations to Equity, Corporate Bonds, and Government Securities. NPS offers additional tax benefits up to ₹50,000 under Sec 80CCD(1B), on top of the standard ₹1.5 Lakh limit under Sec 80C. At age 60, up to 60% can be withdrawn tax-free, and 40% goes into an annuity.";
    }
    else if (queryLower.includes("gold") || queryLower.includes("sovereign gold bond") || queryLower.includes("sgb")) {
      replyText = "**Gold** is a traditional safe-haven asset that acts as a hedge against inflation and economic uncertainty. You can invest via Physical Gold, Gold ETFs, or **Sovereign Gold Bonds (SGBs)**. SGBs are government-backed securities denominated in grams of gold, offering a 2.5% annual interest payout on the initial investment amount and complete capital gains tax exemption at maturity.";
    }
    else if (queryLower.includes("dividend") || queryLower.includes("what is dividend")) {
      replyText = "A **dividend** is a distribution of a portion of a company's earnings to its shareholders, usually determined by the board of directors. It is paid out regularly (quarterly or annually) as cash or additional stock. High-dividend-yield stocks and mutual funds are popular strategies for generating passive income cash flows.";
    }
    else if (queryLower.includes("net worth") || queryLower.includes("what is net worth")) {
      replyText = "Your **Net Worth** is the total value of all your assets (what you own: cash, stocks, property, gold, FDs) minus all your liabilities (what you owe: home loans, credit cards, personal loans). It is the single most important metric to track financial health. Fincody dynamically aggregates all your assets and liabilities to calculate your live Net Worth automatically.";
    }
    else if (queryLower.includes("inflation") || queryLower.includes("what is inflation")) {
      replyText = "**Inflation** is the rate at which the general level of prices for goods and services rises, eroding purchasing power. If inflation is 6%, ₹100 today will only buy ₹94 worth of goods next year. To preserve wealth, you must invest in assets like equities or gold that generate returns exceeding the inflation rate.";
    }
    else if (queryLower.includes("sip") || queryLower.includes("what is sip") || queryLower.includes("systematic investment plan")) {
      replyText = "A **Systematic Investment Plan (SIP)** is a method of investing a fixed sum of money regularly (typically monthly) into a mutual fund. SIPs leverage **Rupee Cost Averaging**—buying more units when prices are low and fewer when prices are high—eliminating the need to time the market, and compounding wealth steadily over time.";
    }
    else if (queryLower.includes("tax") || queryLower.includes("80c")) {
      replyText = "You can save up to ₹46,800 in taxes under Section 80C and 80CCD(1B) by maximizing contributions to National Pension System (NPS) and Public Provident Fund (PPF). Currently, equity index fund lock-ins (ELSS) are also showing 14.2% annualized growth benchmarks.";
    } else if (queryLower.includes("portfolio") || queryLower.includes("invest")) {
      replyText = "Fincody Live Equities Monitor is currently tracking positive global indices. SENSEX and NIFTY 50 show strong momentum. I recommend allocating 60% of your investable income to low-cost Nifty 50 Index Funds, 20% to Gold ETFs as a hedge, and 20% to Fixed Deposits for stability.";
    } else if (queryLower.includes("retire")) {
      replyText = "To retire at age 45, you should build a retirement corpus equal to 30 times your annual expenses. If your monthly expenses are ₹50,000, you need a corpus of ₹1.8 Crores. Starting a monthly SIP of ₹25,000 growing at 12% CAGR achieves this target in roughly 15 years.";
    } else if (queryLower.includes("saving") || queryLower.includes("budget")) {
      replyText = "For optimum budgeting, follow the 50/30/20 rule: 50% for Needs (Rent, Utilities, Food), 30% for Wants (Dining, Travel), and 20% for Savings (SIP, Fixed Deposits). Fincody Pro provides automated spending tracking to categorize and alert you of savings leakages.";
    } else {
      replyText = `That is an excellent financial question about **"${query}"**. 

In professional wealth management, this concept is key to optimizing your portfolio. To manage this effectively, we recommend:
1. **Diversification**: Spread risk across uncorrelated assets (Equities, FDs, Gold).
2. **Tax Shielding**: Maximize deductions using government schemes (Sec 80C, PPF, NPS).
3. **Compound Growth**: Reinvest dividends and interest to leverage compounding over long horizons.

For fully personalized co-pilot advice, please enter your details in the **Dashboard** panel.`;
    }

    const aiMsg = {
      sender: "ai",
      text: replyText,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    };

    setChatMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
    setMultistageThinking("");

    if (voiceMode && typeof window !== "undefined") {
      try {
        window.speechSynthesis.cancel();
        const cleanMsg = replyText.replace(/[\*\#\_]/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanMsg);
        setVoiceSpeaking(true);
        utterance.onend = () => setVoiceSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error(e);
      }
    }
  };


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

  // Real-time stocks fetching helper from Yahoo Finance
  const fetchRealTimeStocks = async () => {
    const symbolsMap: Record<string, string> = {
      "SENSEX": "^BSESN",
      "NIFTY 50": "^NSEI",
      "NASDAQ": "^IXIC",
      "BTC-USD": "BTC-USD"
    };

    try {
      const updated = await Promise.all(
        liveStocks.map(async (s) => {
          const sym = symbolsMap[s.name];
          if (!sym) return s;
          const res = await fetch(`/api/stock?action=quote&symbol=${encodeURIComponent(sym)}`);
          if (!res.ok) return s;
          const data = await res.json();
          if (data && typeof data.price === "number") {
            return {
              name: s.name,
              price: data.price,
              change: data.changePercent ?? s.change,
              up: (data.changePercent ?? 0) >= 0
            };
          }
          return s;
        })
      );
      setLiveStocks(updated);
    } catch (e) {
      console.error("Failed to fetch real-time stocks:", e);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchRealTimeStocks();

    // Poll live Yahoo Finance stocks from API every 20s
    const apiInterval = setInterval(fetchRealTimeStocks, 20000);

    // Micro-fluctuation timer for stocks and snapshot metrics to keep UI ticking
    const tickInterval = setInterval(() => {
      setLiveStocks((prev) => 
        prev.map((s) => {
          const delta = (Math.random() - 0.5) * (s.price * 0.00008);
          const newPrice = s.price + delta;
          return {
            ...s,
            price: newPrice,
            up: delta >= 0
          };
        })
      );

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

    return () => {
      clearInterval(apiInterval);
      clearInterval(tickInterval);
    };
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
  const [userPlan, setUserPlan] = useState<"Free" | "Pro">("Free");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPlan = localStorage.getItem("fincody_user_plan");
      if (savedPlan === "Pro" || savedPlan === "Free") {
        setUserPlan(savedPlan);
      }
    }
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

      {/* Profile Details & Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[290px] glass-card rounded-2xl p-5 shadow-2xl relative text-center animate-in zoom-in-95 duration-200">
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

            {/* Plan Status card synchronized with dashboard */}
            <div className="mb-4 p-3 rounded-xl bg-slate-900/40 border border-[var(--border-color)] text-left flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px] block mb-0.5">Plan Status</span>
                <span className="font-extrabold text-[var(--text-color)]">{userPlan === "Pro" ? "Fincody Pro (Active)" : "Free Plan"}</span>
              </div>
              {userPlan === "Pro" ? (
                <button
                  type="button"
                  onClick={() => {
                    setUserPlan("Free");
                    localStorage.setItem("fincody_user_plan", "Free");
                    setFinancialNotifications(prev => [
                      {
                        id: "notif-system-" + Date.now(),
                        category: "System",
                        priority: "Low",
                        title: "Fincody Pro Deactivated",
                        description: "Subscription reset to Free plan.",
                        scheduledTime: "Just Now",
                        timeRemaining: "Just Now",
                        timeRemainingSecs: 0,
                        status: "unread",
                        section: "Today",
                        timeGroup: "Today",
                        logo: "System"
                      },
                      ...prev
                    ]);
                  }}
                  className="px-2 py-1 rounded bg-rose-600/10 border border-rose-500/20 text-[9px] font-black text-rose-400 hover:bg-rose-600 hover:text-white uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setUserPlan("Pro");
                    localStorage.setItem("fincody_user_plan", "Pro");
                    setFinancialNotifications(prev => [
                      {
                        id: "notif-system-" + Date.now(),
                        category: "System",
                        priority: "Medium",
                        title: "Upgraded to Pro!",
                        description: "Subscription upgraded successfully. Premium active.",
                        scheduledTime: "Just Now",
                        timeRemaining: "Just Now",
                        timeRemainingSecs: 0,
                        status: "unread",
                        section: "Today",
                        timeGroup: "Today",
                        logo: "System"
                      },
                      ...prev
                    ]);
                  }}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[9px] font-black text-white uppercase tracking-wider transition-all cursor-pointer"
                >
                  Upgrade
                </button>
              )}
            </div>

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





      {/* Floating AI Chat Assistant Drawer (positioned fixed to float dynamically as in the dashboard) */}
      <div className="fixed bottom-20 sm:bottom-6 right-6 sm:right-12 z-[9999999] pointer-events-auto">
        <button
          onClick={() => {
            console.log("Home chatbot button clicked! Current state:", aiChatOpen, "Setting to:", !aiChatOpen);
            setAiChatOpen(!aiChatOpen);
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
          style={{ pointerEvents: 'auto' }}
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
            className="fixed bottom-36 sm:bottom-24 right-6 sm:right-12 w-[320px] sm:w-[420px] h-[580px] max-h-[72vh] sm:max-h-[580px] rounded-2xl border border-blue-500/20 bg-slate-950/90 backdrop-blur-2xl shadow-[0_0_35px_rgba(59,130,246,0.25)] flex flex-col justify-between overflow-hidden text-left z-[9999999]"
          >
            {/* Animated Glowing AI Orb Header */}
            <div className="h-20 border-b border-blue-500/10 flex items-center justify-between px-5 bg-slate-950/70 shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
              
              <div className="flex items-center gap-3 relative z-10">
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
                {voiceMode && (
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded font-black mr-2 animate-pulse">
                    Voice Active
                  </span>
                )}
                <button 
                  onClick={() => setAiChatOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages and Welcome Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">
              {chatMessages.length === 1 && (
                <div className="py-6 text-center flex flex-col gap-4 border-b border-blue-500/5 bg-blue-600/[0.01] rounded-2xl p-4">
                  {hasAiMemory && (
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 text-left font-bold flex justify-between items-center mb-1">
                      <span>🧠 Jarvis Memory: You asked about tax last week.</span>
                      <button
                        onClick={() => handleSendChat("Show me how to save ₹23,000 in taxes")}
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
                    <div className="space-y-2 mt-2">
                      <div className="h-2 bg-slate-800 rounded-full w-full animate-pulse" />
                      <div className="h-2 bg-slate-800 rounded-full w-5/6 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Chips Drawer */}
            <div className="px-4 py-2 border-t border-blue-500/10 flex gap-2 overflow-x-auto shrink-0 bg-slate-950/40 scrollbar-none">
              {[
                { label: "📊 Analyze Portfolio", query: "Analyze portfolio yields" },
                { label: "💰 Reduce Expenses", query: "How do I reduce monthly expenses?" },
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
            <a href="#demo" className="hover:text-[var(--text-color)] transition-colors">AI Demo</a>
            <a href="#pricing" className="hover:text-[var(--text-color)] transition-colors">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            
            {/* Alert Center Icon */}
            <button
              onClick={() => setFinancialNotificationsOpen(true)}
              className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/10 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-all flex items-center justify-center relative cursor-pointer"
              aria-label="Alert Center"
              title="Alert Center"
            >
              <Bell className="w-4.5 h-4.5" />
              {financialNotifications.some(n => n.status === "unread") && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/10 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {userPlan === "Pro" && (
              <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border border-blue-400/30 text-[8px] font-black text-white uppercase tracking-widest shadow shadow-blue-500/20 animate-pulse shrink-0">
                PRO
              </span>
            )}

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

            {/* Auth Dependent Navigation Buttons */}
            {user ? (
              <button
                onClick={handleSignOut}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/35 hover:-translate-y-0.5 cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <Link 
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 cursor-pointer"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setFinancialNotificationsOpen(true)}
              className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-subtitle)] flex items-center justify-center relative cursor-pointer"
              aria-label="Alert Center"
            >
              <Bell className="w-4.5 h-4.5" />
              {financialNotifications.some(n => n.status === "unread") && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto">
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
              <a 
                href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "https://buy.stripe.com/mock-fincody-pro"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all mt-8 block"
              >
                Upgrade to Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-10 pb-6 px-6 border-t border-[var(--border-color)] bg-slate-950/20 text-slate-500 text-sm relative">
        <div className="max-w-none w-[97%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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

      {/* Alert Center notifications drawer */}
      <AnimatePresence>
        {financialNotificationsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFinancialNotificationsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[99998]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-slate-950/90 border-l border-blue-500/15 backdrop-blur-xl shadow-2xl p-6 overflow-y-auto z-[9999999] text-left flex flex-col justify-between"
            >
              <div className="flex flex-col gap-5">
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

                <div className="flex-1 overflow-y-auto max-h-[58vh] scrollbar-none flex flex-col gap-4">
                  {(() => {
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

                                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                                      <span>📅 {n.scheduledTime}</span>
                                      <span className={n.priority === "Critical" ? "text-red-400" : "text-blue-400"}>
                                        ⏳ {n.timeRemaining}
                                      </span>
                                    </div>

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
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
