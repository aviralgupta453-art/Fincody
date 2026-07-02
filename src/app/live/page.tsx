"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Sparkles, TrendingUp, Shield, Calendar, Compass, 
  CheckCircle2, Lock, ChevronRight, Sun, Moon, Menu, X, User,
  Clock, BookOpen, Zap, AlertTriangle, Volume2, VolumeX, Play, Pause
} from "lucide-react";
import FincodyLogo from "@/components/FincodyLogo";
import { supabase } from "@/lib/supabase";
import CurrencyRibbon from "@/components/CurrencyRibbon";

const LIVE_NEWS_DATABASE = [
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
      { symbol: "RELIANCE.NS", name: "Reliance Industries", change: 2.34 }
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
      { symbol: "AAPL", name: "Apple Inc.", change: 4.82 }
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
      { symbol: "SPX", name: "S&P 500", change: 0.85 }
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
      { symbol: "^FCHI", name: "CAC 40", change: 0.64 }
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
      { symbol: "^N225", name: "NIKKEI 225", change: -2.14 }
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
      { symbol: "TSM", name: "TSMC Ltd", change: 3.12 }
    ],
    whyItMatters: "Confirms AI infrastructure spending continues at institutional scale with no immediate signs of capital deceleration.",
    whoIsAffected: "Semiconductor supply chains, AI design houses, and cloud computing providers.",
    shortTerm: "Attracts buy-volume back into AI equipment and lithography suppliers.",
    longTerm: "Enables mass scale cloud deployments of autonomous systems and agents.",
    opportunities: "Equipment builders (ASML) and silicon packaging suppliers.",
    risks: "High geographical concentration of silicon fabrication facilities."
  },
  {
    id: "news-7",
    country: "USA",
    category: "Crypto",
    headline: "SEC approves Options Trading on Spot Bitcoin ETFs in regulatory breakthrough",
    summary: "The SEC cleared options clearing corporations to list options for major Bitcoin trusts, boosting liquidity and derivatives hedging availability.",
    source: "CoinDesk",
    timestamp: "3 hours ago",
    breaking: false,
    impact: "Bullish",
    severity: "Medium Impact",
    confidence: 90,
    affected: [
      { symbol: "BTC-USD", name: "Bitcoin", change: 5.42 }
    ],
    whyItMatters: "Unlocks institutional hedging channels for digital assets, increasing long-term passive capital allocation support.",
    whoIsAffected: "Hedge funds, retail digital asset traders, and crypto ETF issuers.",
    shortTerm: "Positive price momentum, causing short squeeze volatility.",
    longTerm: "Further integrates Bitcoin into traditional equities market structures.",
    opportunities: "Accumulate spot bitcoin allocations on pullback.",
    risks: "High derivatives-driven margin leverage swings."
  },
  {
    id: "news-8",
    country: "India",
    category: "IPO",
    headline: "Tata Group tech subsidiary files for landmark ₹15,000 Crore public listing",
    summary: "The conglomerate's IT division seeks listing to finance expansion into advanced neuromorphic cloud infrastructure and global AI server builds.",
    source: "Economic Times",
    timestamp: "4 hours ago",
    breaking: false,
    impact: "Bullish",
    severity: "High Impact",
    confidence: 93,
    affected: [
      { symbol: "TCS.NS", name: "Tata Consultancy Services", change: 1.42 }
    ],
    whyItMatters: "Largest public offering in the Indian tech ecosystem in 5 years, highlighting strong domestic venture liquidity support.",
    whoIsAffected: "Domestic venture investors, grey market traders, and tech funds.",
    shortTerm: "Increased market capital flows towards tech primary issuance desks.",
    longTerm: "Strengthens Tata's competitive capability against global cloud hyperscalers.",
    opportunities: "IPO bid subscription allocation.",
    risks: "High pricing valuations might cause minor post-listing cooling."
  },
  {
    id: "news-9",
    country: "USA",
    category: "Stocks",
    headline: "Microsoft launches specialized Quantum Hybrid cloud servers for corporate AI networks",
    summary: "The corporation introduced quantum-safe computing fabrics in select US Eastern cloud sectors to handle next-generation corporate cryptography standards.",
    source: "Reuters Technology",
    timestamp: "5 hours ago",
    breaking: false,
    impact: "Bullish",
    severity: "Medium Impact",
    confidence: 91,
    affected: [{ symbol: "MSFT", name: "Microsoft Corp", change: 1.85 }],
    whyItMatters: "Secures Microsoft's cybersecurity capability ahead of commercial quantum encryption breaches.",
    whoIsAffected: "Enterprise cloud corporations, cybersecurity agencies.",
    shortTerm: "Share prices climb to standard averages.",
    longTerm: "Establishes Quantum Hybrid as a requirement for military and bank cloud networks.",
    opportunities: "Accumulate MSFT positions.",
    risks: "Initial hardware maintenance costs."
  },
  {
    id: "news-10",
    country: "Global",
    category: "Economy",
    headline: "IMF upgrades Global GDP expansion forecasts to 3.2% citing resilient consumer spending",
    summary: "The international monetary fund increased global economic forecasts as deflation cools and consumer demand remains robust across major markets.",
    source: "Bloomberg International",
    timestamp: "6 hours ago",
    breaking: false,
    impact: "Bullish",
    severity: "High Impact",
    confidence: 89,
    affected: [{ symbol: "SPX", name: "S&P 500", change: 0.95 }],
    whyItMatters: "Lowers corporate default risk models and supports global index valuations.",
    whoIsAffected: "Emerging market equities, global conglomerates.",
    shortTerm: "Positive indices rally across EU and Asian blocks.",
    longTerm: "Improves global trade supply chain financing conditions.",
    opportunities: "Increase international asset equity weights.",
    risks: "Potential regional trade policy friction."
  },
  {
    id: "news-11",
    country: "India",
    category: "Banking",
    headline: "RBI leaves baseline repo rates unchanged at 6.5% during quarterly policy session",
    summary: "The Reserve Bank of India keeps rates unchanged, focusing on long-term inflation cooling and agricultural yield stability metrics.",
    source: "Economic Times",
    timestamp: "7 hours ago",
    breaking: false,
    impact: "Neutral",
    severity: "Medium Impact",
    confidence: 94,
    affected: [{ symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd", change: 0.12 }],
    whyItMatters: "Signals RBI remains highly committed to inflation targets before starting rate cuts.",
    whoIsAffected: "Home loan borrowers, domestic bond managers.",
    shortTerm: "Equities hold horizontal averages; banking indexes remain steady.",
    longTerm: "Prepares baseline safety metrics against international liquidity hikes.",
    opportunities: "Lock yields in long-term fixed deposit portfolios.",
    risks: "Slight weight pressure on retail leverage loans."
  },
  {
    id: "news-12",
    country: "USA",
    category: "Stocks",
    headline: "Tesla announces regulatory permission for Full Self-Driving rollout in China",
    summary: "The electric vehicle manufacturer secured testing approvals for FSD algorithms in Shanghai technology zones, opening massive new target markets.",
    source: "CNBC",
    timestamp: "8 hours ago",
    breaking: false,
    impact: "Bullish",
    severity: "High Impact",
    confidence: 92,
    affected: [{ symbol: "TSLA", name: "Tesla Inc.", change: 6.24 }],
    whyItMatters: "Unlocks recurring software licensing pipelines in the world's largest electric vehicle segment.",
    whoIsAffected: "EV competitors, local technology suppliers.",
    shortTerm: "TSLA stock spikes 6% on strong retail and hedge volume.",
    longTerm: "Establishes Tesla's software pricing strategy in regional segments.",
    opportunities: "Defensive growth baseline addition.",
    risks: "Localized data residency compliance regulations."
  }
];

export default function LivePage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("fincody-theme") || "dark";
      setTheme(savedTheme as any);
    }
  }, []);

  const [user, setUser] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName) return;
    setIsSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: editName }
      });
      if (error) throw error;
      setProfileSuccess("Profile updated successfully!");
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Live Feed states
  const [selectedCountry, setSelectedCountry] = useState("Global");
  const [selectedCategory, setSelectedCategory] = useState("Markets");
  const [activeArticle, setActiveArticle] = useState<any>(null);
  const [expandedMattersId, setExpandedMattersId] = useState<string | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [countdownString, setCountdownString] = useState("02:14:45");
  const [newsFeed, setNewsFeed] = useState(LIVE_NEWS_DATABASE);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    const fetchLiveNews = async () => {
      setLoadingNews(true);
      try {
        const res = await fetch(`/api/news?category=${encodeURIComponent(selectedCategory)}&country=${encodeURIComponent(selectedCountry)}`);
        if (res.ok) {
          const data = await res.json();
          setNewsFeed(data);
        }
      } catch (err) {
        console.error("Error fetching live news:", err);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchLiveNews();
  }, [selectedCategory, selectedCountry]);

  // Sync theme with HTML class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  // Economic Calendar Countdown Simulation
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

  // Real-time news simulator (inserts a new breaking news event every 45 seconds)
  useEffect(() => {
    const simulatedTopics = [
      {
        id: "sim-1",
        country: "USA",
        category: "Markets",
        headline: "NVIDIA overtakes Microsoft as most valuable global public company",
        summary: "Graphics chip provider stock hits record highs, driven by continuous capital expenditure forecasts from large language model cloud operators.",
        source: "Bloomberg US",
        timestamp: "Just now",
        breaking: true,
        impact: "Bullish",
        severity: "High Impact",
        confidence: 97,
        affected: [{ symbol: "NVDA", name: "Nvidia Corp", change: 3.82 }],
        whyItMatters: "Indicates complete restructuring of index caps around silicon hardware suppliers rather than software giants.",
        whoIsAffected: "Tech sector index funds and hardware manufacturers.",
        shortTerm: "Nvidia options call volume reaches extreme highs.",
        longTerm: "Solidifies compute power as the primary asset commodity of the decade.",
        opportunities: "Rebalance some profits but hold baseline growth positions.",
        risks: "Supply silicon availability bottlenecks."
      },
      {
        id: "sim-2",
        country: "Europe",
        category: "Policy",
        headline: "EU introduces comprehensive green energy sovereign credit guarantee framework",
        summary: "European Union pledges €80 Billion in credit backstops for green industrial plants, shielding builders from credit rate volatility.",
        source: "Le Monde",
        timestamp: "Just now",
        breaking: false,
        impact: "Bullish",
        severity: "Medium Impact",
        confidence: 89,
        affected: [{ symbol: "^GDAXI", name: "DAX Index", change: 0.85 }],
        whyItMatters: "Provides baseline safety cushions for capital infrastructure projects during high credit cost cycles.",
        whoIsAffected: "Wind, solar, and utility contractors across the EU bloc.",
        shortTerm: "Green energy stocks rally 3-4% globally.",
        longTerm: "Accelerates carbon-neutral energy production independence.",
        opportunities: "Long EU clean utility suppliers.",
        risks: "Fiscal deficit spending burdens."
      }
    ];

    let topicIndex = 0;
    const simulatorInterval = setInterval(() => {
      if (topicIndex < simulatedTopics.length) {
        const nextTopic = {
          ...simulatedTopics[topicIndex],
          timestamp: "Just now"
        };
        // Set previous "Just now" articles to "1 min ago"
        setNewsFeed((prev) => {
          const updatedPrev = prev.map((news) => {
            if (news.timestamp === "Just now") {
              return { ...news, timestamp: "1 min ago" };
            }
            return news;
          });
          // Prevent duplicates
          if (updatedPrev.some((news) => news.id === nextTopic.id)) return updatedPrev;
          return [nextTopic, ...updatedPrev];
        });
        topicIndex++;
      }
    }, 45000);

    return () => clearInterval(simulatorInterval);
  }, []);

  const filteredNews = newsFeed.filter((item) => {
    const countryMatch = selectedCountry === "Global" || item.country === selectedCountry;
    const categoryMatch = selectedCategory === "Markets" || item.category === selectedCategory || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return countryMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] overflow-x-hidden relative selection:bg-blue-500/30 selection:text-white transition-colors duration-300">
      
      {/* Background decoration blur bubbles */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* Main Header navigation (matching homepage navbar exactly) */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-[var(--border-color)] backdrop-blur-md">
        <div className="max-w-none w-[97%] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <FincodyLogo variant="desktop" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-subtitle)]">
            <Link href="/" className="hover:text-[var(--text-color)] transition-colors">Home</Link>
            <Link href="/live" className="text-blue-400 font-extrabold transition-colors">FinCody Live</Link>
            <Link href="/#features" className="hover:text-[var(--text-color)] transition-colors">Features</Link>
            <Link href="/#demo" className="hover:text-[var(--text-color)] transition-colors">AI Demo</Link>
            <Link href="/#simulator" className="hover:text-[var(--text-color)] transition-colors">Simulator</Link>
            <Link href="/#pricing" className="hover:text-[var(--text-color)] transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/10 text-[var(--text-subtitle)] hover:text-[var(--text-color)] transition-all"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-all shadow-md shadow-blue-500/20"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="h-20" /> {/* Spacer */}
      <CurrencyRibbon />

      {/* dedicated full screen live block */}
      <main className="py-6 px-6 max-w-none w-[97%] mx-auto text-left">
        
        <div className="w-full rounded-2xl overflow-hidden glass-card shadow-2xl relative border border-blue-500/10 p-1.5 bg-slate-950/40 text-left">
          
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-loop {
              display: flex;
              width: max-content;
              animation: marquee 45s linear infinite;
            }
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-none {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            @keyframes pulse-red {
              0%, 100% { box-shadow: 0 0 12px rgba(239, 68, 68, 0.4); }
              50% { box-shadow: 0 0 24px rgba(239, 68, 68, 0.8); }
            }
            .critical-glow {
              animation: pulse-red 2s infinite;
            }
          `}</style>

          {/* Live commentary marquee */}
          <div className="h-12 border border-blue-500/20 bg-slate-950/80 overflow-hidden flex items-center relative rounded-t-2xl z-20 backdrop-blur-md">
            <div className="absolute left-0 top-0 bottom-0 px-4 bg-blue-600 text-white text-xs font-black tracking-widest flex items-center gap-1.5 z-30 uppercase shadow-lg shadow-blue-500/20 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" /> LIVE COMMENTARY
            </div>
            <div className="pl-36 w-full overflow-hidden">
              <div className="animate-marquee-loop flex gap-12 py-1 text-sm font-bold text-slate-300 select-none">
                {[...Array(2)].map((_, loopIdx) => (
                  <div key={loopIdx} className="flex gap-12 items-center">
                    <span>"Indian markets remain optimistic after today's RBI announcement. Technology continues outperforming Banking."</span>
                    <span className="text-blue-500">•</span>
                    <span>"Global sentiment remains cautiously positive as US CPI drops to 2.4%."</span>
                    <span className="text-blue-500">•</span>
                    <span>"Nvidia reaches historic highs overtaking microsoft valuation caps."</span>
                    <span className="text-blue-500">•</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 border-x border-b border-blue-500/10 bg-slate-950/40 rounded-b-2xl shadow-[0_0_50px_rgba(59,130,246,0.05)]">
            
            {/* Header intro row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 border-b border-blue-500/10 pb-4">
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-extrabold text-blue-400 uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Flagship Intelligence Operating Center
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
                  FINCODY LIVE COMMAND
                </h1>
                <p className="text-base text-slate-400 font-medium mt-2">
                   Bloomberg Terminal integrated with Apple VisionOS. Immersive real-time tracking dashboard.
                </p>
              </div>

              {/* Speech recap panel */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const next = !isPlayingVoice;
                    setIsPlayingVoice(next);
                    if (next) {
                      try {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(
                          "Welcome to today's financial intelligence brief. The Indian Sensex has crossed a historic milestone of 90,000 mark. Meanwhile, Apple has beaten quarterly earnings expectations, and US inflation cooling points to a potential Federal Reserve rate cut. Your portfolios remain highly resilient."
                        );
                        utterance.onend = () => setIsPlayingVoice(false);
                        window.speechSynthesis.speak(utterance);
                      } catch (e) {}
                    } else {
                      try { window.speechSynthesis.cancel(); } catch (e) {}
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer animate-pulse"
                >
                  {isPlayingVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isPlayingVoice ? "Stop Summary" : "Listen to 60s Recap"}
                </button>

                {isPlayingVoice && (
                  <div className="flex items-end gap-0.5 h-6">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 16, 4] }}
                        transition={{ repeat: Infinity, duration: 0.5 + i * 0.08, ease: "easeInOut" }}
                        className="w-1 bg-blue-400 rounded-full"
                        style={{ height: "4px" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Spacing country filter selectors */}
            <div className="flex flex-col gap-4 mb-6 border-b border-blue-500/10 pb-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {["Global", "India", "USA", "Europe", "Japan", "Asia"].map((c) => {
                  const isActive = selectedCountry === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedCountry(c)}
                      className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                        isActive 
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                          : "bg-slate-900/30 border-blue-500/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {c === "Global" && <span>🌍 Global</span>}
                      {c === "India" && (
                        <>
                          <img src="https://flagcdn.com/w20/in.png" className="w-5 h-3.5 object-cover rounded-sm" alt="India" />
                          <span>India</span>
                        </>
                      )}
                      {c === "USA" && (
                        <>
                          <img src="https://flagcdn.com/w20/us.png" className="w-5 h-3.5 object-cover rounded-sm" alt="USA" />
                          <span>USA</span>
                        </>
                      )}
                      {c === "Europe" && (
                        <>
                          <img src="https://flagcdn.com/w20/eu.png" className="w-5 h-3.5 object-cover rounded-sm" alt="Europe" />
                          <span>Europe</span>
                        </>
                      )}
                      {c === "Japan" && (
                        <>
                          <img src="https://flagcdn.com/w20/jp.png" className="w-5 h-3.5 object-cover rounded-sm" alt="Japan" />
                          <span>Japan</span>
                        </>
                      )}
                      {c === "Asia" && <span>🌏 Asia</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                {["Markets", "Stocks", "Economy", "IPO", "Crypto", "Banking", "Policy", "Technology"].map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 text-xs font-bold transition-all relative cursor-pointer ${
                        isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {cat}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicatorDedicated"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column news items */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                <div className="flex flex-col gap-6">
                  {filteredNews.map((news) => {
                    const isCritical = news.breaking || news.id === "news-1";
                    const hasExposure = news.id === "news-1" || news.id === "news-2";
                    const isMattersExpanded = expandedMattersId === news.id;

                    return (
                      <motion.div
                        key={news.id}
                        layout
                        className={`p-6 rounded-2xl border transition-all duration-300 bg-slate-900/20 relative group overflow-hidden flex flex-col gap-4.5 ${
                          isCritical 
                            ? "border-red-500/30 hover:border-red-500/50 critical-glow" 
                            : "border-blue-500/10 hover:border-blue-500/25"
                        }`}
                      >
                        {isCritical && (
                          <div className="absolute top-0 bottom-0 left-0 w-1 bg-red-600 animate-pulse" />
                        )}

                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-slate-950/60 border border-blue-500/10 px-2.5 py-1 rounded text-slate-400 font-extrabold uppercase">
                              {news.source}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">{news.timestamp}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                              isCritical ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            }`}>
                              {isCritical ? "★★★★★ Critical" : "★★★★☆ High"}
                            </span>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                              🟢 {news.impact}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-base md:text-lg font-black text-white leading-snug group-hover:text-blue-400 transition-colors">
                          {news.headline}
                        </h4>

                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                          {news.summary}
                        </p>

                        {hasExposure && (
                          <div className="p-3.5 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                                {news.id === "news-1" ? "R" : "A"}
                              </div>
                              <div>
                                <span className="text-xs font-black text-white block">Portfolio Exposure: {news.id === "news-1" ? "Reliance Industries" : "Apple Inc."}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Current Weight: {news.id === "news-1" ? "18%" : "8%"}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Moderately Positive</span>
                              <span className="text-[9px] text-slate-500 font-semibold uppercase block">Expected Volatility: Medium</span>
                            </div>
                          </div>
                        )}

                        <div className="p-3.5 rounded-xl bg-blue-600/[0.02] border border-blue-500/10 flex flex-col gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black text-white uppercase tracking-wider">🟢 Affects You</span>
                          </div>
                          <ul className="text-xs font-semibold text-slate-400 space-y-1 pl-1 leading-normal list-disc list-inside">
                            {news.id === "news-1" ? (
                              <>
                                <li>Reliance weight (18%) may drive short-term portfolio momentum.</li>
                                <li>FD interest rates could gradually shift.</li>
                                <li>Provides net-worth appreciation opportunities.</li>
                              </>
                            ) : news.id === "news-2" ? (
                              <>
                                <li>Apple weight (8%) directly benefits from services revenue expansion.</li>
                                <li>IT sector valuation sentiment improves.</li>
                              </>
                            ) : (
                              <li>No immediate negative impact on your current holdings.</li>
                            )}
                          </ul>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-t border-blue-500/5 pt-3">
                          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mr-1">Affected Targets</span>
                          {news.affected.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center gap-1 bg-slate-950/60 border border-blue-500/5 px-2.5 py-1 rounded text-xs font-mono font-bold"
                            >
                              <span className="text-slate-400">{item.name}</span>
                              <span className={item.change >= 0 ? "text-emerald-500" : "text-rose-500"}>
                                {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                              </span>
                            </div>
                          ))}
                        </div>

                        {isMattersExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-xl bg-slate-950/50 border border-blue-500/10 flex flex-col gap-3.5 mt-2"
                          >
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">💡 why this matters</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold leading-relaxed">
                              <div>
                                <span className="text-slate-500 uppercase tracking-wider text-[9px] block">What happened</span>
                                <p className="text-slate-300">{news.whyItMatters}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 uppercase tracking-wider text-[9px] block">Who is affected</span>
                                <p className="text-slate-300">{news.whoIsAffected}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 uppercase tracking-wider text-[9px] block">Short-term Impact</span>
                                <p className="text-slate-300">{news.shortTerm}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 uppercase tracking-wider text-[9px] block">Long-term Impact</span>
                                <p className="text-slate-300">{news.longTerm}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 border-t border-blue-500/5 pt-3">
                          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mr-1">Possible Actions</span>
                          {[
                            news.id === "news-1" ? "Review FD Strategy" : "Watch Tech Sector",
                            "Rebalance Portfolio",
                            "Open Investment Engine"
                          ].map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => window.location.href = '/dashboard'}
                              className="px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-600 border border-blue-500/25 text-[10px] font-black text-blue-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              {action}
                            </button>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-blue-500/5 mt-3 pt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI Confidence: <span className="text-blue-400 font-mono">{news.confidence}%</span></span>
                            <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-blue-500/5">
                              <div className="h-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" style={{ width: `${news.confidence}%` }} />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setExpandedMattersId(isMattersExpanded ? null : news.id)}
                              className="px-3 py-1.5 rounded-lg border border-blue-500/10 bg-slate-950/40 hover:bg-slate-950 text-slate-400 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              {isMattersExpanded ? "Hide Details" : "Why This Matters"}
                            </button>
                            <button 
                              onClick={() => setActiveArticle(news)}
                              className="text-xs font-bold text-blue-400 hover:text-white flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                            >
                              <BookOpen className="w-4 h-4" /> Explain
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="p-6 rounded-2xl border border-blue-500/10 bg-slate-900/10 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">Related News Cluster Flow</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Visualizing connected macroeconomic triggers</p>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 relative">
                    {[
                      { title: "Fed Rate Cut Decision", desc: "FOMC Policy Shift" },
                      { title: "Inflation Rate Cooling", desc: "CPI Drops to 2.4%" },
                      { title: "US Dollar Index Slides", desc: "Capital Flow Shift" },
                      { title: "IT/NASDAQ Resurgence", desc: "Apple Service Record" }
                    ].map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-blue-500/10 text-center w-full md:w-36 z-10 animate-pulse">
                          <span className="text-[10px] font-black text-white block leading-normal">{step.title}</span>
                          <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider mt-1">{step.desc}</span>
                        </div>
                        {idx < 3 && (
                          <div className="w-6 h-6 flex items-center justify-center text-blue-500 rotate-90 md:rotate-0">
                            ➔
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column widgets */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* AI Daily Intelligence Digest Panel - moved to sidebar */}
                <div className="glass-card p-5 rounded-xl border border-blue-500/10 bg-slate-900/10 flex flex-col gap-4 text-slate-300">
                  <div className="flex justify-between items-center border-b border-blue-500/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Daily Digest</h4>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-[10px]">
                      72
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">🎯 Opportunities</span>
                      <ul className="space-y-1 text-xs font-semibold text-slate-300">
                        <li>• Lock yields in 7.25% fixed deposits</li>
                        <li>• Accumulate IT device makers</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-1">⚠️ Risks</span>
                      <ul className="space-y-1 text-xs font-semibold text-slate-300">
                        <li>• High multiples stretch in mega-caps</li>
                        <li>• Yen carry-trade liquidity cycles</li>
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-600/[0.03] border border-blue-500/10 text-left">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-0.5">🧠 AI Insight</span>
                      <p className="text-xs font-semibold text-slate-300 leading-normal">
                        Your Reliance (18% weight) holding suggests a potential +₹14,200 net-worth bump.
                      </p>
                    </div>
                  </div>
                </div>

                {/* News Intelligence Graph */}
                <div className="glass-card p-5 rounded-xl border border-blue-500/10 bg-slate-900/10 flex flex-col gap-4">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">News Intelligence Graph</h4>
                    <p className="text-[9px] text-slate-500">Macro relationship analyzer</p>
                  </div>

                  <div className="relative h-48 w-full border border-blue-500/5 rounded-lg bg-slate-950/50 overflow-hidden flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3" />
                      <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3" />
                      <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3" />
                      <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3" />
                    </svg>

                    <div className="absolute w-20 h-20 rounded-full bg-blue-600/10 border-2 border-blue-500 flex items-center justify-center text-center p-1.5 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10">
                      <span className="text-[9px] font-black text-white leading-normal uppercase">Sensex 90K Landmark</span>
                    </div>

                    <div className="absolute top-4 left-4 p-1.5 rounded-lg bg-slate-900 border border-blue-500/20 text-center hover:scale-105 transition-transform cursor-pointer">
                      <span className="text-[8px] font-black text-slate-300 block uppercase">Reliance (18%)</span>
                    </div>
                    <div className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-blue-500/20 text-center hover:scale-105 transition-transform cursor-pointer">
                      <span className="text-[8px] font-black text-slate-300 block uppercase">Nifty Target</span>
                    </div>
                    <div className="absolute bottom-4 left-4 p-1.5 rounded-lg bg-slate-900 border border-blue-500/20 text-center hover:scale-105 transition-transform cursor-pointer">
                      <span className="text-[8px] font-black text-slate-300 block uppercase">India Inflows</span>
                    </div>
                    <div className="absolute bottom-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-blue-500/20 text-center hover:scale-105 transition-transform cursor-pointer">
                      <span className="text-[8px] font-black text-slate-300 block uppercase">IT Resurgence</span>
                    </div>
                  </div>
                </div>

                {/* similarity calendar */}
                <div className="glass-card p-4 rounded-xl border border-blue-500/10 bg-slate-900/10 flex flex-col gap-4">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Historical Similarity Timelines</h4>
                    <p className="text-[9px] text-slate-500">Comparing current cycles to past events</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "2024 RBI Rate Cut", recovery: "4 Months", reaction: "+12% Index surge" },
                      { title: "2020 COVID Market Crash", recovery: "9 Months", reaction: "V-Shape recovery bounce" },
                      { title: "2008 Lehman Liquidity Crisis", recovery: "22 Months", reaction: "Structural consolidation" }
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950/40 border border-blue-500/5 text-left text-xs font-semibold leading-normal"
                      >
                        <span className="text-white font-black block text-[10px]">{item.title}</span>
                        <span className="text-slate-400 block text-[9px]">Market Reaction: {item.reaction}</span>
                        <span className="text-blue-400 block text-[9px]">Recovery Time: {item.recovery}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EOD Recap */}
                <div className="glass-card p-4 rounded-xl border border-blue-500/10 bg-slate-900/10 flex flex-col gap-4">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">End-of-Day AI Recap</h4>
                    <p className="text-[9px] text-slate-500">Daily market close synopsis</p>
                  </div>
                  <div className="space-y-2.5 text-xs font-semibold leading-normal">
                    <div className="flex justify-between border-b border-blue-500/5 pb-1">
                      <span className="text-slate-500">Biggest Winner</span>
                      <span className="text-emerald-400 font-bold">Reliance Industries (+2.34%)</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-500/5 pb-1">
                      <span className="text-slate-500">Biggest Loser</span>
                      <span className="text-rose-400 font-bold">ITCs Ltd (-1.12%)</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-500/5 pb-1">
                      <span className="text-slate-500">Best Performing Sector</span>
                      <span className="text-emerald-400 font-bold">Energy & Solar (+3.82%)</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-500/5 pb-1">
                      <span className="text-slate-500">Worst Performing Sector</span>
                      <span className="text-rose-400 font-bold">FMCG Goods (-0.85%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explain Drawer Panel */}
          <AnimatePresence>
            {activeArticle && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveArticle(null)}
                  className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[99998]"
                />

                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-slate-950/95 border-l border-blue-500/20 shadow-2xl p-6 overflow-y-auto z-[99999] text-left flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center border-b border-blue-500/10 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 animate-pulse">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">JARVIS INTEL EXPLAINER</h4>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Fincody Live AI Co-Pilot</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveArticle(null)}
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[8px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-black uppercase">
                          {activeArticle.source}
                        </span>
                        <h3 className="text-sm font-black text-white mt-2 leading-relaxed">{activeArticle.headline}</h3>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div>
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">Why this matters</span>
                          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{activeArticle.whyItMatters}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">Who is affected</span>
                          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{activeArticle.whoIsAffected}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">Short-term Impact</span>
                            <p className="text-[10px] text-slate-300 mt-1 leading-normal">{activeArticle.shortTerm}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">Long-term Impact</span>
                            <p className="text-[10px] text-slate-300 mt-1 leading-normal">{activeArticle.longTerm}</p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-blue-900/[0.04] border border-blue-500/10 space-y-2">
                          <div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5" /> Potential Opportunities
                            </span>
                            <p className="text-[10px] text-slate-300 mt-0.5 leading-normal">{activeArticle.opportunities}</p>
                          </div>
                          <div className="border-t border-blue-500/5 pt-2">
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider block flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Risk Factors
                            </span>
                            <p className="text-[10px] text-slate-300 mt-0.5 leading-normal">{activeArticle.risks}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-blue-500/10 pt-4 mt-6">
                    <button
                      onClick={() => {
                        setActiveArticle(null);
                        window.location.href = '/dashboard';
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" /> Discuss Opportunity on Dashboard
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer copyright */}
      <footer className="py-12 border-t border-[var(--border-color)] bg-slate-950/20 text-center text-xs text-slate-500">
        <p>© 2026 FinCody Finance. All rights reserved.</p>
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
      )}    </div>
  );
}
