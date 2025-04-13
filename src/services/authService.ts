
import { supabase } from "@/integrations/supabase/client";

export const sendMagicLink = async (email: string) => {
  try {
    console.log(`Attempting to send magic link to: ${email}`);
    const startTime = Date.now();
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // You can customize email options here
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (error) {
      console.error('Magic Link Send Error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        details: error.details,
        responseTime: `${responseTime}ms`
      });
      throw error;
    }

    console.log('Magic link request successful', {
      email,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      redirectTo: `${window.location.origin}/login`
    });
    
    // Note: Supabase doesn't provide immediate confirmation of email delivery
    // The email is queued for delivery after this API call succeeds
    console.log('Email delivery status: QUEUED. Check Supabase authentication logs for delivery status.');
    
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in magic link:', error);
    return { data: null, error };
  }
};

// Function to verify status of an email (useful for debugging)
export const checkEmailStatus = async (email: string) => {
  try {
    console.log(`Checking user status for email: ${email}`);
    
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error checking email status:', error);
      return { exists: false, verified: false, error };
    }
    
    // Find the user with the matching email
    const user = data.users.find(u => u.email === email);
    
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return { exists: false, verified: false, error: null };
    }
    
    console.log(`User found with email: ${email}`);
    console.log(`Email verified: ${!!user.email_confirmed_at}`);
    console.log(`Last sign in: ${user.last_sign_in_at}`);
    
    return { 
      exists: true, 
      verified: !!user.email_confirmed_at, 
      lastSignIn: user.last_sign_in_at,
      error: null 
    };
  } catch (error) {
    console.error('Error in checkEmailStatus:', error);
    return { exists: false, verified: false, error };
  }
};
