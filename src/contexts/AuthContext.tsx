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
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any; data?: any }>;
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
  }, [user]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          resetInactivityTimer();
          
          // Check if the user is verified before redirecting to dashboard
          if (session?.user?.email_confirmed_at) {
            navigate('/dashboard');
          } else {
            // If user is not verified, send to verification page
            navigate('/verification');
          }
        } else if (event === 'SIGNED_OUT') {
          if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            setInactivityTimer(null);
          }
          navigate('/');
        } else if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password?type=update');
        } else if (event === 'USER_UPDATED') {
          toast.success("Your account has been updated");
        }
        
        // Handle SIGNED_UP event separately with type assertion to avoid TypeScript error
        if (event as string === 'SIGNED_UP') {
          // Redirect to verification page instead of login
          navigate('/verification');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        resetInactivityTimer();
        
        // Check if user is verified on initial load
        if (!session.user.email_confirmed_at) {
          navigate('/verification');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      // First check if the email already exists by attempting a password reset
      // This is a client-safe way to check if an email exists without revealing too much information
      const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false // Don't create a new user, just check if email exists
        }
      });
      
      // If no error or specific error message about non-existent user, the email likely exists
      if (!signInError || !signInError.message.includes("Email not found")) {
        return { 
          error: { 
            message: "This email address is already registered. Please login instead." 
          } 
        };
      }
      
      // Fallback check for existing user with the same email in repositories table
      const { data: existingUsers, error: queryError } = await supabase
        .from('Repositoro')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();
      
      if (queryError) {
        console.error("Error checking for existing user:", queryError);
      }
      
      if (existingUsers) {
        return { 
          error: { 
            message: "An account with this email address already exists." 
          } 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          return { error: { message: "This email address is already registered. Please login instead." } };
        }
        return { error };
      }
      
      return { data, error: null };
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
      let baseUrl = window.location.origin;
      console.log("Reset password base URL:", baseUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/login`,
      });
      
      console.log("Reset password request sent, redirect URL:", `${baseUrl}/login`);
      
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
