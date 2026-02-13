"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook สำหรับจัดการสถานะการจุดธูป/ทำพิธีกรรม
 * @param durationInSeconds ระยะเวลาที่ต้องการให้ธูปไหม้ (หน่วยเป็นวินาที)
 */
export const useRitualState = (durationInSeconds: number) => {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 1. ดึงข้อมูลจาก LocalStorage เมื่อ Component Mount (Client-side เท่านั้น)
  useEffect(() => {
    const savedEndTime = localStorage.getItem('altar_incense_end_time');
    if (savedEndTime) {
      const endTimestamp = parseInt(savedEndTime, 10);
      const now = Date.now();
      
      // ตรวจสอบว่าเวลายังไม่หมดใช่ไหม
      if (endTimestamp > now) {
        setEndTime(endTimestamp);
      } else {
        localStorage.removeItem('altar_incense_end_time');
      }
    }
    setIsInitialLoad(false);
  }, []);

  // 2. ฟังก์ชันเริ่มจุดธูป (Start Ritual)
  const startRitual = useCallback(() => {
    const newEndTime = Date.now() + durationInSeconds * 1000;
    setEndTime(newEndTime);
    localStorage.setItem('altar_incense_end_time', newEndTime.toString());
  }, [durationInSeconds]);

  // 3. ฟังก์ชันหยุด/ยกเลิก (Reset Ritual)
  const resetRitual = useCallback(() => {
    setEndTime(null);
    setTimeLeft(0);
    localStorage.removeItem('altar_incense_end_time');
  }, []);

  // 4. Logic การนับถอยหลัง (Tick)
  useEffect(() => {
    if (!endTime) return;

    // อัปเดตเวลาทันทีที่เริ่ม
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      
      setTimeLeft(remaining);

      if (remaining <= 0) {
        resetRitual();
      }
    };

    updateTimer(); // รันครั้งแรกทันที
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [endTime, resetRitual]);

  return {
    timeLeft,          // จำนวนวินาทีที่เหลือ
    startRitual,       // ฟังก์ชันกดจุดธูป
    resetRitual,       // ฟังก์ชันดับธูป
    isActive: timeLeft > 0, // สถานะว่ากำลังจุดธูปอยู่หรือไม่
    isInitialLoad      // ใช้สำหรับเช็คว่าโหลดข้อมูลจาก LocalStorage เสร็จหรือยัง (ป้องกัน UI กระพริบ)
  };
};