
import React from "react";
import { LineChart } from "lucide-react";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 36, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-sm opacity-70 rounded-full"></div>
        <LineChart size={size} className="text-white relative z-10" strokeWidth={2.5} />
      </div>
      <div className="font-bold text-xl md:text-2xl tracking-tight text-white">
        Grade<span className="text-blue-400">Predictor</span>
      </div>
    </div>
  );
};
