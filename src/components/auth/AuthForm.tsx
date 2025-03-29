
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
    <Card className="w-full mx-auto overflow-hidden animate-scale-in bg-black/40 backdrop-blur-xl border border-white/10 text-white scale-125">
      <Tabs defaultValue="login" className="w-full">
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
            <CardTitle className="text-3xl font-medium text-white">Welcome back</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-200 text-lg">Password</Label>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="px-0 text-sm text-blue-300 hover:text-blue-200" 
                    onClick={() => navigate("/reset-password")}
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-white/10 border-white/20 text-white h-12 text-lg"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white h-14 text-lg mt-2" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : (
                  <>
                    Sign In <LogIn className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-6 px-8">
            <p className="text-md text-gray-300 text-center w-full">
              Need an account? Click the Sign Up tab above.
            </p>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="signup">
          <CardHeader>
            <CardTitle className="text-3xl font-medium text-white">Create an account</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-gray-200 text-lg">First name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Michael" 
                    required 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-gray-200 text-lg">Last name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Scott" 
                    required 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="idNumber" className="text-gray-200 text-lg">Number</Label>
                <Input 
                  id="idNumber" 
                  placeholder="S12345" 
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="institution" className="text-gray-200 text-lg">Institution</Label>
                <Input 
                  id="institution" 
                  placeholder="University name" 
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
                />
              </div>
              
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
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-200 text-lg">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-white/10 border-white/20 text-white h-12 text-lg"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-gray-200 text-lg">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  required 
                  className="bg-white/10 border-white/20 text-white h-12 text-lg"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full group bg-blue-600/80 hover:bg-blue-700/90 text-white h-14 text-lg mt-2" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : (
                  <>
                    Create Account <UserPlus className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-6 px-8">
            <p className="text-md text-gray-300 text-center w-full">
              Already have an account? Click the Login tab above.
            </p>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
