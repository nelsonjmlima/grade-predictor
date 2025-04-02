
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
  
  // Additional fields for the updated table header
  projectId?: string;
  author?: string;
  email?: string;
  date?: string;
  additions?: number;
  deletions?: number;
  operations?: number;
  totalCommits?: number;
  totalAdds?: number;
  averageOperationsPerCommit?: number;
  averageCommitsPerWeek?: number;
  link?: string;
  apiKey?: string;
  userId?: string;
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
  
  // Parse student emails if provided as string
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
  
  repositories.unshift(repository);
  localStorage.setItem('repositories', JSON.stringify(repositories));
};

export const updateRepository = (id: string, updatedRepo: Partial<Repository>): Repository | null => {
  const repositories = getRepositories();
  const index = repositories.findIndex(repo => repo.id === id);
  
  if (index === -1) return null;
  
  repositories[index] = { ...repositories[index], ...updatedRepo };
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
    repo.name.toLowerCase().includes(lowerSearchTerm) ||
    repo.description.toLowerCase().includes(lowerSearchTerm)
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
      return repositories.sort((a, b) => a.name.localeCompare(b.name));
    case 'progress':
      return repositories.sort((a, b) => b.progress - a.progress);
    case 'operations':
      return repositories.sort((a, b) => {
        const aOperations = a.operations || (a.additions && a.deletions ? a.additions + a.deletions : a.commitCount || 0);
        const bOperations = b.operations || (b.additions && b.deletions ? b.additions + b.deletions : b.commitCount || 0);
        return bOperations - aOperations;
      });
    default:
      return repositories;
  }
};

export const clearAllRepositories = (): void => {
  localStorage.removeItem('repositories');
  localStorage.setItem('repositories', JSON.stringify([]));
};

// Initialize empty repositories storage
clearAllRepositories();
