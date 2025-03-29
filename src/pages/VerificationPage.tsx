
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function VerificationPage() {
  const navigate = useNavigate();
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    // Simulate verification process
    const verificationTimer = setTimeout(() => {
      setVerificationComplete(true);
      toast.success("User data successfully verified!");
    }, 2000);

    return () => clearTimeout(verificationTimer);
  }, []);

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
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center">
            <ShieldCheck 
              className={`h-8 w-8 ${verificationComplete ? 'text-primary animate-scale-in' : 'text-muted-foreground'}`} 
            />
          </div>
          <CardTitle className="text-2xl font-semibold">
            {verificationComplete ? "Verification Complete" : "Verifying User Data"}
          </CardTitle>
          <CardDescription>
            {verificationComplete 
              ? "Your account has been successfully verified" 
              : "Please wait while we verify your account information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              {!verificationComplete ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-[pulse_2s_ease-in-out_infinite]" style={{ width: "60%" }}></div>
                  </div>
                  <p className="text-sm text-muted-foreground">Verifying credentials...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 bg-green-50 text-green-700 p-3 rounded-md">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Identity confirmed</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-50 text-green-700 p-3 rounded-md">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Account status active</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-50 text-green-700 p-3 rounded-md">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Access permissions granted</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full group" 
            onClick={handleContinue} 
            disabled={!verificationComplete}
          >
            Continue to Dashboard 
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
