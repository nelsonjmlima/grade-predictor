
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentIdSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
}

export function StudentIdSelector({ 
  selectedIds, 
  onChange,
  className 
}: StudentIdSelectorProps) {
  const [currentId, setCurrentId] = useState<string>("");
  const [availableIds, setAvailableIds] = useState<string[]>([]);
  
  // This would normally fetch from an API
  // For demo purposes, we'll generate some sample IDs
  useEffect(() => {
    // Generate student IDs from 1000 to 1020
    const sampleIds = Array.from({ length: 21 }, (_, i) => (i + 1000).toString());
    setAvailableIds(sampleIds);
  }, []);
  
  const handleAddId = () => {
    if (currentId && !selectedIds.includes(currentId)) {
      const newSelectedIds = [...selectedIds, currentId];
      onChange(newSelectedIds);
      setCurrentId("");
    }
  };
  
  const handleRemoveId = (idToRemove: string) => {
    const newSelectedIds = selectedIds.filter(id => id !== idToRemove);
    onChange(newSelectedIds);
  };
  
  // Filter out already selected IDs from the dropdown
  const filteredIds = availableIds.filter(id => !selectedIds.includes(id));
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <Select
          value={currentId}
          onValueChange={setCurrentId}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select student ID" />
          </SelectTrigger>
          <SelectContent>
            {filteredIds.length > 0 ? (
              filteredIds.map((id) => (
                <SelectItem key={id} value={id}>
                  Student ID: {id}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No more IDs available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button 
          type="button"
          onClick={handleAddId}
          disabled={!currentId || selectedIds.includes(currentId)}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIds.map(id => (
            <Badge key={id} variant="secondary" className="flex items-center gap-1">
              Student ID: {id}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveId(id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
