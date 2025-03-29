
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending reset password email
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      toast.success("Password reset link sent to your email");
    }, 1000);
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
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Reset Password</h1>
          <p className="text-gray-200 mt-2">Enter your email to receive a password reset link</p>
        </div>
        
        <Card className="w-full max-w-md mx-auto overflow-hidden animate-scale-in bg-black/40 backdrop-blur-xl border border-white/10 text-white">
          {!emailSent ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-white">Reset your password</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-8">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-200 text-lg">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="m.scott@example.com" 
                      required 
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white h-14 text-lg mt-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : (
                      <>
                        Send Reset Link <Mail className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-white">Check your email</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  We've sent a password reset link to your email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center px-8">
                <div className="py-4">
                  <Mail className="mx-auto h-12 w-12 text-blue-400" />
                  <p className="mt-4 text-sm text-gray-300">
                    Check your inbox for the password reset link. It might take a few minutes to arrive.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => navigate("/")}
                >
                  Back to Login
                </Button>
              </CardContent>
            </>
          )}
          <CardFooter className="flex justify-center py-4 text-xs text-gray-300 px-8">
            Remember your password? <Button variant="link" className="px-2 text-xs text-blue-300 hover:text-blue-200" onClick={() => navigate("/")}>Sign in</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
