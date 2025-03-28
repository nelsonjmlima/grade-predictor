
import { useState } from "react";
import { BarChart, LineChart, ChevronDown, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const metricGroups = [
  {
    name: "Commits",
    items: [
      { id: "commit_count", label: "Contagem de Commits", active: true },
      { id: "commit_frequency", label: "Frequência de Commits", active: false },
      { id: "commit_message_quality", label: "Qualidade das Mensagens de Commit", active: false },
    ],
  },
  {
    name: "Qualidade de Código",
    items: [
      { id: "code_quality_score", label: "Pontuação de Qualidade de Código", active: true },
      { id: "test_coverage", label: "Cobertura de Testes", active: false },
      { id: "bug_count", label: "Contagem de Bugs", active: false },
    ],
  },
  {
    name: "Colaboração",
    items: [
      { id: "merge_requests", label: "Solicitações de Merge", active: true },
      { id: "code_review_participation", label: "Participação em Revisões de Código", active: false },
      { id: "issue_participation", label: "Participação em Issues", active: false },
    ],
  },
];

export function MetricsPanel() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("last_30_days");
  const [selectedChartType, setSelectedChartType] = useState("bar");
  const [metrics, setMetrics] = useState(metricGroups);

  const toggleMetric = (groupIndex: number, itemIndex: number) => {
    const newMetrics = [...metrics];
    newMetrics[groupIndex].items[itemIndex].active = !newMetrics[groupIndex].items[itemIndex].active;
    setMetrics(newMetrics);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Métricas de Desempenho</CardTitle>
            <CardDescription>Selecione métricas para incluir na análise</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                <SelectItem value="last_90_days">Últimos 90 dias</SelectItem>
                <SelectItem value="full_semester">Semestre Completo</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {selectedChartType === "bar" ? 
                    <BarChart className="h-4 w-4" /> : 
                    <LineChart className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedChartType("bar")}>
                  <BarChart className="h-4 w-4 mr-2" /> Gráfico de Barras
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedChartType("line")}>
                  <LineChart className="h-4 w-4 mr-2" /> Gráfico de Linhas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((group, groupIndex) => (
            <div key={group.name} className="space-y-2">
              <h3 className="font-medium text-sm">{group.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item, itemIndex) => (
                  <div key={item.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={item.id} 
                      checked={item.active}
                      onCheckedChange={() => toggleMetric(groupIndex, itemIndex)}
                      className="mt-1"
                    />
                    <div className="flex items-center">
                      <Label 
                        htmlFor={item.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {item.label}
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Informações sobre {item.label.toLowerCase()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-end mt-4">
            <Button className="group">
              Aplicar Métricas <ChevronDown className="ml-1 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
