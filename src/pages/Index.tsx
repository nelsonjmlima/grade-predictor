
import React from "react";
import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen w-full flex items-center bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="animate-scale-in text-left mb-10 md:mb-0">
          <Logo size={180} className="mb-4" />
          <p className="text-sm md:text-base text-gray-200 mb-8">
            Analyze GitLab metrics to predict students grades
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/")} 
            className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 rounded-md text-lg"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate("/")} 
            className="bg-blue-600/80 hover:bg-blue-700/90 text-white py-6 px-8 rounded-md text-lg"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
