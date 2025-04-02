
import { Repository, Student } from "../types/repository.types";
import { getRepositoriesFromStorage, saveRepositoriesToStorage } from "../storage/localStorageService";
import { generateStudentId } from "../utils/repositoryUtils";

export const sampleStudents: Student[] = [];

export const programmingStudents: Student[] = [];

export const getRepositoryStudents = (repositoryId: string): Student[] => {
  const repositories = getRepositoriesFromStorage();
  const repository = repositories.find(repo => repo.id === repositoryId);
  
  if (repository && repository.students) {
    return repository.students;
  }
  
  return repositoryId === 'programming-fundamentals' ? [...programmingStudents] : [...sampleStudents];
};

export const saveRepositoryStudent = (repositoryId: string, student: Student): boolean => {
  const repositories = getRepositoriesFromStorage();
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
  
  saveRepositoriesToStorage(repositories);
  return true;
};

export const processStudentEmails = (emailsText: string): Student[] => {
  if (!emailsText.trim()) return [];
  
  return emailsText
    .split('\n')
    .map(email => email.trim())
    .filter(email => email.length > 0)
    .map(email => ({
      id: generateStudentId(),
      name: email.split('@')[0],
      email: email,
      commitCount: 0,
      lastActivity: 'Never'
    }));
};
