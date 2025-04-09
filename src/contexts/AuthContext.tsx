
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

// Set the inactivity timeout to 5 minutes (in milliseconds)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Function to reset the inactivity timer
  const resetInactivityTimer = () => {
    // Clear any existing timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    // Only set a new timer if the user is signed in
    if (user) {
      // Set a new timer
      const newTimer = setTimeout(async () => {
        console.log("User inactive for 5 minutes, logging out");
        toast.info("You have been logged out due to inactivity");
        await signOut();
      }, INACTIVITY_TIMEOUT);
      
      setInactivityTimer(newTimer);
    }
  };

  // Set up event listeners to track user activity
  useEffect(() => {
    // Only add listeners if user is logged in
    if (user) {
      const activityEvents = ['mousedown', 'keydown', 'mousemove', 'wheel', 'touchstart', 'scroll'];
      
      // Handler for any user activity
      const handleUserActivity = () => {
        resetInactivityTimer();
      };

      // Add event listeners
      activityEvents.forEach(event => {
        window.addEventListener(event, handleUserActivity);
      });

      // Initialize the inactivity timer
      resetInactivityTimer();

      // Clean up event listeners when component unmounts
      return () => {
        activityEvents.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
        });
        
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
      };
    }
  }, [user]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          // Reset inactivity timer when signed in
          resetInactivityTimer();
          // Direct to dashboard instead of verification page
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          // Clear inactivity timer when signed out
          if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            setInactivityTimer(null);
          }
          navigate('/');
        } else if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password?type=update');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // If user is already logged in, set up the inactivity timer
      if (session?.user) {
        resetInactivityTimer();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { error };
    } catch (error) {
      console.error("Error during signup:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Error during signin:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during signout:", error);
      toast.error("Failed to sign out");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Get the current domain instead of hardcoding it
      let baseUrl = window.location.origin;
      console.log("Reset password base URL:", baseUrl);
      
      // Configure the reset password endpoint with the current site URL
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password?type=update`,
      });
      
      console.log("Reset password request sent, redirect URL:", `${baseUrl}/reset-password?type=update`);
      
      return { error };
    } catch (error) {
      console.error("Error during password reset:", error);
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      return { error };
    } catch (error) {
      console.error("Error during password update:", error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
