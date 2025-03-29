
import React from "react";
import { Logo } from "@/components/logo/Logo";

const LogoPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="animate-scale-in">
        <Logo size={180} className="mx-auto" />
      </div>
    </div>
  );
};

export default LogoPage;
