
import { Repository } from "../types/repository.types";

const REPOSITORIES_KEY = 'repositories';

export const getFromStorage = <T>(key: string): T[] => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return [];
};

export const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getRepositoriesFromStorage = (): Repository[] => {
  return getFromStorage<Repository>(REPOSITORIES_KEY);
};

export const saveRepositoriesToStorage = (repositories: Repository[]): void => {
  saveToStorage(REPOSITORIES_KEY, repositories);
};

export const clearRepositoriesFromStorage = (): void => {
  localStorage.removeItem(REPOSITORIES_KEY);
  localStorage.setItem(REPOSITORIES_KEY, JSON.stringify([]));
};
