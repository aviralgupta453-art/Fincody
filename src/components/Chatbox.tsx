"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, X, Send, Sparkles, User, HelpCircle, Loader2, Mic, 
  MicOff, Volume2, VolumeX, Upload, AlertTriangle, CheckCircle2, 
  TrendingUp, TrendingDown, RefreshCw, FileText, ChevronRight, BarChart2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  isDocSummary?: boolean;
  docName?: string;
  docDetails?: {
    insights: string[];
    redFlags: string[];
    dates: string[];
    savings: string;
  };
  isSimulation?: boolean;
  simulationData?: {
    name: string;
    Standard: number;
    Simulated: number;
  }[];
}

const MORPHING_TITLES = [
  "Your Personal AI Finance Coach",
  "Investment Analyst",
  "Budget Planner",
  "Wealth Advisor",
  "Tax Assistant",
  "Financial Decision Engine"
];

const THINKING_STAGES = [
  "Understanding your finances...",
  "Analyzing investments...",
  "Checking market conditions...",
  "Building recommendation..."
];

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingStageIdx, setThinkingStageIdx] = useState(0);
  
  // Voice Mode States
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [voiceWave, setVoiceWave] = useState(false);
  
  // Document Dropzone States
  const [dragActive, setDragActive] = useState(false);
  const [analyzingDoc, setAnalyzingDoc] = useState(false);
  const [analyzedDocName, setAnalyzedDocName] = useState("");
  
  // Context State
  const [ctx, setCtx] = useState<any>(null);
  
  // Morphing title state
  const [titleIdx, setTitleIdx] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // 2. Morphing welcome title effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % MORPHING_TITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3. AI Thinking stage animation loop
  useEffect(() => {
    let interval: any;
    if (isTyping) {
      setThinkingStageIdx(0);
      interval = setInterval(() => {
        setThinkingStageIdx((prev) => (prev + 1) % THINKING_STAGES.length);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  // 4. Fetch dashboard context dynamically
  const loadDashboardContext = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const prefix = userId ? `${userId}_` : "";

      const getLocal = (key: string, fallback: any) => {
        if (typeof window === "undefined") return fallback;
        const val = localStorage.getItem(`${prefix}${key}`);
        if (!val && userId) {
          const valNoPref = localStorage.getItem(key);
          return valNoPref ? JSON.parse(valNoPref) : fallback;
        }
        return val ? JSON.parse(val) : fallback;
      };

      setCtx({
        netWorth: getLocal("netWorth", 3845210),
        monthlySavings: getLocal("monthlySavings", 72450),
        manualSalary: getLocal("manualSalary", "200000"),
        portfolio: getLocal("portfolio", []),
        fixedDeposits: getLocal("fixedDeposits", []),
        insurancePolicies: getLocal("insurancePolicies", []),
        subscriptions: getLocal("subscriptions", []),
        goals: getLocal("goals", []),
        documents: getLocal("documents", []),
        healthScore: getLocal("healthScore", 94)
      });
    } catch (e) {
      console.error("Error loading chatbox context:", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDashboardContext();
      
      // Load memory or set welcome message
      const savedMemory = localStorage.getItem("fincody_chat_memory");
      if (savedMemory) {
        setMessages(JSON.parse(savedMemory));
      } else {
        setMessages([
          {
            id: "welcome",
            sender: "bot",
            text: "Hello, I am FINCODY AI. I have analyzed your active financial profiles and accounts. How shall we coordinate your assets or goals today?",
            timestamp: new Date()
          }
        ]);
      }
    }
  }, [isOpen]);

  // 5. Canvas Neural network particles background
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctxCanvas = canvas.getContext("2d");
    if (!ctxCanvas) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1
      });
    }

    const draw = () => {
      ctxCanvas.clearRect(0, 0, width, height);
      ctxCanvas.fillStyle = "rgba(59, 130, 246, 0.05)";
      ctxCanvas.strokeStyle = "rgba(59, 130, 246, 0.03)";
      ctxCanvas.lineWidth = 0.5;

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctxCanvas.beginPath();
        ctxCanvas.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctxCanvas.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 80) {
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(p.x, p.y);
            ctxCanvas.lineTo(p2.x, p2.y);
            ctxCanvas.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  // 6. Voice Mode synthesis out-loud speaker
  const speakText = (text: string) => {
    if (voiceMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#\-\[\]]/g, "").substring(0, 200); // limit synthesis to prevent performance blocks
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    
    // Wave animation during speaking
    setVoiceWave(true);
    utterance.onend = () => setVoiceWave(false);
    utterance.onerror = () => setVoiceWave(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // 7. Context-Aware custom response generator
  const getAIResponse = (query: string): { text: string; isSim?: boolean; simData?: any[] } => {
    const q = query.toLowerCase();
    
    // Fallback variables if context isn't loaded yet
    const nw = ctx?.netWorth || 3845210;
    const ms = ctx?.monthlySavings || 72450;
    const sal = ctx?.manualSalary ? parseFloat(ctx.manualSalary) : 200000;
    const totalSip = ctx?.portfolio?.reduce((acc: number, item: any) => acc + (item.qty * (item.avgBuyPrice || 100)), 0) || 120000;
    const subCount = ctx?.subscriptions?.length || 3;
    const insCount = ctx?.insurancePolicies?.length || 3;
    const goalCount = ctx?.goals?.length || 2;

    // A. Simulator modeling query checks
    if (q.includes("car") || q.includes("afford a car") || q.includes("20 lakh")) {
      const standardWorth = Math.round(nw / 100000);
      const simulatedData = Array.from({ length: 6 }).map((_, idx) => {
        const year = 2026 + idx;
        const stdVal = standardWorth + (ms * 12 * idx) / 100000;
        const simVal = stdVal - 20; // Buying ₹20 Lakh car
        return {
          name: `${year}`,
          Standard: Math.round(stdVal),
          Simulated: Math.round(Math.max(0, simVal))
        };
      });

      return {
        text: `Modeling a ₹20 Lakh vehicle purchase. Based on your Net Worth (₹${nw.toLocaleString()}) and Monthly Savings (₹${ms.toLocaleString()}), you can afford this. However, your asset growth trajectory dilutes by ₹6.2 Lakhs by Year 5 due to depreciation and lost compounding. I recommend deferring by 4 months or financing no more than 40%.`,
        isSim: true,
        simData: simulatedData
      };
    }

    if (q.includes("mba") || q.includes("study") || q.includes("mba tuition")) {
      const standardWorth = Math.round(nw / 100000);
      const simulatedData = Array.from({ length: 6 }).map((_, idx) => {
        const year = 2026 + idx;
        const stdVal = standardWorth + (ms * 12 * idx) / 100000;
        // MBA costs 30L but boosts income by 60% post year 2
        let simVal = stdVal;
        if (idx >= 1) simVal -= 30; // MBA tuition cost
        if (idx >= 3) simVal += (ms * 12 * 1.6 * (idx - 2)) / 100000; // salary bump
        return {
          name: `${year}`,
          Standard: Math.round(stdVal),
          Simulated: Math.round(Math.max(0, simVal))
        };
      });

      return {
        text: `Simulating high-tier study options. Tuitions of ₹30L will drop your net worth temporarily, but post-grad salary bumps raise your annualized returns by 60%. Your long term wealth grows by +₹1.2 Crores by Year 10.`,
        isSim: true,
        simData: simulatedData
      };
    }

    if (q.includes("increase my sip") || q.includes("increase sip") || q.includes("sip by")) {
      const standardWorth = Math.round(nw / 100000);
      const simulatedData = Array.from({ length: 6 }).map((_, idx) => {
        const year = 2026 + idx;
        const stdVal = standardWorth + (ms * 12 * idx) / 100000;
        // Adding ₹5k monthly (60k yearly) with compounding
        const extraCompounding = (60000 * idx * 1.12) / 100000;
        return {
          name: `${year}`,
          Standard: Math.round(stdVal),
          Simulated: Math.round(stdVal + extraCompounding)
        };
      });

      return {
        text: `Simulating a ₹5,000 monthly SIP boost. Increasing your active mutual fund pool adds an extra ₹4.8 Lakhs in compounding asset wealth by Year 5.`,
        isSim: true,
        simData: simulatedData
      };
    }

    if (q.includes("retire at 45") || q.includes("early retirement")) {
      const standardWorth = Math.round(nw / 100000);
      const simulatedData = Array.from({ length: 6 }).map((_, idx) => {
        const year = 2026 + idx;
        const stdVal = standardWorth + (ms * 12 * idx) / 100000;
        // Retirement drawdown modeling
        return {
          name: `${year}`,
          Standard: Math.round(stdVal),
          Simulated: Math.round(stdVal * 0.95)
        };
      });

      return {
        text: `Analyzing early retirement parameters. To retire at 45, you require an index corpus of ₹4.5 Crores. With your current net worth of ₹${nw.toLocaleString()}, you will reach this goal in 12 years if you increase your monthly savings rate to 48%.`,
        isSim: true,
        simData: simulatedData
      };
    }

    // B. Normal Context-Aware Queries
    if (q.includes("analyze portfolio") || q.includes("stocks") || q.includes("investments")) {
      return {
        text: `Auditing portfolio holdings. You have ${ctx?.portfolio?.length || 0} active equity trackers totaling ₹${totalSip.toLocaleString()} cost value. Your average returns performance index is sitting at ${ctx?.healthScore || 94}%. Recommendation: Rebalance tech assets to high-yield bonds.`
      };
    }

    if (q.includes("reduce expenses") || q.includes("subscriptions") || q.includes("optimize budget")) {
      return {
        text: `Scanning active outlays. You have ${subCount} active subscription billing cycles. Auditing: ICICI Auto roadside duplication detected (saves ₹400/mo) and Netflix unused secondary slot detected (saves ₹300/mo). Total optimized monthly savings potential: ₹700.`
      };
    }

    if (q.includes("tax") || q.includes("tax shield") || q.includes("save in taxes")) {
      return {
        text: `Auditing tax shield exposure. Maximizing your personal NPS contribution cap before March 31 will shield an extra ₹50,000, saving ₹15,600 under Section 80CCD(1B).`
      };
    }

    if (q.includes("insurance") || q.includes("term life")) {
      return {
        text: `Auditing policy covers. You have ${insCount} active insurance covers. Audit: Health policy HDFC Ergo Optima (₹15L cover) is optimal, but auto policy contains overlapping roadside premium drag.`
      };
    }

    if (q.includes("hi") || q.includes("hello") || q.includes("jarvis")) {
      return {
        text: `Hello! I am FINCODY AI. Loaded profile parameters: Net Worth ₹${nw.toLocaleString()}, Monthly Savings ₹${ms.toLocaleString()}. What decision models shall we audit?`
      };
    }

    return {
      text: `Audit query processed. Fincody AI model predicts a stable path. Let me know if I should simulate target MBA MBAs, car purchases, or rebalance your ${ctx?.portfolio?.length || 0} stock holdings.`
    };
  };

  // 8. Handle user prompt submit
  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    localStorage.setItem("fincody_chat_memory", JSON.stringify(newMessages));
    
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and typing latency
    setTimeout(() => {
      const response = getAIResponse(textToSend);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: response.text,
        timestamp: new Date(),
        isSimulation: response.isSim,
        simulationData: response.simData
      };
      
      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      localStorage.setItem("fincody_chat_memory", JSON.stringify(finalMessages));
      setIsTyping(false);
      
      // Voice synthesis speak response
      if (voiceActive) {
        speakText(response.text);
      }
    }, 1500);
  };

  // 9. Document Intelligence drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedDoc(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedDoc(e.target.files[0]);
    }
  };

  const processUploadedDoc = (file: File) => {
    setAnalyzingDoc(true);
    setAnalyzedDocName(file.name);

    // Simulate real-time doc analysis
    setTimeout(() => {
      setAnalyzingDoc(false);
      const botDocMessage: Message = {
        id: "doc-summary-" + Date.now(),
        sender: "bot",
        text: `Secure Audit Completed for ${file.name}. Key findings generated below:`,
        timestamp: new Date(),
        isDocSummary: true,
        docName: file.name,
        docDetails: {
          insights: [
            "Interest Rate matches standard pricing benchmarks.",
            "Recurring administrative charges found under hidden footnotes."
          ],
          redFlags: [
            "High late-payment penalties detected (+36% APR).",
            "Duplicated service fee overlapping active ICICI policies."
          ],
          dates: [
            "Maturity Renewal due: 15 Oct 2026",
            "Premium cycle grace ends: 12 days post billing"
          ],
          savings: "Save ₹4,800 annually by switching to auto-debit waivers."
        }
      };

      const finalMessages = [...messages, botDocMessage];
      setMessages(finalMessages);
      localStorage.setItem("fincody_chat_memory", JSON.stringify(finalMessages));
    }, 2000);
  };

  // 10. Voice microphone toggle
  const toggleVoiceMode = () => {
    if (!voiceActive) {
      setVoiceActive(true);
      setVoiceMuted(false);
      // Greet user
      speakText("Voice mode active. Ask me any question.");
    } else {
      setVoiceActive(false);
      setVoiceWave(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <>
      {/* Floating Trigger Bubble - Premium orb animation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-slate-950 border border-blue-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer group focus:outline-none"
        aria-label="Toggle Fincody AI Copilot Chat"
      >
        <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden">
          {/* Breathing glow layers */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 opacity-60 rounded-full animate-ping duration-1000" />
          <div className="absolute inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full group-hover:scale-105 transition-transform" />
          
          {isOpen ? (
            <X className="w-5 h-5 text-white z-10" />
          ) : (
            <div className="relative flex items-center justify-center z-10">
              <Bot className="w-6 h-6 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onDragEnter={handleDrag}
            className="fixed bottom-24 right-6 z-[9999] w-[400px] max-w-[calc(100vw-32px)] h-[580px] max-h-[calc(100vh-120px)] bg-slate-950/85 border border-blue-500/20 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col overflow-hidden backdrop-blur-2xl text-left font-sans"
          >
            {/* Neural Net canvas background */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 w-full h-full" />

            {/* Header */}
            <div className="bg-slate-950/50 px-4 py-3.5 border-b border-blue-500/10 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                {/* Dynamic animated AI Orb */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.4)] overflow-hidden">
                  <div className="absolute inset-0 bg-blue-400/20 animate-ping duration-1000" />
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">FINCODY AI</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Intelligence Active</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Voice mode toggle */}
                <button
                  onClick={toggleVoiceMode}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${voiceActive ? "bg-blue-600/10 border-blue-500 text-blue-400" : "border-slate-800 text-slate-500 hover:text-slate-300"}`}
                  title={voiceActive ? "Deactivate Voice Mode" : "Activate Voice Mode"}
                >
                  {voiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                {/* Speech Synthesis Speaker mute toggle */}
                {voiceActive && (
                  <button
                    onClick={() => setVoiceMuted(!voiceMuted)}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 cursor-pointer"
                    title={voiceMuted ? "Unmute Voice Replies" : "Mute Voice Replies"}
                  >
                    {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-500/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drag & Drop Overlays */}
            {dragActive && (
              <div 
                className="absolute inset-0 z-50 bg-blue-950/60 backdrop-blur-md border-[2px] border-dashed border-blue-500 m-3 rounded-xl flex flex-col items-center justify-center text-center p-6 text-white"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-10 h-10 text-blue-400 animate-bounce mb-3" />
                <span className="text-sm font-black uppercase tracking-wider">Drop financial file here</span>
                <span className="text-xs text-slate-400 mt-1">Bank statements, salary slips, or policy documents</span>
              </div>
            )}

            {/* Document Analyzer Loading Screen */}
            {analyzingDoc && (
              <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 text-white">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <span className="text-sm font-black uppercase tracking-wider mb-1">Analyzing Document</span>
                <span className="text-xs text-slate-400 font-mono italic">"{analyzedDocName}"</span>
                <div className="flex flex-col gap-1.5 mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-wider text-left border-t border-slate-800 pt-4 w-48">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" /> Decrying storage key...
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500 animate-ping" /> Scanning statement tables...
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-500 animate-ping" /> Auditing interest margins...
                  </div>
                </div>
              </div>
            )}

            {/* Messages & Welcome Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none z-10">
              
              {/* Welcome morphing banner */}
              {messages.length <= 1 && (
                <div className="p-5 rounded-2xl border border-blue-500/10 bg-slate-900/10 backdrop-blur-md mb-2 text-center animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-base font-black text-white">👋 Welcome to FINCODY AI</h3>
                  <div className="h-6 flex items-center justify-center mt-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={titleIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs font-bold text-blue-400 uppercase tracking-widest block font-mono"
                      >
                        {MORPHING_TITLES[titleIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Dynamic Proactive suggestions cards */}
              {messages.length <= 1 && ctx && (
                <div className="flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-500">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 text-left">Proactive Audit Alerts</span>
                  
                  {/* Suggestion Card 1: Tax saving alert */}
                  <div 
                    onClick={() => handleSend("Explain how to save ₹15,600 under Section 80CCD(1B) using NPS contribution")}
                    className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.02] hover:bg-amber-500/5 transition-all text-xs flex items-start gap-3 cursor-pointer text-left group"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">NPS Tax Shield Gap</span>
                      <p className="text-slate-400 text-[10px]">Audit: Personal NPS limit is not maximized. Add ₹50,000 to save ₹15,600 in taxes.</p>
                    </div>
                  </div>

                  {/* Suggestion Card 2: Coverage check */}
                  {ctx.insurancePolicies.length === 0 ? (
                    <div 
                      onClick={() => handleSend("What is my Term Life insurance coverage gap and recommendation?")}
                      className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.02] hover:bg-rose-500/5 transition-all text-xs flex items-start gap-3 cursor-pointer text-left group"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="font-bold text-white block mb-0.5">Critical Coverage Gap</span>
                        <p className="text-slate-400 text-[10px]">No active insurance covers found. Life liabilities represent ₹0 buffer.</p>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => handleSend("Analyze overlapping auto policy premiums drag")}
                      className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/[0.02] hover:bg-blue-500/5 transition-all text-xs flex items-start gap-3 cursor-pointer text-left group"
                    >
                      <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="font-bold text-white block mb-0.5">Redundant Premium Load</span>
                        <p className="text-slate-400 text-[10px]">Auto policy contains overlapping roadside premium features (saves ₹400/mo).</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chat history mapping loop */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 max-w-[90%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  {/* Glowing dynamic orb avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border relative overflow-hidden ${
                      msg.sender === "user"
                        ? "bg-indigo-600/10 border-indigo-500/25 text-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                        : "bg-blue-600/10 border-blue-500/20 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    {/* Render message bubble */}
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed border shadow-sm ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white border-blue-500/20 rounded-tr-none"
                          : "bg-slate-900/60 text-slate-100 border-blue-500/5 rounded-tl-none backdrop-blur-md"
                      }`}
                    >
                      {msg.text}

                      {/* A. If message bubble contains document summaries */}
                      {msg.isDocSummary && msg.docDetails && (
                        <div className="mt-3.5 pt-3.5 border-t border-slate-800 flex flex-col gap-3 text-left">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Key Insights</span>
                            <div className="flex flex-col gap-1 text-[10px] text-slate-300">
                              {msg.docDetails.insights.map((ins, idx) => (
                                <div key={idx} className="flex items-start gap-1">
                                  <span>•</span> <span>{ins}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-rose-400 font-bold block mb-1">Red Flags</span>
                            <div className="flex flex-col gap-1 text-[10px] text-rose-400">
                              {msg.docDetails.redFlags.map((rf, idx) => (
                                <div key={idx} className="flex items-start gap-1">
                                  <span>⚠️</span> <span>{rf}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-800 text-emerald-400 font-bold">
                            <span>Optimization Potential:</span>
                            <span>{msg.docDetails.savings}</span>
                          </div>
                        </div>
                      )}

                      {/* B. If message bubble contains simulator charts */}
                      {msg.isSimulation && msg.simulationData && (
                        <div className="mt-3.5 pt-3.5 border-t border-slate-800 flex flex-col gap-3 text-left">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block font-mono">Simulation Project (₹ Lakhs)</span>
                          
                          {/* Inline Bar chart layout */}
                          <div className="flex flex-col gap-1.5 mt-1 font-mono">
                            {msg.simulationData.map((d) => {
                              const maxVal = Math.max(...msg.simulationData!.map(o => Math.max(o.Standard, o.Simulated)));
                              const stdPct = maxVal > 0 ? (d.Standard / maxVal) * 100 : 0;
                              const simPct = maxVal > 0 ? (d.Simulated / maxVal) * 100 : 0;
                              
                              return (
                                <div key={d.name} className="flex items-center gap-2 text-[9px]">
                                  <span className="w-7 text-slate-500">{d.name}</span>
                                  <div className="flex-1 flex flex-col gap-0.5">
                                    <div className="h-1.5 bg-slate-800 rounded overflow-hidden">
                                      <div className="h-full bg-slate-600 rounded" style={{ width: `${stdPct}%` }} />
                                    </div>
                                    <div className="h-1.5 bg-blue-900/40 rounded overflow-hidden">
                                      <div className="h-full bg-blue-500 rounded animate-pulse" style={{ width: `${simPct}%` }} />
                                    </div>
                                  </div>
                                  <span className="w-12 text-right text-slate-300 font-bold">{d.Simulated}L</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between items-center text-[9px] text-slate-500 pt-2 border-t border-slate-800/40">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Standard</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Simulated</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 px-1 mt-0.5">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Jarvis Thinking Indicator */}
              {isTyping && (
                <div className="flex gap-3.5 max-w-[90%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-slate-900/60 border border-blue-500/5 px-4 py-3 rounded-2xl rounded-tl-none flex flex-col gap-1.5 text-left">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider animate-pulse">
                      {THINKING_STAGES[thinkingStageIdx]}
                    </span>
                    <div className="flex gap-1 items-center h-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Speaking Animation overlay */}
              {voiceActive && voiceWave && (
                <div className="p-3.5 rounded-xl border border-blue-500/20 bg-slate-900/30 backdrop-blur-md flex items-center justify-between gap-4 mt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Voice Response Active</span>
                  {/* Dynamic sound wave visualizer */}
                  <div className="flex items-center gap-1 h-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-blue-500 rounded-full"
                        animate={{ height: [6, 20, 6] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Smart Quick Action Chips */}
            <div className="px-3 py-2 border-t border-blue-500/10 bg-slate-950/20 z-10">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                {[
                  { label: "📊 Analyze Portfolio", prompt: "Perform a detailed analysis of my stock portfolio allocations" },
                  { label: "💰 Reduce Expenses", prompt: "Scan my subscriptions and recommend savings opportunities" },
                  { label: "📈 Find Investments", prompt: "Recommend high-yield ETFs or index funds matching my portfolio" },
                  { label: "🏠 Buy a House", prompt: "Can I afford buying a house in 3 years with my monthly savings?" },
                  { label: "🚗 Afford a Car?", prompt: "What if I buy a ₹20 Lakh car?" },
                  { label: "🎯 Plan Retirement", prompt: "What if I want to retire early at 45?" },
                  { label: "💡 Increase SIP", prompt: "What if I increase my monthly mutual fund SIP by ₹5,000?" }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip.prompt)}
                    className="text-[10px] font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-blue-500 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Panel with Dropzone upload trigger */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-blue-500/10 flex gap-2 items-center bg-slate-950/80 z-10"
            >
              {/* Document upload trigger */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                title="Upload bank statements or documents for AI audit"
              >
                <Upload className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={voiceActive ? "Listening for voice..." : "Ask FINCODY AI..."}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 transition-all font-semibold"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-40 disabled:hover:bg-blue-600 disabled:active:scale-100 cursor-pointer shrink-0 shadow-md shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
