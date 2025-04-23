
import { useEffect, useRef } from "react";

type UseInactivityLogoutProps = {
  isActive: boolean;
  onInactive: () => void;
  timeout?: number;
};

const DEFAULT_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function useInactivityLogout({
  isActive,
  onInactive,
  timeout = DEFAULT_TIMEOUT,
}: UseInactivityLogoutProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onInactive, timeout);
    };

    // Set up listeners and timer
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );
    resetTimer();

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Only recreate if isActive, onInactive, or timeout changes
  }, [isActive, onInactive, timeout]);
}
