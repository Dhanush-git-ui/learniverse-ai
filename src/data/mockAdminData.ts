import { AdminAssessment, RoleTemplate } from '../types/adminAssessment';

export const INITIAL_ASSESSMENTS: AdminAssessment[] = [
  {
    id: 'asmt-1',
    title: 'Communication - Listening Skills',
    publishedOn: '12 October 2026, 03:09 PM',
    startTime: '12 October 2026, 04:00 PM',
    endTime: '18 October 2026, 11:50 PM',
    totalScore: 60,
    totalTime: 45,
    status: 'In Progress',
    createdBy: 'Learniverse Admin',
    sections: [
      {
        id: 'sec-comm-1',
        name: 'Conversational Comprehension',
        type: 'Communication',
        timeLimit: 25,
        questionsCount: 20,
        score: 30,
        questionBreakdown: [
          { id: 'qb-1', topic: 'Active Listening', subTopic: 'Audio Clues', difficulty: 'Easy', tags: 'CORE', count: 10 },
          { id: 'qb-2', topic: 'Business English', subTopic: 'Email Context', difficulty: 'Medium', tags: 'CORE', count: 10 }
        ]
      },
      {
        id: 'sec-comm-2',
        name: 'Audio Articulation & Pronunciation',
        type: 'Audio',
        timeLimit: 20,
        questionsCount: 15,
        score: 30,
        questionBreakdown: [
          { id: 'qb-3', topic: 'Pronunciation', subTopic: 'Phonetics', difficulty: 'Easy', tags: 'VOCAL', count: 15 }
        ]
      }
    ]
  },
  {
    id: 'asmt-2',
    title: 'Coding - Data Structure and Algorithm',
    publishedOn: '12 October 2026, 03:03 PM',
    startTime: '12 October 2026, 04:00 PM',
    endTime: '18 October 2026, 11:50 PM',
    totalScore: 500,
    totalTime: 120,
    status: 'In Progress',
    createdBy: 'Learniverse Admin',
    sections: [
      {
        id: 'sec-dsa-1',
        name: 'Competitive Programming Skills',
        type: 'Coding',
        timeLimit: 60,
        questionsCount: 4,
        score: 250,
        questionBreakdown: [
          { id: 'qb-4', topic: 'DSA', subTopic: 'Dynamic Programming', difficulty: 'Hard', tags: 'ALGO', count: 2 },
          { id: 'qb-5', topic: 'DSA', subTopic: 'Trees & Graphs', difficulty: 'Medium', tags: 'CORE', count: 2 }
        ]
      },
      {
        id: 'sec-dsa-2',
        name: 'Core CS Foundations MCQ',
        type: 'MCQ',
        timeLimit: 40,
        questionsCount: 30,
        score: 150,
        questionBreakdown: [
          { id: 'qb-6', topic: 'CS Fundamentals', subTopic: 'OS & DBMS', difficulty: 'Medium', tags: 'CORE', count: 30 }
        ]
      },
      {
        id: 'sec-dsa-3',
        name: 'Database Query Optimization',
        type: 'SQL',
        timeLimit: 20,
        questionsCount: 2,
        score: 100,
        questionBreakdown: [
          { id: 'qb-7', topic: 'SQL', subTopic: 'Joins & Aggregations', difficulty: 'Medium', tags: 'QUERY', count: 2 }
        ]
      }
    ]
  }
];

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'full-stack',
    title: 'Full Stack Developer',
    sectionsCount: 6,
    experience: '2-4Yrs',
    description: 'Comprehensive screening covering frontend UI, backend services, relational databases, Node.js, and coding challenges.',
    sections: [
      {
        id: 'sec-fs-1',
        name: 'Front End Technical MCQ Test',
        type: 'MCQ',
        timeLimit: 25,
        questionsCount: 41,
        score: 41,
        questionBreakdown: [
          { id: 'qb-fs-1', topic: 'HTML and CSS', subTopic: 'Tags', difficulty: 'Easy', tags: '-', count: 25 },
          { id: 'qb-fs-2', topic: 'HTML and CSS', subTopic: 'Text', difficulty: 'Medium', tags: '-', count: 10 },
          { id: 'qb-fs-3', topic: 'Javascript', subTopic: 'Variables', difficulty: 'Easy', tags: '-', count: 3 },
          { id: 'qb-fs-4', topic: 'Javascript', subTopic: 'Variables', difficulty: 'Medium', tags: '-', count: 3 }
        ]
      },
      {
        id: 'sec-fs-2',
        name: 'Backend Development Technical MCQ Test',
        type: 'MCQ',
        timeLimit: 30,
        questionsCount: 30,
        score: 30,
        questionBreakdown: [
          { id: 'qb-fs-5', topic: 'Backend Architecture', subTopic: 'REST APIs', difficulty: 'Medium', tags: '-', count: 15 },
          { id: 'qb-fs-6', topic: 'Server Security', subTopic: 'Auth & JWT', difficulty: 'Medium', tags: '-', count: 15 }
        ]
      },
      {
        id: 'sec-fs-3',
        name: 'SQL and Database Expertise Test',
        type: 'SQL',
        timeLimit: 25,
        questionsCount: 30,
        score: 30,
        questionBreakdown: [
          { id: 'qb-fs-7', topic: 'SQL', subTopic: 'Indexing & Complex Joins', difficulty: 'Medium', tags: '-', count: 30 }
        ]
      },
      {
        id: 'sec-fs-4',
        name: 'Node.js Technical Assessment',
        type: 'MCQ',
        timeLimit: 10,
        questionsCount: 7,
        score: 7,
        questionBreakdown: [
          { id: 'qb-fs-8', topic: 'Node.js', subTopic: 'Event Loop & Streams', difficulty: 'Hard', tags: '-', count: 7 }
        ]
      },
      {
        id: 'sec-fs-5',
        name: 'PHP Development Skills Assessment',
        type: 'MCQ',
        timeLimit: 30,
        questionsCount: 25,
        score: 25,
        questionBreakdown: [
          { id: 'qb-fs-9', topic: 'PHP', subTopic: 'OOP & MVC', difficulty: 'Medium', tags: '-', count: 25 }
        ]
      },
      {
        id: 'sec-fs-6',
        name: 'Competitive Programming Skills',
        type: 'Coding',
        timeLimit: 45,
        questionsCount: 38,
        score: 38,
        questionBreakdown: [
          { id: 'qb-fs-10', topic: 'DSA', subTopic: 'Algorithms & Arrays', difficulty: 'Medium', tags: '-', count: 38 }
        ]
      }
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    sectionsCount: 1,
    experience: '2-4Yrs',
    description: 'Focused assessment on modern Web UI, React components, CSS layouts, and performance.',
    sections: [
      {
        id: 'sec-fe-1',
        name: 'Modern Frontend & React Skills',
        type: 'MCQ',
        timeLimit: 35,
        questionsCount: 30,
        score: 60,
        questionBreakdown: [
          { id: 'qb-fe-1', topic: 'React', subTopic: 'Hooks & State', difficulty: 'Medium', tags: 'CORE', count: 15 },
          { id: 'qb-fe-2', topic: 'JavaScript', subTopic: 'ES6+ & Async', difficulty: 'Medium', tags: 'CORE', count: 15 }
        ]
      }
    ]
  },
  {
    id: 'java-dev',
    title: 'Java Developer',
    sectionsCount: 4,
    experience: '2-4Yrs',
    description: 'Enterprise Java, Spring Boot, OOP concepts, multi-threading, and backend systems.',
    sections: [
      {
        id: 'sec-jv-1',
        name: 'Java Fundamentals & OOP',
        type: 'MCQ',
        timeLimit: 30,
        questionsCount: 25,
        score: 50,
        questionBreakdown: [
          { id: 'qb-jv-1', topic: 'Java', subTopic: 'Collections & Streams', difficulty: 'Medium', tags: 'OOP', count: 25 }
        ]
      },
      {
        id: 'sec-jv-2',
        name: 'Spring Boot & Microservices',
        type: 'MCQ',
        timeLimit: 25,
        questionsCount: 20,
        score: 40,
        questionBreakdown: [
          { id: 'qb-jv-2', topic: 'Spring', subTopic: 'Dependency Injection', difficulty: 'Medium', tags: 'FRAMEWORK', count: 20 }
        ]
      }
    ]
  },
  {
    id: 'mern-dev',
    title: 'Mern Developer',
    sectionsCount: 3,
    experience: '2-4Yrs',
    description: 'MongoDB, Express.js, React.js, and Node.js full stack capabilities.',
    sections: [
      {
        id: 'sec-mr-1',
        name: 'MERN Stack Concepts',
        type: 'MCQ',
        timeLimit: 40,
        questionsCount: 35,
        score: 70,
        questionBreakdown: [
          { id: 'qb-mr-1', topic: 'Full Stack', subTopic: 'MERN Integration', difficulty: 'Medium', tags: 'WEB', count: 35 }
        ]
      }
    ]
  },
  {
    id: 'ase',
    title: 'Associate Software Engineer',
    sectionsCount: 2,
    experience: '2-4Yrs',
    description: 'General engineering fundamentals, aptitude, core algorithms, and code logic.',
    sections: [
      {
        id: 'sec-ase-1',
        name: 'Analytical & Programming Aptitude',
        type: 'MCQ',
        timeLimit: 45,
        questionsCount: 30,
        score: 60,
        questionBreakdown: [
          { id: 'qb-ase-1', topic: 'CS Fundamentals', subTopic: 'Logic & Code Output', difficulty: 'Easy', tags: 'APTITUDE', count: 30 }
        ]
      }
    ]
  },
  {
    id: 'react-dev',
    title: 'ReactJS Developer',
    sectionsCount: 2,
    experience: '2-4Yrs',
    description: 'Deep dive into React lifecycle, hooks, Redux/Zustand, and component architecture.',
    sections: [
      {
        id: 'sec-rc-1',
        name: 'ReactJS Deep Dive',
        type: 'MCQ',
        timeLimit: 30,
        questionsCount: 25,
        score: 50,
        questionBreakdown: [
          { id: 'qb-rc-1', topic: 'React', subTopic: 'Custom Hooks & Context', difficulty: 'Medium', tags: 'UI', count: 25 }
        ]
      }
    ]
  },
  {
    id: 'backend-dev',
    title: 'Backend Developer',
    sectionsCount: 5,
    experience: '2-4Yrs',
    description: 'System design, database transactions, concurrency, caching, and API standards.',
    sections: [
      {
        id: 'sec-be-1',
        name: 'Backend Architecture & Databases',
        type: 'MCQ',
        timeLimit: 40,
        questionsCount: 35,
        score: 70,
        questionBreakdown: [
          { id: 'qb-be-1', topic: 'Backend', subTopic: 'Scalability & Caching', difficulty: 'Hard', tags: 'SYSTEM', count: 35 }
        ]
      }
    ]
  },
  {
    id: 'python-dev',
    title: 'Python Developer',
    sectionsCount: 2,
    experience: '2-4Yrs',
    description: 'Pythonic patterns, memory management, generators, decorators, and Django/FastAPI.',
    sections: [
      {
        id: 'sec-py-1',
        name: 'Pythonic Programming & Frameworks',
        type: 'MCQ',
        timeLimit: 30,
        questionsCount: 25,
        score: 50,
        questionBreakdown: [
          { id: 'qb-py-1', topic: 'Python', subTopic: 'Data Structures & OOP', difficulty: 'Medium', tags: 'CORE', count: 25 }
        ]
      }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    sectionsCount: 1,
    experience: '2-4Yrs',
    description: 'Statistical modeling, machine learning algorithms, NumPy/Pandas, and feature engineering.',
    sections: [
      {
        id: 'sec-ds-1',
        name: 'Machine Learning & Statistics',
        type: 'MCQ',
        timeLimit: 45,
        questionsCount: 30,
        score: 60,
        questionBreakdown: [
          { id: 'qb-ds-1', topic: 'Data Science', subTopic: 'Model Evaluation', difficulty: 'Hard', tags: 'AI', count: 30 }
        ]
      }
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    sectionsCount: 2,
    experience: '2-4Yrs',
    description: 'SQL aggregations, dashboarding principles, business analytics, and data cleansing.',
    sections: [
      {
        id: 'sec-da-1',
        name: 'Business Analytics & SQL',
        type: 'SQL',
        timeLimit: 35,
        questionsCount: 20,
        score: 40,
        questionBreakdown: [
          { id: 'qb-da-1', topic: 'SQL', subTopic: 'Window Functions', difficulty: 'Medium', tags: 'ANALYTICS', count: 20 }
        ]
      }
    ]
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    sectionsCount: 3,
    experience: '2-4Yrs',
    description: 'ETL pipelines, distributed storage (HDFS/S3), Spark, Airflow, and data warehousing.',
    sections: [
      {
        id: 'sec-de-1',
        name: 'ETL & Big Data Systems',
        type: 'MCQ',
        timeLimit: 40,
        questionsCount: 30,
        score: 60,
        questionBreakdown: [
          { id: 'qb-de-1', topic: 'Data Engineering', subTopic: 'Streaming & Batch', difficulty: 'Hard', tags: 'DATA', count: 30 }
        ]
      }
    ]
  },
  {
    id: 'sql-dev',
    title: 'SQL Developer',
    sectionsCount: 2,
    experience: '2-4Yrs',
    description: 'Stored procedures, query optimization, indexing strategies, and relational schema design.',
    sections: [
      {
        id: 'sec-sql-1',
        name: 'Relational Database Mastery',
        type: 'SQL',
        timeLimit: 30,
        questionsCount: 25,
        score: 50,
        questionBreakdown: [
          { id: 'qb-sql-1', topic: 'SQL', subTopic: 'Complex Joins & Subqueries', difficulty: 'Medium', tags: 'DB', count: 25 }
        ]
      }
    ]
  }
];

export const LEARNIVERSE_SAMPLE_QUESTIONS = [
  {
    id: 'q-101',
    prompt: 'What is the purpose of wrapper classes in Java?',
    topic: 'Java',
    subTopic: 'Object Oriented Programming',
    difficulty: 'Easy',
    tags: 'CORE',
    options: [
      'To provide a mechanism to convert primitive into object and object into primitive',
      'To speed up compilation of large Java packages',
      'To hide private methods from reflection APIs',
      'To wrap network sockets in safe stream handlers'
    ],
    correctAnswer: 'A',
    explanation: 'Wrapper classes in Java (such as Integer, Double, Boolean) wrap primitive data types into objects, allowing them to be used with Java Collections frameworks and generics.'
  },
  {
    id: 'q-102',
    prompt: 'What is the output of the following code?\nconst a = [1, 2, 3];\nconst b = a;\nb.push(4);\nconsole.log(a.length);',
    topic: 'Javascript',
    subTopic: 'Variables',
    difficulty: 'Easy',
    tags: 'JS',
    options: ['3', '4', 'undefined', 'TypeError'],
    correctAnswer: 'B',
    explanation: 'In JavaScript, arrays are assigned by reference. Modifying array `b` directly mutates `a`, so `a.length` becomes 4.'
  },
  {
    id: 'q-103',
    prompt: 'What will happen if we try to compile and run the following C++ code with a non-type template parameter passing a double?',
    topic: 'DSA',
    subTopic: 'Compilation & Types',
    difficulty: 'Medium',
    tags: 'CPP',
    options: [
      'It compiles cleanly in standard C++17',
      'Compilation error: Floating-point values were historically disallowed as non-type template parameters prior to C++20',
      'It triggers a runtime segmentation fault',
      'The double value is implicitly truncated to an integer at runtime'
    ],
    correctAnswer: 'B',
    explanation: 'Prior to C++20, floating point types could not be used as non-type template parameters, resulting in a compilation error.'
  },
  {
    id: 'q-104',
    prompt: 'Which index type is best suited in PostgreSQL for full-text search against unstructured document text columns?',
    topic: 'SQL',
    subTopic: 'Indexing',
    difficulty: 'Medium',
    tags: 'POSTGRES',
    options: ['B-Tree', 'GIN (Generalized Inverted Index)', 'Hash', 'BRIN'],
    correctAnswer: 'B',
    explanation: 'GIN indexes are ideal when multiple values or lexemes are mapped to a single row, which is the standard mechanism for PostgreSQL tsvector full-text search.'
  },
  {
    id: 'q-105',
    prompt: 'How does the Node.js event loop handle unhandled Promise rejections during asynchronous microtask execution?',
    topic: 'CS Fundamentals',
    subTopic: 'Event Loop',
    difficulty: 'Hard',
    tags: 'NODE',
    options: [
      'They are ignored silently in modern Node.js versions',
      'They trigger an unhandledRejection event and terminate the process with a non-zero exit code in Node.js 15+',
      'They are automatically pushed to the macrotask timer queue',
      'The worker thread halts while the main thread continues'
    ],
    correctAnswer: 'B',
    explanation: 'Modern Node.js versions default to unhandled-rejections=throw, terminating the process with an uncaught exception code unless a process-level listener catches it.'
  },
  {
    id: 'q-106',
    prompt: 'Which HTML5 semantic element should encapsulate autonomous, distributable composition such as a blog post or news story?',
    topic: 'HTML and CSS',
    subTopic: 'Tags',
    difficulty: 'Easy',
    tags: 'HTML5',
    options: ['<article>', '<section>', '<aside>', '<main>'],
    correctAnswer: 'A',
    explanation: '<article> is specifically intended to represent an independent, self-contained piece of content that could stand alone.'
  },
  {
    id: 'q-107',
    prompt: 'What CSS property allows text to truncate with an ellipsis (...) when overflowing its container?',
    topic: 'HTML and CSS',
    subTopic: 'Text',
    difficulty: 'Medium',
    tags: 'CSS3',
    options: [
      'text-overflow: ellipsis; along with overflow: hidden; white-space: nowrap;',
      'overflow: ellipsis;',
      'text-truncate: true;',
      'text-wrap: dot;'
    ],
    correctAnswer: 'A',
    explanation: 'To truncate text with an ellipsis, CSS requires text-overflow: ellipsis combined with overflow: hidden and white-space: nowrap.'
  },
  {
    id: 'q-108',
    prompt: 'In React 18, what is the main purpose of the `useTransition` hook?',
    topic: 'React',
    subTopic: 'Concurrent Features',
    difficulty: 'Hard',
    tags: 'REACT18',
    options: [
      'To mark certain state updates as non-blocking transitions so urgent updates like typing remain responsive',
      'To manage CSS page entrance and exit animations',
      'To create synchronous transitions between Redux actions',
      'To convert promises into React suspense boundaries automatically'
    ],
    correctAnswer: 'A',
    explanation: 'useTransition allows developers to mark state updates as non-urgent transitions, keeping the user interface snappy even during heavy re-renders.'
  },
  {
    id: 'q-109',
    prompt: 'What is the time complexity to find the median of two sorted arrays of lengths m and n using binary search?',
    topic: 'DSA',
    subTopic: 'Binary Search',
    difficulty: 'Hard',
    tags: 'ALGO',
    options: ['O(log(min(m, n)))', 'O(m + n)', 'O(log(m + n))', 'O(m * n)'],
    correctAnswer: 'A',
    explanation: 'By partitioning the smaller of the two arrays using binary search, the median can be discovered in O(log(min(m, n))) time.'
  },
  {
    id: 'q-110',
    prompt: 'What is the GIL (Global Interpreter Lock) in CPython and why does it exist?',
    topic: 'Python',
    subTopic: 'Concurrency & Memory',
    difficulty: 'Medium',
    tags: 'CPYTHON',
    options: [
      'A mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously',
      'A garbage collection lock that prevents memory fragmentation during malloc calls',
      'A security boundary that isolates global variables across virtual environments',
      'A compiler cache lock that serializes module bytecode compilation'
    ],
    correctAnswer: 'A',
    explanation: 'The GIL prevents multi-threaded race conditions in CPython because CPython memory management and reference counting is not inherently thread-safe.'
  }
];

export const INITIAL_MY_QUESTIONS = [
  {
    id: 'my-q-1',
    prompt: 'What is the key difference between optimistic locking and pessimistic locking in distributed systems?',
    topic: 'CS Fundamentals',
    subTopic: 'Concurrency',
    difficulty: 'Medium' as const,
    tags: 'DISTRIBUTED',
    options: [
      'Optimistic locking verifies record versions at commit time; pessimistic locking holds locks during the transaction',
      'Optimistic locking locks the entire database; pessimistic locking locks individual rows',
      'Pessimistic locking does not require transaction rollbacks',
      'Optimistic locking is only supported in NoSQL databases'
    ],
    correctAnswer: 'A',
    explanation: 'Optimistic locking assumes conflict is rare and validates before write; pessimistic locking acquires an exclusive lock upfront to guarantee isolation.',
    library: 'My Questions' as const,
    createdAt: '14 October 2026'
  },
  {
    id: 'my-q-2',
    prompt: 'Which HTTP status code should be returned when a valid JWT token has expired?',
    topic: 'Backend Architecture',
    subTopic: 'Authentication',
    difficulty: 'Easy' as const,
    tags: 'AUTH',
    options: ['401 Unauthorized', '403 Forbidden', '400 Bad Request', '422 Unprocessable Entity'],
    correctAnswer: 'A',
    explanation: '401 Unauthorized indicates that the request lacks valid authentication credentials. 403 means authenticated but lack permission.',
    library: 'My Questions' as const,
    createdAt: '14 October 2026'
  }
];

export const TOPIN_SAMPLE_QUESTIONS = LEARNIVERSE_SAMPLE_QUESTIONS;
