
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
  const [groupProcessing, setGroupProcessing] = useState(false);

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

      // Ensure we have at least a header and one data row
      if (lines.length < 2) {
        throw new Error("CSV file does not contain enough data");
      }

      // Process headers
      const headers = lines[0].split(',').map(header => header.trim());

      // Check for required headers
      const requiredHeaders = ["ProjectID", "Author", "Email", "Date", "Additions", "Deletions", "Operations"];
      const missingHeaders = requiredHeaders.filter(required => !headers.some(header => header.toLowerCase() === required.toLowerCase()));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
      }

      // Process data (using first data row)
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

      // Extract group number from ProjectID if available (assuming format like "Group-X-ProjectName")
      let groupNumber: number | undefined;
      if (result.ProjectID && result.ProjectID.includes("Group")) {
        const groupMatch = result.ProjectID.match(/Group[^0-9]*([0-9]+)/i);
        if (groupMatch && groupMatch[1]) {
          groupNumber = parseInt(groupMatch[1], 10);
        }
      }

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
        groupNumber: groupNumber
      };
      onDataImported(repositoryData);
      onOpenChange(false);
      setFile(null);
      toast.success("CSV data imported successfully");
    } catch (err: any) {
      setError(err.message || "Failed to process CSV file. Please check the format and try again.");
      console.error("CSV processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const processMultipleEntries = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }
    setGroupProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n');

      // Ensure we have at least a header row
      if (lines.length < 2) {
        throw new Error("CSV file does not contain enough data");
      }

      // Process headers
      const headers = lines[0].split(',').map(header => header.trim());

      // Check for required headers
      const requiredHeaders = ["ProjectID", "Author", "Email", "Date", "Additions", "Deletions", "Operations"];
      const missingHeaders = requiredHeaders.filter(required => !headers.some(header => header.toLowerCase() === required.toLowerCase()));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
      }

      // Create a grouped object to collect students by ProjectID
      const groupedByProject: Record<string, Array<Record<string, any>>> = {};

      // Process each data row (skip header)
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const data = lines[i].split(',').map(value => value.trim());
        if (data.length < headers.length) continue; // Skip incomplete rows
        
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
        
        // Group by ProjectID
        const projectId = result.ProjectID || "Unknown";
        if (!groupedByProject[projectId]) {
          groupedByProject[projectId] = [];
        }
        groupedByProject[projectId].push(result);
      }

      // Now process each project group and import as a separate repository
      const importCount = Object.keys(groupedByProject).length;
      let processedCount = 0;

      for (const [projectId, students] of Object.entries(groupedByProject)) {
        // Extract group number if available
        let groupNumber: number | undefined;
        if (projectId.includes("Group")) {
          const groupMatch = projectId.match(/Group[^0-9]*([0-9]+)/i);
          if (groupMatch && groupMatch[1]) {
            groupNumber = parseInt(groupMatch[1], 10);
          }
        }

        // Calculate aggregate metrics for this project
        const totalAdditions = students.reduce((sum, student) => sum + (student.Additions || 0), 0);
        const totalDeletions = students.reduce((sum, student) => sum + (student.Deletions || 0), 0);
        const totalOperations = students.reduce((sum, student) => sum + (student.Operations || 0), 0);
        const totalCommits = students.length;
        const averageOperationsPerCommit = totalCommits > 0 ? totalOperations / totalCommits : 0;

        // Find the most recent activity date
        const activityDates = students
          .map(s => s.Date)
          .filter(Boolean)
          .map(d => new Date(d).getTime());
        const lastActivity = activityDates.length > 0 
          ? new Date(Math.max(...activityDates)).toISOString() 
          : new Date().toISOString();

        // Create student records for this project
        const studentRecords = students.map((student, index) => ({
          id: `${projectId}-student-${index}`,
          name: student.Author || `Student ${index + 1}`,
          email: student.Email || `student${index + 1}@example.com`,
          commitCount: student.Operations || 0,
          lastActivity: student.Date || lastActivity,
          studentNumber: `S${index + 1000}`,
          gitlabUsername: student.Author?.toLowerCase().replace(/\s+/g, '-') || `student${index + 1}`,
          groupNumber: groupNumber
        }));

        // Create the repository data
        const repositoryData: Partial<Repository> = {
          projectId: projectId,
          name: projectId,
          description: `Group project with ${students.length} contributors`,
          lastActivity: lastActivity,
          commitCount: totalOperations,
          mergeRequestCount: Math.floor(totalOperations / 3) || 0,
          branchCount: Math.floor(totalOperations / 5) || 0,
          progress: Math.min(Math.floor(totalAdditions / ((totalAdditions + totalDeletions) || 1) * 100), 100) || 50,
          additions: totalAdditions,
          deletions: totalDeletions,
          operations: totalOperations,
          students: studentRecords,
          contributorsCount: students.length,
          totalCommits: totalCommits,
          totalAdds: totalAdditions,
          averageOperationsPerCommit: averageOperationsPerCommit,
          averageCommitsPerWeek: totalCommits / 4, // Assuming 4 weeks of data
          groupNumber: groupNumber
        };

        // Import this repository
        onDataImported(repositoryData);
        processedCount++;
      }

      onOpenChange(false);
      setFile(null);
      toast.success(`Imported ${processedCount} project repositories successfully`);
    } catch (err: any) {
      setError(err.message || "Failed to process CSV file. Please check the format and try again.");
      console.error("CSV processing error:", err);
    } finally {
      setGroupProcessing(false);
    }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
              You can import a single entry or group students by ProjectID
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
            <pre className="overflow-x-auto whitespace-pre-wrap">ProjectID, Author, Email, Date, Additions, Deletions, Operations</pre>
            <p className="text-xs mt-2 text-muted-foreground">
              Example date format: 2024-12-20T20:00:15.000+00:00
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              For group projects, name your ProjectID as "Group-X-ProjectName" for auto-grouping
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing || groupProcessing}>
            Cancel
          </Button>
          <Button 
            variant="secondary" 
            onClick={processMultipleEntries} 
            disabled={!file || isProcessing || groupProcessing}
            className="gap-2"
          >
            <FileUp className="h-4 w-4" />
            {groupProcessing ? "Processing..." : "Import as Group Projects"}
          </Button>
          <Button 
            onClick={processCSV} 
            disabled={!file || isProcessing || groupProcessing} 
            className="gap-2"
          >
            <FileUp className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Import Single Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
