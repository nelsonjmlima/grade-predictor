
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthError } from "@supabase/supabase-js";

interface SignUpResponse {
  user?: User | null;
  session?: Session | null;
}

type SignUpFn = (
  email: string,
  password: string,
  metadata: Record<string, unknown>
) => Promise<{ error: AuthError | null; data?: SignUpResponse }>;

type SignInFn = (
  email: string,
  password: string
) => Promise<{ error: AuthError | null }>;

type SignOutFn = () => Promise<void>;

type ResetPasswordFn = (
  email: string
) => Promise<{ error: AuthError | null }>;

type UpdatePasswordFn = (
  password: string
) => Promise<{ error: AuthError | null }>;

export const signUp: SignUpFn = async (email, password, metadata) => {
  try {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

    if (!signInError || !signInError.message.includes("Email not found")) {
      return {
        error: {
          message:
            "This email address is already registered. Please login instead.",
          name: "AuthError",
          status: 400,
        } as AuthError,
      };
    }

    // Use a more explicit type for the query
    const { data: existingUsers } = await supabase
      .from("Repositorio")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (existingUsers) {
      return {
        error: {
          message: "An account with this email address already exists.",
          name: "AuthError",
          status: 400,
        } as AuthError,
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
        return {
          error: {
            message:
              "This email address is already registered. Please login instead.",
            name: "AuthError",
            status: 400,
          } as AuthError,
        };
      }
      return { error };
    }

    return { data, error: null };
  } catch (error: unknown) {
    return { error: error as AuthError };
  }
};

export const signIn: SignInFn = async (email, password) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  } catch (error: unknown) {
    return { error: error as AuthError };
  }
};

export const signOut: SignOutFn = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error: unknown) {
    throw error;
  }
};

export const resetPassword: ResetPasswordFn = async (email) => {
  try {
    let baseUrl = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/login`,
    });
    return { error };
  } catch (error: unknown) {
    return { error: error as AuthError };
  }
};

export const updatePassword: UpdatePasswordFn = async (password) => {
  try {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  } catch (error: unknown) {
    return { error: error as AuthError };
  }
};
