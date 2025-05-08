
// Re-export all repository functionality from new modular files
import { Repository, Student, Group } from "./types/repositoryTypes";
import { sampleStudents, programmingStudents, allRepositories } from "./types/repositoryTypes";
import { getRepositories, getRepositoryStudents, getGroups, getGroupStudents } from "./repositories/repositoryFetcher";
import { addRepository, updateRepository, deleteRepository, saveRepositoryStudent, clearAllRepositories, addGroup, addStudentToGroup, removeStudentFromGroup, deleteGroup } from "./repositories/repositoryModifier";
import { filterRepositories, sortRepositories } from "./repositories/repositoryUtils";

// Re-export types
export type { Repository, Student, Group };

// Re-export constants
export { sampleStudents, programmingStudents, allRepositories };

// Re-export functions
export { 
  getRepositories, 
  getRepositoryStudents,
  getGroups,
  getGroupStudents,
  addRepository, 
  updateRepository, 
  deleteRepository, 
  saveRepositoryStudent,
  filterRepositories,
  sortRepositories,
  clearAllRepositories,
  addGroup,
  addStudentToGroup,
  removeStudentFromGroup,
  deleteGroup
};
