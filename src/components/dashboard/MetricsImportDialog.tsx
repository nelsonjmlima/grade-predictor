
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Repository, uploadCSVToSupabase } from "@/services/repositoryData";
import { FileUp, AlertCircle } from "lucide-react";

interface MetricsImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataImported: (data: Partial<Repository>) => void;
  repositoryId?: string;
}

export function MetricsImportDialog({
  open,
  onOpenChange,
  onDataImported,
  repositoryId = "default"
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
      // Upload CSV file to Supabase storage
      const publicUrl = await uploadCSVToSupabase(file, repositoryId);
      
      if (!publicUrl) {
        throw new Error("Failed to upload CSV file");
      }
      
      console.log("CSV file uploaded successfully:", publicUrl);
      toast.success("CSV file stored in backend");

      // Pass back the file URL
      const fileData: Partial<Repository> = {
        csvFileUrl: publicUrl,
        storagePath: `repositories/${repositoryId}/${file.name}`
      };
      
      onDataImported(fileData);
      onOpenChange(false);
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to upload CSV file");
      console.error("CSV upload error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Metrics File</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing metrics to store in the backend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="metrics-csv-file" className="text-sm font-medium">
              Metrics CSV File
            </label>
            <Input id="metrics-csv-file" type="file" accept=".csv" onChange={handleFileChange} className="cursor-pointer" />
          </div>

          {error && <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>}

          {file && <div className="text-sm">
              <span className="font-medium">Selected file:</span> {file.name}
            </div>}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={processCSV} disabled={!file || isProcessing} className="gap-2">
            <FileUp className="h-4 w-4" />
            {isProcessing ? "Uploading..." : "Upload File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
