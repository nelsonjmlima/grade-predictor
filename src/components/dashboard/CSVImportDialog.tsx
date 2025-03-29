
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Repository } from "@/services/repositoryData";
import { FileUp, AlertCircle } from "lucide-react";

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataImported: (data: Partial<Repository>) => void;
}

export function CSVImportDialog({
  open,
  onOpenChange,
  onDataImported
}: CSVImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        setError("Please select a valid CSV file");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const processCSV = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      if (lines.length < 2) {
        throw new Error("CSV file does not contain enough data");
      }

      const data = lines[1].split(',').map(value => value.trim());
      
      const result: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        if (data[index] !== undefined) {
          // Convert numeric values
          if (!isNaN(Number(data[index]))) {
            result[header] = Number(data[index]);
          } else {
            result[header] = data[index];
          }
        }
      });

      // Map CSV fields to repository fields
      const repositoryData: Partial<Repository> = {};
      
      if (result.commitCount !== undefined) repositoryData.commitCount = result.commitCount;
      if (result.mergeRequestCount !== undefined) repositoryData.mergeRequestCount = result.mergeRequestCount;
      if (result.branchCount !== undefined) repositoryData.branchCount = result.branchCount;
      if (result.progress !== undefined) repositoryData.progress = result.progress;
      if (result.name !== undefined) repositoryData.name = result.name;
      if (result.description !== undefined) repositoryData.description = result.description;
      if (result.lastActivity !== undefined) repositoryData.lastActivity = result.lastActivity;
      
      onDataImported(repositoryData);
      onOpenChange(false);
      setFile(null);
    } catch (err) {
      setError("Failed to process CSV file. Please check the format and try again.");
      console.error("CSV processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import CSV Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import repository data. 
            The CSV should include headers matching repository fields like 
            commitCount, mergeRequestCount, branchCount, progress, etc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="csv-file" className="text-sm font-medium">
              CSV File
            </label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Expected format: Headers in first row, data in second row
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {file && (
            <div className="text-sm">
              <span className="font-medium">Selected file:</span> {file.name}
            </div>
          )}

          <div className="bg-muted rounded-md p-3 text-xs">
            <p className="font-medium mb-1">Example CSV Format:</p>
            <pre className="overflow-x-auto">
              name,description,commitCount,mergeRequestCount,branchCount,progress,lastActivity
              Project X,Description for Project X,150,12,5,75,Today at 12:30
            </pre>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={processCSV} 
            disabled={!file || isProcessing}
            className="gap-2"
          >
            <FileUp className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Import Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
