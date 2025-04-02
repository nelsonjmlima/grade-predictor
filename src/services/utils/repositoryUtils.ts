
import { Repository } from "../types/repository.types";

export const generateId = (): string => {
  return `repo-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateProjectId = (): string => {
  return `project-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateStudentId = (): string => {
  return `student-${Math.random().toString(36).substr(2, 9)}`;
};

export const enhanceRepository = (repository: Repository): Repository => {
  // Ensure the repository has all required fields with default values
  return {
    ...repository,
    projectId: repository.projectId || repository.id || generateProjectId(),
    author: repository.author || "Anonymous",
    email: repository.email || "no-email@example.com",
    date: repository.date || repository.lastActivity || new Date().toISOString(),
    additions: repository.additions || Math.floor(Math.random() * 500),
    deletions: repository.deletions || Math.floor(Math.random() * 200),
    operations: repository.operations || (repository.additions && repository.deletions ? repository.additions + repository.deletions : repository.commitCount || 0),
    totalAdditions: repository.totalAdditions || Math.floor(Math.random() * 2000) + (repository.additions || 0),
    totalDeletions: repository.totalDeletions || Math.floor(Math.random() * 1000) + (repository.deletions || 0),
    totalOperations: repository.totalOperations || 
      (repository.totalAdditions && repository.totalDeletions ? 
        repository.totalAdditions + repository.totalDeletions : 
        (repository.additions && repository.deletions ? (repository.additions + repository.deletions) * 5 : 0)),
    averageOperationsPerCommit: repository.averageOperationsPerCommit || 
      (repository.commitCount ? Math.round(((repository.additions || 0) + (repository.deletions || 0)) / (repository.commitCount || 1) * 10) / 10 : Math.floor(Math.random() * 20) + 5),
    averageCommitsPerWeek: repository.averageCommitsPerWeek || Math.floor(Math.random() * 20) + 1,
    gitlabUser: repository.gitlabUser || "gitlab_" + (repository.author?.toLowerCase().replace(/\s+/g, "_") || "gitlab_user"),
    weekOfPrediction: repository.weekOfPrediction || `Week ${Math.floor(Math.random() * 52) + 1}, ${new Date().getFullYear()}`
  };
};

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
        const aTime = new Date(a.date || a.lastActivity || '');
        const bTime = new Date(b.date || b.lastActivity || '');
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
