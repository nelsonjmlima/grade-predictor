
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
}

export interface Student {
  id: string;
  name: string;
  email: string;
  commitCount: number;
  grade?: string;
  lastActivity: string;
}

// Predefined repositories
const predefinedRepositories = [
  {
    id: 'programming-fundamentals',
    name: "Programming Fundamentals 2023",
    description: "Curso introdutório aos fundamentos de programação para alunos de Ciência da Computação",
    lastActivity: "Hoje às 13:45",
    commitCount: 127,
    mergeRequestCount: 18,
    branchCount: 5,
    progress: 68,
    predictedGrade: "B+"
  },
  {
    id: 'web-development',
    name: "Web Development Course",
    description: "Repositório do curso de desenvolvimento web para CS301",
    lastActivity: "Ontem às 09:22",
    commitCount: 84,
    mergeRequestCount: 12,
    branchCount: 3,
    progress: 75,
    predictedGrade: "A-"
  },
  {
    id: 'algorithm-analysis',
    name: "Algorithm Analysis",
    description: "Projeto de equipe para análise de desempenho de algoritmos",
    lastActivity: "3 dias atrás",
    commitCount: 56,
    mergeRequestCount: 7,
    branchCount: 2,
    progress: 42
  },
  {
    id: 'team-alpha-project',
    name: "Team Alpha Project",
    description: "Projeto final de Engenharia de Software para a Equipe Alpha",
    lastActivity: "Semana passada",
    commitCount: 203,
    mergeRequestCount: 25,
    branchCount: 7,
    progress: 92
  },
  {
    id: 'data-structures',
    name: "Data Structures 101",
    description: "Curso de Estruturas de Dados para estudantes do segundo ano",
    lastActivity: "2 semanas atrás",
    commitCount: 67,
    mergeRequestCount: 9,
    branchCount: 3,
    progress: 51
  }
];

// User-created repositories storage
// Attempt to load from localStorage if available
const loadUserRepositories = (): Repository[] => {
  try {
    const saved = localStorage.getItem('userRepositories');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading repositories from localStorage:", error);
    return [];
  }
};

// Combined repositories (predefined + user-created)
let userRepositories = loadUserRepositories();
export let allRepositories = [...predefinedRepositories, ...userRepositories];

// Function to add a new repository
export const addRepository = (repository: Repository): void => {
  // Add timestamp
  const newRepo = {
    ...repository,
    lastActivity: "Just now",
    commitCount: repository.commitCount || 0,
    mergeRequestCount: repository.mergeRequestCount || 0,
    branchCount: repository.branchCount || 1,
    progress: repository.progress || 0,
  };
  
  userRepositories.push(newRepo);
  
  // Update the combined repositories
  allRepositories = [...predefinedRepositories, ...userRepositories];
  
  // Save to localStorage for persistence
  try {
    localStorage.setItem('userRepositories', JSON.stringify(userRepositories));
  } catch (error) {
    console.error("Error saving repositories to localStorage:", error);
  }
};

export const sampleStudents: Student[] = [
  {
    id: 'student-1',
    name: "João Silva",
    email: "joao.silva@example.com",
    commitCount: 32,
    grade: "A",
    lastActivity: "Hoje às 10:00"
  },
  {
    id: 'student-2',
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    commitCount: 25,
    grade: "B",
    lastActivity: "Ontem às 14:30"
  },
  {
    id: 'student-3',
    name: "Carlos Pereira",
    email: "carlos.pereira@example.com",
    commitCount: 45,
    grade: "A+",
    lastActivity: "Hoje às 11:45"
  },
  {
    id: 'student-4',
    name: "Ana Rodrigues",
    email: "ana.rodrigues@example.com",
    commitCount: 18,
    grade: "C",
    lastActivity: "2 dias atrás"
  },
  {
    id: 'student-5',
    name: "Ricardo Santos",
    email: "ricardo.santos@example.com",
    commitCount: 29,
    grade: "B+",
    lastActivity: "Ontem às 16:15"
  }
];

export const programmingStudents: Student[] = [
  {
    id: 'student-6',
    name: "Mariana Costa",
    email: "mariana.costa@example.com",
    commitCount: 38,
    grade: "A",
    lastActivity: "Hoje às 09:15"
  },
  {
    id: 'student-7',
    name: "Gustavo Almeida",
    email: "gustavo.almeida@example.com",
    commitCount: 21,
    grade: "C+",
    lastActivity: "Ontem às 18:00"
  },
  {
    id: 'student-8',
    name: "Patrícia Nunes",
    email: "patricia.nunes@example.com",
    commitCount: 52,
    grade: "A+",
    lastActivity: "Hoje às 12:30"
  },
  {
    id: 'student-9',
    name: "Fernando Castro",
    email: "fernando.castro@example.com",
    commitCount: 15,
    grade: "D",
    lastActivity: "3 dias atrás"
  },
  {
    id: 'student-10',
    name: "Isabel Gonçalves",
    email: "isabel.goncalves@example.com",
    commitCount: 31,
    grade: "B",
    lastActivity: "Ontem às 15:45"
  }
];

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
      // Sort by lastActivity (assuming it's a string in "Today at HH:MM" format)
      return repositories.sort((a, b) => {
        const aTime = new Date(a.lastActivity);
        const bTime = new Date(b.lastActivity);
        return bTime.getTime() - aTime.getTime();
      });
    case 'name':
      return repositories.sort((a, b) => a.name.localeCompare(b.name));
    case 'progress':
      return repositories.sort((a, b) => b.progress - a.progress);
    default:
      return repositories;
  }
};
