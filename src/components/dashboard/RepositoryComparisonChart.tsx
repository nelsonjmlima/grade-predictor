
import { useState, useEffect } from "react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Loader2 } from "lucide-react";

interface Repository {
  id: number;
  name: string;
}

interface RepositoryComparisonChartProps {
  selectedRepos: number[];
  repositories: Repository[];
  selectedMetric: string;
  viewType: string;
}

// Sample data for each repository and metric
const generateRepositoryData = (repos: Repository[], metric: string) => {
  // Time points for x-axis
  const timePoints = ["Week 1", "Week 3", "Week 6", "Week 9", "Week 12", "Week 15"];
  
  // Generate random data for each repository
  return timePoints.map(timePoint => {
    const data: any = { name: timePoint };
    repos.forEach(repo => {
      // Generate a random value between 30-100, with some consistency based on repo ID
      const baseValue = 30 + (repo.id * 5) % 20;
      const randomValue = baseValue + Math.floor(Math.random() * 50);
      data[repo.name] = randomValue;
    });
    return data;
  });
};

// Define colors for the repositories
const colors = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
];

export function RepositoryComparisonChart({ 
  selectedRepos,
  repositories,
  selectedMetric,
  viewType 
}: RepositoryComparisonChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected repositories filtered from all repositories
  const filteredRepositories = repositories.filter(repo => 
    selectedRepos.includes(repo.id)
  );

  useEffect(() => {
    // Simulate loading data from an API
    setLoading(true);
    
    const timer = setTimeout(() => {
      const newData = generateRepositoryData(filteredRepositories, selectedMetric);
      setData(newData);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [selectedRepos, selectedMetric, filteredRepositories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        {viewType === "line" ? (
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {filteredRepositories.map((repo, index) => (
                <linearGradient key={repo.id} id={`color-${repo.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis 
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, "Score"]}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            
            {filteredRepositories.map((repo, index) => (
              <Area
                key={repo.id}
                type="monotone"
                dataKey={repo.name}
                stroke={colors[index % colors.length]}
                fillOpacity={1}
                fill={`url(#color-${repo.id})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis 
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, "Score"]}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            
            {filteredRepositories.map((repo, index) => (
              <Bar
                key={repo.id}
                dataKey={repo.name}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
