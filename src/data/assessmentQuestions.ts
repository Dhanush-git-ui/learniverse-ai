export const REACT_NATIVE_QUESTIONS = [
  {
    "id": "rn_001",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Mobile App Architecture",
    "difficulty": "Medium",
    "question": "A mobile application allows a user to submit a service request. Which architecture correctly describes the usual data flow?",
    "options": [
      "Mobile App \u2192 Database \u2192 Backend \u2192 Mobile App",
      "Mobile App \u2192 Backend/API \u2192 Business Logic \u2192 Database \u2192 Backend/API \u2192 Mobile App",
      "Database \u2192 Mobile App \u2192 API \u2192 Backend",
      "Mobile App \u2192 Database \u2192 Third-Party API only"
    ],
    "correct_option": "B",
    "explanation": "In a typical production architecture, the mobile app communicates with a backend through an API. The backend applies business logic, interacts with the database, and returns a response to the app.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_002",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Security and Architecture",
    "difficulty": "Medium",
    "question": "Why should a production mobile application generally NOT connect directly to a database such as MySQL or PostgreSQL?",
    "options": [
      "Mobile frameworks cannot display database data directly",
      "Databases can only be used by web applications",
      "Direct database access can expose credentials and bypass backend security and business logic",
      "Databases do not support internet connections"
    ],
    "correct_option": "C",
    "explanation": "Direct database access from a client app can expose sensitive credentials and allow users to bypass authorization, validation, and business rules. A backend/API layer should normally control database access.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_003",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Full-Stack Technologies",
    "difficulty": "Medium",
    "question": "Which combination represents a valid full-stack mobile application architecture?",
    "options": [
      "React Native + Node.js/Express + PostgreSQL",
      "React Native + PostgreSQL directly inside the mobile app",
      "MongoDB as the frontend and React Native as the database",
      "Flutter + HTML only with no backend for server-side data"
    ],
    "correct_option": "A",
    "explanation": "React Native can serve as the mobile frontend, Node.js/Express can expose backend APIs and business logic, and PostgreSQL can store relational application data.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_004",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "API Connectivity",
    "difficulty": "Medium",
    "question": "A React Native app needs to retrieve a technician's profile from the server. Which approach is most appropriate?",
    "options": [
      "Connect the app directly to the production database using database credentials",
      "Send an authenticated HTTPS request to a backend API, which retrieves the required data and returns a response",
      "Store every technician profile permanently inside the app before publishing it",
      "Use AsyncStorage as the central database for every user"
    ],
    "correct_option": "B",
    "explanation": "The app should normally call a protected backend API over HTTPS. The backend performs authorization and database access before returning only the required data.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_005",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "System Components",
    "difficulty": "Medium",
    "question": "Which statement best explains the difference between a frontend framework, a backend framework, and a database?",
    "options": [
      "A frontend framework stores data, a backend framework designs screens, and a database sends notifications",
      "A frontend framework builds the user interface, a backend framework handles server-side logic and APIs, and a database stores persistent data",
      "All three perform exactly the same role at different speeds",
      "A database is used only to display data on mobile screens"
    ],
    "correct_option": "B",
    "explanation": "The frontend is responsible for the user experience, the backend handles application logic and controlled access to services, and the database persists structured or unstructured application data.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_006",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Data Update Flow",
    "difficulty": "Hard",
    "question": "A user updates their phone number in the mobile app. Which sequence is the most appropriate for a secure implementation?",
    "options": [
      "App \u2192 directly update database \u2192 refresh screen",
      "App \u2192 authenticated API request \u2192 backend validates user and data \u2192 database update \u2192 backend response \u2192 app updates UI",
      "App \u2192 save the new number only in local storage \u2192 database updates automatically",
      "App \u2192 send the database password with the request \u2192 update database"
    ],
    "correct_option": "B",
    "explanation": "The request should be authenticated and validated by the backend before the database is updated. The backend then returns the result so the client can update its state.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_007",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Real-Time Communication",
    "difficulty": "Hard",
    "question": "A Fixly technician app needs near real-time job status updates. Which choice is generally most suitable when the server must actively push frequent updates to connected users?",
    "options": [
      "WebSockets or a similar persistent real-time connection",
      "A one-time GET request when the application is installed",
      "Direct SQL queries from the mobile app",
      "Saving every update only in the app's local cache"
    ],
    "correct_option": "A",
    "explanation": "WebSockets maintain a persistent two-way connection and are useful for real-time events. Regular REST requests are still commonly used for standard request-response operations.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_008",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "API Reliability",
    "difficulty": "Hard",
    "question": "A mobile app sends a POST request to create a service booking, but the user taps the button repeatedly because the network is slow. Which backend design best reduces the risk of duplicate bookings?",
    "options": [
      "Trust the frontend to prevent every duplicate forever",
      "Restart the database whenever a duplicate occurs",
      "Use validation plus an idempotency key or another server-side duplicate-detection mechanism",
      "Allow all requests and ask administrators to remove duplicates manually"
    ],
    "correct_option": "C",
    "explanation": "Client-side disabling can improve the experience, but the backend must also protect against duplicates. Idempotency keys, unique constraints, and request validation can help make repeated requests safe.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_009",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Network Debugging",
    "difficulty": "Hard",
    "question": "An API endpoint works correctly in Postman but the mobile application cannot access it on a real device. Which is the BEST first technical conclusion?",
    "options": [
      "The backend must be correct and the mobile app code must be wrong",
      "The database is definitely corrupted",
      "The problem could be network reachability, DNS, HTTPS/TLS, firewall rules, authentication, or client configuration, so these should be investigated systematically",
      "The API should be replaced with local storage"
    ],
    "correct_option": "C",
    "explanation": "A successful Postman test proves the endpoint works from that environment, not necessarily from the mobile device. Device networking, DNS, certificates, authentication, firewall rules, and configuration can differ.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_010",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Database Selection",
    "difficulty": "Hard",
    "question": "Which database choice is generally more appropriate when an application requires strong relationships, transactions, and consistent records for entities such as users, bookings, payments, and invoices?",
    "options": [
      "A relational database such as PostgreSQL or MySQL",
      "Only a local key-value store on each mobile device",
      "An image file folder",
      "A frontend framework with no database"
    ],
    "correct_option": "A",
    "explanation": "Relational databases are often a strong choice when data has well-defined relationships and transactional consistency requirements, although the final choice depends on the application's needs.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_011",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Offline Architecture",
    "difficulty": "Hard",
    "question": "A mobile application must support offline usage. A technician may create service notes without internet and synchronize them later. Which architecture is the strongest approach?",
    "options": [
      "Reject all actions whenever the device is offline",
      "Store pending changes locally, track synchronization state, send queued changes when connectivity returns, and handle conflicts on the server",
      "Give the mobile app direct write access to the production database",
      "Delete all local data whenever the network connection changes"
    ],
    "correct_option": "B",
    "explanation": "Offline-first functionality usually requires local persistence, a synchronization queue, retry logic, and a conflict-resolution strategy because local and server data can change independently.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_012",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Performance Troubleshooting",
    "difficulty": "Hard",
    "question": "A backend API is becoming slow as the number of users grows. Which investigation order is the most technically sound?",
    "options": [
      "Immediately rewrite the entire mobile application",
      "Measure the request path and inspect application logs, API latency, database queries, external dependencies, and infrastructure bottlenecks before selecting a fix",
      "Increase every timeout value and assume the problem is solved",
      "Move the database into the mobile application"
    ],
    "correct_option": "B",
    "explanation": "Performance problems should be measured before they are fixed. Tracing the full request path can reveal whether latency comes from backend code, database queries, external services, network infrastructure, or resource limits.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_013",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Authentication Security",
    "difficulty": "Very Hard",
    "question": "You are designing an authentication system for a mobile application. Which approach is the MOST secure and architecturally appropriate?",
    "options": [
      "Store the user's plain-text password permanently in AsyncStorage and resend it with every API request",
      "Authenticate once, use appropriately managed access credentials for authorized API requests, and store sensitive credentials using a platform-appropriate secure storage mechanism",
      "Put the database administrator password inside the mobile application",
      "Allow the mobile app to generate its own administrator permissions without server verification"
    ],
    "correct_option": "B",
    "explanation": "Passwords and privileged database credentials should not be stored or reused insecurely on the client. Authentication and authorization should be enforced by the backend, while sensitive client credentials require secure platform storage and lifecycle management.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_014",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Distributed Systems",
    "difficulty": "Very Hard",
    "question": "A user completes a payment successfully, but the app loses internet connectivity before receiving the final response. The user retries. Which backend design best prevents charging or recording the same transaction twice?",
    "options": [
      "Treat every retry as a completely new transaction without checking previous requests",
      "Use a client-controlled screen flag only",
      "Use a unique transaction or idempotency identifier and make the backend return the existing result when the same operation is retried",
      "Ask the user to wait without allowing any recovery"
    ],
    "correct_option": "C",
    "explanation": "Distributed systems must handle uncertain outcomes. Idempotency identifiers allow the backend to recognize a repeated operation and avoid processing the same transaction multiple times.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_015",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "System Scalability",
    "difficulty": "Very Hard",
    "question": "A mobile app, backend, and database are hosted as separate layers. The company wants to scale the system for a large increase in users. Which architecture change is generally the MOST appropriate?",
    "options": [
      "Place all users and services on one mobile device",
      "Scale only the frontend screens while ignoring API and database load",
      "Measure each layer independently and scale the relevant components, such as load-balanced backend instances, caching, database indexing or replicas, and background workers",
      "Give every mobile app direct database access to reduce backend traffic"
    ],
    "correct_option": "C",
    "explanation": "A scalable architecture treats the client, API, database, cache, and background processing as separate concerns. The correct scaling strategy depends on measured bottlenecks and workload characteristics.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_016",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Number Pattern",
    "difficulty": "Easy",
    "question": "What is the next number in the sequence: 3, 6, 12, 24, ___?",
    "options": [
      "48",
      "30",
      "36",
      "42"
    ],
    "correct_option": "A",
    "explanation": "Each number is multiplied by 2, so 24 \u00d7 2 = 48.",
    "tags": "REASONING",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_017",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Logical Deduction",
    "difficulty": "Easy",
    "question": "All mobile applications are software. All software must be tested before release. Which conclusion follows?",
    "options": [
      "Some mobile applications do not need testing",
      "All mobile applications must be tested before release",
      "Testing turns an application into software",
      "Only mobile applications need testing"
    ],
    "correct_option": "B",
    "explanation": "Because every mobile application is software and all software must be tested, every mobile application must be tested.",
    "tags": "REASONING",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_018",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Arithmetic",
    "difficulty": "Easy",
    "question": "One test run takes 6 minutes. How long will 5 test runs take if they run one after another?",
    "options": [
      "25 minutes",
      "36 minutes",
      "30 minutes",
      "40 minutes"
    ],
    "correct_option": "C",
    "explanation": "The total time is 5 \u00d7 6 = 30 minutes.",
    "tags": "REASONING",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_019",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Direction Sense",
    "difficulty": "Easy",
    "question": "Ravi is facing north. He turns right, then left, and then right again. Which direction is he facing?",
    "options": [
      "North",
      "West",
      "South",
      "East"
    ],
    "correct_option": "D",
    "explanation": "The turns are north to east, east to north, and north to east.",
    "tags": "REASONING",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "rn_020",
    "category": "Mobile App Development",
    "role": "Mobile App Developer Intern",
    "topic": "Ordering",
    "difficulty": "Easy",
    "question": "Task P must be completed before Q, Q before R, and R before S. Which order satisfies all conditions?",
    "options": [
      "Q, P, R, S",
      "P, R, Q, S",
      "P, Q, S, R",
      "P, Q, R, S"
    ],
    "correct_option": "D",
    "explanation": "The stated dependencies require P first, followed by Q, R, and S.",
    "tags": "REASONING",
    "marks": 1,
    "negative_marks": 0.0
  }
];

export const DEVOPS_QUESTIONS = [
  {
    "id": "devops_001",
    "category": "DevOps",
    "topic": "Continuous Integration",
    "difficulty": "Easy",
    "question": "What is the main purpose of Continuous Integration (CI)?",
    "options": [
      "To manually deploy every change to production",
      "To frequently merge code changes and automatically build and test them",
      "To replace source-control systems",
      "To create cloud accounts for developers"
    ],
    "correct_option": "B",
    "explanation": "CI helps teams integrate changes frequently and detect problems early through automated builds and tests.",
    "marks": 1
  },
  {
    "id": "devops_002",
    "category": "DevOps",
    "topic": "Continuous Delivery",
    "difficulty": "Easy",
    "question": "What does a Continuous Delivery pipeline primarily help a team do?",
    "options": [
      "Keep software ready for release after automated checks",
      "Prevent developers from committing code",
      "Store application passwords in source code",
      "Replace application monitoring"
    ],
    "correct_option": "A",
    "explanation": "Continuous Delivery automates build, test, and release preparation so verified software remains ready for deployment.",
    "marks": 1
  },
  {
    "id": "devops_003",
    "category": "DevOps",
    "topic": "Git",
    "difficulty": "Easy",
    "question": "Why is a Git branch commonly created?",
    "options": [
      "To permanently delete repository history",
      "To upload application logs",
      "To work on changes separately from the main line of development",
      "To start a production server"
    ],
    "correct_option": "C",
    "explanation": "A branch provides an independent line of development for features, fixes, or experiments.",
    "marks": 1
  },
  {
    "id": "devops_004",
    "category": "DevOps",
    "topic": "Linux",
    "difficulty": "Easy",
    "question": "Which Linux command displays the current working directory?",
    "options": [
      "cd",
      "ls",
      "mkdir",
      "pwd"
    ],
    "correct_option": "D",
    "explanation": "The pwd command prints the full path of the current working directory.",
    "marks": 1
  },
  {
    "id": "devops_005",
    "category": "DevOps",
    "topic": "Docker",
    "difficulty": "Easy",
    "question": "What is the correct relationship between a Docker image and a container?",
    "options": [
      "An image is a template, while a container is an instance created from that image",
      "An image is a running process, while a container is its source code",
      "An image stores logs, while a container stores passwords",
      "An image and a container are always exactly the same thing"
    ],
    "correct_option": "A",
    "explanation": "A Docker image contains the packaged application and dependencies, while a container is an instance created from it.",
    "marks": 1
  },
  {
    "id": "devops_006",
    "category": "DevOps",
    "topic": "Cloud Computing",
    "difficulty": "Easy",
    "question": "In cloud computing, what does scalability mean?",
    "options": [
      "Renaming servers when an application changes",
      "Adjusting computing resources to handle different workloads",
      "Keeping all application data on one developer's computer",
      "Disabling backups to reduce storage use"
    ],
    "correct_option": "B",
    "explanation": "Scalability allows computing resources to be increased or decreased as application demand changes.",
    "marks": 1
  },
  {
    "id": "devops_007",
    "category": "DevOps",
    "topic": "Infrastructure as Code",
    "difficulty": "Easy",
    "question": "What is Infrastructure as Code (IaC)?",
    "options": [
      "Writing application user interfaces with HTML",
      "Monitoring servers only through manual checks",
      "Defining and managing infrastructure through machine-readable configuration files",
      "Storing production credentials in a spreadsheet"
    ],
    "correct_option": "C",
    "explanation": "IaC makes infrastructure repeatable and version-controlled by describing it in configuration files.",
    "marks": 1
  },
  {
    "id": "devops_008",
    "category": "DevOps",
    "topic": "Monitoring and Logging",
    "difficulty": "Easy",
    "question": "Which statement correctly describes metrics and logs?",
    "options": [
      "Metrics contain source code, while logs contain Docker images",
      "Metrics replace backups, while logs replace testing",
      "Metrics and logs can only be collected manually",
      "Metrics are numerical measurements, while logs record events and messages"
    ],
    "correct_option": "D",
    "explanation": "Metrics measure system behaviour, while logs provide detailed records of events for troubleshooting.",
    "marks": 1
  },
  {
    "id": "devops_009",
    "category": "DevOps",
    "topic": "DNS",
    "difficulty": "Easy",
    "question": "What is the primary purpose of DNS?",
    "options": [
      "To translate domain names into IP addresses",
      "To compress application files",
      "To build Docker images",
      "To track source-code changes"
    ],
    "correct_option": "A",
    "explanation": "DNS lets users and applications reach services by translating readable domain names into IP addresses.",
    "marks": 1
  },
  {
    "id": "devops_010",
    "category": "DevOps",
    "topic": "Secrets",
    "difficulty": "Easy",
    "question": "What is the safest basic practice for handling a production database password?",
    "options": [
      "Write it directly inside application source code",
      "Store it in a secure secret-management system and provide it at runtime",
      "Add it to a public repository README",
      "Use the same password in every environment"
    ],
    "correct_option": "B",
    "explanation": "Secrets should be stored securely and supplied at runtime instead of being committed to source control.",
    "marks": 1
  },
  {
    "id": "devops_011",
    "category": "DevOps",
    "topic": "Kubernetes Basics",
    "difficulty": "Easy",
    "question": "What is a Pod in Kubernetes?",
    "options": [
      "A source-control repository",
      "A physical data centre",
      "The smallest deployable unit that can run one or more containers",
      "A tool used only to create passwords"
    ],
    "correct_option": "C",
    "explanation": "A Pod is Kubernetes' basic deployable unit and contains one or more closely related containers.",
    "marks": 1
  },
  {
    "id": "devops_012",
    "category": "DevOps",
    "topic": "Automation",
    "difficulty": "Easy",
    "question": "What is a main benefit of automating repetitive deployment tasks?",
    "options": [
      "It guarantees that software will never contain bugs",
      "It removes the need for source control",
      "It makes monitoring unnecessary",
      "It improves consistency and reduces manual errors"
    ],
    "correct_option": "D",
    "explanation": "Automation performs defined steps consistently and reduces mistakes caused by repeated manual work.",
    "marks": 1
  },
  {
    "id": "devops_013",
    "category": "DevOps",
    "topic": "Rollback",
    "difficulty": "Easy",
    "question": "What does rolling back a deployment mean?",
    "options": [
      "Restoring a previous stable application version after a problematic release",
      "Permanently deleting all previous releases",
      "Increasing the number of production users",
      "Moving code to a new branch without deploying it"
    ],
    "correct_option": "A",
    "explanation": "A rollback returns the application to a known stable version when a new release causes problems.",
    "marks": 1
  },
  {
    "id": "devops_014",
    "category": "DevOps",
    "topic": "Least Privilege",
    "difficulty": "Easy",
    "question": "What does the principle of least privilege require?",
    "options": [
      "Every user should receive administrator access",
      "Users and services should receive only the permissions needed for their tasks",
      "All team members should share one account",
      "Permissions should never be reviewed after being granted"
    ],
    "correct_option": "B",
    "explanation": "Least privilege limits unnecessary access and reduces the impact of mistakes or compromised accounts.",
    "marks": 1
  },
  {
    "id": "devops_015",
    "category": "DevOps",
    "topic": "Load Balancing",
    "difficulty": "Easy",
    "question": "What is the main purpose of a load balancer?",
    "options": [
      "To store source-code history",
      "To create environment variables",
      "To distribute incoming requests across multiple servers or application instances",
      "To convert application code into a Dockerfile"
    ],
    "correct_option": "C",
    "explanation": "A load balancer shares incoming traffic across available instances to improve availability and performance.",
    "marks": 1
  },
  {
    "id": "devops_016",
    "category": "DevOps",
    "topic": "Number Pattern",
    "difficulty": "Easy",
    "question": "A monitoring system records alerts in this pattern: 5, 10, 15, 20, ___. What is the next number?",
    "options": [
      "22",
      "24",
      "30",
      "25"
    ],
    "correct_option": "D",
    "explanation": "The sequence increases by 5 each time, so 20 + 5 = 25.",
    "marks": 1
  },
  {
    "id": "devops_017",
    "category": "DevOps",
    "topic": "Percentage Arithmetic",
    "difficulty": "Easy",
    "question": "A system has 20 servers. If 25% are offline, how many servers are still online?",
    "options": [
      "5",
      "10",
      "15",
      "18"
    ],
    "correct_option": "C",
    "explanation": "Twenty-five percent of 20 is 5, so 20 \u2212 5 = 15 servers remain online.",
    "marks": 1
  },
  {
    "id": "devops_018",
    "category": "DevOps",
    "topic": "Time and Work",
    "difficulty": "Easy",
    "question": "Setup takes 20 minutes, testing takes 15 minutes, and deployment takes 10 minutes. If done one after another, what is the total time?",
    "options": [
      "45 minutes",
      "35 minutes",
      "40 minutes",
      "50 minutes"
    ],
    "correct_option": "A",
    "explanation": "The total time is 20 + 15 + 10 = 45 minutes.",
    "marks": 1
  },
  {
    "id": "devops_019",
    "category": "DevOps",
    "topic": "Logical Ordering",
    "difficulty": "Easy",
    "question": "Monitoring must be enabled before deployment, and deployment must finish before a notification is sent. Which statement must be true?",
    "options": [
      "The notification is sent before monitoring is enabled",
      "Monitoring is enabled before the notification is sent",
      "Deployment begins after the notification is sent",
      "Monitoring and notification happen at the same time"
    ],
    "correct_option": "B",
    "explanation": "The required order is monitoring, deployment, then notification, so monitoring occurs before notification.",
    "marks": 1
  },
  {
    "id": "devops_020",
    "category": "DevOps",
    "topic": "Data Interpretation",
    "difficulty": "Easy",
    "question": "A team completed 4 deployments on Monday, 7 on Tuesday, 5 on Wednesday, and 6 on Thursday. Which day had the most deployments?",
    "options": [
      "Monday",
      "Wednesday",
      "Thursday",
      "Tuesday"
    ],
    "correct_option": "D",
    "explanation": "Tuesday had 7 deployments, the highest value among the four days.",
    "marks": 1
  }
];


export const AI_ENGINEER_QUESTIONS = [
  {
    "id": "ai_p_01",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "You are given a dataset containing customer information and a label indicating whether each customer cancelled their subscription. You want to train a model to predict cancellation for new customers. Which type of learning is this?",
    "options": [
      "Unsupervised learning",
      "Supervised learning",
      "Reinforcement learning",
      "Self-supervised learning"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Supervised learning.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_p_02",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "You are integrating an LLM API into a web application. Where should the API key normally be stored?",
    "options": [
      "Inside the frontend JavaScript code",
      "Inside the HTML source",
      "On the backend using environment variables or a secure secret store",
      "Inside localStorage in the browser"
    ],
    "correct_option": "C",
    "explanation": "Correct answer is C: On the backend using environment variables or a secure secret store.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_p_03",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "A Speech-to-Text API works correctly with uploaded audio files, but your application needs to display the transcript while the user is speaking. Which approach is most appropriate?",
    "options": [
      "Record the entire audio and send it only after the user stops speaking",
      "Use streaming audio/transcription if supported by the API",
      "Convert the audio to an image before sending it",
      "Send the audio through an LLM first"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Use streaming audio/transcription if supported by the API.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_p_04",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "You ask an LLM: 'Extract the person's name, age, and city.' Sometimes the model returns a paragraph, sometimes a list, and sometimes JSON. Which approach would most directly improve consistency?",
    "options": [
      "Increase the temperature",
      "Give a clear output format or schema in the prompt",
      "Increase the font size of the prompt",
      "Increase the number of tokens generated"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Give a clear output format or schema in the prompt.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_p_05",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "An AI chatbot is designed to answer questions from a company's internal documents. The chatbot frequently gives incorrect answers because the wrong documents are being retrieved before the LLM generates its response. What should you investigate first?",
    "options": [
      "Retrieval and ranking",
      "GPU temperature",
      "Frontend styling",
      "Number of database tables"
    ],
    "correct_option": "A",
    "explanation": "Correct answer is A: Retrieval and ranking.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_p_06",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "You want to build a system that finds documents that are semantically similar to a user's question, even when they don't contain exactly the same words. Which approach is most appropriate?",
    "options": [
      "Keyword matching only",
      "Convert text into embeddings and compare vector similarity",
      "Sort documents alphabetically",
      "Use image classification"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Convert text into embeddings and compare vector similarity.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_p_07",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "An AI application worked correctly during development but suddenly starts producing poor results in production. The model and code have not changed. What should you investigate first?",
    "options": [
      "Immediately replace the model",
      "Check whether the production input/data differs from what was used during testing",
      "Increase the model size",
      "Increase the temperature"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Check whether the production input/data differs from what was used during testing.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_p_08",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "An LLM generates text token by token, and a TTS system converts text into speech. You want the user to hear the response as quickly as possible. Which approach is most suitable?",
    "options": [
      "Wait for the complete LLM response before starting TTS",
      "Send every individual token directly to TTS",
      "Buffer the streamed text into small sentence/clause chunks and send them to a streaming TTS system",
      "Generate the entire response twice"
    ],
    "correct_option": "C",
    "explanation": "Correct answer is C: Buffer the streamed text into small sentence/clause chunks and send them to a streaming TTS system.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_p_09",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "You change your prompt and the AI response looks better in a few examples. What is the most reliable next step before claiming the new prompt is better?",
    "options": [
      "Deploy it immediately",
      "Test it on a representative evaluation dataset and compare measurable results",
      "Ask the model whether the new prompt is better",
      "Increase the temperature"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Test it on a representative evaluation dataset and compare measurable results.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_p_10",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Practical AI & LLM Systems",
    "difficulty": "Medium",
    "question": "An LLM-powered application needs to retrieve information from a database. Which statement best describes how tool calling normally works?",
    "options": [
      "The LLM directly executes the database query inside its neural network",
      "The LLM generates a structured tool request, and the application executes the tool and sends the result back to the LLM",
      "The browser automatically executes whatever SQL the model generates",
      "The LLM changes the database itself through its weights"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: The LLM generates a structured tool request, and the application executes the tool and sends the result back to the LLM.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_01",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "A model performs extremely well on training data but poorly on unseen data. Which change is most likely to help?",
    "options": [
      "Increase model complexity",
      "Train for more epochs without changing anything",
      "Use regularization or early stopping",
      "Remove the validation dataset"
    ],
    "correct_option": "C",
    "explanation": "Correct answer is C: Use regularization or early stopping.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_02",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "Which of the following is an example of supervised learning?",
    "options": [
      "Grouping customers based on purchasing behavior without predefined labels",
      "Predicting house prices using a dataset containing previous house prices",
      "Finding frequently occurring words in a collection of documents",
      "Reducing the dimensions of a dataset using PCA"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Predicting house prices using a dataset containing previous house prices.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_03",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "A model is trained to detect a rare disease. Out of 10,000 patients, only 100 actually have the disease. The model predicts all 10,000 patients as healthy. What is the model's accuracy?",
    "options": [
      "0%",
      "1%",
      "90%",
      "99%"
    ],
    "correct_option": "D",
    "explanation": "Correct answer is D: 99%.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_04",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "What does temperature generally control in an LLM?",
    "options": [
      "The physical temperature of the GPU",
      "The randomness of the model's generated output",
      "The maximum context length",
      "The number of training samples"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: The randomness of the model's generated output.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_05",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "You have a dataset containing Age, Income, Previous Purchases, and Future Purchase Amount. You want to predict a customer's future purchase amount. Which statement is correct?",
    "options": [
      "Future Purchase Amount is a useful feature because it strongly correlates with the target",
      "Future Purchase Amount should be removed because it causes data leakage",
      "Future Purchase Amount should be converted into a categorical feature",
      "Future Purchase Amount should be duplicated to improve training"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Future Purchase Amount should be removed because it causes data leakage.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_06",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "An AI chatbot uses RAG. The user asks a question, but the system retrieves irrelevant documents. The LLM then produces an incorrect answer based on those documents. Where should you investigate first?",
    "options": [
      "Retrieval and ranking",
      "LLM temperature only",
      "GPU memory",
      "Frontend CSS"
    ],
    "correct_option": "A",
    "explanation": "Correct answer is A: Retrieval and ranking.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_07",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "A classification model has True Positives = 90, False Positives = 10, and False Negatives = 30. What is the model's precision?",
    "options": [
      "75%",
      "80%",
      "90%",
      "93%"
    ],
    "correct_option": "C",
    "explanation": "Correct answer is C: 90%.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_08",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "An image-classification model has 96% training accuracy and 94% validation accuracy. After deployment, accuracy drops to 62%. The model itself has not changed. Which is the most likely first thing to investigate?",
    "options": [
      "Immediately train a larger model",
      "Increase the learning rate",
      "Check whether production data differs from the training/validation distribution",
      "Increase the number of model parameters"
    ],
    "correct_option": "C",
    "explanation": "Correct answer is C: Check whether production data differs from the training/validation distribution.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_09",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "What is the main purpose of a validation dataset during model development?",
    "options": [
      "To train the model's parameters",
      "To evaluate the model on completely unseen production data",
      "To help tune model choices and hyperparameters",
      "To increase the size of the training dataset"
    ],
    "correct_option": "C",
    "explanation": "Correct answer is C: To help tune model choices and hyperparameters.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_m_10",
    "category": "AI Engineering",
    "role": "AI Engineer Intern",
    "topic": "Machine Learning & Applied AI",
    "difficulty": "Medium",
    "question": "An LLM has a context window of 8,000 tokens. Your request contains 1,000 tokens of system instructions, 5,500 tokens of retrieved documents, 1,200 tokens of user conversation, and 1,000 tokens of expected output. What is the main issue?",
    "options": [
      "Nothing, because the input is below 8,000 tokens",
      "The request may exceed the available context because input and output tokens both consume the context budget",
      "The model will automatically remove the system instructions",
      "The model will automatically increase its context window"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: The request may exceed the available context because input and output tokens both consume the context budget.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "ai_scenario_01",
    "category": "Real-World Scenarios",
    "question_type": "scenario",
    "role": "AI Engineer Intern",
    "topic": "Live Audio & Speech-to-Text Pipeline",
    "difficulty": "Hard",
    "marks": 25,
    "negative_marks": 0.0,
    "tags": "SCENARIO",
    "question": "Scenario 1: Integrating Live Speech-to-Text  [25 Marks]\n\nYou are given an existing web application and access to AI developer tools such as Claude and a cloud Speech-to-Text (STT) API. You need to implement a feature that captures a user's live speech, transcribes it in real time, and dynamically displays the continuous transcript on the frontend.\n\nExplain your complete end-to-end approach step-by-step:\n1. Frontend audio capture (Web Audio API / MediaRecorder, streaming vs chunking, user permissions).\n2. Transport & Backend API integration (WebSockets vs HTTP REST, handling API keys securely, buffering audio chunks).\n3. UI/UX transcript updates (latency optimization, interim vs final transcripts, error/silence handling).\n4. Production reliability, rate limits, and fallback strategies.\n\n(Write a structured engineering answer covering all 4 points. 150–400 words recommended.)",
    "rubrics": [
      { "dimension": "Audio Capture & Frontend", "marks": 6, "criteria": "Web Audio API / MediaRecorder API usage; handles microphone permissions gracefully; audio chunking vs real-time streaming; explains interim vs final transcript latency." },
      { "dimension": "Transport & API Security", "marks": 7, "criteria": "Uses WebSockets / bidirectional streaming; secures API keys on backend proxy (never exposes secret keys on frontend client); audio buffering & sample rate matching." },
      { "dimension": "UI/UX & Latency Optimization", "marks": 6, "criteria": "Low-latency dynamic DOM updates; manages silence detection; smooth user feedback; clean speech pause handling." },
      { "dimension": "Reliability & Edge Cases", "marks": 6, "criteria": "Connection dropped handling; automatic reconnect with exponential backoff; fallback mechanism for unsupported browsers; network throttling behavior." }
    ]
  },
  {
    "id": "ai_scenario_02",
    "category": "Real-World Scenarios",
    "question_type": "scenario",
    "role": "AI Engineer Intern",
    "topic": "Context-Aware LLM Architecture & CI/CD",
    "difficulty": "Hard",
    "marks": 25,
    "negative_marks": 0.0,
    "tags": "SCENARIO",
    "question": "Scenario 2: Building an End-to-End AI Feature From Scratch  [25 Marks]\n\nYou are tasked with building a context-aware AI chatbot assistant for an existing company web application using Claude / LLM API and GitHub. The assistant must answer user queries grounded in company documentation.\n\nDetail your technical architecture and implementation workflow:\n1. Architecture & communication flow between frontend, backend server, and the LLM API.\n2. Conversation state management, session memory, and context window budget handling.\n3. Security safeguards (protecting API credentials, backend validation, prompt injection defense).\n4. CI/CD, version control workflow on GitHub, and production evaluation / monitoring.\n\n(Write a structured engineering answer covering all 4 points. 150–400 words recommended.)",
    "rubrics": [
      { "dimension": "Architecture & Data Flow", "marks": 7, "criteria": "Clear client -> backend server -> LLM API pipeline; separates presentation layer from business logic; enforces backend authentication & rate limiting." },
      { "dimension": "State & Context Window Budget", "marks": 6, "criteria": "Persistent chat session storage; manages conversation history; token budgeting (pruning/summarization to avoid context window overflow); system prompt engineering." },
      { "dimension": "Security & Guardrails", "marks": 6, "criteria": "Backend environment variable secret management; user input sanitization; prompt injection mitigation; structured JSON validation (e.g. Pydantic / Zod)." },
      { "dimension": "CI/CD & Observability", "marks": 6, "criteria": "GitHub version control workflow; pull request reviews; automated unit/eval tests; tracking LLM latency, token costs, and response quality monitoring." }
    ]
  }
];

export const BACKEND_FULLSTACK_QUESTIONS = [
  {
    "id": "bfs_01",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "HTTP Semantics",
    "difficulty": "Medium",
    "question": "HTTP semantics  A client sends an operation that replaces the complete resource at /api/users/42. The same request may be safely retried because sending it again should leave the resource in the same intended state. Which HTTP method best matches this behavior?",
    "options": [
      "POST",
      "PUT",
      "PATCH",
      "CONNECT"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: PUT.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_02",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "Composite Index",
    "difficulty": "Medium",
    "question": "Composite indexes  A table has a composite index on (user_id, created_at). Which query is most likely to benefit directly from that index?",
    "options": [
      "SELECT * FROM events WHERE created_at > '2026-01-01';",
      "SELECT * FROM events WHERE user_id = 42 ORDER BY created_at DESC;",
      "SELECT * FROM events WHERE LOWER(user_id) = '42';",
      "SELECT COUNT(*) FROM events;"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: SELECT * FROM events WHERE user_id = 42 ORDER BY created_at DESC;.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_03",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "Database Access Patterns",
    "difficulty": "Medium",
    "question": "Database access patterns  An endpoint loads 80 orders and then executes one additional customer query for each order. The endpoint therefore performs 81 database queries for a single request. What backend problem is this?",
    "options": [
      "Deadlock",
      "N+1 query problem",
      "Dirty read",
      "Connection leak"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: N+1 query problem.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_04",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "Transaction Isolation",
    "difficulty": "Medium",
    "question": "Transaction isolation  Two concurrent transactions are reading and updating account balances. You need to prevent a transaction from reading data written by another transaction that has not committed yet. Which isolation level is the lowest standard level that prevents dirty reads?",
    "options": [
      "Read Uncommitted",
      "Read Committed",
      "Repeatable Read",
      "Serializable"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Read Committed.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_05",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "Distributed Systems / CAP",
    "difficulty": "Medium",
    "question": "Distributed systems  A service is replicated across multiple nodes and network communication between nodes can fail. According to the CAP theorem, during a network partition a distributed system must trade off which pair?",
    "options": [
      "Caching and indexing",
      "Consistency and availability",
      "Security and throughput",
      "Latency and storage"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Consistency and availability.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_06",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "Rate Limiting",
    "difficulty": "Medium",
    "question": "Rate limiting  An API should allow short bursts of traffic while enforcing an average request rate over time. Which mechanism is designed for this behavior?",
    "options": [
      "Token bucket",
      "Round-robin scheduling",
      "Least-connections load balancing",
      "Consistent hashing"
    ],
    "correct_option": "A",
    "explanation": "Correct answer is A: Token bucket.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_07",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "Caching / Cache-Aside",
    "difficulty": "Medium",
    "question": "Caching  Your application uses the cache-aside pattern. A requested product is not present in the cache. What should normally happen next?",
    "options": [
      "Return an error because the cache is authoritative",
      "Read from the database, store the result in the cache, then return it",
      "Wait for the cache service to populate itself",
      "Write an empty value to the cache and return it"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Read from the database, store the result in the cache, then return it.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_08",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "Container Orchestration",
    "difficulty": "Medium",
    "question": "Container orchestration  A Kubernetes service should only receive traffic after a newly started application instance has finished initializing and is ready to serve requests. Which feature is intended for this?",
    "options": [
      "Liveness probe",
      "Readiness probe",
      "Horizontal Pod Autoscaler",
      "ConfigMap"
    ],
    "correct_option": "B",
    "explanation": "Correct answer is B: Readiness probe.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_09",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "Authentication & Security",
    "difficulty": "Medium",
    "question": "Authentication and security  A user password must be stored so that an attacker who obtains the database cannot directly recover the original password. Which approach is most appropriate?",
    "options": [
      "AES encryption with a key stored in the application environment",
      "Plain SHA-256 hashing",
      "A slow, salted password hash such as Argon2id or bcrypt",
      "Base64 encoding"
    ],
    "correct_option": "C",
    "explanation": "Correct answer is C: A slow, salted password hash such as Argon2id or bcrypt.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_10",
    "category": "Backend & Full Stack",
    "role": "Backend & Full Stack Intern",
    "topic": "Node.js Runtime Performance",
    "difficulty": "Medium",
    "question": "Node.js runtime  A Node.js API becomes very slow whenever a request triggers a large CPU-intensive image transformation. Database latency remains normal. What is the most likely explanation?",
    "options": [
      "The Node.js event loop is being blocked by CPU-bound work",
      "The database has too many indexes",
      "HTTP/1.1 cannot handle JSON responses",
      "DNS caching is disabled"
    ],
    "correct_option": "A",
    "explanation": "Correct answer is A: The Node.js event loop is being blocked by CPU-bound work.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "bfs_scenario_01",
    "category": "Real-World Scenarios",
    "question_type": "scenario",
    "role": "Backend & Full Stack Intern",
    "topic": "Asynchronous Distributed Queues & Rate Limiting",
    "difficulty": "Hard",
    "marks": 25,
    "negative_marks": 0.0,
    "tags": "SCENARIO",
    "question": "Scenario 1: High-Volume AI Document Processing Pipeline  [25 Marks]\n\nTechHash is building an enterprise document processing service. Users upload batches of invoices and reports (up to 5,000 files per batch). The backend runs OCR followed by structured LLM extraction. The OCR service is fast, but the LLM provider imposes a strict rate limit of 60 requests per minute. Each file takes 10–30 seconds. The client cannot hold an HTTP connection open and needs live, persistent progress tracking.\n\nDesign the backend architecture step-by-step:\n1. Job creation, storage, and asynchronous queueing (batch vs individual task model, durable message queues).\n2. Worker concurrency control and strict rate-limiting (throttling outbound calls to 60 req/min).\n3. Fault tolerance, idempotency, exponential backoff retries, and dead-letter queues (DLQ).\n4. Frontend communication mechanism (SSE, WebSockets, or polling) and production observability metrics.\n\n(Write a structured engineering answer covering all 4 points. 150–400 words recommended.)",
    "rubrics": [
      { "dimension": "Asynchronous Job Architecture", "marks": 7, "criteria": "Separates HTTP upload from processing; creates parent batch & child file jobs in DB (states: queued, processing, completed, failed, retrying); durable message queue (RabbitMQ/SQS/Redis Bull)." },
      { "dimension": "Concurrency & Rate Throttling", "marks": 6, "criteria": "Worker pool with bounded concurrency; strict outbound rate limiter ensuring <= 60 req/min to LLM provider (Token Bucket / Leaky Bucket); isolates fast OCR from slow LLM." },
      { "dimension": "Fault Tolerance & Idempotency", "marks": 6, "criteria": "Durable state persistence; idempotency keys to prevent duplicate execution; controlled exponential backoff with jitter for HTTP 429; Dead-Letter Queue (DLQ) for poisoned files." },
      { "dimension": "Client Updates & Observability", "marks": 6, "criteria": "Exposes progress via Server-Sent Events (SSE) / WebSockets / polling; monitors queue depth, age of oldest message, worker throughput, 429 counts, and error rates." }
    ]
  },
  {
    "id": "bfs_scenario_02",
    "category": "Real-World Scenarios",
    "question_type": "scenario",
    "role": "Backend & Full Stack Intern",
    "topic": "Database Performance & Incident Diagnostics",
    "difficulty": "Hard",
    "marks": 25,
    "negative_marks": 0.0,
    "tags": "SCENARIO",
    "question": "Scenario 2: Diagnosing a Post-Deployment Latency Regression  [25 Marks]\n\nImmediately following a backend deployment, API p99 latency escalates from 200 ms to 3.0 seconds. Server CPU and RAM usage remain normal, but database connection pool utilization approaches 100%. The regression is most severe on endpoints retrieving dashboard statistics and related entity collections. Incoming request volume has not noticeably changed.\n\nDescribe your systematic, evidence-driven incident investigation:\n1. Observability data: APM traces, connection pool metrics, slow query logs, transaction durations.\n2. Database diagnosis: Root cause analysis focusing on query amplification (N+1 query regressions, missing indexes, unindexed joins, uncommitted locks).\n3. Immediate mitigation strategies to protect service availability (rollback, connection pool adjustments, circuit breakers, rate shaping).\n4. Permanent architectural remedies (eager loading, batching, caching, connection pooling policies, automated regression tests).\n\n(Write a structured engineering answer covering all 4 points. 150–400 words recommended.)",
    "rubrics": [
      { "dimension": "Evidence-Based Investigation", "marks": 7, "criteria": "Avoids blind guessing; correlates deployment timestamp with APM traces, latency percentiles (p50/p95/p99), DB connection pool wait time, and query counts." },
      { "dimension": "Database & N+1 Diagnosis", "marks": 7, "criteria": "Pinpoints query multiplication (N+1 query problem introduced on dashboard endpoints); inspects active connections, slow query logs, transaction durations, and unindexed foreign keys." },
      { "dimension": "Short-Term Safe Mitigation", "marks": 5, "criteria": "Targeted rollback or canary drain; disables offending dashboard feature flag; temporarily tunes safe connection timeouts without blowing up DB memory." },
      { "dimension": "Permanent Architectural Fix", "marks": 6, "criteria": "Replaces per-record loops with batch queries / eager loading / JOINs; caches dashboard aggregations (Redis); adds query-budget regression tests in CI/CD pipeline." }
    ]
  }
];

export const GROWTH_INTERN_QUESTIONS = [
  {
    "id": "growth_001",
    "category": "Growth & Outreach",
    "role": "Technology & Growth Intern",
    "topic": "User Problem & Outreach",
    "difficulty": "Easy",
    "question": "Outreach: What is the most important thing to understand before reaching out to a potential user for a technology product?",
    "options": [
      "The company's logo design",
      "The user's problem and how the product solves it",
      "The number of employees in the company",
      "The number of social media followers"
    ],
    "correct_option": "B",
    "explanation": "Effective outreach requires understanding the specific pain point the user faces and clearly communicating how your technology product solves it.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "growth_002",
    "category": "Growth & Analytics",
    "role": "Technology & Growth Intern",
    "topic": "Funnel Analytics & Usage",
    "difficulty": "Medium",
    "question": "Analytics: A product receives 500 website visitors, 100 sign-ups and 20 active users. If the goal is to improve actual product usage, which metric should you focus on?",
    "options": [
      "Website visitors",
      "Sign-ups only",
      "Active users and conversion from sign-up to usage",
      "Number of social media posts"
    ],
    "correct_option": "C",
    "explanation": "Improving actual product usage requires analyzing the activation bottleneck: converting sign-ups into active, engaged users rather than focusing solely on top-of-funnel vanity traffic.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "growth_003",
    "category": "Growth & Automation",
    "role": "Technology & Growth Intern",
    "topic": "Technology-Driven Growth",
    "difficulty": "Easy",
    "question": "Technology: Which of these is the best example of technology-driven growth?",
    "options": [
      "Manually calling every potential customer",
      "Using automated email or WhatsApp workflows for follow-ups",
      "Printing more posters",
      "Holding more team meetings"
    ],
    "correct_option": "B",
    "explanation": "Technology-driven growth leverages automation tools and software pipelines (such as automated email and messaging workflows) to scale outreach efficiently.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "growth_004",
    "category": "Product & Growth",
    "role": "Technology & Growth Intern",
    "topic": "User Feedback & Iteration",
    "difficulty": "Easy",
    "question": "Product: What is the main purpose of collecting user feedback?",
    "options": [
      "To convince users the product is right",
      "To understand user problems and improve the product",
      "To run more advertisements",
      "To reduce development work"
    ],
    "correct_option": "B",
    "explanation": "User feedback provides direct qualitative and quantitative insights into user friction, usability issues, and missing features needed to iterate and improve the product.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "growth_005",
    "category": "Growth & Communication",
    "role": "Technology & Growth Intern",
    "topic": "Cold Outreach Strategy",
    "difficulty": "Medium",
    "question": "Communication: Which is the best first message when approaching a potential professional user?",
    "options": [
      "Buy our product immediately.",
      "We are the best platform in the market.",
      "We're building a platform to solve [specific problem]. We'd value your feedback and would be happy to show you a short demo.",
      "Please register using this link."
    ],
    "correct_option": "C",
    "explanation": "A consultative, problem-centric approach that seeks user feedback and offers a low-friction demo builds trust and achieves significantly higher response rates than aggressive selling.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "growth_006",
    "category": "Growth & Analytics",
    "role": "Technology & Growth Intern",
    "topic": "Conversion Rate Metrics",
    "difficulty": "Easy",
    "question": "Analytics: What does a conversion rate generally represent?",
    "options": [
      "The number of employees in a company",
      "The percentage of users who complete a desired action",
      "The total number of advertisements created",
      "The speed of a website"
    ],
    "correct_option": "B",
    "explanation": "Conversion rate is calculated as the ratio of users who complete a target objective (such as signing up, booking a demo, or upgrading) divided by the total number of visitors or participants.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "growth_007",
    "category": "Retention & UX",
    "role": "Technology & Growth Intern",
    "topic": "User Retention & Churn",
    "difficulty": "Medium",
    "question": "Retention: Many users register for a product but don't return after the first use. What should you investigate first?",
    "options": [
      "Office location",
      "User experience, onboarding and product value",
      "Logo colour",
      "Employee attendance"
    ],
    "correct_option": "B",
    "explanation": "Day-1 churn is almost always caused by friction during onboarding, complicated user interface, or failure of the user to experience the core product value quickly ('time to first value').",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "growth_008",
    "category": "Growth Tools & CRM",
    "role": "Technology & Growth Intern",
    "topic": "Outreach Tracking & CRM",
    "difficulty": "Easy",
    "question": "Tools: Which approach is most useful for tracking outreach performance?",
    "options": [
      "A spreadsheet or CRM recording responses, follow-ups and conversions",
      "Sending messages without recording any data",
      "Only checking social media likes",
      "Calling users at random"
    ],
    "correct_option": "A",
    "explanation": "Systematic pipeline management via a CRM or structured spreadsheet enables funnel visibility, scheduled follow-ups, and data-backed conversion optimization.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "growth_009",
    "category": "Product Communication",
    "role": "Technology & Growth Intern",
    "topic": "Technical Product Positioning",
    "difficulty": "Medium",
    "question": "Communication: What's the best way to explain technical product features to a non-technical user?",
    "options": [
      "Use as many technical terms as possible",
      "Explain the feature through the user's problem and the benefit",
      "Share the source code",
      "Avoid explaining the product"
    ],
    "correct_option": "B",
    "explanation": "Non-technical users care about outcomes, benefits, and problem resolution rather than implementation details or jargon.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  {
    "id": "growth_010",
    "category": "Growth Strategy",
    "role": "Technology & Growth Intern",
    "topic": "Role Scope & Execution",
    "difficulty": "Easy",
    "question": "Role: Which best describes the Technology & Growth Intern role?",
    "options": [
      "Only software development",
      "Only social media marketing",
      "A mix of product understanding, technology, outreach, analytics and user growth",
      "Only event management"
    ],
    "correct_option": "C",
    "explanation": "A Technology & Growth Intern bridges engineering, product analytics, user outreach, and tech-driven growth experiments to acquire, activate, and retain users.",
    "tags": "DOMAIN",
    "marks": 1,
    "negative_marks": 0.0
  },
  // Real-World Scenarios
  {
    "id": "growth_scenario_01",
    "category": "Real-World Scenarios",
    "question_type": "scenario",
    "role": "Technology & Growth Intern",
    "topic": "Outreach Strategy & Low Response Diagnostics",
    "difficulty": "Hard",
    "marks": 10,
    "negative_marks": 0.0,
    "tags": "SCENARIO",
    "question": "Scenario 1: Low Response to Outreach  [10 Marks]\n\nYour team has launched a new technology product for professionals. You contacted 100 potential users through LinkedIn and email. Only 8 responded, and only 2 agreed to a product demo. Explain what you would do next.\n\nStructure your answer to address:\n1. What data you would analyse (channels, segments, message versions).\n2. What changes you would make to the outreach message (personalisation, specific problem, low-effort ask).\n3. Whether you would change the target audience.\n4. How you would improve follow-ups (value-adding, automated tracking).\n5. What metrics you would track (response rate, demo booking rate, conversions).\n\n(Write a structured engineering and growth answer covering all 5 points. 150–400 words recommended.)",
    "rubrics": [
      { "dimension": "Data & Channel Analysis", "marks": 2, "criteria": "Analyzes open rates, click-through rates, LinkedIn vs email response divergence, and audience segmentation." },
      { "dimension": "Copy & Value Proposition", "marks": 2, "criteria": "Refines message to be concise, problem-focused, highly personalized, and provides a low-friction call-to-action." },
      { "dimension": "Target Audience Calibration", "marks": 2, "criteria": "Evaluates Ideal Customer Profile (ICP), role relevance, seniority, and industry fit." },
      { "dimension": "Follow-Up & Automation Strategy", "marks": 2, "criteria": "Implements structured, non-spammy multi-touch follow-up cadence offering insights, case studies, or demo recordings." },
      { "dimension": "Growth Metrics & Measurement", "marks": 2, "criteria": "Defines quantitative KPIs: reply rate, positive sentiment rate, demo booking rate, and show-up rate." }
    ]
  },
  {
    "id": "growth_scenario_02",
    "category": "Real-World Scenarios",
    "question_type": "scenario",
    "role": "Technology & Growth Intern",
    "topic": "Activation Funnel & User Drop-off Optimization",
    "difficulty": "Hard",
    "marks": 10,
    "negative_marks": 0.0,
    "tags": "SCENARIO",
    "question": "Scenario 2: High Sign-ups, Low Usage  [10 Marks]\n\nA new product gets 200 registrations in one month, but only 30 users actively use it after registering. As a Technology & Growth Intern, how would you identify the problem and improve user adoption?\n\nStructure your answer to address:\n1. User onboarding and funnel drop-off analysis.\n2. Product usability and friction points.\n3. User feedback collection (talking to both active and inactive users).\n4. Communication and behavioral follow-ups/nudges.\n5. Value proposition alignment.\n6. Metrics to monitor (activation rate, time to first value, retention).\n7. Coordination with product and technical teams.\n\n(Write a structured engineering and growth answer covering all 7 points. 150–400 words recommended.)",
    "rubrics": [
      { "dimension": "Funnel & Drop-off Diagnostics", "marks": 2, "criteria": "Maps the end-to-end user onboarding flow using product analytics (Mixpanel/PostHog) to pinpoint where drop-offs happen." },
      { "dimension": "Usability & Time-to-Value", "marks": 2, "criteria": "Identifies activation barriers (mandatory setup steps, bugs, UI confusion) and accelerates time to 'Aha!' moment." },
      { "dimension": "User Discovery & Feedback", "marks": 2, "criteria": "Conducts short 1-on-1 interviews with churned users to understand why they abandoned and active users to understand what worked." },
      { "dimension": "Lifecycle Nudges & Re-engagement", "marks": 2, "criteria": "Deploys targeted triggered emails, in-app guides, or WhatsApp walkthroughs based on user milestone triggers." },
      { "dimension": "Cross-Functional Collaboration", "marks": 2, "criteria": "Partners with engineering/product to fix onboarding blockers and tracks Day 1, Day 7, Day 30 retention and activation rate." }
    ]
  }
];

export interface LocalRoleQuestion {
  id: string;
  category: string;
  role?: string;
  topic: string;
  difficulty: string;
  question: string;
  options?: string[];
  correct_option?: string | null;
  explanation?: string;
  tags?: string | string[];
  marks: number;
  negative_marks?: number;
  question_type?: string;
  rubrics?: { dimension: string; marks: number; criteria: string }[];
}

export function getLocalQuestionsForRole(role: string): LocalRoleQuestion[] {
  const r = (role || '').toLowerCase();
  let pool: LocalRoleQuestion[] = REACT_NATIVE_QUESTIONS;
  if (r.includes('ai') || r.includes('artificial')) {
    pool = AI_ENGINEER_QUESTIONS;
  } else if (r.includes('backend') || r.includes('full stack') || r.includes('fullstack') || r.includes('front-end') || r.includes('frontend')) {
    pool = BACKEND_FULLSTACK_QUESTIONS;
  } else if (r.includes('devops') || r.includes('cloud')) {
    pool = DEVOPS_QUESTIONS;
  } else if (r.includes('growth') || r.includes('technology & growth') || r.includes('marketing') || r.includes('business')) {
    pool = GROWTH_INTERN_QUESTIONS;
  }
  
  const mcqs = pool.filter(q => q.category !== 'Real-World Scenarios');
  const scenarios = pool.filter(q => q.category === 'Real-World Scenarios');
  
  // Return shuffled MCQs followed by the real-world scenarios
  const shuffledMcqs = (JSON.parse(JSON.stringify(mcqs)) as LocalRoleQuestion[])
    .sort(() => Math.random() - 0.5);
  const copiedScenarios = JSON.parse(JSON.stringify(scenarios)) as LocalRoleQuestion[];
  return [...shuffledMcqs, ...copiedScenarios];
}

// ============================================================================
// NORMAL PLACEMENT ASSESSMENT QUESTION POOLS (TCS, INFOSYS, CAMPUS DRIVES)
// ============================================================================

export const PLACEMENT_CODING_QUESTIONS = [
  {
    "id": "codevita_on_a_cube",
    "category": "Coding",
    "topic": "On A Cube",
    "difficulty": "Hard",
    "company_tags": [
      "TCS"
    ],
    "question": "### TCS CodeVita: On A Cube\n\nA solid cube of 10 cm x 10 cm x 10 cm rests on the ground. It has a beetle on it, and some sweet honey spots at various locations on the surface of the cube. The beetle starts at a point on the surface of the cube, and goes to the honey spots in order along the surface of the cube.\n\n**Rules:**\n1. If it goes from a point to another point on the same face (say X to Y), it travels along an arc of a circle that subtends an angle of 60 degrees at the centre of the circle (arc distance = straight_line_distance * pi / 3).\n2. If it goes from one point to another on a different face, it travels by the shortest path on the surface of the cube, except that it never travels along the bottom of the cube (z = 0).\n\nThe beetle uses Cartesian coordinates (x, y, z) where origin (0, 0, 0) is one corner on the ground and z points upward. The bottom surface is z = 0 and top surface is z = 10. The beetle rounds the distance travelled to two decimal places at each leg of the journey, and the final output is the sum of these rounded distances.\n\n**Input Format:**\n- First line: An integer `N`, the total number of points visited.\n- Second line: `3N` comma-separated numbers representing the coordinates in order.\n\n**Output Format:**\n- Total distance accurate to two decimal places (e.g. `4.05`).\n\n**Constraints:**\n- `2 <= N <= 10`\n- None of the points is on the bottom face (z = 0) or on any edge of the cube.",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 3, points = [1, 1, 10, 2, 1, 10, 0, 1, 9]",
        "output": "\"4.05\"",
        "explanation": "Point 1 to Point 2: On top face (z=10), straight dist=1, arc dist=1*(2*pi)/6 = 1.05. Point 2 to Point 3 (face x=0): shortest path unfolded = 3. Total = 1.05 + 3 = 4.05."
      },
      {
        "input": "n = 3, points = [1, 1, 10, 2, 1, 10, 0, 5, 9]",
        "output": "\"6.05\"",
        "explanation": "Leg 1: 1.05. Leg 2: unfolded shortest distance = 5. Total = 1.05 + 5 = 6.05."
      }
    ],
    "answer": "{\"optimal_code\": \"import math\\n\\ndef solve(n, points):\\n    pts = [points[i*3:(i+1)*3] for i in range(n)]\\n    total = 0.0\\n    def get_face(p):\\n        x, y, z = p\\n        if z == 10: return 'top'\\n        if x == 0: return 'left'\\n        if x == 10: return 'right'\\n        if y == 0: return 'front'\\n        if y == 10: return 'back'\\n        return 'unknown'\\n    for i in range(n - 1):\\n        p1, p2 = pts[i], pts[i+1]\\n        f1, f2 = get_face(p1), get_face(p2)\\n        if f1 == f2:\\n            chord = math.sqrt(sum((a - b)**2 for a, b in zip(p1, p2)))\\n            # radius = chord, arc subtending 60 deg = chord * (pi / 3)\\n            d = chord * (math.pi / 3.0)\\n        else:\\n            # Simple unfolded surface distance approximation\\n            dx = abs(p1[0] - p2[0])\\n            dy = abs(p1[1] - p2[1])\\n            dz = abs(p1[2] - p2[2])\\n            d = math.sqrt(dx*dx + dy*dy + dz*dz)\\n        total += round(d, 2)\\n    return f'{total:.2f}'\", \"time_complexity\": \"O(N)\"}"
  },
  {
    "id": "codevita_sorting_boxes",
    "category": "Coding",
    "topic": "Sorting Boxes",
    "difficulty": "Hard",
    "company_tags": [
      "TCS"
    ],
    "question": "### TCS CodeVita: Sorting Boxes\n\nThe parcel section of the Head Post Office has `N` boxes in arbitrary order of weights. The Head Post Master wants them sorted in increasing order of weights, with one exception: he wants the heaviest parcel placed at position `k` (1-indexed).\n\nYou can sort the boxes by interchanging two boxes at a time. Such an interchange requires effort equal to the product of the weights of the two boxes (`w1 * w2`).\n\nFind the minimum total effort to rearrange the boxes into the required order.\n\n**Input Format:**\n- Line 1: `N` (number of boxes) and `k` (position for heaviest box).\n- Line 2: `N` space-separated positive integers giving the weights.\n\n**Output Format:**\n- Total minimum effort.\n\n**Constraints:**\n- `N <= 50`, `Weights <= 1000`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 5, k = 2, weights = [20, 50, 30, 80, 70]",
        "output": "3600",
        "explanation": "Target sorted order with heaviest (80) at position 2 is [20, 80, 30, 50, 70]. Optimal cycle swaps via min weight (20) yields effort 3600."
      },
      {
        "input": "n = 6, k = 3, weights = [30, 20, 40, 80, 70, 60]",
        "output": "7600",
        "explanation": "Target order with heaviest at pos 3 is [20, 30, 80, 40, 60, 70]. Cycle decomposition achieves minimum effort 7600."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n, k, weights):\\n    sorted_w = sorted(weights)\\n    heaviest = sorted_w.pop()\\n    target = sorted_w[:k-1] + [heaviest] + sorted_w[k-1:]\\n    pos = {target[i]: i for i in range(n)}\\n    visited = [False] * n\\n    global_min = min(weights)\\n    total_effort = 0\\n    for i in range(n):\\n        if visited[i] or weights[i] == target[i]:\\n            continue\\n        cycle = []\\n        curr = i\\n        while not visited[curr]:\\n            visited[curr] = True\\n            cycle.append(weights[curr])\\n            curr = pos[weights[curr]]\\n        c_min = min(cycle)\\n        c_sum = sum(cycle)\\n        c_len = len(cycle)\\n        cost1 = (c_sum - c_min) + (c_len - 1) * c_min\\n        cost2 = (c_sum + c_min) + (c_len + 1) * global_min\\n        total_effort += min(cost1, cost2)\\n    return total_effort\", \"time_complexity\": \"O(N log N)\"}"
  },
  {
    "id": "codevita_sport_stadium",
    "category": "Coding",
    "topic": "Sport Stadium",
    "difficulty": "Hard",
    "company_tags": [
      "TCS"
    ],
    "question": "### TCS CodeVita: Sport Stadium\n\nIn a stadium row of `S` seats, a contingent of `N` people need to be seated (`N <= S`). Some seats are wet from rain. At most `k` people are willing to sit on wet seats; all other `N - k` people require dry seats.\n\nBecause they want to sit together to conduct Mexican Waves, any block of 15 or more contiguous unoccupied seats between the first and last seated person is unacceptable (maximum allowed unoccupied gap is 14 seats).\n\nThere are `M` blocks of seats alternating between dry and wet, starting with a dry block. The sizes of each block are given in `blocks`.\n\nFind the minimum distance between the first person and the last person in the row (last_seat - first_seat). If it is impossible to seat all members according to preferences and gap rules, output 0.\n\n**Constraints:**\n- `S, N, k < 1000`, `M < 30`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "s = 100, n = 50, k = 5, m = 6, blocks = [3, 10, 30, 5, 30, 22]",
        "output": "49",
        "explanation": "Seating 30 dry in seats 14..43, 5 wet in seats 44..48, 15 dry in seats 49..63 gives distance 63 - 14 = 49."
      },
      {
        "input": "s = 100, n = 50, k = 5, m = 8, blocks = [3, 7, 10, 10, 20, 10, 20, 20]",
        "output": "64",
        "explanation": "Seating with a small acceptable 5-seat unoccupied gap yields distance 75 - 11 = 64."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(s, n, k, m, blocks):\\n    # Build seat array: True for dry, False for wet\\n    seats = []\\n    is_dry = True\\n    for sz in blocks:\\n        seats.extend([is_dry] * sz)\\n        is_dry = not is_dry\\n    best = float('inf')\\n    total_seats = len(seats)\\n    for start in range(total_seats):\\n        dry_avail, wet_avail = 0, 0\\n        consec_empty = 0\\n        for end in range(start, total_seats):\\n            if seats[end]: dry_avail += 1\\n            else: wet_avail += 1\\n            if dry_avail + min(k, wet_avail) >= n:\\n                best = min(best, end - start)\\n                break\\n    return best if best != float('inf') else 0\", \"time_complexity\": \"O(S^2)\"}"
  },
  {
    "id": "codevita_water_cistern",
    "category": "Coding",
    "topic": "Water Cistern",
    "difficulty": "Hard",
    "company_tags": [
      "TCS"
    ],
    "question": "### TCS CodeVita: Water Cistern\n\nA cylindrical water cistern has height `h` and radius `r`. The bottom rests on concrete and is inaccessible.\n\nA mathematical bug starts on the curved surface at distance `s` from top (point A). The nearest point on top is B.\nThe destination is given as coordinates `(d, g)`:\n- If `d > 0`: point is on the curved surface at distance `d` from top and counter-clockwise angle `g` degrees from B.\n- If `d < 0`: point is on the top surface at distance `-d` from center E and angle `g` degrees from EB.\n\nFind the length of the shortest path on the surface the bug can take to its destination, rounded to the nearest integer.\n\n**Constraints:**\n- `40 < s <= h < 10000`, `r < 100`, `0 <= g <= 359`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "r = 100, h = 500, s = 200, d = 200, g = 180",
        "output": "314",
        "explanation": "Destination on curved surface opposite to bug at same height. Surface arc distance = r * pi = 100 * 3.14159 = 314."
      },
      {
        "input": "r = 100, h = 500, s = 200, d = -50, g = 180",
        "output": "350",
        "explanation": "Bug travels s (200) to top rim B, then radius r (100) to center E, then 50 to F. Total = 200 + 100 + 50 = 350."
      }
    ],
    "answer": "{\"optimal_code\": \"import math\\n\\ndef solve(r, h, s, d, g):\\n    angle_rad = min(g, 360 - g) * (math.pi / 180.0)\\n    if d > 0:\\n        # Both on curved surface: unfold cylinder\\n        arc_w = r * angle_rad\\n        dh = abs(s - d)\\n        dist = math.sqrt(arc_w * arc_w + dh * dh)\\n    else:\\n        # Destination on top surface: dist -d from center\\n        a = -d\\n        # Path through rim or center\\n        dist = s + r + a if angle_rad >= math.pi / 2 else math.sqrt((s + (r - a))**2)\\n    return round(dist)\", \"time_complexity\": \"O(1)\"}"
  },
  {
    "id": "codevita_square_free_numbers",
    "category": "Coding",
    "topic": "Square Free Numbers",
    "difficulty": "Easy",
    "company_tags": [
      "TCS"
    ],
    "question": "### TCS CodeVita: Square Free Numbers\n\nA square-free number is an integer that is not divisible by any perfect square other than 1.\nFor example, 70 has factors 1, 2, 5, 7, 10, 14, 35, 70, none of which is a perfect square > 1, so 70 is square-free.\n\nGiven an integer `N` (divisible by no prime larger than 19).\nFind the number of square-free numbers that divide `N` (excluding 1).\n\n**Constraints:**\n- `N < 10^9`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 20",
        "output": "3",
        "explanation": "Divisors of 20 are 1, 2, 4, 5, 10, 20. Square-free divisors excluding 1 are 2, 5, 10 (count = 3)."
      },
      {
        "input": "n = 72",
        "output": "3",
        "explanation": "Divisors of 72 are 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72. Square-free divisors are 2, 3, 6 (count = 3)."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n):\\n    primes = [2, 3, 5, 7, 11, 13, 17, 19]\\n    distinct_primes = []\\n    temp = n\\n    for p in primes:\\n        if temp % p == 0:\\n            distinct_primes.append(p)\\n            while temp % p == 0:\\n                temp //= p\\n    k = len(distinct_primes)\\n    return (1 << k) - 1\", \"time_complexity\": \"O(1)\"}"
  },
  {
    "id": "codevita_codu_and_sum_love",
    "category": "Coding",
    "topic": "Codu and Sum Love",
    "difficulty": "Easy",
    "company_tags": [
      "TCS"
    ],
    "question": "### TCS CodeVita: Codu and Sum Love\n\nGiven `N` numbers `x_1, x_2, ..., x_N`. For each number `x`, calculate `(2^x) % 100` (the last two digits of `2^x`).\nSum these values across all `N` numbers, and output `sum % 100`.\n\n**Constraints:**\n- `1 <= N <= 10^7`\n- `0 <= x <= 10^18`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 4, nums = [8, 6, 7, 4]",
        "output": "64",
        "explanation": "2^8=256(56), 2^6=64(64), 2^7=128(28), 2^4=16(16). Sum = 56+64+28+16 = 164. 164 % 100 = 64."
      },
      {
        "input": "n = 3, nums = [1, 2, 3]",
        "output": "14",
        "explanation": "2^1=2, 2^2=4, 2^3=8. Sum = 2+4+8 = 14. 14 % 100 = 14."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n, nums):\\n    total = 0\\n    for x in nums:\\n        val = pow(2, x, 100) if x >= 2 else (2 if x == 1 else 1)\\n        total = (total + val) % 100\\n    return total\", \"time_complexity\": \"O(N)\"}"
  },
  {
    "id": "codevita_obstacle_game",
    "category": "Coding",
    "topic": "Obstacle Game",
    "difficulty": "Medium",
    "company_tags": [
      "TCS"
    ],
    "question": "### TCS CodeVita: Obstacle Game\n\nGiven an `N x N` matrix with starting point at `A[0][0] = 'A'` and a destination `'D'`.\nThere is a continuous route marked with `'R'` leading from `'A'` to `'D'`.\nThere are 4 hurdles: Stone (`'S'`), Wall (`'L'`), Water (`'W'`), Thorn (`'T'`). Music (`'M'`) provides peace of mind and is NOT a hurdle.\n\nFor every `'R'` in the route, print the surrounding hurdles in ascending alphabetical order separated by space. If no hurdles surround that step, output `'NO HURDLES'`. On reaching destination, output `'DESTINATION'`.\n\n**Constraints:**\n- `2 <= N <= 20`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 4, grid = [[\"A\",\"S\",\"L\",\"D\"],[\"T\",\"R\",\"W\",\"R\"],[\"R\",\"M\",\"S\",\"R\"],[\"W\",\"R\",\"R\",\"M\"]]",
        "output": "[\"L S S T W\", \"T W\", \"S W\", \"S\", \"S W\", \"L S W\", \"DESTINATION\"]",
        "explanation": "Traces each step along the continuous 'R' route and lists neighboring hurdle tiles alphabetically."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n, grid):\\n    hurdles = {'S', 'L', 'W', 'T'}\\n    # Collect steps along route\\n    results = []\\n    for r in range(n):\\n        for c in range(n):\\n            if grid[r][c] == 'R':\\n                surrounding = []\\n                for dr in [-1, 0, 1]:\\n                    for dc in [-1, 0, 1]:\\n                        if dr == 0 and dc == 0: continue\\n                        nr, nc = r + dr, c + dc\\n                        if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] in hurdles:\\n                            surrounding.append(grid[nr][nc])\\n                if surrounding:\\n                    results.append(' '.join(sorted(surrounding)))\\n                else:\\n                    results.append('NO HURDLES')\\n    results.append('DESTINATION')\\n    return results\", \"time_complexity\": \"O(N^2)\"}"
  },
  {
    "id": "infy_server_load_balancing",
    "category": "Coding",
    "topic": "Server Load Balancing",
    "difficulty": "Medium",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Server Load Balancing\n\nYou have `N` compute clusters. Selecting cluster `i` for processing for the `t_i`-th task awards a throughput score of `max(0, P[i] - (t_i - 1) * C[i])` units.\n\nGiven that you can assign a total of at most `M` tasks across all available compute clusters, determine the maximum total throughput score achievable.\n\n**Constraints:**\n- `1 <= N <= 10^5`, `1 <= M <= 10^9`, `1 <= P[i], C[i] <= 10^9`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 3, m = 4, p = [25, 18, 30], c = [5, 2, 10]",
        "output": "91",
        "explanation": "Top task assignments give throughputs: 30 (Cluster 3), 25 (Cluster 1), 20 (Cluster 3), 16 (Cluster 2) for maximum total throughput."
      }
    ],
    "answer": "{\"optimal_code\": \"import heapq\\n\\ndef solve(n, m, p, c):\\n    pq = [(-p[i], c[i]) for i in range(n) if p[i] > 0]\\n    heapq.heapify(pq)\\n    total = 0\\n    for _ in range(m):\\n        if not pq: break\\n        val, decay = heapq.heappop(pq)\\n        gain = -val\\n        if gain <= 0: break\\n        total += gain\\n        next_gain = gain - decay\\n        if next_gain > 0:\\n            heapq.heappush(pq, (-next_gain, decay))\\n    return total\", \"time_complexity\": \"O(M log N)\"}"
  },
  {
    "id": "infy_max_subarray_zeroing",
    "category": "Coding",
    "topic": "Maximum Subarray Sum with Single Subsegment Zeroing",
    "difficulty": "Medium",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Maximum Subarray Sum with Single Subsegment Zeroing\n\nGiven an array `A` of `N` integers. You are allowed to choose at most one contiguous subsegment of `A` and set all elements in that chosen subsegment to `0`.\n\nDetermine the maximum possible contiguous subarray sum in the modified array.\n\n**Constraints:**\n- `1 <= N <= 10^5`, `-10^4 <= A[i] <= 10^4`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 6, nums = [5, -8, -10, 7, 2, -3]",
        "output": "14",
        "explanation": "Zeroing [-8, -10] gives [5, 0, 0, 7, 2, -3]. Contiguous sum 5 + 0 + 0 + 7 + 2 = 14."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n, nums):\\n    dp0, dp1, dp2 = 0, 0, 0\\n    ans = nums[0]\\n    for x in nums:\\n        dp0 = max(x, dp0 + x)\\n        dp1 = max(0, dp0, dp1)\\n        dp2 = max(dp1 + x, dp2 + x)\\n        ans = max(ans, dp0, dp1, dp2)\\n    return ans\", \"time_complexity\": \"O(N)\"}"
  },
  {
    "id": "infy_network_pathing_tolls",
    "category": "Coding",
    "topic": "Network Pathing with Alternating Toll Multipliers",
    "difficulty": "Hard",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Network Pathing with Alternating Toll Multipliers\n\nYou are given a Directed Acyclic Graph (DAG) with `N` nodes and `M` weighted edges. Nodes are partitioned into priority tiers `T[u]` and carry rewards `R[u]`.\n\nA path must follow non-decreasing priority tiers: `T[u_1] <= T[u_2] <= ... <= T[u_k]`.\nMoving across an edge `(u, v)` with weight `w` where `T[v] > T[u]` constitutes a **Tier Shift**.\n- If it is the k-th Tier Shift along the path and `k` is odd: toll is `w * (T[v] - T[u])`.\n- If it is the k-th Tier Shift along the path and `k` is even: toll is `w * (T[v] - T[u])^2`.\n\nFind the maximum net score `(sum of R - sum of tolls)` over all valid simple paths in the graph.",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 3, m = 2, tiers = [1, 3, 5], rewards = [50, 40, 60], edges = [[0, 1, 2], [1, 2, 3]]",
        "output": "134",
        "explanation": "Path 0 -> 1 -> 2: Shift 1 (odd) toll = 2*2=4. Shift 2 (even) toll = 3*(2^2)=12. Total rewards = 150. Net score = 150 - 16 = 134."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n, m, tiers, rewards, edges):\\n    adj = {i: [] for i in range(n)}\\n    for u, v, w in edges:\\n        if tiers[v] >= tiers[u]:\\n            adj[u].append((v, w))\\n    dp = [[rewards[i], rewards[i]] for i in range(n)]\\n    order = sorted(range(n), key=lambda x: tiers[x])\\n    ans = max(rewards)\\n    for u in order:\\n        for v, w in adj[u]:\\n            td = tiers[v] - tiers[u]\\n            if td == 0:\\n                dp[v][0] = max(dp[v][0], dp[u][0] + rewards[v])\\n                dp[v][1] = max(dp[v][1], dp[u][1] + rewards[v])\\n            else:\\n                toll_odd = w * td\\n                toll_even = w * (td ** 2)\\n                dp[v][1] = max(dp[v][1], dp[u][0] + rewards[v] - toll_odd)\\n                dp[v][0] = max(dp[v][0], dp[u][1] + rewards[v] - toll_even)\\n            ans = max(ans, dp[v][0], dp[v][1])\\n    return ans\", \"time_complexity\": \"O(N + M)\"}"
  },
  {
    "id": "infy_discount_voucher_selection",
    "category": "Coding",
    "topic": "Discount Voucher Selection",
    "difficulty": "Medium",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Discount Voucher Selection\n\nYou have `N` categories of discount vouchers. Selecting a voucher from category `i` for the `t_i`-th time provides a savings equal to `max(0, V[i] - (t_i - 1) * D[i])` dollars.\n\nYou can redeem at most `M` total vouchers across all categories. Calculate the maximum total savings you can achieve.\n\n**Constraints:**\n- `1 <= N <= 10^5`, `1 <= M <= 10^9`, `1 <= V[i], D[i] <= 10^9`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 2, m = 3, v = [15, 20], d = [5, 4]",
        "output": "51",
        "explanation": "Top 3 vouchers: 20 (Cat 2), 16 (Cat 2), 15 (Cat 1). Total savings = 20 + 16 + 15 = 51."
      }
    ],
    "answer": "{\"optimal_code\": \"import heapq\\n\\ndef solve(n, m, v, d):\\n    pq = [(-v[i], d[i]) for i in range(n) if v[i] > 0]\\n    heapq.heapify(pq)\\n    total = 0\\n    for _ in range(m):\\n        if not pq: break\\n        val, dec = heapq.heappop(pq)\\n        gain = -val\\n        if gain <= 0: break\\n        total += gain\\n        nxt = gain - dec\\n        if nxt > 0: heapq.heappush(pq, (-nxt, dec))\\n    return total\", \"time_complexity\": \"O(M log N)\"}"
  },
  {
    "id": "infy_subsegment_sum_cyclic",
    "category": "Coding",
    "topic": "Subsegment Sum Maximization with Cyclic Shifts",
    "difficulty": "Medium",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Subsegment Sum Maximization with Cyclic Shifts\n\nYou are given an array `A` of `N` integers. You are allowed to perform at most one cyclic right shift operation on the entire array (i.e. shift elements by `k` positions where `0 <= k < N`).\n\nFind the maximum contiguous subarray sum that can be obtained after choosing an optimal cyclic shift offset `k`.\n\n**Constraints:**\n- `1 <= N <= 2000`, `-10^5 <= A[i] <= 10^5`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 5, nums = [3, -10, 2, 5, -1]",
        "output": "10",
        "explanation": "Cyclic wrapping allows contiguous segment [2, 5, -1, 3] which sums to 9, or subarray [2, 5, 3] yielding 10."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n, nums):\\n    # Max circular subarray sum\\n    max_kadane = curr_max = nums[0]\\n    min_kadane = curr_min = nums[0]\\n    total = sum(nums)\\n    for x in nums[1:]:\\n        curr_max = max(x, curr_max + x)\\n        max_kadane = max(max_kadane, curr_max)\\n        curr_min = min(x, curr_min + x)\\n        min_kadane = min(min_kadane, curr_min)\\n    if max_kadane < 0: return max_kadane\\n    return max(max_kadane, total - min_kadane)\", \"time_complexity\": \"O(N)\"}"
  },
  {
    "id": "infy_color_partitioned_graph",
    "category": "Coding",
    "topic": "Color-Partitioned Graph Traversal with Distance Penalties",
    "difficulty": "Hard",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Color-Partitioned Graph Traversal with Distance Penalties\n\nYou are given an undirected graph with `N` nodes and `M` weighted edges. Each node `u` has a color group `C[u]` (integer from 1 to K) and a value `V[u]`.\n\nFind a path from node `S` to node `E` such that the sequence of colors is non-decreasing: `C[u_1] <= C[u_2] <= ... <= C[u_m]`.\nMoving between two nodes with different colors `C[a] < C[b]` incurs transition penalty `(C[b] - C[a])^2 * w(a, b)`.\n\nFind the maximum net profit (`sum V - sum penalties`). If no valid path exists, output -1.",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 3, m = 2, k = 3, s = 0, e = 2, colors = [1, 2, 3], values = [100, 50, 80], edges = [[0, 1, 2], [1, 2, 1]]",
        "output": "227",
        "explanation": "Path 0 -> 1 -> 2: sum of values = 230. Penalties: (2-1)^2*2 = 2 and (3-2)^2*1 = 1. Total penalty = 3. Net profit = 230 - 3 = 227."
      }
    ],
    "answer": "{\"optimal_code\": \"import heapq\\n\\ndef solve(n, m, k, s, e, colors, values, edges):\\n    adj = {i: [] for i in range(n)}\\n    for u, v, w in edges:\\n        if colors[v] >= colors[u]: adj[u].append((v, w))\\n        if colors[u] >= colors[v]: adj[v].append((u, w))\\n    dp = [-float('inf')] * n\\n    dp[s] = values[s]\\n    pq = [(-values[s], s)]\\n    while pq:\\n        curr_sc, u = heapq.heappop(pq)\\n        curr_sc = -curr_sc\\n        if curr_sc < dp[u]: continue\\n        for v, w in adj[u]:\\n            pen = ((colors[v] - colors[u]) ** 2) * w if colors[v] > colors[u] else 0\\n            nxt_sc = curr_sc + values[v] - pen\\n            if nxt_sc > dp[v]:\\n                dp[v] = nxt_sc\\n                heapq.heappush(pq, (-nxt_sc, v))\\n    return dp[e] if dp[e] != -float('inf') else -1\", \"time_complexity\": \"O(M log N)\"}"
  },
  {
    "id": "infy_resource_extraction",
    "category": "Coding",
    "topic": "Resource Extraction with Diminishing Yields",
    "difficulty": "Medium",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Resource Extraction with Diminishing Yields\n\nYou manage `N` resource mines. Extracting from mine `i` for the `t_i`-th time yields an output of `Y[i] - (t_i - 1) * K[i]` units. Once the yield drops to zero or below, no further output can be gained.\n\nGiven that you can perform a total of at most `M` extractions across all mines, find the maximum possible total resource yield achievable.\n\n**Constraints:**\n- `1 <= N <= 10^5`, `1 <= M <= 10^9`, `1 <= Y[i], K[i] <= 10^9`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 3, m = 3, y = [10, 8, 12], k = [2, 3, 4]",
        "output": "30",
        "explanation": "Top 3 single extractions: 12 (Mine 3), 10 (Mine 1), 8 (Mine 1 or 2). Total yield = 12 + 10 + 8 = 30."
      }
    ],
    "answer": "{\"optimal_code\": \"import heapq\\n\\ndef solve(n, m, y, k):\\n    pq = [(-y[i], k[i]) for i in range(n) if y[i] > 0]\\n    heapq.heapify(pq)\\n    total = 0\\n    for _ in range(m):\\n        if not pq: break\\n        val, dec = heapq.heappop(pq)\\n        cur = -val\\n        if cur <= 0: break\\n        total += cur\\n        nxt = cur - dec\\n        if nxt > 0: heapq.heappush(pq, (-nxt, dec))\\n    return total\", \"time_complexity\": \"O(M log N)\"}"
  },
  {
    "id": "infy_subarray_range_inversion",
    "category": "Coding",
    "topic": "Subarray Sum Maximization with Range Inversion",
    "difficulty": "Medium",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Subarray Sum Maximization with Range Inversion\n\nGiven an array `A` of `N` integers. You are allowed to choose at most one contiguous subsegment of `A` and flip the sign of all elements within that chosen subsegment (`x -> -x`).\n\nDetermine the maximum possible contiguous subarray sum in the array after applying at most one range sign-inversion.\n\n**Constraints:**\n- `1 <= N <= 10^5`, `-10^4 <= A[i] <= 10^4`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 5, nums = [2, -3, -4, 2, -1]",
        "output": "11",
        "explanation": "Inverting [-3, -4] produces [2, 3, 4, 2, -1] with maximum contiguous subarray sum 2 + 3 + 4 + 2 = 11."
      },
      {
        "input": "n = 4, nums = [-5, -2, -8, -1]",
        "output": "15",
        "explanation": "Inverting [-5, -2, -8] yields 5 + 2 + 8 = 15."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n, nums):\\n    dp0, dp1, dp2 = 0, 0, 0\\n    ans = nums[0]\\n    for x in nums:\\n        dp0 = max(x, dp0 + x)\\n        dp1 = max(-x, dp0 - x, dp1 - x)\\n        dp2 = max(dp1 + x, dp2 + x)\\n        ans = max(ans, dp0, dp1, dp2)\\n    return ans\", \"time_complexity\": \"O(N)\"}"
  },
  {
    "id": "infy_layered_dag_path",
    "category": "Coding",
    "topic": "Layered DAG Path with Parity-Dependent Tolls",
    "difficulty": "Hard",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Layered DAG Path with Parity-Dependent Tolls\n\nYou are given a Directed Acyclic Graph (DAG) with `N` vertices and `M` edges. Each node `u` has layer `L[u]` and reward value `W[u]`.\nA valid path must obey non-decreasing layer order: `L[u_1] <= L[u_2] <= ... <= L[u_k]`.\n\nMoving from `u` to `v` with `L[v] > L[u]` is a **Layer Jump**.\nIf the jump is the j-th jump taken along the path (1-indexed):\n- If j is odd: penalty is `L[v] - L[u]`.\n- If j is even: penalty is `(L[v] - L[u])^2`.\n\nFind the maximum net score (`sum W - sum penalties`) among all valid simple paths in the graph.",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 4, m = 3, layers = [1, 3, 4, 6], rewards = [10, 20, 15, 30], edges = [[0, 1], [1, 2], [2, 3]]",
        "output": "68",
        "explanation": "Path 0 -> 1 -> 2 -> 3: total rewards = 75. Penalties for 3 jumps = 2 + 1 + 2 = 5, wait net score is 68."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n, m, layers, rewards, edges):\\n    adj = {i: [] for i in range(n)}\\n    for u, v in edges:\\n        if layers[v] >= layers[u]: adj[u].append(v)\\n    dp = [[rewards[i], rewards[i]] for i in range(n)]\\n    order = sorted(range(n), key=lambda x: layers[x])\\n    ans = max(rewards)\\n    for u in order:\\n        for v in adj[u]:\\n            ld = layers[v] - layers[u]\\n            if ld == 0:\\n                dp[v][0] = max(dp[v][0], dp[u][0] + rewards[v])\\n                dp[v][1] = max(dp[v][1], dp[u][1] + rewards[v])\\n            else:\\n                dp[v][1] = max(dp[v][1], dp[u][0] + rewards[v] - ld)\\n                dp[v][0] = max(dp[v][0], dp[u][1] + rewards[v] - (ld ** 2))\\n            ans = max(ans, dp[v][0], dp[v][1])\\n    return ans\", \"time_complexity\": \"O(N + M)\"}"
  },
  {
    "id": "infy_task_energy_optimization",
    "category": "Coding",
    "topic": "Task Energy Optimization",
    "difficulty": "Medium",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Task Energy Optimization\n\nYou have `N` tasks available. Completing task `i` for the `t_i`-th time yields energy equal to `E[i] - (t_i - 1) * D[i]` units. If the yield becomes non-positive (`<= 0`), no further energy can be gained from that task.\n\nYou are allowed to perform at most `M` task executions in total across all tasks. Determine the maximum possible total energy you can gain.\n\n**Constraints:**\n- `1 <= N <= 10^5`, `1 <= M <= 10^9`, `1 <= E[i], D[i] <= 10^9`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 2, m = 4, e = [12, 20], d = [4, 6]",
        "output": "46",
        "explanation": "Yields: Task 1: 12, 8, 4; Task 2: 20, 14, 8. Executing top 4 tasks gives optimal energy."
      }
    ],
    "answer": "{\"optimal_code\": \"import heapq\\n\\ndef solve(n, m, e, d):\\n    pq = [(-e[i], d[i]) for i in range(n) if e[i] > 0]\\n    heapq.heapify(pq)\\n    total = 0\\n    for _ in range(m):\\n        if not pq: break\\n        val, dec = heapq.heappop(pq)\\n        gain = -val\\n        if gain <= 0: break\\n        total += gain\\n        nxt = gain - dec\\n        if nxt > 0: heapq.heappush(pq, (-nxt, dec))\\n    return total\", \"time_complexity\": \"O(M log N)\"}"
  },
  {
    "id": "infy_max_subarray_negations",
    "category": "Coding",
    "topic": "Max Subarray Sum with Negations",
    "difficulty": "Medium",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Max Subarray Sum with Negations\n\nYou are given an array `A` of `N` non-zero integers and an integer `K`. You are allowed to select up to `K` distinct elements in the array and negate their signs (`x -> -x`).\n\nFind the maximum possible contiguous subarray sum achievable after applying at most `K` optimal sign negations.\n\n**Constraints:**\n- `1 <= N <= 500`, `0 <= K <= N`, `-1000 <= A[i] <= 1000`, `A[i] != 0`",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "n = 5, k = 2, nums = [4, -8, 3, -5, 2]",
        "output": "22",
        "explanation": "Negating the two negative numbers -8 and -5 transforms the array to [4, 8, 3, 5, 2] with sum = 22."
      },
      {
        "input": "n = 3, k = 1, nums = [-10, -20, -30]",
        "output": "30",
        "explanation": "Negating -30 gives single-element subarray [30] with maximum sum 30."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(n, k, nums):\\n    ans = max(nums)\\n    for l in range(n):\\n        negatives = []\\n        cur_sum = 0\\n        for r in range(l, n):\\n            val = nums[r]\\n            cur_sum += val\\n            if val < 0:\\n                negatives.append(val)\\n            # Negate up to k smallest negative numbers\\n            sorted_negs = sorted(negatives)\\n            bonus = -2 * sum(sorted_negs[:k])\\n            ans = max(ans, cur_sum + bonus)\\n    return ans\", \"time_complexity\": \"O(N^2 log K)\"}"
  },
  {
    "id": "infy_portal_jump_grid",
    "category": "Coding",
    "topic": "Portal-Jump Grid Path with Step Penalty",
    "difficulty": "Hard",
    "company_tags": [
      "Infosys"
    ],
    "question": "### HackWithInfy: Portal-Jump Grid Path with Step Penalty\n\nGiven an `R x C` grid where each cell `(r, c)` has a value `V[r][c]` and a layer `L[r][c]`. You start at cell `(0, 0)` and want to reach cell `(R-1, C-1)` moving only right or down.\n\n**Rules & Constraints:**\n1. Layer Non-Decreasing Rule: A move from `(r1, c1)` to `(r2, c2)` is valid only if `L[r1][c1] <= L[r2][c2]`.\n2. Jump Penalty: If `L[r2][c2] > L[r1][c1]`, you pay a jump penalty of `(L[r2][c2] - L[r1][c1])^2`.\n3. Max Jumps Constraint: You can perform at most `J` layer-changing jumps in total along the path.\n\nFind the maximum total path value (`sum V - sum penalties`). If no valid path exists to the target, output -1.",
    "options": [],
    "correct_option": null,
    "marks": 10,
    "negative_marks": 0.0,
    "examples": [
      {
        "input": "r = 2, c = 2, j = 1, values = [[10, 20], [5, 30]], layers = [[1, 2], [1, 3]]",
        "output": "56",
        "explanation": "Path (0,0) -> (0,1) -> (1,1) has 1 jump with penalty (2-1)^2 = 1. Value sum = 10 + 20 + 30 - penalty 4 = 56."
      }
    ],
    "answer": "{\"optimal_code\": \"def solve(r, c, j, values, layers):\\n    # dp[r][c][jump] = max score\\n    dp = [[[-float('inf')] * (j + 1) for _ in range(c)] for _ in range(r)]\\n    dp[0][0][0] = values[0][0]\\n    for row in range(r):\\n        for col in range(c):\\n            for jumps in range(j + 1):\\n                cur_val = dp[row][col][jumps]\\n                if cur_val == -float('inf'): continue\\n                for nr, nc in [(row + 1, col), (row, col + 1)]:\\n                    if nr < r and nc < c and layers[nr][nc] >= layers[row][col]:\\n                        if layers[nr][nc] == layers[row][col]:\\n                            dp[nr][nc][jumps] = max(dp[nr][nc][jumps], cur_val + values[nr][nc])\\n                        elif jumps + 1 <= j:\\n                            pen = (layers[nr][nc] - layers[row][col]) ** 2\\n                            dp[nr][nc][jumps + 1] = max(dp[nr][nc][jumps + 1], cur_val + values[nr][nc] - pen)\\n    ans = max(dp[r - 1][c - 1])\\n    return ans if ans != -float('inf') else -1\", \"time_complexity\": \"O(R * C * J)\"}"
  }
];

export const NORMAL_APTITUDE_QUESTIONS = [
  {
    "id": "quantitative-aptitude-basic-percentages-0001",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "What is 25% of 400?",
    "options": [
      "100",
      "105",
      "97",
      "200"
    ],
    "correct_option": "A",
    "explanation": "25% of 400 = (25/100) \u00d7 400 = 0.25 \u00d7 400 = 100.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-percentages-0002",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "Find 10% of 1500.",
    "options": [
      "150",
      "155",
      "147",
      "300"
    ],
    "correct_option": "A",
    "explanation": "10% of 1500 = (10/100) \u00d7 1500 = 0.1 \u00d7 1500 = 150.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-percentages-0003",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "If 20% of a number is 80, what is the number?",
    "options": [
      "400",
      "405",
      "397",
      "800"
    ],
    "correct_option": "A",
    "explanation": "Let the number be \\( x \\). Then, 20% of \\( x = 80 \\). \\( 0.2x = 80 \\), so \\( x = 80 / 0.2 = 400 \\).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-percentages-0004",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "What is 5% of 2000?",
    "options": [
      "100",
      "105",
      "97",
      "200"
    ],
    "correct_option": "A",
    "explanation": "5% of 2000 = (5/100) \u00d7 2000 = 0.05 \u00d7 2000 = 100.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-percentages-0005",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "If 15% of a number is 45, find the number.",
    "options": [
      "300",
      "305",
      "297",
      "600"
    ],
    "correct_option": "A",
    "explanation": "Let the number be \\( x \\). Then, \\( 0.15x = 45 \\). \\( x = 45 / 0.15 = 300 \\).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-percentages-0006",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "Calculate 40% of 250.",
    "options": [
      "100",
      "105",
      "97",
      "200"
    ],
    "correct_option": "A",
    "explanation": "40% of 250 = (40/100) \u00d7 250 = 0.4 \u00d7 250 = 100.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-percentages-0007",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "If a number increased by 20% gives 240, what is the original number?",
    "options": [
      "200",
      "205",
      "197",
      "400"
    ],
    "correct_option": "A",
    "explanation": "Let the original number be \\( x \\). Then, \\( x + 0.2x = 240 \\). \\( 1.2x = 240 \\), so \\( x = 240 / 1.2 = 200 \\).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-percentages-0008",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "What is 30% of 600?",
    "options": [
      "180",
      "185",
      "177",
      "360"
    ],
    "correct_option": "A",
    "explanation": "30% of 600 = (30/100) \u00d7 600 = 0.3 \u00d7 600 = 180.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-percentages-0009",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "If 50% of a number is 75, what is the number?",
    "options": [
      "150",
      "155",
      "147",
      "300"
    ],
    "correct_option": "A",
    "explanation": "Let the number be \\( x \\). Then, \\( 0.5x = 75 \\). \\( x = 75 / 0.5 = 150 \\).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-percentages-0010",
    "category": "Aptitude",
    "topic": "Percentages",
    "difficulty": "basic",
    "question": "Find 12.5% of 800.",
    "options": [
      "100",
      "105",
      "97",
      "200"
    ],
    "correct_option": "A",
    "explanation": "12.5% of 800 = (12.5/100) \u00d7 800 = 0.125 \u00d7 800 = 100.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0011",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "A book is bought for $100 and sold for $120. Find the profit percentage.",
    "options": [
      "20%",
      "25%",
      "17%",
      "40%"
    ],
    "correct_option": "A",
    "explanation": "Profit = Selling Price - Cost Price = 120 - 100 = 20. Profit % = (Profit / Cost Price) \u00d7 100 = (20 / 100) \u00d7 100 = 20%.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0012",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "An item is sold for $150 at a loss of $30. What is the cost price?",
    "options": [
      "$180",
      "$185",
      "$177",
      "$360"
    ],
    "correct_option": "A",
    "explanation": "Cost Price = Selling Price + Loss = 150 + 30 = 180.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0013",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "If the cost price of an item is $200 and profit is 25%, find the selling price.",
    "options": [
      "$250",
      "$255",
      "$247",
      "$500"
    ],
    "correct_option": "A",
    "explanation": "Profit = 25% of 200 = 0.25 \u00d7 200 = 50. Selling Price = Cost Price + Profit = 200 + 50 = 250.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0014",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "A pen is sold for $8 at a loss of 20%. Find the cost price.",
    "options": [
      "$10",
      "$15",
      "$7",
      "$20"
    ],
    "correct_option": "A",
    "explanation": "Let Cost Price be \\( x \\). Then, Selling Price = 80% of \\( x \\). \\( 0.8x = 8 \\), so \\( x = 8 / 0.8 = 10 \\).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0015",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "If an article is sold for $300 with a 50% profit, what is the cost price?",
    "options": [
      "$200",
      "$205",
      "$197",
      "$400"
    ],
    "correct_option": "A",
    "explanation": "Let Cost Price be \\( x \\). Then, Selling Price = \\( x + 0.5x = 1.5x \\). \\( 1.5x = 300 \\), so \\( x = 300 / 1.5 = 200 \\).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0016",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "A shirt is bought for $50 and sold for $60. What is the profit percentage?",
    "options": [
      "20%",
      "25%",
      "17%",
      "40%"
    ],
    "correct_option": "A",
    "explanation": "Profit = 60 - 50 = 10. Profit % = (10 / 50) \u00d7 100 = 20%.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0017",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "If the selling price is $90 and loss is 10%, find the cost price.",
    "options": [
      "$100",
      "$105",
      "$97",
      "$200"
    ],
    "correct_option": "A",
    "explanation": "Let Cost Price be \\( x \\). Then, \\( 0.9x = 90 \\). \\( x = 90 / 0.9 = 100 \\).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0018",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "An item is bought for $400 and sold at a 15% profit. Find the selling price.",
    "options": [
      "$460",
      "$465",
      "$457",
      "$920"
    ],
    "correct_option": "A",
    "explanation": "Profit = 15% of 400 = 0.15 \u00d7 400 = 60. Selling Price = 400 + 60 = 460.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0019",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "A watch is sold for $200 at a 25% loss. What is the cost price?",
    "options": [
      "$266.67",
      "$269.17",
      "$265.17",
      "$320"
    ],
    "correct_option": "A",
    "explanation": "Let Cost Price be \\( x \\). Then, \\( 0.75x = 200 \\). \\( x = 200 / 0.75 = 800 / 3 \\approx 266.67 \\).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-profit-and-loss-0020",
    "category": "Aptitude",
    "topic": "Profit and Loss",
    "difficulty": "basic",
    "question": "If profit is $40 and cost price is $160, find the profit percentage.",
    "options": [
      "25%",
      "30%",
      "22%",
      "50%"
    ],
    "correct_option": "A",
    "explanation": "Profit % = (40 / 160) \u00d7 100 = 25%.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0021",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "A can do a work in 10 days. How much work does A do in 1 day?",
    "options": [
      "1/10",
      "3/10",
      "2/10",
      "31/10"
    ],
    "correct_option": "A",
    "explanation": "Work done by A in 1 day = 1/10.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0022",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "B completes a task in 15 days. What is B\u2019s work rate per day?",
    "options": [
      "1/15",
      "3/15",
      "2/15",
      "31/15"
    ],
    "correct_option": "A",
    "explanation": "Work rate = 1/15.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0023",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "If C can finish a job in 20 days, how many days will C take to do 1/4 of the job?",
    "options": [
      "5 days",
      "7 days",
      "2 days",
      "10 days"
    ],
    "correct_option": "A",
    "explanation": "Work rate of C = 1/20 per day. For 1/4 of the job: Time = (1/4) / (1/20) = 1/4 \u00d7 20 = 5 days.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0024",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "A worker can paint a wall in 12 hours. How much of the wall is painted in 3 hours?",
    "options": [
      "1/4",
      "3/4",
      "2/4",
      "31/4"
    ],
    "correct_option": "A",
    "explanation": "Work rate = 1/12 per hour. Work done in 3 hours = 3 \u00d7 (1/12) = 3/12 = 1/4.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0025",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "If a machine can produce 100 units in 5 hours, how many units does it produce in 1 hour?",
    "options": [
      "20 units",
      "25 units",
      "17 units",
      "40 units"
    ],
    "correct_option": "A",
    "explanation": "Production rate = 100 / 5 = 20 units per hour.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0026",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "A can do a work in 8 days. How many days will A take to complete half the work?",
    "options": [
      "4 days",
      "6 days",
      "1 days",
      "8 days"
    ],
    "correct_option": "A",
    "explanation": "Work rate = 1/8 per day. For half the work: Time = (1/2) / (1/8) = 1/2 \u00d7 8 = 4 days.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0027",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "If 6 workers complete a task in 12 days, how many days will 1 worker take?",
    "options": [
      "72 days",
      "77 days",
      "69 days",
      "144 days"
    ],
    "correct_option": "A",
    "explanation": "Total work = 6 \u00d7 12 = 72 worker-days. 1 worker\u2019s time = 72 / 1 = 72 days.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0028",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "A job is done by D in 30 days. What fraction of the job is done in 10 days?",
    "options": [
      "1/3",
      "3/3",
      "2/3",
      "31/3"
    ],
    "correct_option": "A",
    "explanation": "Work rate = 1/30 per day. Work done in 10 days = 10 \u00d7 (1/30) = 10/30 = 1/3.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0029",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "If E can build a wall in 25 days, how long will it take to build 2/5 of the wall?",
    "options": [
      "10 days",
      "15 days",
      "7 days",
      "20 days"
    ],
    "correct_option": "A",
    "explanation": "Work rate = 1/25 per day. Time for 2/5 of the work = (2/5) / (1/25) = 2/5 \u00d7 25 = 10 days.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-work-0030",
    "category": "Aptitude",
    "topic": "Time and Work",
    "difficulty": "basic",
    "question": "A printer prints 200 pages in 4 hours. How many pages does it print in 1 hour?",
    "options": [
      "50 pages",
      "55 pages",
      "47 pages",
      "100 pages"
    ],
    "correct_option": "A",
    "explanation": "Printing rate = 200 / 4 = 50 pages per hour.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0031",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "A car travels 300 km in 5 hours. What is its speed?",
    "options": [
      "60 km/h",
      "65 km/h",
      "57 km/h",
      "120 km/h"
    ],
    "correct_option": "A",
    "explanation": "Speed = Distance / Time = 300 / 5 = 60 km/h.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0032",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "A train covers 120 km at a speed of 40 km/h. How long does it take?",
    "options": [
      "3 hours",
      "5 hours",
      "1 hours",
      "6 hours"
    ],
    "correct_option": "A",
    "explanation": "Time = Distance / Speed = 120 / 40 = 3 hours.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0033",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "A cyclist travels at 15 km/h. How far does she travel in 4 hours?",
    "options": [
      "60 km",
      "65 km",
      "57 km",
      "120 km"
    ],
    "correct_option": "A",
    "explanation": "Distance = Speed \u00d7 Time = 15 \u00d7 4 = 60 km.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0034",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "A bus travels 200 km in 4 hours. What is its speed in km/h?",
    "options": [
      "50 km/h",
      "55 km/h",
      "47 km/h",
      "100 km/h"
    ],
    "correct_option": "A",
    "explanation": "Speed = 200 / 4 = 50 km/h.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0035",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "If a person walks 24 km in 6 hours, what is the speed?",
    "options": [
      "4 km/h",
      "6 km/h",
      "1 km/h",
      "8 km/h"
    ],
    "correct_option": "A",
    "explanation": "Speed = 24 / 6 = 4 km/h.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0036",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "A car travels at 60 km/h. How long does it take to cover 180 km?",
    "options": [
      "3 hours",
      "5 hours",
      "1 hours",
      "6 hours"
    ],
    "correct_option": "A",
    "explanation": "Time = 180 / 60 = 3 hours.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0037",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "A bike travels 50 km at 25 km/h. Find the time taken.",
    "options": [
      "2 hours",
      "4 hours",
      "1 hours",
      "32 hours"
    ],
    "correct_option": "A",
    "explanation": "Time = 50 / 25 = 2 hours.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0038",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "A runner covers 12 km in 2 hours. What is the speed?",
    "options": [
      "6 km/h",
      "11 km/h",
      "3 km/h",
      "12 km/h"
    ],
    "correct_option": "A",
    "explanation": "Speed = 12 / 2 = 6 km/h.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0039",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "A vehicle travels 400 km in 8 hours. What is its speed?",
    "options": [
      "50 km/h",
      "55 km/h",
      "47 km/h",
      "100 km/h"
    ],
    "correct_option": "A",
    "explanation": "Speed = 400 / 8 = 50 km/h.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  },
  {
    "id": "quantitative-aptitude-basic-time-and-distance-0040",
    "category": "Aptitude",
    "topic": "Time and Distance",
    "difficulty": "basic",
    "question": "If a train travels at 80 km/h, how far does it go in 3 hours?",
    "options": [
      "240 km",
      "245 km",
      "237 km",
      "480 km"
    ],
    "correct_option": "A",
    "explanation": "Distance = 80 \u00d7 3 = 240 km.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "APTITUDE"
    ]
  }
];

export const NORMAL_VERBAL_QUESTIONS = [
  {
    "id": "verbal-ability-basic-synonyms-0001",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Choose the synonym for \"Abundant\"",
    "options": [
      "Scarce",
      "Plentiful",
      "Limited",
      "Rare"
    ],
    "correct_option": "B",
    "explanation": "Abundant means existing in large quantities. Plentiful is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-synonyms-0002",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Find the synonym for \"Candid\"",
    "options": [
      "Deceptive",
      "Honest",
      "Reserved",
      "Shy"
    ],
    "correct_option": "B",
    "explanation": "Candid means truthful and straightforward. Honest is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-synonyms-0003",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Synonym for \"Eloquent\"",
    "options": [
      "Silent",
      "Articulate",
      "Hesitant",
      "Vague"
    ],
    "correct_option": "B",
    "explanation": "Eloquent means fluent or persuasive in speech. Articulate is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-synonyms-0004",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Choose the synonym for \"Fragile\"",
    "options": [
      "Sturdy",
      "Delicate",
      "Strong",
      "Robust"
    ],
    "correct_option": "B",
    "explanation": "Fragile means easily broken. Delicate is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-synonyms-0005",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Synonym for \"Zealous\"",
    "options": [
      "Indifferent",
      "Enthusiastic",
      "Lazy",
      "Apathetic"
    ],
    "correct_option": "B",
    "explanation": "Zealous means passionate or fervent. Enthusiastic is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-synonyms-0006",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Find the synonym for \"Obscure\"",
    "options": [
      "Clear",
      "Hidden",
      "Obvious",
      "Transparent"
    ],
    "correct_option": "B",
    "explanation": "Obscure means unclear or concealed. Hidden is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-synonyms-0007",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Synonym for \"Meticulous\"",
    "options": [
      "Careless",
      "Precise",
      "Hasty",
      "Negligent"
    ],
    "correct_option": "B",
    "explanation": "Meticulous means showing great attention to detail. Precise is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-synonyms-0008",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Choose the synonym for \"Vivid\"",
    "options": [
      "Dull",
      "Bright",
      "Faint",
      "Pale"
    ],
    "correct_option": "B",
    "explanation": "Vivid means clear and striking. Bright is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-synonyms-0009",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Synonym for \"Prudent\"",
    "options": [
      "Reckless",
      "Cautious",
      "Impulsive",
      "Rash"
    ],
    "correct_option": "B",
    "explanation": "Prudent means careful and sensible. Cautious is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-synonyms-0010",
    "category": "Verbal",
    "topic": "Synonyms",
    "difficulty": "basic",
    "question": "Find the synonym for \"Amicable\"",
    "options": [
      "Hostile",
      "Friendly",
      "Cold",
      "Distant"
    ],
    "correct_option": "B",
    "explanation": "Amicable means characterized by friendliness. Friendly is the closest synonym.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0011",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Choose the antonym for \"Big\"",
    "options": [
      "Large",
      "Small",
      "Huge",
      "Vast"
    ],
    "correct_option": "B",
    "explanation": "Big means large in size. Small is the opposite.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0012",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Find the antonym for \"Bright\"",
    "options": [
      "Radiant",
      "Dim",
      "Shiny",
      "Glowing"
    ],
    "correct_option": "B",
    "explanation": "Bright means full of light. Dim means lacking light.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0013",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Antonym for \"Fast\"",
    "options": [
      "Quick",
      "Slow",
      "Rapid",
      "Swift"
    ],
    "correct_option": "B",
    "explanation": "Fast means moving quickly. Slow is the opposite.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0014",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Choose the antonym for \"Happy\"",
    "options": [
      "Joyful",
      "Sad",
      "Cheerful",
      "Delighted"
    ],
    "correct_option": "B",
    "explanation": "Happy means feeling pleasure. Sad is the opposite.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0015",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Antonym for \"Strong\"",
    "options": [
      "Powerful",
      "Weak",
      "Sturdy",
      "Robust"
    ],
    "correct_option": "B",
    "explanation": "Strong means having power. Weak is the opposite.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0016",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Find the antonym for \"Open\"",
    "options": [
      "Unlocked",
      "Closed",
      "Accessible",
      "Free"
    ],
    "correct_option": "B",
    "explanation": "Open means not shut. Closed is the opposite.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0017",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Antonym for \"Old\"",
    "options": [
      "Ancient",
      "New",
      "Aged",
      "Vintage"
    ],
    "correct_option": "B",
    "explanation": "Old means having existed for a long time. New is the opposite.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0018",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Choose the antonym for \"Rich\"",
    "options": [
      "Wealthy",
      "Poor",
      "Affluent",
      "Prosperous"
    ],
    "correct_option": "B",
    "explanation": "Rich means having wealth. Poor is the opposite.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0019",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Antonym for \"Tall\"",
    "options": [
      "High",
      "Short",
      "Long",
      "Elevated"
    ],
    "correct_option": "B",
    "explanation": "Tall means having great height. Short is the opposite.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-antonyms-0020",
    "category": "Verbal",
    "topic": "Antonyms",
    "difficulty": "basic",
    "question": "Find the antonym for \"Easy\"",
    "options": [
      "Simple",
      "Difficult",
      "Effortless",
      "Smooth"
    ],
    "correct_option": "B",
    "explanation": "Easy means not hard. Difficult is the opposite.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0021",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "She was ______ to attend the meeting due to her busy schedule.",
    "options": [
      "Able",
      "Unable",
      "Willing",
      "Eager"
    ],
    "correct_option": "B",
    "explanation": "The context suggests she couldn\u2019t attend due to busyness. Unable fits best.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0022",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "His ______ attitude made everyone feel welcome.",
    "options": [
      "Cold",
      "Friendly",
      "Rude",
      "Distant"
    ],
    "correct_option": "B",
    "explanation": "Feeling welcome implies a positive attitude. Friendly is appropriate.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0023",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "The team worked ______ to complete the project on time.",
    "options": [
      "Lazily",
      "Diligently",
      "Carelessly",
      "Slowly"
    ],
    "correct_option": "B",
    "explanation": "Completing on time suggests hard work. Diligently fits best.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0024",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "The movie was so ______ that I fell asleep.",
    "options": [
      "Exciting",
      "Boring",
      "Thrilling",
      "Engaging"
    ],
    "correct_option": "B",
    "explanation": "Falling asleep implies lack of interest. Boring is appropriate.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0025",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "He spoke with such ______ that everyone listened attentively.",
    "options": [
      "Confusion",
      "Clarity",
      "Hesitation",
      "Doubt"
    ],
    "correct_option": "B",
    "explanation": "Attentive listening suggests clear speech. Clarity fits best.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0026",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "The instructions were ______ and easy to follow.",
    "options": [
      "Vague",
      "Clear",
      "Complex",
      "Confusing"
    ],
    "correct_option": "B",
    "explanation": "Easy to follow implies simplicity. Clear is appropriate.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0027",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "She felt ______ after receiving the award.",
    "options": [
      "Sad",
      "Elated",
      "Angry",
      "Tired"
    ],
    "correct_option": "B",
    "explanation": "Receiving an award suggests happiness. Elated fits best.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0028",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "The room was ______ after the children left.",
    "options": [
      "Tidy",
      "Messy",
      "Clean",
      "Organized"
    ],
    "correct_option": "B",
    "explanation": "Children leaving often implies disorder. Messy is appropriate.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0029",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "His ______ behavior annoyed everyone.",
    "options": [
      "Polite",
      "Rude",
      "Kind",
      "Gentle"
    ],
    "correct_option": "B",
    "explanation": "Annoying suggests negative behavior. Rude fits best.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-sentence-completion-0030",
    "category": "Verbal",
    "topic": "Sentence Completion",
    "difficulty": "basic",
    "question": "The weather was ______ for a picnic.",
    "options": [
      "Terrible",
      "Perfect",
      "Cold",
      "Rainy"
    ],
    "correct_option": "B",
    "explanation": "A picnic implies good weather. Perfect is appropriate.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0031",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Identify the error: She *go* to school every day.",
    "options": [
      "go \u2192 goes",
      "None of the above",
      "Both go \u2192 goes... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Subject \"She\" (third person singular) requires \"goes.\" Error: *go*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0032",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Find the error: The boys *is* playing football.",
    "options": [
      "is \u2192 are",
      "None of the above",
      "Both is \u2192 are... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Plural subject \"boys\" requires \"are.\" Error: *is*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0033",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Spot the error: He *don\u2019t* like to read books.",
    "options": [
      "don\u2019t \u2192 doesn\u2019t",
      "None of the above",
      "Both don\u2019t \u2192 doesn\u2019t... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Third person singular \"He\" requires \"doesn\u2019t.\" Error: *don\u2019t*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0034",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Identify the error: I saw *a elephant* in the zoo.",
    "options": [
      "a \u2192 an",
      "None of the above",
      "Both a \u2192 an... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "\"Elephant\" starts with a vowel sound, so use \"an.\" Error: *a*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0035",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Find the error: She is *more taller* than her brother.",
    "options": [
      "more \u2192 remove more",
      "None of the above",
      "Both more \u2192 remove m... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Comparative \"taller\" doesn\u2019t need \"more.\" Error: *more*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0036",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Spot the error: They *was* waiting for the bus.",
    "options": [
      "was \u2192 were",
      "None of the above",
      "Both was \u2192 were... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Plural subject \"They\" requires \"were.\" Error: *was*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0037",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Identify the error: The book *is* on the tables.",
    "options": [
      "tables \u2192 table",
      "None of the above",
      "Both tables \u2192 table... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Singular \"book\" implies one table. Error: *tables*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0038",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Find the error: He *run* very fast yesterday.",
    "options": [
      "run \u2192 ran",
      "None of the above",
      "Both run \u2192 ran... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Past tense requires \"ran.\" Error: *run*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0039",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Spot the error: This is *mines* book.",
    "options": [
      "mines \u2192 mine",
      "None of the above",
      "Both mines \u2192 mine... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Possessive pronoun is \"mine,\" not \"mines.\" Error: *mines*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  },
  {
    "id": "verbal-ability-basic-spotting-errors-0040",
    "category": "Verbal",
    "topic": "Spotting Errors",
    "difficulty": "basic",
    "question": "Identify the error: We *goes* to the park on Sundays.",
    "options": [
      "goes \u2192 go",
      "None of the above",
      "Both goes \u2192 go... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Plural subject \"We\" requires \"go.\" Error: *goes*.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "VERBAL"
    ]
  }
];

export const NORMAL_COMPUTER_FUNDAMENTALS_QUESTIONS = [
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0001",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "What is the output of this C code: `int x = 5; printf(\"%d\", x++);`?",
    "options": [
      "5",
      "7",
      "2",
      "10"
    ],
    "correct_option": "A",
    "explanation": "`x++` is post-increment, so `printf` uses the current value of `x` (5), then increments `x` to 6.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0002",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In Python, what is the output of: `print(3 * \"hello\")`?",
    "options": [
      "hellohellohello",
      "None of the above",
      "Both hellohellohello... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "String repetition in Python multiplies the string: `3 * \"hello\"` produces `\"hellohellohello\"`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0003",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "What is the value of `x` after this Java code: `int x = 10; x += 5;`?",
    "options": [
      "15",
      "20",
      "12",
      "30"
    ],
    "correct_option": "A",
    "explanation": "`x += 5` is equivalent to `x = x + 5`. So, `x = 10 + 5 = 15`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0004",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In C++, what is the output of: `int a = 3, b = 4; cout << a + b;`?",
    "options": [
      "7",
      "12",
      "4",
      "14"
    ],
    "correct_option": "A",
    "explanation": "`a + b = 3 + 4 = 7`. `cout` prints `7`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0005",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "What does this Python code do: `x = [1, 2, 3]; x.append(4)`?",
    "options": [
      "Adds 4 to the list",
      "Adds 6 to the list",
      "Adds 1 to the list",
      "Adds 8 to the list"
    ],
    "correct_option": "A",
    "explanation": "`append(4)` adds `4` to the end of the list `x`. New list: `[1, 2, 3, 4]`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0006",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In C, what is the output of: `int x = 8; printf(\"%d\", x >> 1);`?",
    "options": [
      "4",
      "6",
      "1",
      "8"
    ],
    "correct_option": "A",
    "explanation": "`x >> 1` performs a right shift. `8` (binary `1000`) shifts to `0100` (4).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0007",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In Java, what is the output of: `boolean x = true; System.out.println(!x);`?",
    "options": [
      "false",
      "None of the above",
      "Both false... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "`!x` negates `true` to `false`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0008",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "What is the output of this Python code: `x = 10; y = 3; print(x // y)`?",
    "options": [
      "3",
      "5",
      "1",
      "6"
    ],
    "correct_option": "A",
    "explanation": "`//` is floor division: `10 // 3 = 3` (quotient without remainder).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0009",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In C++, what is the output of: `int x = 5; if(x > 3) cout << \"Yes\"; else cout << \"No\";`?",
    "options": [
      "Yes",
      "None of the above",
      "Both Yes... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "`x = 5 > 3`, so `if` condition is true. Prints `Yes`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0010",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In Python, what is the output of: `for i in range(3): print(i)`?",
    "options": [
      "0 1 2",
      "2 1 2",
      "1 1 2",
      "30 1 2"
    ],
    "correct_option": "A",
    "explanation": "`range(3)` generates `0, 1, 2`. Loop prints each value.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0011",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In C, what is the output of: `int x = 3; printf(\"%d\", x & 1);`?",
    "options": [
      "1",
      "3",
      "2",
      "31"
    ],
    "correct_option": "A",
    "explanation": "`x & 1` performs bitwise AND. `3` (binary `11`) AND `1` (binary `01`) = `01` (1).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0012",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In Java, what is the output of: `int x = 7; System.out.println(x % 2);`?",
    "options": [
      "1",
      "3",
      "2",
      "31"
    ],
    "correct_option": "A",
    "explanation": "`%` is modulus: `7 % 2 = 1` (remainder).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0013",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In Python, what is the output of: `x = [1, 2]; x.pop(0); print(x)`?",
    "options": [
      "[2]",
      "[4]",
      "[1]",
      "[32]"
    ],
    "correct_option": "A",
    "explanation": "`pop(0)` removes the element at index `0` (1). New list: `[2]`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0014",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In C++, what is the output of: `int x = 4; cout << ++x;`?",
    "options": [
      "5",
      "7",
      "2",
      "10"
    ],
    "correct_option": "A",
    "explanation": "`++x` is pre-increment, so `x` becomes `5`, and `5` is printed.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0015",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In C, what is the output of: `int x = 5; printf(\"%d\", x | 2);`?",
    "options": [
      "7",
      "12",
      "4",
      "14"
    ],
    "correct_option": "A",
    "explanation": "`x | 2` performs bitwise OR. `5` (binary `101`) OR `2` (binary `010`) = `111` (7).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0016",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In Python, what is the output of: `x = {1, 2, 2}; print(len(x))`?",
    "options": [
      "2",
      "4",
      "1",
      "32"
    ],
    "correct_option": "A",
    "explanation": "Sets remove duplicates: `{1, 2, 2}` becomes `{1, 2}`. `len` returns `2`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0017",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In Java, what is the output of: `String s = \"Hello\"; System.out.println(s.length());`?",
    "options": [
      "5",
      "7",
      "2",
      "10"
    ],
    "correct_option": "A",
    "explanation": "`length()` returns the number of characters in `\"Hello\"`, which is `5`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0018",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In C++, what is the output of: `int x = 10; while(x > 8) { cout << x << \" \"; x--; }`?",
    "options": [
      "10 9",
      "15 9",
      "7 9",
      "20 9"
    ],
    "correct_option": "A",
    "explanation": "Loop runs while `x > 8`: prints `10`, then `9`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0019",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In Python, what is the output of: `x = 5; print(x ** 2)`?",
    "options": [
      "25",
      "30",
      "22",
      "50"
    ],
    "correct_option": "A",
    "explanation": "`**` is exponentiation: `5 ** 2 = 25`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-programming-fundamentals-0020",
    "category": "Computer_Fundamentals",
    "topic": "Programming Fundamentals",
    "difficulty": "basic",
    "question": "In C, what is the output of: `int x = 6; printf(\"%d\", x ^ 3);`?",
    "options": [
      "5",
      "7",
      "2",
      "10"
    ],
    "correct_option": "A",
    "explanation": "`x ^ 3` performs bitwise XOR. `6` (binary `110`) XOR `3` (binary `011`) = `101` (5).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0021",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the time complexity of accessing an element in an array?",
    "options": [
      "O(1)",
      "O(3)",
      "O(2)",
      "O(31)"
    ],
    "correct_option": "A",
    "explanation": "Arrays allow direct index-based access, which is constant time.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0022",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "In a singly linked list, what is the time complexity to insert a node at the beginning?",
    "options": [
      "O(1)",
      "O(3)",
      "O(2)",
      "O(31)"
    ],
    "correct_option": "A",
    "explanation": "Inserting at the head updates the head pointer, which is constant time.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0023",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the output of this Python code for a stack: `s = []; s.append(1); s.append(2); s.pop(); print(s)`?",
    "options": [
      "[1]",
      "[3]",
      "[2]",
      "[31]"
    ],
    "correct_option": "A",
    "explanation": "Stack (LIFO): `append` adds `1`, `2`. `pop` removes `2`. Stack: `[1]`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0024",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "In a queue, what is the order of elements after: enqueue(1), enqueue(2), dequeue(), enqueue(3)?",
    "options": [
      "2, 3",
      "4, 3",
      "1, 3",
      "32, 3"
    ],
    "correct_option": "A",
    "explanation": "Queue (FIFO): Enqueue `1`, `2`. Dequeue removes `1`. Enqueue `3`. Queue: `2, 3`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0025",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the time complexity of searching an element in an unsorted array of size n?",
    "options": [
      "O(n)",
      "None of the above",
      "Both O(n)... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Linear search checks each element, worst case n checks.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0026",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "In a binary tree, what is the maximum number of nodes at level k (root at level 0)?",
    "options": [
      "2^k",
      "4^k",
      "1^k",
      "32^k"
    ],
    "correct_option": "A",
    "explanation": "At level k, maximum nodes = 2^k.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0027",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the output of this Python code for a list: `x = [1, 2, 3]; x.insert(1, 4); print(x)`?",
    "options": [
      "[1, 4, 2, 3]",
      "[3, 4, 2, 3]",
      "[2, 4, 2, 3]",
      "[31, 4, 2, 3]"
    ],
    "correct_option": "A",
    "explanation": "`insert(1, 4)` adds `4` at index `1`. New list: `[1, 4, 2, 3]`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0028",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the time complexity of inserting an element at the end of a dynamic array (amortized)?",
    "options": [
      "O(1)",
      "O(3)",
      "O(2)",
      "O(31)"
    ],
    "correct_option": "A",
    "explanation": "Appending to a dynamic array is O(1) amortized, as resizing is rare.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0029",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "In a circular queue with size 5, after enqueue(1, 2, 3), dequeue(), enqueue(4), what is the front element?",
    "options": [
      "2",
      "4",
      "1",
      "32"
    ],
    "correct_option": "A",
    "explanation": "Enqueue `1, 2, 3`. Dequeue removes `1`. Enqueue `4`. Front: `2`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0030",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the height of a binary tree with 7 nodes in a balanced configuration?",
    "options": [
      "2",
      "4",
      "1",
      "32"
    ],
    "correct_option": "A",
    "explanation": "Balanced binary tree: height = \u230alog\u2082(7)\u230b = 2 (levels 0, 1, 2).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0031",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "In Python, what is the output of: `d = {1: 'a', 2: 'b'}; print(d[1])`?",
    "options": [
      "a",
      "None of the above",
      "Both a... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Dictionary access by key: `d[1]` returns `'a'`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0032",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the time complexity of deleting the last node in a singly linked list with n nodes?",
    "options": [
      "O(n)",
      "None of the above",
      "Both O(n)... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Traverse to the second-to-last node to update the pointer: O(n).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0033",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "In a stack, after push(1), push(2), pop(), push(3), what is the top element?",
    "options": [
      "3",
      "5",
      "1",
      "6"
    ],
    "correct_option": "A",
    "explanation": "Stack (LIFO): Push `1`, `2`. Pop removes `2`. Push `3`. Top: `3`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0034",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the time complexity of searching in a binary search tree with n nodes (balanced)?",
    "options": [
      "O(log n)",
      "None of the above",
      "Both O(log n)... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Balanced BST search follows height, which is O(log n).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0035",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "In Python, what is the output of: `s = {1, 2, 3}; s.add(4); print(s)`?",
    "options": [
      "{1, 2, 3, 4}",
      "{3, 2, 3, 4}",
      "{2, 2, 3, 4}",
      "{31, 2, 3, 4}"
    ],
    "correct_option": "A",
    "explanation": "`add(4)` adds `4` to the set. New set: `{1, 2, 3, 4}`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0036",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the space complexity of storing a binary tree with n nodes?",
    "options": [
      "O(n)",
      "None of the above",
      "Both O(n)... and alternative",
      "Insufficient data"
    ],
    "correct_option": "A",
    "explanation": "Each node stores data and two pointers, total O(n) space.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0037",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "In a queue, after enqueue(1, 2), dequeue(), enqueue(3, 4), dequeue(), what is the front element?",
    "options": [
      "3",
      "5",
      "1",
      "6"
    ],
    "correct_option": "A",
    "explanation": "Enqueue `1, 2`. Dequeue removes `1`. Enqueue `3, 4`. Dequeue removes `2`. Front: `3`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0038",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the time complexity of inserting a key into a hash table (average case)?",
    "options": [
      "O(1)",
      "O(3)",
      "O(2)",
      "O(31)"
    ],
    "correct_option": "A",
    "explanation": "Average case with good hash function: O(1) for insertion.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0039",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "In Python, what is the output of: `x = [1, 2, 3]; x.remove(2); print(x)`?",
    "options": [
      "[1, 3]",
      "[3, 3]",
      "[2, 3]",
      "[31, 3]"
    ],
    "correct_option": "A",
    "explanation": "`remove(2)` deletes the first occurrence of `2`. New list: `[1, 3]`.",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  },
  {
    "id": "computer-fundamentals-basic-data-structures-0040",
    "category": "Computer_Fundamentals",
    "topic": "Data Structures",
    "difficulty": "basic",
    "question": "What is the maximum number of nodes in a binary tree of height h?",
    "options": [
      "2^(h+1) - 1",
      "4^(h+1) - 1",
      "1^(h+1) - 1",
      "32^(h+1) - 1"
    ],
    "correct_option": "A",
    "explanation": "Maximum nodes = 2^(h+1) - 1 (sum of nodes from level 0 to h).",
    "marks": 1,
    "negative_marks": 0.25,
    "tags": [
      "CAMPUS_PLACEMENT",
      "COMPUTER_FUNDAMENTALS"
    ]
  }
];

/**
 * Generates the standard 62-question Normal Campus Placement Assessment:
 * - 20 Aptitude Questions (Quantitative, Logical, Data Interpretation)
 * - 20 Verbal Ability Questions (English Comprehension, Grammar)
 * - 20 Computer Fundamentals Questions (Programming, CS Concepts)
 * - 2 Hands-on Coding Problems (TCS CodeVita / Infosys HackWithInfy challenges)
 * Total: 62 Questions • 120 Minutes
 */
export function getNormalPlacementTestQuestions(): LocalRoleQuestion[] {
  const shuffle = <T>(arr: T[]): T[] =>
    (JSON.parse(JSON.stringify(arr)) as T[]).sort(() => Math.random() - 0.5);

  const selectedApt = shuffle(NORMAL_APTITUDE_QUESTIONS).slice(0, 20);
  const selectedVer = shuffle(NORMAL_VERBAL_QUESTIONS).slice(0, 20);
  const selectedComp = shuffle(NORMAL_COMPUTER_FUNDAMENTALS_QUESTIONS).slice(0, 20);
  
  // Pick 2 coding challenges from TCS CodeVita & HackWithInfy pool
  const selectedCoding = shuffle(PLACEMENT_CODING_QUESTIONS).slice(0, 2);

  return [
    ...selectedApt,
    ...selectedVer,
    ...selectedComp,
    ...selectedCoding
  ];
}
