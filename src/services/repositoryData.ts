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

const defaultRepositories = [
  {
    id: 'programming-fundamentals',
    name: "Programming Fundamentals 2023",
    description: "Curso introdutório aos fundamentos de programação para alunos de Ciência da Computação",
    lastActivity: "Hoje às 13:45",
    commitCount: 127,
    mergeRequestCount: 18,
    branchCount: 5,
    progress: 68,
    predictedGrade: "B+",
    contributorsCount: 21,
    issuesCount: 32,
    codeQuality: 72,
    testCoverage: 65,
    deploymentFrequency: 4,
    averageGrade: "B",
    createdAt: "2023-09-05",
    language: "Java",
    technologies: ["Spring Boot", "JUnit", "Thymeleaf"],
    students: [
      {
        id: 'student-1',
        name: "João Silva",
        email: "joao.silva@example.com",
        commitCount: 32,
        grade: "A",
        lastActivity: "Hoje às 10:00",
        studentNumber: "2023001",
        gitlabUsername: "joao.silva",
        groupNumber: 1
      },
      {
        id: 'student-2',
        name: "Maria Oliveira",
        email: "maria.oliveira@example.com",
        commitCount: 25,
        grade: "B",
        lastActivity: "Ontem às 14:30",
        studentNumber: "2023002",
        gitlabUsername: "maria.oliveira",
        groupNumber: 1
      },
      {
        id: 'student-3',
        name: "Carlos Pereira",
        email: "carlos.pereira@example.com",
        commitCount: 45,
        grade: "A+",
        lastActivity: "Hoje às 11:45",
        studentNumber: "2023003",
        gitlabUsername: "carlos.pereira",
        groupNumber: 2
      },
      {
        id: 'student-4',
        name: "Ana Rodrigues",
        email: "ana.rodrigues@example.com",
        commitCount: 18,
        grade: "C",
        lastActivity: "2 dias atrás",
        studentNumber: "2023004",
        gitlabUsername: "ana.rodrigues",
        groupNumber: 2
      },
      {
        id: 'student-5',
        name: "Ricardo Santos",
        email: "ricardo.santos@example.com",
        commitCount: 29,
        grade: "B+",
        lastActivity: "Ontem às 16:15",
        studentNumber: "2023005",
        gitlabUsername: "ricardo.santos",
        groupNumber: 3
      }
    ]
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
    predictedGrade: "A-",
    contributorsCount: 15,
    issuesCount: 24,
    codeQuality: 81,
    testCoverage: 73,
    deploymentFrequency: 6,
    averageGrade: "A-",
    createdAt: "2023-08-15",
    language: "JavaScript",
    technologies: ["React", "Node.js", "Express"],
    students: [
      {
        id: 'student-6',
        name: "Mariana Costa",
        email: "mariana.costa@example.com",
        commitCount: 38,
        grade: "A",
        lastActivity: "Hoje às 09:15",
        studentNumber: "2023006",
        gitlabUsername: "mariana.costa",
        groupNumber: 1
      },
      {
        id: 'student-7',
        name: "Gustavo Almeida",
        email: "gustavo.almeida@example.com",
        commitCount: 21,
        grade: "C+",
        lastActivity: "Ontem às 18:00",
        studentNumber: "2023007",
        gitlabUsername: "gustavo.almeida",
        groupNumber: 1
      },
      {
        id: 'student-8',
        name: "Patrícia Nunes",
        email: "patricia.nunes@example.com",
        commitCount: 52,
        grade: "A+",
        lastActivity: "Hoje às 12:30",
        studentNumber: "2023008",
        gitlabUsername: "patricia.nunes",
        groupNumber: 2
      },
      {
        id: 'student-9',
        name: "Fernando Castro",
        email: "fernando.castro@example.com",
        commitCount: 15,
        grade: "D",
        lastActivity: "3 dias atrás",
        studentNumber: "2023009",
        gitlabUsername: "fernando.castro",
        groupNumber: 2
      },
      {
        id: 'student-10',
        name: "Isabel Gonçalves",
        email: "isabel.goncalves@example.com",
        commitCount: 31,
        grade: "B",
        lastActivity: "Ontem às 15:45",
        studentNumber: "2023010",
        gitlabUsername: "isabel.goncalves",
        groupNumber: 3
      }
    ]
  },
  {
    id: 'algorithm-analysis',
    name: "Algorithm Analysis",
    description: "Projeto de equipe para análise de desempenho de algoritmos",
    lastActivity: "3 dias atrás",
    commitCount: 56,
    mergeRequestCount: 7,
    branchCount: 2,
    progress: 42,
    predictedGrade: "C+",
    contributorsCount: 8,
    issuesCount: 19,
    codeQuality: 65,
    testCoverage: 58,
    deploymentFrequency: 2,
    averageGrade: "C+",
    createdAt: "2023-10-03",
    language: "Python",
    technologies: ["NumPy", "Pandas", "Matplotlib"],
    students: [
      {
        id: 'student-11',
        name: "Paulo Mendes",
        email: "paulo.mendes@example.com",
        commitCount: 22,
        grade: "B-",
        lastActivity: "4 dias atrás",
        studentNumber: "2023011",
        gitlabUsername: "paulo.mendes",
        groupNumber: 1
      },
      {
        id: 'student-12',
        name: "Camila Ferreira",
        email: "camila.ferreira@example.com",
        commitCount: 17,
        grade: "C",
        lastActivity: "5 dias atrás",
        studentNumber: "2023012",
        gitlabUsername: "camila.ferreira",
        groupNumber: 1
      },
      {
        id: 'student-13',
        name: "Lucas Martins",
        email: "lucas.martins@example.com",
        commitCount: 30,
        grade: "B+",
        lastActivity: "2 dias atrás",
        studentNumber: "2023013",
        gitlabUsername: "lucas.martins",
        groupNumber: 2
      },
      {
        id: 'student-14',
        name: "Juliana Costa",
        email: "juliana.costa@example.com",
        commitCount: 12,
        grade: "D+",
        lastActivity: "1 semana atrás",
        studentNumber: "2023014",
        gitlabUsername: "juliana.costa",
        groupNumber: 2
      }
    ]
  },
  {
    id: 'team-alpha-project',
    name: "Team Alpha Project",
    description: "Projeto final de Engenharia de Software para a Equipe Alpha",
    lastActivity: "Semana passada",
    commitCount: 203,
    mergeRequestCount: 25,
    branchCount: 7,
    progress: 92,
    predictedGrade: "A",
    contributorsCount: 12,
    issuesCount: 47,
    codeQuality: 88,
    testCoverage: 82,
    deploymentFrequency: 8,
    averageGrade: "A",
    createdAt: "2023-07-12",
    language: "TypeScript",
    technologies: ["Angular", "NestJS", "MongoDB"],
    students: [
      {
        id: 'student-15',
        name: "Bruno Alves",
        email: "bruno.alves@example.com",
        commitCount: 45,
        grade: "A",
        lastActivity: "2 dias atrás",
        studentNumber: "2023015",
        gitlabUsername: "bruno.alves",
        groupNumber: 1
      },
      {
        id: 'student-16',
        name: "Larissa Santos",
        email: "larissa.santos@example.com",
        commitCount: 38,
        grade: "A-",
        lastActivity: "3 dias atrás",
        studentNumber: "2023016",
        gitlabUsername: "larissa.santos",
        groupNumber: 1
      },
      {
        id: 'student-17',
        name: "Rafael Lima",
        email: "rafael.lima@example.com",
        commitCount: 42,
        grade: "A",
        lastActivity: "Ontem",
        studentNumber: "2023017",
        gitlabUsername: "rafael.lima",
        groupNumber: 2
      },
      {
        id: 'student-18',
        name: "Daniela Rocha",
        email: "daniela.rocha@example.com",
        commitCount: 35,
        grade: "A-",
        lastActivity: "Hoje",
        studentNumber: "2023018",
        gitlabUsername: "daniela.rocha",
        groupNumber: 2
      },
      {
        id: 'student-19',
        name: "Marcelo Vieira",
        email: "marcelo.vieira@example.com",
        commitCount: 43,
        grade: "A+",
        lastActivity: "Hoje",
        studentNumber: "2023019",
        gitlabUsername: "marcelo.vieira",
        groupNumber: 3
      }
    ]
  },
  {
    id: 'data-structures',
    name: "Data Structures 101",
    description: "Curso de Estruturas de Dados para estudantes do segundo ano",
    lastActivity: "2 semanas atrás",
    commitCount: 67,
    mergeRequestCount: 9,
    branchCount: 3,
    progress: 51,
    predictedGrade: "B-",
    contributorsCount: 14,
    issuesCount: 28,
    codeQuality: 70,
    testCoverage: 62,
    deploymentFrequency: 3,
    averageGrade: "B-",
    createdAt: "2023-09-18",
    language: "C++",
    technologies: ["STL", "GoogleTest"],
    students: [
      {
        id: 'student-20',
        name: "Alexandre Souza",
        email: "alexandre.souza@example.com",
        commitCount: 24,
        grade: "B",
        lastActivity: "10 dias atrás",
        studentNumber: "2023020",
        gitlabUsername: "alexandre.souza",
        groupNumber: 1
      },
      {
        id: 'student-21',
        name: "Beatriz Oliveira",
        email: "beatriz.oliveira@example.com",
        commitCount: 19,
        grade: "B-",
        lastActivity: "12 dias atrás",
        studentNumber: "2023021",
        gitlabUsername: "beatriz.oliveira",
        groupNumber: 1
      },
      {
        id: 'student-22',
        name: "Diego Pereira",
        email: "diego.pereira@example.com",
        commitCount: 28,
        grade: "B+",
        lastActivity: "8 dias atrás",
        studentNumber: "2023022",
        gitlabUsername: "diego.pereira",
        groupNumber: 2
      },
      {
        id: 'student-23',
        name: "Eduarda Machado",
        email: "eduarda.machado@example.com",
        commitCount: 15,
        grade: "C+",
        lastActivity: "2 semanas atrás",
        studentNumber: "2023023",
        gitlabUsername: "eduarda.machado",
        groupNumber: 2
      }
    ]
  },
  {
    id: 'advanced-ai',
    name: "Advanced AI Techniques",
    description: "Laboratório de técnicas avançadas de inteligência artificial",
    lastActivity: "3 dias atrás",
    commitCount: 93,
    mergeRequestCount: 14,
    branchCount: 4,
    progress: 62,
    predictedGrade: "A-",
    contributorsCount: 11,
    issuesCount: 35,
    codeQuality: 85,
    testCoverage: 77,
    deploymentFrequency: 5,
    averageGrade: "A-",
    createdAt: "2023-08-28",
    language: "Python",
    technologies: ["TensorFlow", "PyTorch", "Scikit-learn"],
    students: [
      {
        id: 'student-24',
        name: "Fábio Mendonça",
        email: "fabio.mendonca@example.com",
        commitCount: 31,
        grade: "A",
        lastActivity: "4 dias atrás",
        studentNumber: "2023024",
        gitlabUsername: "fabio.mendonca",
        groupNumber: 1
      },
      {
        id: 'student-25',
        name: "Gabriela Teixeira",
        email: "gabriela.teixeira@example.com",
        commitCount: 27,
        grade: "A-",
        lastActivity: "2 dias atrás",
        studentNumber: "2023025",
        gitlabUsername: "gabriela.teixeira",
        groupNumber: 1
      },
      {
        id: 'student-26',
        name: "Henrique Almeida",
        email: "henrique.almeida@example.com",
        commitCount: 35,
        grade: "A",
        lastActivity: "Ontem",
        studentNumber: "2023026",
        gitlabUsername: "henrique.almeida",
        groupNumber: 2
      }
    ]
  },
  {
    id: 'database-systems',
    name: "Database Systems",
    description: "Projeto prático de sistemas de banco de dados",
    lastActivity: "1 semana atrás",
    commitCount: 72,
    mergeRequestCount: 11,
    branchCount: 3,
    progress: 58,
    predictedGrade: "B",
    contributorsCount: 9,
    issuesCount: 26,
    codeQuality: 75,
    testCoverage: 68,
    deploymentFrequency: 4,
    averageGrade: "B",
    createdAt: "2023-09-30",
    language: "SQL",
    technologies: ["PostgreSQL", "Redis", "Prisma"],
    students: [
      {
        id: 'student-27',
        name: "Inês Cardoso",
        email: "ines.cardoso@example.com",
        commitCount: 23,
        grade: "B+",
        lastActivity: "5 dias atrás",
        studentNumber: "2023027",
        gitlabUsername: "ines.cardoso",
        groupNumber: 1
      },
      {
        id: 'student-28',
        name: "José Ribeiro",
        email: "jose.ribeiro@example.com",
        commitCount: 18,
        grade: "B-",
        lastActivity: "8 dias atrás",
        studentNumber: "2023028",
        gitlabUsername: "jose.ribeiro",
        groupNumber: 1
      },
      {
        id: 'student-29',
        name: "Kátia Ferreira",
        email: "katia.ferreira@example.com",
        commitCount: 24,
        grade: "B",
        lastActivity: "6 dias atrás",
        studentNumber: "2023029",
        gitlabUsername: "katia.ferreira",
        groupNumber: 2
      }
    ]
  },
  {
    id: 'mobile-development',
    name: "Mobile Development",
    description: "Disciplina de desenvolvimento de aplicativos móveis",
    lastActivity: "4 dias atrás",
    commitCount: 88,
    mergeRequestCount: 13,
    branchCount: 5,
    progress: 70,
    predictedGrade: "B+",
    contributorsCount: 16,
    issuesCount: 31,
    codeQuality: 79,
    testCoverage: 71,
    deploymentFrequency: 6,
    averageGrade: "B+",
    createdAt: "2023-08-10",
    language: "Kotlin",
    technologies: ["Android SDK", "Jetpack Compose", "Firebase"],
    students: [
      {
        id: 'student-30',
        name: "Leonardo Martins",
        email: "leonardo.martins@example.com",
        commitCount: 32,
        grade: "A-",
        lastActivity: "3 dias atrás",
        studentNumber: "2023030",
        gitlabUsername: "leonardo.martins",
        groupNumber: 1
      },
      {
        id: 'student-31',
        name: "Mônica Silva",
        email: "monica.silva@example.com",
        commitCount: 26,
        grade: "B+",
        lastActivity: "5 dias atrás",
        studentNumber: "2023031",
        gitlabUsername: "monica.silva",
        groupNumber: 1
      },
      {
        id: 'student-32',
        name: "Nuno Costa",
        email: "nuno.costa@example.com",
        commitCount: 30,
        grade: "A-",
        lastActivity: "Hoje",
        studentNumber: "2023032",
        gitlabUsername: "nuno.costa",
        groupNumber: 2
      }
    ]
  },
  {
    id: 'computer-networks',
    name: "Computer Networks",
    description: "Laboratório de redes de computadores",
    lastActivity: "6 dias atrás",
    commitCount: 61,
    mergeRequestCount: 8,
    branchCount: 2,
    progress: 45,
    predictedGrade: "C+",
    contributorsCount: 13,
    issuesCount: 22,
    codeQuality: 68,
    testCoverage: 59,
    deploymentFrequency: 3,
    averageGrade: "C+",
    createdAt: "2023-10-15",
    language: "C",
    technologies: ["Socket Programming", "Wireshark"],
    students: [
      {
        id: 'student-33',
        name: "Olívia Santos",
        email: "olivia.santos@example.com",
        commitCount: 16,
        grade: "C",
        lastActivity: "1 semana atrás",
        studentNumber: "2023033",
        gitlabUsername: "olivia.santos",
        groupNumber: 1
      },
      {
        id: 'student-34',
        name: "Pedro Alves",
        email: "pedro.alves@example.com",
        commitCount: 21,
        grade: "B-",
        lastActivity: "5 dias atrás",
        studentNumber: "2023034",
        gitlabUsername: "pedro.alves",
        groupNumber: 1
      },
      {
        id: 'student-35',
        name: "Quitéria Lima",
        email: "quiteria.lima@example.com",
        commitCount: 14,
        grade: "C+",
        lastActivity: "9 dias atrás",
        studentNumber: "2023035",
        gitlabUsername: "quiteria.lima",
        groupNumber: 2
      }
    ]
  },
  {
    id: 'software-testing',
    name: "Software Testing Methodologies",
    description: "Curso sobre metodologias de teste de software",
    lastActivity: "5 dias atrás",
    commitCount: 79,
    mergeRequestCount: 10,
    branchCount: 4,
    progress: 64,
    predictedGrade: "B",
    contributorsCount: 10,
    issuesCount: 29,
    codeQuality: 83,
    testCoverage: 90,
    deploymentFrequency: 5,
    averageGrade: "B",
    createdAt: "2023-09-12",
    language: "Java",
    technologies: ["JUnit", "Mockito", "Selenium"],
    students: [
      {
        id: 'student-36',
        name: "Ricardo Pereira",
        email: "ricardo.pereira@example.com",
        commitCount: 28,
        grade: "B+",
        lastActivity: "4 dias atrás",
        studentNumber: "2023036",
        gitlabUsername: "ricardo.pereira",
        groupNumber: 1
      },
      {
        id: 'student-37',
        name: "Sandra Oliveira",
        email: "sandra.oliveira@example.com",
        commitCount: 23,
        grade: "B",
        lastActivity: "6 dias atrás",
        studentNumber: "2023037",
        gitlabUsername: "sandra.oliveira",
        groupNumber: 1
      },
      {
        id: 'student-38',
        name: "Tiago Sousa",
        email: "tiago.sousa@example.com",
        commitCount: 32,
        grade: "A-",
        lastActivity: "2 dias atrás",
        studentNumber: "2023038",
        gitlabUsername: "tiago.sousa",
        groupNumber: 2
      }
    ]
  }
];

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
