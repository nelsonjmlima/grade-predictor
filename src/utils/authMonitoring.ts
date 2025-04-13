
import { supabase } from "@/integrations/supabase/client";

// This utility helps monitor and track auth events across the application
export const trackAuthEvent = async (
  eventType: string,
  details: Record<string, any> = {}
) => {
  const timestamp = new Date().toISOString();
  
  // Log to console for development debugging
  console.log(`[AUTH EVENT] ${eventType} at ${timestamp}`, details);
  
  // In production, you might want to log this to your analytics system
  // For debugging emails specifically
  if (eventType.includes('email') || eventType.includes('verification')) {
    console.log(`📧 EMAIL EVENT: ${eventType}`, {
      ...details,
      timestamp,
      origin: window.location.origin
    });
  }
  
  // You could also track important events in your database for analytics
  try {
    // This is a placeholder for actual tracking code
    // You would need a table to store these events
    // await supabase.from('auth_events').insert({
    //   event_type: eventType,
    //   details: details,
    //   timestamp: timestamp,
    //   user_id: details.userId || null
    // });
  } catch (error) {
    console.error('Failed to record auth event:', error);
  }
};

// Helper to inspect session details (useful for debugging)
export const inspectSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    if (!data.session) {
      console.log('No active session found');
      return null;
    }
    
    // Log important session details
    console.log('Current session:', {
      userId: data.session.user?.id,
      email: data.session.user?.email,
      emailVerified: !!data.session.user?.email_confirmed_at,
      authProvider: data.session.user?.app_metadata?.provider || 'email',
      sessionExpires: new Date(data.session.expires_at! * 1000).toISOString(),
      // Don't log actual tokens in production
      hasAccessToken: !!data.session.access_token,
      hasRefreshToken: !!data.session.refresh_token
    });
    
    return data.session;
  } catch (error) {
    console.error('Error inspecting session:', error);
    return null;
  }
};
