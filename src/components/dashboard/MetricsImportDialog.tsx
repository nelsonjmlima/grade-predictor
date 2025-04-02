
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Repository } from "@/services/repositoryData";
import { FileUp, AlertCircle, Database, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MetricsImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataImported: (data: Partial<Repository>) => void;
}

interface CSVFile {
  name: string;
  url: string;
  created_at: string;
}

interface CSVRecord {
  projectId?: string;
  author?: string;
  email?: string;
  [key: string]: string | undefined;
}

export function MetricsImportDialog({
  open,
  onOpenChange,
  onDataImported
}: MetricsImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedFiles, setStoredFiles] = useState<CSVFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<CSVRecord[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<CSVRecord | null>(null);
  
  useEffect(() => {
    if (open && activeTab === "stored") {
      fetchStoredFiles();
    }
  }, [open, activeTab]);
  
  const checkBucketExists = async () => {
    setError(null);
    
    try {
      // Try to list files in the bucket to check if it exists and is accessible
      const { data, error: listError } = await supabase
        .storage
        .from('csvfiles')
        .list();
        
      if (listError) {
        console.error("Error checking bucket:", listError);
        setError(`Storage bucket error: ${listError.message}`);
        return false;
      }
      
      // If we can list files, the bucket exists and is accessible
      return true;
    } catch (err: any) {
      console.error("Bucket check error:", err);
      setError(`Failed to access storage bucket: ${err.message || err}`);
      return false;
    }
  };
  
  const fetchStoredFiles = async () => {
    setLoadingFiles(true);
    setError(null);
    
    try {
      // Check if bucket exists and is accessible
      const bucketReady = await checkBucketExists();
      if (!bucketReady) {
        throw new Error("Storage bucket is not available. Please check your Supabase configuration.");
      }
      
      const { data, error } = await supabase
        .storage
        .from('csvfiles')
        .list();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const files: CSVFile[] = data.map(file => ({
          name: file.name,
          url: supabase.storage.from('csvfiles').getPublicUrl(file.name).data.publicUrl,
          created_at: new Date(file.created_at || '').toLocaleString()
        }));
        
        setStoredFiles(files);
      }
    } catch (err: any) {
      console.error("Error fetching stored files:", err);
      setError("Failed to load stored files: " + err.message);
    } finally {
      setLoadingFiles(false);
    }
  };
  
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
      // Check if bucket exists and is accessible
      const bucketReady = await checkBucketExists();
      if (!bucketReady) {
        throw new Error("Storage bucket is not available. Please check your Supabase configuration.");
      }
      
      // Upload the CSV file to Supabase storage
      const timestamp = new Date().getTime();
      const fileName = `metrics_${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('csvfiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error("Error uploading CSV file:", uploadError);
        throw new Error(`Failed to store CSV file: ${uploadError.message}`);
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
  
  const handleStoredFileSelect = async (fileUrl: string) => {
    setSelectedFile(fileUrl);
    setSelectedProjectId(null);
    setSelectedAuthor(null);
    setSelectedRecord(null);
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch the CSV file (Status: ${response.status})`);
      }
      
      const csvText = await response.text();
      const lines = csvText.split('\n');
      
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
      
      // Extract unique project IDs
      const uniqueProjectIds = Array.from(new Set(
        parsedData
          .filter(record => record.projectId)
          .map(record => record.projectId as string)
      ));
      
      setProjectIds(uniqueProjectIds);
      
      if (parsedData.length === 0) {
        setError("No valid records found in CSV file");
      }
    } catch (err: any) {
      setError("Error parsing CSV file: " + err.message);
      console.error("CSV parsing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleProjectIdSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedAuthor(null);
    setSelectedRecord(null);
    
    // Get all authors for the selected project ID
    const authorsForProject = Array.from(new Set(
      csvData
        .filter(record => record.projectId === projectId && record.author)
        .map(record => record.author as string)
    ));
    
    setAuthors(authorsForProject);
  };
  
  const handleAuthorSelect = (author: string) => {
    setSelectedAuthor(author);
    
    // Find the record for the selected project ID and author
    const record = csvData.find(
      record => record.projectId === selectedProjectId && record.author === author
    );
    
    setSelectedRecord(record || null);
  };
  
  const handleImportData = () => {
    if (!selectedRecord) {
      setError("Please select a record to import");
      return;
    }
    
    try {
      // Create data object with file URL and selected record data
      const data: Partial<Repository> = {
        csvFileUrl: selectedFile,
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
      
      onDataImported(data);
      onOpenChange(false);
      
      toast.success("Data imported successfully", {
        description: `Imported data for ${selectedRecord.author} from project ${selectedRecord.projectId}`
      });
      
      // Reset state
      setSelectedFile(null);
      setCsvData([]);
      setHeaders([]);
      setProjectIds([]);
      setSelectedProjectId(null);
      setAuthors([]);
      setSelectedAuthor(null);
      setSelectedRecord(null);
    } catch (err: any) {
      setError(err.message || "Failed to import data");
      console.error("Data import error:", err);
    }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Repository Metrics</DialogTitle>
          <DialogDescription>
            Upload a new CSV file or choose from previously uploaded files.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="mt-2" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload New File</TabsTrigger>
            <TabsTrigger value="stored">Use Stored Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 py-4">
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
            
            <DialogFooter className="px-0 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                Cancel
              </Button>
              {error && error.includes("Storage bucket") && (
                <Button 
                  onClick={checkBucketExists} 
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recheck Storage Bucket
                </Button>
              )}
              <Button onClick={processCSV} disabled={!file || isProcessing} className="gap-2">
                <FileUp className="h-4 w-4" />
                {isProcessing ? "Uploading..." : "Upload File"}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="stored" className="space-y-4 py-4">
            {loadingFiles ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Loading stored files...</p>
              </div>
            ) : error && error.includes("Storage bucket") ? (
              <div className="text-center py-4 space-y-4">
                <div className="flex items-center gap-2 text-destructive text-sm justify-center">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
                <Button 
                  onClick={checkBucketExists} 
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recheck Storage Bucket
                </Button>
              </div>
            ) : storedFiles.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No CSV files found. Upload a file first.</p>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium mb-2">Step 1: Select a CSV File</h4>
                <div className="border rounded-md max-h-[180px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Filename</TableHead>
                        <TableHead>Uploaded At</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storedFiles.map((file, index) => (
                        <TableRow key={index} className={selectedFile === file.url ? "bg-muted" : ""}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>{file.created_at}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStoredFileSelect(file.url)}
                              disabled={isProcessing}
                            >
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {selectedFile && projectIds.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Step 2: Select Project ID</h4>
                    <Select 
                      value={selectedProjectId || ""} 
                      onValueChange={handleProjectIdSelect}
                      disabled={isProcessing}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Project ID" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectIds.map((projectId, index) => (
                          <SelectItem key={index} value={projectId}>
                            {projectId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {selectedProjectId && authors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Step 3: Select Author</h4>
                    <Select 
                      value={selectedAuthor || ""} 
                      onValueChange={handleAuthorSelect}
                      disabled={isProcessing}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Author" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map((author, index) => (
                          <SelectItem key={index} value={author}>
                            {author}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {selectedRecord && (
                  <div className="mt-4 p-4 border rounded-md bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">Selected Record Summary:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Project ID:</span> {selectedRecord.projectId}</div>
                      <div><span className="font-medium">Author:</span> {selectedRecord.author}</div>
                      <div><span className="font-medium">Email:</span> {selectedRecord.email}</div>
                      <div><span className="font-medium">Date:</span> {selectedRecord.date}</div>
                      {selectedRecord.additions && (
                        <div><span className="font-medium">Additions:</span> {selectedRecord.additions}</div>
                      )}
                      {selectedRecord.deletions && (
                        <div><span className="font-medium">Deletions:</span> {selectedRecord.deletions}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {error && !error.includes("Storage bucket") && <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>}
            
            <DialogFooter className="px-0 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button 
                onClick={handleImportData} 
                disabled={!selectedRecord || isProcessing} 
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                {isProcessing ? "Importing..." : "Import Selected Data"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>;
}
