
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Repository } from "@/services/repositoryData";
import { FileUp, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [csvData, setCsvData] = useState<{headers: string[], data: string[]}>({headers: [], data: []});
  const [csvParsed, setCsvParsed] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        setError("Please select a valid CSV file");
        setFile(null);
        setCsvParsed(false);
        return;
      }
      setFile(selectedFile);
      setError(null);
      
      // Preview the CSV file
      try {
        const text = await selectedFile.text();
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        
        if (lines.length < 2) {
          throw new Error("CSV file does not contain enough data");
        }
        
        // Process headers
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Process data
        const data = lines[1].split(',').map(value => value.trim());
        
        setCsvData({headers, data});
        setCsvParsed(true);
      } catch (err: any) {
        setError(err.message || "Failed to parse CSV file");
        setCsvParsed(false);
      }
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
      const requiredHeaders = ["ProjectID", "Author", "Email", "Date", "Additions", "Deletions", "Operations"];
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
          if (["Additions", "Deletions", "Operations"].includes(header) && !isNaN(Number(data[index]))) {
            result[header] = Number(data[index]);
          } else {
            result[header] = data[index];
          }
        }
      });

      // Map CSV fields to repository fields
      const repositoryData: Partial<Repository> = {
        projectId: result.ProjectID,
        author: result.Author,
        email: result.Email,
        date: result.Date,
        additions: result.Additions,
        deletions: result.Deletions,
        operations: result.Operations,
        // Set additional derived fields
        name: result.ProjectID || "Unnamed Project",
        description: `Contributed by ${result.Author || "Unknown"}`,
        lastActivity: result.Date || new Date().toISOString(),
        commitCount: result.Operations || 0,
        mergeRequestCount: Math.floor((result.Operations || 0) / 3) || 0,
        branchCount: Math.floor((result.Operations || 0) / 5) || 0,
        progress: Math.min(Math.floor((result.Additions || 0) / ((result.Additions || 0) + (result.Deletions || 0) + 1) * 100), 100) || 50,
        
        // Add total fields if not present
        totalAdditions: result.Additions ? result.Additions * 5 : undefined, 
        totalDeletions: result.Deletions ? result.Deletions * 3 : undefined,
        totalOperations: result.Operations ? result.Operations * 4 : undefined,
        averageOperationsPerCommit: result.Operations && result.Operations > 0 ? Math.round(result.Operations / 3) : undefined,
        averageCommitsPerWeek: result.Operations && result.Operations > 0 ? Math.round(result.Operations / 12) : undefined
      };
      
      onDataImported(repositoryData);
      onOpenChange(false);
      setFile(null);
      setCsvParsed(false);
      toast.success("CSV data imported successfully");
    } catch (err: any) {
      setError(err.message || "Failed to process CSV file. Please check the format and try again.");
      console.error("CSV processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import CSV Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import repository data. 
            The CSV should include headers matching the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="csv-file" className="text-sm font-medium">
              CSV File
            </label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="cursor-pointer" />
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

          {csvParsed && csvData.headers.length > 0 && (
            <div className="rounded-md border overflow-hidden">
              <div className="max-h-[200px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {csvData.headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      {csvData.data.map((value, index) => (
                        <TableCell key={index}>{value}</TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="bg-muted rounded-md p-3 text-xs">
            <p className="font-medium mb-1">Expected CSV Format:</p>
            <pre className="overflow-x-auto whitespace-pre-wrap">
ProjectID,
Author,
Email,
Date (YYYY-MM-DDThh:mm:ss.sss+00:00),
Additions,
Deletions,
Operations</pre>
            <p className="text-xs mt-2 text-muted-foreground">
              Example date format: 2024-12-20T20:00:15.000+00:00
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={processCSV} disabled={!file || isProcessing} className="gap-2">
            <FileUp className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Import Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
