"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

const GlobeScene = dynamic(() => import("@/components/GlobeScene"), { ssr: false });

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@300;400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000000; font-family: 'DM Sans', 'Helvetica Neue', sans-serif; color: #ffffff; overflow-x: hidden; min-height: 100vh; }
        .page-root { width: 100%; min-height: 100vh; background: #000000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .hero-card { position: relative; width: 100%; max-width: 1200px; min-height: 680px; border-radius: 20px; background: rgba(14, 14, 16, 0.70); backdrop-filter: blur(25px) saturate(160%); -webkit-backdrop-filter: blur(25px) saturate(160%); border: 1px solid rgba(255, 255, 255, 0.10); box-shadow: 0 0 0 0.5px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.85), 0 0 60px rgba(60, 130, 255, 0.06); overflow: hidden; display: flex; flex-direction: column; padding-top: 64px; opacity: 0; transform: translateY(18px); transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1); }
        .hero-card.visible { opacity: 1; transform: translateY(0); }
        .hero-card::before { content: ''; position: absolute; top: 0; right: 0; width: 280px; height: 280px; background: radial-gradient(ellipse at top right, rgba(180,200,255,0.06) 0%, transparent 65%); pointer-events: none; border-radius: 0 20px 0 0; }
        .hero-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 320px; height: 220px; background: radial-gradient(ellipse at bottom left, rgba(60,100,255,0.05) 0%, transparent 65%); pointer-events: none; border-radius: 0 0 0 20px; }
        .hero-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 0 2rem 2.5rem; gap: 0; }
        .globe-col { position: relative; width: 100%; aspect-ratio: 1; max-height: 580px; opacity: 0; transform: translateX(-20px); transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s; }
        .hero-card.visible .globe-col { opacity: 1; transform: translateX(0); }
        .copy-col { padding-left: 2.5rem; display: flex; flex-direction: column; gap: 1.4rem; opacity: 0; transform: translateX(20px); transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s; }
        .hero-card.visible .copy-col { opacity: 1; transform: translateX(0); }
        .hero-headline { font-family: 'Sora', 'DM Sans', sans-serif; font-size: clamp(2.4rem, 4.2vw, 4rem); font-weight: 600; line-height: 1.12; letter-spacing: -0.02em; color: #ffffff; }
        .hero-sub { font-family: 'DM Sans', sans-serif; font-size: clamp(0.9rem, 1.2vw, 1.05rem); font-weight: 300; line-height: 1.65; color: rgba(255, 255, 255, 0.58); max-width: 320px; }
        .cta-wrap { position: relative; display: inline-block; width: fit-content; margin-top: 0.3rem; }
        .cta-pulse { position: absolute; inset: -4px; border-radius: 50px; border: 1px solid rgba(120, 180, 255, 0.35); animation: ctaPulse 2.4s ease-in-out infinite; pointer-events: none; }
        .cta-pulse-2 { position: absolute; inset: -8px; border-radius: 54px; border: 1px solid rgba(120, 180, 255, 0.15); animation: ctaPulse 2.4s ease-in-out 0.5s infinite; pointer-events: none; }
        @keyframes ctaPulse { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 0.25; transform: scale(1.04); } }
        .cta-btn { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 2rem; border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.22); background: rgba(30, 32, 40, 0.75); backdrop-filter: blur(12px); color: rgba(255, 255, 255, 0.92); font-family: 'DM Sans', sans-serif; font-size: 0.92rem; font-weight: 500; letter-spacing: 0.02em; cursor: pointer; text-decoration: none; transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
        .cta-btn:hover { background: rgba(50, 55, 72, 0.85); border-color: rgba(255, 255, 255, 0.38); box-shadow: 0 6px 32px rgba(60,120,255,0.18), 0 4px 16px rgba(0,0,0,0.5); transform: translateY(-1px); }
        @media (max-width: 768px) { .page-root { padding: 1rem 0.75rem; align-items: flex-start; padding-top: 5rem; } .hero-body { grid-template-columns: 1fr; padding: 1rem 1.5rem 2rem; gap: 1rem; } .globe-col { max-height: 340px; aspect-ratio: 1; margin: 0 auto; } .copy-col { padding-left: 0; align-items: center; text-align: center; } .hero-sub { max-width: 100%; } .hero-card { min-height: unset; } }
      `}</style>
      <div className="page-root">
        <div ref={heroRef} className={`hero-card ${mounted ? "visible" : ""}`}>
          <Navbar />
          <div className="hero-body">
            <div className="globe-col"><GlobeScene /></div>
            <div className="copy-col">
              <h1 className="hero-headline">Discover Your<br />World, Redefined</h1>
              <p className="hero-sub">Exclusive journeys. Immersive travel.<br />A new era of luxury.</p>
              <div className="cta-wrap">
                <div className="cta-pulse" />
                <div className="cta-pulse-2" />
                <a href="#" className="cta-btn">Explore Now
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.7 }}>
                    <path d="M2.5 7H11.5M7.5 3.5L11.5 7L7.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
