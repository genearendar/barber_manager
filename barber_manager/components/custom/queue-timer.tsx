"use client";
import { useState, useEffect } from "react";

export default function QueueTimer() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 text-2xl font-mono font-bold">
        <span>{formatTime(currentTime)}</span>
      </div>{" "}
      <div className="flex items-center text-green-600 text-md justify-end">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
        Live
      </div>
    </div>
  );
}
