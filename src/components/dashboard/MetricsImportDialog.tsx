
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Repository } from "@/services/repositoryData";
import { FileUp, AlertCircle } from "lucide-react";

interface MetricsImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataImported: (data: Partial<Repository>) => void;
}

export function MetricsImportDialog({
  open,
  onOpenChange,
  onDataImported
}: MetricsImportDialogProps) {
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
      const lines = text.split('\n').filter(line => line.trim().length > 0);

      // Ensure we have at least a header and one data row
      if (lines.length < 2) {
        throw new Error("CSV file does not contain enough data");
      }

      // Process headers
      const headers = lines[0].split(',').map(header => header.trim());

      // Check for required headers
      const requiredHeaders = ["Author", "ProjectID", "totalcommits", "totaladds", "average_operations_commit", "average_commit_week"];
      const missingHeaders = requiredHeaders.filter(required => 
        !headers.some(header => header.toLowerCase() === required.toLowerCase())
      );
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
      }

      // Process data
      const data = lines[1].split(',').map(value => value.trim());

      // Create a result object mapping headers to values
      const result: Record<string, any> = {};
      headers.forEach((header, index) => {
        if (data[index] !== undefined) {
          // Convert numeric values
          if (["totalcommits", "totaladds", "average_operations_commit", "average_commit_week"].includes(header) && !isNaN(Number(data[index]))) {
            result[header] = Number(data[index]);
          } else {
            result[header] = data[index];
          }
        }
      });

      // Map CSV fields to repository fields
      const repositoryData: Partial<Repository> = {
        author: result.Author,
        projectId: result.ProjectID,
        commitCount: result.totalcommits,
        totalAdditions: result.totaladds,
        averageOperationsPerCommit: result.average_operations_commit,
        averageCommitsPerWeek: result.average_commit_week,
      };
      
      onDataImported(repositoryData);
      onOpenChange(false);
      setFile(null);
      toast.success("Metrics data imported successfully");
    } catch (err: any) {
      setError(err.message || "Failed to process CSV file. Please check the format and try again.");
      console.error("CSV processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Metrics CSV Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import repository metrics. 
            The CSV should include headers matching the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="metrics-csv-file" className="text-sm font-medium">
              Metrics CSV File
            </label>
            <Input id="metrics-csv-file" type="file" accept=".csv" onChange={handleFileChange} className="cursor-pointer" />
            <p className="text-xs text-muted-foreground">
              Expected format: Headers in first row, data in second row
            </p>
          </div>

          {error && <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>}

          {file && <div className="text-sm">
              <span className="font-medium">Selected file:</span> {file.name}
            </div>}

          <div className="bg-muted rounded-md p-3 text-xs">
            <p className="font-medium mb-1">Expected CSV Format:</p>
            <pre className="overflow-x-auto whitespace-pre-wrap">
Author,
ProjectID,
totalcommits,
totaladds,
average_operations_commit,
average_commit_week</pre>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={processCSV} disabled={!file || isProcessing} className="gap-2">
            <FileUp className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Import Metrics"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
