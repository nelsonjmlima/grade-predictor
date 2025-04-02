
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Repository } from "@/services/repositoryData";
import { FileUp, AlertCircle, Table, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table as UITable, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataImported: (data: Partial<Repository>) => void;
}

interface CSVRecord {
  projectId?: string;
  author?: string;
  email?: string;
  [key: string]: string | undefined;
}

export function CSVImportDialog({
  open,
  onOpenChange,
  onDataImported
}: CSVImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingBucket, setIsCreatingBucket] = useState(false);
  const [csvData, setCsvData] = useState<CSVRecord[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  
  const form = useForm({
    defaultValues: {
      selectedRecord: ""
    }
  });
  
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
      parseCSV(selectedFile);
    }
  };
  
  // Function to create the bucket if it doesn't exist
  const createBucketIfNeeded = async () => {
    setIsCreatingBucket(true);
    setError(null);
    
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase
        .storage
        .listBuckets();
      
      if (listError) {
        console.error("Error checking buckets:", listError);
        throw listError;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'csvfiles');
      
      if (!bucketExists) {
        // Create the bucket
        const { error: createError } = await supabase
          .storage
          .createBucket('csvfiles', {
            public: true
          });
          
        if (createError) {
          console.error("Error creating bucket:", createError);
          throw createError;
        }
        
        toast.success("Storage bucket created successfully");
      }
      
      return true;
    } catch (err: any) {
      setError(`Failed to create storage bucket: ${err.message || err}`);
      console.error("Bucket creation error:", err);
      return false;
    } finally {
      setIsCreatingBucket(false);
    }
  };
  
  const parseCSV = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (e.target && typeof e.target.result === 'string') {
          const result = e.target.result;
          const lines = result.split('\n');
          
          // Extract headers (first line)
          const headers = lines[0].split(',').map(h => h.trim());
          setHeaders(headers);
          
          // Process data rows
          const parsedData: CSVRecord[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            const record: CSVRecord = {};
            
            headers.forEach((header, index) => {
              if (values[index]) {
                record[header.toLowerCase()] = values[index];
              }
            });
            
            // Only include records that have projectId, author, or email
            if (record.projectid || record.author || record.email) {
              parsedData.push({
                projectId: record.projectid,
                author: record.author,
                email: record.email,
                ...record
              });
            }
          }
          
          setCsvData(parsedData);
          
          if (parsedData.length > 0) {
            setShowSelection(true);
          } else {
            setError("No valid records found in CSV file");
          }
        }
      } catch (err: any) {
        setError("Error parsing CSV file: " + err.message);
        console.error("CSV parsing error:", err);
      }
    };
    
    reader.onerror = () => {
      setError("Error reading file");
    };
    
    reader.readAsText(file);
  };
  
  const handleSubmit = form.handleSubmit(async (values) => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Check if bucket exists and create it if needed
      const bucketReady = await createBucketIfNeeded();
      if (!bucketReady) {
        throw new Error("Storage bucket is not available");
      }
      
      // Upload the CSV file to Supabase storage
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
      
      // Find the selected record
      const selectedRecord = csvData.find((_, index) => index.toString() === values.selectedRecord);
      
      if (!selectedRecord) {
        throw new Error("Selected record not found");
      }
      
      // Create data object with file URL and selected record data
      const fileData: Partial<Repository> = {
        csvFileUrl: publicUrlData?.publicUrl,
        projectId: selectedRecord.projectId,
        author: selectedRecord.author,
        email: selectedRecord.email,
        // Add other fields as needed
        additions: selectedRecord.additions ? parseInt(selectedRecord.additions) : undefined,
        deletions: selectedRecord.deletions ? parseInt(selectedRecord.deletions) : undefined,
        operations: selectedRecord.operations ? parseInt(selectedRecord.operations) : undefined,
        totalAdditions: selectedRecord.totaladditions ? parseInt(selectedRecord.totaladditions) : undefined,
        totalDeletions: selectedRecord.totaldeletions ? parseInt(selectedRecord.totaldeletions) : undefined,
        totalOperations: selectedRecord.totaloperations ? parseInt(selectedRecord.totaloperations) : undefined,
        averageOperationsPerCommit: selectedRecord.averageoperationspercommit ? parseFloat(selectedRecord.averageoperationspercommit) : undefined,
        averageCommitsPerWeek: selectedRecord.averagecommitsperweek ? parseFloat(selectedRecord.averagecommitsperweek) : undefined,
        date: selectedRecord.date
      };
      
      onDataImported(fileData);
      onOpenChange(false);
      setFile(null);
      setCsvData([]);
      setHeaders([]);
      setShowSelection(false);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Failed to upload CSV file");
      console.error("CSV upload error:", err);
    } finally {
      setIsProcessing(false);
    }
  });
  
  const handleCancel = () => {
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setShowSelection(false);
    form.reset();
    onOpenChange(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import CSV File</DialogTitle>
          <DialogDescription>
            Upload a CSV file and select data to import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!showSelection ? (
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="csv-file" className="text-sm font-medium">
                CSV File
              </label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="cursor-pointer" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="max-h-[300px] overflow-auto border rounded-md">
                  <UITable>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Select</TableHead>
                        {headers.includes('ProjectID') && <TableHead>Project ID</TableHead>}
                        {headers.includes('Author') && <TableHead>Author</TableHead>}
                        {headers.includes('Email') && <TableHead>Email</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name="selectedRecord"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroup 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-1"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value={index.toString()} id={`record-${index}`} />
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          {headers.includes('ProjectID') && <TableCell>{record.projectId}</TableCell>}
                          {headers.includes('Author') && <TableCell>{record.author}</TableCell>}
                          {headers.includes('Email') && <TableCell>{record.email}</TableCell>}
                        </TableRow>
                      ))}
                    </TableBody>
                  </UITable>
                </div>
              </form>
            </Form>
          )}

          {error && <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>}

          {file && !showSelection && <div className="text-sm">
              <span className="font-medium">Selected file:</span> {file.name}
            </div>}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isProcessing || isCreatingBucket}>
            Cancel
          </Button>
          {error && error.includes("bucket") && (
            <Button 
              onClick={() => createBucketIfNeeded()} 
              disabled={isCreatingBucket} 
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isCreatingBucket ? 'animate-spin' : ''}`} />
              {isCreatingBucket ? "Creating..." : "Create Storage Bucket"}
            </Button>
          )}
          {!showSelection ? (
            <Button onClick={() => {}} disabled={!file || isProcessing || isCreatingBucket} className="gap-2">
              <FileUp className="h-4 w-4" />
              {isProcessing ? "Processing..." : "Process File"}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!form.watch("selectedRecord") || isProcessing || isCreatingBucket} className="gap-2">
              <Table className="h-4 w-4" />
              {isProcessing ? "Importing..." : "Import Selected Data"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
