
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Repository } from "@/services/repositoryData";
import { FileUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      // Upload the CSV file to Supabase storage without processing its content
      const timestamp = new Date().getTime();
      const fileName = `data_${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('csvfiles')
        .upload(fileName, file);
        
      if (uploadError) {
        console.error("Error uploading CSV file:", uploadError);
        toast.error("Failed to store CSV file");
        throw uploadError;
      }
      
      console.log("CSV file uploaded successfully:", uploadData);
      toast.success("CSV file stored in backend");

      // Get public URL to pass back
      const { data: publicUrlData } = supabase.storage
        .from('csvfiles')
        .getPublicUrl(fileName);
        
      // Only send minimal data back - just the file URL
      const fileData: Partial<Repository> = {
        csvFileUrl: publicUrlData?.publicUrl
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
          <DialogTitle>Import CSV File</DialogTitle>
          <DialogDescription>
            Upload a CSV file to store in the backend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="csv-file" className="text-sm font-medium">
              CSV File
            </label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="cursor-pointer" />
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
