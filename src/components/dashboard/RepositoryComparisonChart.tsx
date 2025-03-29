
import { useState, useEffect } from "react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Loader2 } from "lucide-react";
import { Repository } from "@/services/repositoryData";

interface RepositoryComparisonChartProps {
  selectedRepos: string[];
  repositories: Repository[];
  selectedMetric: string;
  viewType: string;
  timePeriod: string;
}

// Define colors for the repositories
const colors = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
];

// Generate time points based on the selected time period
const generateTimePoints = (timePeriod: string) => {
  switch (timePeriod) {
    case "week":
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    case "month":
      return ["Week 1", "Week 2", "Week 3", "Week 4"];
    case "semester":
    default:
      return ["Week 1", "Week 3", "Week 6", "Week 9", "Week 12", "Week 15"];
  }
};

// Generate metric data based on the selected metric
const generateMetricData = (repo: Repository, metric: string) => {
  // Base value is determined by the repository's metrics
  let baseValue = 40;
  
  switch (metric) {
    case "commit_frequency":
      baseValue = 30 + (repo.commitCount / 10);
      break;
    case "code_quality":
      baseValue = 40 + (repo.progress / 5);
      break;
    case "test_coverage":
      baseValue = 20 + (repo.progress / 4);
      break;
    case "completion_rate":
      baseValue = repo.progress;
      break;
    case "collaboration":
      baseValue = 30 + (repo.mergeRequestCount * 2);
      break;
    default:
      baseValue = 40 + (repo.progress / 3);
  }
  
  // Cap the value at 100
  return Math.min(baseValue, 100);
};

// Generate repository data for chart
const generateRepositoryData = (repos: Repository[], metric: string, timePeriod: string) => {
  // Time points for x-axis
  const timePoints = generateTimePoints(timePeriod);
  
  // Generate data for each repository
  return timePoints.map((timePoint, index) => {
    const data: any = { name: timePoint };
    repos.forEach(repo => {
      // Base value from repo metrics
      const baseValue = generateMetricData(repo, metric);
      
      // Add some variance based on the time point (index)
      const variance = Math.sin(index * 0.5) * 10; // Sine wave pattern
      const finalValue = Math.round(Math.max(0, Math.min(100, baseValue + variance)));
      
      data[repo.name] = finalValue;
    });
    return data;
  });
};

export function RepositoryComparisonChart({ 
  selectedRepos,
  repositories,
  selectedMetric,
  viewType,
  timePeriod
}: RepositoryComparisonChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter repositories based on selected IDs
  const filteredRepositories = repositories.filter(repo => 
    selectedRepos.includes(repo.id || "")
  );

  useEffect(() => {
    // Simulate loading data from an API
    setLoading(true);
    
    const timer = setTimeout(() => {
      const newData = generateRepositoryData(filteredRepositories, selectedMetric, timePeriod);
      setData(newData);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [selectedRepos, selectedMetric, filteredRepositories, timePeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get metric label for tooltip
  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "commit_frequency": return "Commit Frequency";
      case "code_quality": return "Code Quality";
      case "test_coverage": return "Test Coverage";
      case "completion_rate": return "Completion Rate";
      case "collaboration": return "Collaboration";
      default: return "Score";
    }
  };

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
              formatter={(value) => [`${value}%`, getMetricLabel()]}
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
              formatter={(value) => [`${value}%`, getMetricLabel()]}
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
