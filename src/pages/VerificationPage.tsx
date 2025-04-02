
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
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

  // Perform actual verification checks
  useEffect(() => {
    const performVerification = async () => {
      if (!user) {
        // Handle case where there's no user
        toast.error("No user found. Please log in again.");
        navigate("/");
        return;
      }

      try {
        // Step 1: Check if user identity is confirmed (email verification)
        // For this demo, we'll simulate checking email confirmation
        setVerificationSteps(prev => ({ ...prev, identity: true }));
        
        // Step 2: Check if user account is active in our database
        // Here we're checking if the user exists in Supabase
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw new Error(userError.message);
        }
        
        if (userData && userData.user) {
          setVerificationSteps(prev => ({ ...prev, account: true }));
        }
        
        // Step 3: Check if user has the necessary permissions
        // In a real app, you might check roles or permissions
        // For demo purposes, we'll simulate this
        setTimeout(() => {
          setVerificationSteps(prev => ({ ...prev, permissions: true }));
          setVerificationComplete(true);
          toast.success("User verification complete successful!");
        }, 1000);
        
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("An error occurred during verification. Please try again.");
      }
    };

    performVerification();
  }, [user, navigate]);

  const handleContinue = () => {
    navigate("/dashboard");
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
            <ShieldCheck 
              className={`h-8 w-8 ${verificationComplete ? 'text-blue-400 animate-scale-in' : 'text-gray-400'}`} 
            />
          </div>
          <CardTitle className="text-2xl font-semibold text-white">
            {verificationComplete ? "Verification Complete" : "Verifying User Data"}
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            {verificationComplete 
              ? `Welcome ${user?.email || 'User'}!` 
              : "Please wait while we verify your account information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              {!verificationComplete ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-[pulse_2s_ease-in-out_infinite]" 
                         style={{ width: `${Object.values(verificationSteps).filter(Boolean).length / 3 * 100}%` }}>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">Verifying credentials...</p>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-200 p-4 rounded-md">
                  <ShieldCheck className="h-5 w-5" />
                  <span>User verification complete successful</span>
                </div>
              )}
            </div>
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
