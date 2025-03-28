
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/50">
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground mt-2">Enter your email to receive a password reset link</p>
        </div>
        
        <Card className="w-full max-w-md mx-auto overflow-hidden animate-scale-in glassmorphism">
          {!emailSent ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-medium">Reset your password</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m.scott@example.com" required />
                  </div>
                  <Button type="submit" className="w-full group" disabled={isLoading}>
                    {isLoading ? "Sending..." : (
                      <>
                        Send Reset Link <Mail className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-medium">Check your email</CardTitle>
                <CardDescription>
                  We've sent a password reset link to your email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="py-4">
                  <Mail className="mx-auto h-12 w-12 text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Check your inbox for the password reset link. It might take a few minutes to arrive.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Back to Login
                </Button>
              </CardContent>
            </>
          )}
          <CardFooter className="flex justify-center py-4 text-xs text-muted-foreground">
            Remember your password? <Button variant="link" className="px-2 text-xs" onClick={() => navigate("/")}>Sign in</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
