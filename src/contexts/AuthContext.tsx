
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import * as authService from "@/services/authService";

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
  const navigate = useNavigate();
  
  // Implementation of sign out that can be passed to the inactivity timer
  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Error during signout:", error);
      toast.error("Failed to sign out");
    }
  };
  
  // Use our custom hook for inactivity timer
  const { resetInactivityTimer } = useInactivityTimer(user, handleSignOut);

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
  }, [navigate, resetInactivityTimer]);

  // Wrap the auth service methods to maintain the same interface
  const signUp = async (email: string, password: string, metadata: any) => {
    return authService.signUp(email, password, metadata);
  };

  const signIn = async (email: string, password: string) => {
    return authService.signIn(email, password);
  };

  const signOut = async () => {
    await handleSignOut();
  };

  const resetPassword = async (email: string) => {
    return authService.resetPassword(email);
  };

  const updatePassword = async (password: string) => {
    return authService.updatePassword(password);
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
