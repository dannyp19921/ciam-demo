// frontend/src/hooks/useCountdown.js
// Custom hook for countdown timer functionality
// Used in StepUpModal for OTP expiration

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for countdown timer
 * @param {number} initialSeconds - Starting countdown value
 * @param {boolean} autoStart - Whether to start automatically
 * @returns {Object} - Timer state and controls
 */
export function useCountdown(initialSeconds = 30, autoStart = false) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  // Countdown effect
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, secondsLeft]);

  /**
   * Start the countdown
   */
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  /**
   * Stop the countdown
   */
  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  /**
   * Reset the countdown to initial value
   * @param {number} newSeconds - Optional new starting value
   */
  const reset = useCallback((newSeconds = initialSeconds) => {
    setSecondsLeft(newSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  /**
   * Restart the countdown from initial value
   */
  const restart = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const isExpired = secondsLeft <= 0;

  return {
    secondsLeft,
    isRunning,
    isExpired,
    start,
    stop,
    reset,
    restart,
  };
}
