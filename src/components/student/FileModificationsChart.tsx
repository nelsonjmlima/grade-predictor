
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface FileModificationsChartProps {
  fileChanges: {
    type: string;
    count: number;
    color: string;
  }[];
}

export function FileModificationsChart({ fileChanges }: FileModificationsChartProps) {
  const total = fileChanges.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          File Modifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {fileChanges.map((item, index) => {
              let currentAngle = 0;
              fileChanges.slice(0, index).forEach(prevItem => {
                currentAngle += (prevItem.count / total) * 360;
              });
              
              const angle = (item.count / total) * 360;
              const startX = 50 + 40 * Math.cos(((currentAngle - 90) * Math.PI) / 180);
              const startY = 50 + 40 * Math.sin(((currentAngle - 90) * Math.PI) / 180);
              const endX = 50 + 40 * Math.cos(((currentAngle + angle - 90) * Math.PI) / 180);
              const endY = 50 + 40 * Math.sin(((currentAngle + angle - 90) * Math.PI) / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                  fill={item.color}
                  className="transition-all duration-500 hover:opacity-90 hover:transform hover:scale-105"
                  style={{ transformOrigin: 'center', transform: `scale(${1 + index * 0.03})` }}
                />
              );
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground">Total Files</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {fileChanges.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm">
                {item.type}: <span className="font-medium">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
