import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Repository {
  name: string;
  description: string;
  lastActivity: string;
  commitCount: number;
  mergeRequestCount: number;
  branchCount: number;
  progress: number;
  predictedGrade?: string;
  id?: string;
  students?: Student[];
  contributorsCount?: number;
  issuesCount?: number;
  codeQuality?: number;
  testCoverage?: number;
  deploymentFrequency?: number;
  averageGrade?: string;
  createdAt?: string;
  language?: string;
  technologies?: string[];
  
  // Repository metrics fields
  projectId?: string;
  author?: string;
  email?: string;
  date?: string;
  additions?: number;
  deletions?: number;
  operations?: number;
  totalAdditions?: number;
  totalDeletions?: number;
  totalOperations?: number;
  averageOperationsPerCommit?: number;
  averageCommitsPerWeek?: number;
  link?: string;
  apiKey?: string;
  userId?: string;
  gitlabUser?: string;
  weekOfPrediction?: string;
  finalGradePrediction?: string;
  
  // CSV file URL from Supabase storage
  csvFileUrl?: string;
  storagePath?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  commitCount: number;
  grade?: string;
  lastActivity: string;
  studentNumber?: string;
  gitlabUsername?: string;
  groupNumber?: number;
}

const defaultRepositories: Repository[] = [];

// Helper function to convert Supabase repository to our app Repository format
const convertSupabaseRepo = (repo: any): Repository => {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    lastActivity: repo.last_activity || new Date().toISOString(),
    commitCount: repo.commit_count || 0,
    mergeRequestCount: 0,
    branchCount: 1,
    progress: 0,
    projectId: repo.project_id,
    author: repo.author,
    email: repo.email,
    date: repo.created_at,
    gitlabUser: repo.gitlab_user,
    additions: repo.additions || 0,
    deletions: repo.deletions || 0,
    operations: repo.operations || 0,
    weekOfPrediction: repo.week_of_prediction,
    finalGradePrediction: repo.final_grade_prediction,
    storagePath: repo.storage_path,
    createdAt: repo.created_at
  };
};

// Function to fetch repositories from Supabase
export const getRepositories = async (): Promise<Repository[]> => {
  try {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching repositories:', error);
      toast.error('Failed to fetch repositories');
      // Fallback to localStorage if Supabase fails
      const storedRepositories = localStorage.getItem('repositories');
      if (storedRepositories) {
        return JSON.parse(storedRepositories);
      } else {
        return defaultRepositories;
      }
    }

    // Convert Supabase data to Repository format
    return data.map(repo => convertSupabaseRepo(repo));
  } catch (error) {
    console.error('Error in getRepositories:', error);
    // Fallback to localStorage if Supabase fails
    const storedRepositories = localStorage.getItem('repositories');
    if (storedRepositories) {
      return JSON.parse(storedRepositories);
    } else {
      return defaultRepositories;
    }
  }
};

// Function to add a repository to Supabase
export const addRepository = async (repository: Repository): Promise<Repository> => {
  try {
    // Generate ID if not provided
    if (!repository.id) {
      repository.id = `repo-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Format for Supabase
    const supabaseRepo = {
      id: repository.id,
      name: repository.name,
      description: repository.description,
      project_id: repository.projectId,
      author: repository.author || "Anonymous",
      email: repository.email || "no-email@example.com",
      gitlab_user: repository.gitlabUser || `gitlab_${repository.author?.toLowerCase().replace(/\s+/g, "_") || "gitlab_user"}`,
      commit_count: repository.commitCount || 0,
      additions: repository.additions || Math.floor(Math.random() * 500),
      deletions: repository.deletions || Math.floor(Math.random() * 200),
      operations: repository.operations || (repository.additions || 0) + (repository.deletions || 0),
      week_of_prediction: repository.weekOfPrediction || `Week ${Math.floor(Math.random() * 52) + 1}, ${new Date().getFullYear()}`,
      final_grade_prediction: repository.finalGradePrediction || ["A", "B", "C", "D", "F"][Math.floor(Math.random() * 5)],
      last_activity: repository.lastActivity || new Date().toISOString(),
      storage_path: repository.storagePath || `repositories/${repository.id}`
    };

    const { data, error } = await supabase
      .from('repositories')
      .insert(supabaseRepo)
      .select('*')
      .single();

    if (error) {
      console.error('Error adding repository to Supabase:', error);
      toast.error('Failed to add repository to database');
      
      // Fallback to localStorage if Supabase fails
      const repositories = localStorage.getItem('repositories') ? 
        JSON.parse(localStorage.getItem('repositories') || '[]') : 
        [];
      repositories.unshift(repository);
      localStorage.setItem('repositories', JSON.stringify(repositories));
      return repository;
    }

    if (data) {
      const convertedRepo = convertSupabaseRepo(data);
      
      // Also update localStorage for offline capability
      const repositories = localStorage.getItem('repositories') ? 
        JSON.parse(localStorage.getItem('repositories') || '[]') : 
        [];
      repositories.unshift(convertedRepo);
      localStorage.setItem('repositories', JSON.stringify(repositories));
      
      // If CSV file URL was provided, upload it to storage
      if (repository.csvFileUrl) {
        await updateRepository(convertedRepo.id || '', { csvFileUrl: repository.csvFileUrl });
      }
      
      return convertedRepo;
    }
    
    throw new Error('Failed to add repository');
  } catch (error) {
    console.error('Error in addRepository:', error);
    toast.error('Failed to add repository');
    
    // Fallback to localStorage
    const repositories = localStorage.getItem('repositories') ? 
      JSON.parse(localStorage.getItem('repositories') || '[]') : 
      [];
    repositories.unshift(repository);
    localStorage.setItem('repositories', JSON.stringify(repositories));
    
    return repository;
  }
};

export const updateRepository = async (id: string, updatedRepo: Partial<Repository>): Promise<Repository | null> => {
  try {
    // Format for Supabase
    const supabaseUpdates: Record<string, any> = {};
    
    if (updatedRepo.name) supabaseUpdates.name = updatedRepo.name;
    if (updatedRepo.description) supabaseUpdates.description = updatedRepo.description;
    if (updatedRepo.projectId) supabaseUpdates.project_id = updatedRepo.projectId;
    if (updatedRepo.author) supabaseUpdates.author = updatedRepo.author;
    if (updatedRepo.email) supabaseUpdates.email = updatedRepo.email;
    if (updatedRepo.gitlabUser) supabaseUpdates.gitlab_user = updatedRepo.gitlabUser;
    if (updatedRepo.commitCount) supabaseUpdates.commit_count = updatedRepo.commitCount;
    if (updatedRepo.additions) supabaseUpdates.additions = updatedRepo.additions;
    if (updatedRepo.deletions) supabaseUpdates.deletions = updatedRepo.deletions;
    if (updatedRepo.operations) supabaseUpdates.operations = updatedRepo.operations;
    if (updatedRepo.weekOfPrediction) supabaseUpdates.week_of_prediction = updatedRepo.weekOfPrediction;
    if (updatedRepo.finalGradePrediction) supabaseUpdates.final_grade_prediction = updatedRepo.finalGradePrediction;
    if (updatedRepo.lastActivity) supabaseUpdates.last_activity = updatedRepo.lastActivity;
    if (updatedRepo.storagePath) supabaseUpdates.storage_path = updatedRepo.storagePath;
    if (updatedRepo.csvFileUrl) supabaseUpdates.csv_file_url = updatedRepo.csvFileUrl;
    
    const { data, error } = await supabase
      .from('repositories')
      .update(supabaseUpdates)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating repository in Supabase:', error);
      toast.error('Failed to update repository in database');
      
      // Fallback to localStorage
      const repositories = localStorage.getItem('repositories') ? 
        JSON.parse(localStorage.getItem('repositories') || '[]') : 
        [];
      const index = repositories.findIndex((repo: Repository) => repo.id === id);
      
      if (index === -1) {
        return null;
      }
      
      repositories[index] = { ...repositories[index], ...updatedRepo };
      localStorage.setItem('repositories', JSON.stringify(repositories));
      
      return repositories[index];
    }
    
    if (data) {
      const convertedRepo = convertSupabaseRepo(data);
      
      // Also update localStorage
      const repositories = localStorage.getItem('repositories') ? 
        JSON.parse(localStorage.getItem('repositories') || '[]') : 
        [];
      const index = repositories.findIndex((repo: Repository) => repo.id === id);
      
      if (index !== -1) {
        repositories[index] = { ...repositories[index], ...convertedRepo };
        localStorage.setItem('repositories', JSON.stringify(repositories));
      }
      
      return convertedRepo;
    }
    
    return null;
  } catch (error) {
    console.error('Error in updateRepository:', error);
    toast.error('Failed to update repository');
    
    // Fallback to localStorage
    const repositories = localStorage.getItem('repositories') ? 
      JSON.parse(localStorage.getItem('repositories') || '[]') : 
      [];
    const index = repositories.findIndex((repo: Repository) => repo.id === id);
    
    if (index === -1) {
      return null;
    }
    
    repositories[index] = { ...repositories[index], ...updatedRepo };
    localStorage.setItem('repositories', JSON.stringify(repositories));
    
    return repositories[index];
  }
};

export const deleteRepository = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('repositories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting repository from Supabase:', error);
      toast.error('Failed to delete repository from database');
      
      // Fallback to localStorage
      const repositories = localStorage.getItem('repositories') ? 
        JSON.parse(localStorage.getItem('repositories') || '[]') : 
        [];
      const newRepositories = repositories.filter((repo: Repository) => repo.id !== id);
      
      if (newRepositories.length === repositories.length) {
        return false;
      }
      
      localStorage.setItem('repositories', JSON.stringify(newRepositories));
      return true;
    }
    
    // Also update localStorage
    const repositories = localStorage.getItem('repositories') ? 
      JSON.parse(localStorage.getItem('repositories') || '[]') : 
      [];
    const newRepositories = repositories.filter((repo: Repository) => repo.id !== id);
    localStorage.setItem('repositories', JSON.stringify(newRepositories));
    
    return true;
  } catch (error) {
    console.error('Error in deleteRepository:', error);
    toast.error('Failed to delete repository');
    
    // Fallback to localStorage
    const repositories = localStorage.getItem('repositories') ? 
      JSON.parse(localStorage.getItem('repositories') || '[]') : 
      [];
    const newRepositories = repositories.filter((repo: Repository) => repo.id !== id);
    
    if (newRepositories.length === repositories.length) {
      return false;
    }
    
    localStorage.setItem('repositories', JSON.stringify(newRepositories));
    return true;
  }
};

export const getRepositoryStudents = (repositoryId: string): Student[] => {
  const repositories = localStorage.getItem('repositories') ? 
    JSON.parse(localStorage.getItem('repositories') || '[]') : 
    [];
  const repository = repositories.find((repo: Repository) => repo.id === repositoryId);
  
  if (repository && repository.students) {
    return repository.students;
  }
  
  return repositoryId === 'programming-fundamentals' ? [...programmingStudents] : [...sampleStudents];
};

export const saveRepositoryStudent = (repositoryId: string, student: Student): boolean => {
  const repositories = localStorage.getItem('repositories') ? 
    JSON.parse(localStorage.getItem('repositories') || '[]') : 
    [];
  const index = repositories.findIndex((repo: Repository) => repo.id === repositoryId);
  
  if (index === -1) return false;
  
  if (!repositories[index].students) {
    repositories[index].students = [];
  }
  
  const studentIndex = repositories[index].students!.findIndex(s => s.id === student.id);
  
  if (studentIndex >= 0) {
    repositories[index].students![studentIndex] = student;
  } else {
    repositories[index].students!.push(student);
  }
  
  localStorage.setItem('repositories', JSON.stringify(repositories));
  return true;
};

export const sampleStudents: Student[] = [];

export const programmingStudents: Student[] = [];

export const filterRepositories = (repositories: Repository[], searchTerm: string): Repository[] => {
  if (!searchTerm) {
    return repositories;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return repositories.filter(repo =>
    (repo.name?.toLowerCase().includes(lowerSearchTerm) || false) ||
    (repo.description?.toLowerCase().includes(lowerSearchTerm) || false) ||
    (repo.projectId?.toLowerCase().includes(lowerSearchTerm) || false) ||
    (repo.author?.toLowerCase().includes(lowerSearchTerm) || false) ||
    (repo.email?.toLowerCase().includes(lowerSearchTerm) || false)
  );
};

export const sortRepositories = (repositories: Repository[], sortBy: string): Repository[] => {
  switch (sortBy) {
    case 'recent':
      return repositories.sort((a, b) => {
        const aTime = new Date(a.date || a.lastActivity);
        const bTime = new Date(b.date || b.lastActivity);
        return bTime.getTime() - aTime.getTime();
      });
    case 'name':
      return repositories.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'progress':
      return repositories.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    case 'operations':
      return repositories.sort((a, b) => {
        const aOperations = a.totalOperations || a.operations || (a.additions && a.deletions ? a.additions + a.deletions : a.commitCount || 0);
        const bOperations = b.totalOperations || b.operations || (b.additions && b.deletions ? b.additions + b.deletions : b.commitCount || 0);
        return bOperations - aOperations;
      });
    case 'avgops':
      return repositories.sort((a, b) => (b.averageOperationsPerCommit || 0) - (a.averageOperationsPerCommit || 0));
    case 'avgcommits':
      return repositories.sort((a, b) => (b.averageCommitsPerWeek || 0) - (a.averageCommitsPerWeek || 0));
    default:
      return repositories;
  }
};

export const clearAllRepositories = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('repositories')
      .delete()
      .neq('id', 'placeholder'); // Delete all entries
    
    if (error) {
      console.error('Error clearing repositories in Supabase:', error);
      toast.error('Failed to clear repositories from database');
    }
  } catch (error) {
    console.error('Error in clearAllRepositories:', error);
  }
  
  // Clear localStorage as well
  localStorage.removeItem('repositories');
  localStorage.setItem('repositories', JSON.stringify([]));
};

export const uploadCSVToSupabase = async (file: File, repositoryId: string): Promise<string | null> => {
  try {
    const timestamp = new Date().getTime();
    const fileName = `metrics_${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = `repositories/${repositoryId}/${fileName}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('repositories')
      .upload(filePath, file);
      
    if (error) {
      console.error("Error uploading CSV file:", error);
      toast.error("Failed to store CSV file");
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('repositories')
      .getPublicUrl(filePath);
      
    return publicUrlData?.publicUrl || null;
  } catch (error) {
    console.error("CSV upload error:", error);
    return null;
  }
};
