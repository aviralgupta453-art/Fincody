"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles, User, HelpCircle, Loader2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi there! 👋 I'm your Fincody AI Copilot. How can I help you organize your finances, simulate future scenarios, or plan your life goals today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const quickQuestions = [
    "What is Fincody?",
    "How does the simulator work?",
    "Is my financial data safe?",
    "Tell me about the Goal Engine."
  ];

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("what is fincody") || q.includes("about fincody") || q.includes("features")) {
      return "Fincody is an AI-powered Life Operating System. It replaces fragmented spreadsheets by consolidating your net worth, insurance policies, subscription billing, documents, and major milestones into a single, cohesive, premium dashboard.";
    }
    
    if (q.includes("simulator") || q.includes("scenario") || q.includes("wealth projection") || q.includes("future")) {
      return "The Future Simulator (found in the Simulator section of the dashboard) allows you to model 30-year scenarios. You can adjust parameters like savings rates, stock returns, and real estate growth to visualize your net worth trajectory using interactive charts.";
    }

    if (q.includes("safe") || q.includes("security") || q.includes("private") || q.includes("encrypt")) {
      return "Security is our highest priority. Fincody uses Bank-level AES-256 local encryption on files before storage, utilizes multi-factor authentication, and operates on a zero-knowledge data vault structure so only you can read your document vault.";
    }

    if (q.includes("goal") || q.includes("milestone") || q.includes("plan") || q.includes("mba") || q.includes("car")) {
      return "The Goal Engine helps you calculate downpayments, evaluate cashflow impact, and compute opportunity costs of milestones (e.g., buying a ₹15L car, funding a business school degree, or early retirement planning). It aligns goals with your real-time net worth.";
    }

    if (q.includes("subscription") || q.includes("insurance") || q.includes("billing")) {
      return "The Subscription and Insurance vaults track active policies and monthly recurring renewals. The system automatically identifies duplicate subscriptions, alerts you to upcoming rate increases, and suggests cancellation pathways to save capital.";
    }

    if (q.includes("pricing") || q.includes("cost") || q.includes("free") || q.includes("pro")) {
      return "Fincody offers three tiers: \n1. **Free**: Basic net worth tracking and vault storage.\n2. **Pro ($19/mo)**: Unlimited simulation scenarios, advanced AI recommendations, and automated billing alerts.\n3. **Elite ($49/mo)**: Dedicated financial advisor integration and family vault sharing.";
    }

    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "Hello! Hope you're doing well. What financial planning or scenario modeling questions do you have for me today?";
    }

    // Default fallback financial response
    return "That's a great question! As your AI Copilot, I can help you model that scenario. Generally, solid financial planning suggests keeping 3-6 months of expenses in a liquid emergency vault, optimizing high-yield assets, and running simulations for major cash outflows. Try asking me about 'Fincody features', 'security', or 'simulators' to learn more!";
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and typing latency
    setTimeout(() => {
      const responseText = getAIResponse(textToSend);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: responseText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(59,130,246,0.35)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 border border-blue-400/20 group focus:outline-none"
        aria-label="Toggle Fincody AI Copilot Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Bot className="w-7 h-7 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[380px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-120px)] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950/30 to-indigo-950/30 px-4 py-3 border-b border-[var(--border-color)] flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-[var(--text-color)]">Fincody Copilot</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-[var(--text-subtitle)]">AI Assistant • Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-subtitle)] hover:text-[var(--text-color)] p-1 rounded-lg hover:bg-slate-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                    msg.sender === "user"
                      ? "bg-indigo-600/10 border-indigo-500/25 text-indigo-500"
                      : "bg-blue-600/10 border-blue-500/20 text-blue-500"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Bubble Text */}
                <div className="flex flex-col gap-1 text-left">
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line border ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white border-indigo-500/20 rounded-tr-none"
                        : "bg-[var(--nav-bg)] text-[var(--text-color)] border-[var(--border-color)] rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[var(--text-subtitle)] px-1">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto">
                <div className="w-7 h-7 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[var(--nav-bg)] border border-[var(--border-color)] px-4 py-2.5 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 pt-1 border-t border-[var(--border-color)] bg-slate-500/5">
              <p className="text-[10px] text-left text-[var(--text-subtitle)] mb-1.5 font-medium flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Quick suggestions:
              </p>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-[10px] bg-[var(--nav-bg)] border border-[var(--border-color)] text-[var(--text-color)] px-2.5 py-1 rounded-full hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-[var(--border-color)] flex gap-2 items-center bg-[var(--nav-bg)]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot a question..."
              className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-[var(--text-color)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-40 disabled:hover:bg-blue-600 disabled:active:scale-100 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
