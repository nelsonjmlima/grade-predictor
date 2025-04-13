
import { supabase } from "@/integrations/supabase/client";

interface SignUpMetadata {
  [key: string]: any;
}

export async function signUp(email: string, password: string, metadata: SignUpMetadata) {
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
    
    // Fallback check for existing user with the same email in Repositorio table
    // Fix the type inference issue by using explicit typing
    interface RepositorioRow {
      id: number;
      email?: string;
    }
    
    const { data: existingUsers, error: queryError } = await supabase
      .from('Repositorio')
      .select('id, email')
      .eq('email', email)
      .maybeSingle<RepositorioRow>();
    
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
}

export async function signIn(email: string, password: string) {
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
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
    return { error: null };
  } catch (error) {
    console.error("Error during signout:", error);
    return { error };
  }
}

export async function resetPassword(email: string) {
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
}

export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    return { error };
  } catch (error) {
    console.error("Error during password update:", error);
    return { error };
  }
}
