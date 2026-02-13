"use client";

import React from 'react';
import Lottie from "lottie-react";
// ตรวจสอบให้มั่นใจว่าไฟล์ JSON อยู่ที่ public/animations/smoke.json
import smokeAnimation from "../public/animations/smoke.json";

interface IncenseBurnerProps {
  isActive: boolean;
  timeLeft: number;
  onStart: () => void;
}

export default function IncenseBurner({ isActive, timeLeft, onStart }: IncenseBurnerProps) {
  
  // ฟังก์ชันแปลงวินาทีเป็นรูปแบบ นาที:วินาที
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* ส่วนประกอบของหิ้งและกระถางธูป */}
      <div className="relative h-64 w-64 flex flex-col items-center justify-end">
        
        {/* 1. ควันธูป: ปรับตำแหน่ง x (ขยับขวา) และ y (สูง-ต่ำ) ให้เป๊ะที่สุด */}
        {isActive && (
          <div className="absolute bottom-[118px] w-28 h-48 pointer-events-none z-0 opacity-40 translate-x-6">
            <Lottie 
              animationData={smokeAnimation} 
              loop={true} 
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}

        {/* 2. ก้านธูป 3 ดอก: จัดให้อยู่กึ่งกลางพอดี */}
        <div className="flex gap-2 mb-[-12px] z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative w-[3px] h-28 bg-[#5c3a38] rounded-t-full shadow-sm">
              {/* จุดอาคม (ไฟที่ปลายธูป) */}
              {isActive && (
                <div className="absolute top-0 w-full h-[4px] bg-orange-400 shadow-[0_0_12px_#fb923c] animate-pulse rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* 3. กระถางธูป (Incense Bowl) */}
        <div className="relative z-20">
          <div className="w-28 h-16 bg-gradient-to-b from-[#926844] via-[#784a2b] to-[#4a2c2a] rounded-b-[40px] border-t-[3px] border-[#b08968] shadow-[0_12px_24px_rgba(0,0,0,0.6)] flex items-center justify-center">
             {/* สัญลักษณ์โอม */}
             <div className="w-9 h-9 rounded-full border border-amber-500/10 bg-black/5 flex items-center justify-center shadow-inner">
              <span className="text-amber-500/30 text-xs select-none">ॐ</span>
            </div>
          </div>
          {/* ขากระถางทรงกลม */}
          <div className="flex justify-around px-5 mt-[-2px]">
            <div className="w-2.5 h-2.5 bg-[#2d1614] rounded-full shadow-md" />
            <div className="w-2.5 h-2.5 bg-[#2d1614] rounded-full shadow-md" />
          </div>
        </div>
      </div>

      {/* 4. หน้าจอแสดงเวลา (Timer Display) */}
      <div className="mt-10 text-center min-h-[120px]">
        {isActive ? (
          <div className="animate-in fade-in zoom-in-95 duration-1000">
            <div className="text-amber-500 font-mono text-4xl font-bold tracking-[0.2em] drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              {formatTime(timeLeft)}
            </div>
            <p className="text-gray-500 text-[10px] mt-3 uppercase tracking-[0.3em] font-light italic">
              — กำลังอยู่ในสมาธิ —
            </p>
          </div>
        ) : (
          <button
            onClick={onStart}
            className="group relative px-10 py-3.5 overflow-hidden rounded-full bg-transparent border border-amber-800/50 text-amber-600 transition-all duration-500 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(180,130,50,0.2)]"
          >
            <span className="relative z-10 tracking-[0.3em] font-light text-sm group-hover:text-amber-200 transition-colors">
              จุดธูปอธิษฐาน
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-transparent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        )}
      </div>
    </div>
  );
}