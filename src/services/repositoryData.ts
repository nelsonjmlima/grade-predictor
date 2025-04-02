
/**
 * This is a compatibility file to maintain the same imports
 * as before the refactoring. It re-exports everything from our new module structure.
 */

// Re-export types
export { Repository, Student } from './types/repository.types';

// Re-export repository related functions
export { 
  getRepositories, 
  addRepository, 
  updateRepository, 
  deleteRepository,
  allRepositories
} from './repositories/repositoryService';

// Re-export student related functions
export {
  sampleStudents,
  programmingStudents,
  getRepositoryStudents,
  saveRepositoryStudent,
  processStudentEmails
} from './students/studentService';

// Re-export utility functions
export {
  generateId,
  generateProjectId,
  generateStudentId,
  enhanceRepository,
  filterRepositories,
  sortRepositories
} from './utils/repositoryUtils';

// Re-export storage functions
export {
  getRepositoriesFromStorage,
  saveRepositoriesToStorage,
  clearRepositoriesFromStorage
} from './storage/localStorageService';
