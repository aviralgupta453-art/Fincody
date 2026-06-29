"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootSequenceProps {
  onComplete: () => void;
}

// Telemetry log messages for Stage 2
const TELEMETRY_LOGS = [
  "INITIALIZING AI QUANT CO-PILOT...",
  "STATUS: Loading Financial Intelligence...",
  "STATUS: Connecting Global Market Feeds...",
  "STATUS: Training Behavioral Neural Node...",
  "STATUS: Constructing Predictive Wealth Engine...",
  "STATUS: Preparing Personal Advisor Interface...",
  "AI ENGINE STATUS: SECURE & ONLINE."
];

// Morphing statement texts for Stage 4
const MORPH_STATEMENTS = [
  "Not just another finance app.",
  "Your AI Finance Coach.",
  "Your Wealth Companion.",
  "Your Investment Intelligence.",
  "Your Financial Decision Engine.",
  "Built to Understand.",
  "Built to Predict.",
  "Built to Grow With You."
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [logIndex, setLogIndex] = useState(0);
  const [statementIndex, setStatementIndex] = useState(0);
  const [typedLog, setTypedLog] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Sound Synth reference
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Telemetry typing loop
  useEffect(() => {
    if (stage !== 2) return;
    let text = TELEMETRY_LOGS[logIndex];
    let i = 0;
    setTypedLog("");
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setTypedLog((prev) => prev + text.charAt(i));
        i++;
        // Play tiny micro-click audio cue
        playChime(440 + Math.random() * 880, 0.003, "sine", 0.01);
      } else {
        clearInterval(typeInterval);
        // Wait and move to next log or next stage
        setTimeout(() => {
          if (logIndex < TELEMETRY_LOGS.length - 1) {
            setLogIndex((prev) => prev + 1);
          } else {
            // Completed all logs, move to Stage 3
            setStage(3);
          }
        }, 350);
      }
    }, 25);
    return () => clearInterval(typeInterval);
  }, [stage, logIndex]);

  // Morphing statements loop
  useEffect(() => {
    if (stage !== 4) return;
    const interval = setInterval(() => {
      setStatementIndex((prev) => {
        if (prev < MORPH_STATEMENTS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setStage(5);
          }, 800);
          return prev;
        }
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [stage]);

  // Telemetry Stage Timing triggers
  useEffect(() => {
    // Stage 1 (Void): 0.8s
    const t1 = setTimeout(() => setStage(2), 900);
    // Stage 3 (Neural network plexus): lasts 1.5s
    // Triggered inside Stage 2 log callback, so we handle transition from Stage 3 -> 4 here:
    return () => {
      clearTimeout(t1);
    };
  }, []);

  useEffect(() => {
    if (stage === 3) {
      // Play AI ignition sound
      playPulseSound();
      const t3 = setTimeout(() => {
        setStage(4);
      }, 1600);
      return () => clearTimeout(t3);
    }
    if (stage === 5) {
      // Play logo assemble chime
      playChime(523.25, 0.5, "triangle", 0.08); // C5
      setTimeout(() => playChime(659.25, 0.5, "triangle", 0.08), 150); // E5
      setTimeout(() => playChime(783.99, 0.6, "triangle", 0.08), 300); // G5
      setTimeout(() => playChime(1046.50, 0.9, "sine", 0.1), 450); // C6

      const t5 = setTimeout(() => {
        setStage(6);
      }, 2000);
      return () => clearTimeout(t5);
    }
    if (stage === 6) {
      // Complete callback after flying transition completes
      const t6 = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(t6);
    }
  }, [stage]);

  // Audio Synthesizer Cues (Subtle, professional and low-volume)
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setSoundEnabled(true);
  };

  const playChime = (freq: number, duration: number, type: OscillatorType = "sine", vol = 0.05) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "suspended") return;
    try {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context playback warning:", e);
    }
  };

  const playPulseSound = () => {
    if (!audioCtxRef.current) return;
    try {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = "sine";
      // Low heartbeat pulse
      osc.frequency.setValueAtTime(60, audioCtxRef.current.currentTime);
      osc.frequency.linearRampToValueAtTime(110, audioCtxRef.current.currentTime + 1.2);

      gain.gain.setValueAtTime(0.12, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 1.2);
    } catch (e) {}
  };

  // --- 3D PARTICLE SYSTEMS (HTML5 CANVAS) ---
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Setup particles once on mount
  useEffect(() => {
    const pArray = [];
    const charList = ["$", "₹", "%", "€"];
    // Generate 250 float elements
    for (let i = 0; i < 280; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 80 + Math.random() * 150;

      pArray.push({
        // 3D coordinates
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        // Velocity (orbiting/drifting)
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.5 + 0.3,
        char: Math.random() > 0.88 ? charList[Math.floor(Math.random() * charList.length)] : null,
        pulseSpeed: 0.02 + Math.random() * 0.05,
        pulseVal: Math.random(),
        targetX: 0,
        targetY: 0,
        targetZ: 0
      });
    }
    particlesRef.current = pArray;
  }, []);

  // Track cursor
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2
      };
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Pre-calculate target logo coordinates for Stage 5
    // Width of logo target coordinate system: 400x100
    const logoPoints: { x: number; y: number }[] = [];
    const sampleLogo = () => {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = 300;
      offCanvas.height = 80;
      const oCtx = offCanvas.getContext("2d");
      if (oCtx) {
        oCtx.fillStyle = "#ffffff";
        oCtx.font = "900 36px system-ui, sans-serif";
        oCtx.textAlign = "center";
        oCtx.textBaseline = "middle";
        oCtx.fillText("FINCODY", 150, 40);
        const img = oCtx.getImageData(0, 0, 300, 80);
        for (let y = 0; y < 80; y += 4) {
          for (let x = 0; x < 300; x += 4) {
            const idx = (y * 300 + x) * 4;
            if (img.data[idx] > 128) {
              logoPoints.push({ x: (x - 150) * 1.8, y: (y - 40) * 1.8 });
            }
          }
        }
      }
    };
    sampleLogo();

    // Render loop
    let angleY = 0.002;
    let angleX = 0.001;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const focalLength = 320; // 3D Camera depth

      const particles = particlesRef.current;
      const stageLocal = stage; // Capture state

      // 3D rotation matrix coefficients
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Connect lines array for Stage 3
      const projectedPoints: { x: number; y: number; z: number }[] = [];

      particles.forEach((p, idx) => {
        // 1. Apply 3D Rotation
        // Rotate Y
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        // Rotate X
        let y1 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y1;
        p.z = z2;

        // 2. Physics & Orbit Core pulls
        if (stageLocal === 2 || stageLocal === 3) {
          // Pull towards core (orbit mode)
          const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
          const pull = 0.04;
          p.x -= (p.x / dist) * pull;
          p.y -= (p.y / dist) * pull;
          p.z -= (p.z / dist) * pull;
        } else if (stageLocal === 5) {
          // Assembling logo!
          if (logoPoints.length > 0) {
            const targetPoint = logoPoints[idx % logoPoints.length];
            // Blend coordinates towards target coordinates
            p.x += (targetPoint.x - p.x) * 0.16;
            p.y += (targetPoint.y - p.y) * 0.16;
            p.z += (0 - p.z) * 0.16;
          }
        } else if (stageLocal === 6) {
          // Explode/Fly outward into background
          p.x += p.vx * 32;
          p.y += p.vy * 32;
          p.z += p.vz * 32;
        } else {
          // Drift default void
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
        }

        // 3. Mouse repulsion/pull
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dDist = Math.sqrt(dx * dx + dy * dy);
        if (dDist < 75) {
          const force = (75 - dDist) * 0.06;
          p.x += (dx / dDist) * force;
          p.y += (dy / dDist) * force;
        }

        // 4. Perspective Projection calculations
        const zoom = focalLength / (focalLength + p.z);
        const screenX = centerX + p.x * zoom;
        const screenY = centerY + p.y * zoom;

        // Capture coordinates for network lines in Stage 3
        if (stageLocal === 3 && idx % 2 === 0) {
          projectedPoints.push({ x: screenX, y: screenY, z: p.z });
        }

        // 5. Draw
        p.pulseVal += p.pulseSpeed;
        const alphaPulse = p.alpha + Math.sin(p.pulseVal) * 0.15;
        const finalAlpha = Math.max(0, Math.min(1, alphaPulse * (1 - p.z / (focalLength * 1.5))));

        if (p.char) {
          // Draw floating financial glyphs
          ctx.fillStyle = `rgba(34, 211, 238, ${finalAlpha})`;
          ctx.font = `bold ${Math.round(8 * zoom)}px sans-serif`;
          ctx.fillText(p.char, screenX, screenY);
        } else {
          // Draw standard glowing dot
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(0.2, p.size * zoom), 0, Math.PI * 2);
          // Highlight colors
          if (stageLocal === 5) {
            ctx.fillStyle = `rgba(56, 189, 248, ${finalAlpha})`; // Blue assembly glow
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
          }
          ctx.fill();
        }
      });

      // 6. Connect lines (Stage 3 Neural Network Plexus)
      if (stageLocal === 3 && projectedPoints.length > 0) {
        ctx.lineWidth = 0.55;
        for (let a = 0; a < projectedPoints.length; a++) {
          let count = 0;
          for (let b = a + 1; b < projectedPoints.length; b++) {
            if (count > 2) break; // Limit connection density for clean details
            const dx = projectedPoints[a].x - projectedPoints[b].x;
            const dy = projectedPoints[a].y - projectedPoints[b].y;
            const dSq = dx * dx + dy * dy;
            if (dSq < 2400) { // connection threshold
              count++;
              const lineAlpha = (1 - dSq / 2400) * 0.18;
              ctx.beginPath();
              ctx.moveTo(projectedPoints[a].x, projectedPoints[a].y);
              ctx.lineTo(projectedPoints[b].x, projectedPoints[b].y);
              // Electric blue connection pulses
              ctx.strokeStyle = `rgba(59, 130, 246, ${lineAlpha})`;
              ctx.stroke();
            }
          }
        }
      }

      // 7. Draw central sphere (Stage 2 AI Awakens core)
      if (stageLocal === 2 || stageLocal === 3) {
        ctx.beginPath();
        const coreRadius = stageLocal === 3 ? 12 : 8;
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        // Volumetric glow core
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 2);
        grad.addColorStop(0, "rgba(56, 189, 248, 1)"); // sky-blue
        grad.addColorStop(0.5, "rgba(30, 58, 138, 0.4)"); // deep blue
        grad.addColorStop(1, "rgba(30, 58, 138, 0)");
        ctx.fillStyle = grad;
        ctx.fill();

        // Expanding soft pulses
        const pulseRatio = (Date.now() % 1600) / 1600;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreRadius + pulseRatio * 60, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(103, 232, 249, ${0.4 * (1 - pulseRatio)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [stage]);

  // Framer Motion Layout Easing
  const blurTransition: any = {
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1]
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] bg-black select-none overflow-hidden flex flex-col items-center justify-center text-white"
    >
      {/* 3D Core Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Floating ambient fog overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none z-10" />

      {/* Subtle glowing moving orbs in background */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />

      {/* Interactive Sound Enabler overlay on first click (Bypass Autoplay policies) */}
      {!soundEnabled && (
        <div className="absolute bottom-6 left-6 z-50">
          <button
            onClick={initAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-[10px] text-slate-500 hover:text-slate-300 font-semibold tracking-wider uppercase transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Enable Audio Interface Cues
          </button>
        </div>
      )}

      {/* --- STAGE OVERLAY LAYERS --- */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-xl px-6">
        
        {/* Stage 2 Telemetry status lines */}
        {stage === 2 && (
          <div className="absolute top-12 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-mono text-cyan-400/80 tracking-[0.25em] uppercase">SYSTEM DISPATCHING...</span>
            <div className="h-6 flex items-center justify-center">
              <span className="text-xs font-mono text-slate-400 font-medium">
                {typedLog}
                <span className="w-1.5 h-3 ml-0.5 inline-block bg-cyan-400 animate-pulse" />
              </span>
            </div>
          </div>
        )}

        {/* Stage 3 Telemetry pulse status */}
        {stage === 3 && (
          <div className="absolute top-12 flex flex-col items-center gap-1.5 animate-pulse">
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.25em]">TELEMETRY SYNC</span>
            <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">ALL NODES RESOLVED — CONNECTED.</span>
          </div>
        )}

        {/* Stage 4 Blur-Morphing statements */}
        <AnimatePresence mode="wait">
          {stage === 4 && (
            <motion.div
              key={statementIndex}
              initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
              transition={blurTransition}
              className="absolute flex flex-col items-center"
            >
              {statementIndex === 0 && (
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">INTRODUCING CO-PILOT</span>
              )}
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white leading-relaxed max-w-md">
                {MORPH_STATEMENTS[statementIndex]}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 5 & 6 Logo assembling & signature morph */}
        <AnimatePresence>
          {(stage === 5 || stage === 6) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* Assembled central logo placeholder for stage 5 */}
              <motion.div
                layoutId="fincodyHeaderLogo"
                className="flex items-center gap-2"
                animate={stage === 6 ? {
                  scale: 0.35,
                  // Transition parameters calculated to line up with the navbar logo
                  x: -window.innerWidth / 2 + 100,
                  y: -window.innerHeight / 2 + 42,
                  opacity: 0
                } : {}}
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <div className="flex items-center text-4xl md:text-5xl font-black tracking-[0.05em] text-white">
                  <span>FINCO</span>
                  <span className="text-sky-400">D</span>
                  <span className="text-cyan-400 relative">
                    Y
                    <span className="absolute -top-3 -right-2 text-xs font-bold text-cyan-300 drop-shadow-[0_0_8px_#22D3EE]">$</span>
                  </span>
                </div>
              </motion.div>
              
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="text-[9px] font-mono text-cyan-300/60 uppercase tracking-[0.4em] mt-8"
              >
                Wealth Intelligence Booted
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen collapse flash overlay */}
      <AnimatePresence>
        {stage === 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
            className="absolute inset-0 bg-white pointer-events-none z-[9999]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
