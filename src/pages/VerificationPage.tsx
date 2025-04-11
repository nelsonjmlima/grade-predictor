
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function VerificationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState({
    identity: false,
    account: false,
    permissions: false
  });
  const [emailResent, setEmailResent] = useState(false);

  // Perform actual verification checks
  useEffect(() => {
    const performVerification = async () => {
      if (!user) {
        // If there's no user, don't redirect immediately
        // This allows users to see the verification page even if they're not signed in
        return;
      }

      try {
        // Check if user email is confirmed
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw new Error(userError.message);
        }
        
        if (userData && userData.user) {
          setVerificationSteps(prev => ({ ...prev, identity: true, account: true }));
          
          // If the email is confirmed, mark verification as complete
          if (userData.user.email_confirmed_at) {
            setVerificationSteps(prev => ({ ...prev, permissions: true }));
            setVerificationComplete(true);
          }
        }
        
      } catch (error) {
        console.error("Verification error:", error);
      }
    };

    performVerification();
  }, [user, navigate]);

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      setEmailResent(true);
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <Card className="w-full max-w-md animate-scale-in bg-black/40 backdrop-blur-xl border border-white/10 text-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-blue-600/30 p-4 w-16 h-16 flex items-center justify-center">
            {verificationComplete ? (
              <ShieldCheck className="h-8 w-8 text-blue-400 animate-scale-in" />
            ) : (
              <Mail className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-semibold text-white">
            {verificationComplete ? "Verification Complete" : "Email Verification Required"}
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            {verificationComplete 
              ? `Welcome ${user?.email || 'User'}!` 
              : "Please verify your email to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!verificationComplete ? (
              <div className="space-y-4">
                <p className="text-gray-300">
                  We've sent a verification link to <span className="font-medium text-white">{user?.email || 'your email'}</span>.
                  Please check your inbox and click the verification link to activate your account.
                </p>
                
                {emailResent ? (
                  <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-200 p-4 rounded-md">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Verification email has been resent!</span>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-blue-600/50 hover:bg-blue-700/60 text-white" 
                    onClick={handleResendEmail}
                  >
                    Resend verification email
                  </Button>
                )}
                
                <div className="text-sm text-gray-400 mt-2">
                  <p>Didn't receive an email? Check your spam folder or click the button above to resend.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-200 p-4 rounded-md">
                <ShieldCheck className="h-5 w-5" />
                <span>User verification completed successfully</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white h-14 text-lg" 
            onClick={handleContinue} 
            disabled={!verificationComplete}
          >
            Continue to Dashboard 
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
