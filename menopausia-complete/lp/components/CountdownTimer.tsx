import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(15 * 60);

  useEffect(() => {
    // Check for existing start time
    const storedStartTime = localStorage.getItem('menopause_offer_timer_start');
    const DURATION = 15 * 60 * 1000; // 15 minutes in ms

    let startTime: number;

    if (storedStartTime) {
      startTime = parseInt(storedStartTime, 10);
    } else {
      startTime = Date.now();
      localStorage.setItem('menopause_offer_timer_start', startTime.toString());
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, Math.ceil((DURATION - elapsed) / 1000));

      setSeconds(remaining);

      if (remaining <= 0) {
        // Optional: clear interval or handle expiration behaviour
        // clearInterval(interval); 
      }
    }, 1000);

    // Initial calculation
    const now = Date.now();
    const elapsed = now - startTime;
    setSeconds(Math.max(0, Math.ceil((DURATION - elapsed) / 1000)));

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gold-500 text-center py-2 px-4 shadow-md">
      <span className="text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>¡Oferta especial! Esta promoción expira en:</span>
        <span className="font-mono bg-white text-gold-600 px-2 py-0.5 rounded-md">{display}</span>
      </span>
    </div>
  );
};

export default CountdownTimer;
