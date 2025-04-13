
import { supabase } from "@/integrations/supabase/client";

export const sendMagicLink = async (email: string) => {
  try {
    console.log(`Attempting to send magic link to: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // You can customize email options here
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) {
      console.error('Magic Link Send Error:', error);
      throw error;
    }

    console.log('Magic link sent successfully', data);
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in magic link:', error);
    return { data: null, error };
  }
};
