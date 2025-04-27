
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { signUp, signIn, signOut, resetPassword, updatePassword } from "@/services/authService";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata: Record<string, unknown>
  ) => Promise<{ error: AuthError | null; data?: { user?: User | null; session?: Session | null } }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to watch auth changes and route accordingly on sign in/out events only
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      setSession(newSession);
      setUser(newSession?.user ?? null);

      // Only redirect on specific auth events, not every state check
      if (event === "SIGNED_IN") {
        if (newSession?.user?.email_confirmed_at) {
          navigate("/dashboard");
        } else {
          navigate("/verification");
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/");
      } else if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password?type=update");
      } else if (event === "USER_UPDATED") {
        toast.success("Your account has been updated");
      }
    });

    // Initial session check - only redirect if not already on an appropriate page
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
      setInitialCheckDone(true);

      // Only redirect on initial load if we're on an inappropriate page
      if (initialSession?.user) {
        if (!initialSession.user.email_confirmed_at && 
            location.pathname !== "/verification" && 
            !location.pathname.startsWith("/reset-password")) {
          navigate("/verification");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // Inactivity logout
  useInactivityLogout({
    isActive: !!user,
    onInactive: useCallback(async () => {
      toast.info("You have been logged out due to inactivity");
      await signOut();
    }, []),
  });

  const value: AuthContextType = {
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
