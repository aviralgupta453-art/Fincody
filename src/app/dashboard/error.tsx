"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Trash2, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error boundary caught error:", error);
  }, [error]);

  const handleClearCacheAndReset = () => {
    try {
      if (typeof window !== "undefined") {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("fincody_")) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (e) {
      console.error("Failed to clear local storage:", e);
    }
    reset();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-rose-500/20 bg-slate-900/60 shadow-2xl flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2 animate-pulse">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-black tracking-tight text-white">
          Dashboard Encountered an Issue
        </h1>
        
        <p className="text-xs text-slate-400 leading-relaxed">
          {error?.message || "A client-side exception occurred while rendering the dashboard."}
        </p>

        <div className="w-full flex flex-col gap-3 mt-4">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Try Loading Again
          </button>

          <button
            onClick={handleClearCacheAndReset}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            Reset Saved Local Cache & Reload
          </button>

          <Link
            href="/"
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 mt-1"
          >
            <Home className="w-3.5 h-3.5" /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
