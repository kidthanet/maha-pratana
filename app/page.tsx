"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRitualState } from '../hooks/useRitualState';
import IncenseBurner from '../components/IncenseBurner';

/**
 * DEITY_DATA: ข้อมูลสิ่งศักดิ์สิทธิ์และไฟล์เสียง
 * - รูปภาพ (.png) วางใน public/images/
 * - เสียงบทสวด (.mp3) วางใน public/sounds/
 */
const DEITY_DATA = [
  { id: "buddha", label: "พระพุทธรูปทองคำ", url: "/images/buddha_gold.png", audio: "/sounds/buddha.mp3" },
  { id: "ganesha", label: "พระพิฆเนศ", url: "/images/ganesha.png", audio: "/sounds/ganesha.mp3" },
  { id: "lucksamee", label: "พระแม่ลักษมี", url: "/images/lucksamee.png", audio: "/sounds/lucksamee.mp3" },
  { id: "chaishen", label: "เทพเจ้าไฉ่ซิงเอี้ย", url: "/images/chaishen.png", audio: "/sounds/chaishen.mp3" },
];

export default function VirtualAltarPage() {
  const { timeLeft, startRitual, isActive, isInitialLoad } = useRitualState(1140);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prayer, setPrayer] = useState("");
  const [isMuted, setIsMuted] = useState(false); // สถานะปิดเสียง
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- ระบบควบคุมเสียงบทสวด ---
  useEffect(() => {
    if (isActive) {
      if (audioRef.current) audioRef.current.pause();
      
      audioRef.current = new Audio(DEITY_DATA[selectedIndex].audio);
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : 0.6;
      
      audioRef.current.play().catch(err => console.log("Audio play blocked", err));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isActive, selectedIndex]);

  // จัดการการ Toggle Mute ทันทีขณะเสียงเล่นอยู่
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.6;
    }
  }, [isMuted]);

  if (isInitialLoad) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col items-center overflow-x-hidden selection:bg-amber-500/30">
      
      {/* --- MUTE BUTTON (Floating Right) --- */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-amber-500/50 hover:text-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-sm"
          title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          )}
        </button>
      </div>

      {/* --- HEADER & SLOGAN --- */}
      <header className="w-full max-w-2xl text-center pt-10 px-4 z-30">
        <h1 className="text-3xl font-normal tracking-[0.3em] text-amber-500 mb-2 drop-shadow-[0_2px_15px_rgba(245,158,11,0.4)]">
          มหาปรารถนา
        </h1>
        <p className="text-[11px] tracking-[0.2em] text-amber-700/80 mb-8 uppercase">
          สงบนิ่งที่ใจ ปรากฏผลที่ความจริง
        </p>
        
        {/* เมนูเลือกสิ่งศักดิ์สิทธิ์ */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {DEITY_DATA.map((item, index) => (
            <button
              key={item.id}
              disabled={isActive}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 py-1.5 rounded-full text-[11px] tracking-widest transition-all duration-300 border ${
                selectedIndex === index 
                  ? 'border-amber-500 bg-amber-500/15 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                  : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {item.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </header>

      {/* --- MAIN STAGE --- */}
      <main className="relative flex flex-col items-center justify-center flex-grow w-full max-w-4xl py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.15)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="relative z-10 mb-6 transition-all duration-700 transform hover:scale-[1.02]">
          <div className="absolute inset-0 bg-amber-500/10 blur-[80px] rounded-full" />
          <img 
            src={DEITY_DATA[selectedIndex].url} 
            alt={DEITY_DATA[selectedIndex].label}
            className="w-72 md:w-80 h-auto drop-shadow-[0_0_45px_rgba(245,158,11,0.35)] transition-all duration-500"
            onError={(e) => {
               e.currentTarget.src = "https://via.placeholder.com/500x600/1a1a1a/f59e0b?text=" + DEITY_DATA[selectedIndex].id;
            }}
          />
        </div>
        
        <div className="z-10 mb-10 text-center">
          <h2 className="text-sm tracking-[0.4em] text-amber-500/80 font-light uppercase border-b border-amber-900/40 pb-2 inline-block">
            {DEITY_DATA[selectedIndex].label}
          </h2>
        </div>

        <div className="z-20 relative scale-110 md:scale-125">
          <IncenseBurner 
            isActive={isActive} 
            timeLeft={timeLeft} 
            onStart={startRitual} 
          />
        </div>
      </main>

      {/* --- PRAYER & BRANDING --- */}
      <footer className="w-full max-w-md pb-12 px-8 z-30 flex flex-col items-center">
        {!isActive ? (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-1000">
            <textarea
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              placeholder="ตั้งจิตอธิษฐาน แล้วพิมพ์ขอพร..."
              className="w-full bg-black/60 border border-amber-900/40 rounded-2xl p-5 text-center text-amber-200 focus:outline-none focus:border-amber-500/60 transition-all placeholder:text-gray-700 resize-none text-sm font-light shadow-inner"
              rows={2}
            />
          </div>
        ) : (
          <div className="text-center space-y-4 animate-pulse">
            <p className="text-amber-200/50 text-[11px] tracking-[0.5em] uppercase">
              จิตนิ่งเป็นสมาธิ.. ขอพรสัมฤทธิ์ผล
            </p>
            {prayer && (
              <div className="max-w-xs p-4 border-l border-r border-amber-900/20">
                <p className="text-gray-400 italic text-sm leading-relaxed font-light text-center">
                  " {prayer} "
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-16 flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity duration-700 cursor-default">
          <span className="text-[12px] tracking-[0.3em] font-medium text-amber-500">
            Developed by เอ๋ ชี้ชะตาจร
          </span>
          <span className="text-[8px] tracking-[0.15em] text-gray-500 uppercase">
            EXPERT TAROT & APPLICATION DEVELOPER
          </span>
        </div>
      </footer>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_100%,rgba(20,15,5,1)_0%,rgba(0,0,0,1)_100%)] -z-10" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] -z-5" />
    </div>
  );
}