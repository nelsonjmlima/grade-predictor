
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface GradeComparisonChartProps {
  data: {
    category: string;
    studentScore: number;
    averageScore: number;
    topScore: number;
  }[];
}

export function GradeComparisonChart({ data }: GradeComparisonChartProps) {
  const [showChart, setShowChart] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChart(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const chartConfig = {
    studentScore: {
      label: "This Student",
      color: "#6E59A5"
    },
    averageScore: {
      label: "Class Average",
      color: "#94A3B8"
    },
    topScore: {
      label: "Top Students",
      color: "#0EA5E9"
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showChart ? 1 : 0 }}
      transition={{ duration: 0.7 }}
      className="w-full h-full"
    >
      <ChartContainer config={chartConfig} className="h-full">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar 
            dataKey="studentScore"
            name="This Student" 
            fill="var(--color-studentScore, #6E59A5)" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="averageScore" 
            name="Class Average" 
            fill="var(--color-averageScore, #94A3B8)"
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="topScore" 
            name="Top Students" 
            fill="var(--color-topScore, #0EA5E9)"
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ChartContainer>
    </motion.div>
  );
}
