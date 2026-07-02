"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const opacityRef = useRef(0);
  const fadeAnimRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const updateOpacity = (val: number) => {
    opacityRef.current = val;
    setVideoOpacity(val);
  };

  const animateFade = (targetOpacity: number, duration: number, callback?: () => void) => {
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }

    const startOpacity = opacityRef.current;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = startOpacity + (targetOpacity - startOpacity) * progress;
      updateOpacity(current);

      if (progress < 1) {
        fadeAnimRef.current = requestAnimationFrame(step);
      } else {
        fadeAnimRef.current = null;
        if (callback) callback();
      }
    };

    fadeAnimRef.current = requestAnimationFrame(step);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const timeLeft = video.duration - video.currentTime;
    if (timeLeft <= 0.55 && !fadingOutRef.current) {
      fadingOutRef.current = true;
      animateFade(0, 500);
    }
  };

  const handleEnded = () => {
    updateOpacity(0);
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch((err) => console.log("Video restart play error:", err));
        fadingOutRef.current = false;
        animateFade(1, 500);
      }
    }, 100);
  };

  const handlePlay = () => {
    fadingOutRef.current = false;
    animateFade(1, 500);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch((err) => console.log("Autoplay blocked:", err));
      animateFade(1, 500);
    }
    return () => {
      if (fadeAnimRef.current) {
        cancelAnimationFrame(fadeAnimRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col relative w-full justify-between select-none">
      {/* Google Font & Liquid Glass Custom CSS styling */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        
        .liquid-glass {
          background: rgba(255, 255, 255, 0.01);
          background-blend-mode: luminosity;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: none;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .liquid-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.4px;
          background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}} />

      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={handlePlay}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
        className="absolute inset-0 w-full h-full object-cover transform translate-y-[17%] pointer-events-none select-none z-0"
        style={{ opacity: videoOpacity }}
      />

      {/* Navigation bar */}
      <header className="relative z-20 px-6 py-6 w-full">
        <div className="rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto w-full liquid-glass">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Globe size={24} className="text-white" />
              <span className="font-semibold text-lg tracking-tight">Asme</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Features</Link>
              <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
              <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors text-sm font-medium">About</Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Sign Up
            </Link>
            <Link href="/dashboard" className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero content area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for the curious
        </h1>

        <div className="max-w-xl w-full space-y-4">
          {/* Email input bar */}
          <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }} className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3 w-full">
            <input 
              type="email" 
              placeholder="Enter your email"
              required
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/40 text-base focus:outline-none"
            />
            <button 
              type="submit"
              className="bg-white rounded-full p-3 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Subtitle text */}
          <p className="text-white text-sm leading-relaxed px-4">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>

          {/* Manifesto button */}
          <div className="pt-2 flex justify-center">
            <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer">
              Read Manifesto
            </button>
          </div>
        </div>
      </main>

      {/* Social icons footer */}
      <footer className="relative z-10 flex justify-center gap-4 pb-12">
        <button 
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
        </button>
        <button 
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Twitter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
        </button>
        <button 
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Website"
        >
          <Globe size={20} />
        </button>
      </footer>
    </div>
  );
}
