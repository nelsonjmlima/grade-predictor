
import { useEffect, useRef } from "react";

type UseInactivityLogoutProps = {
  isActive: boolean;
  onInactive: () => void;
  timeout?: number;
};

const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutes - increased from 5 minutes

export function useInactivityLogout({
  isActive,
  onInactive,
  timeout = DEFAULT_TIMEOUT,
}: UseInactivityLogoutProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    const activityEvents = [
      "mousedown",
      "keydown",
      "mousemove",
      "wheel",
      "touchstart",
      "scroll",
    ];

    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onInactive, timeout);
    };

    // Handle visibility change to properly handle tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // If coming back to tab, check if we've been inactive too long
        const timeInactive = Date.now() - lastActivityRef.current;
        if (timeInactive < timeout) {
          // If not timed out yet, just reset the timer
          resetTimer();
        }
      }
    };

    // Set up listeners and timer
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initialize timer
    resetTimer();

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Only recreate if isActive, onInactive, or timeout changes
  }, [isActive, onInactive, timeout]);
}
