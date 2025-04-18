
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/logo/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const verificationSuccess = searchParams.get("verified") === "true";
  
  // Show toast if user was redirected after email verification
  useEffect(() => {
    if (verificationSuccess) {
      toast.success("Email verified successfully! Please log in.");
    }
  }, [verificationSuccess]);

  // If user is already logged in, redirect to dashboard
  if (!isLoading && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="w-full max-w-5xl px-4 flex flex-col md:flex-row items-center gap-8">
        {/* Logo on the left - moved further left by adding negative margin */}
        <div className="w-full md:w-1/2 flex flex-col items-start pl-0 md:-ml-20 mb-8 md:mb-0">
          <Logo size={108} className="mb-4" />
          <p className="text-gray-200 text-xl">Analyze GitLab metrics to predict student success</p>
        </div>
        
        {/* Auth form on the right */}
        <div className="w-full md:w-1/2">
          <AuthForm defaultTab={defaultTab} />
        </div>
      </div>
    </div>
  );
}
