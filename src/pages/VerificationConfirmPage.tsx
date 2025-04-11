
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function VerificationConfirmPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Check if we have a type=signup in the URL which indicates email verification
        const type = searchParams.get('type');
        
        if (type === 'signup') {
          // Email has been verified at this point by Supabase
          // Check if we're in a session
          const { data } = await supabase.auth.getSession();
          
          // The user is automatically logged in after verification, but we'll
          // force them to log in manually for security
          if (data?.session) {
            // Sign out the user to force a manual login
            await supabase.auth.signOut();
            setVerified(true);
          } else {
            setVerified(true);
          }
        } else {
          // Not coming from a verification link
          navigate('/login');
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("There was a problem verifying your email. Please try logging in.");
      } finally {
        setVerifying(false);
      }
    };

    verifySession();
  }, [navigate, searchParams]);

  const handleContinue = () => {
    navigate("/login");
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
            {verifying ? (
              <div className="h-8 w-8 rounded-full border-4 border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            ) : verified ? (
              <CheckCircle2 className="h-8 w-8 text-blue-400 animate-scale-in" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-400 animate-scale-in" />
            )}
          </div>
          <CardTitle className="text-2xl font-semibold text-white">
            {verifying 
              ? "Verifying Email" 
              : verified 
                ? "Email Verified!" 
                : "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            {verifying 
              ? "Please wait while we confirm your email verification" 
              : verified 
                ? "Your email has been successfully verified"
                : "There was a problem verifying your email"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!verifying && verified && (
            <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-200 p-4 rounded-md">
              <CheckCircle2 className="h-5 w-5" />
              <span>Your account has been verified. Please proceed to login.</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white h-14 text-lg" 
            onClick={handleContinue} 
            disabled={verifying}
          >
            Continue to Login
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
