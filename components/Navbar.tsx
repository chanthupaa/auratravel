"use client";

import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 2.5rem; height: 64px; background: rgba(10, 10, 10, 0.55); backdrop-filter: blur(25px) saturate(180%); -webkit-backdrop-filter: blur(25px) saturate(180%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); transition: background 0.4s ease; }
        .navbar.scrolled { background: rgba(5, 5, 5, 0.75); }
        .navbar-logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; cursor: pointer; }
        .logo-text { font-family: 'DM Sans', 'Helvetica Neue', sans-serif; font-size: 1.05rem; font-weight: 500; color: #f0f0f0; letter-spacing: 0.01em; }
        .navbar-links { display: flex; align-items: center; gap: 2.5rem; list-style: none; margin: 0; padding: 0; }
        .navbar-links li a { font-family: 'DM Sans', 'Helvetica Neue', sans-serif; font-size: 0.9rem; font-weight: 400; color: rgba(255,255,255,0.7); text-decoration: none; letter-spacing: 0.01em; transition: color 0.2s ease; position: relative; padding-bottom: 4px; }
        .navbar-links li a:hover { color: rgba(255,255,255,1); }
        .navbar-links li a.active { color: #ffffff; }
        .navbar-links li a.active::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 1px; background: rgba(255,255,255,0.7); }
        .navbar-signin { font-family: 'DM Sans', 'Helvetica Neue', sans-serif; font-size: 0.9rem; font-weight: 400; color: rgba(255,255,255,0.65); cursor: pointer; text-decoration: none; transition: color 0.2s ease; letter-spacing: 0.01em; }
        .navbar-signin:hover { color: #fff; }
      `}</style>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-logo">
          <div style={{ width: 28, height: 28 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L5 10.5V22H11V16H17V22H23V10.5L14 3Z" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 14L14 8L19 14" stroke="rgba(120,200,255,0.8)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">AuraTravel</span>
        </div>
        <ul className="navbar-links">
          <li><a href="#" className="active">Destinations</a></li>
          <li><a href="#">Experiences</a></li>
          <li><a href="#">About</a></li>
        </ul>
        <a href="#" className="navbar-signin">Sign In</a>
      </nav>
    </>
  );
}
