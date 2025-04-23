
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Effect to watch auth changes and route accordingly
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN") {
        if (session?.user?.email_confirmed_at) {
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user && !session.user.email_confirmed_at) {
        navigate("/verification");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
