
import React from "react";
import { Logo } from "@/components/logo/Logo";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900">
      <div className="animate-fade-in text-center">
        <Logo size={120} className="mx-auto" />
      </div>
    </div>
  );
};

export default Index;
