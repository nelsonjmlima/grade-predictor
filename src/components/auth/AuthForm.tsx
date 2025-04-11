
import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form schema for login
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  })
});

// Form schema for signup - removed idNumber field
const signupSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required"
  }),
  lastName: z.string().min(1, {
    message: "Last name is required"
  }),
  institution: z.string().min(1, {
    message: "Institution is required"
  }),
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters and include a number and special character"
  }).regex(/.*[0-9].*/, {
    message: "Password must include at least one number"
  }).regex(/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/, {
    message: "Password must include at least one special character"
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
interface AuthFormProps {
  defaultTab?: string;
}
export function AuthForm({
  defaultTab = "login"
}: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const {
    signIn,
    signUp
  } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Signup form - removed idNumber from defaultValues
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      institution: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    const {
      error
    } = await signIn(data.email, data.password);
    setIsLoading(false);
    if (error) {
      toast.error(error.message || "Failed to sign in");
    } else {
      toast.success("Successfully logged in");
    }
  };
  
  const handleSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    setSignupError(null); // Reset any previous errors
    
    const metadata = {
      first_name: data.firstName,
      last_name: data.lastName,
      institution: data.institution
    };
    
    const { error, data: signUpData } = await signUp(data.email, data.password, metadata);
    
    setIsLoading(false);
    
    if (error) {
      // Display specific error messages for common issues
      if (error.message.includes("already registered") || error.message.includes("already exists")) {
        setSignupError("An account with this email address already exists. Please use a different email or try logging in instead.");
        toast.error("Email address already registered");
      } else {
        setSignupError(error.message || "Failed to create account");
        toast.error(error.message || "Failed to create account");
      }
    } else {
      // Check if email confirmation is required
      if (signUpData?.user && !signUpData.user.confirmed_at) {
        setVerificationSent(true);
        toast.success("Account created! Please check your email to verify your account.", {
          duration: 6000
        });
      } else {
        toast.success("Account created successfully!");
      }
      
      // Reset form after successful signup
      signupForm.reset();
    }
  };
  
  return <Card className="w-full mx-auto overflow-hidden animate-scale-in bg-black/40 backdrop-blur-xl border border-white/10 text-white scale-100">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 text-gray-200">
          <TabsTrigger value="login" className="data-[state=active]:bg-blue-600/70 data-[state=active]:text-white text-lg py-3">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600/70 data-[state=active]:text-white text-lg py-3">
            Sign Up
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader>
            <CardTitle className="text-3xl font-medium text-white text-center">Welcome</CardTitle>
            <CardDescription className="text-gray-300 text-lg text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                <FormField control={loginForm.control} name="email" render={({
                field
              }) => <FormItem className="space-y-3">
                      <FormLabel className="text-gray-200 text-lg">Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="m.scott@example.com" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <FormField control={loginForm.control} name="password" render={({
                field
              }) => <FormItem className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-gray-200 text-lg">Password</FormLabel>
                        <Button type="button" variant="link" className="px-0 text-sm text-blue-300 hover:text-blue-200" onClick={() => window.location.href = "/reset-password"}>
                          Forgot password?
                        </Button>
                      </div>
                      <FormControl>
                        <Input {...field} type="password" className="bg-white/10 border-white/20 text-white h-12 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <Button type="submit" className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white h-14 text-lg mt-2" disabled={isLoading}>
                  {isLoading ? "Signing in..." : <>
                      Sign In <LogIn className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="pb-6 px-8">
            <p className="text-md text-gray-300 text-center w-full">
              Need an account? Click the Sign Up tab above.
            </p>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="signup">
          <CardHeader className="py-4">
            <CardTitle className="text-2xl font-medium text-white text-center">Create an account</CardTitle>
            <CardDescription className="text-gray-300 text-base text-center">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            {verificationSent ? (
              <div className="text-center space-y-4 py-6">
                <div className="text-2xl font-medium text-green-400">Verification Email Sent!</div>
                <p className="text-gray-300">
                  Please check your email inbox and click the verification link to activate your account.
                </p>
                <p className="text-gray-400 text-sm">
                  If you don't see the email, check your spam folder. The verification link will expire in 24 hours.
                </p>
                <Button
                  type="button"
                  className="mt-4 bg-blue-600/80 hover:bg-blue-700/90 text-white"
                  onClick={() => setVerificationSent(false)}
                >
                  Back to Sign Up
                </Button>
              </div>
            ) : (
              <Form {...signupForm}>
                {signupError && (
                  <Alert className="mb-4 bg-red-500/20 border border-red-400/40 text-white">
                    <AlertDescription className="text-sm">
                      {signupError}
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={signupForm.control} name="firstName" render={({
                    field
                  }) => <FormItem className="space-y-2">
                          <FormLabel className="text-gray-200 text-base">First name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Michael" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={signupForm.control} name="lastName" render={({
                    field
                  }) => <FormItem className="space-y-2">
                          <FormLabel className="text-gray-200 text-base">Last name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Scott" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                  
                  <FormField control={signupForm.control} name="institution" render={({
                  field
                }) => <FormItem className="space-y-2">
                        <FormLabel className="text-gray-200 text-base">Institution</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="University name" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={signupForm.control} name="email" render={({
                  field
                }) => <FormItem className="space-y-2">
                        <FormLabel className="text-gray-200 text-base">Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="m.scott@example.com" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={signupForm.control} name="password" render={({
                  field
                }) => <FormItem className="space-y-2">
                        <FormLabel className="text-gray-200 text-base">Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" showPasswordToggle className="bg-white/10 border-white/20 text-white h-10 text-base" />
                        </FormControl>
                        <p className="text-xs text-gray-400 mt-0.5 text-center">
                          Password must be at least 8 characters and include a number and special character
                        </p>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={signupForm.control} name="confirmPassword" render={({
                  field
                }) => <FormItem className="space-y-2">
                        <FormLabel className="text-gray-200 text-base">Confirm Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" showPasswordToggle className="bg-white/10 border-white/20 text-white h-10 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <Button type="submit" className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white h-12 text-base mt-1" disabled={isLoading}>
                    {isLoading ? "Creating account..." : <>
                        Create Account <UserPlus className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="pb-4 pt-2 px-6">
            <p className="text-sm text-gray-300 text-center w-full">
              Already have an account? Click the Login tab above.
            </p>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>;
}
