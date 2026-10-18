"use client";

import { useEffect, useState } from "react";

export function istTime(date = new Date()) {
  return date.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false });
}

// Current IST time as HH:MM:SS, ticking every second. Empty string until mounted
// so server and client markup match.
export function useIstClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(istTime());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
