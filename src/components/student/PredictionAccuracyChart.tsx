
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface PredictionAccuracyChartProps {
  data: {
    period: string;
    accuracy: number;
    error: number;
  }[];
}

export function PredictionAccuracyChart({ data }: PredictionAccuracyChartProps) {
  const [showChart, setShowChart] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChart(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const chartConfig = {
    accuracy: {
      label: "Prediction Accuracy",
      color: "#6E59A5"
    },
    error: {
      label: "Error Margin",
      color: "#F87171"
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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            name="Prediction Accuracy" 
            stroke="var(--color-accuracy, #6E59A5)" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="error" 
            name="Error Margin" 
            stroke="var(--color-error, #F87171)" 
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </motion.div>
  );
}
