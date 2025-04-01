
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertCircle, FileUp, ArrowLeft, FileText } from "lucide-react";
import { Repository, addRepository } from "@/services/repositoryData";
import { v4 as uuidv4 } from "uuid";
import Layout from "@/components/dashboard/Layout";

export default function ImportCSVPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Partial<Repository> | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        setError("Please select a valid CSV file");
        setFile(null);
        setPreviewData(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      handlePreview(selectedFile);
    }
  };

  const handlePreview = async (csvFile: File) => {
    try {
      const text = await csvFile.text();
      const lines = text.split('\n');
      
      // Ensure we have at least a header and one data row
      if (lines.length < 2) {
        throw new Error("CSV file does not contain enough data");
      }

      // Process headers
      const headers = lines[0].split(',').map(header => header.trim());
      
      // Check for required headers
      const requiredHeaders = ["Project_ID", "Author", "Email", "Date", "Additions", "Deletions", "Operations"];
      const missingHeaders = requiredHeaders.filter(required => 
        !headers.some(header => header.toLowerCase() === required.toLowerCase())
      );
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
      }

      // Process first data row for preview
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

      // Map CSV fields to repository fields for preview
      const repositoryData: Partial<Repository> = {
        projectId: result.Project_ID,
        author: result.Author,
        email: result.Email,
        date: result.Date,
        additions: result.Additions,
        deletions: result.Deletions,
        operations: result.Operations,
        // Set additional derived fields
        name: result.Project_ID || "Unnamed Project",
        description: `Contributed by ${result.Author || "Unknown"}`,
        lastActivity: result.Date || new Date().toISOString(),
        commitCount: result.Operations || 0,
        mergeRequestCount: Math.floor((result.Operations || 0) / 3) || 0,
        branchCount: Math.floor((result.Operations || 0) / 5) || 0,
        progress: Math.min(Math.floor(((result.Additions || 0) / ((result.Additions || 0) + (result.Deletions || 0) + 1)) * 100), 100) || 50,
      };
      
      setPreviewData(repositoryData);
    } catch (err: any) {
      setError(err.message || "Failed to process CSV file for preview");
      setPreviewData(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      // Ensure we have at least a header and one data row
      if (lines.length < 2) {
        throw new Error("CSV file does not contain enough data");
      }

      // Process headers
      const headers = lines[0].split(',').map(header => header.trim());
      
      // For each data row (skip header)
      for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',').map(value => value.trim());
        
        // Skip empty lines
        if (data.length !== headers.length || data.every(cell => cell === '')) {
          continue;
        }
        
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
        const repositoryData: Repository = {
          id: uuidv4(),
          projectId: result.Project_ID,
          author: result.Author,
          email: result.Email,
          date: result.Date,
          additions: result.Additions,
          deletions: result.Deletions,
          operations: result.Operations,
          // Set additional derived fields
          name: result.Project_ID || `Imported Project ${i}`,
          description: `Contributed by ${result.Author || "Unknown"}`,
          lastActivity: result.Date || new Date().toISOString(),
          commitCount: result.Operations || 0,
          mergeRequestCount: Math.floor((result.Operations || 0) / 3) || 0,
          branchCount: Math.floor((result.Operations || 0) / 5) || 0,
          progress: Math.min(Math.floor(((result.Additions || 0) / ((result.Additions || 0) + (result.Deletions || 0) + 1)) * 100), 100) || 50,
        };
        
        // Add the repository to storage
        addRepository(repositoryData);
      }
      
      toast.success("CSV data imported successfully");
      navigate("/repositories");
    } catch (err: any) {
      setError(err.message || "Failed to process CSV file. Please check the format and try again.");
      console.error("CSV processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container py-6 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/repositories")} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Repositories
          </Button>
          <h1 className="text-2xl font-bold">Import CSV Data</h1>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Upload CSV File</h2>
              <p className="text-muted-foreground mb-4">
                Upload a CSV file containing repository data. The file should follow the required format.
              </p>
              
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="csv-file" className="text-sm font-medium">
                  Select CSV File
                </label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  File must include the required headers
                </p>
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {file && (
              <div className="bg-blue-50 p-3 rounded-md flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium text-blue-700">Selected file:</p>
                  <p className="text-sm text-blue-600">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                </div>
              </div>
            )}
            
            <div className="bg-muted rounded-md p-4">
              <h3 className="text-sm font-semibold mb-2">Expected CSV Format:</h3>
              <div className="overflow-x-auto">
                <pre className="text-xs bg-background p-2 rounded border whitespace-pre-wrap">
                  Project_ID,Author,Email,Date,Additions,Deletions,Operations
                  project-123,John Doe,john@example.com,2024-12-20T20:00:15.000+00:00,456,123,42
                </pre>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                All specified headers are required. Data types should match the expected format.
              </p>
            </div>
            
            {previewData && (
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-3 border-b">
                  <h3 className="font-semibold">Data Preview</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Project ID:</p>
                      <p className="text-sm">{previewData.projectId || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Author:</p>
                      <p className="text-sm">{previewData.author || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email:</p>
                      <p className="text-sm">{previewData.email || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Date:</p>
                      <p className="text-sm">{previewData.date || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Additions:</p>
                      <p className="text-sm">{previewData.additions || "0"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Deletions:</p>
                      <p className="text-sm">{previewData.deletions || "0"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Operations:</p>
                      <p className="text-sm">{previewData.operations || "0"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t">
                    <h4 className="text-sm font-semibold mb-2">Will be imported as:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Repository Name:</p>
                        <p className="text-sm">{previewData.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Description:</p>
                        <p className="text-sm">{previewData.description}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Last Activity:</p>
                        <p className="text-sm">{previewData.lastActivity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Commits:</p>
                        <p className="text-sm">{previewData.commitCount}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Progress:</p>
                        <p className="text-sm">{previewData.progress}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => navigate("/repositories")}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!file || isProcessing || !!error}
                className="gap-2"
              >
                <FileUp className="h-4 w-4" />
                {isProcessing ? "Importing..." : "Import Data"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
