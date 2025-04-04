import { Search, Calendar, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface RepositoryControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onToggleGradesView?: () => void;
  showGradesTemplate?: boolean;
  hideViewToggle?: boolean;
}
export function RepositoryControls({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onToggleGradesView,
  showGradesTemplate,
  hideViewToggle = false
}: RepositoryControlsProps) {
  return <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="relative w-full md:w-auto">
        
        
      </div>
      
      
    </div>;
}