
import { useEffect, useState } from "react";

interface ContributionTimelineProps {
  contributions: {
    date: string;
    count: number;
  }[];
}

export function ContributionTimeline({ contributions }: ContributionTimelineProps) {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Calculate color intensity based on count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted';
    const maxCount = Math.max(...contributions.map(c => c.count));
    const intensity = Math.min(0.2 + (count / maxCount) * 0.8, 1);
    
    return `bg-primary/[${intensity}]`;
  };

  // Group by weeks (7 days per row)
  const weeks = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="flex justify-between mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-xs text-muted-foreground w-8 text-center">
              {day}
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`w-8 h-8 rounded-sm flex-1 flex items-center justify-center transition-all duration-500 ${
                    getColor(day.count)
                  } ${loaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: `${(weekIndex * 7 + dayIndex) * 10}ms` }}
                  title={`${day.date}: ${day.count} contributions`}
                >
                  <span className={`text-xs ${day.count > 0 ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                    {day.count > 0 ? day.count : ''}
                  </span>
                </div>
              ))}
              
              {/* Fill in missing days for the last row */}
              {week.length < 7 && Array(7 - week.length).fill(0).map((_, index) => (
                <div key={`empty-${index}`} className="w-8 h-8 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
