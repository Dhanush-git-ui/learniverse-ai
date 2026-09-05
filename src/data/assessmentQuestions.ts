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

export function getLocalQuestionsForRole(role: string) {
  const isDevOps = role.toLowerCase().includes('devops');
  const pool = isDevOps ? DEVOPS_QUESTIONS : REACT_NATIVE_QUESTIONS;
  // Deep clone and shuffle
  return JSON.parse(JSON.stringify(pool)).sort(() => Math.random() - 0.5);
}
