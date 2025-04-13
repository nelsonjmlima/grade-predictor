
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
    console.log("Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log("User signed in:", session?.user?.email);
          resetInactivityTimer();
          
          // Check if the user is verified before redirecting to dashboard
          if (session?.user?.email_confirmed_at) {
            console.log("User verified, redirecting to dashboard");
            navigate('/dashboard');
          } else {
            // If user is not verified, send to verification page
            console.log("User not verified, redirecting to verification page");
            navigate('/verification');
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            setInactivityTimer(null);
          }
          navigate('/');
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log("Password recovery initiated");
          navigate('/reset-password?type=update');
        } else if (event === 'USER_UPDATED') {
          console.log("User account updated");
          toast.success("Your account has been updated");
        }
        
        // Handle SIGNED_UP event separately with type assertion to avoid TypeScript error
        if (event as string === 'SIGNED_UP') {
          console.log("User signed up, redirecting to verification");
          // Redirect to verification page instead of login
          navigate('/verification');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session");
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        resetInactivityTimer();
        
        // Check if user is verified on initial load
        if (!session.user.email_confirmed_at) {
          console.log("User not verified on initial load, redirecting to verification");
          navigate('/verification');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      console.log("Attempting to sign up user:", email);
      
      // First check if the email already exists by attempting a password reset
      // This is a client-safe way to check if an email exists without revealing too much information
      const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false // Don't create a new user, just check if email exists
        }
      });
      
      console.log("OTP check result:", !signInError ? "Email exists" : "Email doesn't exist");
      
      // If no error or specific error message about non-existent user, the email likely exists
      if (!signInError || !signInError.message.includes("Email not found")) {
        console.log("Email already registered:", email);
        return { 
          error: { 
            message: "This email address is already registered. Please login instead." 
          } 
        };
      }
      
      // Fallback check for existing user with the same email in repositories table
      // Fix the case of the table name to match Supabase's case sensitivity
      const { data: existingUsers, error: queryError } = await supabase
        .from('Repositorio')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();
      
      if (queryError) {
        console.error("Error checking for existing user:", queryError);
      }
      
      if (existingUsers) {
        console.log("User with this email already exists in database:", email);
        return { 
          error: { 
            message: "An account with this email address already exists." 
          } 
        };
      }

      console.log("Creating new user account for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });

      if (error) {
        console.error("Signup error:", error.message);
        if (error.message.includes("already registered")) {
          return { error: { message: "This email address is already registered. Please login instead." } };
        }
        return { error };
      }
      
      console.log("Signup successful, verification email should be sent now");
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in user:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
      } else {
        console.log("Sign in successful for:", email);
      }
      
      return { error };
    } catch (error) {
      console.error("Error during signin:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error during signout:", error);
      toast.error("Failed to sign out");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      let baseUrl = window.location.origin;
      console.log("Sending password reset email to:", email);
      console.log("Reset password base URL:", baseUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/login`,
      });
      
      if (error) {
        console.error("Password reset error:", error.message);
      } else {
        console.log("Password reset email sent successfully to:", email);
      }
      
      return { error };
    } catch (error) {
      console.error("Error during password reset:", error);
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      console.log("Updating user password");
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        console.error("Password update error:", error.message);
      } else {
        console.log("Password updated successfully");
      }
      
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
