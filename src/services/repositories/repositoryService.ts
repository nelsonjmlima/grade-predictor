
import { Repository, Student } from "../types/repository.types";
import { getRepositoriesFromStorage, saveRepositoriesToStorage } from "../storage/localStorageService";
import { enhanceRepository, generateId } from "../utils/repositoryUtils";
import { processStudentEmails } from "../students/studentService";

const defaultRepositories: Repository[] = [];

export const getRepositories = (): Repository[] => {
  const storedRepositories = getRepositoriesFromStorage();
  if (storedRepositories.length > 0) {
    return storedRepositories;
  } else {
    saveRepositoriesToStorage(defaultRepositories);
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
    repository.id = generateId();
  }
  
  // Parse student emails if provided as string
  if (repository.students && typeof repository.students === 'string') {
    repository.students = processStudentEmails(repository.students as unknown as string);
  }
  
  // Enhance repository with additional fields
  const enhancedRepo = enhanceRepository(repository);
  
  repositories.unshift(enhancedRepo);
  saveRepositoriesToStorage(repositories);
};

export const updateRepository = (id: string, updatedRepo: Partial<Repository>): Repository | null => {
  const repositories = getRepositoriesFromStorage();
  
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
  saveRepositoriesToStorage(repositories);
  
  return repositories[index];
};

export const deleteRepository = (id: string): boolean => {
  const repositories = getRepositoriesFromStorage();
  const newRepositories = repositories.filter(repo => repo.id !== id);
  
  if (newRepositories.length === repositories.length) {
    return false;
  }
  
  saveRepositoriesToStorage(newRepositories);
  return true;
};

export const allRepositories = getRepositories();
