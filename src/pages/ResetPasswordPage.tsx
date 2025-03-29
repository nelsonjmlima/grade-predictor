
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, KeyRound, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

// Form schema for email request
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Form schema for password update
const passwordSchema = z.object({
  password: z.string().min(8, { 
    message: "Password must be at least 8 characters" 
  })
  .regex(/.*[0-9].*/, { message: "Password must include at least one number" })
  .regex(/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/, { message: "Password must include at least one special character" }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  
  // Determine if we're in update password mode based on URL params or hash
  const searchParams = new URLSearchParams(location.search);
  const isUpdateMode = searchParams.get('type') === 'update';
  
  // Check for Supabase auth hash in URL
  useEffect(() => {
    const handleHashChange = async () => {
      // Get the full URL including the hash
      const fullUrl = window.location.href;
      const hash = window.location.hash;
      
      console.log("Checking URL for recovery token:", fullUrl);
      
      if (hash && hash.includes('access_token') && hash.includes('type=recovery')) {
        console.log("Hash detected in URL, setting update mode");
        
        try {
          // Process the recovery token
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            console.log("Found access token in URL, setting it in the session");
            
            // Set the session with the access token from the URL
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: '', // We don't have a refresh token from the URL
            });
            
            if (error) {
              console.error("Error processing recovery token:", error);
              toast.error("Invalid or expired recovery link. Please try again.");
              navigate('/reset-password');
            } else {
              console.log("Successfully set session with recovery token");
              // Redirect to the update password page without the hash
              navigate('/reset-password?type=update', { replace: true });
            }
          }
        } catch (error) {
          console.error("Error processing recovery token:", error);
          toast.error("Failed to process recovery link. Please try again.");
        }
      }
    };
    
    handleHashChange();
  }, [navigate]);
  
  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (data: EmailFormValues) => {
    setIsLoading(true);
    
    const { error } = await resetPassword(data.email);
    
    setIsLoading(false);
    
    if (error) {
      toast.error(error.message || "Failed to send reset email");
    } else {
      setEmailSent(true);
      toast.success("Password reset link sent to your email");
    }
  };

  const handleUpdatePassword = async (data: PasswordFormValues) => {
    setIsLoading(true);
    
    const { error } = await updatePassword(data.password);
    
    setIsLoading(false);
    
    if (error) {
      toast.error(error.message || "Failed to update password");
    } else {
      setPasswordUpdated(true);
      toast.success("Password updated successfully");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
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
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {isUpdateMode ? "Set New Password" : "Reset Password"}
          </h1>
          <p className="text-gray-200 mt-2">
            {isUpdateMode 
              ? "Enter your new password below" 
              : "Enter your email to receive a password reset link"}
          </p>
        </div>
        
        <Card className="w-full max-w-md mx-auto overflow-hidden animate-scale-in bg-black/40 backdrop-blur-xl border border-white/10 text-white">
          {isUpdateMode ? (
            // Update Password Form
            <>
              {!passwordUpdated ? (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl font-medium text-white">Create new password</CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      Enter and confirm your new password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-8">
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(handleUpdatePassword)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-gray-200 text-lg">New Password</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="password" 
                                  showPasswordToggle
                                  className="bg-white/10 border-white/20 text-white h-12 text-lg"
                                  placeholder="••••••••"
                                />
                              </FormControl>
                              <p className="text-sm text-gray-400 mt-1">
                                Password must be at least 8 characters and include a number and special character
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-gray-200 text-lg">Confirm Password</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="password" 
                                  showPasswordToggle
                                  className="bg-white/10 border-white/20 text-white h-12 text-lg"
                                  placeholder="••••••••"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white h-14 text-lg mt-2" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Updating..." : (
                            <>
                              Update Password <KeyRound className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </>
              ) : (
                // Password Updated Successfully
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl font-medium text-white">Password Updated</CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      Your password has been updated successfully
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center px-8 py-8">
                    <div className="bg-green-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-10 w-10 text-green-400" />
                    </div>
                    <p className="text-gray-200">
                      You will be redirected to the login page in a few seconds
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 mt-4"
                      onClick={() => navigate("/")}
                    >
                      Go to Login <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </>
              )}
            </>
          ) : (
            // Request Password Reset Email Form
            <>
              {!emailSent ? (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl font-medium text-white">Reset your password</CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      Enter your email address and we'll send you a link to reset your password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-8">
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(handleResetPassword)} className="space-y-4">
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-gray-200 text-lg">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="email" 
                                  placeholder="m.scott@example.com" 
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                    </Form>
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
