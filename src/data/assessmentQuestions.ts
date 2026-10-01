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

export function getLocalQuestionsForRole(role: string) {
  const r = (role || '').toLowerCase();
  let pool = REACT_NATIVE_QUESTIONS;
  if (r.includes('ai') || r.includes('artificial')) {
    pool = AI_ENGINEER_QUESTIONS;
  } else if (r.includes('backend') || r.includes('full stack') || r.includes('fullstack') || r.includes('front-end') || r.includes('frontend')) {
    pool = BACKEND_FULLSTACK_QUESTIONS;
  } else if (r.includes('devops')) {
    pool = DEVOPS_QUESTIONS;
  }
  
  const mcqs = pool.filter(q => q.category !== 'Real-World Scenarios');
  const scenarios = pool.filter(q => q.category === 'Real-World Scenarios');
  
  // Return shuffled MCQs followed by the real-world scenarios
  const shuffledMcqs = JSON.parse(JSON.stringify(mcqs)).sort(() => Math.random() - 0.5);
  return [...shuffledMcqs, ...JSON.parse(JSON.stringify(scenarios))];
}

