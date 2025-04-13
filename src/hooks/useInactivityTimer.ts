
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

// Set the inactivity timeout to 5 minutes (in milliseconds)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

export function useInactivityTimer(user: User | null, signOut: () => Promise<void>) {
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  
  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    if (user) {
      const newTimer = setTimeout(async () => {
        console.log("User inactive for 5 minutes, logging out");
        toast.info("You have been logged out due to inactivity");
        await signOut();
      }, INACTIVITY_TIMEOUT);
      
      setInactivityTimer(newTimer);
    }
  };

  useEffect(() => {
    if (user) {
      const activityEvents = ['mousedown', 'keydown', 'mousemove', 'wheel', 'touchstart', 'scroll'];
      
      const handleUserActivity = () => {
        resetInactivityTimer();
      };

      activityEvents.forEach(event => {
        window.addEventListener(event, handleUserActivity);
      });

      resetInactivityTimer();

      return () => {
        activityEvents.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
        });
        
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
      };
    }
  }, [user, inactivityTimer, signOut]);

  return { resetInactivityTimer };
}
