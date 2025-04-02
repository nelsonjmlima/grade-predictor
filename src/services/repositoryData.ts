
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
  storageKey?: string;
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

export const getRepositories = async (): Promise<Repository[]> => {
  try {
    // Try to fetch from Supabase
    const { data: supabaseRepos, error } = await supabase
      .from('repositories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching repositories from Supabase:", error);
      // Fall back to localStorage
      return getLocalRepositories();
    }
    
    if (supabaseRepos && supabaseRepos.length > 0) {
      // Map Supabase data to our Repository interface
      const mappedRepos = supabaseRepos.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || '',
        lastActivity: repo.last_activity ? new Date(repo.last_activity).toLocaleString() : 'Never',
        commitCount: repo.commit_count || 0,
        mergeRequestCount: 0,
        branchCount: 1,
        progress: Math.floor(Math.random() * 100),
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
        csvFileUrl: repo.storage_path,
        createdAt: repo.created_at
      }));
      
      return enhanceRepositories(mappedRepos);
    }
    
    // If no data in Supabase, try localStorage
    return getLocalRepositories();
  } catch (error) {
    console.error("Error in getRepositories:", error);
    // Fall back to localStorage
    return getLocalRepositories();
  }
};

const getLocalRepositories = (): Repository[] => {
  const storedRepositories = localStorage.getItem('repositories');
  if (storedRepositories) {
    return enhanceRepositories(JSON.parse(storedRepositories));
  } else {
    localStorage.setItem('repositories', JSON.stringify(defaultRepositories));
    return enhanceRepositories(defaultRepositories);
  }
};

const enhanceRepositories = (repositories: Repository[]): Repository[] => {
  return repositories.map(repo => ({
    ...repo,
    projectId: repo.projectId || repo.id || `project-${Math.random().toString(36).substr(2, 9)}`,
    author: repo.author || "Anonymous",
    email: repo.email || "no-email@example.com",
    date: repo.date || repo.lastActivity,
    additions: repo.additions || Math.floor(Math.random() * 500),
    deletions: repo.deletions || Math.floor(Math.random() * 200),
    operations: repo.operations || (repo.additions && repo.deletions ? repo.additions + repo.deletions : repo.commitCount),
    totalAdditions: repo.totalAdditions || Math.floor(Math.random() * 2000) + (repo.additions || 0),
    totalDeletions: repo.totalDeletions || Math.floor(Math.random() * 1000) + (repo.deletions || 0),
    totalOperations: repo.totalOperations || (repo.totalAdditions && repo.totalDeletions ? repo.totalAdditions + repo.totalDeletions : repo.additions && repo.deletions ? (repo.additions + repo.deletions) * 5 : 0),
    averageOperationsPerCommit: repo.averageOperationsPerCommit || (repo.commitCount ? Math.round(((repo.additions || 0) + (repo.deletions || 0)) / repo.commitCount * 10) / 10 : Math.floor(Math.random() * 20) + 5),
    averageCommitsPerWeek: repo.averageCommitsPerWeek || Math.floor(Math.random() * 20) + 1,
    gitlabUser: repo.gitlabUser || "gitlab_" + repo.author?.toLowerCase().replace(/\s+/g, "_") || "gitlab_user",
    weekOfPrediction: repo.weekOfPrediction || generateRandomWeek(),
    finalGradePrediction: repo.finalGradePrediction || generateRandomGrade()
  }));
};

const generateRandomWeek = () => {
  const year = new Date().getFullYear();
  const week = Math.floor(Math.random() * 52) + 1;
  return `Week ${week}, ${year}`;
};

const generateRandomGrade = () => {
  const grades = ["A", "B", "C", "D", "F"];
  const randomIndex = Math.floor(Math.random() * grades.length);
  return grades[randomIndex];
};

export const addRepository = async (repository: Repository): Promise<Repository | null> => {
  try {
    // Generate ID if not provided
    const repoId = repository.id || `repo-${Math.random().toString(36).substr(2, 9)}`;
    
    // Process students if provided as a string
    if (repository.students && typeof repository.students === 'string') {
      const emailsText = repository.students as unknown as string;
      if (emailsText.trim()) {
        const emails = emailsText
          .split('\n')
          .map(email => email.trim())
          .filter(email => email.length > 0);
          
        repository.students = emails.map(email => ({
          id: `student-${Math.random().toString(36).substr(2, 9)}`,
          name: email.split('@')[0],
          email: email,
          commitCount: 0,
          lastActivity: 'Never'
        }));
      } else {
        // Empty string case
        repository.students = [];
      }
    }
    
    // Prepare data for Supabase
    const supabaseData = {
      id: repoId,
      name: repository.name,
      description: repository.description,
      project_id: repository.projectId,
      author: repository.author || "Anonymous",
      email: repository.email || "no-email@example.com",
      gitlab_user: repository.gitlabUser || "gitlab_" + repository.author?.toLowerCase().replace(/\s+/g, "_") || "gitlab_user",
      commit_count: repository.commitCount || 0,
      additions: repository.additions || Math.floor(Math.random() * 500),
      deletions: repository.deletions || Math.floor(Math.random() * 200),
      operations: repository.operations || (repository.additions && repository.deletions ? repository.additions + repository.deletions : repository.commitCount || 0),
      week_of_prediction: repository.weekOfPrediction || generateRandomWeek(),
      final_grade_prediction: repository.finalGradePrediction || generateRandomGrade(),
      last_activity: new Date().toISOString()
    };
    
    // Save to Supabase
    const { data: insertedRepo, error } = await supabase
      .from('repositories')
      .insert(supabaseData)
      .select('*')
      .single();
    
    if (error) {
      console.error("Error adding repository to Supabase:", error);
      // Fall back to localStorage
      return addToLocalStorage({...repository, id: repoId});
    }
    
    // Add to localStorage as fallback
    addToLocalStorage({...repository, id: repoId});
    
    // Return the newly created repository
    const enhancedRepo = {
      ...repository,
      id: insertedRepo.id,
    };
    
    return enhancedRepo;
  } catch (error) {
    console.error("Error in addRepository:", error);
    // Fall back to localStorage
    return addToLocalStorage(repository);
  }
};

const addToLocalStorage = (repository: Repository): Repository => {
  const repositories = getLocalRepositories();
  
  // Generate createdAt timestamp
  if (!repository.createdAt) {
    repository.createdAt = new Date().toISOString();
  }
  
  // Generate ID if not provided
  if (!repository.id) {
    repository.id = `repo-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Ensure new repositories have the fields required for the updated table
  repository = {
    ...repository,
    projectId: repository.projectId || repository.id || `project-${Math.random().toString(36).substr(2, 9)}`,
    author: repository.author || "Anonymous",
    email: repository.email || "no-email@example.com",
    date: repository.date || repository.lastActivity || new Date().toISOString(),
    additions: repository.additions || Math.floor(Math.random() * 500),
    deletions: repository.deletions || Math.floor(Math.random() * 200),
    operations: repository.operations || (repository.additions && repository.deletions ? repository.additions + repository.deletions : repository.commitCount || 0),
    totalAdditions: repository.totalAdditions || Math.floor(Math.random() * 2000) + (repository.additions || 0),
    totalDeletions: repository.totalDeletions || Math.floor(Math.random() * 1000) + (repository.deletions || 0),
    totalOperations: repository.totalOperations || (repository.totalAdditions && repository.totalDeletions ? repository.totalAdditions + repository.totalDeletions : (repository.additions && repository.deletions ? (repository.additions + repository.deletions) * 5 : 0)),
    averageOperationsPerCommit: repository.averageOperationsPerCommit || (repository.commitCount ? Math.round(((repository.additions || 0) + (repository.deletions || 0)) / repository.commitCount * 10) / 10 : Math.floor(Math.random() * 20) + 5),
    averageCommitsPerWeek: repository.averageCommitsPerWeek || Math.floor(Math.random() * 20) + 1,
    gitlabUser: repository.gitlabUser || "gitlab_" + repository.author?.toLowerCase().replace(/\s+/g, "_") || "gitlab_user",
    weekOfPrediction: repository.weekOfPrediction || generateRandomWeek(),
    finalGradePrediction: repository.finalGradePrediction || generateRandomGrade()
  };
  
  repositories.unshift(repository);
  localStorage.setItem('repositories', JSON.stringify(repositories));
  return repository;
};

export const updateRepository = async (id: string, updatedRepo: Partial<Repository>): Promise<Repository | null> => {
  try {
    // Prepare data for Supabase
    const supabaseData: Record<string, any> = {};
    
    // Map Repository fields to Supabase column names
    if (updatedRepo.name) supabaseData.name = updatedRepo.name;
    if (updatedRepo.description) supabaseData.description = updatedRepo.description;
    if (updatedRepo.projectId) supabaseData.project_id = updatedRepo.projectId;
    if (updatedRepo.author) supabaseData.author = updatedRepo.author;
    if (updatedRepo.email) supabaseData.email = updatedRepo.email;
    if (updatedRepo.gitlabUser) supabaseData.gitlab_user = updatedRepo.gitlabUser;
    if (updatedRepo.commitCount) supabaseData.commit_count = updatedRepo.commitCount;
    if (updatedRepo.additions) supabaseData.additions = updatedRepo.additions;
    if (updatedRepo.deletions) supabaseData.deletions = updatedRepo.deletions;
    if (updatedRepo.operations) supabaseData.operations = updatedRepo.operations;
    if (updatedRepo.weekOfPrediction) supabaseData.week_of_prediction = updatedRepo.weekOfPrediction;
    if (updatedRepo.finalGradePrediction) supabaseData.final_grade_prediction = updatedRepo.finalGradePrediction;
    if (updatedRepo.lastActivity) supabaseData.last_activity = updatedRepo.lastActivity;
    if (updatedRepo.csvFileUrl) supabaseData.storage_path = updatedRepo.csvFileUrl;
    
    // Update in Supabase
    const { data: updatedSupabaseRepo, error } = await supabase
      .from('repositories')
      .update(supabaseData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error("Error updating repository in Supabase:", error);
      // Fall back to localStorage
      return updateLocalRepository(id, updatedRepo);
    }
    
    // Update in localStorage as fallback
    updateLocalRepository(id, updatedRepo);
    
    // Map the updated Supabase data back to our Repository interface
    const updatedRepository: Repository = {
      id: updatedSupabaseRepo.id,
      name: updatedSupabaseRepo.name,
      description: updatedSupabaseRepo.description || '',
      lastActivity: updatedSupabaseRepo.last_activity ? new Date(updatedSupabaseRepo.last_activity).toLocaleString() : 'Never',
      commitCount: updatedSupabaseRepo.commit_count || 0,
      mergeRequestCount: 0,
      branchCount: 1,
      progress: Math.floor(Math.random() * 100),
      projectId: updatedSupabaseRepo.project_id,
      author: updatedSupabaseRepo.author,
      email: updatedSupabaseRepo.email,
      date: updatedSupabaseRepo.created_at,
      gitlabUser: updatedSupabaseRepo.gitlab_user,
      additions: updatedSupabaseRepo.additions || 0,
      deletions: updatedSupabaseRepo.deletions || 0,
      operations: updatedSupabaseRepo.operations || 0,
      weekOfPrediction: updatedSupabaseRepo.week_of_prediction,
      finalGradePrediction: updatedSupabaseRepo.final_grade_prediction,
      csvFileUrl: updatedSupabaseRepo.storage_path,
      createdAt: updatedSupabaseRepo.created_at
    };
    
    return updatedRepository;
  } catch (error) {
    console.error("Error in updateRepository:", error);
    // Fall back to localStorage
    return updateLocalRepository(id, updatedRepo);
  }
};

const updateLocalRepository = (id: string, updatedRepo: Partial<Repository>): Repository | null => {
  const repositories = getLocalRepositories();
  const index = repositories.findIndex(repo => repo.id === id);
  
  if (index === -1) {
    // If repository with this ID doesn't exist, try to find by projectId
    const projectIdIndex = repositories.findIndex(repo => 
      repo.projectId === updatedRepo.projectId
    );
    
    if (projectIdIndex === -1) {
      return null;
    }
    
    repositories[projectIdIndex] = { ...repositories[projectIdIndex], ...updatedRepo };
    localStorage.setItem('repositories', JSON.stringify(repositories));
    
    return repositories[projectIdIndex];
  }
  
  repositories[index] = { ...repositories[index], ...updatedRepo };
  localStorage.setItem('repositories', JSON.stringify(repositories));
  
  return repositories[index];
};

export const deleteRepository = async (id: string): Promise<boolean> => {
  try {
    // Delete from Supabase
    const { error } = await supabase
      .from('repositories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting repository from Supabase:", error);
      // Fall back to localStorage
      return deleteFromLocalStorage(id);
    }
    
    // Delete from localStorage as fallback
    deleteFromLocalStorage(id);
    
    return true;
  } catch (error) {
    console.error("Error in deleteRepository:", error);
    // Fall back to localStorage
    return deleteFromLocalStorage(id);
  }
};

const deleteFromLocalStorage = (id: string): boolean => {
  const repositories = getLocalRepositories();
  const newRepositories = repositories.filter(repo => repo.id !== id);
  
  if (newRepositories.length === repositories.length) {
    return false;
  }
  
  localStorage.setItem('repositories', JSON.stringify(newRepositories));
  return true;
};

export const getRepositoryStudents = (repositoryId: string): Student[] => {
  const repositories = getLocalRepositories();
  const repository = repositories.find(repo => repo.id === repositoryId);
  
  if (repository && repository.students) {
    return repository.students;
  }
  
  return repositoryId === 'programming-fundamentals' ? [...programmingStudents] : [...sampleStudents];
};

export const saveRepositoryStudent = (repositoryId: string, student: Student): boolean => {
  const repositories = getLocalRepositories();
  const index = repositories.findIndex(repo => repo.id === repositoryId);
  
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
      return [...repositories].sort((a, b) => {
        const aTime = new Date(a.date || a.lastActivity);
        const bTime = new Date(b.date || b.lastActivity);
        return bTime.getTime() - aTime.getTime();
      });
    case 'name':
      return [...repositories].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'progress':
      return [...repositories].sort((a, b) => (b.progress || 0) - (a.progress || 0));
    case 'operations':
      return [...repositories].sort((a, b) => {
        const aOperations = a.totalOperations || a.operations || (a.additions && a.deletions ? a.additions + a.deletions : a.commitCount || 0);
        const bOperations = b.totalOperations || b.operations || (b.additions && b.deletions ? b.additions + b.deletions : b.commitCount || 0);
        return bOperations - aOperations;
      });
    case 'avgops':
      return [...repositories].sort((a, b) => (b.averageOperationsPerCommit || 0) - (a.averageOperationsPerCommit || 0));
    case 'avgcommits':
      return [...repositories].sort((a, b) => (b.averageCommitsPerWeek || 0) - (a.averageCommitsPerWeek || 0));
    default:
      return repositories;
  }
};

export const clearAllRepositories = (): void => {
  localStorage.removeItem('repositories');
  localStorage.setItem('repositories', JSON.stringify([]));
};

// Initialize empty repositories storage if not exists
const initializeLocalStorage = () => {
  if (!localStorage.getItem('repositories')) {
    localStorage.setItem('repositories', JSON.stringify([]));
  }
};

initializeLocalStorage();
