
import { Student } from "./studentData";

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
  students?: Student[] | string;
  studentIds?: string[];
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
  activityTrend?: 'up' | 'down' | 'stable';
}

const defaultRepositories: Repository[] = [];

export const getRepositories = (): Repository[] => {
  const storedRepositories = localStorage.getItem('repositories');
  if (storedRepositories) {
    return JSON.parse(storedRepositories);
  } else {
    localStorage.setItem('repositories', JSON.stringify(defaultRepositories));
    return defaultRepositories;
  }
};

export const addRepository = (repository: Repository): void => {
  const repositories = getRepositories();
  
  // Generate createdAt timestamp
  if (!repository.createdAt) {
    repository.createdAt = new Date().toISOString();
  }
  
  // Generate ID if not provided
  if (!repository.id) {
    repository.id = `repo-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Ensure new repositories have the fields required for the updated table
  if (!repository.projectId) {
    repository.projectId = repository.id || `project-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!repository.author) {
    repository.author = "Anonymous";
  }
  
  if (!repository.email) {
    repository.email = "no-email@example.com";
  }
  
  if (!repository.date) {
    repository.date = repository.lastActivity || new Date().toISOString();
  }
  
  if (!repository.additions) {
    repository.additions = Math.floor(Math.random() * 500);
  }
  
  if (!repository.deletions) {
    repository.deletions = Math.floor(Math.random() * 200);
  }
  
  if (!repository.operations) {
    repository.operations = repository.additions + repository.deletions;
  }
  
  // Add the new fields with random data for demonstration
  if (!repository.totalAdditions) {
    repository.totalAdditions = Math.floor(Math.random() * 2000) + repository.additions;
  }
  
  if (!repository.totalDeletions) {
    repository.totalDeletions = Math.floor(Math.random() * 1000) + repository.deletions;
  }
  
  if (!repository.totalOperations) {
    repository.totalOperations = repository.totalAdditions + repository.totalDeletions;
  }
  
  if (!repository.averageOperationsPerCommit) {
    const commitCount = repository.commitCount || Math.floor(Math.random() * 50) + 1;
    repository.averageOperationsPerCommit = Math.round(repository.totalOperations / commitCount * 10) / 10;
  }
  
  if (!repository.averageCommitsPerWeek) {
    repository.averageCommitsPerWeek = Math.floor(Math.random() * 20) + 1;
  }
  
  // New fields for the updated header
  if (!repository.gitlabUser) {
    repository.gitlabUser = "gitlab_" + repository.author?.toLowerCase().replace(/\s+/g, "_") || "gitlab_user";
  }
  
  if (!repository.weekOfPrediction) {
    // Generate a random week in the current year
    const year = new Date().getFullYear();
    const week = Math.floor(Math.random() * 52) + 1;
    repository.weekOfPrediction = `Week ${week}, ${year}`;
  }
  
  if (!repository.finalGradePrediction) {
    const grades = ["A", "B", "C", "D", "F"];
    const randomIndex = Math.floor(Math.random() * grades.length);
    repository.finalGradePrediction = grades[randomIndex];
  }
  
  // Handle student IDs if provided
  if (repository.studentIds && repository.studentIds.length > 0) {
    repository.students = repository.studentIds.map(id => ({
      id: `student-${id}`,
      name: `Student ${id}`,
      email: `student${id}@example.com`,
      commitCount: 0,
      lastActivity: 'Never'
    }));
  }
  // Parse student emails if provided as string
  else if (repository.students && typeof repository.students === 'string') {
    const emailsText = repository.students as string;
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
  
  repositories.unshift(repository);
  localStorage.setItem('repositories', JSON.stringify(repositories));
};

export const updateRepository = (id: string, updatedRepo: Partial<Repository>): Repository | null => {
  const repositories = getRepositories();
  
  // Try to find by ID first
  let index = repositories.findIndex(repo => repo.id === id);
  
  // If not found by ID, try to find by projectId (for CSV import matching)
  if (index === -1 && updatedRepo.projectId) {
    index = repositories.findIndex(repo => 
      repo.projectId === updatedRepo.projectId
    );
  }
  
  if (index === -1) {
    return null;
  }
  
  // Handle ID change separately if needed
  if (updatedRepo.id && updatedRepo.id !== repositories[index].id) {
    // If we're changing the ID, we need to update references in other places
    const oldId = repositories[index].id;
    
    // Update the ID
    repositories[index].id = updatedRepo.id;
    
    // Remove the ID from the updatedRepo to avoid duplicate assignment
    const { id: _, ...restOfUpdates } = updatedRepo;
    
    // Merge the rest of the repositories
    repositories[index] = { ...repositories[index], ...restOfUpdates };
  } else {
    // Normal merge without ID change
    repositories[index] = { ...repositories[index], ...updatedRepo };
  }
  
  // Save to localStorage
  localStorage.setItem('repositories', JSON.stringify(repositories));
  
  return repositories[index];
};

export const deleteRepository = (id: string): boolean => {
  const repositories = getRepositories();
  const newRepositories = repositories.filter(repo => repo.id !== id);
  
  if (newRepositories.length === repositories.length) {
    return false;
  }
  
  localStorage.setItem('repositories', JSON.stringify(newRepositories));
  return true;
};

export const getRepositoryStudents = (repositoryId: string): Student[] => {
  const repositories = getRepositories();
  const repository = repositories.find(repo => repo.id === repositoryId);
  
  if (repository && repository.students) {
    return repository.students;
  }
  
  return repositoryId === 'programming-fundamentals' ? [...programmingStudents] : [...sampleStudents];
};

export const saveRepositoryStudent = (repositoryId: string, student: Student): boolean => {
  const repositories = getRepositories();
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

export const allRepositories = getRepositories();

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

export const clearAllRepositories = (): void => {
  localStorage.removeItem('repositories');
  localStorage.setItem('repositories', JSON.stringify([]));
};

// REMOVE the automatic clearing - this is the line causing the issue
// clearAllRepositories();
