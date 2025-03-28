
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function AuthForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Successfully logged in");
      navigate("/verification");
    }, 1000);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully");
      navigate("/verification");
    }, 1000);
  };

  return (
    <Card className="w-full mx-auto overflow-hidden animate-scale-in bg-black/40 backdrop-blur-xl border border-white/10 text-white">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 text-gray-200">
          <TabsTrigger value="login" className="data-[state=active]:bg-blue-600/70 data-[state=active]:text-white">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600/70 data-[state=active]:text-white">
            Sign Up
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader>
            <CardTitle className="text-2xl font-medium text-white">Welcome back</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m.scott@example.com" 
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="px-0 text-xs text-blue-300 hover:text-blue-200" 
                    onClick={() => navigate("/reset-password")}
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : (
                  <>
                    Sign In <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-4 px-6">
            <p className="text-sm text-gray-300 text-center w-full">
              Need an account? Click the Sign Up tab above.
            </p>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="signup">
          <CardHeader>
            <CardTitle className="text-2xl font-medium text-white">Create an account</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-200">First name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Michael" 
                    required 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-200">Last name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Scott" 
                    required 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idNumber" className="text-gray-200">Number</Label>
                <Input 
                  id="idNumber" 
                  placeholder="S12345" 
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-gray-200">Institution</Label>
                <Input 
                  id="institution" 
                  placeholder="University name" 
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m.scott@example.com" 
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  required 
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : (
                  <>
                    Create Account <UserPlus className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-4 px-6">
            <p className="text-sm text-gray-300 text-center w-full">
              Already have an account? Click the Login tab above.
            </p>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
