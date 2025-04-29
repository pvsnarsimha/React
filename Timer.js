import React, { useEffect, useRef } from 'react';

function Timer({ timeLeft, setTimeLeft, stopTimer, resetTimer }) {
  const timerRef = useRef(null);

  useEffect(() => {
    // Reset the timer if resetTimer is true
    if (resetTimer) {
      setTimeLeft(600); // Reset to 10 minutes (600 seconds)
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Start or restart the timer if not stopped and timeLeft > 0
    if (!stopTimer && timeLeft > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Stop the timer if stopTimer is true or timeLeft is 0
    if ((stopTimer || timeLeft <= 0) && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resetTimer, stopTimer, timeLeft, setTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 60; // Less than 1 minute

  return (
    <div
      className={`font-bold px-3 py-1 rounded-full ${
        isLowTime ? 'bg-red-600 text-white animate-pulse' : 'bg-red-100 text-red-600'
      }`}
    >
      Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}

export default Timer;