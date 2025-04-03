
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Repository, getRepositories } from "@/services/repositoryData";
import { FileUp, AlertCircle, Table, RefreshCw, ChevronLeft, ChevronRight, Check, ArrowDownUp, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RepositoriesList } from "@/components/dashboard/RepositoriesList";
import { RepositoryControls } from "@/components/dashboard/RepositoryControls";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
  const [csvData, setCsvData] = useState<CSVRecord[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "repository" | "projectId" | "author">("upload");
  const [storedFiles, setStoredFiles] = useState<{ name: string, url: string }[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<string | null>(null);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  // Replace single author selection with multiple authors
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<CSVRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  
  const form = useForm({
    defaultValues: {
      selectedRecord: ""
    }
  });
  
  useEffect(() => {
    if (open) {
      loadRepositories();
      if (currentStep === "repository") {
        fetchStoredFiles();
      }
    }
  }, [open, currentStep]);

  const loadRepositories = () => {
    const repos = getRepositories();
    setRepositories(repos);
    console.log("Loaded repositories:", repos.length);
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
      parseCSV(selectedFile);
    }
  };
  
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
        const files = data.map(file => ({
          name: file.name,
          url: supabase.storage.from('csvfiles').getPublicUrl(file.name).data.publicUrl
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
  
  const parseCSV = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (e.target && typeof e.target.result === 'string') {
          const result = e.target.result;
          parseCSVData(result);
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

  const parseCSVData = (csvText: string) => {
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
    
    if (parsedData.length > 0) {
      setCurrentStep("repository");
    } else {
      setError("No valid records found in CSV file");
    }

    // Extract unique project IDs
    const uniqueProjectIds = Array.from(new Set(
      parsedData
        .filter(record => record.projectId)
        .map(record => record.projectId as string)
    ));
    
    setProjectIds(uniqueProjectIds);
  };

  const handleFileUpload = async () => {
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
      const fileName = `data_${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      
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
      
      // Get public URL to pass back
      const { data: publicUrlData } = supabase.storage
        .from('csvfiles')
        .getPublicUrl(fileName);
      
      setSelectedFileUrl(publicUrlData?.publicUrl || null);
      
      // Load the CSV data from the file we just uploaded
      const response = await fetch(publicUrlData?.publicUrl || '');
      const csvText = await response.text();
      parseCSVData(csvText);
      
      toast.success("CSV file stored in backend");
    } catch (err: any) {
      setError(err.message || "Failed to upload CSV file");
      console.error("CSV upload error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStoredFileSelect = async (fileUrl: string) => {
    setSelectedFileUrl(fileUrl);
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch the CSV file (Status: ${response.status})`);
      }
      
      const csvText = await response.text();
      parseCSVData(csvText);
    } catch (err: any) {
      setError("Error fetching CSV file: " + err.message);
      console.error("CSV fetch error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRepositorySelect = (repo: Repository) => {
    setSelectedRepositoryId(repo.id || '');
    console.log("Selected repository:", repo.name, repo.id);
    setCurrentStep("projectId");
  };

  const handleProjectIdSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    
    // Get all authors for the selected project ID
    const authorsForProject = Array.from(new Set(
      csvData
        .filter(record => record.projectId === projectId && record.author)
        .map(record => record.author as string)
    ));
    
    setAuthors(authorsForProject);
    setCurrentStep("author");
    // Reset selected authors when changing project IDs
    setSelectedAuthors([]);
    setSelectedRecords([]);
  };
  
  // Handle toggling author selection
  const handleAuthorToggle = (author: string) => {
    setSelectedAuthors(prev => {
      if (prev.includes(author)) {
        // If author is already selected, remove it
        const updated = prev.filter(a => a !== author);
        
        // Also remove the record from selectedRecords
        setSelectedRecords(records => 
          records.filter(record => record.author !== author)
        );
        
        return updated;
      } else {
        // If author is not selected, add it
        const record = csvData.find(
          record => record.projectId === selectedProjectId && record.author === author
        );
        
        if (record) {
          setSelectedRecords(prev => [...prev, record]);
        }
        
        return [...prev, author];
      }
    });
  };
  
  // Clear a specific author from selection
  const handleRemoveAuthor = (author: string) => {
    setSelectedAuthors(prev => prev.filter(a => a !== author));
    setSelectedRecords(prev => prev.filter(r => r.author !== author));
  };
  
  const handleImportData = () => {
    if (selectedRecords.length === 0 || !selectedRepositoryId) {
      setError("Please select at least one author to import");
      return;
    }
    
    try {
      // Find the selected repository to get its ID
      const selectedRepo = repositories.find(repo => repo.id === selectedRepositoryId);
      
      if (!selectedRepo) {
        throw new Error("Selected repository not found");
      }

      // Process each selected record
      selectedRecords.forEach(selectedRecord => {
        // Create data object with file URL and selected record data
        const data: Partial<Repository> = {
          id: selectedRepo.id, // Use the ID of the selected repository
          csvFileUrl: selectedFileUrl,
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
      });
      
      onOpenChange(false);
      
      toast.success("Data imported successfully", {
        description: `Imported ${selectedRecords.length} author records into repository "${selectedRepo.name}"`
      });
      
      resetState();
    } catch (err: any) {
      setError(err.message || "Failed to import data");
      console.error("Data import error:", err);
    }
  };

  const resetState = () => {
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setCurrentStep("upload");
    setSelectedFileUrl(null);
    setSelectedRepositoryId(null);
    setProjectIds([]);
    setSelectedProjectId(null);
    setAuthors([]);
    setSelectedAuthors([]);
    setSelectedRecords([]);
    form.reset();
  };
  
  const handleCancel = () => {
    resetState();
    onOpenChange(false);
  };

  // Filter repositories based on search term
  const filteredRepositories = repositories.filter(repo => 
    repo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.projectId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort repositories based on sort criteria
  const sortedRepositories = [...filteredRepositories].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'recent') {
      const aDate = new Date(a.lastActivity);
      const bDate = new Date(b.lastActivity);
      return bDate.getTime() - aDate.getTime();
    }
    return 0;
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case "upload":
        return (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="csv-file" className="text-sm font-medium">
                CSV File
              </label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="cursor-pointer" />
            </div>

            {file && (
              <div className="text-sm">
                <span className="font-medium">Selected file:</span> {file.name}
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={handleCancel} disabled={isProcessing}>
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
              <Button onClick={handleFileUpload} disabled={!file || isProcessing} className="gap-2">
                <FileUp className="h-4 w-4" />
                {isProcessing ? "Processing..." : "Process File"}
              </Button>
            </DialogFooter>
          </div>
        );
      
      case "repository":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h4 className="text-base font-medium">Step 2: Select Repository</h4>
              <div className="text-sm text-muted-foreground">
                {repositories.length} repositories available
              </div>
            </div>
            
            <RepositoryControls 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode} 
              onViewModeChange={setViewMode}
              hideViewToggle={true}
            />

            <div className="border rounded-md overflow-hidden">
              <ScrollArea className="h-[300px]">
                {repositories.length === 0 ? (
                  <div className="text-center p-4">
                    <p>No repositories found.</p>
                  </div>
                ) : (
                  <RepositoriesList
                    repositories={sortedRepositories}
                    viewMode={viewMode}
                    showGradesTemplate={false}
                    selectedRepository=""
                    programmingStudents={[]}
                    sampleStudents={[]}
                    onRepositorySelect={() => {}}
                    showSelectButton={true}
                    selectButtonText="Select"
                    onSelectButtonClick={handleRepositorySelect}
                  />
                )}
              </ScrollArea>
            </div>
            
            <DialogFooter className="pt-2 space-x-2">
              <Button variant="outline" onClick={() => {
                setCurrentStep("upload");
              }} className="gap-2" disabled={isProcessing}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isProcessing}>
                Cancel
              </Button>
            </DialogFooter>
          </div>
        );
      
      case "projectId":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h4 className="text-base font-medium">Step 3: Select Project ID</h4>
            </div>
            
            {projectIds.length === 0 ? (
              <Alert>
                <AlertTitle>No Project IDs Found</AlertTitle>
                <AlertDescription>
                  No project IDs were found in the CSV file. Please check the file format.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projectIds.map((projectId, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-colors ${selectedProjectId === projectId ? 'border-primary' : 'hover:border-primary/50'}`}
                    onClick={() => handleProjectIdSelect(projectId)}
                  >
                    <CardContent className="p-4">
                      <div className="font-medium">{projectId}</div>
                      <div className="text-sm text-muted-foreground">
                        {csvData.filter(record => record.projectId === projectId).length} records
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <DialogFooter className="pt-2 space-x-2">
              <Button variant="outline" onClick={() => {
                setCurrentStep("repository");
              }} className="gap-2" disabled={isProcessing}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isProcessing}>
                Cancel
              </Button>
            </DialogFooter>
          </div>
        );
      
      case "author":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h4 className="text-base font-medium">Step 4: Select Authors</h4>
              <div className="text-sm text-muted-foreground">
                {selectedAuthors.length} authors selected
              </div>
            </div>
            
            {/* Selected authors display */}
            {selectedAuthors.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedAuthors.map((author, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                    {author}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAuthor(author);
                      }}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {authors.length === 0 ? (
              <Alert>
                <AlertTitle>No Authors Found</AlertTitle>
                <AlertDescription>
                  No authors were found for the selected project ID in the CSV file.
                </AlertDescription>
              </Alert>
            ) : (
              <div>
                <div className="text-sm mb-2 text-muted-foreground">
                  Select multiple authors to import (currently selected: {selectedAuthors.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {authors.map((author, index) => (
                    <Card 
                      key={index} 
                      className={`cursor-pointer transition-colors ${selectedAuthors.includes(author) ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                      onClick={() => handleAuthorToggle(author)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{author}</div>
                          <div className="text-sm text-muted-foreground">
                            {csvData.filter(record => 
                              record.projectId === selectedProjectId && 
                              record.author === author
                            ).length} records
                          </div>
                        </div>
                        <Checkbox 
                          checked={selectedAuthors.includes(author)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          onCheckedChange={() => handleAuthorToggle(author)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedRecords.length > 0 && (
              <Card className="mt-4 bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Selected Records Summary</CardTitle>
                  <CardDescription>
                    {selectedRecords.length} authors selected for import
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedRecords.map((record, index) => (
                      <div key={index} className="p-2 border rounded-md bg-background">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium">Author:</span> {record.author}</div>
                          <div><span className="font-medium">Email:</span> {record.email}</div>
                          <div><span className="font-medium">Project ID:</span> {record.projectId}</div>
                          <div><span className="font-medium">Date:</span> {record.date}</div>
                          {record.additions && (
                            <div><span className="font-medium">Additions:</span> {record.additions}</div>
                          )}
                          {record.deletions && (
                            <div><span className="font-medium">Deletions:</span> {record.deletions}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter className="pt-2 space-x-2">
              <Button variant="outline" onClick={() => {
                setCurrentStep("projectId");
              }} className="gap-2" disabled={isProcessing}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isProcessing}>
                Cancel
              </Button>
              <Button 
                onClick={handleImportData} 
                disabled={selectedRecords.length === 0 || isProcessing} 
                className="gap-2"
              >
                <Table className="h-4 w-4" />
                {isProcessing ? "Importing..." : `Import ${selectedRecords.length} Author${selectedRecords.length !== 1 ? 's' : ''}`}
              </Button>
            </DialogFooter>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Import CSV File</DialogTitle>
          <DialogDescription>
            Upload a CSV file and select data to import into an existing repository.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
